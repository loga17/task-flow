import { getUserCollaborations } from "@/actions/project";
import JoinProjectForm from "@/components/JoinProjectForm";
import CollaborationsGrid from "@/components/CollaborationsGrid";

export default async function CollaborationsPage() {
  const projects = await getUserCollaborations();

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* En-tête */}
      <h1 className="text-3xl font-bold mb-6">Collaborations</h1>

      {/* Formulaire pour rejoindre un projet */}
      <div className="mb-8">
        <JoinProjectForm />
      </div>

      {/* Grille de projets */}
      <CollaborationsGrid projects={projects} />
    </div>
  );
}