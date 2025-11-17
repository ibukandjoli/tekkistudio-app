// app/nos-marques/[slug]/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  TrendingUp,
  Star,
  Users,
  Globe,
  Target,
  Zap,
  ShoppingBag,
  Heart,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { motion } from 'framer-motion';

const BrandDetailPage = () => {
  const params = useParams();
  const slug = params.slug as string;

  const brandsData: Record<string, any> = {
    "viens-on-sconnait": {
      name: "VIENS ON S'CONNAÎT",
      tagline: "Jeux de conversation qui améliorent les relations",
      description: "VIENS ON S'CONNAÎT est notre première marque, lancée en 2022. C'est une gamme de jeux de cartes avec des questions significatives qui permettent de créer des liens authentiques et profonds entre les personnes.",
      gradient: "from-blue-500 to-pink-500",
      bgGradient: "from-blue-50 to-pink-50",
      color: "#21056b",
      image: "/images/brands/vosc.png",
      website: "https://viensonsconnait.com",

      stats: [
        { icon: <ShoppingBag className="w-6 h-6" />, value: "+8 000", label: "Jeux vendus" },
        { icon: <Star className="w-6 h-6" />, value: "98%", label: "Satisfaction client" },
        { icon: <Users className="w-6 h-6" />, value: "+5 000", label: "Clients conquis" },
        { icon: <Globe className="w-6 h-6" />, value: "7", label: "Pays d'export" }
      ],

      story: {
        challenge: "Lancer une marque de jeux de société sur un marché africain dominé par les produits importés, avec un budget marketing limité.",
        solution: "Nous avons créé une stratégie complète alliant storytelling émotionnel, marketing d'influence local, et vente directe optimisée via site e-commerce et réseaux sociaux.",
        results: [
          "8 000 jeux vendus en 2 ans",
          "Distribution dans 7 pays africains",
          "Programme de revendeurs actif dans 4 pays",
          "83% des ventes générées via notre site e-commerce"
        ]
      },

      learnings: [
        {
          title: "Le storytelling génère 60% des ventes",
          description: "En partageant l'histoire de la marque et des témoignages authentiques, nous avons créé une connexion émotionnelle qui convertit.",
          icon: <Heart className="w-6 h-6" />
        },
        {
          title: "Les micro-influenceurs sont plus rentables",
          description: "Collaborer avec les micro-influenceurs locaux (-10K abonnés) a généré 3x plus de ventes que les macro-influenceurs.",
          icon: <Users className="w-6 h-6" />
        },
        {
          title: "Le programme revendeurs démultiplie les ventes",
          description: "Notre réseau de 7 revendeurs génère aujourd'hui 45% du chiffre d'affaires avec un coût d'acquisition minimal.",
          icon: <TrendingUp className="w-6 h-6" />
        },
        {
          title: "L'optimisation mobile est cruciale",
          description: "85% des commandes viennent du mobile. Un site optimisé mobile-first a doublé notre taux de conversion.",
          icon: <Zap className="w-6 h-6" />
        }
      ],

      strategies: [
        {
          title: "Stratégie de lancement",
          points: [
            "Campagne teaser de 2 semaines sur Instagram",
            "Précommandes avec réduction de 20% pour créer l'urgence",
            "Création du site e-commerce optimisé mobile",
            "Exploitation de la St-Valentin comme levier marketing"
          ]
        },
        {
          title: "Marketing de contenu",
          points: [
            "Build in public : partage du processus de création",
            "Vidéos courtes montrant le produit en action",
            "Contenus éducatifs sur l'importance des conversations",
            "UGC (User Generated Content) encouragé et partagé"
          ]
        },
        {
          title: "Acquisition clients",
          points: [
            "Meta Ads ciblant les couples 25-45 ans",
            "Retargeting des visiteurs du site",
            "Email marketing avec séquences automatisées",
            "WhatsApp marketing pour la fidélisation"
          ]
        }
      ],

      testimonials: [
        {
          text: "Ce jeu a sauvé ma relation ! Les questions nous ont permis de nous redécouvrir et de parler de choses importantes qu'on évitait.",
          author: "Aminata S.",
          role: "Cliente à Dakar"
        },
        {
          text: "Je recommande les jeux VIENS ON S'CONNAÎT aux couples mariés que je coache. C'est un outil puissant pour renforcer la communication.",
          author: "Khady S.",
          role: "Coach Love & Relations"
        }
      ]
    },

    "amani": {
      name: "AMANI",
      tagline: "La solution naturelle contre les douleurs menstruelles",
      description: "AMANI est marque de bien-être pour femmes qui propose une ceinture chauffante innovante qui combine thermothérapie et massothérapie pour soulager les douleurs menstruelles de manière naturelle et efficace.",
      gradient: "from-rose-500 to-purple-500",
      bgGradient: "from-rose-50 to-blue-50",
      color: "#F43F5E",
      image: "/images/brands/amani.png",
      website: "https://amanifemme.com",

      stats: [
        { icon: <ShoppingBag className="w-6 h-6" />, value: "+250", label: "Unités vendues" },
        { icon: <Star className="w-6 h-6" />, value: "4.9/5", label: "Note moyenne" },
        { icon: <Users className="w-6 h-6" />, value: "95%", label: "Taux de rachat" },
        { icon: <Globe className="w-6 h-6" />, value: "2", label: "Marchés actifs" }
      ],

      story: {
        challenge: "Lancer un produit de bien-être féminin premium sur un marché africain avec une forte concurrence de produits bas de gamme.",
        solution: "Positionnement premium avec focus sur la qualité, l'efficacité et le service client. Campagnes Meta Ads ciblées et marketing d'influence avec des professionnelles de santé.",
        results: [
          "+250 unités vendues en 3 mois",
          "Taux de satisfaction de 95%",
          "Communauté de +200 femmes engagées",
          "ROI positif sur les campagnes publicitaires"
        ]
      },

      learnings: [
        {
          title: "Le positionnement premium fonctionne",
          description: "Malgré un prix 3x supérieur à la concurrence, la qualité et le service ont conquis notre cible.",
          icon: <Star className="w-6 h-6" />
        },
        {
          title: "Les témoignages de professionnels de santé rassurent",
          description: "Collaborer avec des gynécologues et sages-femmes a augmenté la crédibilité et les ventes de 40%.",
          icon: <Users className="w-6 h-6" />
        },
        {
          title: "La communauté génère du bouche-à-oreille",
          description: "Notre groupe WhatsApp de clientes génère 25% des nouvelles ventes via recommandations.",
          icon: <Heart className="w-6 h-6" />
        },
        {
          title: "Le contenu éducatif convertit mieux",
          description: "Les posts éducatifs sur les douleurs menstruelles génèrent 2x plus d'engagement que les posts produit.",
          icon: <Target className="w-6 h-6" />
        }
      ],

      strategies: [
        {
          title: "Lancement produit",
          points: [
            "Étude de marché auprès de 200 femmes",
            "Test produit avec 50 bêta-testeuses",
            "Campagne de précommandes avec early bird discount",
            "Partenariat avec 2 influenceuses bien-être"
          ]
        },
        {
          title: "Acquisition clients",
          points: [
            "Meta Ads avec ciblage femmes 18-40 ans",
            "Contenu éducatif sur les douleurs menstruelles",
            "Témoignages vidéo de clientes satisfaites",
            "Programme d'affiliation pour ambassadrices"
          ]
        },
        {
          title: "Fidélisation",
          points: [
            "Groupe WhatsApp privé pour clientes",
            "Programme de parrainage avec réductions",
            "Email nurturing avec conseils bien-être",
            "Service client ultra-réactif (24h)"
          ]
        }
      ],

      testimonials: [
        {
          text: "La ceinture d'AMANI a changé ma vie ! Je peux enfin continuer mes activités normalement pendant mes règles. Plus besoin de médicaments.",
          author: "Nadège K.",
          role: "Cliente à Abidjan"
        },
        {
          text: "Je recommande la ceinture d'AMANI à toutes mes patientes. C'est une solution sûre, naturelle et vraiment efficace.",
          author: "Dr. Diallo",
          role: "Gynécologue"
        }
      ]
    }
  };

  const brand = brandsData[slug];

  if (!brand) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Marque non trouvée</h1>
          <Link href="/nos-marques" className="text-[#ff7f50] hover:underline">
            Retour à nos marques
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className={`pt-32 pb-20 md:pt-40 md:pb-28 bg-gradient-to-br ${brand.gradient} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>

        <div className="container mx-auto px-4 relative z-10">
          <Link
            href="/nos-marques"
            className="inline-flex items-center text-white/90 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour à nos marques
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              {brand.name}
            </h1>
            <p className="text-2xl text-white/90 mb-8">
              {brand.tagline}
            </p>
            <p className="text-xl text-white/80 leading-relaxed mb-8">
              {brand.description}
            </p>

            <a
              href={brand.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-white text-[#0f4c81] px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-xl hover:shadow-2xl hover:scale-105"
            >
              <Globe className="w-5 h-5 mr-2" />
              Visiter le site web
              <ExternalLink className="w-4 h-4 ml-2" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {brand.stats.map((stat: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${brand.gradient} flex items-center justify-center text-white mx-auto mb-3`}>
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold" style={{ color: brand.color }}>
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0f4c81] mb-12 text-center">
              L'histoire de {brand.name}
            </h2>

            <div className="space-y-8">
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-xl font-bold text-[#0f4c81] mb-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                    <Target className="w-5 h-5 text-red-600" />
                  </div>
                  Le défi
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {brand.story.challenge}
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-xl font-bold text-[#0f4c81] mb-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-blue-600" />
                  </div>
                  Notre solution
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {brand.story.solution}
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-xl font-bold text-[#0f4c81] mb-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                  </div>
                  Les résultats
                </h3>
                <ul className="space-y-3">
                  {brand.story.results.map((result: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{result}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Learnings */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0f4c81] mb-12 text-center">
            Ce que nous avons appris
          </h2>

          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
            {brand.learnings.map((learning: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${brand.gradient} flex items-center justify-center text-white mb-4`}>
                  {learning.icon}
                </div>
                <h3 className="text-lg font-bold text-[#0f4c81] mb-3">
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

      {/* Strategies */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0f4c81] mb-12 text-center">
            Les stratégies appliquées
          </h2>

          <div className="max-w-4xl mx-auto space-y-8">
            {brand.strategies.map((strategy: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg"
              >
                <h3 className="text-xl font-bold text-[#0f4c81] mb-6">
                  {strategy.title}
                </h3>
                <ul className="space-y-3">
                  {strategy.points.map((point: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${brand.gradient} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                        <span className="text-white text-xs font-bold">{idx + 1}</span>
                      </div>
                      <span className="text-gray-700">{point}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0f4c81] mb-12 text-center">
            Ce que disent nos clients
          </h2>

          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
            {brand.testimonials.map((testimonial: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`bg-gradient-to-br ${brand.bgGradient} rounded-2xl p-8 border-2 border-gray-100`}
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed mb-6 italic">
                  "{testimonial.text}"
                </p>
                <div className="border-t border-gray-200 pt-4">
                  <div className="font-bold text-[#0f4c81]">{testimonial.author}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={`py-20 md:py-28 bg-gradient-to-br ${brand.gradient} relative overflow-hidden`}>
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
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Nous appliquons ces mêmes stratégies testées et validées à votre marque
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/nos-formules"
                className="inline-flex items-center justify-center bg-white text-[#0f4c81] px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-xl hover:shadow-2xl hover:scale-105"
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

export default BrandDetailPage;
