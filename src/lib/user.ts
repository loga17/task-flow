import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import type { User } from "@prisma/client";

/**
 * ============================================
 * Synchronisation Clerk ↔ Prisma
 * ============================================
 * Récupère l'utilisateur Clerk connecté et s'assure qu'il existe
 * dans notre base de données Prisma. Si non, il est créé.
 *
 * Retourne :
 * - L'utilisateur Prisma (créé ou existant)
 * - null si aucun utilisateur n'est connecté
 */

export async function getOrCreateUser(): Promise<User | null> {
  // 1. Récupérer l'utilisateur Clerk connecté
  const clerkUser = await currentUser();

  // Si aucun utilisateur n'est connecté, retourner null
  if (!clerkUser) {
    return null;
  }

  // 2. Extraire les informations utiles
  const clerkId = clerkUser.id;
  const email = clerkUser.emailAddresses[0]?.emailAddress || "";
  const name =
    `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() ||
    clerkUser.username ||
    email.split("@")[0] ||
    "Utilisateur";
  const avatarUrl = clerkUser.imageUrl || null;

  // 3. Vérifier si l'utilisateur existe déjà en base
  const existingUser = await prisma.user.findUnique({
    where: { clerkId },
  });

  // 4. Si l'utilisateur existe, le retourner
  if (existingUser) {
    return existingUser;
  }

  // 5. Sinon, le créer dans la base
  const newUser = await prisma.user.create({
    data: {
      clerkId,
      email,
      name,
      avatarUrl,
    },
  });

  return newUser;
}