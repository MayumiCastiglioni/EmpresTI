import type { Prisma, PrismaClient } from "@prisma/client";

export function withAuthenticatedRls<T>(
  database: PrismaClient,
  userId: string,
  operation: (transaction: Prisma.TransactionClient) => Promise<T>,
) {
  return database.$transaction(async (transaction) => {
    await transaction.$executeRaw`SET LOCAL ROLE authenticated`;
    await transaction.$queryRaw<Array<{ subject: string }>>`
      SELECT set_config('request.jwt.claim.sub', ${userId}, true) AS subject
    `;
    return operation(transaction);
  });
}
