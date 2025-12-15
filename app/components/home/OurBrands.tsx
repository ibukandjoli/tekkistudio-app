// app/components/home/OurBrands.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, TrendingUp, Users, Star, Sparkles, Award, Target, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const OurBrandsSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const brands = [
    {
      name: "VIENS ON S'CONNAÎT",
      shortName: "VOSC",
      tagline: "Jeux de conversation",
      description: "Une gamme de jeux de société conversationnels conçus pour favoriser des conversations profondes et significatives entre couples, amis, familles et collègues.",
      image: "/images/brands/vosc.png",
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50",
      year: "2022",
      stats: [
        { value: "+8 000", label: "Jeux vendus", icon: <ShoppingBag className="w-5 h-5" />, color: "text-purple-600" },
        { value: "98%", label: "Satisfaction client", icon: <Star className="w-5 h-5" />, color: "text-purple-600" },
        { value: "+5 000", label: "Clients conquis", icon: <Users className="w-5 h-5" />, color: "text-purple-600" },
        { value: "7", label: "Pays d'export", icon: <Sparkles className="w-5 h-5" />, color: "text-purple-600" }
      ],
      mainMetrics: [
        { label: "Croissance annuelle", value: "250%", progress: 100 },
        { label: "Taux de réachat", value: "45%", progress: 45 },
        { label: "Engagement social", value: "12K", progress: 80 }
      ],
      learnings: [
        "Storytelling pour générer 60% des ventes organiques",
        "Stratégie micro-influenceurs qui a boosté la notoriété de 300%",
        "Optimisation des publicités Meta pour le marché africain",
        "Programme revendeurs qui a triplé les ventes en 6 mois"
      ],
      link: "/nos-marques/viens-on-sconnait"
    },
    {
      name: "AMANI",
      shortName: "AMANI",
      tagline: "Bien-être féminin",
      description: "Une marque de produits de bien-être et de soins personnels dédiée aux femmes africaines, offrant des solutions naturelles et efficaces pour répondre à leurs besoins spécifiques.",
      image: "/images/brands/amani.png",
      gradient: "from-rose-500 to-orange-500",
      bgGradient: "from-rose-50 to-orange-50",
      year: "2025",
      stats: [
        { value: "+250", label: "Unités vendues", icon: <ShoppingBag className="w-5 h-5" />, color: "text-rose-600" },
        { value: "4.7/5", label: "Note moyenne", icon: <Star className="w-5 h-5" />, color: "text-rose-600" },
        { value: "95%", label: "Taux satisfaction", icon: <Award className="w-5 h-5" />, color: "text-rose-600" },
        { value: "2", label: "Marchés actifs", icon: <Target className="w-5 h-5" />, color: "text-rose-600" }
      ],
      mainMetrics: [
        { label: "Croissance mensuelle", value: "35%", progress: 35 },
        { label: "Taux de conversion", value: "8.2%", progress: 82 },
        { label: "Communauté engagée", value: "2.5K", progress: 60 }
      ],
      learnings: [
        "Création d'une communauté engagée de +2500 femmes",
        "Stratégie de contenu éducatif qui convertit à +8%",
        "Optimisation des campagnes pub pour produit de niche",
        "Gestion logistique et SAV qui fidélise 95% des clientes"
      ],
      link: "/nos-marques/amani"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden relative">
      {/* Décoration de fond */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#fe6117]/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#0f4c81]/5 rounded-full blur-3xl"></div>

      <div className="w-full px-6 md:px-12 lg:px-16 xl:px-20 relative z-10">
        {/* Header de section */}
        <motion.div
          className="text-center mb-16 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 bg-[#fe6117]/10 border border-[#fe6117]/20 rounded-full px-5 py-2.5 mb-6">
            <Sparkles className="w-4 h-4 text-[#fe6117]" />
            <span className="text-[#fe6117] text-sm font-bold tracking-wide uppercase">
              La preuve que ça marche
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Nous pratiquons ce que nous prêchons
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            Avant d'accompagner votre marque, nous avons créé et fait grandir les nôtres, ici, en Afrique.
            Nos marques sont la preuve concrète et ultime que <span className="font-semibold text-gray-900"> nos stratégies fonctionnent.</span>
          </p>
        </motion.div>

        {/* Les deux marques */}
        <motion.div
          ref={ref}
          className="grid lg:grid-cols-2 gap-8 mb-16 max-w-7xl mx-auto"
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={containerVariants}
        >
          {brands.map((brand, index) => (
            <motion.div
              key={index}
              className="group bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200 hover:shadow-2xl hover:border-[#fe6117]/30 transition-all duration-500"
              variants={itemVariants}
            >
              {/* Image en haut - Format paysage */}
              <div className="relative h-72 overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${brand.gradient}`}>
                  <img
                    src={brand.image}
                    alt={brand.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />

                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                  {/* Info en overlay */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full text-xs font-bold text-gray-700 inline-block mb-3">
                      {brand.tagline} • Lancée en {brand.year}
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                      {brand.name}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Contenu en dessous */}
              <div className="p-8 md:p-10">
                  {/* Description */}
                  <p className="text-gray-700 text-lg leading-relaxed mb-8">
                    {brand.description}
                  </p>

                  {/* Section Performances clés */}
                  <div className="mb-8">
                    <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4 flex items-center">
                      <TrendingUp className="w-4 h-4 mr-2 text-[#fe6117]" />
                      Performances clés
                    </h4>

                    <div className="space-y-4">
                      {brand.mainMetrics.map((metric, idx) => (
                        <div key={idx} className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium text-gray-700">{metric.label}</span>
                            <span className="font-bold text-[#fe6117] text-lg">{metric.value}</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div
                              className={`h-full bg-gradient-to-r ${brand.gradient} rounded-full`}
                              initial={{ width: 0 }}
                              animate={inView ? { width: `${metric.progress}%` } : { width: 0 }}
                              transition={{ delay: 0.5 + idx * 0.1, duration: 1, ease: "easeOut" }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Statistiques en grille 2x2 compactes */}
                  <div className="grid grid-cols-2 gap-3 mb-8">
                    {brand.stats.map((stat, idx) => (
                      <div
                        key={idx}
                        className="bg-gray-50 rounded-xl p-4 border border-gray-100 hover:border-[#fe6117]/30 hover:bg-white transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`${stat.color}`}>{stat.icon}</div>
                          <div>
                            <div className="text-xl font-bold text-gray-900">{stat.value}</div>
                            <div className="text-xs text-gray-600">{stat.label}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Ce qu'on a appris - Version condensée */}
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100 mb-6">
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                      <Award className="w-5 h-5 mr-2 text-[#fe6117]" />
                      Apprentissages clés appliqués à nos clients
                    </h4>
                    <div className="grid md:grid-cols-2 gap-3">
                      {brand.learnings.map((learning, idx) => (
                        <div key={idx} className="flex items-start text-sm text-gray-700">
                          <span className="text-[#fe6117] mr-2 font-bold flex-shrink-0 mt-1">✓</span>
                          <span className="leading-relaxed">{learning}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <Link
                    href={brand.link}
                    className={`block w-full text-center bg-gradient-to-r ${brand.gradient} hover:opacity-90 text-white py-4 rounded-full font-bold text-base transition-all shadow-lg hover:shadow-xl group/btn`}
                  >
                    <span className="flex items-center justify-center">
                      Découvrir l'histoire complète de {brand.shortName}
                      <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </span>
                  </Link>
              </div>

              {/* Barre décorative en bas */}
              <div className="h-1.5 bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100">
                <motion.div
                  className={`h-full bg-gradient-to-r ${brand.gradient}`}
                  initial={{ width: "0%" }}
                  animate={inView ? { width: "100%" } : { width: "0%" }}
                  transition={{ delay: 0.8 + index * 0.3, duration: 1.5, ease: "easeInOut" }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bloc de chiffres globaux */}
        <motion.div
          className="bg-gradient-to-br from-gray-900 via-[#0f4c81] to-gray-900 rounded-3xl p-10 md:p-14 text-white shadow-2xl relative overflow-hidden mb-16 max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          {/* Décoration */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#fe6117]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <div className="text-center mb-10">
              <h3 className="text-2xl md:text-3xl font-bold mb-3">
                Résultats cumulés de nos 2 marques
              </h3>
              <p className="text-white/80 text-lg">
                En moins de 3 ans, nos marques ont généré des résultats concrets
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="text-5xl font-bold text-[#fe6117] mb-2">+8K</div>
                <p className="text-white/80">Produits vendus</p>
              </div>
              <div className="text-center bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="text-5xl font-bold text-[#fe6117] mb-2">+5K</div>
                <p className="text-white/80">Clients satisfaits</p>
              </div>
              <div className="text-center bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="text-5xl font-bold text-[#fe6117] mb-2">9</div>
                <p className="text-white/80">Pays atteints</p>
              </div>
              <div className="text-center bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="text-5xl font-bold text-[#fe6117] mb-2">96%</div>
                <p className="text-white/80">Satisfaction moyenne</p>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default OurBrandsSection;
