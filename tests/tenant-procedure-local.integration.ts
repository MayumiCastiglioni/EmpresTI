import { randomUUID } from "node:crypto";
import { config } from "dotenv";
import { createClient, type User } from "@supabase/supabase-js";
import { afterAll, beforeAll, expect, test, vi } from "vitest";
import { createTenantProcedure, t } from "../src/server/api/trpc";
import { getDatabase } from "../src/server/db";

config({ path: ".env.local", quiet: true });

const tenantId = randomUUID();
const memberId = randomUUID();
const tenantSlug = `fixture-${randomUUID()}`;
let database: ReturnType<typeof getDatabase> | undefined;
let tenantCreated = false;

const router = t.router({
  access: createTenantProcedure(tenantSlug).query(({ ctx }) => ({
    userId: ctx.user.id,
    tenantId: ctx.tenantId,
    role: ctx.membershipRole,
  })),
});

function makeContext(userId: string) {
  const user: User = {
    id: userId,
    aud: "authenticated",
    created_at: "2026-11-07T00:00:00Z",
    app_metadata: {},
    user_metadata: {},
  };
  const supabase = createClient("http://127.0.0.1:54321", "synthetic-test-key", {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  vi.spyOn(supabase.auth, "getUser").mockResolvedValue({ data: { user }, error: null });
  return { supabase };
}

beforeAll(async () => {
  const value = process.env.DATABASE_URL;
  if (!value) throw new Error("Configure DATABASE_URL para Postgres local em .env.local.");
  const url = new URL(value);
  if (!["postgres:", "postgresql:"].includes(url.protocol) ||
      !["localhost", "127.0.0.1", "[::1]"].includes(url.hostname) ||
      url.searchParams.has("host") || url.searchParams.has("hostaddr")) {
    throw new Error("Integração de tenant permitida somente contra Postgres local.");
  }

  database = getDatabase();
  await database.$transaction(async (tx) => {
    await tx.tenant.create({ data: { id: tenantId, slug: tenantSlug, name: "Fixture EMP-T03" } });
    await tx.membership.create({ data: { tenantId, userId: memberId, role: "COLABORADOR" } });
  });
  tenantCreated = true;
});

afterAll(async () => {
  try {
    if (database && tenantCreated) await database.tenant.delete({ where: { id: tenantId } });
  } finally {
    if (database) await database.$disconnect();
  }
});

test("EMP-T03 membership Postgres local permite membro e nega usuário sem vínculo", async () => {
  expect(await router.createCaller(makeContext(memberId)).access()).toEqual({
    userId: memberId,
    tenantId,
    role: "COLABORADOR",
  });

  await expect(router.createCaller(makeContext(randomUUID())).access()).rejects.toMatchObject({
    code: "FORBIDDEN",
    message: "Sua conta não tem acesso à organização EmpresTI.",
  });
});
