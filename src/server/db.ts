import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const databaseState = globalThis as unknown as { localPrisma?: PrismaClient };

export function getDatabase() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("Configure DATABASE_URL para o banco local.");

  const url = new URL(connectionString);
  if (!["postgres:", "postgresql:"].includes(url.protocol) ||
      !["localhost", "127.0.0.1", "[::1]"].includes(url.hostname) ||
      url.searchParams.has("host") || url.searchParams.has("hostaddr")) {
    throw new Error("Esta etapa permite somente Postgres local.");
  }

  if (!databaseState.localPrisma) {
    const adapter = new PrismaPg({
      connectionString,
      max: 1,
      connectionTimeoutMillis: 2000,
      statement_timeout: 2000,
      idleTimeoutMillis: 10000,
      allowExitOnIdle: true,
    });
    databaseState.localPrisma = new PrismaClient({ adapter, log: [] });
  }
  return databaseState.localPrisma;
}
