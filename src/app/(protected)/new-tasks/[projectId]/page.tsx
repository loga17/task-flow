import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getProjectById, getProjectCollaborators } from "@/actions/task";
import NewTaskForm from "@/components/NewTaskForm";

interface PageProps {
  params: Promise<{ projectId: string }>;
}

export default async function NewTaskPage({ params }: PageProps) {
  const { projectId } = await params;

  const [project, collaborators] = await Promise.all([
    getProjectById(projectId),
    getProjectCollaborators(projectId),
  ]);

  if (!project) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Fil d'Ariane */}
      <div className="flex items-center gap-2 mb-6 text-sm">
        <Link
          href={`/project/${projectId}`}
          className="flex items-center gap-1 text-base-content/60 hover:text-primary"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Link>
        <span className="text-base-content/40">&gt;</span>
        <span className="badge badge-primary">{project.name}</span>
      </div>

      {/* Formulaire */}
      <NewTaskForm
        projectId={projectId}
        collaborators={collaborators as any}
      />
    </div>
  );
}