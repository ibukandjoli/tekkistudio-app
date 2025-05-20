// app/components/layout/Header.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronDown } from 'lucide-react';
import { usePathname } from 'next/navigation';

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();
    
    // États pour gérer les sous-menus déroulants
    const [openSubMenus, setOpenSubMenus] = useState({
      services: false,
      about: false
    });
    
    // Vérifier si nous sommes sur une page admin
    const isAdminPage = pathname.startsWith('/admin');
    // Vérifier si nous sommes sur une page business
    const isBusinessPage = pathname.startsWith('/business/');
    
    useEffect(() => {
      const handleScroll = () => {
        setIsScrolled(window.scrollY > 20);
      };
      window.addEventListener('scroll', handleScroll);
      
      // Fermer les sous-menus lors du défilement
      if (isScrolled) {
        setOpenSubMenus({ services: false, about: false });
      }
      
      return () => window.removeEventListener('scroll', handleScroll);
    }, [isScrolled]);
    
    // Ne pas afficher le header sur les pages admin
    if (isAdminPage) {
      return null;
    }

  // Fonction pour basculer l'état d'un sous-menu
  const toggleSubMenu = (menu: 'services' | 'about') => {
    setOpenSubMenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

  // Structure des éléments de navigation avec sous-menus
  const navItems = [
    { label: 'Nos Business', href: '/business' },
    { label: 'Nos Marques', href: '/marques' },
    { label: 'Nos Formations', href: '/formations' },
    { 
      label: 'Nos Services', 
      href: '#',
      hasSubmenu: true,
      menuKey: 'services',
      submenu: [
        { label: 'Site e-commerce', href: '/services/sites-ecommerce' }
      ]
    },
    { 
      label: 'À Propos', 
      href: '/a-propos',
      hasSubmenu: true,
      menuKey: 'about',
      submenu: [
        { label: 'Notre Histoire', href: '/a-propos' },
        { label: 'Notre Expertise', href: '/expertise' },
        { label: 'L\'équipe', href: '/equipe' },
        { label: 'Rejoignez-nous', href: '/careers' }
      ]
    },
  ];

  return (
    <header 
        className={`fixed w-full top-0 z-50 transition-all duration-300 
          ${isScrolled || isBusinessPage || isOpen ? 'bg-[#0f4c81]' : 'lg:bg-transparent bg-[#0f4c81]'}`}>

      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20 py-6">
          <Link href="/" className="flex items-center space-x-2">
            <img 
                src="/images/tekkistudio/logo.svg" 
                alt="TEKKI Studio" 
                className="w-150 h-10"
            />
          </Link>

          {/* Menu de navigation - visible uniquement sur écrans larges (desktop) */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <div key={item.href} className="relative group">
                {item.hasSubmenu ? (
                  <>
                    <button 
                      onClick={() => item.menuKey && toggleSubMenu(item.menuKey as 'services' | 'about')}
                      className="flex items-center text-white hover:text-[#ff7f50] transition-colors"
                    >
                      {item.label} <ChevronDown className="w-4 h-4 ml-1" />
                    </button>
                    {item.menuKey && openSubMenus[item.menuKey as 'services' | 'about'] && (
                      <div className="absolute left-0 mt-2 w-56 bg-white rounded-md shadow-lg py-2 z-10">
                        {item.submenu?.map((subItem) => (
                          <Link 
                            key={subItem.href} 
                            href={subItem.href}
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                            onClick={() => setOpenSubMenus({ services: false, about: false })}
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className="text-white hover:text-[#ff7f50] transition-colors"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            {/* Bouton Acheter un Business - visible sur tablette et desktop */}
            <Link
              href="/business"
              className="hidden sm:block bg-[#ff7f50] text-white px-4 py-2 rounded-lg hover:bg-[#ff6b3d] transition-colors whitespace-nowrap"
            >
              Acheter un Business
            </Link>

            {/* Bouton hamburger - visible sur mobile et tablette */}
            <button 
              className="lg:hidden text-white"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {/* Menu mobile - s'affiche quand le menu est ouvert */}
        {isOpen && (
          <div className="lg:hidden py-4">
            {navItems.map((item) => (
              <div key={item.href} className="py-2">
                {item.hasSubmenu ? (
                  <div>
                    <button 
                      onClick={() => item.menuKey && toggleSubMenu(item.menuKey as 'services' | 'about')}
                      className="flex items-center text-white hover:text-[#ff7f50] w-full text-left"
                    >
                      {item.label} <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${item.menuKey && openSubMenus[item.menuKey as 'services' | 'about'] ? 'transform rotate-180' : ''}`} />
                    </button>
                    {item.menuKey && openSubMenus[item.menuKey as 'services' | 'about'] && (
                      <div className="pl-4 mt-2 space-y-2 border-l border-white/20">
                        {item.submenu?.map((subItem) => (
                          <Link 
                            key={subItem.href} 
                            href={subItem.href}
                            className="block py-1 text-white hover:text-[#ff7f50]"
                            onClick={() => setIsOpen(false)}
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className="block text-white hover:text-[#ff7f50]"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
            
            {/* Version mobile du bouton Acheter - visible uniquement sur très petits écrans */}
            <div className="sm:hidden mt-4">
              <Link
                href="/business"
                className="block bg-[#ff7f50] text-white px-4 py-2 rounded-lg text-center"
                onClick={() => setIsOpen(false)}
              >
                Acheter un Business
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;