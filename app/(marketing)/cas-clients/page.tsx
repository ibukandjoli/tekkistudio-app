// app/cas-clients/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  TrendingUp,
  Star,
  Users,
  BarChart,
  CheckCircle,
  ExternalLink,
  Quote,
  Sparkles,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1 },
  }),
};

const CasClientsPage = () => {
  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [statsRef, statsInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [listRef, listInView] = useInView({ triggerOnce: true, threshold: 0.05 });

  const caseStudies = [
    {
      slug: 'abarings',
      client: 'Abarings',
      industry: 'Bijoux artisanaux',
      challenge: 'Gestion manuelle des commandes Instagram/WhatsApp, surtout à l\'international',
      result: 'Automatisation complète',
      image: '/images/portfolio/abarings.png',
      logo: '/images/clients/abarings.avif',
      website: 'https://abarings.com',
      stats: [
        { label: 'Commandes automatisées', value: '100%' },
        { label: 'Gain de temps', value: '+70%' },
        { label: 'Ventes internationales', value: '+150%' },
      ],
      testimonial:
        'Avant TEKKI Studio, j\'avais beaucoup de mal à gérer les commandes de mes bijoux, surtout celles venant de l\'international. Grâce au site créé pour ma marque, tout est automatisé et je peux me concentrer sur la création.',
      author: 'Fatou D., Fondatrice',
    },
    {
      slug: 'momo-le-bottier',
      client: 'Momo Le Bottier',
      industry: 'Chaussures artisanales',
      challenge: '2 boutiques physiques à Dakar, mais gestion manuelle complexe des commandes',
      result: 'Ventes globales automatisées',
      image: '/images/portfolio/momolebottier.png',
      logo: '/images/clients/momo-le-bottier.png',
      website: 'https://momolebottier.com',
      stats: [
        { label: 'Portée géographique', value: 'Mondiale' },
        { label: 'Automatisation', value: '100%' },
        { label: 'Pays couverts', value: '+10' },
      ],
      testimonial:
        'TEKKI Studio a transformé notre marque avec un site professionnel qui dépasse nos attentes. Nos clients partout dans le monde peuvent désormais commander leurs chaussures et sacs et être livrés. C\'était notre objectif.',
      author: 'Maguette D., Co-fondatrice',
    },
    {
      slug: '6c-no-filter',
      client: '6C No Filter',
      industry: 'Cosmétiques naturels',
      challenge: 'Jeune marque limitée à Instagram/TikTok, plafond de ventes difficile à briser',
      result: 'Site = 1er canal de vente',
      image: '/images/portfolio/6cnofilter.png',
      logo: '/images/clients/6c-no-filter.webp',
      website: 'https://6cnofilter.com',
      stats: [
        { label: 'Délai livraison', value: '< 10 jours' },
        { label: 'Canal de vente #1', value: 'Site web' },
        { label: 'Satisfaction', value: '100%' },
      ],
      testimonial:
        'L\'équipe est extrêmement professionnelle et disponible. J\'avais besoin d\'un site professionnel pour ma marque de cosmétiques, ils ont livré un travail magnifique en moins de 10 jours. Je recommande à 100% !',
      author: 'Fatou C., Fondatrice',
    },
    {
      slug: 'ahovi-cosmetics',
      client: 'Ahovi Cosmetics',
      industry: 'Cosmétiques',
      challenge:
        'Besoin d\'un site e-commerce moderne pour automatiser les ventes et élargir le marché au-delà de Dakar',
      result: 'Ventes automatisées et expansion géographique',
      image: '/images/portfolio/ahovi.png',
      logo: '/images/clients/ahovi-beauty.png',
      website: 'https://ahovicosmetics.com',
      stats: [
        { label: 'Automatisation', value: '100%' },
        { label: 'Nouveaux marchés', value: '+5 villes' },
        { label: 'Croissance CA', value: '+180%' },
      ],
      testimonial:
        'J\'avais besoin d\'un site e-commerce moderne et professionnel pour automatiser mes ventes et toucher plus de clientes. TEKKI Studio a dépassé mes attentes avec une solution qui me permet de vendre partout au Sénégal.',
      author: 'Katia K., Fondatrice',
    },
    {
      slug: 'racines-precieuses',
      client: 'Racines Précieuses',
      industry: 'Produits capillaires naturels',
      challenge:
        'Vente manuelle chronophage, dépendance aux distributeurs, besoin d\'autonomie et automatisation',
      result: 'Autonomie totale et gain de temps',
      image: '/images/portfolio/racines.png',
      logo: '/images/clients/racines-precieuses.avif',
      website: 'https://racinesprecieuses.com',
      stats: [
        { label: 'Gain de temps', value: '+80%' },
        { label: 'Indépendance', value: '100%' },
        { label: 'Portée nationale', value: 'Sénégal' },
      ],
      testimonial:
        'Gérer mes commandes manuellement me prenait énormément de temps. Avec le site créé par TEKKI Studio, je peux vendre en toute autonomie partout au Sénégal et me concentrer sur le développement de mes produits.',
      author: 'Anta F., Fondatrice',
    },
  ];

  const results = [
    { icon: <TrendingUp className="w-7 h-7" />, stat: '+200%', label: 'Croissance moyenne du CA' },
    { icon: <Star className="w-7 h-7" />, stat: '4.9/5', label: 'Note moyenne clients' },
    { icon: <Users className="w-7 h-7" />, stat: '100%', label: 'Taux de satisfaction' },
    { icon: <BarChart className="w-7 h-7" />, stat: '×3.5', label: 'ROI moyen' },
  ];

  return (
    <div className="min-h-screen bg-tekki-cream font-body">

      {/* ── Hero ────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        {/* subtle decorative blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-tekki-orange/[0.04] rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-tekki-blue/[0.03] rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            ref={heroRef}
            variants={fadeUp}
            initial="hidden"
            animate={heroInView ? 'visible' : 'hidden'}
            className="max-w-4xl mx-auto text-center"
          >
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-tekki-orange/8 border border-tekki-orange/15 mb-8">
              <Sparkles className="w-4 h-4 text-tekki-orange" />
              <span className="text-sm font-medium text-tekki-orange tracking-wide">
                Success Stories
              </span>
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-tekki-blue leading-tight tracking-tight mb-6">
              Des marques africaines qui{' '}
              <span className="text-tekki-orange">cartonnent</span> grâce à nous.
            </h1>

            <p className="text-lg md:text-xl text-tekki-blue/60 mb-10 leading-relaxed max-w-3xl mx-auto">
              Découvrez comment nous avons aidé des marques ambitieuses à transformer leur
              business en machines de vente automatisées.
            </p>

            <div className="flex flex-wrap justify-center gap-6 text-tekki-blue/50">
              {['Résultats réels', 'Stratégies validées', 'ROI mesurable'].map((label) => (
                <div key={label} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-tekki-orange" />
                  <span className="text-sm font-medium">{label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Chiffres clés ────────────────────────────────────── */}
      <section className="py-14 bg-white border-y border-tekki-blue/8">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div
            ref={statsRef}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
          >
            {results.map((item, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                animate={statsInView ? 'visible' : 'hidden'}
                className="text-center group"
              >
                <div className="w-14 h-14 rounded-2xl bg-tekki-orange/8 border border-tekki-orange/15 flex items-center justify-center text-tekki-orange mx-auto mb-4 group-hover:bg-tekki-orange group-hover:text-white transition-all duration-300">
                  {item.icon}
                </div>
                <div className="text-3xl font-heading font-bold text-tekki-blue mb-1">
                  {item.stat}
                </div>
                <div className="text-xs text-tekki-blue/50 font-semibold uppercase tracking-wider">
                  {item.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Liste des cas clients ────────────────────────────── */}
      <section className="py-24">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            ref={listRef}
            variants={fadeUp}
            initial="hidden"
            animate={listInView ? 'visible' : 'hidden'}
            className="text-center mb-16"
          >
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-tekki-blue mb-4">
              Leurs success stories
            </h2>
            <p className="text-lg text-tekki-blue/60 max-w-2xl mx-auto leading-relaxed">
              Plongez au cœur de l&apos;infrastructure de vente de nos partenaires les plus ambitieux.
            </p>
          </motion.div>

          <div className="space-y-16">
            {caseStudies.map((cs, index) => (
              <motion.div
                key={cs.slug}
                custom={index}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                className="bg-white rounded-3xl overflow-hidden border border-tekki-blue/8 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className={`grid md:grid-cols-2 ${index % 2 === 1 ? '' : ''}`}>
                  {/* Visuel */}
                  <div
                    className={`relative min-h-[320px] md:min-h-[420px] overflow-hidden ${
                      index % 2 === 1 ? 'md:order-2' : ''
                    }`}
                  >
                    <Image
                      src={cs.image}
                      alt={cs.client}
                      fill
                      className="object-cover"
                    />
                    {/* overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-tekki-blue/60 via-tekki-blue/20 to-transparent" />

                    {/* logo + result pill */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                      <div className="flex items-end justify-between gap-4">
                        <div className="w-16 h-16 relative bg-white rounded-2xl p-2 shadow-lg">
                          <Image
                            src={cs.logo}
                            alt={`${cs.client} logo`}
                            fill
                            className="object-contain p-1"
                          />
                        </div>
                        <div className="bg-tekki-orange text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                          {cs.result}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contenu */}
                  <div
                    className={`p-8 md:p-12 flex flex-col justify-center ${
                      index % 2 === 1 ? 'md:order-1' : ''
                    }`}
                  >
                    {/* Header */}
                    <div className="mb-6">
                      <p className="text-tekki-orange text-xs font-bold uppercase tracking-widest mb-1">
                        {cs.industry}
                      </p>
                      <h3 className="font-heading text-2xl md:text-3xl font-bold text-tekki-blue">
                        {cs.client}
                      </h3>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-8">
                      {cs.stats.map((stat, idx) => (
                        <div
                          key={idx}
                          className="border-l-2 border-tekki-orange/30 pl-3"
                        >
                          <div className="font-heading text-xl font-bold text-tekki-blue">
                            {stat.value}
                          </div>
                          <div className="text-[10px] text-tekki-blue/50 font-semibold uppercase tracking-wide leading-tight mt-0.5">
                            {stat.label}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Témoignage */}
                    <div className="bg-tekki-cream rounded-2xl p-6 mb-8 relative">
                      <Quote className="absolute top-3 right-4 w-8 h-8 text-tekki-blue/5" />
                      <p className="text-tekki-blue/70 italic text-sm leading-relaxed mb-4">
                        &ldquo;{cs.testimonial}&rdquo;
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-tekki-orange flex items-center justify-center text-white text-xs font-bold uppercase">
                          {cs.author[0]}
                        </div>
                        <span className="text-sm font-semibold text-tekki-blue">{cs.author}</span>
                      </div>
                    </div>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Link
                        href={`/cas-clients/${cs.slug}`}
                        className="flex-1 inline-flex items-center justify-center bg-tekki-blue text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-tekki-blue/90 transition-colors group"
                      >
                        Lire le cas complet
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Link>
                      <a
                        href={cs.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center border border-tekki-blue/15 text-tekki-blue/70 px-6 py-3 rounded-full font-semibold text-sm hover:border-tekki-blue/30 hover:text-tekki-blue transition-colors"
                      >
                        Voir le site
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Final ───────────────────────────────────────── */}
      <section className="py-24 bg-tekki-blue border-b border-white/10 relative overflow-hidden">
        {/* subtle circles */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] border border-white/5 rounded-full pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-white/5 rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Prêt à devenir la prochaine{' '}
              <span className="text-tekki-orange">success story</span> de notre portfolio ?
            </h2>
            <p className="text-lg text-white/60 mb-10 max-w-xl mx-auto leading-relaxed">
              Construisons ensemble le moteur de votre croissance e-commerce.
            </p>

            <div className="flex justify-center">
              <Link
                href="/diagnostic"
                className="inline-flex items-center justify-center bg-tekki-orange hover:bg-tekki-orange/90 text-white px-8 py-4 rounded-full font-bold text-base transition-all shadow-[0_0_30px_rgba(234,88,12,0.3)] hover:shadow-[0_0_40px_rgba(234,88,12,0.4)] hover:-translate-y-0.5 group"
              >
                Faire le diagnostic gratuit
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default CasClientsPage;
