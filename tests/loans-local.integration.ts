import { randomUUID } from "node:crypto";
import { config } from "dotenv";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { AuthSessionMissingError, createClient, type User } from "@supabase/supabase-js";
import { afterAll, beforeAll, describe, expect, test, vi } from "vitest";
import { createInventoryRouter } from "../src/server/api/inventory";
import { getDatabase } from "../src/server/db";
import { withAuthenticatedRls } from "../src/server/db/rls";
import { calculateLoanDueAt, createBrazilCalendar } from "../src/server/loans/calendar";
import { LoanServiceError, requestLoan } from "../src/server/loans/service";

config({ path: ".env.local", quiet: true });

const tenantId = randomUUID();
const otherTenantId = randomUUID();
const tenantSlug = `fixture-emprestimo-${randomUUID()}`;
const otherTenantSlug = `fixture-outro-${randomUUID()}`;
const borrowerId = randomUUID();
const coworkerId = randomUUID();
const router = createInventoryRouter(tenantSlug);
let database: ReturnType<typeof getDatabase> | undefined;
let requestDbA: PrismaClient | undefined;
let requestDbB: PrismaClient | undefined;

function makeContext(userId: string) {
  const user: User = {
    id: userId,
    aud: "authenticated",
    created_at: "2026-11-10T00:00:00Z",
    app_metadata: {},
    user_metadata: {},
  };
  const supabase = createClient("http://127.0.0.1:54321", "synthetic-test-key", {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  vi.spyOn(supabase.auth, "getUser").mockResolvedValue({ data: { user }, error: null });
  return { supabase };
}

function makeAnonymousContext() {
  const supabase = createClient("http://127.0.0.1:54321", "synthetic-test-key", {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  vi.spyOn(supabase.auth, "getUser").mockResolvedValue({
    data: { user: null },
    error: new AuthSessionMissingError(),
  });
  return { supabase };
}

function assertLocalDatabase() {
  const value = process.env.DATABASE_URL;
  if (!value) throw new Error("Configure DATABASE_URL para Postgres local em .env.local.");
  const url = new URL(value);
  if (!["postgres:", "postgresql:"].includes(url.protocol) ||
      !["localhost", "127.0.0.1", "[::1]"].includes(url.hostname) ||
      url.searchParams.has("host") || url.searchParams.has("hostaddr")) {
    throw new Error("Integração de empréstimos permitida somente contra Postgres local.");
  }
  return value;
}

async function addEquipment(
  tenant: string,
  tag: string,
  status: "DISPONIVEL" | "MANUTENCAO" = "DISPONIVEL",
) {
  if (!database) throw new Error("Banco local não inicializado.");
  return database.equipment.create({
    data: {
      tenantId: tenant,
      assetTag: tag,
      name: `Equipamento ${tag}`,
      category: "teste",
      status,
    },
  });
}

async function seedActiveLoan(input: {
  tenant: string;
  borrower: string;
  equipmentId: string;
  overdue?: boolean;
}) {
  if (!database) throw new Error("Banco local não inicializado.");
  const now = Date.now();
  const requestedAt = new Date(now - 2 * 86400000);
  const dueAt = new Date(now + (input.overdue ? -86400000 : 14 * 86400000));
  return database.loan.create({
    data: {
      tenantId: input.tenant,
      borrowerId: input.borrower,
      equipmentId: input.equipmentId,
      status: "RETIRADO",
      requestedAt,
      checkedOutAt: requestedAt,
      dueAt,
    },
  });
}

beforeAll(async () => {
  const connectionString = assertLocalDatabase();
  database = getDatabase();
  const adapterOptions = {
    connectionString,
    max: 1,
    connectionTimeoutMillis: 2000,
    statement_timeout: 10000,
    idleTimeoutMillis: 10000,
    allowExitOnIdle: true,
  };
  requestDbA = new PrismaClient({ adapter: new PrismaPg(adapterOptions), log: [] });
  requestDbB = new PrismaClient({ adapter: new PrismaPg(adapterOptions), log: [] });

  await database.$transaction(async (tx) => {
    await tx.tenant.create({ data: { id: tenantId, slug: tenantSlug, name: "Fixture integração empréstimos" } });
    await tx.membership.createMany({
      data: [
        { tenantId, userId: borrowerId, role: "COLABORADOR" },
        { tenantId, userId: coworkerId, role: "COLABORADOR" },
      ],
    });
    await tx.tenant.create({ data: { id: otherTenantId, slug: otherTenantSlug, name: "Fixture outro tenant" } });
  });
});

afterAll(async () => {
  try {
    if (database) {
      await database.loan.deleteMany({ where: { tenantId: { in: [tenantId, otherTenantId] } } });
      await database.tenant.deleteMany({ where: { id: { in: [tenantId, otherTenantId] } } });
    }
  } finally {
    await Promise.allSettled([requestDbA?.$disconnect(), requestDbB?.$disconnect()]);
    if (database) await database.$disconnect();
  }
});

describe("EMP-T05/06 — serviço e procedures de empréstimo no Postgres local", () => {
  test("EMP-01 lista só o catálogo do tenant vinculado e os próprios empréstimos", async () => {
    const available = await addEquipment(tenantId, `TI-${randomUUID()}`);
    await addEquipment(tenantId, `TI-${randomUUID()}`, "MANUTENCAO");
    const foreign = await addEquipment(otherTenantId, `TI-${randomUUID()}`);
    const coworkerEquipment = await addEquipment(tenantId, `TI-${randomUUID()}`);
    const coworkerLoan = await seedActiveLoan({ tenant: tenantId, borrower: coworkerId, equipmentId: coworkerEquipment.id });
    const ownEquipment = await addEquipment(tenantId, `TI-${randomUUID()}`);
    const ownLoan = await seedActiveLoan({ tenant: tenantId, borrower: borrowerId, equipmentId: ownEquipment.id });
    const caller = router.createCaller(makeContext(borrowerId));

    const catalog = await caller.catalog.list();
    expect(catalog.map((item) => item.id)).toContain(available.id);
    expect(catalog.map((item) => item.id)).not.toContain(foreign.id);
    expect(catalog.find((item) => item.status === "MANUTENCAO")).toBeDefined();
    await expect(caller.loans.mine()).resolves.toContainEqual(expect.objectContaining({
      id: ownLoan.id,
      equipment: expect.objectContaining({ id: ownEquipment.id }),
    }));
    await expect(router.createCaller(makeContext(coworkerId)).loans.mine()).resolves.toContainEqual(expect.objectContaining({
      id: coworkerLoan.id,
      equipment: expect.objectContaining({ id: coworkerEquipment.id }),
    }));

    await expect(router.createCaller(makeContext(randomUUID())).catalog.list()).rejects.toMatchObject({
      code: "FORBIDDEN",
    });
    await expect(router.createCaller(makeContext(randomUUID())).loans.mine()).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(router.createCaller(makeAnonymousContext()).catalog.list()).rejects.toMatchObject({ code: "UNAUTHORIZED" });

    await withAuthenticatedRls(database!, borrowerId, async (transaction) => {
      const equipmentVisibleToRole = await transaction.equipment.findMany({ select: { id: true } });
      const loansVisibleToRole = await transaction.loan.findMany({ where: { tenantId }, select: { id: true } });
      expect(equipmentVisibleToRole.map((item) => item.id)).toContain(available.id);
      expect(equipmentVisibleToRole.map((item) => item.id)).not.toContain(foreign.id);
      expect(loansVisibleToRole.map((loan) => loan.id)).toEqual([ownLoan.id]);
      expect(loansVisibleToRole.map((loan) => loan.id)).not.toContain(coworkerLoan.id);
    });
  });

  test("EMP-02 cria imediatamente, usa identidade do servidor e atualiza equipamento na mesma transação", async () => {
    const equipment = await addEquipment(tenantId, `TI-${randomUUID()}`);
    const caller = router.createCaller(makeContext(borrowerId));
    const result = await caller.loans.request({ equipmentId: equipment.id });

    expect(result.status).toBe("RETIRADO");
    expect(result.checkedOutAt).toBe(result.requestedAt);
    expect(new Date(result.dueAt).getTime()).toBeGreaterThan(new Date(result.requestedAt).getTime());
    expect(result.dueAt).toBe(calculateLoanDueAt(new Date(result.requestedAt), createBrazilCalendar()).toISOString());
    await expect(database!.equipment.findUniqueOrThrow({ where: { id: equipment.id } })).resolves.toMatchObject({ status: "EMPRESTADO" });
    await expect(caller.loans.mine()).resolves.toContainEqual(expect.objectContaining({
      id: result.id,
      equipment: expect.objectContaining({ id: equipment.id }),
    }));
    await expect(router.createCaller(makeContext(coworkerId)).loans.mine()).resolves.not.toContainEqual(expect.objectContaining({ id: result.id }));

    await expect(caller.loans.request({
      equipmentId: equipment.id,
      borrowerId: coworkerId,
    } as never)).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  test("EMP-02 recusa manutenção, equipamento desconhecido e novo pedido de item já emprestado", async () => {
    const maintenance = await addEquipment(tenantId, `TI-${randomUUID()}`, "MANUTENCAO");
    const available = await addEquipment(tenantId, `TI-${randomUUID()}`);
    const caller = router.createCaller(makeContext(borrowerId));

    await expect(caller.loans.request({ equipmentId: maintenance.id })).rejects.toMatchObject({ code: "CONFLICT" });
    await expect(caller.loans.request({ equipmentId: randomUUID() })).rejects.toMatchObject({ code: "CONFLICT" });
    await caller.loans.request({ equipmentId: available.id });
    await expect(caller.loans.request({ equipmentId: available.id })).rejects.toMatchObject({ code: "CONFLICT" });
  });

  test("EMP-03 bloqueia o sexto empréstimo sem alterar o equipamento pedido", async () => {
    const member = randomUUID();
    await database!.membership.create({ data: { tenantId, userId: member, role: "COLABORADOR" } });
    for (let index = 0; index < 5; index++) {
      const equipment = await addEquipment(tenantId, `LIM-${randomUUID()}`);
      await seedActiveLoan({ tenant: tenantId, borrower: member, equipmentId: equipment.id });
    }
    const sixth = await addEquipment(tenantId, `LIM-${randomUUID()}`);

    await expect(router.createCaller(makeContext(member)).loans.request({ equipmentId: sixth.id })).rejects.toMatchObject({
      code: "PRECONDITION_FAILED",
      message: "Você já tem cinco empréstimos ativos.",
    });
    await expect(database!.equipment.findUniqueOrThrow({ where: { id: sixth.id } })).resolves.toMatchObject({ status: "DISPONIVEL" });
  });

  test("EMP-04 bloqueia novo empréstimo quando a pessoa tem item vencido", async () => {
    const member = randomUUID();
    await database!.membership.create({ data: { tenantId, userId: member, role: "COLABORADOR" } });
    const overdueEquipment = await addEquipment(tenantId, `ATR-${randomUUID()}`);
    const requestedEquipment = await addEquipment(tenantId, `ATR-${randomUUID()}`);
    await seedActiveLoan({ tenant: tenantId, borrower: member, equipmentId: overdueEquipment.id, overdue: true });

    await expect(router.createCaller(makeContext(member)).loans.request({ equipmentId: requestedEquipment.id })).rejects.toMatchObject({
      code: "PRECONDITION_FAILED",
      message: "Há um empréstimo em atraso. Regularize-o antes de solicitar outro item.",
    });
    await expect(database!.equipment.findUniqueOrThrow({ where: { id: requestedEquipment.id } })).resolves.toMatchObject({ status: "DISPONIVEL" });
  });

  test("EMP-05 serializa pedidos simultâneos de itens diferentes no limite", async () => {
    if (!requestDbA || !requestDbB) throw new Error("Clientes de teste não inicializados.");
    const member = randomUUID();
    await database!.membership.create({ data: { tenantId, userId: member, role: "COLABORADOR" } });
    for (let index = 0; index < 4; index++) {
      const equipment = await addEquipment(tenantId, `CON-${randomUUID()}`);
      await seedActiveLoan({ tenant: tenantId, borrower: member, equipmentId: equipment.id });
    }
    const contenders = [
      await addEquipment(tenantId, `CON-${randomUUID()}`),
      await addEquipment(tenantId, `CON-${randomUUID()}`),
    ];
    const outcomes = await Promise.allSettled([
      requestLoan(requestDbA, { tenantId, borrowerId: member, equipmentId: contenders[0].id }),
      requestLoan(requestDbB, { tenantId, borrowerId: member, equipmentId: contenders[1].id }),
    ]);

    expect(outcomes.filter((outcome) => outcome.status === "fulfilled")).toHaveLength(1);
    const rejected = outcomes.find((outcome) => outcome.status === "rejected");
    expect(rejected).toBeDefined();
    if (rejected?.status === "rejected") expect(rejected.reason).toBeInstanceOf(LoanServiceError);
    if (rejected?.status === "rejected") expect(rejected.reason.code).toBe("LOAN_LIMIT_REACHED");
    await expect(database!.loan.count({ where: { tenantId, borrowerId: member, status: { in: ["SOLICITADO", "RETIRADO"] } } })).resolves.toBe(5);
    const finalEquipment = await database!.equipment.findMany({ where: { id: { in: contenders.map((item) => item.id) } } });
    expect(finalEquipment.filter((item) => item.status === "EMPRESTADO")).toHaveLength(1);
    expect(finalEquipment.filter((item) => item.status === "DISPONIVEL")).toHaveLength(1);
  });

  test("EMP-05 serializa dois colaboradores que pedem o mesmo equipamento", async () => {
    if (!requestDbA || !requestDbB) throw new Error("Clientes de teste não inicializados.");
    const firstBorrower = randomUUID();
    const secondBorrower = randomUUID();
    await database!.membership.createMany({
      data: [
        { tenantId, userId: firstBorrower, role: "COLABORADOR" },
        { tenantId, userId: secondBorrower, role: "COLABORADOR" },
      ],
    });
    const equipment = await addEquipment(tenantId, `DIS-${randomUUID()}`);
    const outcomes = await Promise.allSettled([
      requestLoan(requestDbA, { tenantId, borrowerId: firstBorrower, equipmentId: equipment.id }),
      requestLoan(requestDbB, { tenantId, borrowerId: secondBorrower, equipmentId: equipment.id }),
    ]);

    expect(outcomes.filter((outcome) => outcome.status === "fulfilled")).toHaveLength(1);
    const rejected = outcomes.find((outcome) => outcome.status === "rejected");
    expect(rejected).toBeDefined();
    if (rejected?.status === "rejected") expect(rejected.reason).toBeInstanceOf(LoanServiceError);
    if (rejected?.status === "rejected") expect(rejected.reason.code).toBe("EQUIPMENT_UNAVAILABLE");
    await expect(database!.loan.count({ where: { tenantId, equipmentId: equipment.id, status: "RETIRADO" } })).resolves.toBe(1);
    await expect(database!.equipment.findUniqueOrThrow({ where: { id: equipment.id } })).resolves.toMatchObject({ status: "EMPRESTADO" });
  });

  test("EMP-10 desfaz a mudança do equipamento quando a criação falha após o trigger", async () => {
    const equipment = await addEquipment(tenantId, `ROLL-${randomUUID()}`);
    const failAfterInsertDatabase = {
      $transaction: (callback: (tx: unknown) => Promise<unknown>) => database!.$transaction(async (tx) => {
        const loanDelegate = new Proxy(tx.loan, {
          get(target, property) {
            if (property === "create") {
              return async (args: Parameters<typeof target.create>[0]) => {
                await target.create(args);
                throw new Error("falha sintética após inserção");
              };
            }
            const value = Reflect.get(target, property, target) as unknown;
            return typeof value === "function" ? value.bind(target) : value;
          },
        });
        const failingTransaction = new Proxy(tx, {
          get(target, property) {
            if (property === "loan") return loanDelegate;
            const value = Reflect.get(target, property, target) as unknown;
            return typeof value === "function" ? value.bind(target) : value;
          },
        });
        return callback(failingTransaction);
      }),
    } as unknown as Pick<PrismaClient, "$transaction">;

    await expect(requestLoan(failAfterInsertDatabase, {
      tenantId,
      borrowerId,
      equipmentId: equipment.id,
    })).rejects.toThrow("falha sintética após inserção");
    await expect(database!.loan.count({ where: { tenantId, equipmentId: equipment.id } })).resolves.toBe(0);
    await expect(database!.equipment.findUniqueOrThrow({ where: { id: equipment.id } })).resolves.toMatchObject({ status: "DISPONIVEL" });
  });
});
