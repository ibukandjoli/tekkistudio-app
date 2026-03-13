// app/equipe/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { Users, Linkedin, Twitter, Instagram, Mail, ExternalLink, ChevronDown, UserPlus, Briefcase, GraduationCap, Heart, MapPin, MessageSquare, Target, Zap, Award } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { FaWhatsapp } from 'react-icons/fa';

const TeamPage = () => {
  // État pour suivre quel membre de l'équipe a sa bio développée
  const [expandedMember, setExpandedMember] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Effet pour détecter les appareils mobiles
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  // Fonction pour basculer l'affichage de la bio détaillée
  const toggleBio = (memberId: string) => {
    if (isMobile) {
      setExpandedMember(expandedMember === memberId ? null : memberId);

      if (expandedMember !== memberId) {
        setTimeout(() => {
          const element = document.getElementById(`member-${memberId}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
      }
    } else {
      setExpandedMember(expandedMember === memberId ? null : memberId);
    }
  };

  // Données de l'équipe
  const teamMembers = [
    {
      id: "ibuka",
      name: "Ibuka Ndjoli",
      role: "Fondateur & Directeur",
      imageSrc: "/images/tekkistudio/team/ibuka.webp",
      bio: "Créateur de VIENS ON S'CONNAÎT et AMANI, expert en création de marques et développement e-commerce avec plus de 10 ans d'expérience.",
      fullBio: "Ibuka a fondé TEKKI Studio avec une conviction forte : pour bien accompagner des marques, il faut d'abord créer et développer ses propres marques. Avant de conseiller qui que ce soit, il a testé, échoué, optimisé et finalement réussi avec VIENS ON S'CONNAÎT (8 000+ produits vendus, 7 pays) et AMANI. Cette expérience terrain lui permet d'accompagner les marques africaines avec des stratégies éprouvées, pas de la théorie. Sa vision : transformer des marques locales en success stories régionales grâce à des méthodes qui ont fait leurs preuves.",
      location: "Dakar, Sénégal",
      expertise: ["Création de marques", "E-commerce", "Growth marketing"],
      education: "Master en Digital Business, ESC Paris",
      social: {
        linkedin: "https://linkedin.com/in/ibukandjoli",
        twitter: "https://twitter.com/ibukandjoli"
      },
      featured: true
    },
    {
      id: "sara",
      name: "Sara Eanga",
      role: "Customer Success Manager",
      imageSrc: "/images/tekkistudio/team/sara.webp",
      bio: "Spécialiste de la Relation Client avec 3 ans d'expérience, passionnée par l'accompagnement des marques vers le succès e-commerce.",
      fullBio: "Sara est le pont entre notre expertise et vos résultats. Avec son background en psychologie et son expérience significative en vente consultative, elle comprend parfaitement les défis des entrepreneurs africains. Elle accompagne chaque marque dans son parcours de transformation digitale, en s'assurant que les stratégies que nous recommandons sont bien comprises, bien appliquées et génèrent des résultats mesurables. Sara veille à ce que vous ne soyez jamais seul dans votre aventure e-commerce.",
      location: "Dakar, Sénégal",
      expertise: ["Relation client", "Vente consultative", "Accompagnement"],
      education: "Licence en Psychologie, Université Cheikh Anta Diop",
      social: {
        linkedin: "https://linkedin.com/in/sara-eanga",
        instagram: "https://instagram.com/saraeanga"
      },
      featured: true
    },
    {
      id: "jeremie",
      name: "Jeremie Branham",
      role: "Développeur Frontend",
      imageSrc: "/images/tekkistudio/team/jeremie.webp",
      bio: "Développeur fullstack avec 3 ans d'expérience, spécialisé dans la création de sites e-commerce performants et optimisés pour la conversion.",
      fullBio: "Jérémie est l'architecte technique derrière nos sites e-commerce qui génèrent des ventes. Sa maîtrise de React, Next.js et des technologies frontend modernes lui permet de créer des expériences utilisateur fluides et optimisées pour le marché africain. Il comprend que la vitesse de chargement sur mobile, la simplicité du parcours d'achat et l'optimisation pour les connexions lentes sont cruciales pour convertir. Chaque site qu'il développe est pensé pour maximiser vos ventes, pas juste pour être joli.",
      location: "Abidjan, Côte d'Ivoire",
      expertise: ["React/Next.js", "UX/UI optimisée", "Performance web"],
      education: "Formation Développeur Web Fullstack, OpenClassrooms",
      social: {
        linkedin: "https://linkedin.com/in/jeremie-branham",
        github: "https://github.com/jeremie.branham"
      },
      featured: true
    }
  ];

  // Valeurs de l'équipe
  const teamValues = [
    {
      icon: <Target className="w-8 h-8 text-tekki-coral" />,
      title: "Orientation résultats",
      description: "Nous mesurons notre succès à vos ventes, pas à nos promesses. Chaque action est orientée vers un résultat concret et mesurable."
    },
    {
      icon: <Zap className="w-8 h-8 text-tekki-coral" />,
      title: "Expérience terrain",
      description: "Nous testons d'abord sur nos marques avant de vous le recommander. Vous bénéficiez uniquement de stratégies qui ont fait leurs preuves."
    },
    {
      icon: <Heart className="w-8 h-8 text-tekki-coral" />,
      title: "Accompagnement authentique",
      description: "Nous sommes entrepreneurs comme vous. Nous comprenons vos défis parce que nous les vivons quotidiennement sur nos propres marques."
    }
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

        <div className="mx-auto px-3 md:px-6 lg:px-8 w-full max-w-[1536px] relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              L'Équipe TEKKI Studio
            </h1>
            <p className="text-xl opacity-90">
              Des entrepreneurs qui créent leurs propres marques et accompagnent les vôtres vers le succès e-commerce
            </p>
          </div>
        </div>
      </section>

      {/* Notre différence */}
      <section className="py-16 bg-white">
        <div className="mx-auto px-3 md:px-6 lg:px-8 w-full max-w-[1536px]">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold text-tekki-blue mb-6">
              Ce qui nous rend différents
            </h2>
            <div className="bg-gray-50 p-8 rounded-xl shadow-sm">
              <p className="text-lg text-gray-600 mb-4">
                Nous ne sommes pas des consultants qui donnent des conseils depuis un bureau. Nous sommes des entrepreneurs qui créent et développent activement leurs propres marques e-commerce.
              </p>
              <p className="text-lg text-gray-600">
                <span className="font-bold text-tekki-blue">VIENS ON S'CONNAÎT</span> (8 000+ produits vendus) et <span className="font-bold text-tekki-blue">AMANI</span> sont nos terrains de test. Chaque stratégie que nous vous recommandons a d'abord été validée sur nos marques. Vous ne payez pas pour de la théorie, mais pour ce qui fonctionne réellement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Présentation de l'équipe */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto px-3 md:px-6 lg:px-8 w-full max-w-[1536px]">
          <h3 className="text-2xl font-bold text-tekki-blue text-center mb-12">
            Rencontrez l'équipe
          </h3>
          <div className="grid md:grid-cols-3 gap-4 sm:gap-8 max-w-5xl mx-auto mb-16 sm:mb-20">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                id={`member-${member.id}`}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100 hover:border-tekki-coral/20 group"
              >
                <div className="w-full h-72 relative">
                  <Image
                    src={member.imageSrc}
                    alt={member.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{objectFit: 'cover'}}
                    className="transition-all group-hover:scale-105 duration-500"
                  />
                </div>
                <div className="p-4 sm:p-6">
                  <h3 className="text-xl font-bold text-tekki-blue mb-1">
                    {member.name}
                  </h3>
                  <div className="text-tekki-coral font-medium mb-4">{member.role}</div>

                  <div className="mb-5">
                    <div className="flex items-center text-gray-500 text-sm mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      {member.location}
                    </div>

                    {/* Spécialités */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {member.expertise.map((skill, idx) => (
                        <span
                          key={idx}
                          className="bg-tekki-blue/10 text-tekki-blue text-xs px-3 py-1 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="text-gray-600 mb-6">
                    {expandedMember === member.id ? member.fullBio : member.bio}
                  </p>

                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => toggleBio(member.id)}
                      className="text-tekki-blue hover:text-tekki-coral text-sm flex items-center transition-colors"
                    >
                      {expandedMember === member.id ? 'Voir moins' : 'En savoir plus'}
                      <ChevronDown
                        className={`ml-1 w-4 h-4 transition-transform ${expandedMember === member.id ? 'rotate-180' : ''}`}
                      />
                    </button>

                    {/* Réseaux sociaux */}
                    <div className="flex gap-2">
                      {member.social.linkedin && (
                        <a
                          href={member.social.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 bg-gray-200 hover:bg-tekki-blue text-gray-600 hover:text-white rounded-full flex items-center justify-center transition-all"
                        >
                          <Linkedin className="w-4 h-4" />
                        </a>
                      )}
                      {member.social.twitter && (
                        <a
                          href={member.social.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 bg-gray-200 hover:bg-[#1DA1F2] text-gray-600 hover:text-white rounded-full flex items-center justify-center transition-all"
                        >
                          <Twitter className="w-4 h-4" />
                        </a>
                      )}
                      {member.social.instagram && (
                        <a
                          href={member.social.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 bg-gray-200 hover:bg-gradient-to-r from-[#515BD4] via-[#8134AF] to-[#DD2A7B] text-gray-600 hover:text-white rounded-full flex items-center justify-center transition-all"
                        >
                          <Instagram className="w-4 h-4" />
                        </a>
                      )}
                      {member.social.github && (
                        <a
                          href={member.social.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 bg-gray-200 hover:bg-[#333] text-gray-600 hover:text-white rounded-full flex items-center justify-center transition-all"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2C6.47715 2 2 6.47715 2 12C2 16.4183 4.95506 20.1281 9 21.4353V18.8C8.4 18.8 7.8 18.55 7.35 18.15C6.9 17.75 6.65 17.2 6.5 16.6C6.45 16.35 6.3 16.15 6.1 15.95C5.9 15.75 5.75 15.65 5.7 15.65C5.55 15.5 5.5 15.35 5.55 15.2C5.6 15.05 5.7 15 5.85 15C6.2 15 6.5 15.2 6.85 15.55C7.2 15.9 7.4 16.25 7.6 16.55C7.95 17.15 8.5 17.35 9 17.1C9.1 16.6 9.3 16.25 9.55 16C7.65 15.75 6.4 14.85 6.4 12.95C6.4 12.15 6.65 11.45 7.15 10.95C7 10.5 6.85 9.65 7.35 8.4C9.15 8.4 10.3 9.3 10.5 9.45C11 9.3 11.5 9.2 12.05 9.2C12.6 9.2 13.1 9.3 13.55 9.45C13.7 9.3 14.85 8.4 16.65 8.4C17.15 9.65 17 10.5 16.85 10.95C17.35 11.45 17.6 12.15 17.6 12.95C17.6 14.85 16.35 15.75 14.45 16C14.7 16.25 14.9 16.75 14.9 17.45V21.4353C18.9449 20.1281 22 16.4183 22 12C22 6.47715 17.5228 2 12 2Z" fill="currentColor"/>
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Valeurs de l'équipe */}
      <section className="py-16 bg-white">
        <div className="mx-auto px-3 md:px-6 lg:px-8 w-full max-w-[1536px]">
          <h2 className="text-3xl font-bold text-tekki-blue text-center mb-12">
            Notre Philosophie de Travail
          </h2>
          <div className="grid md:grid-cols-3 gap-4 sm:gap-8 max-w-4xl mx-auto">
            {teamValues.map((value, index) => (
              <div
                key={index}
                className="text-center p-4 sm:p-8 bg-gray-50 rounded-xl shadow-sm hover:shadow-lg transition-all transform hover:-translate-y-1 duration-300 border border-gray-100 hover:border-tekki-coral/20"
              >
                <div className="w-16 h-16 bg-tekki-coral/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-tekki-coral/20 transition-all">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-tekki-blue mb-4">
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

      {/* Nos marques comme preuve */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="mx-auto px-3 md:px-6 lg:px-8 w-full max-w-[1536px]">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-tekki-blue mb-6">
              Nos marques sont notre meilleure preuve
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Avant de vous accompagner, nous avons créé et développé nos propres marques à succès. Chaque conseil que nous donnons est basé sur notre expérience réelle.
            </p>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100">
                <div className="text-3xl font-bold text-purple-600 mb-2">8 000+</div>
                <div className="text-gray-600 font-medium mb-1">Produits vendus</div>
                <div className="text-sm text-gray-500">VIENS ON S'CONNAÎT</div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100">
                <div className="text-3xl font-bold text-pink-600 mb-2">7 pays</div>
                <div className="text-gray-600 font-medium mb-1">Distribution</div>
                <div className="text-sm text-gray-500">Afrique de l'Ouest + Diaspora</div>
              </div>
            </div>
            <Link
              href="/nos-marques"
              className="inline-flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl"
            >
              Découvrir nos marques
              <Award className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-tekki-blue to-tekki-coral text-white">
        <div className="mx-auto px-3 md:px-6 lg:px-8 w-full max-w-[1536px] text-center">
          <h2 className="text-3xl font-bold mb-6">
            Prêt à transformer votre marque en success story ?
          </h2>
          <p className="text-xl opacity-90 max-w-3xl mx-auto mb-8">
            Bénéficiez de l'expérience d'une équipe qui a déjà créé et développé ses propres marques à succès
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/nos-formules"
              className="bg-white text-tekki-blue hover:bg-white/90 px-8 py-4 rounded-lg font-bold text-lg transition-all hover:shadow-lg flex items-center justify-center"
            >
              Découvrir nos formules
              <Briefcase className="ml-2 h-5 w-5" />
            </Link>
            <a
              href="https://wa.me/221781362728?text=Bonjour%20TEKKI%20Studio%20!%20J%27aimerais%20discuter%20de%20ma%20marque%20avec%20votre%20équipe."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 border border-white/20 text-white hover:bg-white/20 px-8 py-4 rounded-lg font-bold text-lg transition-all flex items-center justify-center"
            >
              Réserver un appel gratuit
              <FaWhatsapp className="ml-2 h-5 w-5" />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
};

export default TeamPage;
