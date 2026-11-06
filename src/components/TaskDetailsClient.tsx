"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import QuillEditor from "./QuillEditor";
import { updateTaskStatus, completeTask } from "@/actions/task";
import type { Task, User, Project } from "@prisma/client";

interface TaskWithRelations extends Task {
  creator: User;
  assignee: User;
  project: Project & { creator: User; collaborators: User[] };
}

interface TaskDetailsClientProps {
  task: TaskWithRelations;
  currentUserId: string;
  daysRemaining: number;
}

export default function TaskDetailsClient({
  task,
  currentUserId,
  daysRemaining,
}: TaskDetailsClientProps) {
  const router = useRouter();
  const [status, setStatus] = useState(task.status);
  const [isSolutionModalOpen, setIsSolutionModalOpen] = useState(false);
  const [solution, setSolution] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isAssignee = task.assigneeId === currentUserId;
  const isLocked = task.status === "TERMINEE";

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === "TERMINEE") {
      setIsSolutionModalOpen(true);
      return;
    }

    setIsLoading(true);
    const result = await updateTaskStatus(task.id, newStatus);

    if (result.success) {
      setStatus(newStatus);
      toast.success("Statut changé");
      router.refresh();
    } else {
      toast.error(result.error || "Erreur");
    }
    setIsLoading(false);
  };

  const handleCompleteTask = async () => {
    setIsLoading(true);
    const result = await completeTask(task.id, solution);

    if (result.success) {
      toast.success("Tâche clôturée");
      setIsSolutionModalOpen(false);
      setStatus("TERMINEE");
      router.refresh();
    } else {
      toast.error(result.error || "Erreur");
    }
    setIsLoading(false);
  };

  return (
    <>
      {/* En-tête : statut + jours restants */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        {isAssignee && !isLocked ? (
          <select
            value={status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="select select-bordered select-sm"
            disabled={isLoading}
          >
            <option value="A_FAIRE">À faire</option>
            <option value="EN_COURS">En cours</option>
            <option value="TERMINEE">Terminée</option>
          </select>
        ) : (
          <span className="badge badge-primary">
            {status === "A_FAIRE" && "À faire"}
            {status === "EN_COURS" && "En cours"}
            {status === "TERMINEE" && "Terminée"}
          </span>
        )}

        <span className="badge badge-ghost">
          {daysRemaining > 0
            ? `${daysRemaining} jours restants`
            : "Échéance dépassée"}
        </span>
      </div>

      {/* Modale "C'est quoi la solution ?" */}
      {isSolutionModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box max-w-3xl">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-bold text-lg">C'est quoi la solution ?</h3>
                <p className="text-sm text-base-content/70">
                  Décrivez ce que vous avez fait exactement
                </p>
              </div>
              <button
                onClick={() => setIsSolutionModalOpen(false)}
                className="btn btn-ghost btn-sm btn-square"
              >
                ✕
              </button>
            </div>

            <QuillEditor
              value={solution}
              onChange={setSolution}
              placeholder="Décrivez la solution"
            />

            <div className="modal-action">
              <button
                onClick={handleCompleteTask}
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  "Terminé(e)"
                )}
              </button>
            </div>
          </div>
          <div
            className="modal-backdrop"
            onClick={() => setIsSolutionModalOpen(false)}
          ></div>
        </div>
      )}
    </>
  );
}