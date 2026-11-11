import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const databaseState = globalThis as unknown as { localPrisma?: PrismaClient };

export function databaseConnectionString(environment: NodeJS.ProcessEnv = process.env) {
  const connectionString = environment.DATABASE_URL;
  if (!connectionString) throw new Error("Configure DATABASE_URL no servidor.");

  let url: URL;
  try {
    url = new URL(connectionString);
  } catch {
    throw new Error("DATABASE_URL inválida.");
  }
  const local = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
  const supabase = /^(?:db\.[a-z0-9-]+\.supabase\.co|[a-z0-9-]+\.pooler\.supabase\.com)$/.test(url.hostname);
  const overridesHost = [...url.searchParams.keys()].some((key) => ["host", "hostaddr"].includes(key.toLowerCase()));
  if (!["postgres:", "postgresql:"].includes(url.protocol) || overridesHost ||
      (!local && !(environment.NODE_ENV === "production" && supabase))) {
    throw new Error("Destino de banco não permitido neste ambiente.");
  }
  return connectionString;
}

export function getDatabase() {
  const connectionString = databaseConnectionString();

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
