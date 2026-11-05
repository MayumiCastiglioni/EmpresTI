import { beforeEach, describe, expect, it, vi } from "vitest";
import { GET } from "@/app/health/route";
import { appRouter } from "@/src/server/api/router";
import { createClient } from "@supabase/supabase-js";

const mocks = vi.hoisted(() => ({ query: vi.fn(), database: vi.fn() }));
vi.mock("@/src/server/db", () => ({ getDatabase: mocks.database }));

beforeEach(() => {
  vi.clearAllMocks();
  mocks.database.mockReturnValue({ $queryRaw: mocks.query });
  mocks.query.mockResolvedValue([{ "?column?": 1 }]);
});

describe("MIN-01 — saúde da conexão", () => {
  it("AZ-02/04 devolve 200 e corpo de sucesso após consultar o banco", async () => {
    const response = await GET();
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ status: "ok", database: "up" });
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(mocks.query).toHaveBeenCalledOnce();
    expect(mocks.query.mock.calls[0][0]).toEqual(["SELECT 1"]);
  });

  it("AZ-04 devolve 503 e corpo seguro quando o banco falha", async () => {
    mocks.query.mockRejectedValue(new Error("private database connection details"));
    const response = await GET();
    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ status: "error", database: "down" });
    expect(response.headers.get("cache-control")).toBe("no-store");
  });

  it("AZ-02 informa indisponibilidade sem consultar banco se a configuração for inválida", async () => {
    mocks.database.mockImplementation(() => { throw new Error("missing private config"); });
    const response = await GET();
    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ status: "error", database: "down" });
    expect(mocks.query).not.toHaveBeenCalled();
  });

  it("AZ-04 usa a mesma operação de saúde exposta no router da aplicação", async () => {
    const supabase = createClient("http://127.0.0.1:54321", "synthetic-test-key", {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    expect(await appRouter.createCaller({ supabase }).health.check()).toEqual({ status: "ok", database: "up" });
    expect(mocks.query).toHaveBeenCalledOnce();
  });
});
