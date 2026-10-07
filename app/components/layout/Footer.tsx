// app/components/layout/Footer.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Smartphone, ArrowRight } from 'lucide-react';

const linkClass =
  'text-tekki-ink-soft hover:text-tekki-orange transition-colors text-sm rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-tekki-orange/50 focus-visible:ring-offset-2 focus-visible:ring-offset-tekki-surface-warm';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();

  if (pathname.startsWith('/admin')) return null;

  return (
    <footer className="bg-tekki-surface-warm text-tekki-ink pt-16 pb-8 relative overflow-hidden border-t border-tekki-ink/8">
      {/* Subtle decoration */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-tekki-orange/[0.05] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
          {/* Col 1 : Logo + Tagline */}
          <div>
            <img
              src="/images/tekkistudio/logo_black.svg"
              alt="TEKKI Studio"
              className="h-9 w-auto mb-4"
            />
            <p className="text-tekki-ink-soft mb-6 leading-relaxed text-sm">
              La Fabrique de Marques Africaines.
            </p>

            <div className="flex gap-3 mb-6">
              {[
                { icon: Facebook, href: 'https://facebook.com/tekkistudio', label: 'Facebook' },
                { icon: Instagram, href: 'https://instagram.com/tekkistudio', label: 'Instagram' },
                { icon: Linkedin, href: 'https://linkedin.com/company/tekkistudio', label: 'LinkedIn' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 bg-tekki-ink/5 hover:bg-tekki-orange active:scale-95 rounded-full flex items-center justify-center transition-all duration-300 group outline-none focus-visible:ring-2 focus-visible:ring-tekki-orange/50 focus-visible:ring-offset-2 focus-visible:ring-offset-tekki-surface-warm"
                >
                  <Icon className="w-4 h-4 text-tekki-ink-soft group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>

            <Image
              src="/images/tekkistudio/partner-shopify.png"
              alt="Shopify Partner"
              width={140}
              height={56}
              className="invert opacity-50 hover:opacity-80 transition-opacity"
            />
          </div>

          {/* Col 2 : L'Entreprise */}
          <div>
            <h3 className="font-home-display text-[15px] font-semibold text-tekki-ink mb-5">L&apos;Entreprise</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/a-propos" className={linkClass}>
                  À propos
                </Link>
              </li>
              <li>
                <Link href="/cas-clients" className={linkClass}>
                  Cas Clients
                </Link>
              </li>
              <li>
                <Link href="/nos-marques" className={linkClass}>
                  Nos Marques
                </Link>
              </li>
              <li>
                <Link href="/careers" className={linkClass}>
                  Carrières
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3 : Nos Marques */}
          <div>
            <h3 className="font-home-display text-[15px] font-semibold text-tekki-ink mb-5">Nos Marques</h3>
            <ul className="space-y-3">
              <li>
                <a href="https://viensonsconnait.com" target="_blank" rel="noopener noreferrer" className={linkClass}>
                  Viens on s&apos;connaît
                </a>
              </li>
              <li>
                <a href="https://amani-femme.myshopify.com/" target="_blank" rel="noopener noreferrer" className={linkClass}>
                  Amani
                </a>
              </li>
              <li>
                <a href="https://itokobeauty.com" target="_blank" rel="noopener noreferrer" className={linkClass}>
                  Itoko Beauty
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4 : Contact */}
          <div>
            <h3 className="font-home-display text-[15px] font-semibold text-tekki-ink mb-5">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 mt-0.5 flex-shrink-0 text-tekki-orange" />
                <a href="mailto:hello@tekkistudio.com" className={linkClass}>
                  hello@tekkistudio.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 mt-0.5 flex-shrink-0 text-tekki-orange" />
                <a href="tel:+221767826804" className={linkClass}>
                  +221 76 782 68 04
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Smartphone className="w-4 h-4 mt-0.5 flex-shrink-0 text-tekki-orange" />
                <a
                  href="https://wa.me/221781362728?text=Bonjour%20TEKKI%20Studio%20!"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  +221 78 136 27 28 (WhatsApp)
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-tekki-orange" />
                <span className="text-tekki-ink-soft text-sm">Dakar, Sénégal</span>
              </li>
            </ul>

            <div className="mt-6">
              <Link
                href="/diagnostic"
                className="flex items-center justify-center gap-2 w-full bg-tekki-orange hover:bg-tekki-orange-hover active:scale-[0.98] text-white py-3 rounded-full font-semibold text-sm transition-all outline-none focus-visible:ring-2 focus-visible:ring-tekki-orange/50 focus-visible:ring-offset-2 focus-visible:ring-offset-tekki-surface-warm"
              >
                Faire le diagnostic
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-tekki-ink/8 pt-8 text-center text-tekki-ink-soft text-sm">
          <p>&copy; {currentYear} TEKKI Studio. Tous droits réservés.</p>
          <div className="mt-3 flex flex-wrap justify-center gap-2 text-xs">
            <Link href="/mentions-legales" className="hover:text-tekki-orange transition-colors rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-tekki-orange/50 focus-visible:ring-offset-2 focus-visible:ring-offset-tekki-surface-warm">
              Mentions légales
            </Link>
            <span className="text-tekki-ink/20">&middot;</span>
            <Link href="/politique-confidentialite" className="hover:text-tekki-orange transition-colors rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-tekki-orange/50 focus-visible:ring-offset-2 focus-visible:ring-offset-tekki-surface-warm">
              Politique de confidentialité
            </Link>
            <span className="text-tekki-ink/20">&middot;</span>
            <Link href="/cgv" className="hover:text-tekki-orange transition-colors rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-tekki-orange/50 focus-visible:ring-offset-2 focus-visible:ring-offset-tekki-surface-warm">
              CGV
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
