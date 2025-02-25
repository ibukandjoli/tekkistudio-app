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
    { label: 'Nos Business en vente', href: '/business' },
    { label: 'Notre Expertise', href: '/expertise' },
    { label: 'Nos Formations', href: '/formations' },
    { label: 'À Propos', href: '/about' },
  ];

  return (
    <header 
        className={`fixed w-full top-0 z-50 transition-all duration-300 ${isScrolled || isBusinessPage ? 'bg-[#0f4c81]' : 'bg-transparent'}`}>

      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20 py-6">
        <Link href="/" className="flex items-center space-x-2">
            <img 
                src="/images/tekkistudio/logo.svg" 
                alt="TEKKI Studio" 
                className="w-150 h-10"
            />
            
        </Link>

          <nav className="hidden md:flex items-center space-x-8">
            {[
              { href: '/marques', label: 'Nos Marques' },
              { href: '/business', label: 'Nos Business en vente' },
              { href: '/expertise', label: 'Notre Expertise' },
              { href: '/formations', label: 'Nos Formations' },
              { href: '/a-propos', label: 'À Propos' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white hover:text-[#ff7f50] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <Link
            href="/business"
            className="hidden md:block bg-[#ff7f50] text-white px-4 py-2 rounded-lg hover:bg-[#ff6b3d] transition-colors"
          >
            Acheter un Business
          </Link>

          <button 
            className="md:hidden text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {isOpen && (
          <div className="md:hidden py-4">
            {[
              { href: '/marques', label: 'Nos Marques' },
              { href: '/business', label: 'Nos Business en vente' },
              { href: '/expertise', label: 'Notre Expertise' },
              { href: '/formations', label: 'Nos Formations' },
              { href: '/about', label: 'À Propos' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-2 text-white hover:text-[#ff7f50]"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/business"
              className="block mt-4 bg-[#ff7f50] text-white px-4 py-2 rounded-lg text-center"
              onClick={() => setIsOpen(false)}
            >
              Acheter un Business
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;