// app/services/sites-ecommerce/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Check, Clock, TrendingUp, Zap, ShoppingCart,
  Smartphone, Target, Users, AlertCircle, Sparkles, Megaphone,
  Trophy, CheckCircle, Shield, ChevronDown
} from 'lucide-react';
import FormulaQuoteForm from '@/app/components/FormulaQuoteForm';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1 } }),
};

const SitesEcommercePage = () => {
  const [isQuoteFormOpen, setIsQuoteFormOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const portfolio = [
    { name: 'Momo Le Bottier', category: 'Maroquinerie', url: 'https://momolebottier.com', image: '/images/portfolio/momolebottier.png' },
    { name: 'Abarings', category: 'Bijouterie', url: 'https://abarings.com', image: '/images/portfolio/abarings.png' },
    { name: '6C No Filter', category: 'Cosmétiques', url: 'https://6cnofilter.com', image: '/images/portfolio/6cnofilter.png' },
    { name: 'Racines Précieuses', category: 'Beauté', url: 'https://racinesprecieuses.com', image: '/images/portfolio/racines.png' },
    { name: 'Amani', category: 'Santé & Bien-être', url: 'https://amani.sn', image: '/images/portfolio/amani.png' },
    { name: "Viens On S'Connaît", category: 'Jeux & Divertissement', url: 'https://viensonseconnait.com', image: '/images/portfolio/vosc.png' },
  ];

  const problems = [
    { icon: <Clock className="w-6 h-6" />, title: 'Des stocks qui dorment', description: "Vos produits peinent à se vendre alors que c'est LA meilleure période de l'année pour vendre en ligne." },
    { icon: <Smartphone className="w-6 h-6" />, title: 'Commandes WhatsApp ingérables', description: 'Vous perdez du temps et des ventes parce que tout est géré manuellement via WhatsApp.' },
    { icon: <Users className="w-6 h-6" />, title: 'Clients qui ghostent', description: 'Sans processus clair et une bonne gestion des commandes, vos potentiels clients disparaissent sans acheter.' },
    { icon: <TrendingUp className="w-6 h-6" />, title: "Opportunité fin d'année manquée", description: 'Vous voyez vos concurrents vendre en ligne et profiter du Black Friday pendant que vous restez à la traîne.' },
  ];

  const offerIncludes = [
    {
      icon: <ShoppingCart className="w-6 h-6" />,
      title: 'Site e-commerce Shopify professionnel',
      items: [
        'Design moderne et adapté aux smartphones',
        "Jusqu'à 15 produits intégrés sur votre site",
        'Gestion automatique des stocks et commandes',
        'Référencement sur Google et ChatGPT',
        'Formation complète à la gestion du site',
      ],
    },
    {
      icon: <Megaphone className="w-6 h-6" />,
      title: 'Campagne Meta Ads OFFERTE',
      items: [
        'Création de votre première campagne publicitaire',
        'Ciblage optimisé pour votre audience',
        'Design des visuels publicitaires',
        'Paramétrage complet Facebook & Instagram',
        'Suivi des performances et recommandations',
      ],
    },
  ];

  const whyShopify = [
    'Interface ultra-simple : gérez tout depuis votre smartphone',
    'Gestion des commandes : vendez partout, même au-delà de votre localité',
    'Sécurité maximale : vos données et celles de vos clients sont protégées',
    'Support 24/7 : assistance technique disponible à tout moment',
    'Personnalisation : ajoutez des fonctionnalités selon vos besoins',
    'Hébergement inclus : site toujours rapide et accessible',
  ];

  const process = [
    { step: '1', title: 'Prise de contact & validation', duration: '24h', description: "Nous validons votre éligibilité (CA minimum 300k/mois) et discutons de vos besoins." },
    { step: '2', title: 'Paiement & lancement', duration: '48h', description: "Acompte de 60% et démarrage immédiat de la conception de votre site." },
    { step: '3', title: 'Conception & intégration', duration: '3-7 jours', description: 'Design, intégration de vos produits, paramétrage complet.' },
    { step: '4', title: 'Formation & lancement', duration: '2-3 jours', description: "Formation à la gestion, tests finaux, paiement des 40% restants et mise en ligne." },
    { step: '5', title: 'Campagne Meta Ads', duration: '3-5 jours', description: 'Création et lancement de votre première campagne publicitaire.' },
  ];

  const faqs = [
    { question: 'Pourquoi seulement 7 places ?', answer: "Pour garantir un accompagnement de qualité et une livraison dans les délais de fin d'année, nous limitons volontairement le nombre de marques accompagnées." },
    { question: 'Le budget publicitaire Meta Ads est-il inclus ?', answer: "Non, la création et le paramétrage de la campagne sont offerts, mais vous devez prévoir votre propre budget publicitaire (minimum recommandé : 50 000 FCFA)." },
    { question: 'Puis-je payer en plusieurs fois ?', answer: "Oui ! Paiement en 2 fois : 60% (291 900 FCFA) à la commande et 40% (194 600 FCFA) à la livraison du site." },
    { question: "Que se passe-t-il si je ne fais pas 300k de CA mensuel ?", answer: "Cette offre est réservée aux marques établies. Si vous débutez, consultez notre Formule Démarrage adaptée aux nouvelles marques." },
    { question: 'Combien de temps pour voir les résultats ?', answer: "Votre site peut être livré en 10-15 jours. Pour les ventes, cela dépend de votre campagne publicitaire et de vos produits, mais l'objectif est de commencer à vendre dès le lancement." },
  ];

  return (
    <div className="min-h-screen font-body bg-tekki-cream overflow-x-hidden">

      {/* ── Hero ────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-tekki-orange/[0.05] rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-tekki-blue/[0.03] rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeUp} initial="hidden" animate="visible"
            className="max-w-3xl mx-auto text-center"
          >
            {/* Urgency badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-tekki-orange text-white mb-8 shadow-[0_4px_20px_rgba(234,88,12,0.3)]">
              <AlertCircle className="w-4 h-4 animate-pulse" />
              <span className="text-sm font-bold">OFFRE SPÉCIALE Q4 • Seulement 7 places disponibles</span>
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-tekki-blue leading-tight tracking-tight mb-6">
              Sauvez votre fin d'année <span className="text-tekki-orange">2025</span>
            </h1>
            <p className="text-lg md:text-xl text-tekki-blue/60 mb-10 leading-relaxed">
              Site e-commerce Shopify + Campagne Meta Ads pour vendre MAINTENANT et préparer 2026.
            </p>

            {/* Offer box */}
            <div className="bg-white rounded-2xl p-8 border border-tekki-blue/8 shadow-sm mb-8 max-w-xl mx-auto">
              <div className="mb-6">
                <div className="font-heading text-5xl font-bold text-tekki-blue mb-1">486 500 FCFA</div>
                <div className="text-tekki-blue/40 line-through text-lg mb-2">695 000 FCFA</div>
                <span className="inline-block bg-tekki-orange text-white text-sm font-bold px-4 py-1.5 rounded-full">
                  -30% · Économisez 208 500 FCFA
                </span>
              </div>

              <ul className="space-y-3 text-left mb-6">
                {[
                  'Site e-commerce Shopify professionnel',
                  'Campagne Meta Ads créée et lancée (OFFERTE)',
                  'Paiement en 2 fois : 60% + 40%',
                  'Livraison en 3-7 jours',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-tekki-blue/70">
                    <CheckCircle className="w-5 h-5 text-tekki-orange flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => setIsQuoteFormOpen(true)}
                className="w-full flex items-center justify-center bg-tekki-orange hover:bg-tekki-orange/90 text-white py-4 rounded-full font-bold text-base transition-all shadow-[0_4px_20px_rgba(234,88,12,0.25)] hover:-translate-y-0.5 group"
              >
                Je veux profiter de cette offre
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <p className="text-sm text-tekki-blue/40">
              ⚠️ Plus que 3 places disponibles · Offre valable jusqu'au 10 décembre 2025
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Problèmes ───────────────────────────────────────── */}
      <section className="py-20 bg-white border-y border-tekki-blue/8">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-tekki-blue mb-4">
              Le dernier mois de l'année est là !
            </h2>
            <p className="text-tekki-blue/60 text-lg">Et pour beaucoup de marques africaines, c'est le stress.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {problems.map((problem, index) => (
              <motion.div
                key={index} custom={index} variants={fadeUp}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="bg-tekki-cream rounded-2xl p-7 border border-red-100 flex gap-5"
              >
                <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-500 flex-shrink-0">
                  {problem.icon}
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold text-tekki-blue mb-2">{problem.title}</h3>
                  <p className="text-tekki-blue/60 text-sm leading-relaxed">{problem.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Ce que vous recevez ─────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-tekki-blue mb-4">
              Ce que vous allez recevoir
            </h2>
            <p className="text-tekki-blue/60 text-lg">Pas de théorie, que du concret. Tout ce dont vous avez besoin pour vendre en ligne.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {offerIncludes.map((item, index) => (
              <motion.div
                key={index} custom={index} variants={fadeUp}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 border border-tekki-orange/20 shadow-sm"
              >
                <div className="w-14 h-14 rounded-xl bg-tekki-orange/10 flex items-center justify-center text-tekki-orange mb-5">
                  {item.icon}
                </div>
                <h3 className="font-heading text-xl font-bold text-tekki-blue mb-5">{item.title}</h3>
                <ul className="space-y-3">
                  {item.items.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-tekki-blue/70 text-sm">
                      <Check className="w-4 h-4 text-tekki-orange flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <div className="bg-tekki-blue/5 rounded-2xl p-7 border border-tekki-blue/10 flex gap-5">
            <AlertCircle className="w-7 h-7 text-tekki-blue flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-heading text-lg font-bold text-tekki-blue mb-2">Important : Budget publicitaire</h4>
              <p className="text-tekki-blue/60 leading-relaxed text-sm">
                La création et le paramétrage de votre campagne Meta Ads sont OFFERTS, mais vous devez prévoir votre propre budget publicitaire pour faire tourner les publicités (minimum recommandé : 50 000 FCFA).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pourquoi Shopify ────────────────────────────────── */}
      <section className="py-20 bg-white border-y border-tekki-blue/8">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center mb-14"
          >
            <div className="inline-block bg-tekki-orange/10 border border-tekki-orange/20 text-tekki-orange px-5 py-2 rounded-full text-sm font-bold mb-5">
              TEKKI Studio · Shopify Partner Officiel
            </div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-tekki-blue mb-4">Pourquoi Shopify ?</h2>
            <p className="text-tekki-blue/60 text-lg max-w-2xl mx-auto">
              Shopify est LA meilleure solution e-commerce pour les marques qui souhaitent vendre efficacement sans se soucier des aspects techniques.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {whyShopify.map((reason, index) => (
              <motion.div
                key={index} custom={index} variants={fadeUp}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="bg-tekki-cream rounded-xl p-5 flex items-start gap-3 border border-tekki-blue/8"
              >
                <div className="w-7 h-7 rounded-full bg-tekki-orange/10 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-tekki-orange" />
                </div>
                <p className="text-tekki-blue/70 text-sm leading-relaxed">{reason}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Portfolio ───────────────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14"
          >
            <div>
              <h2 className="font-heading text-3xl md:text-5xl font-bold text-tekki-blue mb-3">Nos réalisations</h2>
              <p className="text-tekki-blue/60 text-lg max-w-xl">Quelques sites e-commerce créés pour des marques africaines.</p>
            </div>
            <div className="flex gap-8">
              <div>
                <div className="font-heading text-3xl font-bold text-tekki-blue">+7</div>
                <div className="text-sm text-tekki-blue/50">Marques accompagnées</div>
              </div>
              <div>
                <div className="font-heading text-3xl font-bold text-tekki-blue">+3</div>
                <div className="text-sm text-tekki-blue/50">Pays ciblés</div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {portfolio.map((site, index) => (
              <motion.a
                key={index}
                href={site.url} target="_blank" rel="noopener noreferrer"
                custom={index} variants={fadeUp}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="group relative aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer"
              >
                <Image
                  src={site.image} alt={site.name} fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-tekki-blue/70 via-tekki-blue/20 to-transparent" />
                <div className="absolute inset-0 p-5 flex flex-col justify-between">
                  <div />
                  <div>
                    <h3 className="font-heading text-xl font-bold text-white mb-2">{site.name}</h3>
                    <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                      {site.category}
                    </span>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Processus ───────────────────────────────────────── */}
      <section className="py-20 bg-white border-y border-tekki-blue/8">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-tekki-blue mb-4">Comment ça marche ?</h2>
            <p className="text-tekki-blue/60 text-lg">Un processus simple et rapide pour être en ligne avant la fin de l'année.</p>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-5">
            {process.map((item, index) => (
              <motion.div
                key={index} custom={index} variants={fadeUp}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="flex gap-5"
              >
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 rounded-full bg-tekki-orange flex items-center justify-center text-white font-heading text-xl font-bold">
                    {item.step}
                  </div>
                </div>
                <div className="flex-1 bg-tekki-cream rounded-2xl p-5 border border-tekki-blue/8">
                  <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
                    <h3 className="font-heading text-lg font-bold text-tekki-blue">{item.title}</h3>
                    <span className="text-xs text-tekki-orange font-bold bg-tekki-orange/8 px-3 py-1 rounded-full">{item.duration}</span>
                  </div>
                  <p className="text-tekki-blue/60 text-sm leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-tekki-blue mb-4">Questions fréquentes</h2>
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
                  <span className="font-semibold text-tekki-blue text-sm">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-tekki-orange flex-shrink-0 transition-transform ${openFaq === index ? 'rotate-180' : ''}`} />
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
                      <div className="px-6 pb-5 text-tekki-blue/60 text-sm leading-relaxed border-t border-tekki-blue/8 pt-4">
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

      {/* ── CTA Final ───────────────────────────────────────── */}
      <section className="py-20 bg-tekki-blue relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/15 text-white/70 mb-6 text-sm">
              <Trophy className="w-4 h-4" />
              <span>Ne laissez pas 2025 se terminer sans avoir agi</span>
            </div>

            <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
              Prêt à sauver votre fin d'année ?
            </h2>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-8 max-w-sm mx-auto">
              <div className="font-heading text-4xl font-bold text-tekki-orange mb-2">486 500 FCFA</div>
              <div className="text-white/50 line-through text-sm mb-3">695 000 FCFA</div>
              <div className="inline-block bg-tekki-orange text-white text-sm font-bold px-4 py-1.5 rounded-full">
                -30% · Économisez 208 500 FCFA
              </div>
            </div>

            <button
              onClick={() => setIsQuoteFormOpen(true)}
              className="inline-flex items-center justify-center bg-tekki-orange hover:bg-tekki-orange/90 text-white px-8 py-4 rounded-full font-bold text-base transition-all shadow-[0_0_30px_rgba(234,88,12,0.3)] hover:-translate-y-0.5 group mb-6"
            >
              Je saisis l'opportunité
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="flex flex-wrap justify-center gap-5 text-sm text-white/50">
              {['Paiement sécurisé', 'Paiement en 2 fois', 'Livraison 3-7 jours', 'Shopify Partner Officiel'].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-tekki-orange" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <FormulaQuoteForm
        isOpen={isQuoteFormOpen}
        onClose={() => setIsQuoteFormOpen(false)}
        formulaType="demarrage"
        formulaName="Offre Spéciale Q4 - Site E-commerce + Meta Ads"
      />
    </div>
  );
};

export default SitesEcommercePage;
