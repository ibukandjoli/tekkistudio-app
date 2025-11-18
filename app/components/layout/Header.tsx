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
    
    // Vérifier si nous sommes sur une page admin
    const isAdminPage = pathname.startsWith('/admin');
    
    useEffect(() => {
      const handleScroll = () => {
        setIsScrolled(window.scrollY > 20);
      };
      window.addEventListener('scroll', handleScroll);
      
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    
    // Ne pas afficher le header sur les pages admin
    if (isAdminPage) {
      return null;
    }

  // Structure des éléments de navigation - NOUVELLE VERSION
  const navItems = [
    { label: 'Nos Marques', href: '/nos-marques' },
    { label: 'Nos Offres', href: '/nos-formules' },
    { label: 'Cas Clients', href: '/cas-clients' },
    { label: 'A Propos', href: '/a-propos' },
  ];

  return (
    <header 
        className={`fixed w-full top-0 z-50 transition-all duration-300 
          ${isScrolled || isOpen ? 'bg-[#0f4c81] shadow-lg' : 'lg:bg-transparent bg-[#0f4c81]'}`}>

      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20 py-6">
          <Link href="/" className="flex items-center space-x-2">
            <img 
                src="/images/tekkistudio/logo.svg" 
                alt="TEKKI Studio" 
                className="w-150 h-10"
            />
          </Link>

          {/* Menu de navigation - visible uniquement sur desktop */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-white hover:text-[#ff7f50] transition-colors font-medium"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            {/* Bouton CTA Principal - visible sur tablette et desktop */}
            <Link
              href="https://calendly.com/tekki-studio/consultation-gratuite"
              className="hidden sm:block bg-[#ff7f50] text-white px-6 py-3 rounded-lg hover:bg-[#ff6b3d] transition-colors font-medium whitespace-nowrap shadow-lg hover:shadow-xl"
            >
              Réserver un appel
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
        
        {/* Menu mobile */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-white/10">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block py-3 text-white hover:text-[#ff7f50] font-medium transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            
            {/* Version mobile du CTA */}
            <div className="sm:hidden mt-4 pt-4 border-t border-white/10">
              <Link
                href="https://calendly.com/tekki-studio/consultation-gratuite"
                className="block bg-[#ff7f50] text-white px-6 py-3 rounded-lg text-center font-medium hover:bg-[#ff6b3d] transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Réserver un appel
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;