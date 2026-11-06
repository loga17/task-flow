import { PrismaClient } from "@prisma/client";

/**
 * ============================================
 * Singleton du client Prisma
 * ============================================
 * En développement, Next.js recharge les modules à chaque modification
 * (Hot Reload). Sans singleton, chaque rechargement créerait une nouvelle
 * instance de PrismaClient, épuisant le pool de connexions.
 *
 * On stocke donc l'instance dans `globalThis`, qui persiste entre les
 * rechargements. En production, une seule instance est créée.
 */

const prismaClientSingleton = () => {
  return new PrismaClient();
};

// Type pour la variable globale
declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

// Utilise l'instance existante ou en crée une nouvelle
const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

// En développement uniquement, on stocke l'instance dans globalThis
if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma;
}