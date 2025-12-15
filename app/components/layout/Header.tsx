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
    { label: 'Le Labo TEKKI', href: '/nos-marques' },
    { label: 'Nos Formules', href: '/nos-formules' },
    { label: 'Cas Clients', href: '/cas-clients' },
    { label: 'A Propos', href: '/a-propos' },
  ];

  return (
    <header
        className={`fixed w-full top-0 z-50 transition-all duration-300
          ${isScrolled || isOpen ? 'bg-gradient-to-br from-gray-900 via-[#0f4c81] to-gray-900 shadow-2xl backdrop-blur-sm' : 'lg:bg-transparent bg-gradient-to-br from-gray-900/95 via-[#0f4c81]/95 to-gray-900/95 backdrop-blur-sm'}`}>

      <div className="w-full px-6 md:px-12 lg:px-16 xl:px-20">
        <div className="flex justify-between items-center h-20 py-6">
          <Link href="/" className="flex items-center space-x-2 group">
            <img
                src="/images/tekkistudio/logo.svg"
                alt="TEKKI Studio"
                className="w-150 h-10 transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* Menu de navigation - visible uniquement sur desktop */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-white hover:text-[#fe6117] transition-all font-medium relative group ${
                  pathname === item.href ? 'text-[#fe6117]' : ''
                }`}
              >
                {item.label}
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-[#fe6117] transition-transform origin-left ${
                  pathname === item.href ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`}></span>
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            {/* Bouton CTA Principal - visible sur tablette et desktop */}
            <Link
              href="https://calendly.com/tekki-studio/consultation-gratuite"
              className="hidden sm:inline-flex items-center bg-[#fe6117] text-white px-6 py-3 rounded-full hover:bg-[#e55710] transition-all font-bold whitespace-nowrap shadow-lg hover:shadow-xl hover:scale-105"
            >
              Réserver un appel
            </Link>

            {/* Bouton hamburger - visible sur mobile et tablette */}
            <button
              className="lg:hidden text-white p-2 hover:bg-white/10 rounded-full transition-all"
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
                className={`block py-3 text-white hover:text-[#fe6117] font-medium transition-colors ${
                  pathname === item.href ? 'text-[#fe6117]' : ''
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            {/* Version mobile du CTA */}
            <div className="sm:hidden mt-4 pt-4 border-t border-white/10">
              <Link
                href="https://calendly.com/tekki-studio/consultation-gratuite"
                className="block bg-[#fe6117] text-white px-6 py-3 rounded-full text-center font-bold hover:bg-[#e55710] transition-all shadow-lg"
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