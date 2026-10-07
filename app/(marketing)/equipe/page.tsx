// app/equipe/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { Linkedin, Twitter, Instagram, ChevronDown, Briefcase, MapPin, Target, Zap, Heart, Award } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { FaWhatsapp } from 'react-icons/fa';

const focusRing = 'outline-none focus-visible:ring-2 focus-visible:ring-tekki-orange/50 focus-visible:ring-offset-2';

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
      icon: <Target className="w-7 h-7" />,
      title: "Orientation résultats",
      description: "Nous mesurons notre succès à vos ventes, pas à nos promesses. Chaque action est orientée vers un résultat concret et mesurable."
    },
    {
      icon: <Zap className="w-7 h-7" />,
      title: "Expérience terrain",
      description: "Nous testons d'abord sur nos marques avant de vous le recommander. Vous bénéficiez uniquement de stratégies qui ont fait leurs preuves."
    },
    {
      icon: <Heart className="w-7 h-7" />,
      title: "Accompagnement authentique",
      description: "Nous sommes entrepreneurs comme vous. Nous comprenons vos défis parce que nous les vivons quotidiennement sur nos propres marques."
    }
  ];

  return (
    <main className="pb-0 bg-tekki-cream">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-tekki-orange/[0.05] rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-tekki-ink/[0.03] rounded-full blur-[100px] pointer-events-none" />
        <div className="mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-[1200px] relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-tekki-orange/8 border border-tekki-orange/15 mb-6">
              <span className="text-sm font-medium text-tekki-orange tracking-wide">L&apos;équipe</span>
            </div>
            <h1 className="font-home-display text-[36px] lg:text-[46px] font-semibold text-tekki-ink tracking-tight mb-5 leading-[1.15]">
              L&apos;Équipe <span className="text-tekki-orange">TEKKI Studio</span>
            </h1>
            <p className="font-home-body text-[17px] text-tekki-ink-soft leading-relaxed">
              Des entrepreneurs qui créent leurs propres marques et accompagnent les vôtres vers le succès e-commerce.
            </p>
          </div>
        </div>
      </section>

      {/* Notre différence */}
      <section className="py-16 md:py-20 bg-white border-y border-tekki-ink/8">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-[1200px]">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <h2 className="font-home-display text-[28px] font-semibold text-tekki-ink tracking-tight mb-6">
              Ce qui nous rend différents
            </h2>
            <div className="bg-tekki-cream p-8 rounded-2xl border border-tekki-ink/8 text-left">
              <p className="font-home-body text-tekki-ink-soft text-[16px] mb-4 leading-relaxed">
                Nous ne sommes pas des consultants qui donnent des conseils depuis un bureau. Nous sommes des entrepreneurs qui créent et développent activement leurs propres marques e-commerce.
              </p>
              <p className="font-home-body text-tekki-ink-soft text-[16px] leading-relaxed">
                <strong className="text-tekki-ink font-semibold">VIENS ON S&apos;CONNAÎT</strong> (8 000+ produits vendus) et <strong className="text-tekki-ink font-semibold">AMANI</strong> sont nos terrains de test. Chaque stratégie que nous vous recommandons a d&apos;abord été validée sur nos marques. Vous ne payez pas pour de la théorie, mais pour ce qui fonctionne réellement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Présentation de l'équipe */}
      <section className="py-16 md:py-20">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-[1200px]">
          <h3 className="font-home-display text-[24px] font-semibold text-tekki-ink tracking-tight text-center mb-12">
            Rencontrez l&apos;équipe
          </h3>
          <div className="grid md:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto mb-16 sm:mb-20">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                id={`member-${member.id}`}
                className="bg-white rounded-2xl overflow-hidden border border-tekki-ink/8 hover:border-tekki-orange/20 hover:shadow-lg transition-all group"
              >
                <div className="w-full h-72 relative">
                  <Image
                    src={member.imageSrc}
                    alt={member.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{ objectFit: 'cover' }}
                    className="transition-all group-hover:scale-105 duration-500"
                  />
                </div>
                <div className="p-4 sm:p-6">
                  <h3 className="font-home-display text-[19px] font-semibold text-tekki-ink mb-1">
                    {member.name}
                  </h3>
                  <div className="text-tekki-orange-deep font-home-body font-medium text-sm mb-4">{member.role}</div>

                  <div className="mb-5">
                    <div className="flex items-center text-tekki-ink-soft text-sm mb-3">
                      <MapPin className="w-4 h-4 mr-1" />
                      {member.location}
                    </div>

                    {/* Spécialités */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {member.expertise.map((skill, idx) => (
                        <span
                          key={idx}
                          className="bg-tekki-ink/5 text-tekki-ink-soft text-xs px-3 py-1 rounded-full font-home-body"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="font-home-body text-tekki-ink-soft text-sm leading-relaxed mb-6">
                    {expandedMember === member.id ? member.fullBio : member.bio}
                  </p>

                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => toggleBio(member.id)}
                      className={`text-tekki-ink-soft hover:text-tekki-orange text-sm flex items-center transition-colors rounded-sm ${focusRing}`}
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
                          aria-label={`${member.name} sur LinkedIn`}
                          className={`w-8 h-8 bg-tekki-ink/5 hover:bg-tekki-orange active:scale-95 text-tekki-ink-soft hover:text-white rounded-full flex items-center justify-center transition-all ${focusRing}`}
                        >
                          <Linkedin className="w-4 h-4" />
                        </a>
                      )}
                      {member.social.twitter && (
                        <a
                          href={member.social.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${member.name} sur Twitter`}
                          className={`w-8 h-8 bg-tekki-ink/5 hover:bg-tekki-orange active:scale-95 text-tekki-ink-soft hover:text-white rounded-full flex items-center justify-center transition-all ${focusRing}`}
                        >
                          <Twitter className="w-4 h-4" />
                        </a>
                      )}
                      {member.social.instagram && (
                        <a
                          href={member.social.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${member.name} sur Instagram`}
                          className={`w-8 h-8 bg-tekki-ink/5 hover:bg-tekki-orange active:scale-95 text-tekki-ink-soft hover:text-white rounded-full flex items-center justify-center transition-all ${focusRing}`}
                        >
                          <Instagram className="w-4 h-4" />
                        </a>
                      )}
                      {member.social.github && (
                        <a
                          href={member.social.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${member.name} sur GitHub`}
                          className={`w-8 h-8 bg-tekki-ink/5 hover:bg-tekki-orange active:scale-95 text-tekki-ink-soft hover:text-white rounded-full flex items-center justify-center transition-all ${focusRing}`}
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
      <section className="py-16 md:py-20 bg-white border-y border-tekki-ink/8">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-[1200px]">
          <h2 className="font-home-display text-[28px] font-semibold text-tekki-ink tracking-tight text-center mb-12">
            Notre Philosophie de Travail
          </h2>
          <div className="grid md:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
            {teamValues.map((value, index) => (
              <div
                key={index}
                className="text-center p-6 sm:p-8 bg-tekki-cream rounded-2xl hover:border-tekki-orange/20 transition-all border border-tekki-ink/8 hover:-translate-y-1 duration-300 group"
              >
                <div className="w-14 h-14 bg-tekki-orange/8 rounded-full flex items-center justify-center mx-auto mb-5 group-hover:bg-tekki-orange group-hover:text-white transition-all text-tekki-orange-deep">
                  {value.icon}
                </div>
                <h3 className="font-home-display text-[17px] font-semibold text-tekki-ink mb-3">
                  {value.title}
                </h3>
                <p className="font-home-body text-tekki-ink-soft text-sm leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nos marques comme preuve */}
      <section className="py-16 md:py-20">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-[1200px]">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-home-display text-[28px] font-semibold text-tekki-ink tracking-tight mb-4">
              Nos marques sont notre meilleure preuve
            </h2>
            <p className="font-home-body text-tekki-ink-soft text-[16px] mb-8 leading-relaxed">
              Avant de vous accompagner, nous avons créé et développé nos propres marques à succès. Chaque conseil que nous donnons est basé sur notre expérience réelle.
            </p>
            <div className="grid md:grid-cols-2 gap-5 mb-8">
              <div className="bg-white p-6 rounded-2xl border border-tekki-ink/8">
                <div className="font-home-mono text-[26px] font-semibold text-tekki-ink mb-2 tabular-nums">8 000+</div>
                <div className="font-home-body text-tekki-ink font-medium mb-1">Produits vendus</div>
                <div className="font-home-body text-sm text-tekki-ink-soft">VIENS ON S&apos;CONNAÎT</div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-tekki-ink/8">
                <div className="font-home-mono text-[26px] font-semibold text-tekki-ink mb-2 tabular-nums">7 pays</div>
                <div className="font-home-body text-tekki-ink font-medium mb-1">Distribution</div>
                <div className="font-home-body text-sm text-tekki-ink-soft">Afrique de l&apos;Ouest + Diaspora</div>
              </div>
            </div>
            <Link
              href="/nos-marques"
              className={`inline-flex items-center justify-center gap-2 bg-tekki-ink hover:bg-tekki-ink/90 active:scale-[0.98] text-white px-8 py-4 rounded-full font-home-body font-semibold text-[15px] transition-all ${focusRing}`}
            >
              Découvrir nos marques
              <Award className="w-[18px] h-[18px]" />
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 md:py-20 bg-tekki-orange relative overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[400px] h-[400px] rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute bottom-[-15%] left-[-5%] w-[300px] h-[300px] rounded-full bg-white/5 pointer-events-none" />
        <div className="mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-[1200px] text-center relative z-10">
          <h2 className="font-home-display text-[28px] md:text-[32px] font-semibold text-white tracking-tight mb-5">
            Prêt à transformer votre marque en success story ?
          </h2>
          <p className="font-home-body text-[16px] text-white/[0.88] max-w-xl mx-auto mb-8 leading-relaxed">
            Bénéficiez de l&apos;expérience d&apos;une équipe qui a déjà créé et développé ses propres marques à succès.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/diagnostic"
              className={`inline-flex items-center justify-center gap-2 bg-white hover:shadow-xl hover:shadow-black/25 active:scale-[0.98] text-tekki-orange-deep px-8 py-4 rounded-full font-home-body font-semibold text-[15.5px] transition-all duration-300 ${focusRing}`}
            >
              Faire le diagnostic gratuit
              <Briefcase className="w-5 h-5" />
            </Link>
            <a
              href="https://wa.me/221781362728?text=Bonjour%20TEKKI%20Studio%20!%20J%27aimerais%20discuter%20de%20ma%20marque%20avec%20votre%20équipe."
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center justify-center gap-2 border border-white/30 hover:bg-white/10 active:scale-[0.98] text-white px-8 py-4 rounded-full font-home-body font-semibold text-[15.5px] transition-all ${focusRing}`}
            >
              Réserver un appel gratuit
              <FaWhatsapp className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
};

export default TeamPage;
