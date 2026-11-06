import { FolderGit2 } from "lucide-react";
import ProgressBar from "./ProgressBar";
import type { User } from "@prisma/client";

interface ProjectHeaderProps {
  project: {
    name: string;
    description: string;
    creator: User;
    collaborators: User[];
  };
  stats: {
    total: number;
    aFaire: number;
    enCours: number;
    terminee: number;
  };
}

export default function ProjectHeader({ project, stats }: ProjectHeaderProps) {
  return (
    <div className="space-y-4">
      {/* Créateur */}
      <div className="card bg-base-100 shadow-md">
        <div className="card-body p-4">
          <p className="text-xs text-base-content/60 mb-1">Créé par</p>
          <div className="flex items-center gap-3">
            <div className="avatar">
              <div className="w-10 h-10 rounded-full">
                <img
                  src={project.creator.avatarUrl || "/avatars/undraw_pic-profile_nr49.png"}
                  alt={project.creator.name}
                />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">{project.creator.email}</p>
              <p className="text-xs text-base-content/60 truncate">
                {project.creator.name}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Infos du projet */}
      <div className="card bg-base-100 shadow-md">
        <div className="card-body p-4 gap-4">
          <div className="flex items-center gap-2">
            <FolderGit2 className="w-6 h-6 text-primary" />
            <h2 className="text-lg font-bold">{project.name}</h2>
          </div>

          <p className="text-sm text-base-content/70">{project.description}</p>

          <div className="flex items-center gap-2 text-sm">
            <span className="text-base-content/70">Collaborateurs</span>
            <span className="badge badge-sm bg-base-200">
              {project.collaborators.length}
            </span>
          </div>

          <div className="space-y-3 pt-2">
            <ProgressBar
              label="À faire"
              value={stats.aFaire}
              total={stats.total}
            />
            <ProgressBar
              label="En cours"
              value={stats.enCours}
              total={stats.total}
            />
            <ProgressBar
              label="Terminée(s)"
              value={stats.terminee}
              total={stats.total}
            />
          </div>
        </div>
      </div>
    </div>
  );
}