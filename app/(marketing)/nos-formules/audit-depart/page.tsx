// app/nos-formules/audit-depart/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Search,
  CheckCircle,
  Clock,
  TrendingUp,
  Target,
  FileText,
  Users,
  Lightbulb
} from 'lucide-react';
import { motion } from 'framer-motion';
import FormulaQuoteForm from '@/app/components/FormulaQuoteForm';

const AuditDepartPage = () => {
  const [isQuoteFormOpen, setIsQuoteFormOpen] = useState(false);
  const deliverables = [
    {
      icon: <Search className="w-6 h-6" />,
      title: "Audit complet de votre présence digitale",
      description: "Analyse approfondie de votre site, réseaux sociaux, et stratégie actuelle"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Analyse de 3-5 concurrents directs",
      description: "Benchmark complet pour identifier les opportunités et menaces"
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Rapport détaillé de 15-20 pages",
      description: "Document professionnel avec analyses, graphiques et recommandations"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Session de présentation de 90 minutes",
      description: "Visioconférence pour présenter les résultats et répondre à vos questions"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Roadmap personnalisé sur 6 mois",
      description: "Plan d'action détaillé avec priorités et timeline"
    }
  ];

  const process = [
    { step: "1", title: "Questionnaire initial", duration: "Jour 1", description: "Vous remplissez un formulaire détaillé sur votre marque" },
    { step: "2", title: "Analyse approfondie", duration: "Jours 2-4", description: "Notre équipe analyse votre marque, marché et concurrents" },
    { step: "3", title: "Rédaction du rapport", duration: "Jours 5-6", description: "Création du rapport détaillé avec recommandations" },
    { step: "4", title: "Présentation", duration: "Jour 7", description: "Session de 90 min pour présenter les résultats" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28 bg-gradient-to-br from-emerald-500 to-teal-500 relative overflow-hidden">
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
              <Search className="w-4 h-4 text-white" />
              <span className="text-white text-sm font-semibold">
                Formule Audit de Départ
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Comprenez votre potentiel e-commerce
            </h1>
            <p className="text-2xl text-white/90 mb-8">
              Un diagnostic complet pour savoir exactement quoi faire ensuite
            </p>

            <div className="flex flex-wrap gap-6 text-white/90 mb-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <span className="font-semibold">245 000F CFA</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <span className="font-semibold">1 semaine</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <span className="font-semibold">Remboursable</span>
              </div>
            </div>

            <button
              onClick={() => setIsQuoteFormOpen(true)}
              className="inline-flex items-center justify-center bg-white text-emerald-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-xl"
            >
              Commander mon audit
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Ce qui est inclus */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0f4c81] mb-12 text-center">
            Ce que vous recevez
          </h2>

          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
            {deliverables.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 border border-emerald-100"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white mb-4">
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
        </div>
      </section>

      {/* Processus */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0f4c81] mb-12 text-center">
            Comment ça se passe ?
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
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-2xl font-bold">
                    {item.step}
                  </div>
                </div>
                <div className="flex-1 bg-white rounded-2xl p-6 shadow-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-[#0f4c81]">{item.title}</h3>
                    <span className="text-sm text-emerald-600 font-semibold bg-emerald-50 px-3 py-1 rounded-full">
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

      {/* CTA */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-emerald-500 to-teal-500 relative overflow-hidden">
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
              Prêt à comprendre votre potentiel ?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              L'audit est remboursable si vous souscrivez à une formule
            </p>

            <button
              onClick={() => setIsQuoteFormOpen(true)}
              className="inline-flex items-center justify-center bg-white text-emerald-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-xl"
            >
              Commander mon audit (245 000F CFA)
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Formulaire de devis */}
      <FormulaQuoteForm
        isOpen={isQuoteFormOpen}
        onClose={() => setIsQuoteFormOpen(false)}
        formulaType="audit-depart"
        formulaName="Formule Audit de Départ"
      />
    </div>
  );
};

export default AuditDepartPage;
