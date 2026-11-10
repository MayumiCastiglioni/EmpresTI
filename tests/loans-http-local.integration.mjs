import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import dotenv from "dotenv";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";

const env = dotenv.parse(readFileSync(new URL("../.env.local", import.meta.url)));
const base = "http://127.0.0.1:3100";
const authUrl = new URL(env.NEXT_PUBLIC_SUPABASE_URL);
const databaseUrl = new URL(env.DATABASE_URL);
if (!["localhost", "127.0.0.1", "[::1]"].includes(authUrl.hostname) ||
    !["localhost", "127.0.0.1", "[::1]"].includes(databaseUrl.hostname)) {
  throw new Error("Esta integração só pode usar Supabase e Postgres locais.");
}

const admin = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const database = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: env.DATABASE_URL,
    max: 1,
    connectionTimeoutMillis: 2000,
    statement_timeout: 5000,
    idleTimeoutMillis: 10000,
    allowExitOnIdle: true,
  }),
  log: [],
});

async function query(path, cookie) {
  return fetch(`${base}/api/trpc/${path}`, {
    headers: { origin: base, ...(cookie ? { cookie } : {}) },
  });
}

async function mutation(path, input, cookie = "") {
  return fetch(`${base}/api/trpc/${path}`, {
    method: "POST",
    headers: { origin: base, "content-type": "application/json", ...(cookie ? { cookie } : {}) },
    body: JSON.stringify(input),
  });
}

async function resultData(response) {
  const body = await response.json();
  return body?.result?.data?.json ?? body?.result?.data;
}

test("EMP-01/02/08 — cookie HTTP consulta catálogo e registra empréstimo local", async () => {
  const email = `loans-http-${randomUUID()}@example.test`;
  const password = `${randomUUID()}Aa1!`;
  const assetTag = `HTTP-${randomUUID()}`;
  let userId;
  let tenantId;
  let createdTenant = false;
  let equipmentId;
  let loanId;
  let memberCreated = false;

  try {
    const tenant = await database.tenant.findUnique({ where: { slug: "empresti" } });
    if (tenant) {
      tenantId = tenant.id;
    } else {
      const created = await database.tenant.create({
        data: { slug: "empresti", name: "EmpresTI" },
      });
      tenantId = created.id;
      createdTenant = true;
    }

    const account = await admin.auth.admin.createUser({ email, password, email_confirm: true });
    assert.equal(account.error, null);
    userId = account.data.user.id;
    await database.membership.create({ data: { tenantId, userId, role: "COLABORADOR" } });
    memberCreated = true;

    const equipment = await database.equipment.create({
      data: {
        tenantId,
        assetTag,
        name: "Notebook de validação HTTP",
        category: "notebook",
        status: "DISPONIVEL",
      },
    });
    equipmentId = equipment.id;

    const login = await mutation("auth.login", { email, password });
    assert.equal(login.status, 200);
    const cookies = login.headers.getSetCookie();
    assert.ok(cookies.length > 0);
    assert.ok(cookies.every((value) => value.toLowerCase().includes("httponly")));
    const cookie = cookies.map((value) => value.split(";")[0]).join("; ");

    const catalogResponse = await query("inventory.catalog.list", cookie);
    assert.equal(catalogResponse.status, 200);
    const catalog = await resultData(catalogResponse);
    assert.ok(catalog.some((item) => item.id === equipmentId && item.status === "DISPONIVEL"));

    const initialLoansResponse = await query("inventory.loans.mine", cookie);
    assert.equal(initialLoansResponse.status, 200);
    assert.deepEqual(await resultData(initialLoansResponse), []);

    const createdResponse = await mutation("inventory.loans.request", { equipmentId }, cookie);
    assert.equal(createdResponse.status, 200);
    const createdLoan = await resultData(createdResponse);
    loanId = createdLoan.id;
    assert.equal(createdLoan.status, "RETIRADO");
    assert.equal(createdLoan.checkedOutAt, createdLoan.requestedAt);
    assert.ok(new Date(createdLoan.dueAt).getTime() > new Date(createdLoan.requestedAt).getTime());

    const finalCatalogResponse = await query("inventory.catalog.list", cookie);
    const finalCatalog = await resultData(finalCatalogResponse);
    assert.equal(finalCatalog.find((item) => item.id === equipmentId).status, "EMPRESTADO");
    const finalLoansResponse = await query("inventory.loans.mine", cookie);
    const ownLoans = await resultData(finalLoansResponse);
    assert.ok(ownLoans.some((loan) => loan.id === loanId));

    const forgedResponse = await mutation("inventory.loans.request", {
      equipmentId,
      borrowerId: randomUUID(),
    }, cookie);
    assert.ok(forgedResponse.status >= 400);
  } finally {
    if (loanId) await database.loan.deleteMany({ where: { id: loanId } });
    if (equipmentId) await database.equipment.deleteMany({ where: { id: equipmentId } });
    if (memberCreated) await database.membership.deleteMany({ where: { tenantId, userId } });
    if (createdTenant) await database.tenant.deleteMany({ where: { id: tenantId } });
    if (userId) {
      const removed = await admin.auth.admin.deleteUser(userId);
      assert.equal(removed.error, null);
    }
    await database.$disconnect();
  }
});
