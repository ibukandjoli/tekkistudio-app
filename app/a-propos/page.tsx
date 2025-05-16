// app/a-propos/page.tsx
'use client';

import React from 'react';
import { Heart, Target, Rocket, Users, Star, Leaf, Calendar, Award, MessagesSquare, ArrowRight, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Container from '@/app/components/ui/Container';

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
      name: "Jeremie Branham",
      role: "Developpeur E-commerce",
      imageSrc: "/images/tekkistudio/team/jeremie.png",
      bio: "Développeur fullstack avec 3 ans d'expérience en développement de sites et applications web, passionné par l'UX et l'E-commerce. "
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
    <main className="pb-0">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-tekki-blue to-tekki-coral relative pt-28 pb-20">
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-12 h-full">
            {[...Array(48)].map((_, i) => (
              <div key={i} className="border border-white/20" />
            ))}
          </div>
        </div>

        <Container className="relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              À Propos de TEKKI Studio
            </h1>
            <p className="text-xl opacity-90">
              Créateurs de Marques et Business E-commerce à impact positif
            </p>
          </div>
        </Container>
      </section>

      {/* Notre Histoire */}
      <section className="py-16 bg-white">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-tekki-blue text-center mb-8">
              Notre Histoire
            </h2>
            <div className="bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-md transition-all">
              <p className="text-lg text-gray-600 mb-6">
                <span className="font-bold text-tekki-blue">TEKKI Studio</span> est né d'une vision simple mais puissante : créer des marques qui résolvent véritablement les problèmes quotidiens des consommateurs africains. Fondée en 2023, notre entreprise est rapidement devenue un incubateur de marques innovantes qui comblent des lacunes importantes sur le marché.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Notre fondateur, passionné d'entrepreneuriat et d'innovation, a constaté que de nombreux besoins spécifiques restaient non satisfaits, particulièrement en Afrique de l'Ouest. Il a alors imaginé un modèle unique : identifier ces besoins, développer des produits sur mesure, et créer des marques fortes autour de ces solutions.
              </p>
              <p className="text-lg text-gray-600">
                Aujourd'hui, TEKKI Studio est fier d'avoir lancé avec succès trois marques distinctives et d'aider d'autres entrepreneurs à réaliser leurs ambitions grâce à nos business e-commerce clé en main.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-gray-50">
        <Container>
          <h2 className="text-3xl font-bold text-tekki-blue text-center mb-12">
            Notre Parcours
          </h2>
          <div className="max-w-3xl mx-auto relative">
            {/* Line connecting all milestones */}
            <div className="absolute left-16 top-0 bottom-0 w-1 bg-tekki-blue hidden md:block"></div>
            
            {milestones.map((milestone, index) => (
              <div key={index} className="flex mb-12 last:mb-0 group">
                <div className="mr-8 relative hidden md:block">
                  <div className="w-12 h-12 bg-tekki-blue rounded-full flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform">
                    <Calendar className="w-6 h-6" />
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all w-full md:w-auto border border-gray-100 group-hover:border-tekki-coral/20">
                  <div className="text-tekki-coral font-bold mb-2">{milestone.year}</div>
                  <h3 className="text-xl font-bold text-tekki-blue mb-3">{milestone.title}</h3>
                  <p className="text-gray-600">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Notre Approche */}
      <section className="py-16 bg-white">
        <Container>
          <h2 className="text-3xl font-bold text-tekki-blue text-center mb-12">
            Notre Approche
          </h2>
          <div className="max-w-3xl mx-auto">
            <div className="bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-md transition-all mb-8 border border-gray-100 hover:border-tekki-blue/20 group">
              <h3 className="text-2xl font-bold text-tekki-blue mb-4 flex items-center">
                <div className="w-10 h-10 bg-tekki-coral/10 rounded-full flex items-center justify-center mr-3 group-hover:bg-tekki-coral/20 transition-all">
                  <Target className="w-6 h-6 text-tekki-coral" />
                </div>
                Identification des Besoins
              </h3>
              <p className="text-gray-600 mb-4">
                Nous commençons par une recherche approfondie pour identifier des besoins non satisfaits au sein de niches spécifiques. Notre processus combine analyse de marché, études des tendances et écoute attentive des consommateurs.
              </p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-md transition-all mb-8 border border-gray-100 hover:border-tekki-blue/20 group">
              <h3 className="text-2xl font-bold text-tekki-blue mb-4 flex items-center">
                <div className="w-10 h-10 bg-tekki-coral/10 rounded-full flex items-center justify-center mr-3 group-hover:bg-tekki-coral/20 transition-all">
                  <Award className="w-6 h-6 text-tekki-coral" />
                </div>
                Développement de Produits
              </h3>
              <p className="text-gray-600 mb-4">
                Nous développons des produits sur mesure pour répondre précisément aux besoins identifiés. Nous accordons une attention particulière à la qualité, à l'efficacité et à l'expérience utilisateur.
              </p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 hover:border-tekki-blue/20 group">
              <h3 className="text-2xl font-bold text-tekki-blue mb-4 flex items-center">
                <div className="w-10 h-10 bg-tekki-coral/10 rounded-full flex items-center justify-center mr-3 group-hover:bg-tekki-coral/20 transition-all">
                  <MessagesSquare className="w-6 h-6 text-tekki-coral" />
                </div>
                Validation et Itération
              </h3>
              <p className="text-gray-600 mb-4">
                Nous nous donnons trois mois pour valider le product market fit, en testant nos produits auprès de la cible visée et en itérant rapidement sur base des retours. Si le produit est validé, nous développons une marque complète autour de celui-ci.
              </p>
              <p className="text-gray-600">
                Cette approche méthodique nous permet de créer des marques qui répondent véritablement aux besoins du marché et qui ont un impact significatif sur le quotidien de nos clients.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Vision et Valeurs */}
      <section className="py-16 bg-gray-50">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-tekki-blue mb-6">
              Notre Vision
            </h2>
            <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100">
              <p className="text-lg text-gray-600">
                Notre vision est de créer un écosystème d'innovation en Afrique de l'Ouest qui identifie et résout les problèmes quotidiens par des solutions ingénieuses et accessibles. Nous aspirons à devenir la référence africaine en matière de création de marques à impact, reconnues tant pour leur qualité que pour leur pertinence sur le marché local.
              </p>
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-tekki-blue text-center mb-12">
            Nos Valeurs Fondamentales
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                icon: <Star className="w-8 h-8 text-tekki-coral" />,
                title: "Innovation",
                description: "Recherche constante de solutions créatives et originales pour des problèmes concrets"
              },
              {
                icon: <Target className="w-8 h-8 text-tekki-coral" />,
                title: "Qualité",
                description: "Engagement inébranlable envers l'excellence dans chaque aspect de nos créations"
              },
              {
                icon: <Leaf className="w-8 h-8 text-tekki-coral" />,
                title: "Impact",
                description: "Création de solutions qui transforment positivement le quotidien des consommateurs africains"
              }
            ].map((value, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-lg transition-all transform hover:-translate-y-1 duration-300 border border-gray-100 hover:border-tekki-coral/20">
                <div className="w-16 h-16 bg-tekki-coral/10 rounded-full flex items-center justify-center mx-auto mb-4 hover:bg-tekki-coral/20 transition-all">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-tekki-blue mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* L'Équipe */}
      <section className="py-16 bg-white">
        <Container>
          <h2 className="text-3xl font-bold text-tekki-blue text-center mb-12">
            Notre Équipe
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-gray-50 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100 hover:border-tekki-coral/20 group">
                <div className="w-full h-64 relative">
                  <Image 
                    src={member.imageSrc} 
                    alt={member.name} 
                    fill 
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{objectFit: 'cover'}}
                    className="transition-all group-hover:scale-105 duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-tekki-blue mb-1">
                    {member.name}
                  </h3>
                  <div className="text-tekki-coral font-medium mb-3">{member.role}</div>
                  <p className="text-gray-600">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-tekki-blue to-tekki-coral text-white">
        <Container className="text-center">
          <h2 className="text-3xl font-bold mb-6">
            Rejoignez l'aventure TEKKI Studio
          </h2>
          <p className="text-xl opacity-90 max-w-3xl mx-auto mb-8">
            Que vous souhaitiez lancer votre propre business e-commerce ou collaborer avec nous, nous avons des solutions adaptées à vos ambitions.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/business" 
              className="bg-white text-tekki-blue hover:bg-white/90 px-8 py-4 rounded-lg font-bold text-lg transition-all hover:shadow-lg flex items-center justify-center"
            >
              Découvrir nos business
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link 
              href="https://wa.me/221781362728?text=Bonjour TEKKI Studio ! Je souhaite travailler avec vous." 
              className="bg-white/10 border border-white/20 text-white hover:bg-white/20 px-8 py-4 rounded-lg font-bold text-lg transition-all flex items-center justify-center"
              target="_blank"
            >
              Nous contacter
              <ExternalLink className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </Container>
      </section>
    </main>
  );
};

export default AboutPage;