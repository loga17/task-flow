"use client";

import { X } from "lucide-react";
import type { User } from "@prisma/client";

interface AssigneeModalProps {
  isOpen: boolean;
  onClose: () => void;
  collaborators: User[];
  onSelect: (user: User) => void;
}

export default function AssigneeModal({
  isOpen,
  onClose,
  collaborators,
  onSelect,
}: AssigneeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">Choisissez un collaborateur</h3>
          <button onClick={onClose} className="btn btn-ghost btn-sm btn-square">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2">
          {collaborators.map((user) => (
            <button
              key={user.id}
              onClick={() => {
                onSelect(user);
                onClose();
              }}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-base-200 transition-colors text-left"
            >
              <div className="avatar">
                <div className="w-10 h-10 rounded-full">
                  <img
                    src={user.avatarUrl || "/avatars/undraw_pic-profile_nr49.png"}
                    alt={user.name}
                  />
                </div>
              </div>
              <div className="min-w-0">
                <p className="text-xs text-base-content/60">Assigné à</p>
                <p className="text-sm font-medium truncate">{user.email}</p>
                <p className="text-xs text-base-content/60 truncate">{user.name}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
}