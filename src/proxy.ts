import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

/**
 * =============================================================
 * ROUTES PUBLIQUES — accessibles sans authentification
 * =============================================================
 * Note : createRouteMatcher est déprécié en Clerk v7.
 * On utilise désormais une correspondance directe sur pathname.
 * =============================================================
 */
const PUBLIC_PATHS = ["/sign-in", "/sign-up"];

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_PATHS.some((path) => pathname.startsWith(path));
}

/**
 * =============================================================
 * MIDDLEWARE Clerk — Fichier reconnu par Next.js
 * =============================================================
 * ⚠️ Ce fichier DOIT s'appeler middleware.ts pour être détecté
 *    par Next.js. Aucune autre convention n'est supportée.
 * =============================================================
 */
export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl;
  const isPublic = isPublicRoute(pathname);

  // Log en développement uniquement
  if (process.env.NODE_ENV === "development") {
    console.log(
      `[MIDDLEWARE] ${req.method} ${req.url} → ${isPublic ? "PUBLIC" : "PROTECTED"}`
    );
  }

  // Protéger toutes les routes non publiques
  if (!isPublic) {
    await auth.protect();
  }

  return NextResponse.next();
});

/**
 * =============================================================
 * CONFIGURATION DU MATCHER
 * =============================================================
 * Exclut les fichiers statiques, _next et les ressources
 * statiques pour éviter d'intercepter les assets.
 * =============================================================
 */
export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
