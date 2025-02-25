// app/expertise/page.tsx
'use client';

import React from 'react';
import { Lightbulb, Target, Rocket, Users, Heart, Leaf, CheckCircle, TrendingUp } from 'lucide-react';
import Link from 'next/link';

const ExpertisePage = () => {
  const values = [
    {
      icon: <Lightbulb className="w-8 h-8 text-[#ff7f50]" />,
      name: "Innovation",
      description: "Recherche constante de solutions créatives pour résoudre des problèmes de niche inexploités sur le marché africain."
    },
    {
      icon: <Target className="w-8 h-8 text-[#ff7f50]" />,
      name: "Qualité",
      description: "Engagement inébranlable envers l'excellence dans chaque produit et service, avec une attention particulière aux détails."
    },
    {
      icon: <Rocket className="w-8 h-8 text-[#ff7f50]" />,
      name: "Utilité",
      description: "Création de solutions qui apportent une réelle valeur ajoutée aux consommateurs africains, répondant à des besoins concrets."
    },
    {
      icon: <Leaf className="w-8 h-8 text-[#ff7f50]" />,
      name: "Durabilité",
      description: "Conception de produits et de solutions respectueux de l'environnement, contribuant à un avenir durable pour l'Afrique."
    },
    {
      icon: <Heart className="w-8 h-8 text-[#ff7f50]" />,
      name: "Passion",
      description: "Enthousiasme et dévouement dans chaque projet, créant des marques qui résonnent profondément avec leur audience."
    },
    {
      icon: <Users className="w-8 h-8 text-[#ff7f50]" />,
      name: "Intégrité",
      description: "Maintien des plus hauts standards d'éthique, construisant des relations de confiance durables avec nos partenaires et clients."
    }
  ];

  const successMetrics = [
    { number: "3+", label: "Marques lancées avec succès" },
    { number: "15+", label: "Business e-commerce créés" },
    { number: "85%", label: "Taux de réussite des marques" },
    { number: "200+", label: "Entrepreneurs accompagnés" }
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
              Première Fabrique de Marques de Niche d'Afrique de l'Ouest, transformant des problèmes inexploités en opportunités de marché.
            </p>
          </div>
        </div>
      </section>

      {/* À Propos Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-lg text-gray-600 mb-8">
              <span className="font-bold text-[#0f4c81]">TEKKI Studio</span> est une Fabrique de Marques de Niche qui crée, développe et lance des produits innovants répondant à des problèmes spécifiques sur le marché africain. Notre approche unique combine expertise en développement produit, branding stratégique et marketing digital pour créer des marques à fort potentiel de croissance.
            </p>
          </div>
        </div>
      </section>

      {/* Success Metrics */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {successMetrics.map((metric, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-xl shadow-sm">
                <div className="text-3xl font-bold text-[#ff7f50] mb-2">{metric.number}</div>
                <div className="text-gray-600 text-sm">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Notre Approche */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-[#0f4c81] text-center mb-12">
            Notre Approche
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-gray-50 p-8 rounded-xl shadow-lg border-t-4 border-[#ff7f50]">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-[#ff7f50] rounded-full flex items-center justify-center text-white font-bold mr-4">1</div>
                <h3 className="text-xl font-bold text-[#0f4c81]">
                  Identification des Besoins
                </h3>
              </div>
              <p className="text-gray-600">
                Nous identifions avec précision des besoins non satisfaits au sein de niches spécifiques, en utilisant des méthodologies de recherche avancées et notre connaissance approfondie du marché africain.
              </p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-xl shadow-lg border-t-4 border-[#ff7f50]">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-[#ff7f50] rounded-full flex items-center justify-center text-white font-bold mr-4">2</div>
                <h3 className="text-xl font-bold text-[#0f4c81]">
                  Validation du Marché
                </h3>
              </div>
              <p className="text-gray-600">
                Nous nous donnons trois mois pour valider le product market fit, en testant rigoureusement nos solutions auprès de la cible visée et en itérant rapidement sur base des retours obtenus.
              </p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-xl shadow-lg border-t-4 border-[#ff7f50]">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-[#ff7f50] rounded-full flex items-center justify-center text-white font-bold mr-4">3</div>
                <h3 className="text-xl font-bold text-[#0f4c81]">
                  Développement à Grande Échelle
                </h3>
              </div>
              <p className="text-gray-600">
                Une fois le product market fit validé, nous développons une stratégie de marque complète et mettons en place les ressources nécessaires pour une croissance rapide et durable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Nos Success Stories */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-[#0f4c81] text-center mb-12">
            Nos Réussites
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-lg mb-8">
              <div className="flex items-start mb-4">
                <CheckCircle className="w-6 h-6 text-green-500 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-[#0f4c81] mb-2">
                    Jeux de cartes relationnels
                  </h3>
                  <p className="text-gray-600">
                    Création d'une gamme de jeux de cartes innovante qui a transformé la façon dont les couples, les amis et familles renforcent leurs relations, avec plus de 8,000 exemplaires vendus en 2 ans.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg mb-8">
              <div className="flex items-start mb-4">
                <CheckCircle className="w-6 h-6 text-green-500 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-[#0f4c81] mb-2">
                    Ceinture chauffante pour douleurs menstruelles
                  </h3>
                  <p className="text-gray-600">
                    Développement d'une ceinture chauffante innovante qui a révolutionné le soulagement des douleurs menstruelles, avec un taux de satisfaction client de 92%.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex items-start mb-4">
                <CheckCircle className="w-6 h-6 text-green-500 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-[#0f4c81] mb-2">
                    Couches écologiques en bambou
                  </h3>
                  <p className="text-gray-600">
                    Lancement d'une marque de couches écologiques pour bébés, qui apporte une solution durable et respectueuse de l'environnement aux parents, tout en réduisant l'empreinte écologique.
                  </p>
                </div>
              </div>
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
                Notre modèle unique nous permet d'innover constamment : lorsqu'une marque atteint un succès initial, nous recrutons un Brand Manager dédié pour poursuivre son développement, tandis que notre équipe principale se concentre sur la création de nouvelles marques.
              </p>
              <p className="text-gray-600 mb-6">
                Grâce à cette approche, nous maintenons un pipeline d'innovation continu tout en assurant que chaque marque reçoit l'attention et les ressources nécessaires pour prospérer.
              </p>
              <div className="flex items-center mt-8">
                <TrendingUp className="w-10 h-10 text-[#ff7f50] mr-4" />
                <p className="text-[#0f4c81] font-semibold">
                  Cette stratégie nous a permis de multiplier par 3 notre portefeuille de marques en seulement 2 ans.
                </p>
              </div>
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
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg text-center transition-all hover:shadow-xl hover:translate-y-[-5px]">
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
              <p className="text-gray-600 mb-4">
                Devenir la référence africaine en matière de création de marques qui résolvent des problèmes de niche, reconnue tant pour notre expertise que pour notre impact positif sur la société.
              </p>
              <p className="text-gray-600">
                Nous visons à créer un écosystème d'innovation en Afrique de l'Ouest qui inspire la prochaine génération d'entrepreneurs à développer des solutions concrètes aux défis locaux.
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-[#0f4c81] mb-6">
                Notre Mission
              </h2>
              <p className="text-gray-600 mb-4">
                Identifier et résoudre des problèmes de niche à travers des marques innovantes qui transforment positivement le quotidien des consommateurs africains.
              </p>
              <p className="text-gray-600">
                Chaque produit que nous lançons doit non seulement répondre à un besoin spécifique, mais aussi créer une expérience exceptionnelle qui fidélise durablement nos clients.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-[#ff7f50] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Prêt à lancer votre propre business e-commerce ?
          </h2>
          <p className="text-xl opacity-90 max-w-3xl mx-auto mb-8">
            Découvrez nos business e-commerce clé en main, conçus pour réussir rapidement sur le marché africain.
          </p>
          <Link href="/business" className="inline-block bg-[#0f4c81] text-white px-8 py-4 rounded-lg font-bold text-lg transition-all hover:bg-[#0f4c89] hover:shadow-lg">
            Voir nos business e-commerce
          </Link>
        </div>
      </section>
    </main>
  );
};

export default ExpertisePage;