// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  
  // Uniquement pour forcer Supabase à mettre à jour les cookies
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
  
  // Dans tous les autres cas, continuer normalement
  return res;
}

export const config = {
  matcher: ['/admin/login']
};