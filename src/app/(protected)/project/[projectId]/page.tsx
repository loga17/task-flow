import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  getProjectById,
  getProjectTasks,
  getProjectStats,
} from "@/actions/task";
import { getOrCreateUser } from "@/lib/user";
import ProjectHeader from "@/components/ProjectHeader";
import TaskTableClient from "@/components/TaskTableClient";

interface PageProps {
  params: Promise<{ projectId: string }>;
}

export default async function ProjectTasksPage({ params }: PageProps) {
  const { projectId } = await params;

  const [project, stats, user] = await Promise.all([
    getProjectById(projectId),
    getProjectStats(projectId),
    getOrCreateUser(),
  ]);

  if (!project || !user) {
    notFound();
  }

  const allTasks = await getProjectTasks(projectId, "ALL");

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Fil d'Ariane */}
      <div className="flex items-center gap-2 mb-6 text-sm">
        <Link href="/" className="flex items-center gap-1 text-base-content/60 hover:text-primary">
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Link>
        <span className="text-base-content/40">&gt;</span>
        <span className="badge badge-primary">{project.name}</span>
      </div>

      {/* Grille principale */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Encart projet (colonne gauche) */}
        <div className="lg:col-span-1">
          <ProjectHeader project={project as any} stats={stats} />
        </div>

        {/* Tableau des tâches (colonne droite) */}
        <div className="lg:col-span-2">
          <TaskTableClient
            projectId={projectId}
            initialTasks={allTasks}
            currentUserId={user.id}
            stats={stats}
          />
        </div>
      </div>
    </div>
  );
}