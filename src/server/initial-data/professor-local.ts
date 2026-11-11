import { createClient } from "@supabase/supabase-js";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

export type ProfessorLocalInput = {
  connectionString: string; supabaseUrl: string; serviceRoleKey: string;
  userId: string; expectedEmail: string;
};
export type ProfessorResult = { status: "created-link" | "reused-link" | "awaiting-email-confirmation" | "blocked"; reason?: string };

// Internal operator tool, never a public route. Auth is read-only here.
export async function provisionLocalProfessor(input: ProfessorLocalInput): Promise<ProfessorResult> {
  const pgUrl = new URL(input.connectionString), authUrl = new URL(input.supabaseUrl);
  const local = (hostname: string) => ["localhost", "127.0.0.1", "[::1]"].includes(hostname);
  if (!["postgres:", "postgresql:"].includes(pgUrl.protocol) || !local(pgUrl.hostname) || pgUrl.searchParams.has("host") || pgUrl.searchParams.has("hostaddr") ||
    !["http:", "https:"].includes(authUrl.protocol) || !local(authUrl.hostname) || authUrl.username || authUrl.password || authUrl.search || authUrl.hash) throw new Error("Provisionamento permitido somente local");
  if (!input.userId || !input.expectedEmail.trim() || !input.serviceRoleKey) return { status: "blocked", reason: "missing-input" };
  const auth = createClient(input.supabaseUrl, input.serviceRoleKey, { auth: { persistSession: false, autoRefreshToken: false } });
  const { data, error } = await auth.auth.admin.getUserById(input.userId);
  if (error || !data.user) return { status: "blocked", reason: "account-unavailable" };
  if (data.user.email?.toLowerCase() !== input.expectedEmail.trim().toLowerCase()) return { status: "blocked", reason: "identity-mismatch" };
  if (!data.user.email_confirmed_at) return { status: "awaiting-email-confirmation" };
  const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: input.connectionString, max: 1, connectionTimeoutMillis: 3000 }), log: [] });
  try {
    return await db.$transaction(async tx => {
      await tx.$executeRawUnsafe('LOCK TABLE "tenants", "equipment", "memberships", "loans" IN SHARE ROW EXCLUSIVE MODE');
      const tenant = await tx.tenant.findUnique({ where: { slug: "empresti" } });
      if (tenant && tenant.name !== "EmpresTI") return { status: "blocked", reason: "organization-mismatch" };
      if (await tx.loan.count({ where: { borrowerId: input.userId } })) return { status: "blocked", reason: "existing-loans" };
      const memberships = await tx.membership.findMany({ where: { userId: input.userId } });
      if (memberships.some(m => m.tenantId !== tenant?.id || m.role !== "COLABORADOR")) return { status: "blocked", reason: "membership-mismatch" };
      if (memberships.length) return { status: "reused-link" };
      const target = tenant ?? await tx.tenant.create({ data: { slug: "empresti", name: "EmpresTI" } });
      await tx.membership.create({ data: { tenantId: target.id, userId: input.userId, role: "COLABORADOR" } });
      return { status: "created-link" };
    }, { maxWait: 10000, timeout: 15000 });
  } finally { await db.$disconnect(); }
}
