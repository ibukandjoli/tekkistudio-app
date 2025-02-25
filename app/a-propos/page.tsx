// app/a-propos/page.tsx
'use client';

import React from 'react';
import { Heart, Target, Rocket, Users, Star, Leaf, Calendar, Award, MessagesSquare } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const AboutPage = () => {
  const teamMembers = [
    {
      name: "Ibuka Ndjoli",
      role: "Fondateur & Directeur",
      // Utilisez un placeholder à moins que vous n'ayez une vraie image
      imageSrc: "/images/tekkistudio/team/ibuka.png",
      bio: "Expert en e-commerce et développement de marques avec plus de 10 ans d'expérience dans le marketing digital et la création de business innovants."
    },
    {
      name: "Sara Eanga",
      role: "Directrice des Opérations",
      imageSrc: "/images/tekkistudio/team/sara.png",
      bio: "Spécialiste en gestion de supply chain et opérations e-commerce, assurant l'excellence opérationnelle de chaque marque lancée."
    },
    {
      name: "Ibrahima Faye",
      role: "Responsable Marketing",
      imageSrc: "/images/tekkistudio/team/jeremie.png",
      bio: "Stratège marketing digital avec une expertise particulière dans le développement de marques sur les marchés africains."
    }
  ];

  const milestones = [
    { year: "2023", title: "Création de TEKKI Studio", description: "Fondation de la première Fabrique de Marques de Niche d'Afrique de l'Ouest." },
    { year: "2023", title: "Lancement de la 1ère marque", description: "Création et lancement réussi de notre première marque : VIENS ON S'CONNAÎT." },
    { year: "2024", title: "Expansion du portfolio", description: "Développement et premier tests du produit phare de de notre 2e marque : AMANI." },
    { year: "2024", title: "Lancement des business clé en main", description: "Début de notre offre de business e-commerce prêts à l'emploi pour les entrepreneurs." },
    { year: "2025", title: "Développement continu", description: "Expansion de notre portfolio de marques, avec ECOBOOM, et renforcement de notre position sur le marché ouest-africain." }
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
              À Propos de TEKKI Studio
            </h1>
            <p className="text-xl opacity-90">
              Créateurs de Marques et Business E-commerce à impact positif
            </p>
          </div>
        </div>
      </section>

      {/* Notre Histoire */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-[#0f4c81] text-center mb-8">
              Notre Histoire
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              <span className="font-bold text-[#0f4c81]">TEKKI Studio</span> est né d'une vision simple mais puissante : créer des marques qui résolvent véritablement les problèmes quotidiens des consommateurs africains. Fondée en 2023, notre entreprise est rapidement devenue un incubateur de marques innovantes qui comblent des lacunes importantes sur le marché.
            </p>
            <p className="text-lg text-gray-600 mb-6">
              Notre fondateur, passionné d'entrepreneuriat et d'innovation, a constaté que de nombreux besoins spécifiques restaient non satisfaits, particulièrement en Afrique de l'Ouest. Il a alors imaginé un modèle unique : identifier ces besoins, développer des produits sur mesure, et créer des marques fortes autour de ces solutions.
            </p>
            <p className="text-lg text-gray-600">
              Aujourd'hui, TEKKI Studio est fier d'avoir lancé avec succès trois marques distinctives et d'aider d'autres entrepreneurs à réaliser leurs ambitions grâce à nos business e-commerce clé en main.
            </p>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-[#0f4c81] text-center mb-12">
            Notre Parcours
          </h2>
          <div className="max-w-3xl mx-auto relative">
            {/* Line connecting all milestones */}
            <div className="absolute left-16 top-0 bottom-0 w-1 bg-[#0f4c81] hidden md:block"></div>
            
            {milestones.map((milestone, index) => (
              <div key={index} className="flex mb-12 last:mb-0">
                <div className="mr-8 relative hidden md:block">
                  <div className="w-12 h-12 bg-[#0f4c81] rounded-full flex items-center justify-center text-white font-bold">
                    <Calendar className="w-6 h-6" />
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md w-full md:w-auto">
                  <div className="text-[#ff7f50] font-bold mb-2">{milestone.year}</div>
                  <h3 className="text-xl font-bold text-[#0f4c81] mb-3">{milestone.title}</h3>
                  <p className="text-gray-600">{milestone.description}</p>
                </div>
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
          <div className="max-w-3xl mx-auto">
            <div className="bg-gray-50 p-8 rounded-xl shadow-md mb-8">
              <h3 className="text-2xl font-bold text-[#0f4c81] mb-4 flex items-center">
                <Target className="w-6 h-6 mr-2 text-[#ff7f50]" /> Identification des Besoins
              </h3>
              <p className="text-gray-600 mb-4">
                Nous commençons par une recherche approfondie pour identifier des besoins non satisfaits au sein de niches spécifiques. Notre processus combine analyse de marché, études des tendances et écoute attentive des consommateurs.
              </p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-xl shadow-md mb-8">
              <h3 className="text-2xl font-bold text-[#0f4c81] mb-4 flex items-center">
                <Award className="w-6 h-6 mr-2 text-[#ff7f50]" /> Développement de Produits
              </h3>
              <p className="text-gray-600 mb-4">
                Nous développons des produits sur mesure pour répondre précisément aux besoins identifiés. Nous accordons une attention particulière à la qualité, à l'efficacité et à l'expérience utilisateur.
              </p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-xl shadow-md">
              <h3 className="text-2xl font-bold text-[#0f4c81] mb-4 flex items-center">
                <MessagesSquare className="w-6 h-6 mr-2 text-[#ff7f50]" /> Validation et Itération
              </h3>
              <p className="text-gray-600 mb-4">
                Nous nous donnons trois mois pour valider le product market fit, en testant nos produits auprès de la cible visée et en itérant rapidement sur base des retours. Si le produit est validé, nous développons une marque complète autour de celui-ci.
              </p>
              <p className="text-gray-600">
                Cette approche méthodique nous permet de créer des marques qui répondent véritablement aux besoins du marché et qui ont un impact significatif sur le quotidien de nos clients.
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
              Notre vision est de créer un écosystème d'innovation en Afrique de l'Ouest qui identifie et résout les problèmes quotidiens par des solutions ingénieuses et accessibles. Nous aspirons à devenir la référence africaine en matière de création de marques à impact, reconnues tant pour leur qualité que pour leur pertinence sur le marché local.
            </p>
          </div>
          
          <h2 className="text-3xl font-bold text-[#0f4c81] text-center mb-12">
            Nos Valeurs Fondamentales
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                icon: <Star className="w-8 h-8 text-[#ff7f50]" />,
                title: "Innovation",
                description: "Recherche constante de solutions créatives et originales pour des problèmes concrets"
              },
              {
                icon: <Target className="w-8 h-8 text-[#ff7f50]" />,
                title: "Qualité",
                description: "Engagement inébranlable envers l'excellence dans chaque aspect de nos créations"
              },
              {
                icon: <Leaf className="w-8 h-8 text-[#ff7f50]" />,
                title: "Impact",
                description: "Création de solutions qui transforment positivement le quotidien des consommateurs africains"
              }
            ].map((value, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all">
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

      {/* L'Équipe (Remplacez les placeholders par vos vraies images et données) */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-[#0f4c81] text-center mb-12">
            Notre Équipe
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-gray-50 rounded-xl overflow-hidden shadow-md">
                <div className="w-full h-64 relative">
                  <Image 
                    src={member.imageSrc} 
                    alt={member.name} 
                    fill 
                    style={{objectFit: 'cover'}}
                    className="transition-all hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#0f4c81] mb-1">
                    {member.name}
                  </h3>
                  <div className="text-[#ff7f50] font-medium mb-3">{member.role}</div>
                  <p className="text-gray-600">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-[#ff7f50] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Rejoignez l'aventure TEKKI Studio
          </h2>
          <p className="text-xl opacity-90 max-w-3xl mx-auto mb-8">
            Que vous souhaitiez lancer votre propre business e-commerce ou collaborer avec nous, nous avons des solutions adaptées à vos ambitions.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <Link href="/business" className="inline-block bg-[#0f4c81] text-white px-8 py-4 rounded-lg font-bold text-lg transition-all hover:bg-[#0f4c89] hover:shadow-lg">
              Découvrir nos business
            </Link>
            <Link href="https://wa.me/221781362728?text=Bonjour TEKKI Studio ! Je souhaite travailler avec vous." className="inline-block bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg transition-all hover:bg-white/10">
              Nous contacter
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;