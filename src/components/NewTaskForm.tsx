"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Calendar } from "lucide-react";
import QuillEditor from "./QuillEditor";
import AssigneeModal from "./AssigneeModal";
import { createTask } from "@/actions/task";
import type { User } from "@prisma/client";

interface NewTaskFormProps {
  projectId: string;
  collaborators: User[];
}

export default function NewTaskForm({
  projectId,
  collaborators,
}: NewTaskFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [assignee, setAssignee] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!assignee) {
      toast.error("Veuillez sélectionner un assigné");
      return;
    }

    setIsLoading(true);

    const result = await createTask({
      title,
      description,
      dueDate,
      projectId,
      assigneeId: assignee.id,
    });

    if (result.success) {
      toast.success("Tâche créée !");
      router.push(`/project/${projectId}`);
    } else {
      toast.error(result.error || "Erreur lors de la création");
      setIsLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne gauche : Assigné + Date */}
        <div className="lg:col-span-1 space-y-4">
          {/* Assigné */}
          <div className="card bg-base-100 shadow-md">
            <div className="card-body p-4">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-3 w-full text-left"
              >
                <div className="avatar">
                  <div className="w-12 h-12 rounded-full">
                    <img
                      src={
                        assignee?.avatarUrl ||
                        "/avatars/undraw_pic-profile_nr49.png"
                      }
                      alt={assignee?.name || "Personne"}
                    />
                  </div>
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-base-content/60">Assigné à</p>
                  <p className="text-sm font-medium truncate">
                    {assignee ? assignee.name : "Personne"}
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Date */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">À livré</span>
            </label>
            <div className="relative">
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="input input-bordered w-full"
                required
              />
            </div>
          </div>
        </div>

        {/* Colonne droite : Titre + Description */}
        <div className="lg:col-span-2 space-y-4">
          <input
            type="text"
            placeholder="Nom de la tâche"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input input-bordered w-full"
            required
          />

          <QuillEditor
            value={description}
            onChange={setDescription}
            placeholder="Décrivez la tâche"
          />

          <div className="flex justify-end">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Créer la tâche"
              )}
            </button>
          </div>
        </div>
      </form>

      <AssigneeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        collaborators={collaborators}
        onSelect={setAssignee}
      />
    </>
  );
}