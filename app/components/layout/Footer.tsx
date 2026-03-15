// app/components/layout/Footer.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Smartphone, ArrowRight } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();

  if (pathname.startsWith('/admin')) return null;

  return (
    <footer className="bg-tekki-blue text-white pt-16 pb-8 relative overflow-hidden">
      {/* Subtle decoration */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-tekki-orange/5 rounded-full blur-[120px]" />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
          {/* Col 1 : Logo + Tagline */}
          <div>
            <img
              src="/images/tekkistudio/logo.svg"
              alt="TEKKI Studio"
              className="h-10 w-auto mb-4"
            />
            <p className="text-white/70 mb-6 leading-relaxed text-sm">
              La Fabrique de Marques Africaines.
            </p>

            <div className="flex gap-3 mb-6">
              {[
                { icon: Facebook, href: 'https://facebook.com/tekkistudio' },
                { icon: Instagram, href: 'https://instagram.com/tekkistudio' },
                { icon: Linkedin, href: 'https://linkedin.com/company/tekkistudio' },
              ].map(({ icon: Icon, href }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-white/10 hover:bg-tekki-orange rounded-full flex items-center justify-center transition-all duration-300"
                >
                  <Icon className="w-4 h-4 text-white/80" />
                </a>
              ))}
            </div>

            <Image
              src="/images/tekkistudio/partner-shopify.png"
              alt="Shopify Partner"
              width={140}
              height={56}
              className="opacity-70 hover:opacity-100 transition-opacity"
            />
          </div>

          {/* Col 2 : L'Entreprise */}
          <div>
            <h3 className="font-heading text-lg font-bold mb-5">L'Entreprise</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/a-propos" className="text-white/60 hover:text-tekki-orange transition-colors text-sm">
                  À propos
                </Link>
              </li>
              <li>
                <Link href="/cas-clients" className="text-white/60 hover:text-tekki-orange transition-colors text-sm">
                  Cas Clients
                </Link>
              </li>
              <li>
                <Link href="/nos-marques" className="text-white/60 hover:text-tekki-orange transition-colors text-sm">
                  Nos Marques
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-white/60 hover:text-tekki-orange transition-colors text-sm">
                  Carrières
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3 : Nos Marques */}
          <div>
            <h3 className="font-heading text-lg font-bold mb-5">Nos Marques</h3>
            <ul className="space-y-3">
              <li>
                <a href="https://viensonsconnait.com" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-tekki-orange transition-colors text-sm">
                  Viens on s'connaît
                </a>
              </li>
              <li>
                <a href="https://amani-femme.myshopify.com/" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-tekki-orange transition-colors text-sm">
                  Amani
                </a>
              </li>
              <li>
                <a href="https://kusomakids.com" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-tekki-orange transition-colors text-sm">
                  KusomaKids
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4 : Contact */}
          <div>
            <h3 className="font-heading text-lg font-bold mb-5">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 mt-0.5 flex-shrink-0 text-tekki-orange" />
                <a href="mailto:hello@tekkistudio.com" className="text-white/60 hover:text-tekki-orange transition-colors text-sm">
                  hello@tekkistudio.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 mt-0.5 flex-shrink-0 text-tekki-orange" />
                <a href="tel:+221338205422" className="text-white/60 hover:text-tekki-orange transition-colors text-sm">
                  +221 33 820 54 22
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Smartphone className="w-4 h-4 mt-0.5 flex-shrink-0 text-tekki-orange" />
                <a
                  href="https://wa.me/221781362728?text=Bonjour%20TEKKI%20Studio%20!"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-tekki-orange transition-colors text-sm"
                >
                  +221 78 136 27 28 (WhatsApp)
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-tekki-orange" />
                <span className="text-white/60 text-sm">Dakar, Sénégal</span>
              </li>
            </ul>

            <div className="mt-6">
              <Link
                href="/diagnostic"
                className="flex items-center justify-center gap-2 w-full bg-tekki-orange hover:bg-tekki-orange-hover text-white py-3 rounded-full font-semibold text-sm transition-all"
              >
                Faire le diagnostic
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 pt-8 text-center text-white/50 text-sm">
          <p>&copy; {currentYear} TEKKI Studio. Tous droits réservés.</p>
          <div className="mt-3 flex flex-wrap justify-center gap-2 text-xs">
            <Link href="/mentions-legales" className="hover:text-tekki-orange transition-colors">
              Mentions légales
            </Link>
            <span className="text-white/20">&middot;</span>
            <Link href="/politique-confidentialite" className="hover:text-tekki-orange transition-colors">
              Politique de confidentialité
            </Link>
            <span className="text-white/20">&middot;</span>
            <Link href="/cgv" className="hover:text-tekki-orange transition-colors">
              CGV
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
