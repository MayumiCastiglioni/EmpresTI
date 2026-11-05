import { initTRPC, TRPCError } from "@trpc/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { healthRouter } from "@/src/server/api/health";

export type AuthContext = { supabase: SupabaseClient };
const t = initTRPC.context<AuthContext>().create();

function credentials(value: unknown) {
  if (typeof value !== "object" || value === null ||
      !("email" in value) || !("password" in value) ||
      typeof value.email !== "string" || typeof value.password !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email.trim()) ||
      value.email.length > 254 || !value.password || value.password.length > 1024) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Informe e-mail e senha válidos." });
  }
  return { email: value.email.trim(), password: value.password };
}

export const appRouter = t.router({
  health: healthRouter,
  auth: t.router({
    signup: t.procedure.input(credentials).mutation(async ({ ctx, input }) => {
      if (input.password.length < 6) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Use uma senha com pelo menos 6 caracteres." });
      }
      const { data, error } = await ctx.supabase.auth.signUp(input);
      if (error) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Não foi possível criar a conta. Confira os dados ou tente novamente mais tarde." });
      }
      return { requiresConfirmation: !data.session };
    }),
    login: t.procedure.input(credentials).mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase.auth.signInWithPassword(input);
      if (error || !data.user || !data.session) {
        if (error && (error.status === undefined || error.status >= 500 || error.status === 429)) {
          throw new TRPCError({ code: "SERVICE_UNAVAILABLE", message: "Não foi possível entrar agora. Tente novamente em instantes." });
        }
        throw new TRPCError({ code: "UNAUTHORIZED", message: "E-mail ou senha inválidos." });
      }
      return { success: true as const };
    }),
    logout: t.procedure.mutation(async ({ ctx }) => {
      const { error } = await ctx.supabase.auth.signOut({ scope: "local" });
      if (error) {
        throw new TRPCError({ code: "SERVICE_UNAVAILABLE", message: "Não foi possível sair. Tente novamente." });
      }
      return { success: true as const };
    }),
  }),
});

export type AppRouter = typeof appRouter;
