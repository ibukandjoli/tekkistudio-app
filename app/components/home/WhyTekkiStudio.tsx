// app/components/home/WhyTekkiStudio.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Clock, 
  Award, 
  Users, 
  TrendingUp, 
  ShieldCheck, 
  PackageCheck,
  ArrowRight 
} from 'lucide-react';

const WhyTekkiStudio = () => {
  const benefits = [
    {
      icon: <Clock className="w-10 h-10 text-[#0f4c81]" />,
      title: "Gagnez des mois de travail",
      description: "Évitez des mois de recherche et de développement. Nos business sont complets et prêts à être lancés."
    },
    {
      icon: <Award className="w-10 h-10 text-[#0f4c81]" />,
      title: "Niches et clientèle validées",
      description: "Chaque business est stratégiquement conçu et testé par notre équipe d'experts avant d'être mis en vente."
    },
    {
      icon: <PackageCheck className="w-10 h-10 text-[#0f4c81]" />,
      title: "Produits & Fournisseurs fiables",
      description: "Nous identifions des fournisseurs fiables qui proposent des produits de qualité et négocions les meilleurs prix."
    },
    {
      icon: <TrendingUp className="w-10 h-10 text-[#0f4c81]" />,
      title: "Stratégie marketing incluse",
      description: "Pour chaque business, nous élaborons une stratégie marketing efficace pour vous permettre d'attirer des clients."
    },
    {
      icon: <Users className="w-10 h-10 text-[#0f4c81]" />,
      title: "Accompagnement complet",
      description: "Après le lancement, nous restons à vos côtés pour assurer vos premiers résultats et vous rendre autonome."
    },
    {
      icon: <ShieldCheck className="w-10 h-10 text-[#0f4c81]" />,
      title: "Formation & Support continu",
      description: "Nous vous apportons notre assistance technique et des conseils business pendant les premiers mois de votre activité."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0f4c81] mb-4">
            Pourquoi choisir TEKKI Studio ?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Nous prenons en charge le travail chronophage et complexe de création de votre business,
            afin que vous puissiez vous lancer rapidement sur le marché.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <div 
              key={index} 
              className="bg-gray-50 p-6 rounded-xl shadow-md border border-gray-100 hover:border-[#0f4c81] hover:shadow-lg transition-all"
            >
              <div className="mb-4">
                <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
                  {benefit.icon}
                </div>
              </div>
              <h3 className="text-xl font-bold text-[#0f4c81] mb-2">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0f4c81] to-[#1a5a8f] shadow-xl p-8 md:p-12 max-w-5xl mx-auto">
          {/* Pattern en arrière-plan */}
          <div className="absolute inset-0 opacity-10">
            <div className="grid grid-cols-8 h-full">
              {[...Array(32)].map((_, i) => (
                <div key={i} className="border border-white/20" />
              ))}
            </div>
          </div>
          
          <div className="relative z-10 text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Notre expertise à votre service</h3>
            <p className="text-white/90 text-lg max-w-3xl mx-auto mb-8">
              Avec 3 marques e-commerce sur le marché, plus de 50 marques et commerçants accompagnés
              et plus de 200 aspirants e-commerçants formés, nous avons prouvé notre expertise dans le domaine.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-3xl font-bold text-white mb-1">3+</div>
                <div className="text-white/80">Marques créées</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-3xl font-bold text-white mb-1">50+</div>
                <div className="text-white/80">Marques accompagnées</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-3xl font-bold text-white mb-1">200+</div>
                <div className="text-white/80">Entrepreneurs formés</div>
              </div>
            </div>

            <Link 
              href="/business"
              className="inline-flex items-center bg-[#ff7f50] text-white px-8 py-4 rounded-lg hover:bg-[#ff6b3d] transition-colors font-medium"
            >
              Découvrir tous les business
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyTekkiStudio;