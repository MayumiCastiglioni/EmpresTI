import { initTRPC, TRPCError } from "@trpc/server";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { getDatabase } from "@/src/server/db";

export type AuthContext = { supabase: SupabaseClient };

export const t = initTRPC.context<AuthContext>().create();

export const protectedMiddleware = t.middleware(async ({ ctx, next }) => {
  let result: Awaited<ReturnType<typeof ctx.supabase.auth.getUser>>;

  try {
    result = await ctx.supabase.auth.getUser();
  } catch {
    throw new TRPCError({
      code: "SERVICE_UNAVAILABLE",
      message: "Não foi possível verificar sua sessão agora. Tente novamente.",
    });
  }

  if (result.error) {
    const status = result.error.status;
    if (status !== 400 && status !== 401 && status !== 403) {
      throw new TRPCError({
        code: "SERVICE_UNAVAILABLE",
        message: "Não foi possível verificar sua sessão agora. Tente novamente.",
      });
    }

    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Entre na sua conta para continuar.",
    });
  }

  const user: User | null = result.data.user;
  if (!user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Entre na sua conta para continuar.",
    });
  }

  return next({ ctx: { ...ctx, user } });
});

export const protectedProcedure = t.procedure.use(protectedMiddleware);

export function createTenantProcedure(tenantSlug: string) {
  return protectedProcedure.use(async ({ ctx, next }) => {
    let membership;

    try {
      membership = await getDatabase().membership.findFirst({
        where: {
          userId: ctx.user.id,
          tenant: { slug: tenantSlug },
        },
        select: { tenantId: true, role: true },
      });
    } catch {
      throw new TRPCError({
        code: "SERVICE_UNAVAILABLE",
        message: "Não foi possível verificar seu acesso agora. Tente novamente.",
      });
    }

    if (!membership) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Sua conta não tem acesso à organização EmpresTI.",
      });
    }

    return next({
      ctx: {
        ...ctx,
        tenantId: membership.tenantId,
        membershipRole: membership.role,
      },
    });
  });
}

export const tenantProcedure = createTenantProcedure("empresti");
