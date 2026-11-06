"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import ProjectCard from "./ProjectCard";
import EmptyState from "./EmptyState";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import { deleteProject } from "@/actions/project";

interface ProjectsGridProps {
  projects: any[];
}

export default function ProjectsGrid({ projects }: ProjectsGridProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);

    const result = await deleteProject(deleteId);

    if (result.success) {
      toast.success("Projet supprimé");
      setDeleteId(null);
      router.refresh();
    } else {
      toast.error(result.error || "Erreur lors de la suppression");
    }

    setIsDeleting(false);
  };

  if (projects.length === 0) {
    return (
      <EmptyState
        imageSrc="/illustrations/undraw_empty_4zx0.png"
        title="Aucun projet pour le moment"
        subtitle="Créez votre premier projet pour commencer."
      />
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onDelete={(id) => setDeleteId(id)}
          />
        ))}
      </div>

      <ConfirmDeleteModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Supprimer le projet"
        message="Êtes-vous sûr de vouloir supprimer ce projet ? Toutes ses tâches seront également supprimées. Cette action est irréversible."
      />
    </>
  );
}