// app/nos-formules/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Zap,
  Rocket,
  Globe,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Clock,
  Users,
  TrendingUp,
  Target,
  ChevronDown
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const NosFormulesPage = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const formulas = [
    {
      id: 'audit-depart',
      icon: <Search className="w-8 h-8" />,
      name: 'Audit de Départ',
      tagline: 'Identifiez vos opportunités cachées',
      description: 'Un diagnostic complet de votre présence digitale pour identifier ce qui bloque vos ventes et construire un plan d\'action concret.',
      price: '245 000F CFA',
      priceNote: 'Remboursé si vous choisissez une autre formule',
      duration: '1 semaine',
      bestFor: "Vous ne savez pas par où commencer",
      idealFor: [
        'Vous vendez déjà mais sentez que vous pourriez faire mieux',
        'Vous voulez un plan clair avant d\'investir',
        'Vous avez besoin d\'un regard expert sur votre marque'
      ],
      includes: [
        'Audit complet de votre présence digitale',
        'Analyse de 3-5 concurrents directs',
        'Rapport détaillé de 15-20 pages',
        'Session de présentation de 90 minutes',
        'Roadmap personnalisé sur 6 mois'
      ],
      color: 'from-emerald-500 to-teal-500',
      bgGradient: 'from-emerald-50 to-teal-50',
      accentColor: '#10B981'
    },
    {
      id: 'demarrage',
      icon: <Zap className="w-8 h-8" />,
      name: 'Formule Démarrage',
      tagline: 'Automatisez vos ventes, libérez votre temps',
      description: 'Passez de la vente manuelle via WhatsApp à une boutique professionnelle qui vend pour vous, même quand vous dormez.',
      price: 'À partir de 500 000F CFA',
      priceNote: 'Devis personnalisé selon vos besoins',
      duration: '4-6 semaines',
      bestFor: "Vous gérez vos commandes via WhatsApp/Instagram",
      idealFor: [
        'Vous gérez vos commandes via WhatsApp/Instagram',
        'Vous n\'avez pas encore de site e-commerce',
        'Votre site actuel ne génère pas de ventes'
      ],
      includes: [
        'Boutique en ligne moderne et professionnelle',
        'Paiements automatisés (Wave, Orange Money, CB)',
        'Design optimisé mobile (80% du trafic)',
        'Référencement Google et ChatGPT',
        'Formation prise en main complète'
      ],
      color: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50',
      accentColor: '#3B82F6'
    },
    {
      id: 'croissance',
      icon: <Rocket className="w-8 h-8" />,
      name: 'Formule Croissance',
      tagline: 'Transformez votre trafic en clients',
      badge: 'POPULAIRE',
      description: 'Vous avez de la visibilité mais pas assez de ventes ? Nous mettons en place le système complet pour convertir vos visiteurs en clients fidèles.',
      price: 'À partir de 900 000F CFA',
      priceNote: 'Devis personnalisé selon vos besoins',
      duration: '3 mois',
      bestFor: "Vous avez un site mais peu de ventes",
      idealFor: [
        'Vous avez un site mais peu de ventes',
        'Vous recevez du trafic qui ne convertit pas',
        'Vous voulez automatiser votre acquisition clients'
      ],
      includes: [
        'Création ou refonte de votre boutique (si nécessaire)',
        'Diagnostic conversion complet',
        'Stratégie publicités Meta/TikTok/Google Ads',
        'Système email/WhatsApp marketing automatisé',
        'Accompagnement de 3 mois (2 sessions/mois)'
      ],
      color: 'from-orange-500 to-red-500',
      bgGradient: 'from-orange-50 to-red-50',
      accentColor: '#F97316',
      featured: true
    },
    {
      id: 'expansion',
      icon: <Globe className="w-8 h-8" />,
      name: 'Formule Expansion',
      tagline: 'Vendez en Afrique, en Europe et au-delà',
      description: 'Vous avez prouvé votre modèle localement. Il est temps de devenir une référence et de conquérir de nouveaux marchés.',
      price: 'À partir de 1,5M FCFA',
      priceNote: 'Devis personnalisé selon vos besoins',
      duration: '6-12 mois',
      bestFor: "Vous avez une base clients établie et des ventes régulières",
      idealFor: [
        'Vous avez une base clients établie et des ventes régulières',
        'Vous voulez conquérir de nouveaux marchés',
        'Vous visez le statut de marque premium'
      ],
      includes: [
        'Tout de la formule Croissance',
        'Stratégie expansion régionale/internationale',
        'Direction artistique de marque premium',
        'Développement de solutions sur-mesure',
        'Accompagnement de 6 mois (1 session/semaine)'
      ],
      color: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50',
      accentColor: '#A855F7'
    }
  ];

  const comparaisonFeatures = [
    {
      category: "Site e-commerce",
      features: [
        { name: "Audit & recommandations", audit: true, demarrage: false, croissance: false, expansion: false },
        { name: "Site e-commerce complet", audit: false, demarrage: true, croissance: true, expansion: true },
        { name: "Optimisation mobile", audit: false, demarrage: true, croissance: true, expansion: true },
        { name: "SEO & ChatGPT", audit: false, demarrage: true, croissance: true, expansion: true }
      ]
    },
    {
      category: "Marketing",
      features: [
        { name: "Stratégie marketing", audit: true, demarrage: false, croissance: true, expansion: true },
        { name: "Publicités Meta/TikTok/Google", audit: false, demarrage: false, croissance: true, expansion: true },
        { name: "Email & WhatsApp marketing", audit: false, demarrage: false, croissance: true, expansion: true },
        { name: "Marketing d'influence", audit: false, demarrage: false, croissance: true, expansion: true }
      ]
    },
    {
      category: "Accompagnement",
      features: [
        { name: "Session de présentation", audit: "90 min", demarrage: "Formation", croissance: "3 mois", expansion: "6 mois" },
        { name: "Support technique", audit: false, demarrage: "30 jours", croissance: "90 jours", expansion: "6 mois" },
        { name: "Appels stratégiques", audit: false, demarrage: false, croissance: "2/mois", expansion: "4/mois" }
      ]
    }
  ];

  const faqs = [
    {
      question: "Comment choisir la formule adaptée à ma marque ?",
      answer: "Cela dépend de votre situation actuelle. Si vous n'avez pas encore de site e-commerce ou qu'il ne vend pas, la Formule Démarrage est idéale. Si vous avez un site mais peu de ventes, la Formule Croissance est faite pour vous. Si vous générez déjà plus de 5M FCFA/mois et visez l'international, optez pour la Formule Expansion. Nous pouvons aussi faire un Audit de Départ (remboursable) pour vous conseiller précisément."
    },
    {
      question: "Les formules sont-elles adaptées aux marques africaines ?",
      answer: "Oui ! Toutes nos formules sont spécifiquement conçues pour les marques africaines. Nous comprenons les défis uniques du marché africain (paiement mobile, logistique, comportement d'achat, etc.) car nous créons et développons nos propres marques en Afrique."
    },
    {
      question: "Puis-je payer en plusieurs fois ?",
      answer: "Oui, nous proposons des facilités de paiement adaptées au marché africain. Généralement : 50% à la signature du contrat, 30% à mi-parcours, 20% à la livraison finale. Pour les formules avec accompagnement mensuel (Croissance et Expansion), vous payez un montant initial puis des versements mensuels."
    },
    {
      question: "Combien de temps avant de voir des résultats ?",
      answer: "Cela varie selon la formule choisie. Avec la Formule Démarrage, l'objectif est vos 50 premières ventes en ligne dans les 60 jours. Avec la Formule Croissance, nous visons un doublement des ventes en 90 jours. Avec la Formule Expansion, l'objectif est 30% de votre CA venant de l'international dans les 12 mois."
    },
    {
      question: "Offrez-vous des garanties sur les résultats ?",
      answer: "Oui, chaque formule inclut une garantie concrète. Formule Démarrage : votre site fonctionne parfaitement ou nous continuons jusqu'à ce qu'il fonctionne (gratuit). Formule Croissance : vous doublez vos ventes en 90 jours ou nous prolongeons l'accompagnement gratuitement. Formule Expansion : 30% de votre CA vient de l'international en 12 mois ou nous continuons jusqu'à atteindre cet objectif."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28 bg-gradient-to-br from-gray-900 via-[#0f4c81] to-gray-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#fe6117]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2.5 mb-8">
              <Sparkles className="w-4 h-4 text-[#fe6117]" />
              <span className="text-white/95 text-sm font-semibold">
                Nos offres d'accompagnement
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Choisissez votre niveau d'ambition
            </h1>

            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Du diagnostic initial à l'expansion internationale, une offre adaptée
              à chaque étape
            </p>

            <div className="flex flex-wrap justify-center gap-6 text-white/90">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span>Stratégies testées sur nos marques</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span>Garantie de résultats</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span>Paiement en plusieurs fois</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Formules */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            ref={ref}
            className="grid md:grid-cols-2 gap-8 max-w-7xl mx-auto"
          >
            {formulas.map((formula, index) => (
              <motion.div
                key={formula.id}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all overflow-hidden relative ${formula.featured ? 'md:scale-105 border-4 border-[#fe6117]' : 'border border-gray-100'}`}
              >
                {formula.badge && (
                  <div className="absolute -right-12 top-8 bg-[#fe6117] text-white px-12 py-1.5 text-xs font-bold rotate-45 shadow-lg z-20">
                    {formula.badge}
                  </div>
                )}

                {/* Header */}
                <div className={`bg-gradient-to-r ${formula.color} p-8 text-white`}>
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4">
                    {formula.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{formula.name}</h3>
                  <p className="text-white/90 mb-6">{formula.tagline}</p>
                  <div className="text-3xl font-bold mb-1">{formula.price}</div>
                  <p className="text-sm text-white/80">{formula.priceNote}</p>
                </div>

                {/* Body */}
                <div className="p-8">
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    {formula.description}
                  </p>

                  <div className={`bg-gradient-to-br ${formula.bgGradient} rounded-xl p-5 mb-6 border border-gray-100`}>
                    <h4 className="font-semibold text-[#0f4c81] mb-3 text-sm uppercase">
                      Idéal pour votre marque si :
                    </h4>
                    <ul className="space-y-2">
                      {formula.idealFor.map((item, idx) => (
                        <li key={idx} className="flex items-start text-sm text-gray-700">
                          <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 mr-2 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3 text-sm uppercase">
                      Ce qui est inclus :
                    </h4>
                    <ul className="space-y-2.5">
                      {formula.includes.map((item, idx) => (
                        <li key={idx} className="flex items-start text-sm text-gray-600">
                          <span className="text-emerald-500 mr-2 font-bold">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    href={`/nos-formules/${formula.id}`}
                    className={`block w-full text-center bg-gradient-to-r ${formula.color} hover:opacity-90 text-white py-4 rounded-full font-semibold transition-all shadow-md hover:shadow-lg hover:scale-105 group`}
                  >
                    <span className="flex items-center justify-center">
                      En savoir plus
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16 max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-[#0f4c81] mb-4">
              Questions fréquentes
            </h2>
            <p className="text-xl text-gray-600">
              Les réponses aux questions les plus fréquentes sur nos formules
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden hover:border-[#fe6117]/30 transition-all"
              >
                <button
                  className="w-full px-6 md:px-8 py-6 text-left hover:bg-gray-50 flex justify-between items-center transition-all group"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <span className="font-bold text-[#0f4c81] text-base md:text-lg pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#fe6117] flex-shrink-0 transition-transform ${
                      openFaq === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {openFaq === index && (
                  <div className="px-6 md:px-8 py-6 bg-gray-50 text-gray-700 leading-relaxed border-t-2 border-gray-200">
                    {faq.answer}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-gray-900 via-[#0f4c81] to-gray-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#fe6117]/10 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Pas sûr de votre choix ?
            </h2>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Réservez un appel gratuit de 30 minutes avec notre équipe. Nous analyserons
              votre situation et vous conseillerons la formule la plus adaptée
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://calendly.com/tekki-studio/consultation-gratuite"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-[#fe6117] hover:bg-[#ff6b3d] text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-xl hover:shadow-2xl hover:scale-105"
              >
                Réserver un appel gratuit
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
              <Link
                href="/nos-formules/audit-depart"
                className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105"
              >
                Commencer par un audit
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-white/80">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span>Sans engagement</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span>Devis gratuit sous 24h</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span>100% personnalisé</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default NosFormulesPage;
