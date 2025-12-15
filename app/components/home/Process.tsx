// app/components/home/Process.tsx
'use client';

import React from 'react';
import {
  Search,
  MessageSquare,
  Rocket,
  TrendingUp,
  CheckCircle,
  Clock,
  Users,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const ProcessSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const steps = [
    {
      number: "01",
      icon: <Search className="w-8 h-8" />,
      title: "Découverte",
      duration: "Semaine 1",
      description: "Appel gratuit pour comprendre votre marque, vos ambitions et vos défis. Nous créons ensemble votre diagnostic personnalisé.",
      details: [
        "Appel de diagnostic gratuit (30 min)",
        "Audit de votre marque et positionnement",
        "Analyse de votre marché cible",
        "Proposition de stratégie sur mesure"
      ],
      color: "from-[#fe6117] to-[#ff8c4d]",
      iconBg: "bg-[#fe6117]/10",
      iconColor: "text-[#fe6117]"
    },
    {
      number: "02",
      icon: <MessageSquare className="w-8 h-8" />,
      title: "Stratégie",
      duration: "Semaines 2-3",
      description: "Création de votre plan de croissance personnalisé avec objectifs clairs, timeline réaliste et budget adapté à vos moyens.",
      details: [
        "Définition des objectifs mesurables",
        "Roadmap détaillée étape par étape",
        "Sélection des outils et technologies",
        "Validation de la stratégie avec vous"
      ],
      color: "from-[#0f4c81] to-[#1a5a8f]",
      iconBg: "bg-[#0f4c81]/10",
      iconColor: "text-[#0f4c81]"
    },
    {
      number: "03",
      icon: <Rocket className="w-8 h-8" />,
      title: "Exécution",
      duration: "Semaines 4-8",
      description: "Notre équipe met en place votre boutique en ligne, vos campagnes marketing et tous vos systèmes de vente en mode sprint.",
      details: [
        "Création/refonte de votre site e-commerce",
        "Configuration technique complète",
        "Mise en place des outils d'analyse",
        "Formation de votre équipe"
      ],
      color: "from-purple-500 to-pink-500",
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-600"
    },
    {
      number: "04",
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Croissance",
      duration: "Mois 3+",
      description: "Accompagnement continu pour optimiser, ajuster et multiplier vos résultats mois après mois jusqu'à votre autonomie.",
      details: [
        "Lancement des campagnes marketing",
        "Optimisation continue des performances",
        "A/B testing et amélioration",
        "Reporting mensuel et ajustements"
      ],
      color: "from-emerald-500 to-teal-500",
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-600"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, x: -40 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-gray-50 via-blue-50/30 to-gray-50 relative overflow-hidden">
      {/* Décoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#fe6117]/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#0f4c81]/5 rounded-full blur-3xl"></div>

      <div className="w-full px-6 md:px-12 lg:px-16 xl:px-20 relative z-10">
        {/* Header */}
        <motion.div
          ref={ref}
          className="text-center mb-20 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 bg-[#fe6117]/10 border border-[#fe6117]/20 rounded-full px-5 py-2.5 mb-6">
            <Sparkles className="w-4 h-4 text-[#fe6117]" />
            <span className="text-[#fe6117] text-sm font-bold tracking-wide uppercase">
              Notre processus
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            De la découverte à la <span className="bg-gradient-to-r from-[#fe6117] to-[#ff8c4d] bg-clip-text text-transparent">croissance</span>
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            Un processus clair et transparent en <span className="font-semibold text-gray-900">4 étapes</span>,
            testé sur nos propres marques et appliqué aux marques africaines que nous accompagnons.
          </p>
        </motion.div>

        {/* Timeline avec les 4 étapes */}
        <motion.div
          className="max-w-5xl mx-auto mb-20"
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={containerVariants}
        >
          <div className="space-y-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={stepVariants}
                className="group relative"
              >
                {/* Ligne de connexion verticale (sauf pour la dernière étape) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute left-12 top-24 w-0.5 h-20 bg-gradient-to-b from-gray-300 to-transparent"></div>
                )}

                <div className="flex flex-col md:flex-row gap-6 bg-white rounded-3xl border border-gray-200 hover:border-[#fe6117]/30 hover:shadow-2xl transition-all duration-500 overflow-hidden">
                  {/* Colonne gauche - Numéro et Icône */}
                  <div className="md:w-64 relative">
                    <div className={`h-full bg-gradient-to-br ${step.color} p-8 flex flex-col items-center justify-center text-white relative overflow-hidden`}>
                      {/* Décoration de fond */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>

                      {/* Numéro badge */}
                      <div className="absolute top-4 left-4 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-lg z-10">
                        {step.number}
                      </div>

                      {/* Icône principale */}
                      <div className="relative z-10 mb-4">
                        <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          {step.icon}
                        </div>
                      </div>

                      {/* Titre et durée */}
                      <h3 className="text-2xl font-bold mb-2 relative z-10">{step.title}</h3>
                      <div className="bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-semibold relative z-10">
                        {step.duration}
                      </div>
                    </div>
                  </div>

                  {/* Colonne droite - Contenu */}
                  <div className="flex-1 p-8 md:p-10">
                    {/* Description */}
                    <p className="text-gray-700 text-lg leading-relaxed mb-6">
                      {step.description}
                    </p>

                    {/* Détails avec checkmarks */}
                    <div className="space-y-3">
                      {step.details.map((detail, idx) => (
                        <motion.div
                          key={idx}
                          className="flex items-start gap-3 group/item"
                          initial={{ opacity: 0, x: -10 }}
                          animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                          transition={{ delay: 0.1 * idx + 0.4 + index * 0.15, duration: 0.5 }}
                        >
                          <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${step.color} flex items-center justify-center flex-shrink-0 group-hover/item:scale-110 transition-transform duration-300`}>
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-gray-700 font-medium leading-relaxed">{detail}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Flèche de progression (sauf pour la dernière étape) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:flex justify-center my-4">
                    <ArrowRight className="w-6 h-6 text-gray-300 transform rotate-90" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Encadré accompagnement */}
        <motion.div
          className="bg-gradient-to-br from-gray-900 via-[#0f4c81] to-gray-900 rounded-3xl shadow-2xl p-10 md:p-14 text-white relative overflow-hidden max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          {/* Décoration */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#fe6117]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#fe6117] mb-6">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl md:text-4xl font-bold mb-4">
                Accompagnement garanti jusqu'au succès
              </h3>
              <p className="text-white/90 text-lg leading-relaxed max-w-2xl mx-auto">
                Chaque formule inclut une formation complète, un accompagnement personnalisé
                et tous les outils nécessaires pour réussir votre lancement et votre croissance.
              </p>
            </div>

            {/* Garanties en grid */}
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center hover:bg-white/10 transition-all duration-300 group">
                <div className="w-14 h-14 bg-[#fe6117]/20 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Clock className="w-7 h-7 text-[#fe6117]" />
                </div>
                <div className="text-3xl font-bold mb-2">24h</div>
                <div className="text-white/70 text-sm">Temps de réponse max</div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center hover:bg-white/10 transition-all duration-300 group">
                <div className="w-14 h-14 bg-[#fe6117]/20 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Users className="w-7 h-7 text-[#fe6117]" />
                </div>
                <div className="text-3xl font-bold mb-2">Dédiée</div>
                <div className="text-white/70 text-sm">Équipe à votre service</div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center hover:bg-white/10 transition-all duration-300 group">
                <div className="w-14 h-14 bg-[#fe6117]/20 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-7 h-7 text-[#fe6117]" />
                </div>
                <div className="text-3xl font-bold mb-2">100%</div>
                <div className="text-white/70 text-sm">Taux de satisfaction</div>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 text-center hover:bg-white/10 transition-all duration-300 group">
                <div className="w-14 h-14 bg-[#fe6117]/20 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-7 h-7 text-[#fe6117]" />
                </div>
                <div className="text-3xl font-bold mb-2">Sur-mesure</div>
                <div className="text-white/70 text-sm">Accompagnement adapté</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProcessSection;
