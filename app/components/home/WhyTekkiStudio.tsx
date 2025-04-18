// app/components/home/WhyTekkiStudio.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Clock, Trophy, Users, Rocket, HeartHandshake } from 'lucide-react';

const WhyTekkiStudio = () => {
  const benefits = [
    {
      icon: <Clock className="w-8 h-8 text-[#ff7f50]" />,
      title: "Gagnez des mois de travail",
      description: "Évitez des mois de recherche de produits et de développement. Nos business sont complets et prêts à être lancés."
    },
    {
      icon: <Trophy className="w-8 h-8 text-[#ff7f50]" />,
      title: "Niches et clientèle validées",
      description: "Chaque business est stratégiquement conçu et testé par notre équipe d'experts avant d'être publié sur le site."
    },
    {
      icon: <ShoppingBag className="w-8 h-8 text-[#ff7f50]" />,
      title: "Produits & Fournisseurs fiables",
      description: "Nous identifions des fournisseurs fiables qui proposent des produits de qualité et négocions les meilleurs prix pour vous."
    },
    {
      icon: <Rocket className="w-8 h-8 text-[#ff7f50]" />,
      title: "Stratégie marketing incluse",
      description: "Pour chaque business, nous élaborons une stratégie marketing efficace pour vous permettre d'attirer vos futurs clients."
    },
    {
      icon: <Users className="w-8 h-8 text-[#ff7f50]" />,
      title: "Accompagnement de 2 mois",
      description: "Après le lancement, nous restons à vos côtés pour assurer vos premiers résultats et vous rendre autonome."
    },
    {
      icon: <HeartHandshake className="w-8 h-8 text-[#ff7f50]" />,
      title: "Formation & Support continu",
      description: "Nous vous apportons notre assistance technique et des conseils business pendant les premiers mois de votre activité."
    }
  ];

  return (
    <section className="py-20 bg-[#f8fafc]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#0f4c81] mb-4">
            Pourquoi acheter nos Business clé en main ?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Nous prenons en charge le travail chronophage et complexe de création de votre futur business, 
            afin que vous puissez vous lancer rapidement sur le marché.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="mb-4">{benefit.icon}</div>
              <h3 className="text-xl font-bold text-[#0f4c81] mb-3">
                {benefit.title}
              </h3>
              <p className="text-gray-600">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center bg-white p-8 rounded-xl shadow-lg max-w-3xl mx-auto">
          <p className="text-lg text-gray-600 mb-6">Avec 3 marques e-commerce sur le marché, plus de 50 marques et commerçants accompagnés 
            et plus de 200 aspirants e-commerçants formés, nous avons prouvé notre expertise en e-commerce.
          </p>
          <Link 
            href="/business"
            className="inline-block bg-[#ff7f50] text-white px-8 py-4 rounded-lg hover:bg-[#ff6b3d] transition-colors cursor-pointer"
          >
            Découvrez tous les business en vente
          </Link>
        </div>
      </div>
    </section>
  );
};

export default WhyTekkiStudio;