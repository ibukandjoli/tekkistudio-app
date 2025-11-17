// app/nos-marques/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  TrendingUp,
  Star,
  Users,
  Sparkles,
  ShoppingBag,
  Target,
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const NosMarquesPage = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const brands = [
    {
      slug: "viens-on-sconnait",
      name: "VIENS ON S'CONNAÎT",
      tagline: "Jeux de conversation",
      description: "Gamme de jeux de cartes avec des questions significatives qui transforment les relations grâce à des conversations authentiques et profondes.",
      image: "/images/brands/viensonsconnait/main.jpg",
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50",
      stats: [
        { value: "8 000", label: "Jeux vendus" },
        { value: "98%", label: "Satisfaction" },
        { value: "+5 000", label: "Clients" },
        { value: "7", label: "Pays" }
      ],
      highlights: [
        "Marque créée et développée par TEKKI Studio",
        "Distribution dans 7 pays d'Afrique",
        "83% des ventes générées via notre site e-commerce",
        "Programme revendeurs actif dans 4 pays"
      ],
      color: "#9333EA"
    },
    {
      slug: "amani",
      name: "AMANI",
      tagline: "Bien-être féminin",
      description: "Marque de bien-être qui propose Mia : une ceinture chauffante innovante qui soulage les douleurs menstruelles grâce à la thermothérapie et la massothérapie.",
      image: "/images/brands/amani/main.jpg",
      gradient: "from-rose-500 to-orange-500",
      bgGradient: "from-rose-50 to-orange-50",
      stats: [
        { value: "+250", label: "Unités vendues" },
        { value: "4.9/5", label: "Note moyenne" },
        { value: "95%", label: "Rachat" },
        { value: "2", label: "Marchés" }
      ],
      highlights: [
        "Lancement réussi en moins de 3 mois",
        "Positionnement premium validé par le marché",
        "Campagnes Meta Ads avec ROI positif",
        "Communauté engagée de +200 femmes"
      ],
      color: "#F43F5E"
    }
  ];

  const learnings = [
    {
      icon: <Target className="w-6 h-6" />,
      title: "Stratégie de lancement",
      description: "Comment créer du buzz et générer des pré-ventes avant le lancement officiel de la marque",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: <ShoppingBag className="w-6 h-6" />,
      title: "E-commerce optimisé",
      description: "Architecture de site et parcours client testés qui augmente le taux de visiteurs convertis en acheteurs",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Programme Revendeurs",
      description: "Stratégies de recrutement, d'incitation et de gestion des revendeurs pour maximiser la portée et les ventes",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Publicité digitale",
      description: "Campagnes Meta Ads, TikTok et Google optimisées pour le marché africain",
      gradient: "from-emerald-500 to-teal-500"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28 bg-gradient-to-br from-[#042b65] via-[#0f4c81] to-[#1a5a8f] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#ff7f50]/20 via-transparent to-transparent opacity-40"></div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2.5 mb-8">
              <Sparkles className="w-4 h-4 text-[#ff7f50]" />
              <span className="text-white/95 text-sm font-semibold">
                Nos marques propriétaires
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Nous créons nos propres marques avant d'accompagner les vôtres
            </h1>

            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Chaque stratégie que nous proposons a d'abord été testée et validée sur nos marques.
              Vous ne payez pas pour de la théorie, mais pour ce qui fonctionne réellement.
            </p>

            <div className="flex flex-wrap justify-center gap-6 text-white/90">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-400/30">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                </div>
                <span>+8 000 produits vendus</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-400/30">
                  <Star className="w-4 h-4 text-emerald-400" />
                </div>
                <span>+95% de satisfaction</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-400/30">
                  <Users className="w-4 h-4 text-emerald-400" />
                </div>
                <span>7 pays d'export</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Nos marques */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-[#0f4c81] mb-4">
              Nos 2 marques propriétaires
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez les marques que nous avons créées et que nous continuons à développer avec succès
            </p>
          </motion.div>

          <div className="max-w-7xl mx-auto space-y-12">
            {brands.map((brand, index) => (
              <motion.div
                key={brand.slug}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all border border-gray-100"
              >
                <div className={`grid md:grid-cols-2 gap-8 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                  {/* Image */}
                  <div className={`relative overflow-hidden ${index % 2 === 1 ? 'md:order-2' : ''}`}>
                    <div className="relative w-full h-full min-h-[400px] md:min-h-[500px]">
                      <Image
                        src={brand.image}
                        alt={brand.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        style={{ objectFit: 'cover' }}
                        className="transition-transform duration-700 hover:scale-105"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-br ${brand.gradient} opacity-20`}></div>
                    </div>
                  </div>

                  {/* Contenu */}
                  <div className={`p-8 md:p-12 flex flex-col justify-center ${index % 2 === 1 ? 'md:order-1' : ''}`}>
                    <p className="text-gray-600 text-lg leading-relaxed mb-6">
                      {brand.description}
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      {brand.stats.map((stat, idx) => (
                        <div key={idx} className={`bg-gradient-to-br ${brand.bgGradient} rounded-xl p-4 text-center border border-gray-100`}>
                          <div className="text-2xl font-bold" style={{ color: brand.color }}>
                            {stat.value}
                          </div>
                          <div className="text-sm text-gray-600">{stat.label}</div>
                        </div>
                      ))}
                    </div>

                    {/* Highlights */}
                    <div className="space-y-2 mb-6">
                      {brand.highlights.map((highlight, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                          </div>
                          <span className="text-gray-700 text-sm">{highlight}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA */}
                    <Link
                      href={`/nos-marques/${brand.slug}`}
                      className={`inline-flex items-center justify-center bg-gradient-to-r ${brand.gradient} text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-all shadow-lg hover:shadow-xl group`}
                    >
                      Découvrir {brand.name}
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Ce que nous avons appris */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-[#0f4c81] mb-4">
              Ce que nous avons appris (et appliquons à vos marques)
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Chaque succès et chaque échec nous a enseigné des leçons précieuses que nous mettons
              au service de votre marque
            </p>
          </motion.div>

          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
            {learnings.map((learning, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border border-gray-100"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${learning.gradient} flex items-center justify-center text-white mb-4`}>
                  {learning.icon}
                </div>
                <h3 className="text-xl font-bold text-[#0f4c81] mb-3">
                  {learning.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {learning.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-[#0f4c81] to-[#1a5a8f] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#ff7f50]/10 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Prêt à appliquer ces stratégies à votre marque ?
            </h2>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Découvrez nos offres d'accompagnement et commencez votre transformation dès aujourd'hui
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/nos-formules"
                className="inline-flex items-center justify-center bg-[#ff7f50] hover:bg-[#ff6b3d] text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-xl hover:shadow-2xl"
              >
                Découvrir nos formules
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <a
                href="https://calendly.com/tekki-studio/consultation-gratuite"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all"
              >
                Réserver un appel gratuit
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default NosMarquesPage;
