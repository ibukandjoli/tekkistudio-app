// app/admin/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase';
import { Loader2 } from 'lucide-react';

export default function AdminPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkSession() {
      try {
        // Vérifier si l'utilisateur est connecté
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // Vérifier si c'est un administrateur valide
          const { data: adminUser, error } = await supabase
            .from('admin_users')
            .select('*')
            .eq('user_id', session.user.id)
            .single();
          
          if (adminUser && !error) {
            // Utilisateur administrateur authentifié, rediriger vers le dashboard
            router.push('/admin/dashboard');
          } else {
            // Utilisateur connecté mais pas administrateur
            // Déconnecter l'utilisateur
            await supabase.auth.signOut();
            router.push('/admin/login?error=unauthorized');
          }
        } else {
          // Pas de session active, rediriger vers login
          router.push('/admin/login');
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de la session:', error);
        // En cas d'erreur, rediriger vers login
        router.push('/admin/login');
      } finally {
        setIsLoading(false);
      }
    }

    checkSession();
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      {isLoading ? (
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-[#ff7f50] mx-auto mb-4" />
          <p className="text-gray-600">Vérification des accès...</p>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-gray-600">Redirection en cours...</p>
        </div>
      )}
    </div>
  );
}