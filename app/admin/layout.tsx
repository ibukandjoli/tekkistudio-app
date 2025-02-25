// app/admin/layout.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { Toaster } from 'sonner';
import Sidebar from './Sidebar';
import { Loader2 } from 'lucide-react';

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { session, adminUser, isLoading } = useAuth();

  // Si c'est la page de login, on la rend immédiatement sans vérification
  if (pathname === '/admin/login') {
    return (
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    );
  }

  // Afficher un loader pendant la vérification
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-[#ff7f50]" />
      </div>
    );
  }

  // Si non authentifié, rediriger vers login
  if (!session || !adminUser) {
    // Utiliser setTimeout pour éviter les boucles de redirection
    setTimeout(() => {
      window.location.href = '/admin/login';
    }, 100);
    
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-[#ff7f50]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar améliorée avec défilement */}
      <Sidebar />
      
      {/* Contenu principal */}
      <main className="transition-all duration-300 md:ml-64 pt-16 md:pt-0">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}

/**
 * Layout principal pour toutes les pages d'administration
 * Inclut la sidebar, le contexte d'authentification et les notifications
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
      <Toaster position="top-right" />
    </AuthProvider>
  );
}