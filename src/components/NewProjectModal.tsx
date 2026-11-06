"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { createProject } from "@/actions/project";

/**
 * Modale de création d'un nouveau projet.
 */
interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewProjectModal({ isOpen, onClose }: NewProjectModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await createProject(name, description);

    if (result.success) {
      toast.success("Projet créé !");
      setName("");
      setDescription("");
      onClose();
      router.refresh();
    } else {
      toast.error(result.error || "Erreur lors de la création");
    }

    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-lg">
        {/* En-tête */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-bold text-lg">Nouveau Projet</h3>
            <p className="text-sm text-base-content/70">
              Décrivez votre projet simplement grâce à la description
            </p>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm btn-square">✕</button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="Nom du projet"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="label">
            </label>
            <textarea
              className="textarea textarea-bordered w-full"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              required
            ></textarea>
          </div>

          <div className="modal-action">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost"
              disabled={isLoading}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Nouveau Projet"
              )}
            </button>
          </div>
        </form>
      </div>

      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
}