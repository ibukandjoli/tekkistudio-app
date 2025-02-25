// app/components/home/Hero.tsx
'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const HeroSection = () => {
  return (
    <div className="relative bg-[#0f4c81] min-h-screen flex items-center overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-12 h-full">
          {[...Array(48)].map((_, i) => (
            <div key={i} className="border border-white/20" />
          ))}
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-white">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              Lancez votre Business dans l'E-commerce
              <span className="block text-[#ff7f50]">Sans Partir de Zéro</span>
            </h1>
            <p className="text-xl mb-8 text-gray-200 leading-relaxed">
              Gagnez un temps précieux en acquérant un business e-commerce clé en main, testé et prêt à générer des revenus. Plus besoin de passer des mois à tout créer depuis le début.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/business" 
                className="bg-[#ff7f50] text-white px-8 py-4 rounded-lg flex items-center gap-2 hover:bg-[#ff6b3d] transition-colors whitespace-nowrap"
              >
                Voir nos business disponibles
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                href="/marques" 
                className="border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-[#0f4c81] transition-colors whitespace-nowrap"
              >
                Découvrir nos marques
              </Link>
            </div>
          </div>
          
          <div className="flex-1 relative w-full max-w-lg">
            <div className="relative z-10 bg-[#F2F2F2] p-8 rounded-xl shadow-2xl">
              <h3 className="text-[#0f4c81] text-2xl font-bold mb-6">
                Chacun de nos business inclut :
              </h3>
              <ul className="space-y-4">
                {[
                  {
                    text: "Site e-commerce optimisé et prêt à l'emploi",
                    subtext: "Commencez à vendre immédiatement"
                  },
                  {
                    text: "Fournisseurs qualifiés et produits sourcés",
                    subtext: "Évitez des mois de recherche et de négociation"
                  },
                  {
                    text: "Stratégie marketing complète",
                    subtext: "Plan marketing testé et validé"
                  },
                  {
                    text: "Formation et accompagnement",
                    subtext: "2 mois d'accompagnement pour votre réussite"
                  }
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#ff7f50] mt-2" />
                    <div>
                      <span className="text-gray-700 font-medium text-lg">{item.text}</span>
                      <p className="text-gray-500 text-sm mt-1">{item.subtext}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;