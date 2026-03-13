// app/careers/thank-you/page.tsx - Version corrigée
'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle2, ArrowLeft, FileText } from 'lucide-react';
import Container from '@/app/components/ui/Container';

const ThankYouPage = () => {
  // Effet pour configurer le header - version améliorée
  useEffect(() => {
    // Fonction pour mettre à jour la classe du header
    const updateHeaderClass = () => {
      const header = document.querySelector('header');
      if (header) {
        // Ajouter une classe spéciale pour les pages de carrières
        header.classList.add('careers-header');
        
        // Appliquer le style directement via stylesheet pour assurer qu'il prend priorité
        const styleElement = document.createElement('style');
        styleElement.setAttribute('id', 'careers-header-style');
        styleElement.textContent = `
          header.careers-header {
            background-color: var(--tekki-blue, #0f4c81) !important;
            color: white !important;
          }
          header.careers-header a, 
          header.careers-header button {
            color: white !important;
          }
        `;
        document.head.appendChild(styleElement);
      }
    };

    // Appliquer immédiatement
    updateHeaderClass();

    // Nettoyer lors du démontage du composant
    return () => {
      const header = document.querySelector('header');
      const styleElement = document.getElementById('careers-header-style');
      
      if (header) {
        header.classList.remove('careers-header');
      }
      
      if (styleElement) {
        styleElement.remove();
      }
    };
  }, []);

  return (
    <main className="pb-20">
      {/* Hero section minimaliste pour garantir la visibilité des éléments du header */}
      <div className="bg-gradient-to-r from-tekki-blue to-tekki-coral py-12 pt-28 text-white">
        <Container>
          <div className="flex justify-center mb-2">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">
            Merci pour votre candidature !
          </h1>
        </Container>
      </div>
      
      <Container className="mt-10">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center mb-8">            
            <p className="text-lg text-gray-600 mb-6">
              Nous avons bien reçu votre candidature et nous l'examinerons avec attention.
            </p>
            
            <div className="border-t border-gray-200 pt-6 mt-6">
              <h2 className="font-bold text-xl text-tekki-blue mb-4">
                Et maintenant ?
              </h2>
              
              <ul className="space-y-3 text-left max-w-md mx-auto">
                <li className="flex items-start">
                  <div className="bg-tekki-coral/10 rounded-full p-1 mr-3 mt-0.5">
                    <span className="flex items-center justify-center w-5 h-5 text-tekki-coral font-bold">1</span>
                  </div>
                  <span className="text-gray-700">
                    Notre équipe de recrutement passera en revue votre dossier dans les prochains jours.
                  </span>
                </li>
                
                <li className="flex items-start">
                  <div className="bg-tekki-coral/10 rounded-full p-1 mr-3 mt-0.5">
                    <span className="flex items-center justify-center w-5 h-5 text-tekki-coral font-bold">2</span>
                  </div>
                  <span className="text-gray-700">
                    Si votre profil correspond à nos besoins, nous vous contacterons pour un premier entretien.
                  </span>
                </li>
                
                <li className="flex items-start">
                  <div className="bg-tekki-coral/10 rounded-full p-1 mr-3 mt-0.5">
                    <span className="flex items-center justify-center w-5 h-5 text-tekki-coral font-bold">3</span>
                  </div>
                  <span className="text-gray-700">
                    Vous recevrez dans tous les cas une réponse de notre part, généralement sous 10 jours ouvrés.
                  </span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/careers"
              className="flex items-center justify-center bg-tekki-blue hover:bg-tekki-blue/90 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voir d'autres offres
            </Link>
            
            <Link
              href="/business"
              className="flex items-center justify-center border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <FileText className="h-4 w-4 mr-2" />
              Explorer nos business
            </Link>
          </div>
        </div>
      </Container>
    </main>
  );
};

export default ThankYouPage;