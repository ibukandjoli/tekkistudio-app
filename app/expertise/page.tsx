// app/expertise/page.tsx
'use client';

import React from 'react';
import { Lightbulb, Target, Rocket, Users, Heart, Leaf } from 'lucide-react';

const ExpertisePage = () => {
  const values = [
    {
      icon: <Lightbulb className="w-8 h-8 text-[#ff7f50]" />,
      name: "Innovation",
      description: "Recherche constante de solutions créatives et novatrices pour résoudre des problèmes de niche."
    },
    {
      icon: <Target className="w-8 h-8 text-[#ff7f50]" />,
      name: "Qualité",
      description: "Engagement inébranlable envers l'excellence dans chaque produit et service que nous développons."
    },
    {
      icon: <Rocket className="w-8 h-8 text-[#ff7f50]" />,
      name: "Utilité",
      description: "Création de solutions qui apportent une réelle valeur ajoutée aux consommateurs, principalement en Afrique."
    },
    {
      icon: <Leaf className="w-8 h-8 text-[#ff7f50]" />,
      name: "Durabilité",
      description: "Conception de produits et de solutions respectueux de l'environnement et durables."
    },
    {
      icon: <Heart className="w-8 h-8 text-[#ff7f50]" />,
      name: "Passion",
      description: "Enthousiasme et dévouement dans chaque projet de marque ou de business e-commerce que nous entreprenons."
    },
    {
      icon: <Users className="w-8 h-8 text-[#ff7f50]" />,
      name: "Intégrité",
      description: "Maintien des plus hauts standards d'éthique dans toutes nos activités."
    }
  ];

  return (
    <main>
      {/* Hero Section */}
      <section className="bg-[#0f4c81] relative min-h-[400px] flex items-center">
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-12 h-full">
            {[...Array(48)].map((_, i) => (
              <div key={i} className="border border-white/20" />
            ))}
          </div>
        </div>

        <div className="container mx-auto px-4 py-32 relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Notre Expertise
            </h1>
            <p className="text-xl opacity-90">
              Première Fabrique de Marques de Niche d'Afrique de l'Ouest, spécialisée dans la création de marques de produits qui résolvent des problèmes de niche.
            </p>
          </div>
        </div>
      </section>

      {/* À Propos Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-lg text-gray-600 mb-8">
              <span className="font-bold text-[#0f4c81]">TEKKI Studio</span> est une Fabrique de Marques de Niche, c'est-à-dire le lieu de naissance de marques de produits innovants qui apportent des solutions pratiques, spécifiques et efficaces à des problèmes de niche.
            </p>
          </div>
        </div>
      </section>

      {/* Notre Approche */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-[#0f4c81] text-center mb-12">
            Notre Approche
          </h2>
          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold text-[#0f4c81] mb-4">
                Identification des Besoins
              </h3>
              <p className="text-gray-600">
                Nous identifions des besoins non satisfaits au sein de niches spécifiques et développons des produits sur mesure pour y répondre.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold text-[#0f4c81] mb-4">
                Validation du Marché
              </h3>
              <p className="text-gray-600">
                Nous nous donnons trois mois pour trouver un product market fit, autrement dit la validation du produit par la cible visée.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stratégie de Croissance */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-[#0f4c81] text-center mb-12">
            Notre Stratégie de Croissance
          </h2>
          <div className="max-w-3xl mx-auto">
            <div className="bg-gray-50 p-8 rounded-xl">
              <p className="text-gray-600 mb-6">
                Lorsqu'une de nos marques atteint un succès initial, nous passons à l'étape suivante en engageant un Brand Manager pour l'amener vers d'autres sommets. Cette personne prend en charge le développement continu de la marque, ce qui nous permet de nous focaliser sur la création de nouvelles marques.
              </p>
              <p className="text-gray-600">
                Cela assure non seulement une attention soutenue à chaque marque de notre portefeuille, mais renforce également notre mission d'innovation constante.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Nos Valeurs */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-[#0f4c81] text-center mb-12">
            Nos Valeurs
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg text-center">
                <div className="flex justify-center mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-[#0f4c81] mb-3">
                  {value.name}
                </h3>
                <p className="text-gray-600">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision et Mission */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-[#0f4c81] mb-6">
                Notre Vision
              </h2>
              <p className="text-gray-600">
                Notre vision est de devenir la référence africaine en matière de création de marques qui résolvent des problèmes de niche. Nous voulons être reconnus pour notre expertise en matière de branding, de marketing et de développement de produits, ainsi que pour notre engagement en faveur de l'innovation, de la qualité et de l'utilité.
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-[#0f4c81] mb-6">
                Notre Mission
              </h2>
              <p className="text-gray-600">
                Notre objectif est clair : lancer des marques qui ne se contentent pas de répondre à un problème, mais qui offrent des solutions efficaces, durables et parfaitement alignées avec les besoins du marché. Nous visons à instaurer un changement positif et durable.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ExpertisePage;