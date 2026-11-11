import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { validImage } from "@/src/server/initial-data/preflight";
import { getDatabase } from "@/src/server/db";
import { withAuthenticatedRls } from "@/src/server/db/rls";
import { isLoanOverdue } from "@/src/server/loans/calendar";
import { LoanServiceError, requestLoan } from "@/src/server/loans/service";
import { createTenantProcedure, t } from "@/src/server/api/trpc";

function unavailable() {
  return new TRPCError({
    code: "SERVICE_UNAVAILABLE",
    message: "Não foi possível carregar os dados agora. Tente novamente.",
  });
}

function publicImage(image: unknown, assetTag: string) {
  if (!validImage(image, assetTag)) return null;
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!baseUrl) return null;

  try {
    const encodedKey = image.objectKey.split("/").map(encodeURIComponent).join("/");
    const url = new URL(
      `/storage/v1/object/public/${image.bucket}/${encodedKey}`,
      baseUrl,
    );
    return {
      url: url.toString(),
      photographer: image.photographer,
      photographerUrl: image.photographerUrl,
      sourceUrl: image.sourceUrl,
    };
  } catch {
    return null;
  }
}

function parseRequestInput(value: unknown): { equipmentId: string } {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Equipamento inválido." });
  }

  const input = value as Record<string, unknown>;
  if (
    Object.keys(input).length !== 1 ||
    typeof input.equipmentId !== "string" ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(input.equipmentId)
  ) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Equipamento inválido." });
  }

  return { equipmentId: input.equipmentId };
}

function requestError(error: unknown): TRPCError {
  if (error instanceof LoanServiceError) {
    switch (error.code) {
      case "EQUIPMENT_UNAVAILABLE":
        return new TRPCError({
          code: "CONFLICT",
          message: "Este equipamento não está mais disponível. Atualize o catálogo.",
        });
      case "LOAN_LIMIT_REACHED":
        return new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "Você já tem cinco empréstimos ativos.",
        });
      case "BORROWER_OVERDUE":
        return new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "Há um empréstimo em atraso. Regularize-o antes de solicitar outro item.",
        });
      case "CALENDAR_UNAVAILABLE":
        return new TRPCError({
          code: "SERVICE_UNAVAILABLE",
          message: "O calendário de devolução ainda não cobre esse prazo.",
        });
    }
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    return new TRPCError({
      code: "CONFLICT",
      message: "Este equipamento não está mais disponível. Atualize o catálogo.",
    });
  }

  return new TRPCError({
    code: "SERVICE_UNAVAILABLE",
    message: "Não foi possível registrar o empréstimo agora. Tente novamente.",
  });
}

export function createInventoryRouter(tenantSlug = "empresti") {
  const tenantProcedure = createTenantProcedure(tenantSlug);
  return t.router({
  catalog: t.router({
    list: tenantProcedure.query(async ({ ctx }) => {
      try {
        const equipment = await withAuthenticatedRls(getDatabase(), ctx.user.id, (transaction) =>
          transaction.equipment.findMany({
            where: { tenantId: ctx.tenantId },
            orderBy: { assetTag: "asc" },
            select: {
              id: true,
              assetTag: true,
              name: true,
              category: true,
              status: true,
              image: true,
            },
          }),
        );

        return equipment.map((item) => ({
          id: item.id,
          assetTag: item.assetTag,
          name: item.name,
          category: item.category,
          status: item.status,
          image: publicImage(item.image, item.assetTag),
        }));
      } catch {
        throw unavailable();
      }
    }),
  }),
  loans: t.router({
    mine: tenantProcedure.query(async ({ ctx }) => {
      try {
        const loans = await withAuthenticatedRls(getDatabase(), ctx.user.id, (transaction) =>
          transaction.loan.findMany({
            where: { tenantId: ctx.tenantId, borrowerId: ctx.user.id },
            orderBy: { requestedAt: "desc" },
            select: {
              id: true,
              status: true,
              requestedAt: true,
              checkedOutAt: true,
              dueAt: true,
              returnedAt: true,
              equipment: {
                select: {
                  id: true,
                  assetTag: true,
                  name: true,
                  category: true,
                  image: true,
                },
              },
            },
          }),
        );
        const now = new Date();

        return loans.map((loan) => ({
          id: loan.id,
          status: loan.status,
          requestedAt: loan.requestedAt.toISOString(),
          checkedOutAt: loan.checkedOutAt?.toISOString() ?? null,
          dueAt: loan.dueAt.toISOString(),
          returnedAt: loan.returnedAt?.toISOString() ?? null,
          isOverdue:
            (loan.status === "SOLICITADO" || loan.status === "RETIRADO") &&
            isLoanOverdue(loan.dueAt, now),
          equipment: {
            id: loan.equipment.id,
            assetTag: loan.equipment.assetTag,
            name: loan.equipment.name,
            category: loan.equipment.category,
            image: publicImage(loan.equipment.image, loan.equipment.assetTag),
          },
        }));
      } catch {
        throw unavailable();
      }
    }),
    request: tenantProcedure.input(parseRequestInput).mutation(async ({ ctx, input }) => {
      try {
        const loan = await requestLoan(getDatabase(), {
          tenantId: ctx.tenantId,
          borrowerId: ctx.user.id,
          equipmentId: input.equipmentId,
        });
        return {
          id: loan.id,
          status: loan.status,
          requestedAt: loan.requestedAt.toISOString(),
          checkedOutAt: loan.checkedOutAt?.toISOString() ?? null,
          dueAt: loan.dueAt.toISOString(),
        };
      } catch (error) {
        throw requestError(error);
      }
    }),
  }),
  });
}

export const inventoryRouter = createInventoryRouter();
