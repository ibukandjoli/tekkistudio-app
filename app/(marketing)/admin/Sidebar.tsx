// app/admin/Sidebar.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  Package,
  Users,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  GraduationCap,
  Gift,
  BarChart2,
  Globe,
  Briefcase,
  FileText,
  Bot,
} from 'lucide-react';
import { useAuth } from '@/app/contexts/AuthContext';
import Image from 'next/image';
import { WhatsAppIcon } from '@/app/components/icons/WhatsAppIcon';
import { supabase } from '@/app/lib/supabase';
import React from 'react';

// Créer un événement personnalisé pour notifier les changements d'état du sidebar
export const SIDEBAR_COLLAPSED_EVENT = 'sidebar-collapsed-changed';

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

  // Notifier les autres composants du changement d'état du sidebar
  useEffect(() => {
    // Émettre un événement personnalisé lorsque l'état change
    const event = new CustomEvent(SIDEBAR_COLLAPSED_EVENT, {
      detail: { isCollapsed }
    });
    window.dispatchEvent(event);

    // Définir une classe sur l'élément HTML pour faciliter les styles CSS
    document.documentElement.classList.toggle('sidebar-collapsed', isCollapsed);
  }, [isCollapsed]);

  // Groupes de menu avec leurs sous-éléments
  const menuGroups = [
    {
      title: 'Principal',
      items: [
        {
          name: 'Tableau de bord',
          href: '/admin/dashboard',
          icon: <LayoutDashboard className="h-5 w-5" />
        },
        {
          name: 'Analytics',
          href: '/admin/analytics',
          icon: <BarChart2 className="h-5 w-5" />
        }
      ]
    },
    {
      title: 'Prospects',
      items: [
        {
          name: 'Diagnostics IA',
          href: '/admin/diagnostic-leads',
          icon: <Bot className="h-5 w-5" />
        },
        {
          name: 'Prospects Sites Ecom',
          href: '/admin/ecommerce-leads',
          icon: <Gift className="h-5 w-5" />
        },
        {
          name: 'Projets Web',
          href: '/admin/site-projects',
          icon: <Globe className="h-5 w-5" />
        }
      ]
    },
    {
      title: 'Contenu',
      items: [
        {
          name: 'Nos Formations',
          href: '/admin/formations',
          icon: <BookOpen className="h-5 w-5" />
        },
        {
          name: 'Inscriptions',
          href: '/admin/enrollments',
          icon: <GraduationCap className="h-5 w-5" />
        },
        {
          name: 'Nos Marques',
          href: '/admin/marques',
          icon: <Package className="h-5 w-5" />
        }
      ]
    },
    {
      title: 'Carrières',
      items: [
        {
          name: 'Offres d\'emploi',
          href: '/admin/jobs',
          icon: <Briefcase className="h-5 w-5" />
        },
        {
          name: 'Candidatures',
          href: '/admin/applications',
          icon: <FileText className="h-5 w-5" />
        }
      ]
    },
    {
      title: 'Marketing',
      items: [
        {
          name: 'Liste WhatsApp',
          href: '/admin/whatsapp-subscribers',
          icon: <WhatsAppIcon className="h-5 w-5" />
        }
      ]
    },
    {
      title: 'Gestion',
      items: [
        {
          name: 'Utilisateurs',
          href: '/admin/users',
          icon: <Users className="h-5 w-5" />
        },
        {
          name: 'Paramètres',
          href: '/admin/settings',
          icon: <Settings className="h-5 w-5" />
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
            {/* Logo alternatif selon l'état de collapse */}
            {isCollapsed ? (
              <div className="relative h-10 w-10 flex-shrink-0">
                <Image
                  src="/images/tekkistudio/logo_icon.svg"
                  alt="TEKKI Studio"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
            ) : (
              <div className="relative h-10 w-40 flex-shrink-0">
                <Image
                  src="/images/tekkistudio/logo_blue.svg"
                  alt="TEKKI Studio"
                  width={160}
                  height={40}
                  className="object-contain"
                />
              </div>
            )}
          </div>

          {/* Bouton de collapse visible uniquement sur desktop */}
          <button
            onClick={toggleCollapse}
            className="hidden md:block text-gray-400 hover:text-[#0f4c81] transition-colors"
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>

        {/* Corps du menu avec défilement si nécessaire */}
        <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
          {menuGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="mb-4">
              {!isCollapsed && (
                <h3 className="px-4 pt-3 pb-1 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                  {group.title}
                </h3>
              )}
              {isCollapsed && groupIndex > 0 && (
                <div className="my-2 mx-3 border-t border-gray-100" />
              )}
              <ul className="space-y-0.5">
                {group.items.map((item, itemIndex) => {
                  const active = isActive(item.href);
                  return (
                    <li key={itemIndex}>
                      <Link
                        href={item.href}
                        className={`flex items-center px-3 py-2.5 text-sm font-medium transition-all rounded-none
                          ${active
                            ? 'border-l-2 border-[#ff7f50] bg-orange-50 text-[#ff7f50] pl-[10px]'
                            : 'border-l-2 border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900 pl-[10px]'
                          }
                          ${isCollapsed ? 'justify-center px-0 pl-0 border-l-0' : ''}
                        `}
                      >
                        {/* Icône */}
                        <span className={`flex-shrink-0 ${!isCollapsed ? 'mr-3' : ''} ${active ? 'text-[#ff7f50]' : 'text-gray-400'}`}>
                          {React.cloneElement(item.icon as React.ReactElement, {
                            className: `h-5 w-5`
                          })}
                        </span>

                        {/* Le texte n'est visible que si la sidebar n'est pas réduite */}
                        {!isCollapsed && (
                          <span className="truncate">{item.name}</span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Pied de page avec bouton de déconnexion */}
        <div className="border-t border-gray-200 p-3">
          <button
            onClick={handleLogout}
            className={`flex items-center w-full px-3 py-2 text-sm font-medium text-red-500 rounded-md hover:bg-red-50 transition-colors
              ${isCollapsed ? 'justify-center' : ''}
            `}
          >
            <LogOut className={`h-5 w-5 ${isCollapsed ? '' : 'mr-3'}`} />
            {!isCollapsed && <span>Déconnexion</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
