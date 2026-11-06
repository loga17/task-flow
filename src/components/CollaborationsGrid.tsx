"use client";

import ProjectCard from "./ProjectCard";
import EmptyState from "./EmptyState";

interface CollaborationsGridProps {
  projects: any[];
}

export default function CollaborationsGrid({ projects }: CollaborationsGridProps) {
  if (projects.length === 0) {
    return (
      <EmptyState
        imageSrc="/illustrations/undraw_empty_4zx0.png"
        title="Vous ne collaborez sur aucun projet pour le moment"
        subtitle="Utilisez le champ de code d'invitation ci-dessus pour rejoindre un projet."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}