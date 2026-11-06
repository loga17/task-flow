"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";
import StatusBadge from "./StatusBadge";
import type { Task, User } from "@prisma/client";

interface TaskWithRelations extends Task {
  assignee: User;
  creator: User;
}

interface TaskTableProps {
  tasks: TaskWithRelations[];
  currentUserId: string;
  onDelete: (taskId: string) => void;
}

export default function TaskTable({
  tasks,
  currentUserId,
  onDelete,
}: TaskTableProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 text-base-content/60">
        Aucune tâche pour ce filtre.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra">
        <thead>
          <tr>
            <th>#</th>
            <th>Titre</th>
            <th>Assigné à</th>
            <th>À livré le</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, index) => {
            const canDelete =
              task.creatorId === currentUserId ||
              task.assigneeId === currentUserId;

            return (
              <tr key={task.id}>
                <td>{index + 1}</td>
                <td>
                  <div className="flex flex-col gap-1">
                    <StatusBadge status={task.status as any} />
                    <span className="font-medium">{task.title}</span>
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <div className="avatar">
                      <div className="w-8 h-8 rounded-full">
                        <img
                          src={task.assignee.avatarUrl || "/avatars/undraw_pic-profile_nr49.png"}
                          alt={task.assignee.name}
                        />
                      </div>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm truncate">{task.assignee.email}</p>
                      <p className="text-xs text-base-content/60 truncate">
                        {task.assignee.name}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="text-sm">
                  {new Date(task.dueDate).toLocaleDateString("fr-FR")}
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/task-details/${task.id}`}
                      className="btn btn-primary btn-sm"
                    >
                      Plus
                    </Link>
                    {canDelete && (
                      <button
                        onClick={() => onDelete(task.id)}
                        className="btn btn-ghost btn-sm btn-square"
                        aria-label="Supprimer"
                      >
                        <Trash2 className="w-4 h-4 text-base-content/60" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}