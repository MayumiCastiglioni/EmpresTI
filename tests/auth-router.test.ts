import { AuthApiError, createClient, type Session, type User } from "@supabase/supabase-js";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { appRouter } from "@/src/server/api/router";

const user: User = { id: "test-user", aud: "authenticated", created_at: "2026-10-26T00:00:00Z", app_metadata: {}, user_metadata: {} };
const session: Session = { access_token: "synthetic-access", refresh_token: "synthetic-refresh", expires_in: 3600, token_type: "bearer", user };
const supabase = createClient("http://127.0.0.1:54321", "synthetic-test-key", { auth: { persistSession: false, autoRefreshToken: false } });
const caller = appRouter.createCaller({ supabase });
beforeEach(() => vi.restoreAllMocks());

describe("Autenticação tRPC", () => {
  it("LOGIN-01 rejeita conta inexistente e senha inválida sem expor detalhes", async () => {
    vi.spyOn(supabase.auth, "signInWithPassword").mockResolvedValue({ data: { user: null, session: null }, error: new AuthApiError("provider internal details", 400, "invalid_credentials") });
    await expect(caller.auth.login({ email: "missing@example.test", password: "fixture-password" })).rejects.toMatchObject({ code: "UNAUTHORIZED", message: "E-mail ou senha inválidos." });
  });
  it("LOGIN-02 não devolve tokens do provedor ao navegador", async () => {
    vi.spyOn(supabase.auth, "signInWithPassword").mockResolvedValue({ data: { user, session }, error: null });
    expect(await caller.auth.login({ email: "member@example.test", password: "fixture-password" })).toEqual({ success: true });
  });
  it("LOGIN-05 rejeita entrada inválida antes de consultar o provedor", async () => {
    const signIn = vi.spyOn(supabase.auth, "signInWithPassword");
    await expect(caller.auth.login({ email: "invalid", password: "" })).rejects.toMatchObject({ code: "BAD_REQUEST" });
    expect(signIn).not.toHaveBeenCalled();
  });
  it("LOGIN-01 falha fechada quando o provedor está indisponível", async () => {
    vi.spyOn(supabase.auth, "signInWithPassword").mockResolvedValue({ data: { user: null, session: null }, error: new AuthApiError("internal", 503, undefined) });
    await expect(caller.auth.login({ email: "member@example.test", password: "fixture-password" })).rejects.toMatchObject({ code: "SERVICE_UNAVAILABLE" });
  });
  it("LOGIN-04 encerra a sessão atual", async () => {
    const signOut = vi.spyOn(supabase.auth, "signOut").mockResolvedValue({ error: null });
    expect(await caller.auth.logout()).toEqual({ success: true });
    expect(signOut).toHaveBeenCalledWith({ scope: "local" });
  });
  it("LOGIN-07 persiste cadastro pelo Auth e informa confirmação sem tokens", async () => {
    const signup = vi.spyOn(supabase.auth, "signUp").mockResolvedValue({ data: { user, session: null }, error: null });
    expect(await caller.auth.signup({ email: "new@example.test", password: "fixture-password" })).toEqual({ requiresConfirmation: true });
    expect(signup).toHaveBeenCalledWith({ email: "new@example.test", password: "fixture-password" });
  });
  it("LOGIN-07 rejeita senha curta antes de criar cadastro", async () => {
    const signup = vi.spyOn(supabase.auth, "signUp");
    await expect(caller.auth.signup({ email: "new@example.test", password: "123" })).rejects.toMatchObject({ code: "BAD_REQUEST" });
    expect(signup).not.toHaveBeenCalled();
  });
});
