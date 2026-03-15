// app/nos-marques/NosMarquesContent.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowRight, TrendingUp, Star, Users, Sparkles,
  ShoppingBag, Target, Zap, Award
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1 } }),
};

const NosMarquesContent = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 });
  const [statsRef, statsInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const brands = [
    {
      slug: 'viens-on-sconnait',
      name: "VIENS ON S'CONNAÎT",
      tagline: 'Jeux de conversation',
      description: "Une gamme de jeux de société conversationnels conçus pour favoriser des conversations profondes et significatives entre couples, amis, familles et collègues.",
      image: '/images/brands/vosc.jpg',
      year: '2022',
      accentColor: 'from-purple-500 to-pink-500',
      stats: [
        { value: '+8 000', label: 'Jeux vendus', icon: <ShoppingBag className="w-4 h-4" /> },
        { value: '98%', label: 'Satisfaction', icon: <Star className="w-4 h-4" /> },
        { value: '+5 000', label: 'Clients', icon: <Users className="w-4 h-4" /> },
        { value: '7', label: "Pays d'export", icon: <Sparkles className="w-4 h-4" /> },
      ],
      mainMetrics: [
        { label: 'Croissance annuelle', value: '250%', progress: 100 },
        { label: 'Taux de réachat', value: '45%', progress: 45 },
        { label: 'Engagement social', value: '12K', progress: 80 },
      ],
      learnings: [
        'Storytelling pour générer 60% des ventes organiques',
        'Stratégie micro-influenceurs qui a boosté la notoriété de 300%',
        'Optimisation des publicités Meta pour le marché africain',
        'Programme revendeurs qui a triplé les ventes en 6 mois',
      ],
      link: '/nos-marques/viens-on-sconnait',
    },
    {
      slug: 'amani',
      name: 'AMANI',
      tagline: 'Bien-être féminin',
      description: "Une marque de produits de bien-être et de soins personnels dédiée aux femmes africaines, offrant des solutions naturelles et efficaces pour répondre à leurs besoins spécifiques.",
      image: '/images/brands/amani-2.png',
      year: '2023',
      accentColor: 'from-rose-500 to-orange-500',
      stats: [
        { value: '+250', label: 'Unités vendues', icon: <ShoppingBag className="w-4 h-4" /> },
        { value: '4.7/5', label: 'Note moyenne', icon: <Star className="w-4 h-4" /> },
        { value: '95%', label: 'Satisfaction', icon: <Award className="w-4 h-4" /> },
        { value: '2', label: 'Marchés actifs', icon: <Target className="w-4 h-4" /> },
      ],
      mainMetrics: [
        { label: 'Croissance mensuelle', value: '35%', progress: 35 },
        { label: 'Taux de conversion', value: '8.2%', progress: 82 },
        { label: 'Communauté engagée', value: '2.5K', progress: 60 },
      ],
      learnings: [
        "Création d'une communauté engagée de +2500 femmes",
        'Stratégie de contenu éducatif qui convertit à +8%',
        'Optimisation des campagnes pub pour produit de niche',
        'Gestion logistique et SAV qui fidélise 95% des clientes',
      ],
      link: '/nos-marques/amani',
    },
  ];

  const learnings = [
    { icon: <Target className="w-6 h-6" />, title: 'Stratégie de lancement', description: 'Comment créer du buzz et générer des pré-ventes avant le lancement officiel de la marque.' },
    { icon: <ShoppingBag className="w-6 h-6" />, title: 'E-commerce optimisé', description: 'Architecture de site et parcours client testés qui augmentent le taux de conversion.' },
    { icon: <Users className="w-6 h-6" />, title: 'Programme Revendeurs', description: 'Stratégies de recrutement et de gestion des revendeurs pour maximiser la portée.' },
    { icon: <Zap className="w-6 h-6" />, title: 'Publicité digitale', description: 'Campagnes Meta Ads, TikTok et Google optimisées pour le marché africain.' },
  ];

  return (
    <div className="min-h-screen font-body bg-tekki-cream">

      {/* ── Hero ────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-tekki-orange/[0.04] rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-tekki-blue/[0.03] rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeUp} initial="hidden" animate="visible"
            className="max-w-4xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-tekki-orange/8 border border-tekki-orange/15 mb-8">
              <Sparkles className="w-4 h-4 text-tekki-orange" />
              <span className="text-sm font-medium text-tekki-orange tracking-wide uppercase">Les Marques de TEKKI Studio</span>
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-tekki-blue leading-tight tracking-tight mb-6">
              Nous créons nos propres marques{' '}
              <span className="text-tekki-orange">avant d'accompagner les vôtres</span>
            </h1>
            <p className="text-lg md:text-xl text-tekki-blue/60 mb-10 leading-relaxed max-w-2xl mx-auto">
              Chaque stratégie que nous proposons a d'abord été testée et validée sur nos marques. Vous ne payez pas pour de la théorie, mais pour <strong className="text-tekki-blue">ce qui fonctionne réellement</strong>.
            </p>

            <div className="flex flex-wrap justify-center gap-6 text-tekki-blue/60">
              {[
                { icon: <TrendingUp className="w-4 h-4" />, label: '+8 000 produits vendus' },
                { icon: <Star className="w-4 h-4" />, label: '+95% de satisfaction' },
                { icon: <Users className="w-4 h-4" />, label: "9 pays d'export" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <span className="text-tekki-orange">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Les 2 marques ───────────────────────────────────── */}
      <section className="py-20 bg-white border-y border-tekki-blue/8">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div ref={ref} variants={fadeUp} initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-tekki-orange/8 border border-tekki-orange/15 mb-5">
              <Sparkles className="w-4 h-4 text-tekki-orange" />
              <span className="text-sm font-medium text-tekki-orange">La preuve que ça marche</span>
            </div>
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-tekki-blue mb-4">
              Nos 2 marques <span className="text-tekki-orange">propriétaires</span>
            </h2>
            <p className="text-lg text-tekki-blue/60 max-w-2xl mx-auto leading-relaxed">
              Découvrez les marques que nous avons créées et que nous continuons à développer avec succès.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {brands.map((brand, index) => (
              <motion.div
                key={index}
                custom={index} variants={fadeUp} initial="hidden"
                animate={inView ? 'visible' : 'hidden'}
                className="bg-white rounded-3xl border border-tekki-blue/8 overflow-hidden hover:border-tekki-orange/20 hover:shadow-lg transition-all group"
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${brand.accentColor}`} />
                  <img
                    src={brand.image} alt={brand.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-tekki-blue/70 via-tekki-blue/20 to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5">
                    <span className="bg-white/90 text-tekki-blue/70 px-3 py-1 rounded-full text-xs font-bold inline-block mb-2">
                      {brand.tagline} · Lancée en {brand.year}
                    </span>
                    <h3 className="font-heading text-2xl font-bold text-white">{brand.name}</h3>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <p className="text-tekki-blue/70 leading-relaxed mb-7">{brand.description}</p>

                  {/* Metrics */}
                  <div className="mb-7">
                    <h4 className="text-xs font-bold text-tekki-blue/40 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-tekki-orange" /> Performances clés
                    </h4>
                    <div className="space-y-3">
                      {brand.mainMetrics.map((metric, idx) => (
                        <div key={idx}>
                          <div className="flex justify-between text-sm mb-1.5">
                            <span className="text-tekki-blue/60">{metric.label}</span>
                            <span className="font-bold text-tekki-orange">{metric.value}</span>
                          </div>
                          <div className="h-1.5 bg-tekki-blue/8 rounded-full overflow-hidden">
                            <motion.div
                              className={`h-full bg-gradient-to-r ${brand.accentColor} rounded-full`}
                              initial={{ width: 0 }}
                              animate={inView ? { width: `${metric.progress}%` } : { width: 0 }}
                              transition={{ delay: 0.5 + idx * 0.1, duration: 1, ease: 'easeOut' }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Stats grid */}
                  <div className="grid grid-cols-2 gap-3 mb-7">
                    {brand.stats.map((stat, idx) => (
                      <div key={idx} className="bg-tekki-cream rounded-xl p-4 border border-tekki-blue/8 flex items-center gap-3">
                        <span className="text-tekki-orange">{stat.icon}</span>
                        <div>
                          <div className="font-heading font-bold text-tekki-blue text-lg leading-none">{stat.value}</div>
                          <div className="text-xs text-tekki-blue/50 mt-0.5">{stat.label}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Learnings */}
                  <div className="bg-tekki-cream rounded-xl p-5 border border-tekki-blue/8 mb-6">
                    <h4 className="font-bold text-tekki-blue mb-3 flex items-center gap-2 text-sm">
                      <Award className="w-4 h-4 text-tekki-orange" />
                      Apprentissages appliqués à nos clients
                    </h4>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {brand.learnings.map((learning, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-tekki-blue/60">
                          <span className="text-tekki-orange font-bold flex-shrink-0 mt-0.5">✓</span>
                          <span className="leading-relaxed">{learning}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link
                    href={brand.link}
                    className="flex items-center justify-center w-full py-4 rounded-full bg-tekki-blue text-white font-bold text-sm hover:bg-tekki-blue/90 transition-colors group/btn"
                  >
                    Découvrir l'histoire complète
                    <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats globaux ───────────────────────────────────── */}
      <section ref={statsRef} className="py-20">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeUp} initial="hidden" animate={statsInView ? 'visible' : 'hidden'}
            className="bg-tekki-blue rounded-3xl p-10 md:p-14 relative overflow-hidden"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-white/5 rounded-full pointer-events-none" />

            <div className="relative z-10">
              <div className="text-center mb-10">
                <h3 className="font-heading text-2xl md:text-3xl font-bold text-white mb-2">
                  Résultats cumulés de nos 2 marques
                </h3>
                <p className="text-white/50">En moins de 3 ans</p>
              </div>

              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { value: '+8K', label: 'Produits vendus' },
                  { value: '+7K', label: 'Clients satisfaits' },
                  { value: '9', label: 'Pays atteints' },
                  { value: '96%', label: 'Satisfaction moyenne' },
                ].map((item, i) => (
                  <motion.div
                    key={i} custom={i} variants={fadeUp}
                    initial="hidden" animate={statsInView ? 'visible' : 'hidden'}
                    className="text-center bg-white/5 rounded-2xl p-6 border border-white/8"
                  >
                    <div className="font-heading text-4xl font-bold text-tekki-orange mb-2">{item.value}</div>
                    <p className="text-white/60 text-sm">{item.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Apprentissages ──────────────────────────────────── */}
      <section className="py-20 bg-white border-y border-tekki-blue/8">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-tekki-orange/8 border border-tekki-orange/15 mb-5">
              <Sparkles className="w-4 h-4 text-tekki-orange" />
              <span className="text-sm font-medium text-tekki-orange">Notre expertise</span>
            </div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-tekki-blue mb-4">
              Ce que nous avons appris{' '}
              <span className="text-tekki-orange">(et appliquons à vos marques)</span>
            </h2>
            <p className="text-lg text-tekki-blue/60 max-w-2xl mx-auto leading-relaxed">
              Chaque succès et chaque échec nous a enseigné des leçons précieuses que nous mettons au service de votre marque.
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
            {learnings.map((learning, index) => (
              <motion.div
                key={index} custom={index} variants={fadeUp}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="bg-tekki-cream rounded-2xl p-7 border border-tekki-blue/8 flex gap-5 group hover:border-tekki-orange/20 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-tekki-orange/8 flex items-center justify-center text-tekki-orange flex-shrink-0 group-hover:bg-tekki-orange group-hover:text-white transition-all">
                  {learning.icon}
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold text-tekki-blue mb-2 group-hover:text-tekki-orange transition-colors">
                    {learning.title}
                  </h3>
                  <p className="text-tekki-blue/60 leading-relaxed text-sm">{learning.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────── */}
      <section className="py-20 bg-tekki-blue relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <div className="w-14 h-14 rounded-2xl bg-tekki-orange flex items-center justify-center mx-auto mb-6">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
              Prêt à appliquer ces stratégies à votre marque ?
            </h2>
            <p className="text-lg text-white/60 mb-10 max-w-xl mx-auto leading-relaxed">
              Découvrez nos offres d'accompagnement et commencez votre transformation dès aujourd'hui.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/diagnostic"
                className="inline-flex items-center justify-center bg-tekki-orange hover:bg-tekki-orange/90 text-white px-8 py-4 rounded-full font-bold text-base transition-all shadow-[0_0_30px_rgba(234,88,12,0.3)] hover:-translate-y-0.5 group"
              >
                Faire le diagnostic gratuit
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="https://calendly.com/tekki-studio/consultation-gratuite"
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center border border-white/15 text-white px-8 py-4 rounded-full font-bold text-base hover:bg-white/8 transition-colors"
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
