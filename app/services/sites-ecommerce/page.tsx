// app/services/sites-ecommerce/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Check,
  Clock,
  TrendingUp,
  Zap,
  ShoppingCart,
  Smartphone,
  Target,
  Users,
  Calendar,
  AlertCircle,
  Sparkles,
  Megaphone,
  Trophy,
  CheckCircle,
  ExternalLink,
  Shield,
  Rocket
} from 'lucide-react';
import FormulaQuoteForm from '@/app/components/FormulaQuoteForm';

const SitesEcommercePage = () => {
  const [isQuoteFormOpen, setIsQuoteFormOpen] = useState(false);

  const portfolio = [
    {
      name: "Momo Le Bottier",
      category: "Maroquinerie",
      url: "https://momolebottier.com",
      image: "/images/portfolio/momolebottier.png"
    },
    {
      name: "Abarings",
      category: "Bijouterie",
      url: "https://abarings.com",
      image: "/images/portfolio/abarings.png"
    },
    {
      name: "6C No Filter",
      category: "Cosmétiques",
      url: "https://6cnofilter.com",
      image: "/images/portfolio/6cnofilter.png"
    },
    {
      name: "Racines Précieuses",
      category: "Beauté",
      url: "https://racinesprecieuses.com",
      image: "/images/portfolio/racines.png"
    },
    {
      name: "Amani",
      category: "Santé & Bien-être",
      url: "https://amani.sn",
      image: "/images/portfolio/amani.png"
    },
    {
      name: "Viens On S'Connait",
      category: "Jeux & Divertissement",
      url: "https://viensonseconnait.com",
      image: "/images/portfolio/vosc.png"
    }
  ];

  const problems = [
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Des stocks qui dorment",
      description: "Vos produits peinent à se vendre alors que c'est LA meilleure période de l'année pour vendre en ligne"
    },
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: "Commandes WhatsApp ingérables",
      description: "Vous perdez du temps et des ventes parce que tout est géré manuellement via WhatsApp"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Clients qui ghostent",
      description: "Sans processus clair, et une bonne gestion des commandes, vos potentiels clients disparaissent sans acheter"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Opportunité fin d'année manquée",
      description: "Vous voyez vos concurrents vendre en ligne et profiter du Black Friday, Cyber Monday, etc., pendant que vous restez à la traîne"
    }
  ];

  const offerIncludes = [
    {
      icon: <ShoppingCart className="w-6 h-6" />,
      title: "Site e-commerce Shopify professionnel",
      items: [
        "Design moderne et adapté aux Smartphones",
        "jusqu'à 15 produits intégrés sur votre site",
        "Gestion automatique des stocks et commandes",
        "Référencement sur Google et ChatGPT",
        "Formation complète à la gestion du site"
      ]
    },
    {
      icon: <Megaphone className="w-6 h-6" />,
      title: "Campagne Meta Ads OFFERTE",
      items: [
        "Création de votre première campagne publicitaire",
        "Ciblage optimisé pour votre audience",
        "Design des visuels publicitaires",
        "Paramétrage complet Facebook & Instagram",
        "Suivi des performances et recommandations"
      ]
    }
  ];

  const whyShopify = [
    "Interface ultra-simple : gérez tout depuis votre smartphone",
    "Gestion des commandes : vendez partout, même au-delà de votre localité",
    "Sécurité maximale : vos données et celles de vos clients sont protégées",
    "Support 24/7 : assistance technique disponible à tout moment",
    "Personnalisation : ajoutez des fonctionnalités selon vos besoins",
    "Hébergement inclus : site toujours rapide et accessible"
  ];

  const process = [
    {
      step: "1",
      title: "Prise de contact & validation",
      duration: "24h",
      description: "Nous validons votre éligibilité (CA minimum 300k/mois) et discutons de vos besoins"
    },
    {
      step: "2",
      title: "Paiement & lancement",
      duration: "48h",
      description: "Acompte de 60% et démarrage immédiat de la conception de votre site"
    },
    {
      step: "3",
      title: "Conception & intégration",
      duration: "3-7 jours",
      description: "Design, intégration de vos produits, paramétrage complet"
    },
    {
      step: "4",
      title: "Formation & lancement",
      duration: "2-3 jours",
      description: "Formation à la gestion, tests finaux, paiement des 40% restants et mise en ligne"
    },
    {
      step: "5",
      title: "Campagne Meta Ads",
      duration: "3-5 jours",
      description: "Création et lancement de votre première campagne publicitaire"
    }
  ];

  const faqs = [
    {
      question: "Pourquoi seulement 7 places ?",
      answer: "Pour garantir un accompagnement de qualité et une livraison dans les délais de fin d'année, nous limitons volontairement le nombre de marques accompagnées."
    },
    {
      question: "Le budget publicitaire Meta Ads est-il inclus ?",
      answer: "Non, la création et le paramétrage de la campagne sont offerts, mais vous devez prévoir votre propre budget publicitaire (minimum recommandé : 50 000 FCFA)."
    },
    {
      question: "Puis-je payer en plusieurs fois ?",
      answer: "Oui ! Paiement en 2 fois : 60% (291 900 FCFA) à la commande et 40% (194 600 FCFA) à la livraison du site."
    },
    {
      question: "Que se passe-t-il si je ne fais pas 300k de CA mensuel ?",
      answer: "Cette offre est réservée aux marques établies. Si vous débutez, consultez notre Formule Démarrage adaptée aux nouvelles marques."
    },
    {
      question: "Combien de temps pour voir les résultats ?",
      answer: "Votre site peut être livré en 10-15 jours. Pour les ventes, cela dépend de votre campagne publicitaire et de vos produits, mais l'objectif est de commencer à vendre dès le lancement."
    }
  ];

  return (
    <div className="min-h-screen overflow-x-hidden w-full">
      {/* Hero avec urgence */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28 bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 relative overflow-hidden w-full">
        <div className="absolute inset-0 bg-black/20"></div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-5xl mx-auto text-center text-white"
          >
            {/* Badge urgence */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-6 py-3 mb-6">
              <AlertCircle className="w-5 h-5 text-white animate-pulse" />
              <span className="text-white font-bold text-sm">
                OFFRE SPÉCIALE Q4 • Seulement 7 places disponibles
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Sauvez votre fin d'année 2025
            </h1>

            <p className="text-2xl md:text-3xl mb-8 text-white/95">
              Site e-commerce Shopify + Campagne Meta Ads pour vendre MAINTENANT et préparer 2026
            </p>

            {/* Offre principale */}
            <div className="bg-white/10 backdrop-blur-md border-2 border-white/30 rounded-2xl p-8 mb-8 max-w-2xl mx-auto">
              <div className="mb-6">
                <div className="text-5xl md:text-6xl font-bold mb-2">
                  486 500 FCFA
                </div>
                <div className="text-xl opacity-90 line-through mb-1">
                  695 000 FCFA
                </div>
                <div className="inline-block bg-red-600 text-white px-4 py-2 rounded-full font-bold">
                  -30% (économisez 208 500 FCFA)
                </div>
              </div>

              <div className="space-y-3 text-left">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 flex-shrink-0" />
                  <span className="text-lg">Site e-commerce Shopify professionnel</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 flex-shrink-0" />
                  <span className="text-lg">Campagne Meta Ads créée et lancée (OFFERTE)</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 flex-shrink-0" />
                  <span className="text-lg">Paiement en 2 fois : 60% + 40%</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 flex-shrink-0" />
                  <span className="text-lg">Livraison en 3-7 jours</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setIsQuoteFormOpen(true)}
                className="inline-flex items-center justify-center bg-white text-orange-600 px-8 py-5 rounded-xl font-bold text-xl hover:bg-gray-100 transition-all shadow-2xl hover:scale-105"
              >
                Je veux profiter de cette offre
                <ArrowRight className="w-6 h-6 ml-2" />
              </button>
            </div>

            <p className="mt-6 text-sm opacity-90">
              ⚠️ Plus que 3 places disponibles • Offre valable jusqu'au 10 décembre 2025
            </p>
          </motion.div>
        </div>
      </section>

      {/* Problèmes que vous rencontrez */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Le dernier mois de l'année est là !
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Et pour beaucoup de marques africaines, c'est le stress
            </p>
          </motion.div>

          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
            {problems.map((problem, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg border-2 border-red-100"
              >
                <div className="w-14 h-14 rounded-xl bg-red-100 flex items-center justify-center text-red-600 mb-4">
                  {problem.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {problem.title}
                </h3>
                <p className="text-gray-600">
                  {problem.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Ce que vous recevez */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Ce que vous allez recevoir
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Pas de théorie, que du chiffre. Tout ce dont vous avez besoin pour vendre en ligne.
            </p>
          </motion.div>

          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
            {offerIncludes.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-8 border-2 border-orange-200"
              >
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center text-white mb-6">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  {item.title}
                </h3>
                <ul className="space-y-3">
                  {item.items.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 max-w-4xl mx-auto bg-blue-50 rounded-2xl p-8 border-2 border-blue-200">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">
                  Important : Budget publicitaire
                </h4>
                <p className="text-gray-700">
                  La création et le paramétrage de votre campagne Meta Ads sont OFFERTS, mais vous devez prévoir votre propre budget publicitaire pour faire tourner les publicités (minimum recommandé : 50 000 FCFA pour des résultats significatifs).
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pourquoi Shopify */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-block bg-green-100 text-green-700 px-6 py-2 rounded-full font-bold mb-6">
              TEKKI Studio • Shopify Partner Officiel
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Pourquoi Shopify ?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Shopify est LA meilleure solution e-commerce pour les marques qui souhaitent vendre de manière efficace sans se soucier des aspects techniques.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
            {whyShopify.map((reason, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg flex items-start gap-4"
              >
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <Check className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-gray-700 font-medium">{reason}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Nos Réalisations */}
      <section className="py-20 md:py-28 bg-[#f5f3ed]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
                  Nos réalisations
                </h2>
                <p className="text-lg md:text-xl text-gray-600 max-w-xl">
                  Découvrez quelques sites e-commerce que nous avons créés pour des marques africaines
                </p>
              </div>

              <div className="flex flex-wrap gap-6 md:gap-8">
                <div>
                  <div className="text-3xl md:text-4xl font-bold text-gray-900">+7</div>
                  <div className="text-sm text-gray-600">Marques accompagnées</div>
                </div>
                <div>
                  <div className="text-3xl md:text-4xl font-bold text-gray-900">+3</div>
                  <div className="text-sm text-gray-600">Pays ciblés</div>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolio.map((site, index) => (
              <motion.a
                key={index}
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer"
              >
                <div className="absolute inset-0 overflow-hidden">
                  <Image
                    src={site.image}
                    alt={site.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                </div>

                <div className="absolute inset-0 p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                      {site.name}
                    </h3>
                  </div>

                  <div>
                    <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm text-white text-sm font-medium rounded-full">
                      {site.category}
                    </span>
                  </div>
                </div>

                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-300"></div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Processus */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Comment ça marche ?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Un processus simple et rapide pour être en ligne avant la fin de l'année
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {process.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-6 mb-8 last:mb-0"
              >
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    {item.step}
                  </div>
                </div>
                <div className="flex-1 bg-gray-50 rounded-2xl p-6">
                  <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
                    <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                    <span className="text-sm text-orange-600 font-semibold bg-orange-50 px-3 py-1 rounded-full">
                      {item.duration}
                    </span>
                  </div>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Questions fréquentes
            </h2>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center text-white"
          >
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-6 py-3 mb-6">
              <Trophy className="w-5 h-5 text-white" />
              <span className="font-bold">Ne laissez pas 2025 se terminer sans avoir agi</span>
            </div>

            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Prêt à sauver votre fin d'année ?
            </h2>

            <p className="text-xl md:text-2xl mb-8 opacity-95">
              Rejoignez les 7 marques africaines qui vont transformer leur fin d'année 2025 en succès et préparer un 2026 explosif
            </p>

            <div className="bg-white/10 backdrop-blur-md border-2 border-white/30 rounded-2xl p-8 mb-8 max-w-2xl mx-auto">
              <div className="text-5xl font-bold mb-4">
                486 500 FCFA
              </div>
              <div className="text-xl opacity-90">
                Au lieu de 695 000 FCFA
              </div>
              <div className="mt-4 inline-block bg-white text-red-600 px-6 py-3 rounded-full font-bold text-lg">
                -30% • Économisez 208 500 FCFA
              </div>
            </div>

            <button
              onClick={() => setIsQuoteFormOpen(true)}
              className="inline-flex items-center justify-center bg-white text-orange-600 px-10 py-6 rounded-xl font-bold text-2xl hover:bg-gray-100 transition-all shadow-2xl hover:scale-105 mb-6"
            >
              Je saisis l'opportunité
              <ArrowRight className="w-7 h-7 ml-3" />
            </button>

            <p className="text-sm opacity-90 mb-8">
              ⏰ Plus que 7 places • Offre valable jusqu'au 10 décembre 2025
            </p>

            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>Paiement sécurisé</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>Paiement en 2 fois</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>Livraison 3-7 jours</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>Shopify Partner Officiel</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Formulaire de devis */}
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
