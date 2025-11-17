// app/nos-formules/demarrage/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import {
  ArrowLeft,
  ArrowRight,
  Zap,
  CheckCircle,
  Clock,
  TrendingUp,
  Target,
  Smartphone,
  ShoppingCart,
  Paintbrush,
  Rocket
} from 'lucide-react';
import { motion } from 'framer-motion';

const DemarragePage = () => {
  const deliverables = [
    {
      icon: <ShoppingCart className="w-6 h-6" />,
      title: "Boutique en ligne complète",
      description: "Site e-commerce moderne avec panier, paiement et gestion des commandes"
    },
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: "Design responsive (mobile-first)",
      description: "Optimisé pour mobile car 80% de vos clients navigueront depuis leur téléphone"
    },
    {
      icon: <Paintbrush className="w-6 h-6" />,
      title: "Design sur-mesure",
      description: "Interface unique qui reflète l'identité de votre marque"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Optimisation des conversions",
      description: "Pages produits, tunnel d'achat et CTA conçus pour maximiser les ventes"
    },
    {
      icon: <Rocket className="w-6 h-6" />,
      title: "Référencement SEO & ChatGPT",
      description: "Votre site sera trouvé sur Google et recommandé par ChatGPT"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Formation complète",
      description: "3 sessions pour maîtriser la gestion de votre boutique"
    }
  ];

  const process = [
    {
      step: "1",
      title: "Découverte & Stratégie",
      duration: "Jours 1-2",
      description: "Atelier pour comprendre votre marque, produits, clients et objectifs"
    },
    {
      step: "2",
      title: "Design & Architecture",
      duration: "Jours 3-5",
      description: "Création des maquettes et validation de l'expérience utilisateur"
    },
    {
      step: "3",
      title: "Développement",
      duration: "Jours 6-10",
      description: "Intégration des fonctionnalités et ajout de vos produits"
    },
    {
      step: "4",
      title: "Tests & Formation",
      duration: "Jours 11-13",
      description: "Tests complets, corrections et formation à la prise en main"
    },
    {
      step: "5",
      title: "Lancement",
      duration: "Jours 14-15",
      description: "Mise en ligne et accompagnement pour vos premiers clients"
    }
  ];

  const features = [
    "Catalogue produits illimité",
    "Gestion des stocks en temps réel",
    "Paiement sécurisé (CB, Mobile Money, cash)",
    "Gestion des commandes et livraisons",
    "Espace client personnalisé",
    "Système de promotions et codes promo",
    "Blog intégré pour le marketing de contenu",
    "Analytics et suivi des performances",
    "Certificat SSL (sécurité)",
    "Hébergement haute performance (1 an inclus)",
    "Nom de domaine (.com ou local)",
    "Emails professionnels (@votremarque.com)"
  ];

  const guarantee = [
    "Votre site fonctionne parfaitement ou nous continuons gratuitement",
    "50 premières ventes en ligne dans les 60 jours ou accompagnement prolongé",
    "Support technique pendant 30 jours après le lancement",
    "Maintenance corrective gratuite pendant 3 mois"
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28 bg-gradient-to-br from-blue-500 to-cyan-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>

        <div className="container mx-auto px-4 relative z-10">
          <Link
            href="/nos-formules"
            className="inline-flex items-center text-white/90 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour aux formules
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 mb-6">
              <Zap className="w-4 h-4 text-white" />
              <span className="text-white text-sm font-semibold">
                Formule Démarrage
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Lancez votre boutique en ligne professionnelle
            </h1>
            <p className="text-2xl text-white/90 mb-8">
              Créez votre présence e-commerce et accueillez vos premiers clients digitaux
            </p>

            <div className="flex flex-wrap gap-6 text-white/90 mb-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <span className="font-semibold">À partir de 500 000F CFA</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <span className="font-semibold">7 à 15 jours ouvrés</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <span className="font-semibold">Garantie résultats</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="https://wa.me/221781362728?text=Bonjour%20TEKKI%20Studio%20!%20J%27aimerais%20obtenir%20un%20devis%20pour%20la%20Formule%20Démarrage."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-xl"
              >
                Obtenir un devis gratuit
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
              <Link
                href="/nos-formules/audit-depart"
                className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all"
              >
                Commencer par un audit
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Idéal pour */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-[#0f4c81] mb-6 text-center">
              Cette formule est idéale pour votre marque si :
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                "Vous n'avez pas encore de site e-commerce",
                "Votre site actuel ne vend pas",
                "Vous vendez uniquement via WhatsApp/Instagram"
              ].map((text, index) => (
                <div key={index} className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border-2 border-blue-100">
                  <CheckCircle className="w-8 h-8 text-blue-600 mb-3" />
                  <p className="text-gray-700 font-medium">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Ce qui est inclus */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0f4c81] mb-12 text-center">
            Ce qui est inclus dans la formule
          </h2>

          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 mb-12">
            {deliverables.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white mb-4">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-[#0f4c81] mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Fonctionnalités complètes */}
          <div className="max-w-4xl mx-auto bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-[#0f4c81] mb-6 text-center">
              Toutes les fonctionnalités essentielles
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Processus */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0f4c81] mb-12 text-center">
            Comment nous créons votre boutique
          </h2>

          <div className="max-w-4xl mx-auto">
            {process.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex gap-6 mb-8 last:mb-0"
              >
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-2xl font-bold">
                    {item.step}
                  </div>
                </div>
                <div className="flex-1 bg-gray-50 rounded-2xl p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-[#0f4c81]">{item.title}</h3>
                    <span className="text-sm text-blue-600 font-semibold bg-blue-50 px-3 py-1 rounded-full">
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

      {/* Garanties */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0f4c81] mb-6 text-center">
              Nos garanties
            </h2>
            <p className="text-xl text-gray-600 text-center mb-12">
              Nous croyons tellement en notre méthode que nous vous garantissons :
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {guarantee.map((item, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-lg">
                  <CheckCircle className="w-8 h-8 text-emerald-500 mb-4" />
                  <p className="text-gray-700 leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-blue-500 to-cyan-500 relative overflow-hidden">
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
              Prêt à lancer votre boutique en ligne ?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Obtenez un devis personnalisé gratuit sous 24h
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/221781362728?text=Bonjour%20TEKKI%20Studio%20!%20J%27aimerais%20obtenir%20un%20devis%20pour%20la%20Formule%20Démarrage."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-xl"
              >
                Obtenir mon devis gratuit
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
              <Link
                href="/nos-formules"
                className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all"
              >
                Voir toutes les formules
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-white/80">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>Devis gratuit sous 24h</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>Paiement en 3 fois possible</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>Garantie satisfaction</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default DemarragePage;
