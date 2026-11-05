import { initTRPC } from "@trpc/server";
import { getDatabase } from "@/src/server/db";

const t = initTRPC.create();

export const healthRouter = t.router({
  check: t.procedure.query(async () => {
    try {
      await getDatabase().$queryRaw`SELECT 1`;
      return { status: "ok", database: "up" } as const;
    } catch {
      return { status: "error", database: "down" } as const;
    }
  }),
});
