// app/components/home/HowItWorks.tsx
'use client';

import React from 'react';
import { ClipboardCheck, Package, BadgeCheck, Rocket } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: <ClipboardCheck className="w-10 h-10 text-[#ff7f50]" />,
      title: "1. Choisissez votre business",
      description: "Parcourez nos business en vente et sélectionnez celui qui correspond à vos objectifs et votre budget."
    },
    {
      icon: <Package className="w-10 h-10 text-[#ff7f50]" />,
      title: "2. Manifestez votre intérêt",
      description: "Remplissez le formulaire de manifestation d'intérêt. Notre équipe vous contactera sous 24h pour discuter des détails."
    },
    {
      icon: <BadgeCheck className="w-10 h-10 text-[#ff7f50]" />,
      title: "3. Signez le contrat de cession",
      description: "Une fois les modalités convenues, signez le contrat et procédez au paiement selon l'option choisie."
    },
    {
      icon: <Rocket className="w-10 h-10 text-[#ff7f50]" />,
      title: "4. Lancez votre business",
      description: "Recevez votre business complet avec formation, support et accès à tous les outils pour démarrer."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#0f4c81] mb-4">
            Comment ça marche
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Un processus simple et transparent pour acquérir votre business clé en main.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative bg-white p-6 rounded-xl shadow-lg border border-gray-100"
            >
              <div className="flex items-center justify-center h-20 mb-6">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold text-[#0f4c81] mb-4 text-center">
                {step.title}
              </h3>
              <p className="text-gray-600 text-center">
                {step.description}
              </p>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute -right-4 top-1/2 transform -translate-y-1/2 z-10">
                  <div className="w-8 h-0.5 bg-[#ff7f50]" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-block bg-[#F2F2F2] rounded-lg p-6 max-w-2xl">
            <h3 className="text-lg font-bold text-[#0f4c81] mb-2">
              Accompagnement garanti
            </h3>
            <p className="text-gray-600">
              Chacun de nos business est livré avec une formation, un accompagnement de 2 mois 
              et tous les outils nécessaires pour réussir votre lancement.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;