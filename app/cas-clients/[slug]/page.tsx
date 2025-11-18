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
  BarChart,
  Users,
  ShoppingCart,
  Globe,
  ExternalLink
} from 'lucide-react';
import { motion } from 'framer-motion';

const CaseStudyDetailPage = () => {
  const params = useParams();
  const slug = params.slug as string;

  const casesData: Record<string, any> = {
    "abarings": {
      client: "Abarings",
      industry: "Bijoux artisanaux haut de gamme",
      location: "Dakar, Sénégal",
      gradient: "from-purple-500 to-pink-500",
      color: "#9333EA",
      website: "https://abarings.com",

      challenge: {
        title: "Le défi",
        description: "Abarings n'avait pas encore de site e-commerce lorsque Fatou nous a contactés. Elle vendait déjà via Instagram et WhatsApp, mais elle avait beaucoup de mal à gérer les commandes, surtout celles venant de l'international.",
        problems: [
          "Aucun site e-commerce existant",
          "Gestion manuelle complexe des commandes",
          "Difficultés avec les commandes internationales",
          "Temps perdu sur la gestion au lieu de la création"
        ]
      },

      solution: {
        title: "Notre solution",
        description: "Nous avons créé un site e-commerce moderne et professionnel qui agit comme un vendeur pour la marque, disponible 24h/24, permettant à Fatou de se concentrer sur la création.",
        actions: [
          {
            category: "Création site e-commerce",
            points: [
              "Design moderne et épuré mettant en valeur les bijoux",
              "Collecte automatisée des commandes et achats",
              "Optimisation pour les ventes internationales",
              "Paiement sécurisé multi-devises"
            ]
          },
          {
            category: "Automatisation des processus",
            points: [
              "Gestion automatique des commandes",
              "Notifications instantanées pour chaque achat",
              "Suivi des livraisons internationales",
              "Synchronisation avec les stocks"
            ]
          },
          {
            category: "Expérience utilisateur",
            points: [
              "Navigation intuitive mobile-first",
              "Galerie photos professionnelle",
              "Descriptions détaillées des produits",
              "Process de commande simplifié"
            ]
          }
        ]
      },

      results: {
        title: "Les résultats",
        highlight: "Automatisation complète",
        description: "Abarings dispose maintenant d'un site e-commerce professionnel qui automatise la collecte des commandes et permet à Fatou de se concentrer sur sa passion : la création de bijoux.",
        metrics: [
          { label: "Commandes automatisées", value: "100%", icon: <CheckCircle className="w-6 h-6" /> },
          { label: "Gain de temps", value: "+70%", icon: <Zap className="w-6 h-6" /> },
          { label: "Ventes internationales", value: "+150%", icon: <Globe className="w-6 h-6" /> },
          { label: "Disponibilité", value: "24/7", icon: <ShoppingCart className="w-6 h-6" /> },
          { label: "Satisfaction client", value: "4.8/5", icon: <Star className="w-6 h-6" /> },
          { label: "Focus création", value: "+80%", icon: <Target className="w-6 h-6" /> }
        ]
      },

      testimonial: {
        quote: "Avant TEKKI Studio, j'avais beaucoup de mal à gérer les commandes de mes bijoux, surtout celles venant de l'international. Grâce au site créé pour ma marque, tout est automatisé et je peux me concentrer sur la création.",
        author: "Fatou D.",
        role: "Fondatrice d'Abarings",
        image: "/images/testimonials/fatou.jpg"
      },

      learnings: [
        "L'automatisation libère du temps pour la création",
        "Un bon site e-commerce facilite les ventes internationales",
        "Le mobile-first est crucial pour le marché africain",
        "La simplicité du processus d'achat augmente les conversions"
      ]
    },

    "momo-le-bottier": {
      client: "Momo Le Bottier",
      industry: "Chaussures artisanales sur-mesure",
      location: "Dakar, Sénégal",
      gradient: "from-blue-500 to-cyan-500",
      color: "#3B82F6",
      website: "https://momolebottier.com",

      challenge: {
        title: "Le défi",
        description: "Momo Le Bottier n'avait pas de site web lorsque Maguette nous a contactés. La marque avait déjà 2 boutiques physiques à Dakar et expédiait déjà dans la sous-région africaine, mais la collecte et la gestion des commandes était un vrai casse-tête car tout était fait manuellement.",
        problems: [
          "Aucun site e-commerce existant",
          "Gestion manuelle complexe des commandes",
          "Processus d'expédition sous-régionale difficile",
          "Impossible de vendre efficacement au-delà des boutiques physiques"
        ]
      },

      solution: {
        title: "Notre solution",
        description: "Nous avons conçu un site e-commerce permettant à Momo Le Bottier de vendre partout où leurs clients se trouvent, sans avoir à gérer manuellement chaque commande.",
        actions: [
          {
            category: "Plateforme e-commerce globale",
            points: [
              "Site e-commerce moderne et professionnel",
              "Gestion automatisée des commandes mondiales",
              "Système de paiement sécurisé multi-devises",
              "Galerie photos mettant en valeur les créations"
            ]
          },
          {
            category: "Automatisation logistique",
            points: [
              "Gestion automatique des expéditions internationales",
              "Notifications de commandes en temps réel",
              "Suivi des livraisons pour les clients",
              "Intégration avec les boutiques physiques"
            ]
          },
          {
            category: "Expérience client optimisée",
            points: [
              "Navigation intuitive et mobile-first",
              "Process de commande simplifié",
              "Descriptions détaillées des produits artisanaux",
              "Service client intégré"
            ]
          }
        ]
      },

      results: {
        title: "Les résultats",
        highlight: "Ventes globales automatisées",
        description: "Momo Le Bottier dispose maintenant d'un site e-commerce professionnel permettant aux clients du monde entier de commander et d'être livrés, avec une gestion 100% automatisée.",
        metrics: [
          { label: "Portée géographique", value: "Mondiale", icon: <Globe className="w-6 h-6" /> },
          { label: "Automatisation", value: "100%", icon: <CheckCircle className="w-6 h-6" /> },
          { label: "Clients satisfaits", value: "+500", icon: <Users className="w-6 h-6" /> },
          { label: "Disponibilité", value: "24/7", icon: <ShoppingCart className="w-6 h-6" /> },
          { label: "Satisfaction", value: "4.9/5", icon: <Star className="w-6 h-6" /> },
          { label: "Gain de temps", value: "+75%", icon: <Zap className="w-6 h-6" /> }
        ]
      },

      testimonial: {
        quote: "TEKKI Studio a transformé notre marque avec un site professionnel qui dépasse nos attentes. Nos clients partout dans le monde peuvent désormais commander leurs chaussures et sacs et être livrés. C'était notre objectif.",
        author: "Maguette D.",
        role: "Co-fondatrice de Momo Le Bottier",
        image: "/images/testimonials/maguette.jpg"
      },

      learnings: [
        "L'automatisation permet de se concentrer sur l'artisanat",
        "Un bon site e-commerce ouvre les portes du monde entier",
        "Le storytelling artisanal crée une connexion forte",
        "La simplicité du processus encourage les achats internationaux"
      ]
    },

    "6c-no-filter": {
      client: "6C No Filter",
      industry: "Cosmétiques naturels",
      location: "Dakar, Sénégal",
      gradient: "from-emerald-500 to-teal-500",
      color: "#10B981",
      website: "https://6cnofilter.com",

      challenge: {
        title: "Le défi",
        description: "6C No Filter était encore une jeune marque seulement présente sur Instagram et TikTok lorsque Fatou nous a contactés. Elle avait beaucoup de mal à briser le plafond de verre de ventes mensuelles, car elle vendait principalement à son entourage et sa communauté. De plus, gérer l'acquisition de clients via la création de contenu ET la création de ses produits était devenu impossible.",
        problems: [
          "Présence limitée à Instagram et TikTok",
          "Plafond de ventes difficile à briser",
          "Ventes limitées à l'entourage et la communauté",
          "Impossible de gérer création de contenu + création produits"
        ]
      },

      solution: {
        title: "Notre solution",
        description: "Après un audit, nous avons proposé un site e-commerce moderne et professionnel permettant d'atteindre des clients au-delà de sa communauté et vendre, même lorsqu'elle dort.",
        actions: [
          {
            category: "Site e-commerce rapide",
            points: [
              "Design moderne et professionnel en moins de 10 jours",
              "Focus sur les produits cosmétiques naturels",
              "Système de commande automatisé",
              "Optimisation mobile-first"
            ]
          },
          {
            category: "Expansion au-delà de la communauté",
            points: [
              "SEO optimisé pour attirer de nouveaux clients",
              "Stratégies d'acquisition au-delà des réseaux sociaux",
              "Ventes automatisées 24/7",
              "Portée géographique élargie"
            ]
          },
          {
            category: "Automatisation",
            points: [
              "Collecte automatique des commandes",
              "Notifications instantanées",
              "Libération de temps pour la création de produits",
              "Process de vente qui fonctionne en continu"
            ]
          }
        ]
      },

      results: {
        title: "Les résultats",
        highlight: "Site = 1er canal de vente",
        description: "Aujourd'hui, le site e-commerce de 6C No Filter est devenu son premier canal de vente, permettant à Fatou de dépasser le plafond de ventes et d'atteindre des clients au-delà de sa communauté.",
        metrics: [
          { label: "Délai livraison", value: "< 10 jours", icon: <Zap className="w-6 h-6" /> },
          { label: "Canal de vente #1", value: "Site web", icon: <Target className="w-6 h-6" /> },
          { label: "Portée élargie", value: "+300%", icon: <TrendingUp className="w-6 h-6" /> },
          { label: "Ventes automatiques", value: "24/7", icon: <ShoppingCart className="w-6 h-6" /> },
          { label: "Satisfaction", value: "100%", icon: <Star className="w-6 h-6" /> },
          { label: "Nouveaux clients", value: "+250%", icon: <Users className="w-6 h-6" /> }
        ]
      },

      testimonial: {
        quote: "L'équipe est extrêmement professionnelle et disponible. J'avais besoin d'un site professionnel pour ma marque de cosmétiques, ils ont livré un travail magnifique en moins de 10 jours. Je recommande à 100% !",
        author: "Fatou C.",
        role: "Fondatrice de 6C No Filter",
        image: "/images/testimonials/cisse.jpg"
      },

      learnings: [
        "Un site e-commerce bien conçu devient le canal de vente principal",
        "L'automatisation permet de vendre au-delà de sa communauté",
        "La rapidité de livraison n'empêche pas la qualité",
        "Un bon site e-commerce vend même pendant que vous dormez"
      ]
    }
  };

  const caseStudy = casesData[slug];

  if (!caseStudy) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Cas client non trouvé</h1>
          <Link href="/cas-clients" className="text-[#ff7f50] hover:underline">
            Retour aux cas clients
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className={`pt-32 pb-20 md:pt-40 md:pb-28 bg-gradient-to-br ${caseStudy.gradient} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>

        <div className="container mx-auto px-4 relative z-10">
          <Link
            href="/cas-clients"
            className="inline-flex items-center text-white/90 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour aux cas clients
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <div className="inline-block bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 mb-6">
              <span className="text-white text-sm font-semibold">
                Success Story
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              {caseStudy.client}
            </h1>
            <p className="text-2xl text-white/90 mb-6">
              {caseStudy.industry} • {caseStudy.location}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-start mb-8">
              <div className="inline-block bg-white/20 backdrop-blur-sm border-2 border-white/40 rounded-xl px-8 py-4">
                <div className="text-white/80 text-sm font-semibold mb-2">Résultat obtenu</div>
                <div className="text-white text-3xl font-bold">{caseStudy.results.highlight}</div>
              </div>

              <a
                href={caseStudy.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-white text-[#0f4c81] px-6 py-3 rounded-xl font-bold transition-all shadow-xl hover:shadow-2xl hover:scale-105"
              >
                <Globe className="w-5 h-5 mr-2" />
                Visiter le site
                <ExternalLink className="w-4 h-4 ml-2" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Challenge */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0f4c81] mb-6">
              {caseStudy.challenge.title}
            </h2>
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              {caseStudy.challenge.description}
            </p>

            <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6">
              <h3 className="font-bold text-red-900 mb-4">Problèmes identifiés :</h3>
              <ul className="space-y-2">
                {caseStudy.challenge.problems.map((problem: string, index: number) => (
                  <li key={index} className="flex items-start gap-3 text-red-800">
                    <span className="text-red-500 mt-1">✗</span>
                    <span>{problem}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0f4c81] mb-6">
              {caseStudy.solution.title}
            </h2>
            <p className="text-xl text-gray-700 mb-12 leading-relaxed">
              {caseStudy.solution.description}
            </p>

            <div className="space-y-8">
              {caseStudy.solution.actions.map((action: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-8 shadow-lg"
                >
                  <h3 className="text-xl font-bold text-[#0f4c81] mb-4">
                    {action.category}
                  </h3>
                  <ul className="space-y-3">
                    {action.points.map((point: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{point}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0f4c81] mb-6 text-center">
              {caseStudy.results.title}
            </h2>
            <p className="text-xl text-gray-700 mb-12 text-center leading-relaxed max-w-3xl mx-auto">
              {caseStudy.results.description}
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {caseStudy.results.metrics.map((metric: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`bg-gradient-to-br ${caseStudy.gradient} rounded-2xl p-6 text-white text-center`}
                >
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-4">
                    {metric.icon}
                  </div>
                  <div className="text-3xl font-bold mb-2">{metric.value}</div>
                  <div className="text-white/90 text-sm">{metric.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className={`py-20 md:py-28 bg-gradient-to-br ${caseStudy.gradient} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-8 h-8 fill-white text-white" />
                ))}
              </div>
              <blockquote className="text-2xl md:text-3xl text-white font-light leading-relaxed mb-8">
                "{caseStudy.testimonial.quote}"
              </blockquote>
              <div className="text-white">
                <div className="font-bold text-xl mb-1">{caseStudy.testimonial.author}</div>
                <div className="text-white/80">{caseStudy.testimonial.role}</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Learnings */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0f4c81] mb-12 text-center">
              Ce que nous avons appris
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {caseStudy.learnings.map((learning: string, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-xl p-6 shadow-lg"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <Zap className="w-5 h-5 text-emerald-600" />
                    </div>
                    <p className="text-gray-700 font-medium">{learning}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={`py-20 md:py-28 bg-gradient-to-br ${caseStudy.gradient} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Prêt à créer votre success story ?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Appliquons ces mêmes stratégies à votre marque
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/nos-formules"
                className="inline-flex items-center justify-center bg-white text-[#0f4c81] px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-xl"
              >
                Découvrir nos offres
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

export default CaseStudyDetailPage;
