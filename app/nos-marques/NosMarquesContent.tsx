// app/nos-marques/NosMarquesContent.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  TrendingUp,
  Star,
  Users,
  Sparkles,
  ShoppingBag,
  Target,
  Zap,
  Award
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const NosMarquesContent = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const brands = [
    {
      slug: "viens-on-sconnait",
      name: "VIENS ON S'CONNAÎT",
      shortName: "VOSC",
      tagline: "Jeux de conversation",
      description: "Une gamme de jeux de société conversationnels conçus pour favoriser des conversations profondes et significatives entre couples, amis, familles et collègues.",
      image: "/images/brands/vosc.jpg",
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50",
      year: "2022",
      stats: [
        { value: "+8 000", label: "Jeux vendus", icon: <ShoppingBag className="w-5 h-5" />, color: "text-purple-600" },
        { value: "98%", label: "Satisfaction", icon: <Star className="w-5 h-5" />, color: "text-purple-600" },
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
      slug: "amani",
      name: "AMANI",
      shortName: "AMANI",
      tagline: "Bien-être féminin",
      description: "Une marque de produits de bien-être et de soins personnels dédiée aux femmes africaines, offrant des solutions naturelles et efficaces pour répondre à leurs besoins spécifiques.",
      image: "/images/brands/amani-2.png",
      gradient: "from-rose-500 to-orange-500",
      bgGradient: "from-rose-50 to-orange-50",
      year: "2023",
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

  const learnings = [
    {
      icon: <Target className="w-6 h-6" />,
      title: "Stratégie de lancement",
      description: "Comment créer du buzz et générer des pré-ventes avant le lancement officiel de la marque",
      gradient: "from-[#0f4c81] to-[#1a5a8f]"
    },
    {
      icon: <ShoppingBag className="w-6 h-6" />,
      title: "E-commerce optimisé",
      description: "Architecture de site et parcours client testés qui augmentent le taux de conversion",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Programme Revendeurs",
      description: "Stratégies de recrutement et de gestion des revendeurs pour maximiser la portée",
      gradient: "from-[#fe6117] to-[#ff8c4d]"
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
      <section className="pt-32 pb-20 md:pt-40 md:pb-32 bg-gradient-to-br from-gray-900 via-[#0f4c81] to-gray-900 relative overflow-hidden">
        {/* Décoration */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#fe6117]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl"></div>

        <div className="w-full px-6 md:px-12 lg:px-16 xl:px-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2.5 mb-8">
              <Sparkles className="w-4 h-4 text-[#fe6117]" />
              <span className="text-white/95 text-sm font-bold tracking-wide uppercase">
                Nos marques propriétaires
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Nous créons nos propres marques avant d'accompagner les vôtres
            </h1>

            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Chaque stratégie que nous proposons a d'abord été testée et validée sur nos marques.
              Vous ne payez pas pour de la théorie, mais pour <span className="font-bold text-white">ce qui fonctionne réellement</span>.
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
                <span>9 pays d'export</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Nos marques */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
        {/* Décoration */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#fe6117]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#0f4c81]/5 rounded-full blur-3xl"></div>

        <div className="w-full px-6 md:px-12 lg:px-16 xl:px-20 relative z-10">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16 max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-[#fe6117]/10 border border-[#fe6117]/20 rounded-full px-5 py-2.5 mb-6">
              <Sparkles className="w-4 h-4 text-[#fe6117]" />
              <span className="text-[#fe6117] text-sm font-bold tracking-wide uppercase">
                La preuve que ça marche
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Nos 2 marques <span className="text-[#fe6117]">propriétaires</span>
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Découvrez les marques que nous avons créées et que nous continuons à développer avec succès
            </p>
          </motion.div>

          {/* Les deux marques côte à côte comme OurBrands section */}
          <motion.div
            className="grid lg:grid-cols-2 gap-8 mb-16 max-w-7xl mx-auto"
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            {brands.map((brand, index) => (
              <motion.div
                key={index}
                className="group bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200 hover:shadow-2xl hover:border-[#fe6117]/30 transition-all duration-500"
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ duration: 0.7, delay: index * 0.3 }}
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

                  {/* Ce qu'on a appris */}
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
                  <div className="text-5xl font-bold text-[#fe6117] mb-2">+7K</div>
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

      {/* Ce que nous avons appris */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-gray-50 via-blue-50/30 to-gray-50 relative overflow-hidden">
        {/* Décoration */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#fe6117]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#0f4c81]/5 rounded-full blur-3xl"></div>

        <div className="w-full px-6 md:px-12 lg:px-16 xl:px-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mb-16 max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-[#fe6117]/10 border border-[#fe6117]/20 rounded-full px-5 py-2.5 mb-6">
              <Sparkles className="w-4 h-4 text-[#fe6117]" />
              <span className="text-[#fe6117] text-sm font-bold tracking-wide uppercase">
                Notre expertise
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Ce que nous avons appris <span className="text-[#fe6117]">(et appliquons à vos marques)</span>
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Chaque succès et chaque échec nous a enseigné des leçons précieuses que nous mettons
              au service de votre marque
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
            {learnings.map((learning, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border border-gray-100 hover:border-[#fe6117]/30 group"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${learning.gradient} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                  {learning.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#fe6117] transition-colors">
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
      <section className="py-20 md:py-32 bg-gradient-to-br from-gray-900 via-[#0f4c81] to-gray-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#fe6117]/10 rounded-full blur-3xl"></div>

        <div className="w-full px-6 md:px-12 lg:px-16 xl:px-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#fe6117] mb-6">
              <Zap className="w-8 h-8 text-white" />
            </div>

            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Prêt à appliquer ces stratégies à votre marque ?
            </h2>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Découvrez nos offres d'accompagnement et commencez votre transformation dès aujourd'hui
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/nos-formules"
                className="inline-flex items-center justify-center bg-[#fe6117] hover:bg-[#e55710] text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-xl hover:shadow-2xl"
              >
                Découvrir nos formules
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <a
                href="https://calendly.com/tekki-studio/consultation-gratuite"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-4 rounded-full font-bold text-lg transition-all"
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

export default NosMarquesContent;
