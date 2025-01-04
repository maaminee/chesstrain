// app/middleware.ts
import { NextResponse } from "next/server"; // Importation de NextResponse

export function middleware(req: Request) {
  // Ajouter les en-têtes COOP et COEP pour chaque réponse
  const response = NextResponse.next();

  // Ajout des en-têtes pour la sécurité
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  response.headers.set("Cross-Origin-Embedder-Policy", "require-corp");

  return response;
}

// Configurer le middleware pour s'appliquer à toutes les routes
export const config = {
  matcher: "/:path*", // Appliquer aux pages principales
};
