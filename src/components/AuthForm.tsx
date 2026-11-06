import Link from "next/link";
import { FolderGit2 } from "lucide-react";
import { ReactNode } from "react";

/**
 * Props du composant AuthForm.
 */
interface AuthFormProps {
  /** Titre principal affiché au-dessus du formulaire (ex: "Connexion") */
  title: string;
  /** Sous-titre explicatif (ex: "Accédez à votre espace de travail") */
  subtitle: string;
  /** Le formulaire Clerk (<SignIn /> ou <SignUp />) */
  children: ReactNode;
}

/**
 * Composant d'authentification réutilisable.
 * Encapsule le style commun aux pages /sign-in et /sign-up :
 * - Logo "Task Flow"
 * - Titre et sous-titre
 * - Carte DaisyUI contenant le formulaire Clerk
 */
export default function AuthForm({ title, subtitle, children }: AuthFormProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
      <div className="w-full max-w-md">
        {/* Logo et titre de l'application */}
        <div className="flex flex-col items-center mb-6">
          <Link href="/" className="flex items-center gap-2 mb-4">
            <FolderGit2 className="w-10 h-10 text-primary" />
            <span className="text-3xl font-bold">
              Task <span className="text-primary">Flow</span>
            </span>
          </Link>
          <h1 className="text-3xl font-bold text-base-content">{title}</h1>
          <p className="text-base-content/70 mt-2">{subtitle}</p>
        </div>

        {/* Carte contenant le formulaire Clerk */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body p-6">{children}</div>
        </div>
      </div>
    </div>
  );
}