"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/user";

/**
 * ============================================
 * Server Actions - Projets
 * ============================================
 */

/**
 * Crée un nouveau projet.
 * Le créateur n'est PAS automatiquement collaborateur.
 */
export async function createProject(name: string, description: string) {
  try {
    // 1. Vérifier l'authentification
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Non authentifié" };
    }

    // 2. Récupérer ou créer l'utilisateur en base
    const user = await getOrCreateUser();
    if (!user) {
      return { success: false, error: "Utilisateur introuvable" };
    }

    // 3. Valider les données
    if (!name.trim() || !description.trim()) {
      return { success: false, error: "Le nom et la description sont obligatoires" };
    }

    // 4. Créer le projet
    const project = await prisma.project.create({
      data: {
        name: name.trim(),
        description: description.trim(),
        creatorId: user.id,
      },
    });

    // 5. Rafraîchir la page "Mes projets"
    revalidatePath("/");

    return { success: true, project };
  } catch (error) {
    console.error("Erreur createProject:", error);
    return { success: false, error: "Une erreur est survenue" };
  }
}

/**
 * Supprime un projet (et toutes ses tâches grâce à onDelete: Cascade).
 */
export async function deleteProject(projectId: string) {
  try {
    // 1. Vérifier l'authentification
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Non authentifié" };
    }

    // 2. Récupérer l'utilisateur
    const user = await getOrCreateUser();
    if (!user) {
      return { success: false, error: "Utilisateur introuvable" };
    }

    // 3. Vérifier que le projet appartient à l'utilisateur
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return { success: false, error: "Projet introuvable" };
    }

    if (project.creatorId !== user.id) {
      return { success: false, error: "Vous n'êtes pas autorisé à supprimer ce projet" };
    }

    // 4. Supprimer le projet
    await prisma.project.delete({
      where: { id: projectId },
    });

    // 5. Rafraîchir
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Erreur deleteProject:", error);
    return { success: false, error: "Une erreur est survenue" };
  }
}

/**
 * Récupère tous les projets créés par l'utilisateur connecté,
 * avec leurs collaborateurs et leurs tâches.
 */
export async function getUserProjects() {
  try {
    const user = await getOrCreateUser();
    if (!user) return [];

    return await prisma.project.findMany({
      where: { creatorId: user.id },
      include: {
        collaborators: { select: { id: true } },
        tasks: { select: { status: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Erreur getUserProjects:", error);
    return [];
  }
}


/**
 * ============================================
 * Server Actions - Collaborations
 * ============================================
 */

/**
 * Permet à l'utilisateur connecté de rejoindre un projet via un code d'invitation.
 * Le créateur du projet n'est PAS automatiquement collaborateur (règle métier).
 */
export async function joinProject(inviteCode: string) {
  try {
    // 1. Vérifier l'authentification
    const { userId } = await auth();
    if (!userId) {
      return { success: false, error: "Non authentifié" };
    }

    // 2. Récupérer l'utilisateur Prisma
    const user = await getOrCreateUser();
    if (!user) {
      return { success: false, error: "Utilisateur introuvable" };
    }

    // 3. Valider le code d'invitation
    if (!inviteCode.trim()) {
      return { success: false, error: "Le code d'invitation est requis" };
    }

    // 4. Chercher le projet correspondant au code
    const project = await prisma.project.findUnique({
      where: { inviteCode: inviteCode.trim() },
      include: { collaborators: { select: { id: true } } },
    });

    if (!project) {
      return { success: false, error: "Code d'invitation invalide" };
    }

    // 5. Vérifier si l'utilisateur est déjà collaborateur
    const isAlreadyCollaborator = project.collaborators.some(
      (c) => c.id === user.id
    );

    if (isAlreadyCollaborator) {
      return { success: false, error: "Vous êtes déjà collaborateur de ce projet" };
    }

    // 6. Ajouter l'utilisateur comme collaborateur
    await prisma.project.update({
      where: { id: project.id },
      data: {
        collaborators: {
          connect: { id: user.id },
        },
      },
    });

    // 7. Rafraîchir la page
    revalidatePath("/collaborations");

    return { success: true, projectName: project.name };
  } catch (error) {
    console.error("Erreur joinProject:", error);
    return { success: false, error: "Une erreur est survenue" };
  }
}

/**
 * Récupère tous les projets où l'utilisateur connecté est collaborateur
 * (et non créateur).
 */
export async function getUserCollaborations() {
  try {
    const user = await getOrCreateUser();
    if (!user) return [];

    return await prisma.project.findMany({
      where: {
        collaborators: { some: { id: user.id } },
      },
      include: {
        collaborators: { select: { id: true } },
        tasks: { select: { status: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Erreur getUserCollaborations:", error);
    return [];
  }
}