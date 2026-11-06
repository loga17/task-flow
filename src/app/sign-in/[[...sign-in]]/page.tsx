import { SignIn } from "@clerk/nextjs";
import AuthForm from "@/components/AuthForm";
import { clerkAppearance } from "@/lib/clerk-appearance";
import type { Metadata } from "next";

/**
 * =============================================================
 * MÉTADONNÉES DE LA PAGE
 * =============================================================
 */
export const metadata: Metadata = {
  title: "Connexion",
  description: "Connectez-vous à votre espace de travail Task Flow",
};

/**
 * =============================================================
 * PAGE DE CONNEXION — /sign-in
 * =============================================================
 * La localisation française est héritée du ClerkProvider
 * défini dans src/app/layout.tsx.
 * =============================================================
 */
export default function SignInPage() {
  return (
    <AuthForm title="Connexion" subtitle="Accédez à votre espace de travail">
      <SignIn
        appearance={clerkAppearance}
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
      />
    </AuthForm>
  );
}