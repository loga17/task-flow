import { SignUp } from "@clerk/nextjs";
import AuthForm from "@/components/AuthForm";
import { clerkAppearance } from "@/lib/clerk-appearance";
import type { Metadata } from "next";

/**
 * =============================================================
 * MÉTADONNÉES DE LA PAGE
 * =============================================================
 */
export const metadata: Metadata = {
  title: "Inscription",
  description: "Créez votre compte Task Flow et commencez à gérer vos projets",
};

/**
 * =============================================================
 * PAGE D'INSCRIPTION — /sign-up
 * =============================================================
 * La localisation française est héritée du ClerkProvider
 * défini dans src/app/layout.tsx.
 * =============================================================
 */
export default function SignUpPage() {
  return (
    <AuthForm title="Inscription" subtitle="Créez votre compte pour commencer">
      <SignUp
        appearance={clerkAppearance}
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
      />
    </AuthForm>
  );
}