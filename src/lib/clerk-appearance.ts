import { frFR } from "@clerk/localizations";

/**
 * =============================================================
 * APPARENCE CLERK — Stylisation avec DaisyUI
 * =============================================================
 * Les classes CSS Tailwind/DaisyUI sont appliquées sur les
 * éléments internes du composant Clerk via la prop `appearance`.
 * Un override CSS (.cl-*) dans globals.css complète ce système
 * pour les propriétés que Clerk injecte en inline.
 * =============================================================
 */
export const clerkAppearance = {
  elements: {
    // Conteneurs
    rootBox: "w-full",
    card: "shadow-none bg-transparent p-0",
    headerTitle: "hidden",
    headerSubtitle: "hidden",

    // Bouton "Continuer avec Google"
    socialButtonsBlockButton:
      "btn btn-outline w-full normal-case text-base font-normal",
    socialButtonsBlockButtonText: "font-normal",

    // Séparateur "OU"
    dividerLine: "bg-base-300",
    dividerText: "text-base-content/50 text-sm uppercase",

    // Champs de saisie
    formFieldLabel: "text-base-content font-medium text-sm",
    formFieldInput:
      "input input-bordered w-full focus:input-primary focus:outline-none",
    formFieldInputShowPasswordButton: "text-base-content/50",

    // Bouton principal "Se connecter" / "Créer mon compte"
    // Note : les styles inline de Clerk sont surchargés dans globals.css
    formButtonPrimary:
      "btn btn-primary w-full normal-case text-base font-medium",

    // Liens
    footerActionLink:
      "text-primary hover:text-primary/80 font-medium no-underline",
    footerActionText: "text-base-content/70",

    // Messages d'erreur
    formFieldErrorText: "text-error text-sm mt-1",

    // Identité
    identityPreviewText: "text-base-content",
    identityPreviewEditButton: "text-primary",
  },
};

/**
 * =============================================================
 * LOCALISATION FRANÇAISE — via @clerk/localizations
 * =============================================================
 * Utilise le pack officiel frFR pour une traduction complète
 * et compatible avec la version Clerk installée.
 * =============================================================
 */
export const clerkLocalization = frFR;