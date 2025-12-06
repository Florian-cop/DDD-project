import { PrismaClient } from '@prisma/client';

/**
 * Wrapper pour exécuter des opérations dans une transaction Prisma
 * Garantit l'atomicité des opérations critiques (paiement + réservation)
 */
export async function executeInTransaction<T>(
  prisma: PrismaClient,
  callback: (tx: PrismaClient) => Promise<T>
): Promise<T> {
  return await prisma.$transaction(async (tx) => {
    return await callback(tx as PrismaClient);
  });
}
