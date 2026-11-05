import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/trpc/[trpc]/route";

const mocks = vi.hoisted(() => ({ handler: vi.fn() }));
vi.mock("@trpc/server/adapters/fetch", () => ({ fetchRequestHandler: mocks.handler }));
beforeEach(() => {
  vi.clearAllMocks();
  mocks.handler.mockResolvedValue(new Response("{}"));
});

describe("Origem das mutações de autenticação", () => {
  it("LOGIN-02 aceita a origem pública mesmo com hostname interno normalizado pelo Next", async () => {
    const response = await POST(new Request("http://localhost:3100/api/trpc/auth.login", {
      method: "POST", headers: { host: "127.0.0.1:3100", origin: "http://127.0.0.1:3100" },
    }));
    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toContain("no-store");
    expect(mocks.handler).toHaveBeenCalledOnce();
  });
  it("LOGIN-02 recusa origem externa antes de processar credenciais", async () => {
    const response = await POST(new Request("http://localhost:3100/api/trpc/auth.login", {
      method: "POST", headers: { host: "localhost:3100", origin: "https://external.example" },
    }));
    expect(response.status).toBe(403);
    expect(mocks.handler).not.toHaveBeenCalled();
  });
});
