import { AuthApiError, AuthSessionMissingError, createClient, type User } from "@supabase/supabase-js";
import { beforeEach, describe, expect, it, vi } from "vitest";

const prisma = vi.hoisted(() => ({ findMembership: vi.fn() }));

vi.mock("@/src/server/db", () => ({
  getDatabase: () => ({ membership: { findFirst: prisma.findMembership } }),
}));

import { protectedProcedure, tenantProcedure, t } from "@/src/server/api/trpc";

const user: User = {
  id: "11111111-1111-4111-8111-111111111111",
  aud: "authenticated",
  created_at: "2026-11-06T00:00:00Z",
  app_metadata: {},
  user_metadata: {},
};

const supabase = createClient("http://127.0.0.1:54321", "synthetic-test-key", {
  auth: { persistSession: false, autoRefreshToken: false },
});

const probeRouter = t.router({
  currentUser: protectedProcedure.query(({ ctx }) => ({ id: ctx.user.id })),
  tenant: tenantProcedure.query(({ ctx }) => ({
    id: ctx.user.id,
    tenantId: ctx.tenantId,
    role: ctx.membershipRole,
  })),
});

beforeEach(() => {
  vi.restoreAllMocks();
  prisma.findMembership.mockReset();
});

describe("EMP-T03 — sessão protegida tRPC", () => {
  it("EMP-T03 verifica a sessão no Supabase e disponibiliza apenas o usuário verificado", async () => {
    const getUser = vi.spyOn(supabase.auth, "getUser").mockResolvedValue({
      data: { user },
      error: null,
    });

    await expect(probeRouter.createCaller({ supabase }).currentUser()).resolves.toEqual({ id: user.id });
    expect(getUser).toHaveBeenCalledOnce();
  });

  it("EMP-T03 recusa sessão ausente sem executar o procedimento", async () => {
    const getUser = vi.spyOn(supabase.auth, "getUser").mockResolvedValue({
      data: { user: null },
      error: new AuthSessionMissingError(),
    });

    await expect(probeRouter.createCaller({ supabase }).currentUser()).rejects.toMatchObject({
      code: "UNAUTHORIZED",
      message: "Entre na sua conta para continuar.",
    });
    expect(getUser).toHaveBeenCalledOnce();
  });

  it("EMP-T03 trata sessão inválida como não autenticada sem expor mensagem do provedor", async () => {
    vi.spyOn(supabase.auth, "getUser").mockResolvedValue({
      data: { user: null },
      error: new AuthApiError("detalhe interno do provedor", 401, "invalid_token"),
    });

    await expect(probeRouter.createCaller({ supabase }).currentUser()).rejects.toMatchObject({
      code: "UNAUTHORIZED",
      message: "Entre na sua conta para continuar.",
    });
  });

  it("EMP-T03 falha fechada com indisponibilidade do provedor sem expor detalhes", async () => {
    vi.spyOn(supabase.auth, "getUser").mockResolvedValue({
      data: { user: null },
      error: new AuthApiError("detalhe interno do provedor", 503, "unexpected_failure"),
    });

    await expect(probeRouter.createCaller({ supabase }).currentUser()).rejects.toMatchObject({
      code: "SERVICE_UNAVAILABLE",
      message: "Não foi possível verificar sua sessão agora. Tente novamente.",
    });
  });

  it("EMP-T03 transforma falha de rede lançada em indisponibilidade genérica", async () => {
    vi.spyOn(supabase.auth, "getUser").mockRejectedValue(new Error("private transport detail"));

    await expect(probeRouter.createCaller({ supabase }).currentUser()).rejects.toMatchObject({
      code: "SERVICE_UNAVAILABLE",
      message: "Não foi possível verificar sua sessão agora. Tente novamente.",
    });
  });

  it("EMP-T03 entrega tenant e papel somente após localizar vínculo do usuário verificado", async () => {
    prisma.findMembership.mockResolvedValue({ tenantId: "22222222-2222-4222-8222-222222222222", role: "COLABORADOR" });
    vi.spyOn(supabase.auth, "getUser").mockResolvedValue({ data: { user }, error: null });

    await expect(probeRouter.createCaller({ supabase }).tenant()).resolves.toEqual({
      id: user.id,
      tenantId: "22222222-2222-4222-8222-222222222222",
      role: "COLABORADOR",
    });
    expect(prisma.findMembership).toHaveBeenCalledWith({
      where: { userId: user.id, tenant: { slug: "empresti" } },
      select: { tenantId: true, role: true },
    });
  });

  it("EMP-T03 recusa conta sem vínculo sem executar o procedimento", async () => {
    prisma.findMembership.mockResolvedValue(null);
    vi.spyOn(supabase.auth, "getUser").mockResolvedValue({ data: { user }, error: null });

    await expect(probeRouter.createCaller({ supabase }).tenant()).rejects.toMatchObject({
      code: "FORBIDDEN",
      message: "Sua conta não tem acesso à organização EmpresTI.",
    });
  });

  it("EMP-T03 falha fechada sem expor erro de banco ao verificar vínculo", async () => {
    prisma.findMembership.mockRejectedValue(new Error("private database detail"));
    vi.spyOn(supabase.auth, "getUser").mockResolvedValue({ data: { user }, error: null });

    await expect(probeRouter.createCaller({ supabase }).tenant()).rejects.toMatchObject({
      code: "SERVICE_UNAVAILABLE",
      message: "Não foi possível verificar seu acesso agora. Tente novamente.",
    });
  });
});
