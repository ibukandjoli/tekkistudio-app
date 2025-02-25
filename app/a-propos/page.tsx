// app/a-propos/page.tsx
'use client';

import React from 'react';
import { Heart, Target, Rocket, Users, Star, Leaf } from 'lucide-react';

const AboutPage = () => {
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
              À Propos de TEKKI Studio
            </h1>
            <p className="text-xl opacity-90">
              Première Fabrique de Marques de Niche d'Afrique de l'Ouest
            </p>
          </div>
        </div>
      </section>

      {/* Notre Histoire */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
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
          <div className="max-w-3xl mx-auto">
            <p className="text-gray-600 mb-8">
              Nous identifions des besoins non satisfaits au sein de niches spécifiques et développons des produits sur mesure pour y répondre. Nous nous donnons trois mois pour trouver un product market fit, autrement dit la validation du produit par la cible visée. Si le Product Market Fit est trouvé, nous développons une marque autour du produit conçu.
            </p>
            <p className="text-gray-600">
              Cette stratégie nous permet de garantir que chaque produit que nous créons a un impact significatif et répond à de vraies demandes.
            </p>
          </div>
        </div>
      </section>

      {/* Stratégie et Mission */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <div>
              <h2 className="text-2xl font-bold text-[#0f4c81] mb-6">
                Notre Stratégie de Croissance
              </h2>
              <p className="text-gray-600">
                Lorsqu'une de nos marques atteint un succès initial, nous passons à l'étape suivante en engageant un Brand Manager pour l'amener vers d'autres sommets. Cette personne prend en charge le développement continu de la marque, ce qui nous permet de nous focaliser sur la création de nouvelles marques.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#0f4c81] mb-6">
                Notre Mission
              </h2>
              <p className="text-gray-600">
                Notre objectif est clair : lancer des marques qui ne se contentent pas de répondre à un problème, mais qui offrent des solutions efficaces, durables et parfaitement alignées avec les besoins du marché. Nous visons à instaurer un changement positif et durable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision et Valeurs */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#0f4c81] mb-6">
              Notre Vision
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Notre vision est de devenir la référence africaine en matière de création de marques qui résolvent des problèmes de niche. Nous voulons être reconnus pour notre expertise en matière de branding, de marketing et de développement de produits, ainsi que pour notre engagement en faveur de l'innovation, de la qualité et de l'utilité.
            </p>
          </div>
          
          <h2 className="text-3xl font-bold text-[#0f4c81] text-center mb-12">
            Nos Valeurs
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                icon: <Star className="w-8 h-8 text-[#ff7f50]" />,
                title: "Innovation",
                description: "Recherche constante de solutions créatives pour des problèmes spécifiques"
              },
              {
                icon: <Target className="w-8 h-8 text-[#ff7f50]" />,
                title: "Qualité",
                description: "Engagement inébranlable envers l'excellence dans chaque produit"
              },
              {
                icon: <Leaf className="w-8 h-8 text-[#ff7f50]" />,
                title: "Utilité",
                description: "Création de solutions qui apportent une réelle valeur ajoutée"
              }
            ].map((value, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-xl shadow-sm">
                <div className="flex justify-center mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-[#0f4c81] mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;