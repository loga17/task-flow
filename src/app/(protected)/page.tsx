import { getUserProjects } from "@/actions/project";
import NewProjectButton from "@/components/NewProjectButton";
import ProjectsGrid from "@/components/ProjectsGrid";

export default async function Home() {
  const projects = await getUserProjects();

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">Mes projets</h1>
        <NewProjectButton />
      </div>

      {/* Grille de projets */}
      <ProjectsGrid projects={projects} />
    </div>
  );
}