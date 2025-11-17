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
    <footer className="bg-[#0f4c81] text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
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
            <p className="text-gray-300 mb-4">
              L'agence de croissance digitale des marques africaines ambitieuses. 
              Nous transformons les marques locales en références e-commerce internationales.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com/tekkistudio" target="_blank" rel="noopener noreferrer" className="hover:text-[#ff7f50] transition-colors">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="https://instagram.com/tekkistudio" target="_blank" rel="noopener noreferrer" className="hover:text-[#ff7f50] transition-colors">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="https://linkedin.com/company/tekkistudio" target="_blank" rel="noopener noreferrer" className="hover:text-[#ff7f50] transition-colors">
                <Linkedin className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Nos Formules */}
          <div>
            <h3 className="text-xl font-bold mb-4">Nos Formules</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/nos-formules/audit-depart" className="text-gray-300 hover:text-[#ff7f50] transition-colors">
                  Audit de Départ
                </Link>
              </li>
              <li>
                <Link href="/nos-formules/demarrage" className="text-gray-300 hover:text-[#ff7f50] transition-colors">
                  Formule Démarrage
                </Link>
              </li>
              <li>
                <Link href="/nos-formules/croissance" className="text-gray-300 hover:text-[#ff7f50] transition-colors">
                  Formule Croissance
                </Link>
              </li>
              <li>
                <Link href="/nos-formules/expansion" className="text-gray-300 hover:text-[#ff7f50] transition-colors">
                  Formule Expansion
                </Link>
              </li>
              <li>
                <Link href="/nos-formules" className="text-[#ff7f50] hover:text-white font-medium transition-colors">
                  Comparer les formules →
                </Link>
              </li>
            </ul>
          </div>

          {/* Découvrir */}
          <div>
            <h3 className="text-xl font-bold mb-4">Découvrir</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/nos-marques" className="text-gray-300 hover:text-[#ff7f50] transition-colors">
                  Nos marques
                </Link>
              </li>
              <li>
                <Link href="/cas-clients" className="text-gray-300 hover:text-[#ff7f50] transition-colors">
                  Cas clients
                </Link>
              </li>
              <li>
                <Link href="/equipe" className="text-gray-300 hover:text-[#ff7f50] transition-colors">
                  Notre équipe
                </Link>
              </li>
              <li>
                <Link href="/a-propos" className="text-gray-300 hover:text-[#ff7f50] transition-colors">
                  À propos
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Mail className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                <a href="mailto:hello@tekkistudio.com" className="text-gray-300 hover:text-[#ff7f50] transition-colors">
                  hello@tekkistudio.com
                </a>
              </li>
              <li className="flex items-start">
                <Phone className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                <a href="tel:+221338205422" className="text-gray-300 hover:text-[#ff7f50] transition-colors">
                  +221 33 820 54 22
                </a>
              </li>
              <li className="flex items-start">
                <Smartphone className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                <a 
                  href="https://wa.me/221781362728?text=Bonjour%20TEKKI%20Studio%20!%20J%27aimerais%20en%20savoir%20plus%20sur%20vos%20formules%20d%27accompagnement."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-[#ff7f50] transition-colors"
                >
                  +221 78 136 27 28 (WhatsApp)
                </a>
              </li>
              <li className="flex items-start">
                <MapPin className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">
                  Dakar, Sénégal
                </span>
              </li>
            </ul>
            
            <div className="mt-6">
              <Link
                href="https://calendly.com/tekki-studio/consultation-gratuite"
                className="inline-block bg-[#ff7f50] hover:bg-[#ff6b3d] text-white px-6 py-3 rounded-lg font-medium transition-colors text-center w-full"
              >
                Réserver un appel gratuit
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 pt-8 text-center text-gray-300 text-sm">
          <p>© {currentYear} TEKKI Studio. Tous droits réservés.</p>
          <div className="mt-2 space-x-4">
            <Link href="/mentions-legales" className="hover:text-[#ff7f50] transition-colors">
              Mentions légales
            </Link>
            <span className="text-white/20">•</span>
            <Link href="/politique-confidentialite" className="hover:text-[#ff7f50] transition-colors">
              Politique de confidentialité
            </Link>
            <span className="text-white/20">•</span>
            <Link href="/cgv" className="hover:text-[#ff7f50] transition-colors">
              CGV
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;