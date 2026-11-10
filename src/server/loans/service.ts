import type { EquipmentStatus, PrismaClient } from "@prisma/client";
import { calculateLoanDueAt, createBrazilCalendar, isLoanOverdue, type LoanCalendar } from "./calendar";

export type LoanRequestFailure =
  | "CALENDAR_UNAVAILABLE"
  | "EQUIPMENT_UNAVAILABLE"
  | "LOAN_LIMIT_REACHED"
  | "BORROWER_OVERDUE";

export class LoanServiceError extends Error {
  constructor(readonly code: LoanRequestFailure) {
    super(code);
    this.name = "LoanServiceError";
  }
}

type RequestLoanInput = {
  tenantId: string;
  borrowerId: string;
  equipmentId: string;
};

type LoanServiceOptions = {
  now?: () => Date;
  calendar?: LoanCalendar;
};

const ACTIVE_STATUSES = ["SOLICITADO", "RETIRADO"] as const;

export async function requestLoan(
  database: Pick<PrismaClient, "$transaction">,
  input: RequestLoanInput,
  options: LoanServiceOptions = {},
) {
  const now = options.now ?? (() => new Date());
  const calendar = options.calendar ?? createBrazilCalendar();
  const requestedAt = now();

  let dueAt: Date;
  try {
    dueAt = calculateLoanDueAt(requestedAt, calendar);
  } catch {
    throw new LoanServiceError("CALENDAR_UNAVAILABLE");
  }

  return database.$transaction(async (tx) => {
    const borrowerLockKey = `${input.tenantId}:${input.borrowerId}`;
    await tx.$queryRaw<Array<{ locked: boolean }>>`
      WITH borrower_lock AS MATERIALIZED (
        SELECT pg_advisory_xact_lock(hashtextextended(${borrowerLockKey}, 0))
      )
      SELECT TRUE AS locked FROM borrower_lock
    `;

    const matchingEquipment = await tx.$queryRaw<Array<{
      id: string;
      status: EquipmentStatus;
    }>>`
      SELECT "id", "status"
      FROM public."equipment"
      WHERE "id" = ${input.equipmentId}::uuid
        AND "tenant_id" = ${input.tenantId}::uuid
      FOR UPDATE
    `;

    const equipment = matchingEquipment[0];
    if (!equipment || equipment.status !== "DISPONIVEL") {
      throw new LoanServiceError("EQUIPMENT_UNAVAILABLE");
    }

    const activeLoans = await tx.loan.findMany({
      where: {
        tenantId: input.tenantId,
        borrowerId: input.borrowerId,
        status: { in: [...ACTIVE_STATUSES] },
      },
      select: { dueAt: true },
    });

    if (activeLoans.length >= 5) {
      throw new LoanServiceError("LOAN_LIMIT_REACHED");
    }

    const checkedAt = now();
    if (activeLoans.some((loan) => isLoanOverdue(loan.dueAt, checkedAt))) {
      throw new LoanServiceError("BORROWER_OVERDUE");
    }

    return tx.loan.create({
      data: {
        tenantId: input.tenantId,
        borrowerId: input.borrowerId,
        equipmentId: input.equipmentId,
        status: "RETIRADO",
        requestedAt,
        checkedOutAt: requestedAt,
        dueAt,
      },
      select: {
        id: true,
        status: true,
        requestedAt: true,
        checkedOutAt: true,
        dueAt: true,
      },
    });
  });
}
