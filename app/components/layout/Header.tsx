// app/components/layout/Header.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ArrowRight } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  const isAdminPage = pathname.startsWith('/admin');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (isAdminPage) return null;

  const navItems = [
    { label: 'Le Labo TEKKI', href: '/#differenciateur' },
    { label: 'Nos Offres', href: '/#services' },
    { label: 'Cas Clients', href: '/cas-clients' },
    { label: 'A Propos', href: '/a-propos' },
  ];

  return (
    <header
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <img
              src="/images/tekkistudio/logo_black.svg"
              alt="TEKKI Studio"
              className="h-9 w-auto transition-transform duration-300 group-hover:scale-105"
              style={{ filter: isScrolled ? 'none' : 'none' }}
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors relative group ${
                  pathname === item.href
                    ? 'text-tekki-orange'
                    : 'text-tekki-blue hover:text-tekki-orange'
                }`}
              >
                {item.label}
                <span
                  className={`absolute -bottom-1 left-0 w-full h-0.5 bg-tekki-orange transition-transform origin-left ${
                    pathname === item.href ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                />
              </Link>
            ))}
          </nav>

          {/* CTA + Hamburger */}
          <div className="flex items-center gap-3">
            <Link
              href="/diagnostic"
              className="hidden sm:inline-flex items-center gap-2 bg-tekki-orange text-white px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-tekki-orange-hover transition-all hover:scale-105 shadow-md hover:shadow-lg"
            >
              Faire le diagnostic
              <ArrowRight size={16} />
            </Link>

            {/* Hamburger mobile */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-tekki-surface transition-colors"
              aria-label="Menu"
            >
              {isOpen ? (
                <X size={24} className="text-tekki-blue" />
              ) : (
                <Menu size={24} className="text-tekki-blue" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-[300px] bg-white z-50 shadow-2xl lg:hidden flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-tekki-surface">
                <img
                  src="/images/tekkistudio/logo_black.svg"
                  alt="TEKKI Studio"
                  className="h-8 w-auto"
                />
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg hover:bg-tekki-surface transition-colors"
                >
                  <X size={20} className="text-tekki-blue" />
                </button>
              </div>

              <nav className="flex-1 p-6 flex flex-col gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="text-tekki-blue font-medium text-lg py-3 px-4 rounded-xl hover:bg-tekki-surface transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="p-6 border-t border-tekki-surface">
                <Link
                  href="/diagnostic"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 w-full bg-tekki-orange text-white py-3.5 rounded-full font-semibold hover:bg-tekki-orange-hover transition-all"
                >
                  Faire le diagnostic
                  <ArrowRight size={16} />
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
