// app/components/layout/Header.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();
    
    // Vérifier si nous sommes sur une page admin
    const isAdminPage = pathname.startsWith('/admin');
    // Vérifier si nous sommes sur une page business
    const isBusinessPage = pathname.startsWith('/business/');
    
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

  const navItems = [
    { label: 'Nos Marques', href: '/marques' },
    { label: 'Nos Business', href: '/business' },
    { label: 'Notre Expertise', href: '/expertise' },
    { label: 'Nos Formations', href: '/formations' },
    { label: 'À Propos', href: '/a-propos' },
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
            {navItems.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white hover:text-[#ff7f50] transition-colors"
              >
                {link.label}
              </Link>
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
            {navItems.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-2 text-white hover:text-[#ff7f50]"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
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