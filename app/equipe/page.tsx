// app/equipe/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { Users, Linkedin, Twitter, Instagram, Mail, ExternalLink, ChevronDown, UserPlus, Briefcase, GraduationCap, Heart, MapPin, MessageSquare } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const TeamPage = () => {
  // État pour suivre quel membre de l'équipe a sa bio développée
  const [expandedMember, setExpandedMember] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Effet pour détecter les appareils mobiles
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Vérifier au chargement
    checkIfMobile();
    
    // Vérifier au redimensionnement
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  // Fonction pour basculer l'affichage de la bio détaillée
  const toggleBio = (memberId: string) => {
    if (isMobile) {
      // Sur mobile, ouvre une seule bio à la fois
      setExpandedMember(expandedMember === memberId ? null : memberId);
      
      // Faire défiler jusqu'à la carte après expansion
      if (expandedMember !== memberId) {
        setTimeout(() => {
          const element = document.getElementById(`member-${memberId}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
      }
    } else {
      // Comportement normal sur desktop
      setExpandedMember(expandedMember === memberId ? null : memberId);
    }
  };

  // Données de l'équipe
  const teamMembers = [
    {
      id: "ibuka",
      name: "Ibuka Ndjoli",
      role: "Fondateur & Directeur",
      imageSrc: "/images/tekkistudio/team/ibuka.png",
      bio: "Expert en e-commerce et développement de marques avec plus de 10 ans d'expérience dans le marketing digital et la création de business innovants.",
      fullBio: "Passionné par l'entrepreneuriat depuis son plus jeune âge, Ibuka a fondé TEKKI Studio avec une vision claire : créer des marques qui résolvent de vrais problèmes pour les consommateurs africains. Avant de lancer TEKKI Studio, il a travaillé comme consultant en stratégie digitale pour plusieurs entreprises en Europe et en Afrique, où il a développé une expertise unique dans l'identification des opportunités de marché. Son approche combine créativité et rigueur analytique pour développer des business models innovants et durables.",
      location: "Dakar, Sénégal",
      expertise: ["Stratégie de marque", "E-commerce", "Business développement"],
      education: "Master en Digital Business, ESC Paris",
      social: {
        linkedin: "https://linkedin.com/in/ibuka",
        twitter: "https://twitter.com/ibuka"
      },
      featured: true
    },
    {
      id: "sara",
      name: "Sara Eanga",
      role: "Customer Success Manager",
      imageSrc: "/images/tekkistudio/team/sara.png",
      bio: "Spécialiste de la Relation Client, avec 3 ans d'expérience en closing et vente en ligne, passionnée par la Psychologie et la Création de produits.",
      fullBio: "Sara est le pilier de l'expérience client chez TEKKI Studio. Avec un background en psychologie et une expérience significative dans le service client, elle comprend parfaitement les besoins et les attentes des clients. Sa capacité à construire des relations de confiance et à transformer les feedbacks en améliorations concrètes est essentielle à notre succès. Sara accompagne les entrepreneurs dans leur parcours d'acquisition et d'exploitation des business clé en main, en veillant à ce que chaque étape soit fluide et enrichissante.",
      location: "Dakar, Sénégal",
      expertise: ["Service client", "Vente consultative", "Formation"],
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
      role: "Developpeur Frontend",
      imageSrc: "/images/tekkistudio/team/jeremie.png",
      bio: "Développeur fullstack avec 3 ans d'expérience en développement de sites et applications web, passionné par la programmation et l'IA.",
      fullBio: "Jérémie est le magicien technique derrière notre plateforme. Développeur autodidacte passionné par les technologies modernes, il a rejoint TEKKI Studio dès ses débuts pour construire une infrastructure digitale robuste et évolutive. Sa maîtrise de React, Next.js et des technologies frontend modernes nous permet d'offrir une expérience utilisateur exceptionnelle. Jérémie est constamment à l'affût des nouvelles tendances technologiques pour améliorer notre plateforme et intégrer des fonctionnalités innovantes.",
      location: "Abidjan, Côte d'Ivoire",
      expertise: ["React/Next.js", "Tailwind CSS", "UX/UI Design"],
      education: "Formation Développeur Web Fullstack, OpenClassrooms",
      social: {
        linkedin: "https://linkedin.com/in/jeremie-branham",
        github: "https://github.com/jeremie"
      },
      featured: true
    },
    {
      id: "binta",
      name: "Binta Sonko",
      role: "Content Strategist",
      imageSrc: "/images/tekkistudio/team/binta.png",
      bio: "Créatrice de contenu expérimentée avec une expertise particulière dans le storytelling de marque et le marketing de contenu pour les marchés africains.",
      fullBio: "Binta est la voix captivante derrière notre contenu et nos récits de marque. Avec un background en journalisme et communication, elle excelle dans l'art de créer des narratifs authentiques qui résonnent avec notre audience. Sa connaissance approfondie des cultures et tendances locales lui permet de développer des stratégies de contenu qui captivent et engagent. Chez TEKKI Studio, Binta supervise la création de tous les contenus marketing, des descriptions de produits aux articles de blog, en veillant à maintenir une voix cohérente à travers toutes nos communications.",
      location: "Dakar, Sénégal",
      expertise: ["Copywriting", "Marketing de contenu", "SEO"],
      education: "Master en Communication et Journalisme, ESP Dakar",
      social: {
        linkedin: "https://linkedin.com/in/binta-sonko",
        twitter: "https://twitter.com/bintasonko"
      },
      featured: false
    },
    {
      id: "moise",
      name: "Moïse Junior",
      role: "Community Manager",
      imageSrc: "/images/tekkistudio/team/moise.png",
      bio: "Expert en gestion de communauté et stratégie social media, avec une passion pour la création de contenu viral et l'engagement client.",
      fullBio: "Moïse est notre maestro des médias sociaux, créant des connexions significatives entre nos marques et nos communautés. Son approche créative et sa compréhension profonde des plateformes sociales nous permettent de maintenir une présence digitale dynamique et engageante. Moïse est particulièrement doué pour anticiper les tendances et adapter notre stratégie social media en conséquence. Il travaille en étroite collaboration avec l'équipe marketing pour s'assurer que notre message est cohérent à travers tous les canaux et qu'il atteint efficacement notre audience cible.",
      location: "Abidjan, Côte d'Ivoire",
      expertise: ["Social Media Marketing", "Création de contenu", "Analytics"],
      education: "Licence en Marketing Digital, IAM Digital",
      social: {
        instagram: "https://instagram.com/moisejr",
        twitter: "https://twitter.com/moisejunior"
      },
      featured: false
    },
    {
      id: "rose",
      name: "Rose Sharonn",
      role: "Brand Manager",
      imageSrc: "/images/tekkistudio/team/rose.png",
      bio: "Stratège en branding avec un œil aiguisé pour le design et une profonde compréhension du parcours client et de l'expérience utilisateur.",
      fullBio: "Rose est la gardienne de nos identités de marque. Avec son background en design et marketing, elle veille à ce que chaque marque développée par TEKKI Studio ait une identité visuelle cohérente et impactante. Sa compréhension intuitive des tendances du design et sa capacité à traduire les valeurs d'une marque en éléments visuels reconnaissables sont inestimables. Rose supervise également le processus de naming et de positionnement pour chaque nouvelle marque, en s'assurant qu'elle se démarque sur le marché tout en restant fidèle à sa mission fondamentale.",
      location: "Dakar, Sénégal",
      expertise: ["Branding", "Direction artistique", "Stratégie marketing"],
      education: "Master en Design et Communication, ESMOD Paris",
      social: {
        linkedin: "https://linkedin.com/in/rose-sharonn",
        behance: "https://behance.net/rosesharonn"
      },
      featured: false
    }
  ];

  // Séparer l'équipe en membres mis en avant et autres membres
  const featuredMembers = teamMembers.filter(member => member.featured);
  const otherMembers = teamMembers.filter(member => !member.featured);

  // Section "Nous rejoindre"
  const openPositions = [
    {
      title: "Product Manager",
      department: "Produit",
      location: "Dakar, Sénégal",
      type: "Temps plein"
    },
    {
      title: "Growth Marketer",
      department: "Marketing",
      location: "Abidjan, Côte d'Ivoire",
      type: "Temps plein"
    },
    {
      title: "UI/UX Designer",
      department: "Design",
      location: "Remote",
      type: "Freelance"
    }
  ];

  // Valeurs de l'équipe
  const teamValues = [
    {
      icon: <Heart className="w-8 h-8 text-tekki-coral" />,
      title: "Passion",
      description: "Nous sommes animés par la passion de créer des solutions qui ont un impact réel."
    },
    {
      icon: <Users className="w-8 h-8 text-tekki-coral" />,
      title: "Collaboration",
      description: "Nous croyons en la force de l'intelligence collective et du travail d'équipe."
    },
    {
      icon: <GraduationCap className="w-8 h-8 text-tekki-coral" />,
      title: "Apprentissage",
      description: "Nous cherchons constamment à apprendre et à nous améliorer."
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
              Notre Équipe
            </h1>
            <p className="text-xl opacity-90">
              Des talents passionnés qui créent des businesses innovants et impactants
            </p>
          </div>
        </div>
      </section>

      {/* Présentation de l'équipe */}
      <section className="py-16 bg-white">
        <div className="mx-auto px-3 md:px-6 lg:px-8 w-full max-w-[1536px]">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold text-tekki-blue mb-8">
              Rencontrez l'équipe TEKKI Studio
            </h2>
            <p className="text-lg text-gray-600">
              Notre équipe diversifiée et talentueuse est la force motrice derrière TEKKI Studio. Composée d'experts dans leurs domaines respectifs, nous collaborons pour créer des marques innovantes et des business e-commerce qui résolvent des problèmes réels.
            </p>
          </div>

          {/* Direction / Équipe principale */}
          <h3 className="text-2xl font-bold text-tekki-blue text-center mb-12">
            Leadership & Fondateurs
          </h3>
          <div className="grid md:grid-cols-3 gap-4 sm:gap-8 max-w-5xl mx-auto mb-16 sm:mb-20">
            {featuredMembers.map((member) => (
              <div 
                key={member.id} 
                id={`member-${member.id}`}
                className="bg-gray-50 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100 hover:border-tekki-coral/20 group"
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
                      {member.social.behance && (
                        <a 
                          href={member.social.behance} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="w-8 h-8 bg-gray-200 hover:bg-[#1769FF] text-gray-600 hover:text-white rounded-full flex items-center justify-center transition-all"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7.5 13.5C8.5 13.5 9.5 13 9.5 11.5H11.5C11.5 14 9.5 15 7.5 15H6V18.5H4V9H7.5C9.5 9 11.5 10 11.5 11.5C11.5 13 9.5 13.5 7.5 13.5ZM7 11.5H6V13H7C7.5 13 8 12.8 8 12.25C8 11.7 7.5 11.5 7 11.5ZM7 11.5V10.5H6V11.5H7ZM14 10.5H19C19 14 17 15 15.5 15C13.5 15 12 13.2 12 12C12 10.8 13.5 9 15.5 9C16.5 9 18 9.5 18.5 11.5H16.5C16.3 10.5 15 10.8 15 12C15 13.2 16.3 13.5 16.5 12.5H14V10.5ZM18.5 6.5V7.5H14V6.5H18.5Z" fill="currentColor"/>
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Reste de l'équipe */}
          <h3 className="text-2xl font-bold text-tekki-blue text-center mb-12">
            Notre Équipe
          </h3>
          <div className="grid md:grid-cols-3 gap-4 sm:gap-8 max-w-5xl mx-auto">
            {otherMembers.map((member) => (
              <div 
                key={member.id} 
                id={`member-${member.id}`}
                className="bg-gray-50 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100 hover:border-tekki-coral/20 group"
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
                      {member.social.behance && (
                        <a 
                          href={member.social.behance} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="w-8 h-8 bg-gray-200 hover:bg-[#1769FF] text-gray-600 hover:text-white rounded-full flex items-center justify-center transition-all"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7.5 13.5C8.5 13.5 9.5 13 9.5 11.5H11.5C11.5 14 9.5 15 7.5 15H6V18.5H4V9H7.5C9.5 9 11.5 10 11.5 11.5C11.5 13 9.5 13.5 7.5 13.5ZM7 11.5H6V13H7C7.5 13 8 12.8 8 12.25C8 11.7 7.5 11.5 7 11.5ZM7 11.5V10.5H6V11.5H7ZM14 10.5H19C19 14 17 15 15.5 15C13.5 15 12 13.2 12 12C12 10.8 13.5 9 15.5 9C16.5 9 18 9.5 18.5 11.5H16.5C16.3 10.5 15 10.8 15 12C15 13.2 16.3 13.5 16.5 12.5H14V10.5ZM18.5 6.5V7.5H14V6.5H18.5Z" fill="currentColor"/>
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
      <section className="py-16 bg-gray-50">
        <div className="mx-auto px-3 md:px-6 lg:px-8 w-full max-w-[1536px]">
          <h2 className="text-3xl font-bold text-tekki-blue text-center mb-12">
            Nos Valeurs d'Équipe
          </h2>
          <div className="grid md:grid-cols-3 gap-4 sm:gap-8 max-w-4xl mx-auto">
            {teamValues.map((value, index) => (
              <div 
                key={index} 
                className="text-center p-4 sm:p-8 bg-white rounded-xl shadow-sm hover:shadow-lg transition-all transform hover:-translate-y-1 duration-300 border border-gray-100 hover:border-tekki-coral/20"
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

      {/* Environnement de travail */}
      <section className="py-16 bg-white">
        <div className="mx-auto px-3 md:px-6 lg:px-8 w-full max-w-[1536px]">
          <div className="grid md:grid-cols-2 gap-6 sm:gap-12 items-center max-w-5xl mx-auto">
            <div>
              <h2 className="text-3xl font-bold text-tekki-blue mb-6">
                Notre Environnement de Travail
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Chez TEKKI Studio, nous cultivons un environnement de travail qui valorise la créativité, l'innovation et la collaboration. Nous croyons que les meilleures idées naissent lorsque les personnes se sentent libres d'exprimer leur potentiel.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  "Flexibilité et autonomie dans l'organisation du travail",
                  "Culture d'apprentissage continu et de développement",
                  "Espaces de travail collaboratifs et inspirants",
                  "Équilibre vie professionnelle et personnelle"
                ].map((point, idx) => (
                  <li key={idx} className="flex items-start">
                    <div className="w-6 h-6 bg-tekki-coral/20 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-tekki-coral rounded-full"></div>
                    </div>
                    <span className="text-gray-700">{point}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/careers"
                  className="bg-tekki-blue hover:bg-tekki-blue/90 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
                >
                  Voir nos opportunités
                  <Briefcase className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  href="/a-propos"
                  className="border border-tekki-blue text-tekki-blue hover:bg-tekki-blue/10 px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  En savoir plus sur nous
                </Link>
              </div>
            </div>
            <div className="relative h-[400px] rounded-xl overflow-hidden shadow-lg">
              <Image 
                src="/images/tekkistudio/office-team.jpg" 
                alt="L'équipe TEKKI Studio dans ses locaux" 
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{objectFit: 'cover'}}
                className="transition-transform duration-700 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Postes ouverts */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto px-3 md:px-6 lg:px-8 w-full max-w-[1536px]">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-tekki-blue mb-4">
              Rejoignez l'Aventure
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Nous sommes toujours à la recherche de talents passionnés pour rejoindre notre équipe. Découvrez nos opportunités actuelles ou envoyez-nous une candidature spontanée.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6 mb-10">
              {openPositions.map((position, index) => (
                <div 
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all border border-gray-100 hover:border-tekki-coral/20"
                >
                  <div className="text-tekki-coral font-medium mb-2">{position.department}</div>
                  <h3 className="text-xl font-bold text-tekki-blue mb-4">{position.title}</h3>
                  
                  <div className="flex flex-col space-y-2 mb-6">
                    <div className="flex items-center text-gray-600 text-sm">
                      <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                      {position.location}
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <Briefcase className="w-4 h-4 mr-2 text-gray-400" />
                      {position.type}
                    </div>
                  </div>
                  
                  <Link
                    href={`/careers/${position.title.toLowerCase().replace(/\s+/g, '-')}`}
                    className="block w-full bg-tekki-blue hover:bg-tekki-blue/90 text-white py-2 rounded-lg font-medium text-center transition-colors"
                  >
                    Postuler
                  </Link>
                </div>
              ))}
            </div>
            
            {/* Candidature spontanée */}
            <div className="bg-gradient-to-r from-tekki-blue to-tekki-coral p-8 rounded-xl shadow-md text-white text-center">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center">
                  <UserPlus className="w-10 h-10" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4">
                Vous ne trouvez pas le poste idéal ?
              </h3>
              <p className="text-white/90 mb-6 max-w-xl mx-auto">
                Envoyez-nous une candidature spontanée. Nous sommes toujours à l'affût de nouveaux talents qui partagent notre passion pour l'innovation et l'entrepreneuriat.
              </p>
              <Link
                href="/careers/spontaneous"
                className="inline-block bg-white text-tekki-blue hover:bg-white/90 px-8 py-3 rounded-lg font-bold transition-colors"
              >
                Candidature spontanée
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="mx-auto px-3 md:px-6 lg:px-8 w-full max-w-[1536px]">
          <h2 className="text-3xl font-bold text-tekki-blue text-center mb-12">
            Questions Fréquentes sur Notre Équipe
          </h2>
          <div className="max-w-3xl mx-auto">
            {[
              {
                question: "Comment est structurée l'équipe TEKKI Studio ?",
                answer: "Notre équipe est organisée autour de pôles d'expertise complémentaires : création de marques, développement produit, marketing et technologie. Cette structure nous permet d'être agiles et de répondre efficacement aux besoins de nos projets et de nos clients."
              },
              {
                question: "Quelles sont les opportunités de croissance au sein de TEKKI Studio ?",
                answer: "Nous encourageons le développement professionnel et personnel à travers des projets variés, des formations continues et un parcours d'évolution clairement défini. Chaque membre de l'équipe est accompagné pour développer ses compétences et évoluer au sein de l'entreprise."
              },
              {
                question: "Comment se déroule le processus de recrutement ?",
                answer: "Notre processus de recrutement comprend généralement un premier entretien découverte, suivi d'un test pratique lié au poste, puis d'un entretien approfondi avec les membres de l'équipe concernée. Nous valorisons autant les compétences techniques que l'adéquation avec nos valeurs et notre culture d'entreprise."
              }
            ].map((faq, index) => (
              <div 
                key={index} 
                className="mb-6 bg-gray-50 p-6 rounded-xl hover:shadow-sm transition-all border border-gray-100 hover:border-tekki-blue/20"
              >
                <h3 className="text-xl font-bold text-tekki-blue mb-3 flex items-center">
                  <MessageSquare className="w-5 h-5 text-tekki-coral mr-2 flex-shrink-0" />
                  {faq.question}
                </h3>
                <p className="text-gray-600 pl-7">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-tekki-blue to-tekki-coral text-white">
        <div className="mx-auto px-3 md:px-6 lg:px-8 w-full max-w-[1536px] text-center">
          <h2 className="text-3xl font-bold mb-6">
            Prêt à rejoindre notre équipe ?
          </h2>
          <p className="text-xl opacity-90 max-w-3xl mx-auto mb-8">
            Nous cherchons des personnes passionnées, créatives et déterminées à créer un impact positif à travers des solutions innovantes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/careers" 
              className="bg-white text-tekki-blue hover:bg-white/90 px-8 py-4 rounded-lg font-bold text-lg transition-all hover:shadow-lg flex items-center justify-center"
            >
              Voir nos opportunités
              <Briefcase className="ml-2 h-5 w-5" />
            </Link>
            <Link 
              href="/contact" 
              className="bg-white/10 border border-white/20 text-white hover:bg-white/20 px-8 py-4 rounded-lg font-bold text-lg transition-all flex items-center justify-center"
            >
              Nous contacter
              <Mail className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default TeamPage;