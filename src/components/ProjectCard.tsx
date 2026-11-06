"use client";

import Link from "next/link";
import { FolderGit2, Trash2, Edit } from "lucide-react";
import ProgressBar from "./ProgressBar";
import InviteCode from "./InviteCode";

/**
 * Carte de projet affichée sur "Mes projets" et "Collaborations".
 */
interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    inviteCode: string;
    collaborators: { id: string }[];
    tasks: { status: string }[];
  };
  onDelete?: (id: string) => void;
}

export default function ProjectCard({ project, onDelete }: ProjectCardProps) {
  // Calculer les statistiques par statut
  const totalTasks = project.tasks.length;
  const tasksByStatus = {
    A_FAIRE: project.tasks.filter((t) => t.status === "A_FAIRE").length,
    EN_COURS: project.tasks.filter((t) => t.status === "EN_COURS").length,
    TERMINEE: project.tasks.filter((t) => t.status === "TERMINEE").length,
  };

  return (
    <div className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
      <div className="card-body gap-4">
        {/* En-tête : icône + nom du projet */}
        <div className="flex items-center gap-2">
          <FolderGit2 className="w-6 h-6 text-primary" />
          <h2 className="card-title text-lg">{project.name}</h2>
        </div>

        {/* Collaborateurs */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-base-content/70">Collaborateurs</span>
          <span className="badge badge-sm bg-base-200 text-base-content/80">
            {project.collaborators.length}
          </span>
        </div>

        {/* Code d'invitation */}
        <InviteCode code={project.inviteCode} />

        {/* Barres de progression */}
        <div className="space-y-3">
          <ProgressBar
            label="À faire"
            value={tasksByStatus.A_FAIRE}
            total={totalTasks}
          />
          <ProgressBar
            label="En cours"
            value={tasksByStatus.EN_COURS}
            total={totalTasks}
          />
          <ProgressBar
            label="Terminée(s)"
            value={tasksByStatus.TERMINEE}
            total={totalTasks}
          />
        </div>

        {/* Actions */}
        <div className="card-actions justify-between items-center mt-2">
          <Link
            href={`/project/${project.id}`}
            className="btn btn-primary btn-sm gap-2"
          >
            {totalTasks} Tâche{totalTasks > 1 ? "s" : ""}
            <Edit className="w-4 h-4" />
          </Link>

          {onDelete && (
            <button
              onClick={() => onDelete(project.id)}
              className="btn btn-ghost btn-sm btn-square"
              aria-label="Supprimer le projet"
            >
              <Trash2 className="w-4 h-4 text-base-content/60" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}