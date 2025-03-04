// app/lib/auth-utils.ts
import { supabase } from '@/app/lib/supabase';

/**
 * Vérifie si l'utilisateur actuel est authentifié en tant qu'administrateur
 * Utilisé dans les routes API (middleware)
 */
export async function checkAdminAuth() {
  try {
    // Obtenir la session depuis le client Supabase
    const { data } = await supabase.auth.getSession();
    const session = data.session;

    // Pas de session = non authentifié
    if (!session) {
      return { isAuthenticated: false, message: 'Non authentifié' };
    }

    // Vérifier si l'utilisateur est admin
    const { data: adminUser, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', session.user.id)
      .single();

    if (error || !adminUser) {
      return { isAuthenticated: false, message: 'Utilisateur non administrateur' };
    }

    return {
      isAuthenticated: true,
      adminUser,
      userId: session.user.id,
      session
    };
  } catch (error) {
    console.error('Erreur lors de la vérification d\'authentification:', error);
    return { isAuthenticated: false, message: 'Erreur de vérification' };
  }
}