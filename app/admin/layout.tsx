// app/admin/layout.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  BookOpen, 
  Users, 
  Settings,
  LogOut,
  Loader2,
  UserCheck,
  MessageSquare,
  GraduationCap
} from 'lucide-react';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { WhatsAppIcon } from '../components/icons/WhatsAppIcon';
import { supabase } from '../lib/supabase';

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

const NavItem = ({ href, icon, label, isActive }: NavItemProps) => (
  <Link
    href={href}
    className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
      isActive 
        ? 'bg-[#ff7f50] text-white' 
        : 'text-gray-600 hover:bg-gray-100'
    }`}
  >
    {icon}
    <span>{label}</span>
  </Link>
);

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { session, adminUser, isLoading } = useAuth();

  // Si c'est la page de login, on la rend immédiatement sans vérification
  if (pathname === '/admin/login') {
    return children;
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      // Forcer la redirection vers login après déconnexion
      window.location.href = '/admin/login';
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

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
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 z-30">
        <div className="h-full flex flex-col">
          <div className="flex-shrink-0 px-4 py-6">
            <h1 className="text-xl font-bold text-[#0f4c81]">TEKKI Studio</h1>
            <p className="text-sm text-gray-500">Panel Administrateur</p>
          </div>

          <nav className="flex-1 px-2 py-4 space-y-1">
            <NavItem
              href="/admin/dashboard"
              icon={<LayoutDashboard size={20} />}
              label="Tableau de bord"
              isActive={pathname === '/admin/dashboard'}
            />
            
            {/* Section Business */}
            <div className="pt-4 pb-2">
              <p className="px-4 text-xs font-semibold text-gray-400 uppercase">
                Business
              </p>
            </div>
            <NavItem
              href="/admin/businesses"
              icon={<ShoppingBag size={20} />}
              label="Business"
              isActive={pathname.startsWith('/admin/businesses')}
            />
            <NavItem
              href="/admin/leads"
              icon={<MessageSquare size={20} />}
              label="Prospects"
              isActive={pathname.startsWith('/admin/leads')}
            />
            
            {/* Section Formations */}
            <div className="pt-4 pb-2">
              <p className="px-4 text-xs font-semibold text-gray-400 uppercase">
                Formations
              </p>
            </div>
            <NavItem
              href="/admin/formations"
              icon={<BookOpen size={20} />}
              label="Formations"
              isActive={pathname.startsWith('/admin/formations')}
            />
            <NavItem
              href="/admin/enrollments"
              icon={<GraduationCap size={20} />}
              label="Inscriptions"
              isActive={pathname.startsWith('/admin/enrollments')}
            />
            
            {/* Section Marques */}
            <div className="pt-4 pb-2">
              <p className="px-4 text-xs font-semibold text-gray-400 uppercase">
                Marques
              </p>
            </div>
            <NavItem
              href="/admin/marques"
              icon={<BookOpen size={20} />}
              label="Marques"
              isActive={pathname.startsWith('/admin/marques')}
            />

            {/* Section Marketing */}
                <div className="pt-4 pb-2">
                <p className="px-4 text-xs font-semibold text-gray-400 uppercase">
                    Marketing
                </p>
                </div>
                <NavItem
                href="/admin/whatsapp-subscribers"
                icon={<WhatsAppIcon className="w-5 h-5" />}
                label="Liste WhatsApp"
                isActive={pathname.startsWith('/admin/whatsapp-subscribers')}
                />
            
            {/* Section Gestion */}
            <div className="pt-4 pb-2">
              <p className="px-4 text-xs font-semibold text-gray-400 uppercase">
                Gestion
              </p>
            </div>
            <NavItem
              href="/admin/users"
              icon={<Users size={20} />}
              label="Utilisateurs"
              isActive={pathname.startsWith('/admin/users')}
            />
            <NavItem
              href="/admin/settings"
              icon={<Settings size={20} />}
              label="Paramètres"
              isActive={pathname.startsWith('/admin/settings')}
            />
          </nav>

          <div className="flex-shrink-0 p-4 border-t">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 text-gray-600 hover:text-red-600 transition-colors w-full px-4 py-2"
            >
              <LogOut size={20} />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64 p-8">
        {children}
      </main>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AuthProvider>
  );
}