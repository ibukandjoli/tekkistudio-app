// app/components/home/HowItWorks.tsx
'use client';

import React from 'react';
import { 
  Search, 
  PhoneCall, 
  FileCheck, 
  Rocket, 
  CheckCircle
} from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: <Search className="w-10 h-10 text-[#ff7f50]" />,
      title: "1. Explorez",
      description: "Parcourez notre catalogue de business et sélectionnez celui qui correspond à vos objectifs et votre budget."
    },
    {
      icon: <PhoneCall className="w-10 h-10 text-[#ff7f50]" />,
      title: "2. Découvrez",
      description: "Remplissez le formulaire de manifestation d'intérêt. Notre équipe vous contactera sous 24h pour discuter des détails."
    },
    {
      icon: <FileCheck className="w-10 h-10 text-[#ff7f50]" />,
      title: "3. Acquérez",
      description: "Finalisez l'acquisition avec notre processus sécurisé, incluant tous les transferts légaux et techniques."
    },
    {
      icon: <Rocket className="w-10 h-10 text-[#ff7f50]" />,
      title: "4. Développez",
      description: "Prenez en main votre business avec notre accompagnement personnalisé et commencez à générer des revenus."
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0f4c81] mb-4">
            Comment ça marche
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Notre processus simplifié pour acquérir et démarrer votre business en ligne
          </p>
        </div>

        {/* Étapes du processus - version desktop */}
        <div className="hidden md:flex justify-between max-w-6xl mx-auto mb-16 relative">
          {/* Ligne de connexion */}
          <div className="absolute top-1/3 left-0 right-0 h-0.5 bg-gray-200 -z-1"></div>

          {/* Steps with circles */}
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center z-10 w-64">
              <div className="w-24 h-24 bg-white rounded-full shadow-lg flex items-center justify-center mb-6 border-2 border-[#ff7f50]">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold text-[#0f4c81] mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>

        {/* Étapes du processus - version mobile */}
        <div className="md:hidden space-y-8 max-w-md mx-auto mb-12"> {/* Ajout de mb-12 pour créer plus d'espace */}
          {steps.map((step, index) => (
            <div key={index} className="flex items-start">
              <div className="w-16 h-16 bg-white rounded-full shadow-md flex items-center justify-center mr-4 border-2 border-[#ff7f50] flex-shrink-0">
                {step.icon}
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#0f4c81] mb-1">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Encadré d'accompagnement */}
        <div className="bg-gradient-to-r from-[#0f4c81] to-[#1a5a8f] rounded-2xl shadow-xl p-8 max-w-4xl mx-auto text-white">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="md:w-1/4 flex justify-center">
              <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-[#ff7f50]" />
              </div>
            </div>
            <div className="md:w-3/4 text-center md:text-left">
              <h3 className="text-2xl font-bold mb-3">
                Accompagnement garanti
              </h3>
              <p className="text-white/90 mb-6">
                Chacun de nos business est livré avec une formation, un accompagnement de 2 mois
                et tous les outils nécessaires pour réussir votre lancement.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-2xl font-bold text-[#ff7f50]">2</div>
                  <div className="text-white/80 text-sm">Mois de suivi personnalisé</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-2xl font-bold text-[#ff7f50]">24h</div>
                  <div className="text-white/80 text-sm">Temps de réponse max</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-2xl font-bold text-[#ff7f50]">100%</div>
                  <div className="text-white/80 text-sm">Taux de satisfaction</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="text-2xl font-bold text-[#ff7f50]">∞</div>
                  <div className="text-white/80 text-sm">Support technique</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;