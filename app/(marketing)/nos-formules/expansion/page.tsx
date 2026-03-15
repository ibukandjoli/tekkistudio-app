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
  Target,
  Rocket,
  Users,
  BarChart
} from 'lucide-react';
import { motion } from 'framer-motion';
import FormulaQuoteForm from '@/app/components/FormulaQuoteForm';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.1 }
  })
};

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
    <div className="min-h-screen font-body">
      {/* Hero */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28 bg-tekki-blue relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full pointer-events-none" />

        <div className="mx-auto px-3 md:px-6 lg:px-8 w-full max-w-[1536px] relative z-10">
          <Link
            href="/nos-formules"
            className="inline-flex items-center text-white/70 hover:text-white mb-8 transition-colors"
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
            <div className="inline-flex items-center gap-2 bg-tekki-orange/15 border border-tekki-orange/30 rounded-full px-4 py-2 mb-6">
              <Globe className="w-4 h-4 text-tekki-orange" />
              <span className="text-tekki-orange text-sm font-semibold">
                Formule Expansion — Pour marques ambitieuses
              </span>
            </div>

            <h1 className="font-heading text-4xl md:text-6xl font-bold text-white mb-6">
              Devenez une marque panafricaine et internationale
            </h1>
            <p className="text-xl text-white/70 mb-8">
              Vendez au-delà des frontières et construisez un empire e-commerce
            </p>

            <div className="flex flex-wrap gap-6 text-white/80 mb-8">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-tekki-orange" />
                <span className="font-semibold">À partir de 1,5M FCFA</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-tekki-orange" />
                <span className="font-semibold">6-12 mois</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-tekki-orange" />
                <span className="font-semibold">30% CA international garanti</span>
              </div>
            </div>

            <button
              onClick={() => setIsQuoteFormOpen(true)}
              className="inline-flex items-center justify-center bg-tekki-orange hover:bg-tekki-orange/90 text-white px-8 py-4 rounded-full font-bold text-lg transition-all"
            >
              Obtenir un devis gratuit
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Idéal pour */}
      <section className="py-12 bg-white border-b border-tekki-blue/8">
        <div className="mx-auto px-3 md:px-6 lg:px-8 w-full max-w-[1536px]">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-heading text-2xl font-bold text-tekki-blue mb-6 text-center">
              Cette formule est idéale pour votre marque si :
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                "Vous générez déjà +5M FCFA/mois",
                "Vous voulez conquérir l'international",
                "Vous visez le statut de marque premium"
              ].map((text, index) => (
                <div key={index} className="bg-tekki-cream rounded-xl p-6 border border-tekki-blue/8">
                  <CheckCircle className="w-8 h-8 text-tekki-orange mb-3" />
                  <p className="text-tekki-blue/70 font-medium">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Ce qui est inclus */}
      <section className="py-20 md:py-28 bg-tekki-cream">
        <div className="mx-auto px-3 md:px-6 lg:px-8 w-full max-w-[1536px]">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-tekki-blue mb-12 text-center">
            Un accompagnement premium complet
          </h2>

          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
            {deliverables.map((item, index) => (
              <motion.div
                key={index}
                custom={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="bg-white rounded-2xl p-8 border border-tekki-blue/8"
              >
                <div className="w-14 h-14 rounded-xl bg-tekki-orange flex items-center justify-center text-white mb-4">
                  {item.icon}
                </div>
                <h3 className="font-heading text-lg font-bold text-tekki-blue mb-3">
                  {item.title}
                </h3>
                <p className="text-tekki-blue/60">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Marchés cibles */}
      <section className="py-20 md:py-28 bg-white">
        <div className="mx-auto px-3 md:px-6 lg:px-8 w-full max-w-[1536px]">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-tekki-blue mb-12 text-center">
            Marchés que nous vous aidons à conquérir
          </h2>

          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
            {markets.map((market, index) => (
              <motion.div
                key={index}
                custom={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="bg-tekki-cream rounded-2xl p-8 border border-tekki-blue/8"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Globe className="w-8 h-8 text-tekki-orange" />
                  <h3 className="font-heading text-xl font-bold text-tekki-blue">{market.name}</h3>
                </div>
                <p className="text-tekki-blue/60">{market.countries}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Processus */}
      <section className="py-20 md:py-28 bg-tekki-cream">
        <div className="mx-auto px-3 md:px-6 lg:px-8 w-full max-w-[1536px]">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-tekki-blue mb-12 text-center">
            Votre roadmap d'expansion internationale
          </h2>

          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
            {process.map((phase, index) => (
              <motion.div
                key={index}
                custom={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="bg-white rounded-2xl p-8 border border-tekki-blue/8"
              >
                <div className="text-sm font-bold text-tekki-orange mb-2">{phase.phase}</div>
                <h3 className="font-heading text-xl font-bold text-tekki-blue mb-2">{phase.title}</h3>
                <div className="text-sm text-tekki-blue/50 mb-6">{phase.duration}</div>
                <ul className="space-y-3">
                  {phase.points.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-tekki-orange flex-shrink-0 mt-0.5" />
                      <span className="text-tekki-blue/60 text-sm">{point}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Garantie */}
      <section className="py-20 md:py-28 bg-white">
        <div className="mx-auto px-3 md:px-6 lg:px-8 w-full max-w-[1536px]">
          <div className="max-w-4xl mx-auto bg-tekki-cream rounded-2xl p-12 border border-tekki-blue/8 text-center">
            <Crown className="w-16 h-16 text-tekki-orange mx-auto mb-6" />
            <h2 className="font-heading text-3xl font-bold text-tekki-blue mb-6">
              Notre garantie expansion
            </h2>
            <div className="text-5xl font-bold text-tekki-orange mb-4">30%</div>
            <p className="text-xl text-tekki-blue/70 mb-8">
              De votre chiffre d'affaires vient de l'international en 12 mois<br />
              <span className="text-tekki-orange font-semibold">
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
                  <CheckCircle className="w-6 h-6 text-tekki-orange flex-shrink-0 mt-0.5" />
                  <span className="text-tekki-blue/70">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 bg-tekki-blue relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-white/5 rounded-full pointer-events-none" />

        <div className="mx-auto px-3 md:px-6 lg:px-8 w-full max-w-[1536px] relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-white mb-6">
              Prêt à conquérir l'Afrique et le monde ?
            </h2>
            <p className="text-xl text-white/70 mb-8">
              Discutons de votre vision et créons ensemble votre empire e-commerce
            </p>

            <button
              onClick={() => setIsQuoteFormOpen(true)}
              className="inline-flex items-center justify-center bg-tekki-orange hover:bg-tekki-orange/90 text-white px-8 py-4 rounded-full font-bold text-lg transition-all"
            >
              Réserver un appel stratégique
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </motion.div>
        </div>
      </section>

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
