// app/cas-clients/page.tsx
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
  BarChart,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const CasClientsPage = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const caseStudies = [
    {
      slug: "abarings",
      client: "Abarings",
      industry: "Bijoux artisanaux",
      challenge: "Gestion manuelle des commandes Instagram/WhatsApp, surtout à l'international",
      result: "Automatisation complète",
      image: "/images/cases/abarings.jpg",
      gradient: "from-purple-500 to-pink-500",
      website: "https://abarings.com",
      stats: [
        { label: "Commandes automatisées", value: "100%" },
        { label: "Gain de temps", value: "+70%" },
        { label: "Ventes internationales", value: "+150%" }
      ],
      testimonial: "Avant TEKKI Studio, j'avais beaucoup de mal à gérer les commandes de mes bijoux, surtout celles venant de l'international. Grâce au site créé pour ma marque, tout est automatisé et je peux me concentrer sur la création.",
      author: "Fatou D., Fondatrice"
    },
    {
      slug: "momo-le-bottier",
      client: "Momo Le Bottier",
      industry: "Chaussures artisanales",
      challenge: "2 boutiques physiques à Dakar, mais gestion manuelle complexe des commandes",
      result: "Ventes globales automatisées",
      image: "/images/cases/momo.jpg",
      gradient: "from-blue-500 to-cyan-500",
      website: "https://momolebottier.com",
      stats: [
        { label: "Portée géographique", value: "Mondiale" },
        { label: "Automatisation", value: "100%" },
        { label: "Pays couverts", value: "+10" }
      ],
      testimonial: "TEKKI Studio a transformé notre marque avec un site professionnel qui dépasse nos attentes. Nos clients partout dans le monde peuvent désormais commander leurs chaussures et sacs et être livrés. C'était notre objectif.",
      author: "Maguette D., Co-fondatrice"
    },
    {
      slug: "6c-no-filter",
      client: "6C No Filter",
      industry: "Cosmétiques naturels",
      challenge: "Jeune marque limitée à Instagram/TikTok, plafond de ventes difficile à briser",
      result: "Site = 1er canal de vente",
      image: "/images/cases/6c.jpg",
      gradient: "from-emerald-500 to-teal-500",
      website: "https://6cnofilter.com",
      stats: [
        { label: "Délai livraison", value: "< 10 jours" },
        { label: "Canal de vente #1", value: "Site web" },
        { label: "Satisfaction", value: "100%" }
      ],
      testimonial: "L'équipe est extrêmement professionnelle et disponible. J'avais besoin d'un site professionnel pour ma marque de cosmétiques, ils ont livré un travail magnifique en moins de 10 jours. Je recommande à 100% !",
      author: "Fatou C., Fondatrice"
    }
  ];

  const results = [
    {
      icon: <TrendingUp className="w-8 h-8" />,
      stat: "+200%",
      label: "Croissance moyenne du CA"
    },
    {
      icon: <Star className="w-8 h-8" />,
      stat: "4.9/5",
      label: "Note moyenne clients"
    },
    {
      icon: <Users className="w-8 h-8" />,
      stat: "100%",
      label: "Taux de satisfaction"
    },
    {
      icon: <BarChart className="w-8 h-8" />,
      stat: "×3.5",
      label: "ROI moyen"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
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
                Nos success stories
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Des marques africaines qui cartonnent grâce à nous
            </h1>

            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Découvrez comment nous avons aidé des marques comme la vôtre à multiplier leurs ventes
              et conquérir de nouveaux marchés
            </p>

            <div className="flex flex-wrap justify-center gap-6 text-white/90">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span>Résultats réels et vérifiables</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span>Stratégies reproductibles</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span>ROI mesurable</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Résultats globaux */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {results.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#ff7f50] to-[#ff6b3d] flex items-center justify-center text-white mx-auto mb-3">
                  {item.icon}
                </div>
                <div className="text-3xl font-bold text-[#0f4c81] mb-1">{item.stat}</div>
                <div className="text-sm text-gray-600">{item.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Cas clients */}
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
              Leurs success stories
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez comment ces marques africaines ont transformé leur business
              avec nos stratégies e-commerce
            </p>
          </motion.div>

          <div className="max-w-7xl mx-auto space-y-16">
            {caseStudies.map((caseStudy, index) => (
              <motion.div
                key={caseStudy.slug}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all border border-gray-100"
              >
                <div className={`grid md:grid-cols-2 gap-8 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                  {/* Image/Visuel */}
                  <div className={`bg-gradient-to-br ${caseStudy.gradient} p-12 flex items-center justify-center relative overflow-hidden ${index % 2 === 1 ? 'md:order-2' : ''}`}>
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                    <div className="relative z-10 text-center">
                      <div className="text-6xl font-bold text-white mb-4">
                        {caseStudy.client.charAt(0)}
                      </div>
                      <h3 className="text-3xl font-bold text-white mb-2">{caseStudy.client}</h3>
                      <p className="text-white/90 text-lg mb-6">{caseStudy.industry}</p>
                      <div className="inline-block bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-xl px-6 py-3">
                        <div className="text-white/80 text-sm font-semibold mb-1">Résultat</div>
                        <div className="text-white text-xl font-bold">{caseStudy.result}</div>
                      </div>
                    </div>
                  </div>

                  {/* Contenu */}
                  <div className={`p-8 md:p-12 flex flex-col justify-center ${index % 2 === 1 ? 'md:order-1' : ''}`}>
                    <div className="mb-6">
                      <h4 className="text-sm font-bold text-gray-500 uppercase mb-2">Le défi</h4>
                      <p className="text-gray-700 text-lg">{caseStudy.challenge}</p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      {caseStudy.stats.map((stat, idx) => (
                        <div key={idx} className="text-center">
                          <div className="text-2xl font-bold text-[#0f4c81] mb-1">
                            {stat.value}
                          </div>
                          <div className="text-xs text-gray-600">{stat.label}</div>
                        </div>
                      ))}
                    </div>

                    {/* Témoignage */}
                    <div className="bg-gray-50 rounded-xl p-6 mb-6">
                      <p className="text-gray-700 italic mb-4">"{caseStudy.testimonial}"</p>
                      <div className="text-sm font-semibold text-[#0f4c81]">{caseStudy.author}</div>
                    </div>

                    {/* CTA */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Link
                        href={`/cas-clients/${caseStudy.slug}`}
                        className={`inline-flex items-center justify-center bg-gradient-to-r ${caseStudy.gradient} text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-all shadow-lg hover:shadow-xl group`}
                      >
                        Lire le cas complet
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Link>
                      <a
                        href={caseStudy.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center bg-white border-2 border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:border-gray-300 hover:bg-gray-50 transition-all"
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

      {/* CTA Final */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-[#0f4c81] to-[#1a5a8f] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#ff7f50]/10 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Prêt à devenir la prochaine success story de notre portfolio?
            </h2>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Découvrez quelle offre correspond à votre niveau d'ambition
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/nos-formules"
                className="inline-flex items-center justify-center bg-[#ff7f50] hover:bg-[#ff6b3d] text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-xl hover:shadow-2xl"
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

export default CasClientsPage;
