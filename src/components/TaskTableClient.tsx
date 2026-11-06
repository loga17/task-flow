"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { toast } from "react-toastify";
import TaskFilters from "./TaskFilters";
import TaskTable from "./TaskTable";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import { getProjectTasks, deleteTask } from "@/actions/task";
import type { Task, User } from "@prisma/client";

interface TaskWithRelations extends Task {
  assignee: User;
  creator: User;
}

interface TaskTableClientProps {
  projectId: string;
  initialTasks: TaskWithRelations[];
  currentUserId: string;
  stats: { total: number; aFaire: number; enCours: number; terminee: number };
}

export default function TaskTableClient({
  projectId,
  initialTasks,
  currentUserId,
  stats,
}: TaskTableClientProps) {
  const [tasks, setTasks] = useState(initialTasks);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Recharge les tâches lorsque le filtre change
  useEffect(() => {
    async function fetchTasks() {
      const newTasks = await getProjectTasks(projectId, activeFilter);
      setTasks(newTasks as any);
    }
    fetchTasks();
  }, [activeFilter, projectId]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);

    const result = await deleteTask(deleteId);

    if (result.success) {
      toast.success("Tâche supprimée");
      setTasks(tasks.filter((t) => t.id !== deleteId));
      setDeleteId(null);
    } else {
      toast.error(result.error || "Erreur");
    }

    setIsDeleting(false);
  };

  const mineCount = tasks.filter(
    (t) => t.creatorId === currentUserId || t.assigneeId === currentUserId
  ).length;

  return (
    <>
      {/* Barre de filtres + bouton */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <TaskFilters
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          counts={{
            all: stats.total,
            aFaire: stats.aFaire,
            enCours: stats.enCours,
            terminee: stats.terminee,
            mine: mineCount,
          }}
        />
        <Link
          href={`/new-tasks/${projectId}`}
          className="btn btn-primary btn-sm gap-2"
        >
          Nouvelle tâche
          <Plus className="w-4 h-4" />
        </Link>
      </div>

      {/* Tableau */}
      <div className="card bg-base-100 shadow-md">
        <div className="card-body p-0">
          <TaskTable
            tasks={tasks}
            currentUserId={currentUserId}
            onDelete={(id) => setDeleteId(id)}
          />
        </div>
      </div>

      {/* Modale de confirmation */}
      <ConfirmDeleteModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Supprimer la tâche"
        message="Êtes-vous sûr de vouloir supprimer cette tâche ? Cette action est irréversible."
      />
    </>
  );
}