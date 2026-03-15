// app/nos-formules/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Search, Zap, Rocket, Globe, ArrowRight, CheckCircle,
  Sparkles, ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1 } }),
};

const NosFormulesPage = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 });
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const formulas = [
    {
      id: 'audit-depart',
      icon: <Search className="w-7 h-7" />,
      name: 'Audit de Départ',
      tagline: 'Identifiez vos opportunités cachées',
      description: "Un diagnostic complet de votre présence digitale pour identifier ce qui bloque vos ventes et construire un plan d'action concret.",
      price: '245 000F CFA',
      priceNote: 'Remboursé si vous choisissez une autre formule',
      duration: '1 semaine',
      idealFor: [
        'Vous vendez déjà mais sentez que vous pourriez faire mieux',
        "Vous voulez un plan clair avant d'investir",
        "Vous avez besoin d'un regard expert sur votre marque",
      ],
      includes: [
        'Audit complet de votre présence digitale',
        'Analyse de 3-5 concurrents directs',
        'Rapport détaillé de 15-20 pages',
        'Session de présentation de 90 minutes',
        'Roadmap personnalisé sur 6 mois',
      ],
    },
    {
      id: 'demarrage',
      icon: <Zap className="w-7 h-7" />,
      name: 'Formule Démarrage',
      tagline: 'Automatisez vos ventes, libérez votre temps',
      description: 'Passez de la vente manuelle via WhatsApp à une boutique professionnelle qui vend pour vous, même quand vous dormez.',
      price: 'À partir de 500 000F CFA',
      priceNote: 'Devis personnalisé selon vos besoins',
      duration: '4-6 semaines',
      idealFor: [
        'Vous gérez vos commandes via WhatsApp/Instagram',
        "Vous n'avez pas encore de site e-commerce",
        'Votre site actuel ne génère pas de ventes',
      ],
      includes: [
        'Boutique en ligne moderne et professionnelle',
        'Paiements automatisés (Wave, Orange Money, CB)',
        'Design optimisé mobile (80% du trafic)',
        'Référencement Google et ChatGPT',
        'Formation prise en main complète',
      ],
    },
    {
      id: 'croissance',
      icon: <Rocket className="w-7 h-7" />,
      name: 'Formule Croissance',
      tagline: 'Transformez votre trafic en clients',
      badge: 'POPULAIRE',
      description: "Vous avez de la visibilité mais pas assez de ventes ? Nous mettons en place le système complet pour convertir vos visiteurs en clients fidèles.",
      price: 'À partir de 900 000F CFA',
      priceNote: 'Devis personnalisé selon vos besoins',
      duration: '3 mois',
      featured: true,
      idealFor: [
        'Vous avez un site mais peu de ventes',
        'Vous recevez du trafic qui ne convertit pas',
        'Vous voulez automatiser votre acquisition clients',
      ],
      includes: [
        'Création ou refonte de votre boutique (si nécessaire)',
        'Diagnostic conversion complet',
        'Stratégie publicités Meta/TikTok/Google Ads',
        'Système email/WhatsApp marketing automatisé',
        'Accompagnement de 3 mois (2 sessions/mois)',
      ],
    },
    {
      id: 'expansion',
      icon: <Globe className="w-7 h-7" />,
      name: 'Formule Expansion',
      tagline: 'Vendez en Afrique, en Europe et au-delà',
      description: "Vous avez prouvé votre modèle localement. Il est temps de devenir une référence et de conquérir de nouveaux marchés.",
      price: 'À partir de 1,5M FCFA',
      priceNote: 'Devis personnalisé selon vos besoins',
      duration: '6-12 mois',
      idealFor: [
        'Vous avez une base clients établie et des ventes régulières',
        'Vous voulez conquérir de nouveaux marchés',
        'Vous visez le statut de marque premium',
      ],
      includes: [
        'Tout de la formule Croissance',
        'Stratégie expansion régionale/internationale',
        'Direction artistique de marque premium',
        'Développement de solutions sur-mesure',
        'Accompagnement de 6 mois (1 session/semaine)',
      ],
    },
  ];

  const faqs = [
    {
      question: 'Comment choisir la formule adaptée à ma marque ?',
      answer: "Cela dépend de votre situation actuelle. Si vous n'avez pas encore de site e-commerce ou qu'il ne vend pas, la Formule Démarrage est idéale. Si vous avez un site mais peu de ventes, la Formule Croissance est faite pour vous. Si vous générez déjà plus de 5M FCFA/mois et visez l'international, optez pour la Formule Expansion. Nous pouvons aussi faire un Audit de Départ (remboursable) pour vous conseiller précisément.",
    },
    {
      question: 'Les formules sont-elles adaptées aux marques africaines ?',
      answer: "Oui ! Toutes nos formules sont spécifiquement conçues pour les marques africaines. Nous comprenons les défis uniques du marché africain (paiement mobile, logistique, comportement d'achat, etc.) car nous créons et développons nos propres marques en Afrique.",
    },
    {
      question: 'Puis-je payer en plusieurs fois ?',
      answer: "Oui, nous proposons des facilités de paiement adaptées au marché africain. Généralement : 50% à la signature du contrat, 30% à mi-parcours, 20% à la livraison finale. Pour les formules avec accompagnement mensuel (Croissance et Expansion), vous payez un montant initial puis des versements mensuels.",
    },
    {
      question: 'Combien de temps avant de voir des résultats ?',
      answer: "Cela varie selon la formule choisie. Avec la Formule Démarrage, l'objectif est vos 50 premières ventes en ligne dans les 60 jours. Avec la Formule Croissance, nous visons un doublement des ventes en 90 jours. Avec la Formule Expansion, l'objectif est 30% de votre CA venant de l'international dans les 12 mois.",
    },
    {
      question: 'Offrez-vous des garanties sur les résultats ?',
      answer: "Oui, chaque formule inclut une garantie concrète. Formule Démarrage : votre site fonctionne parfaitement ou nous continuons jusqu'à ce qu'il fonctionne (gratuit). Formule Croissance : vous doublez vos ventes en 90 jours ou nous prolongeons l'accompagnement gratuitement.",
    },
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
              <span className="text-sm font-medium text-tekki-orange tracking-wide">Nos offres d'accompagnement</span>
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-tekki-blue leading-tight tracking-tight mb-6">
              Choisissez votre{' '}
              <span className="text-tekki-orange">niveau d'ambition</span>
            </h1>
            <p className="text-lg md:text-xl text-tekki-blue/60 mb-10 leading-relaxed max-w-2xl mx-auto">
              Du diagnostic initial à l'expansion internationale, une offre adaptée à chaque étape.
            </p>

            <div className="flex flex-wrap justify-center gap-5 text-tekki-blue/60">
              {['Stratégies testées sur nos marques', 'Garantie de résultats', 'Paiement en plusieurs fois'].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-tekki-orange flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Formules ────────────────────────────────────────── */}
      <section className="py-20 bg-white border-y border-tekki-blue/8">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={ref} className="grid md:grid-cols-2 gap-8">
            {formulas.map((formula, index) => (
              <motion.div
                key={formula.id}
                custom={index} variants={fadeUp} initial="hidden"
                animate={inView ? 'visible' : 'hidden'}
                className={`bg-white rounded-3xl overflow-hidden border transition-all duration-300 hover:shadow-lg relative ${
                  formula.featured
                    ? 'border-tekki-orange shadow-[0_0_0_2px_#F97316] md:scale-[1.02]'
                    : 'border-tekki-blue/8 hover:border-tekki-orange/20'
                }`}
              >
                {formula.badge && (
                  <div className="absolute -right-10 top-7 bg-tekki-orange text-white px-10 py-1.5 text-xs font-bold rotate-45 shadow-sm z-20">
                    {formula.badge}
                  </div>
                )}

                {/* Header */}
                <div className={`p-8 ${formula.featured ? 'bg-tekki-blue' : 'bg-tekki-cream'}`}>
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 ${
                    formula.featured ? 'bg-white/10 text-white' : 'bg-tekki-orange/10 text-tekki-orange'
                  }`}>
                    {formula.icon}
                  </div>
                  <h3 className={`font-heading text-2xl font-bold mb-1 ${formula.featured ? 'text-white' : 'text-tekki-blue'}`}>
                    {formula.name}
                  </h3>
                  <p className={`text-sm mb-5 ${formula.featured ? 'text-white/70' : 'text-tekki-blue/50'}`}>
                    {formula.tagline}
                  </p>
                  <div className={`font-heading text-2xl font-bold mb-1 ${formula.featured ? 'text-tekki-orange' : 'text-tekki-blue'}`}>
                    {formula.price}
                  </div>
                  <p className={`text-xs ${formula.featured ? 'text-white/50' : 'text-tekki-blue/40'}`}>
                    {formula.priceNote}
                  </p>
                </div>

                {/* Body */}
                <div className="p-8">
                  <p className="text-tekki-blue/70 leading-relaxed mb-6">{formula.description}</p>

                  <div className="bg-tekki-cream rounded-xl p-5 mb-6 border border-tekki-blue/8">
                    <h4 className="text-xs font-bold text-tekki-blue/50 uppercase tracking-wider mb-3">
                      Idéal pour votre marque si :
                    </h4>
                    <ul className="space-y-2">
                      {formula.idealFor.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-tekki-blue/70">
                          <CheckCircle className="w-4 h-4 text-tekki-orange mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-7">
                    <h4 className="text-xs font-bold text-tekki-blue/50 uppercase tracking-wider mb-3">Ce qui est inclus :</h4>
                    <ul className="space-y-2">
                      {formula.includes.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-tekki-blue/70">
                          <span className="text-tekki-orange font-bold flex-shrink-0">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    href={`/nos-formules/${formula.id}`}
                    className={`flex items-center justify-center w-full py-4 rounded-full font-bold text-sm transition-all group ${
                      formula.featured
                        ? 'bg-tekki-orange text-white hover:bg-tekki-orange/90 shadow-[0_4px_20px_rgba(234,88,12,0.25)]'
                        : 'bg-tekki-blue text-white hover:bg-tekki-blue/90'
                    }`}
                  >
                    En savoir plus
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center mb-14 max-w-3xl mx-auto"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-tekki-blue mb-4">
              Questions fréquentes
            </h2>
            <p className="text-tekki-blue/60 text-lg">
              Les réponses aux questions les plus fréquentes sur nos formules.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((faq, index) => (
              <motion.div
                key={index} custom={index} variants={fadeUp}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="bg-white rounded-2xl overflow-hidden border border-tekki-blue/8 hover:border-tekki-orange/20 transition-colors"
              >
                <button
                  className="w-full px-6 py-5 text-left flex justify-between items-center gap-4"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <span className="font-semibold text-tekki-blue text-base">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-tekki-orange flex-shrink-0 transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`}
                  />
                </button>

                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 text-tekki-blue/60 leading-relaxed border-t border-tekki-blue/8 pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
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
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
              Pas sûr de votre choix ?
            </h2>
            <p className="text-lg text-white/60 mb-10 max-w-xl mx-auto leading-relaxed">
              Réservez un appel gratuit de 30 minutes avec notre équipe. Nous analyserons votre situation et vous conseillerons la formule la plus adaptée.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/diagnostic"
                className="inline-flex items-center justify-center bg-tekki-orange hover:bg-tekki-orange/90 text-white px-8 py-4 rounded-full font-bold text-base transition-all shadow-[0_0_30px_rgba(234,88,12,0.3)] hover:-translate-y-0.5 group"
              >
                Faire le diagnostic gratuit
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/nos-formules/audit-depart"
                className="inline-flex items-center justify-center border border-white/15 text-white px-8 py-4 rounded-full font-bold text-base hover:bg-white/8 transition-colors"
              >
                Commencer par un audit
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-white/50">
              {['Sans engagement', 'Devis gratuit sous 24h', '100% personnalisé'].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-tekki-orange" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default NosFormulesPage;
