// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  // Créer la réponse
  const res = NextResponse.next();
  
  // Ajouter des en-têtes de sécurité à toutes les réponses
  res.headers.set('X-Frame-Options', 'DENY');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  // Initialiser le client Supabase pour l'authentification
  const supabase = createMiddlewareClient({ req, res });
  
  // Vérifier uniquement pour rediriger de /admin/login vers /admin/dashboard si déjà connecté
  if (req.nextUrl.pathname === '/admin/login') {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      // Si on a une session et qu'on est sur la page login, rediriger vers dashboard
      if (session) {
        console.log("Middleware - Redirection de login vers dashboard (session existante)");
        return NextResponse.redirect(new URL('/admin/dashboard', req.url));
      }
    } catch (error) {
      console.error("Middleware - Erreur:", error);
    }
  }
  
  // Retourner la réponse avec les en-têtes de sécurité ajoutés
  return res;
}

// Mettre à jour le matcher pour appliquer le middleware à plus de routes
export const config = {
  matcher: ['/admin/login', '/((?!api|_next/static|_next/image|favicon.ico).*)']
};