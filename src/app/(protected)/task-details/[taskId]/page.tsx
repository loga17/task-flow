import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getTaskById } from "@/actions/task";
import { getOrCreateUser } from "@/lib/user";
import TaskDetailsClient from "@/components/TaskDetailsClient";

interface PageProps {
  params: Promise<{ taskId: string }>;
}

export default async function TaskDetailsPage({ params }: PageProps) {
  const { taskId } = await params;

  const [task, user] = await Promise.all([
    getTaskById(taskId),
    getOrCreateUser(),
  ]);

  if (!task || !user) notFound();

  // Calcul des jours restants
  const daysRemaining = Math.ceil(
    (new Date(task.dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Fil d'Ariane */}
      <div className="flex items-center gap-2 mb-6 text-sm">
        <Link
          href={`/project/${task.projectId}`}
          className="flex items-center gap-1 text-base-content/60 hover:text-primary"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Link>
        <span className="text-base-content/40">&gt;</span>
        <span className="badge badge-primary">{task.project.name}</span>
      </div>

      {/* Grille */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne gauche */}
        <div className="lg:col-span-1 space-y-4">
          <h1 className="text-2xl font-bold italic">{task.title}</h1>
          <p className="text-sm text-base-content/60">
            À livré le {new Date(task.dueDate).toLocaleDateString("fr-FR")}
          </p>

          {/* Créé par */}
          <div className="card bg-base-100 shadow-md">
            <div className="card-body p-4">
              <p className="text-xs text-base-content/60">Créé par</p>
              <div className="flex items-center gap-3 mt-1">
                <div className="avatar">
                  <div className="w-10 h-10 rounded-full">
                    <img
                      src={task.creator.avatarUrl || "/avatars/undraw_pic-profile_nr49.png"}
                      alt={task.creator.name}
                    />
                  </div>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{task.creator.email}</p>
                  <p className="text-xs text-base-content/60 truncate">
                    {task.creator.name}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Colonne droite */}
        <div className="lg:col-span-2 space-y-6">
          {/* Assigné + statut */}
          <div className="card bg-base-100 shadow-md">
            <div className="card-body p-4">
              <p className="text-xs text-base-content/60">Assigné à</p>
              <div className="flex items-center gap-3 mt-1">
                <div className="avatar">
                  <div className="w-10 h-10 rounded-full">
                    <img
                      src={task.assignee.avatarUrl || "/avatars/undraw_pic-profile_nr49.png"}
                      alt={task.assignee.name}
                    />
                  </div>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{task.assignee.email}</p>
                  <p className="text-xs text-base-content/60 truncate">
                    {task.assignee.name}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Statut + jours restants */}
          <TaskDetailsClient
            task={task as any}
            currentUserId={user.id}
            daysRemaining={daysRemaining}
          />

          {/* Description */}
          <div className="card bg-base-100 shadow-md">
            <div className="card-body">
              <h2 className="text-xl font-bold mb-4">{task.title}</h2>
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: task.description }}
              />
            </div>
          </div>

          {/* Solution (si clôturée) */}
          {task.solution && (
            <div className="card bg-base-100 shadow-md">
              <div className="card-body">
                <div className="flex items-center gap-2 mb-4">
                  <span className="badge badge-primary">Solution</span>
                  <span className="text-xs text-base-content/60">
                    Validée et soumise par l'assigné
                  </span>
                </div>
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: task.solution }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}