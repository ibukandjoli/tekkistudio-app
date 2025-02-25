// app/components/layout/Footer.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Smartphone, Check, AlertCircle } from 'lucide-react';
import { WhatsAppIcon } from '../../components/icons/WhatsAppIcon'; // Assurez-vous que ce composant existe

// Si le service n'existe pas encore, nous le créerons
import { supabase } from '@/app/lib/supabase';

const validatePhoneNumber = (phone: string) => {
  // Regex pour valider les numéros internationaux
  const regex = /^\+?[0-9]{8,15}$/;
  return regex.test(phone.replace(/\s+/g, ''));
};

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();
  
  // États pour le formulaire WhatsApp
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Ne pas afficher le footer sur les pages admin
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhoneNumber(value);
    setErrorMessage(null);
    
    // Validation basique
    if (value.length > 8) {
      setIsValid(validatePhoneNumber(value));
    } else {
      setIsValid(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      // Nettoyer le numéro (enlever espaces)
      const cleanedPhone = phoneNumber.replace(/\s+/g, '');
      
      // Vérifier si le numéro existe déjà
      const { data: existingSubscriber, error: checkError } = await supabase
        .from('whatsapp_subscribers')
        .select('id')
        .eq('phone', cleanedPhone)
        .single();

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = Not found
        throw new Error('Erreur lors de la vérification du numéro');
      }

      if (existingSubscriber) {
        setErrorMessage('Ce numéro est déjà inscrit à notre liste');
        setIsSubmitting(false);
        return;
      }

      // Ajouter le nouveau abonné
      const { data, error } = await supabase
        .from('whatsapp_subscribers')
        .insert([
          { 
            phone: cleanedPhone,
            country: 'SN', // Par défaut, peut être détecté selon l'indicatif
            status: 'active',
            subscribed_at: new Date().toISOString()
          }
        ])
        .select();

      if (error) throw error;

      setIsSuccess(true);
      setPhoneNumber('');
      
      // Message personnalisé pour WhatsApp
      const message = encodeURIComponent(
        "Bonjour TEKKI Studio!\n\nJe souhaite rejoindre votre liste de diffusion pour recevoir :\n" +
        "- Vos nouveaux business en vente\n" +
        "- Vos conseils e-commerce\n" +
        "- Les annonces de vos formation\n" +
        "- Les actualités de vos marques"
      );
      
      // Redirection vers WhatsApp après un court délai
      setTimeout(() => {
        window.open(
          `https://wa.me/221781362728?text=${message}`,
          '_blank'
        );
      }, 1500);

    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      setErrorMessage('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
                Première fabrique de marques d'Afrique de l'Ouest. Nous créons et vendons des business e-commerce rentables et éprouvés.
            </p>
            <div className="flex space-x-4">
                <a href="https://facebook.com/tekkistudio" className="hover:text-[#ff7f50]">
                <Facebook className="w-6 h-6" />
                </a>
                <a href="https://instagram.com/tekkistudio" className="hover:text-[#ff7f50]">
                <Instagram className="w-6 h-6" />
                </a>
                <a href="https://linkedin.com/company/tekkistudio" className="hover:text-[#ff7f50]">
                <Linkedin className="w-6 h-6" />
                </a>
            </div>
            </div>

          {/* Liens rapides */}
          <div>
            <h3 className="text-xl font-bold mb-4">Liens Rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/business" className="text-gray-300 hover:text-[#ff7f50]">
                  Business en vente
                </Link>
              </li>
              <li>
                <Link href="/marques" className="text-gray-300 hover:text-[#ff7f50]">
                  Nos marques
                </Link>
              </li>
              <li>
                <Link href="/expertise" className="text-gray-300 hover:text-[#ff7f50]">
                  Notre expertise
                </Link>
              </li>
              <li>
                <Link href="/a-propos" className="text-gray-300 hover:text-[#ff7f50]">
                  À propos
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Mail className="w-5 h-5 mr-2" />
                <a href="mailto:hello@tekkistudio.com" className="text-gray-300 hover:text-[#ff7f50]">
                  hello@tekkistudio.com
                </a>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 mr-2" />
                <a href="tel:+221338205422" className="text-gray-300 hover:text-[#ff7f50]">
                  +221 33 820 54 22
                </a>
              </li>
              <li className="flex items-center">
                <Smartphone className="w-5 h-5 mr-2" />
                <a href="tel:+221781362728" className="text-gray-300 hover:text-[#ff7f50]">
                  +221 78 136 27 28
                </a>
              </li>
              <li className="flex items-start">
                <MapPin className="w-5 h-5 mr-2 mt-1" />
                <span className="text-gray-300">
                  Dakar, Sénégal
                </span>
              </li>
            </ul>
          </div>

          {/* WhatsApp Subscription */}
          <div>
            <h3 className="text-xl font-bold mb-4">Rejoindre notre communauté</h3>
            {!isSuccess ? (
              <>
                <p className="text-gray-300 mb-4">
                  Recevez nos nouveaux business en vente et conseils e-commerce directement sur WhatsApp
                </p>
                <form onSubmit={handleSubmit} className="space-y-2">
                  <div className="relative">
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={handlePhoneChange}
                      placeholder="Votre numéro WhatsApp"
                      className={`w-full px-4 py-2 rounded-lg bg-white/10 border text-white placeholder-gray-300 focus:outline-none ${
                        isValid 
                          ? 'border-green-400 focus:border-green-500' 
                          : 'border-white/20 focus:border-[#ff7f50]'
                      }`}
                    />
                    {phoneNumber && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {isValid ? (
                          <Check className="w-5 h-5 text-green-400" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-[#ff7f50]" />
                        )}
                      </div>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={!isValid || isSubmitting}
                    className={`w-full py-2 rounded-lg flex items-center justify-center transition-colors ${
                      isValid && !isSubmitting
                        ? 'bg-[#25D366] hover:bg-[#20BD5C] text-white'
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {isSubmitting ? (
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <div className="flex items-center">
                        <WhatsAppIcon className="w-5 h-5 mr-2" />
                        <span>S'inscrire via WhatsApp</span>
                      </div>
                    )}
                  </button>
                </form>
                {errorMessage && (
                  <p className="text-[#ff7f50] text-sm mt-2">
                    {errorMessage}
                  </p>
                )}
                <p className="text-xs text-gray-400 mt-2">
                  Vous pouvez vous désabonner à tout moment en envoyant "STOP"
                </p>
              </>
            ) : (
              <div className="text-center space-y-3 p-3 bg-white/10 rounded-lg">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6 text-white" />
                </div>
                <p className="text-white font-medium">
                  WhatsApp va s'ouvrir...
                </p>
                <p className="text-gray-300 text-sm">
                  Cliquez sur "Envoyer" pour finaliser votre inscription !
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 pt-8 text-center text-gray-300">
          <p>© {currentYear} TEKKI Studio. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;