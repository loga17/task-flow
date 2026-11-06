"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/user";

/**
 * ============================================
 * Server Actions - Tâches
 * ============================================
 */

/**
 * Récupère un projet complet (créateur, collaborateurs, tâches).
 */
export async function getProjectById(projectId: string) {
  try {
    return await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        creator: true,
        collaborators: true,
        tasks: {
          include: {
            assignee: true,
            creator: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });
  } catch (error) {
    console.error("Erreur getProjectById:", error);
    return null;
  }
}

/**
 * Récupère les tâches d'un projet selon un filtre.
 * Filtres : "ALL" | "A_FAIRE" | "EN_COURS" | "TERMINEE" | "MINE"
 */
export async function getProjectTasks(
  projectId: string,
  filter: string = "ALL"
) {
  try {
    const user = await getOrCreateUser();
    if (!user) return [];

    const where: any = { projectId };

    if (filter === "A_FAIRE" || filter === "EN_COURS" || filter === "TERMINEE") {
      where.status = filter;
    } else if (filter === "MINE") {
      where.OR = [{ assigneeId: user.id }, { creatorId: user.id }];
    }

    return await prisma.task.findMany({
      where,
      include: {
        assignee: true,
        creator: true,
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Erreur getProjectTasks:", error);
    return [];
  }
}

/**
 * Supprime une tâche (uniquement si l'utilisateur est créateur ou assigné).
 */
export async function deleteTask(taskId: string) {
  try {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "Non authentifié" };

    const user = await getOrCreateUser();
    if (!user) return { success: false, error: "Utilisateur introuvable" };

    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) return { success: false, error: "Tâche introuvable" };

    if (task.creatorId !== user.id && task.assigneeId !== user.id) {
      return { success: false, error: "Non autorisé" };
    }

    await prisma.task.delete({ where: { id: taskId } });
    revalidatePath(`/project/${task.projectId}`);

    return { success: true };
  } catch (error) {
    console.error("Erreur deleteTask:", error);
    return { success: false, error: "Une erreur est survenue" };
  }
}

/**
 * Récupère les statistiques d'un projet (nb tâches par statut).
 */
export async function getProjectStats(projectId: string) {
  try {
    const tasks = await prisma.task.findMany({
      where: { projectId },
      select: { status: true },
    });

    const total = tasks.length;
    return {
      total,
      aFaire: tasks.filter((t) => t.status === "A_FAIRE").length,
      enCours: tasks.filter((t) => t.status === "EN_COURS").length,
      terminee: tasks.filter((t) => t.status === "TERMINEE").length,
    };
  } catch (error) {
    console.error("Erreur getProjectStats:", error);
    return { total: 0, aFaire: 0, enCours: 0, terminee: 0 };
  }
}

/**
 * ============================================
 * Server Actions - Création de tâche
 * ============================================
 */

/**
 * Récupère la liste des collaborateurs d'un projet
 * (utilisé pour la modale de sélection d'assigné).
 */
export async function getProjectCollaborators(projectId: string) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        collaborators: true,
        creator: true,
      },
    });

    if (!project) return [];

    // Inclure le créateur + les collaborateurs (sans doublon)
    const allUsers = [project.creator, ...project.collaborators];
    const uniqueUsers = allUsers.filter(
      (user, index, self) => self.findIndex((u) => u.id === user.id) === index
    );

    return uniqueUsers;
  } catch (error) {
    console.error("Erreur getProjectCollaborators:", error);
    return [];
  }
}

/**
 * Crée une nouvelle tâche dans un projet.
 * L'assigné est obligatoire (règle métier).
 */
export async function createTask(data: {
  title: string;
  description: string;
  dueDate: string;
  projectId: string;
  assigneeId: string;
}) {
  try {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "Non authentifié" };

    const user = await getOrCreateUser();
    if (!user) return { success: false, error: "Utilisateur introuvable" };

    // Validation
    if (!data.title.trim() || !data.description.trim()) {
      return { success: false, error: "Titre et description sont obligatoires" };
    }

    if (!data.assigneeId) {
      return { success: false, error: "L'assigné est obligatoire" };
    }

    if (!data.dueDate) {
      return { success: false, error: "La date de livraison est obligatoire" };
    }

    // Création
    const task = await prisma.task.create({
      data: {
        title: data.title.trim(),
        description: data.description,
        dueDate: new Date(data.dueDate),
        status: "A_FAIRE",
        projectId: data.projectId,
        creatorId: user.id,
        assigneeId: data.assigneeId,
      },
    });

    revalidatePath(`/project/${data.projectId}`);

    return { success: true, taskId: task.id };
  } catch (error) {
    console.error("Erreur createTask:", error);
    return { success: false, error: "Une erreur est survenue" };
  }
}


/**
 * ============================================
 * Server Actions - Détail d'une tâche
 * ============================================
 */

/**
 * Récupère une tâche complète par son ID.
 */
export async function getTaskById(taskId: string) {
  try {
    return await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        creator: true,
        assignee: true,
        project: {
          include: {
            creator: true,
            collaborators: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("Erreur getTaskById:", error);
    return null;
  }
}

/**
 * Met à jour le statut d'une tâche.
 * Refuse si la tâche est déjà TERMINEE (verrouillage).
 */
export async function updateTaskStatus(taskId: string, status: string) {
  try {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "Non authentifié" };

    const user = await getOrCreateUser();
    if (!user) return { success: false, error: "Utilisateur introuvable" };

    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) return { success: false, error: "Tâche introuvable" };

    // Vérifier que l'utilisateur est bien l'assigné
    if (task.assigneeId !== user.id) {
      return { success: false, error: "Vous n'êtes pas assigné à cette tâche" };
    }

    // Verrouillage : impossible de modifier une tâche TERMINEE
    if (task.status === "TERMINEE") {
      return { success: false, error: "Cette tâche est clôturée et ne peut plus être modifiée" };
    }

    await prisma.task.update({
      where: { id: taskId },
      data: { status },
    });

    revalidatePath(`/task-details/${taskId}`);
    revalidatePath(`/project/${task.projectId}`);

    return { success: true };
  } catch (error) {
    console.error("Erreur updateTaskStatus:", error);
    return { success: false, error: "Une erreur est survenue" };
  }
}

/**
 * Clôture une tâche en enregistrant la solution et en passant le statut à TERMINEE.
 */
export async function completeTask(taskId: string, solution: string) {
  try {
    const { userId } = await auth();
    if (!userId) return { success: false, error: "Non authentifié" };

    const user = await getOrCreateUser();
    if (!user) return { success: false, error: "Utilisateur introuvable" };

    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) return { success: false, error: "Tâche introuvable" };

    if (task.assigneeId !== user.id) {
      return { success: false, error: "Vous n'êtes pas assigné à cette tâche" };
    }

    if (!solution.trim()) {
      return { success: false, error: "La solution est obligatoire" };
    }

    await prisma.task.update({
      where: { id: taskId },
      data: {
        solution,
        status: "TERMINEE",
      },
    });

    revalidatePath(`/task-details/${taskId}`);
    revalidatePath(`/project/${task.projectId}`);

    return { success: true };
  } catch (error) {
    console.error("Erreur completeTask:", error);
    return { success: false, error: "Une erreur est survenue" };
  }
}
