import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { updateSession } from "@/utils/supabase/middleware";

const mocks = vi.hoisted(() => ({ getUser: vi.fn(), create: vi.fn() }));
vi.mock("@supabase/ssr", () => ({ createServerClient: mocks.create }));
beforeEach(() => {
  vi.unstubAllEnvs();
  vi.clearAllMocks();
  mocks.create.mockReturnValue({ auth: { getUser: mocks.getUser } });
  mocks.getUser.mockResolvedValue({ data: { user: null }, error: null });
});

describe("Proteção da sessão", () => {
  it("AZ-04 libera apenas health sem depender de Auth ou sessão", async () => {
    mocks.create.mockImplementation(() => { throw new Error("Auth unavailable"); });
    const response = await updateSession(new NextRequest("http://localhost:3000/health"));
    expect(response.headers.get("location")).toBeNull();
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(mocks.create).not.toHaveBeenCalled();
  });
  it("AZ-04 não libera caminhos semelhantes à rota pública de health", async () => {
    for (const path of ["/health-extra", "/health/private", "/catalogo"]) {
      const response = await updateSession(new NextRequest(`http://localhost:3000${path}`));
      expect(response.status).toBe(307);
      expect(response.headers.get("location")).toBe("http://localhost:3000/login");
    }
  });
  it("LOGIN-03 redireciona acesso direto anônimo ao catálogo", async () => {
    const response = await updateSession(new NextRequest("http://localhost:3000/catalogo"));
    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("http://localhost:3000/login");
  });
  it("LOGIN-03 permite login e cadastro sem sessão", async () => {
    for (const page of ["login", "cadastro"]) {
      const response = await updateSession(new NextRequest(`http://localhost:3000/${page}`));
      expect(response.headers.get("location")).toBeNull();
    }
  });
  it("LOGIN-03 usuário autenticado segue do login ao catálogo", async () => {
    mocks.getUser.mockResolvedValue({ data: { user: { id: "test" } }, error: null });
    const response = await updateSession(new NextRequest("http://localhost:3000/login"));
    expect(response.headers.get("location")).toBe("http://localhost:3000/catalogo");
  });
  it("LOGIN-02 configura cookie httpOnly e desabilita cache de sessão", async () => {
    const response = await updateSession(new NextRequest("http://localhost:3000/login"));
    expect(mocks.create.mock.calls[0][2].cookieOptions).toMatchObject({ httpOnly: true, sameSite: "lax", path: "/" });
    expect(response.headers.get("Cache-Control")).toContain("no-store");
  });
  it("LOGIN-02 exige cookie secure em produção", async () => {
    vi.stubEnv("NODE_ENV", "production");
    await updateSession(new NextRequest("https://app.example/login"));
    expect(mocks.create.mock.calls[0][2].cookieOptions).toMatchObject({ secure: true, httpOnly: true });
    vi.unstubAllEnvs();
  });
  it("LOGIN-03 bloqueia sessão quando provedor retorna erro", async () => {
    mocks.getUser.mockResolvedValue({ data: { user: { id: "test" } }, error: new Error("provider") });
    const response = await updateSession(new NextRequest("http://localhost:3000/catalogo"));
    expect(response.headers.get("location")).toBe("http://localhost:3000/login");
  });
  it("LOGIN-03 bloqueia acesso quando a consulta ao provedor lança erro de rede", async () => {
    mocks.getUser.mockRejectedValue(new Error("network"));
    const response = await updateSession(new NextRequest("http://localhost:3000/catalogo"));
    expect(response.headers.get("location")).toBe("http://localhost:3000/login");
  });
});
