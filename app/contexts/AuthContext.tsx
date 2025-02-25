// app/contexts/AuthContext.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AdminUser {
  id: string;
  user_id: string;
  role: string;
}

interface AuthContextType {
  session: Session | null;
  adminUser: AdminUser | null;
  isLoading: boolean;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  adminUser: null,
  isLoading: true,
  refreshSession: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);

  const fetchAdminUser = async (userId: string) => {
    console.log("AuthContext - Récupération admin pour:", userId);
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error) {
        console.error('Erreur récupération admin:', error);
        setAdminUser(null);
        return null;
      }
      
      console.log("AuthContext - Admin trouvé:", data);
      setAdminUser(data);
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération admin:', error);
      setAdminUser(null);
      return null;
    }
  };

  const refreshSession = async () => {
    console.log("AuthContext - Rafraîchissement session");
    try {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      console.log("AuthContext - Session récupérée:", !!session);
      setSession(session);
      
      if (session?.user) {
        await fetchAdminUser(session.user.id);
      } else {
        setAdminUser(null);
      }
    } catch (error) {
      console.error('Erreur refresh session:', error);
      setSession(null);
      setAdminUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initialisation unique de l'auth
    if (!authInitialized) {
      console.log("AuthContext - Initialisation");
      
      // Configurer l'écouteur d'événements auth une seule fois
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
        console.log("AuthContext - Changement d'état auth:", event, !!newSession);
        setSession(newSession);
        
        if (newSession?.user) {
          await fetchAdminUser(newSession.user.id);
        } else {
          setAdminUser(null);
        }
        
        setIsLoading(false);
      });

      // Récupérer la session initiale
      refreshSession();
      setAuthInitialized(true);

      // Nettoyage de l'écouteur
      return () => {
        subscription.unsubscribe();
      };
    }
  }, [authInitialized]);

  const value = {
    session,
    adminUser,
    isLoading,
    refreshSession,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  return context;
};