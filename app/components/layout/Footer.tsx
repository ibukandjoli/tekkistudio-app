// app/components/layout/Footer.tsx 
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Smartphone } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();

  // Ne pas afficher le footer sur les pages admin
  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-[#0f4c81] to-gray-900 text-white pt-16 pb-8 relative overflow-hidden">
      {/* Décoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#fe6117]/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-3xl"></div>

      <div className="w-full px-6 md:px-12 lg:px-16 xl:px-20 relative z-10">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* À propos */}
          <div>
            <div className="flex items-center mb-4">
              <img
                src="/images/tekkistudio/logo.svg"
                alt="TEKKI Studio"
                className="w-120 h-12 mr-3"
              />
            </div>
            <p className="text-white/80 mb-6 leading-relaxed">
              La Fabrique de marques africaines.
              Nous créons nos propres marques et transformons les marques locales en success stories e-commerce.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com/tekkistudio" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 hover:bg-[#fe6117] rounded-full flex items-center justify-center transition-all duration-300 group">
                <Facebook className="w-5 h-5 text-white/80 group-hover:text-white" />
              </a>
              <a href="https://instagram.com/tekkistudio" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 hover:bg-[#fe6117] rounded-full flex items-center justify-center transition-all duration-300 group">
                <Instagram className="w-5 h-5 text-white/80 group-hover:text-white" />
              </a>
              <a href="https://linkedin.com/company/tekkistudio" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 hover:bg-[#fe6117] rounded-full flex items-center justify-center transition-all duration-300 group">
                <Linkedin className="w-5 h-5 text-white/80 group-hover:text-white" />
              </a>
            </div>
          </div>

          {/* Nos Formules */}
          <div>
            <h3 className="text-xl font-bold mb-6">Nos Offres</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/nos-formules/audit-depart" className="text-white/80 hover:text-[#fe6117] transition-colors inline-block">
                  Audit de Départ
                </Link>
              </li>
              <li>
                <Link href="/nos-formules/demarrage" className="text-white/80 hover:text-[#fe6117] transition-colors inline-block">
                  Formule Démarrage
                </Link>
              </li>
              <li>
                <Link href="/nos-formules/croissance" className="text-white/80 hover:text-[#fe6117] transition-colors inline-block">
                  Formule Croissance
                </Link>
              </li>
              <li>
                <Link href="/nos-formules/expansion" className="text-white/80 hover:text-[#fe6117] transition-colors inline-block">
                  Formule Expansion
                </Link>
              </li>
              <li className="pt-2">
                <Link href="/nos-formules" className="text-[#fe6117] hover:text-white font-semibold transition-colors inline-block">
                  Comparer les Offres →
                </Link>
              </li>
            </ul>
          </div>

          {/* Découvrir */}
          <div>
            <h3 className="text-xl font-bold mb-6">Découvrir</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/nos-marques" className="text-white/80 hover:text-[#fe6117] transition-colors inline-block">
                  Nos marques
                </Link>
              </li>
              <li>
                <Link href="/cas-clients" className="text-white/80 hover:text-[#fe6117] transition-colors inline-block">
                  Cas clients
                </Link>
              </li>
              <li>
                <Link href="/equipe" className="text-white/80 hover:text-[#fe6117] transition-colors inline-block">
                  Notre équipe
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-white/80 hover:text-[#fe6117] transition-colors inline-block">
                  Recrutement
                </Link>
              </li>
              <li>
                <Link href="/a-propos" className="text-white/80 hover:text-[#fe6117] transition-colors inline-block">
                  À propos
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-bold mb-6">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Mail className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0 text-[#fe6117]" />
                <a href="mailto:hello@tekkistudio.com" className="text-white/80 hover:text-[#fe6117] transition-colors">
                  hello@tekkistudio.com
                </a>
              </li>
              <li className="flex items-start">
                <Phone className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0 text-[#fe6117]" />
                <a href="tel:+221338205422" className="text-white/80 hover:text-[#fe6117] transition-colors">
                  +221 33 820 54 22
                </a>
              </li>
              <li className="flex items-start">
                <Smartphone className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0 text-[#fe6117]" />
                <a
                  href="https://wa.me/221781362728?text=Bonjour%20TEKKI%20Studio%20!%20J%27aimerais%20en%20savoir%20plus%20sur%20vos%20formules%20d%27accompagnement."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-[#fe6117] transition-colors"
                >
                  +221 78 136 27 28 (WhatsApp)
                </a>
              </li>
              <li className="flex items-start">
                <MapPin className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0 text-[#fe6117]" />
                <span className="text-white/80">
                  Dakar, Sénégal
                </span>
              </li>
            </ul>

            <div className="mt-6">
              <Link
                href="https://calendly.com/tekki-studio/consultation-gratuite"
                className="inline-block bg-[#fe6117] hover:bg-[#e55710] text-white px-6 py-3 rounded-full font-bold transition-all shadow-lg hover:shadow-xl text-center w-full"
              >
                Réserver un appel gratuit
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 pt-8 text-center text-white/80 text-sm">
          <p className="font-medium">© {currentYear} TEKKI Studio. Tous droits réservés.</p>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            <Link href="/mentions-legales" className="hover:text-[#fe6117] transition-colors">
              Mentions légales
            </Link>
            <span className="text-white/30">•</span>
            <Link href="/politique-confidentialite" className="hover:text-[#fe6117] transition-colors">
              Politique de confidentialité
            </Link>
            <span className="text-white/30">•</span>
            <Link href="/cgv" className="hover:text-[#fe6117] transition-colors">
              CGV
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;