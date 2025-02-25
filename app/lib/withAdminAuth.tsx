// app/lib/withAdminAuth.tsx 
'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { supabase } from './supabase';

export function withAdminAuth<P extends {}>(WrappedComponent: React.ComponentType<P>) {
  return function WithAdminAuthWrapper(props: P) {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const checkAuth = async () => {
        try {
          console.log("withAdminAuth - Vérification session");
          const { data: { session } } = await supabase.auth.getSession();
          
          if (!session) {
            console.log("withAdminAuth - Pas de session, redirection vers login");
            // Utiliser la redirection directe plutôt que le router
            window.location.href = '/admin/login';
            return;
          }

          console.log("withAdminAuth - Session trouvée, vérification admin");
          const { data: adminUser, error } = await supabase
            .from('admin_users')
            .select('*')
            .eq('user_id', session.user.id)
            .single();

          if (error || !adminUser) {
            console.log("withAdminAuth - Pas d'admin, redirection vers login");
            // Utiliser la redirection directe plutôt que le router
            window.location.href = '/admin/login';
            return;
          }

          console.log("withAdminAuth - Utilisateur autorisé");
          setIsAuthorized(true);
        } catch (error) {
          console.error('Erreur de vérification auth:', error);
          // Utiliser la redirection directe plutôt que le router
          window.location.href = '/admin/login';
        } finally {
          setLoading(false);
        }
      };

      checkAuth();
    }, []);

    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin text-[#ff7f50]" />
        </div>
      );
    }

    if (!isAuthorized) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}