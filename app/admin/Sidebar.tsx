// app/admin/Sidebar.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Store, 
  BookOpen, 
  Package, 
  Users, 
  MessageSquare,
  Settings, 
  LogOut, 
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  UserCheck,
  GraduationCap,
  Share2
} from 'lucide-react';
import { useAuth } from '@/app/contexts/AuthContext';
import Image from 'next/image';
import { WhatsAppIcon } from '@/app/components/icons/WhatsAppIcon';
import { supabase } from '@/app/lib/supabase';

/**
 * Sidebar pour l'interface d'administration
 * Responsive avec une version mobile et desktop
 * Supporte le défilement pour les écrans de petite taille
 */
export default function Sidebar() {
  const { adminUser, session } = useAuth();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  // Groupes de menu avec leurs sous-éléments
  const menuGroups = [
    {
      title: 'Principal',
      items: [
        { 
          name: 'Tableau de bord', 
          href: '/admin/dashboard', 
          icon: <LayoutDashboard className="mr-3 h-5 w-5" /> 
        }
      ]
    },
    {
      title: 'Business',
      items: [
        { 
          name: 'Business', 
          href: '/admin/businesses', 
          icon: <Store className="mr-3 h-5 w-5" /> 
        },
        { 
          name: 'Prospects', 
          href: '/admin/leads', 
          icon: <MessageSquare className="mr-3 h-5 w-5" /> 
        },
      ]
    },
    {
      title: 'Formations',
      items: [
        { 
          name: 'Formations', 
          href: '/admin/formations', 
          icon: <BookOpen className="mr-3 h-5 w-5" /> 
        },
        { 
          name: 'Inscriptions', 
          href: '/admin/enrollments', 
          icon: <GraduationCap className="mr-3 h-5 w-5" /> 
        }
      ]
    },
    {
      title: 'Marques',
      items: [
        { 
          name: 'Marques', 
          href: '/admin/marques', 
          icon: <Package className="mr-3 h-5 w-5" /> 
        }
      ]
    },
    {
      title: 'Marketing',
      items: [
        { 
          name: 'Liste WhatsApp', 
          href: '/admin/whatsapp-subscribers', 
          icon: <WhatsAppIcon className="mr-3 h-5 w-5" /> 
        },
        { 
          name: 'Réseaux sociaux', 
          href: '/admin/social', 
          icon: <Share2 className="mr-3 h-5 w-5" /> 
        }
      ]
    },
    {
      title: 'Gestion',
      items: [
        { 
          name: 'Utilisateurs', 
          href: '/admin/users', 
          icon: <Users className="mr-3 h-5 w-5" /> 
        },
        { 
          name: 'Paramètres', 
          href: '/admin/settings', 
          icon: <Settings className="mr-3 h-5 w-5" /> 
        }
      ]
    }
  ];

  // Fonction pour déterminer si un élément est actif
  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(`${href}/`);
  };
  
  // Toggle du menu sur mobile
  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  // Toggle du collapse sur desktop
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Déconnexion
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      // Forcer la redirection vers login après déconnexion
      window.location.href = '/admin/login';
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <>
      {/* Bouton du menu mobile (affiché uniquement sur mobile) */}
      <div className="md:hidden fixed top-4 left-4 z-30">
        <button 
          onClick={toggleMobileMenu}
          className="p-2 rounded-md bg-white shadow-md text-[#0f4c81]"
        >
          {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Overlay quand le menu mobile est ouvert */}
      {isMobileOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={toggleMobileMenu}
        />
      )}
      
      {/* Sidebar principale - adaptée pour desktop et mobile */}
      <aside 
        className={`fixed inset-y-0 left-0 z-20 flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ease-in-out
          ${isCollapsed ? 'w-20' : 'w-64'} 
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* En-tête avec logo */}
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-4 py-6 border-b`}>
          <div className="flex items-center space-x-3">
            <div className="relative h-10 w-10 flex-shrink-0">
              <Image 
                src="/images/logo.png"
                alt="TEKKI Studio"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="text-xl font-bold text-[#0f4c81]">TEKKI Studio</span>
                <span className="text-xs text-gray-500">Panel Administrateur</span>
              </div>
            )}
          </div>
          
          {/* Bouton de collapse visible uniquement sur desktop */}
          <button 
            onClick={toggleCollapse}
            className="hidden md:block text-gray-500 hover:text-[#0f4c81]"
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
        
        {/* Corps du menu avec défilement si nécessaire */}
        <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
          {menuGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="mb-6">
              {!isCollapsed && (
                <h3 className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {group.title}
                </h3>
              )}
              <ul className="space-y-1">
                {group.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <Link
                      href={item.href}
                      className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors
                        ${isActive(item.href) 
                          ? 'bg-[#ff7f50]/10 text-[#ff7f50]' 
                          : 'text-gray-700 hover:bg-gray-100'
                        }
                        ${isCollapsed ? 'justify-center' : ''}
                      `}
                    >
                      {/* L'icône est toujours visible */}
                      {item.icon}
                      
                      {/* Le texte n'est visible que si la sidebar n'est pas réduite */}
                      {!isCollapsed && (
                        <span>{item.name}</span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        {/* Pied de page avec bouton de déconnexion */}
        <div className="border-t border-gray-200 p-4">
          <button
            onClick={handleLogout}
            className={`flex items-center w-full px-4 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 transition-colors
              ${isCollapsed ? 'justify-center' : ''}
            `}
          >
            <LogOut className="h-5 w-5" />
            {!isCollapsed && <span className="ml-3">Déconnexion</span>}
          </button>
        </div>
      </aside>
    </>
  );
}