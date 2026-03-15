// app/cas-clients/[slug]/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  TrendingUp,
  Star,
  Target,
  Zap,
  CheckCircle,
  Users,
  ShoppingCart,
  Globe,
  ExternalLink,
  Quote,
} from 'lucide-react';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1 },
  }),
};

const CaseStudyDetailPage = () => {
  const params = useParams();
  const slug = params.slug as string;

  const casesData: Record<string, any> = {
    abarings: {
      client: 'Abarings',
      industry: 'Bijoux artisanaux haut de gamme',
      location: 'Dakar, Sénégal',
      color: '#9333EA',
      website: 'https://abarings.com',

      challenge: {
        description:
          "Abarings n'avait pas encore de site e-commerce lorsque Fatou nous a contactés. Elle vendait déjà via Instagram et WhatsApp, mais elle avait beaucoup de mal à gérer les commandes, surtout celles venant de l'international.",
        problems: [
          'Aucun site e-commerce existant',
          'Gestion manuelle complexe des commandes',
          'Difficultés avec les commandes internationales',
          'Temps perdu sur la gestion au lieu de la création',
        ],
      },

      solution: {
        description:
          'Nous avons créé un site e-commerce moderne et professionnel qui agit comme un vendeur pour la marque, disponible 24h/24, permettant à Fatou de se concentrer sur la création.',
        actions: [
          {
            category: 'Création site e-commerce',
            points: [
              'Design moderne et épuré mettant en valeur les bijoux',
              'Collecte automatisée des commandes et achats',
              'Optimisation pour les ventes internationales',
              'Paiement sécurisé multi-devises',
            ],
          },
          {
            category: 'Automatisation des processus',
            points: [
              'Gestion automatique des commandes',
              'Notifications instantanées pour chaque achat',
              'Suivi des livraisons internationales',
              'Synchronisation avec les stocks',
            ],
          },
          {
            category: 'Expérience utilisateur',
            points: [
              'Navigation intuitive mobile-first',
              'Galerie photos professionnelle',
              'Descriptions détaillées des produits',
              'Process de commande simplifié',
            ],
          },
        ],
      },

      results: {
        highlight: 'Automatisation complète',
        description:
          'Abarings dispose maintenant d\'un site e-commerce professionnel qui automatise la collecte des commandes et permet à Fatou de se concentrer sur sa passion : la création de bijoux.',
        metrics: [
          { label: 'Commandes automatisées', value: '100%', icon: <CheckCircle className="w-6 h-6" /> },
          { label: 'Gain de temps', value: '+70%', icon: <Zap className="w-6 h-6" /> },
          { label: 'Ventes internationales', value: '+150%', icon: <Globe className="w-6 h-6" /> },
          { label: 'Disponibilité', value: '24/7', icon: <ShoppingCart className="w-6 h-6" /> },
          { label: 'Satisfaction client', value: '4.8/5', icon: <Star className="w-6 h-6" /> },
          { label: 'Focus création', value: '+80%', icon: <Target className="w-6 h-6" /> },
        ],
      },

      testimonial: {
        quote:
          "Avant TEKKI Studio, j'avais beaucoup de mal à gérer les commandes de mes bijoux, surtout celles venant de l'international. Grâce au site créé pour ma marque, tout est automatisé et je peux me concentrer sur la création.",
        author: 'Fatou D.',
        role: "Fondatrice d'Abarings",
      },

      learnings: [
        "L'automatisation libère du temps pour la création",
        'Un bon site e-commerce facilite les ventes internationales',
        'Le mobile-first est crucial pour le marché africain',
        "La simplicité du processus d'achat augmente les conversions",
      ],
    },

    'momo-le-bottier': {
      client: 'Momo Le Bottier',
      industry: 'Chaussures artisanales sur-mesure',
      location: 'Dakar, Sénégal',
      color: '#3B82F6',
      website: 'https://momolebottier.com',

      challenge: {
        description:
          "Momo Le Bottier n'avait pas de site web lorsque Maguette nous a contactés. La marque avait déjà 2 boutiques physiques à Dakar et expédiait déjà dans la sous-région africaine, mais la collecte et la gestion des commandes était un vrai casse-tête car tout était fait manuellement.",
        problems: [
          'Aucun site e-commerce existant',
          'Gestion manuelle complexe des commandes',
          "Processus d'expédition sous-régionale difficile",
          'Impossible de vendre efficacement au-delà des boutiques physiques',
        ],
      },

      solution: {
        description:
          "Nous avons conçu un site e-commerce permettant à Momo Le Bottier de vendre partout où leurs clients se trouvent, sans avoir à gérer manuellement chaque commande.",
        actions: [
          {
            category: 'Plateforme e-commerce globale',
            points: [
              'Site e-commerce moderne et professionnel',
              'Gestion automatisée des commandes mondiales',
              'Système de paiement sécurisé multi-devises',
              'Galerie photos mettant en valeur les créations',
            ],
          },
          {
            category: 'Automatisation logistique',
            points: [
              "Gestion automatique des expéditions internationales",
              'Notifications de commandes en temps réel',
              'Suivi des livraisons pour les clients',
              'Intégration avec les boutiques physiques',
            ],
          },
          {
            category: 'Expérience client optimisée',
            points: [
              'Navigation intuitive et mobile-first',
              'Process de commande simplifié',
              'Descriptions détaillées des produits artisanaux',
              'Service client intégré',
            ],
          },
        ],
      },

      results: {
        highlight: 'Ventes globales automatisées',
        description:
          "Momo Le Bottier dispose maintenant d'un site e-commerce professionnel permettant aux clients du monde entier de commander et d'être livrés, avec une gestion 100% automatisée.",
        metrics: [
          { label: 'Portée géographique', value: 'Mondiale', icon: <Globe className="w-6 h-6" /> },
          { label: 'Automatisation', value: '100%', icon: <CheckCircle className="w-6 h-6" /> },
          { label: 'Clients satisfaits', value: '+500', icon: <Users className="w-6 h-6" /> },
          { label: 'Disponibilité', value: '24/7', icon: <ShoppingCart className="w-6 h-6" /> },
          { label: 'Satisfaction', value: '4.9/5', icon: <Star className="w-6 h-6" /> },
          { label: 'Gain de temps', value: '+75%', icon: <Zap className="w-6 h-6" /> },
        ],
      },

      testimonial: {
        quote:
          "TEKKI Studio a transformé notre marque avec un site professionnel qui dépasse nos attentes. Nos clients partout dans le monde peuvent désormais commander leurs chaussures et sacs et être livrés. C'était notre objectif.",
        author: 'Maguette D.',
        role: 'Co-fondatrice de Momo Le Bottier',
      },

      learnings: [
        "L'automatisation permet de se concentrer sur l'artisanat",
        "Un bon site e-commerce ouvre les portes du monde entier",
        'Le storytelling artisanal crée une connexion forte',
        'La simplicité du processus encourage les achats internationaux',
      ],
    },

    '6c-no-filter': {
      client: '6C No Filter',
      industry: 'Cosmétiques naturels',
      location: 'Dakar, Sénégal',
      color: '#10B981',
      website: 'https://6cnofilter.com',

      challenge: {
        description:
          "6C No Filter était encore une jeune marque seulement présente sur Instagram et TikTok lorsque Fatou nous a contactés. Elle avait beaucoup de mal à briser le plafond de verre de ventes mensuelles, car elle vendait principalement à son entourage et sa communauté.",
        problems: [
          'Présence limitée à Instagram et TikTok',
          'Plafond de ventes difficile à briser',
          "Ventes limitées à l'entourage et la communauté",
          "Impossible de gérer création de contenu + création produits",
        ],
      },

      solution: {
        description:
          "Après un audit, nous avons proposé un site e-commerce moderne et professionnel permettant d'atteindre des clients au-delà de sa communauté et vendre, même lorsqu'elle dort.",
        actions: [
          {
            category: 'Site e-commerce rapide',
            points: [
              'Design moderne et professionnel en moins de 10 jours',
              'Focus sur les produits cosmétiques naturels',
              'Système de commande automatisé',
              'Optimisation mobile-first',
            ],
          },
          {
            category: 'Expansion au-delà de la communauté',
            points: [
              'SEO optimisé pour attirer de nouveaux clients',
              "Stratégies d'acquisition au-delà des réseaux sociaux",
              'Ventes automatisées 24/7',
              'Portée géographique élargie',
            ],
          },
          {
            category: 'Automatisation',
            points: [
              'Collecte automatique des commandes',
              'Notifications instantanées',
              'Libération de temps pour la création de produits',
              'Process de vente qui fonctionne en continu',
            ],
          },
        ],
      },

      results: {
        highlight: 'Site = 1er canal de vente',
        description:
          "Aujourd'hui, le site e-commerce de 6C No Filter est devenu son premier canal de vente, permettant à Fatou de dépasser le plafond de ventes et d'atteindre des clients au-delà de sa communauté.",
        metrics: [
          { label: 'Délai livraison', value: '< 10 jours', icon: <Zap className="w-6 h-6" /> },
          { label: 'Canal de vente #1', value: 'Site web', icon: <Target className="w-6 h-6" /> },
          { label: 'Portée élargie', value: '+300%', icon: <TrendingUp className="w-6 h-6" /> },
          { label: 'Ventes automatiques', value: '24/7', icon: <ShoppingCart className="w-6 h-6" /> },
          { label: 'Satisfaction', value: '100%', icon: <Star className="w-6 h-6" /> },
          { label: 'Nouveaux clients', value: '+250%', icon: <Users className="w-6 h-6" /> },
        ],
      },

      testimonial: {
        quote:
          "L'équipe est extrêmement professionnelle et disponible. J'avais besoin d'un site professionnel pour ma marque de cosmétiques, ils ont livré un travail magnifique en moins de 10 jours. Je recommande à 100% !",
        author: 'Fatou C.',
        role: 'Fondatrice de 6C No Filter',
      },

      learnings: [
        'Un site e-commerce bien conçu devient le canal de vente principal',
        "L'automatisation permet de vendre au-delà de sa communauté",
        "La rapidité de livraison n'empêche pas la qualité",
        "Un bon site e-commerce vend même pendant que vous dormez",
      ],
    },
  };

  const caseStudy = casesData[slug];

  if (!caseStudy) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-tekki-cream">
        <div className="text-center">
          <h1 className="font-heading text-3xl font-bold text-tekki-blue mb-4">
            Cas client non trouvé
          </h1>
          <Link href="/cas-clients" className="text-tekki-orange hover:underline font-semibold">
            ← Retour aux cas clients
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-tekki-cream font-body text-tekki-blue">

      {/* ── Hero ────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-tekki-orange/[0.04] rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-tekki-blue/[0.03] rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/cas-clients"
            className="inline-flex items-center text-tekki-blue/50 hover:text-tekki-blue mb-10 transition-colors group text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Retour aux cas clients
          </Link>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="max-w-4xl"
          >
            <div className="inline-block bg-tekki-orange/8 border border-tekki-orange/15 rounded-full px-4 py-2 mb-6">
              <span className="text-tekki-orange text-xs font-bold uppercase tracking-widest">
                Success Story
              </span>
            </div>

            <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold text-tekki-blue mb-4 leading-tight">
              {caseStudy.client}
            </h1>
            <p className="text-lg text-tekki-blue/50 mb-10 font-medium">
              {caseStudy.industry}
              <span className="mx-3 opacity-30">|</span>
              {caseStudy.location}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <div className="bg-white border border-tekki-blue/8 rounded-2xl px-8 py-5 shadow-sm">
                <div className="text-tekki-blue/40 text-xs font-bold uppercase tracking-widest mb-2">
                  Résultat stratégique
                </div>
                <div className="font-heading text-2xl md:text-3xl font-bold text-tekki-blue">
                  {caseStudy.results.highlight}
                </div>
              </div>

              <a
                href={caseStudy.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-tekki-orange text-white px-7 py-5 rounded-2xl font-bold transition-all hover:bg-tekki-orange/90 hover:-translate-y-0.5 shadow-sm"
              >
                <Globe className="w-5 h-5 mr-2" />
                Visiter le site
                <ExternalLink className="w-4 h-4 ml-2 opacity-70" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Défi ────────────────────────────────────────────── */}
      <section className="py-20 bg-white border-y border-tekki-blue/8">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 text-tekki-orange mb-6">
                <Target size={20} />
                <span className="text-xs font-bold uppercase tracking-[0.2em]">Le défi à relever</span>
              </div>
              <p className="text-xl md:text-2xl text-tekki-blue/80 mb-12 leading-relaxed font-light">
                {caseStudy.challenge.description}
              </p>

              <div className="bg-red-50 border border-red-100 rounded-2xl p-8">
                <h3 className="font-bold text-red-500 text-sm mb-5 uppercase tracking-wider">
                  Points de friction identifiés
                </h3>
                <ul className="grid md:grid-cols-2 gap-4">
                  {caseStudy.challenge.problems.map((problem: string, index: number) => (
                    <li key={index} className="flex items-start gap-3 text-tekki-blue/70">
                      <span className="text-red-400 mt-0.5 flex-shrink-0 font-bold">✕</span>
                      <span className="leading-relaxed">{problem}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Solution ────────────────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 text-tekki-orange mb-6">
              <Zap size={20} />
              <span className="text-xs font-bold uppercase tracking-[0.2em]">Notre Solution</span>
            </div>
            <p className="text-xl text-tekki-blue/60 mb-12 leading-relaxed font-light">
              {caseStudy.solution.description}
            </p>

            <div className="space-y-6">
              {caseStudy.solution.actions.map((action: any, index: number) => (
                <motion.div
                  key={index}
                  custom={index}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl p-8 border border-tekki-blue/8 shadow-sm hover:shadow-md transition-shadow"
                >
                  <h3 className="font-heading text-xl font-bold text-tekki-blue mb-6">
                    {action.category}
                  </h3>
                  <ul className="grid md:grid-cols-2 gap-4">
                    {action.points.map((point: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3 text-tekki-blue/70">
                        <CheckCircle className="w-5 h-5 text-tekki-orange flex-shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{point}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Résultats ───────────────────────────────────────── */}
      <section className="py-20 bg-white border-y border-tekki-blue/8">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center mb-14"
            >
              <h2 className="font-heading text-3xl md:text-5xl font-bold text-tekki-blue mb-4">
                Les résultats
              </h2>
              <p className="text-lg text-tekki-blue/60 leading-relaxed max-w-2xl mx-auto">
                {caseStudy.results.description}
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {caseStudy.results.metrics.map((metric: any, index: number) => (
                <motion.div
                  key={index}
                  custom={index}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="bg-tekki-cream rounded-2xl p-8 text-center border border-tekki-blue/8 hover:border-tekki-orange/20 transition-colors group"
                >
                  <div className="w-12 h-12 bg-tekki-orange/8 rounded-xl flex items-center justify-center mx-auto mb-5 group-hover:bg-tekki-orange group-hover:text-white transition-all text-tekki-orange">
                    {metric.icon}
                  </div>
                  <div className="font-heading text-3xl font-bold text-tekki-blue mb-2">
                    {metric.value}
                  </div>
                  <div className="text-xs text-tekki-blue/50 font-bold uppercase tracking-wider">
                    {metric.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Témoignage ──────────────────────────────────────── */}
      <section className="py-24 bg-tekki-blue relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <Quote className="w-14 h-14 text-tekki-orange/30 mx-auto mb-8" />
            <blockquote className="font-heading text-2xl md:text-4xl text-white font-light leading-relaxed mb-10 tracking-tight">
              &ldquo;{caseStudy.testimonial.quote}&rdquo;
            </blockquote>
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-tekki-orange flex items-center justify-center text-white text-xl font-heading font-bold uppercase">
                {caseStudy.testimonial.author[0]}
              </div>
              <div>
                <div className="font-heading font-bold text-xl text-white mb-0.5">
                  {caseStudy.testimonial.author}
                </div>
                <div className="text-white/50 text-sm">{caseStudy.testimonial.role}</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Enseignements ───────────────────────────────────── */}
      <section className="py-20 bg-white border-y border-tekki-blue/8">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-tekki-blue uppercase tracking-wide">
                L&apos;expertise acquise
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {caseStudy.learnings.map((learning: string, index: number) => (
                <motion.div
                  key={index}
                  custom={index}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="bg-tekki-cream rounded-2xl p-6 border border-tekki-blue/8 flex items-start gap-4 group hover:border-tekki-orange/20 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-tekki-orange/8 flex items-center justify-center flex-shrink-0 group-hover:bg-tekki-orange group-hover:text-white transition-all text-tekki-orange">
                    <Zap className="w-5 h-5" />
                  </div>
                  <p className="text-tekki-blue/70 leading-relaxed">{learning}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Final ───────────────────────────────────────── */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-tekki-orange/[0.04] rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-tekki-blue mb-6 leading-tight">
              Prêt à transformer votre marque en{' '}
              <span className="text-tekki-orange">machine de vente</span> ?
            </h2>
            <p className="text-lg text-tekki-blue/60 mb-10 leading-relaxed max-w-xl mx-auto">
              Appliquons ensemble les stratégies qui ont fait le succès de{' '}
              <strong className="text-tekki-blue">{caseStudy.client}</strong>.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/diagnostic"
                className="inline-flex items-center justify-center bg-tekki-orange hover:bg-tekki-orange/90 text-white px-8 py-4 rounded-full font-bold text-base transition-all shadow-[0_4px_20px_rgba(234,88,12,0.25)] hover:shadow-[0_4px_28px_rgba(234,88,12,0.35)] hover:-translate-y-0.5 group"
              >
                Lancer mon diagnostic IA
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="https://calendly.com/tekki-studio/consultation-gratuite"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center border border-tekki-blue/15 text-tekki-blue/70 px-8 py-4 rounded-full font-bold text-base hover:border-tekki-blue/30 hover:text-tekki-blue transition-colors"
              >
                Réserver un appel d&apos;expert
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default CaseStudyDetailPage;
