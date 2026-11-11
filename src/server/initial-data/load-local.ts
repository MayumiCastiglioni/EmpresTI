import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { initialEquipment, preflightEquipment, validImage, type PreflightReport } from "./preflight";

export type PrerequisiteCheck = (tenantId: string) => Promise<boolean>;

// Internal local adapter only; no API/CLI exposes this incomplete loading workflow.
// The caller must verify real photo bytes/review/Storage and the professor account.
export async function loadLocalEquipment(connectionString: string, photos: unknown, checkPrerequisites: PrerequisiteCheck): Promise<PreflightReport> {
  const url = new URL(connectionString);
  if (!["postgres:", "postgresql:"].includes(url.protocol) || !["localhost", "127.0.0.1", "[::1]"].includes(url.hostname) || url.searchParams.has("host") || url.searchParams.has("hostaddr")) throw new Error("Carga permitida somente em Postgres local");
  const snapshot: unknown = structuredClone(photos);
  const preliminary = preflightEquipment(snapshot, []);
  if (preliminary.status === "blocked") return preliminary;
  const db = new PrismaClient({ adapter: new PrismaPg({ connectionString, max: 1, connectionTimeoutMillis: 3000 }), log: [] });
  try {
    return await db.$transaction(async tx => {
      // One-time seed: block concurrent inventory/membership/loan changes while rechecking.
      await tx.$executeRawUnsafe('LOCK TABLE "tenants", "equipment", "memberships", "loans" IN SHARE ROW EXCLUSIVE MODE');
      const tenant = await tx.tenant.findUnique({ where: { slug: "empresti" } });
      if (!tenant || tenant.name !== "EmpresTI") return blocked("organization");
      const current = await tx.equipment.findMany({ where: { tenantId: tenant.id } });
      const report = preflightEquipment(snapshot, current);
      if (report.status === "blocked") return report;
      if (!await checkPrerequisites(tenant.id)) return blocked("prerequisites");
      if (typeof snapshot !== "object" || snapshot === null || Array.isArray(snapshot)) return blocked("photos");
      const photoMap = snapshot as Record<string, unknown>;
      for (const [assetTag, name, category, status] of initialEquipment) {
        if (!report.create.includes(assetTag)) continue;
        const image = photoMap[assetTag];
        if (!validImage(image, assetTag)) throw new Error("Imagem alterada durante a carga");
        await tx.equipment.create({ data: { tenantId: tenant.id, assetTag, name, category, status, image } });
      }
      return report;
    }, { maxWait: 10000, timeout: 15000 });
  } finally { await db.$disconnect(); }
}
function blocked(field: string): PreflightReport {
  return { status: "blocked", create: [], reuse: [], issues: [{ assetTag: "lote", field }] };
}
