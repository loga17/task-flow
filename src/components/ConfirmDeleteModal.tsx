"use client";

import { AlertTriangle } from "lucide-react";

/**
 * Modale de confirmation de suppression.
 */
interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  isLoading?: boolean;
}

export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirmer la suppression",
  message = "Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible.",
  isLoading = false,
}: ConfirmDeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-md">
        {/* Icône d'avertissement */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-error" />
          </div>
        </div>

        {/* Titre */}
        <h3 className="font-bold text-lg text-center mb-2">{title}</h3>

        {/* Message */}
        <p className="text-base-content/70 text-center mb-6">{message}</p>

        {/* Actions */}
        <div className="modal-action">
          <button
            onClick={onClose}
            className="btn btn-ghost"
            disabled={isLoading}
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="btn btn-error"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              "Supprimer"
            )}
          </button>
        </div>
      </div>

      {/* Overlay (clic pour fermer) */}
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
}