// app/nos-formules/expansion/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Globe,
  CheckCircle,
  Clock,
  TrendingUp,
  Crown,
  Sparkles,
  Target,
  Rocket,
  Users,
  BarChart
} from 'lucide-react';
import { motion } from 'framer-motion';
import FormulaQuoteForm from '@/app/components/FormulaQuoteForm';

const ExpansionPage = () => {
  const [isQuoteFormOpen, setIsQuoteFormOpen] = useState(false);
  const deliverables = [
    {
      icon: <Rocket className="w-6 h-6" />,
      title: "Tout de la formule Croissance",
      description: "Création/refonte boutique, diagnostic conversion, publicités, email/WhatsApp marketing"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Stratégie expansion régionale/internationale",
      description: "Plan détaillé pour conquérir de nouveaux marchés africains et internationaux"
    },
    {
      icon: <Crown className="w-6 h-6" />,
      title: "Direction artistique de marque premium",
      description: "Repositionnement haut de gamme avec identité visuelle raffinée et cohérente"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Développement de solutions sur-mesure",
      description: "Fonctionnalités personnalisées adaptées à vos besoins spécifiques"
    },
    {
      icon: <BarChart className="w-6 h-6" />,
      title: "Accompagnement de 6 mois (1 session/semaine)",
      description: "Sessions stratégiques hebdomadaires + support prioritaire 24/7"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Stratégie distribution & partenariats",
      description: "Marketplaces, revendeurs, ambassadeurs et partenariats stratégiques"
    }
  ];

  const markets = [
    { name: "Afrique de l'Ouest", countries: "Sénégal, Mali, Côte d'Ivoire, Burkina Faso, Guinée" },
    { name: "Afrique Centrale", countries: "Cameroun, Gabon, RDC, Congo" },
    { name: "Afrique de l'Est", countries: "Kenya, Tanzanie, Ouganda" },
    { name: "Diaspora Africaine", countries: "France, USA, Canada, UK" }
  ];

  const process = [
    {
      phase: "Phases 1-2",
      title: "Audit & Stratégie",
      duration: "Mois 1-2",
      points: [
        "Audit complet marque et marchés",
        "Étude de marché pays cibles",
        "Stratégie expansion détaillée",
        "Repositionnement premium",
        "Refonte identité visuelle"
      ]
    },
    {
      phase: "Phases 3-4",
      title: "Déploiement & Infrastructure",
      duration: "Mois 3-4",
      points: [
        "Setup infrastructure internationale",
        "Partenariats logistiques",
        "Campagnes marketing localisées",
        "Recrutement ambassadeurs",
        "Relations presse & médias"
      ]
    },
    {
      phase: "Phases 5-6",
      title: "Scale & Optimisation",
      duration: "Mois 5-6",
      points: [
        "Lancement marchés prioritaires",
        "Optimisation continue",
        "Scale budgets publicitaires",
        "Développement réseau distribution",
        "Passage à l'autonomie"
      ]
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28 bg-gradient-to-br from-purple-500 to-pink-500 relative overflow-hidden">
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
              <Globe className="w-4 h-4 text-white" />
              <span className="text-white text-sm font-semibold">
                Formule Expansion - Pour marques ambitieuses
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Devenez une marque panafricaine et internationale
            </h1>
            <p className="text-2xl text-white/90 mb-8">
              Vendez au-delà des frontières et construisez un empire e-commerce
            </p>

            <div className="flex flex-wrap gap-6 text-white/90 mb-8">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">À partir de 1,5M FCFA</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span className="font-semibold">6-12 mois</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                <span className="font-semibold">30% CA international garanti</span>
              </div>
            </div>

            <button
              onClick={() => setIsQuoteFormOpen(true)}
              className="inline-flex items-center justify-center bg-white text-purple-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all shadow-xl hover:scale-105"
            >
              Obtenir un devis gratuit
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Idéal pour */}
      <section className="py-12 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-[#0f4c81] mb-6 text-center">
              Cette formule est idéale pour votre marque si :
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                "Vous générez déjà +5M FCFA/mois",
                "Vous voulez conquérir l'international",
                "Vous visez le statut de marque premium"
              ].map((text, index) => (
                <div key={index} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-100">
                  <CheckCircle className="w-8 h-8 text-purple-600 mb-3" />
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
            Un accompagnement premium complet
          </h2>

          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
            {deliverables.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white mb-4">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-[#0f4c81] mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Marchés cibles */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0f4c81] mb-12 text-center">
            Marchés que nous vous aidons à conquérir
          </h2>

          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
            {markets.map((market, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border-2 border-purple-100"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Globe className="w-8 h-8 text-purple-600" />
                  <h3 className="text-xl font-bold text-[#0f4c81]">{market.name}</h3>
                </div>
                <p className="text-gray-600">{market.countries}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Processus */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0f4c81] mb-12 text-center">
            Votre roadmap d'expansion internationale
          </h2>

          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
            {process.map((phase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-xl"
              >
                <div className="text-sm font-bold text-purple-600 mb-2">{phase.phase}</div>
                <h3 className="text-xl font-bold text-[#0f4c81] mb-2">{phase.title}</h3>
                <div className="text-sm text-gray-600 mb-6">{phase.duration}</div>
                <ul className="space-y-3">
                  {phase.points.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-sm">{point}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Garantie */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-2xl p-12 shadow-xl text-center">
            <Crown className="w-16 h-16 text-purple-600 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-[#0f4c81] mb-6">
              Notre garantie expansion
            </h2>
            <div className="text-5xl font-bold text-purple-600 mb-4">30%</div>
            <p className="text-xl text-gray-700 mb-8">
              De votre chiffre d'affaires vient de l'international en 12 mois<br />
              <span className="text-purple-600 font-semibold">
                ou nous continuons gratuitement jusqu'à atteindre cet objectif
              </span>
            </p>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              {[
                "Présence établie dans minimum 3 nouveaux marchés",
                "Réseau de distribution multi-canal opérationnel",
                "Stratégie marketing localisée par marché",
                "Équipe locale ou partenaires dans chaque pays"
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-purple-500 to-pink-500 relative overflow-hidden">
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
              Prêt à conquérir l'Afrique et le monde ?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Discutons de votre vision et créons ensemble votre empire e-commerce
            </p>

            <button
              onClick={() => setIsQuoteFormOpen(true)}
              className="inline-flex items-center justify-center bg-white text-purple-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all shadow-xl hover:scale-105"
            >
              Réserver un appel stratégique
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Formulaire de devis */}
      <FormulaQuoteForm
        isOpen={isQuoteFormOpen}
        onClose={() => setIsQuoteFormOpen(false)}
        formulaType="expansion"
        formulaName="Formule Expansion"
      />
    </div>
  );
};

export default ExpansionPage;
