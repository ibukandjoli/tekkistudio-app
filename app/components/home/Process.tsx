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
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useIsMobile } from '@/app/hooks/useIsMobile';

const ProcessSection = () => {
  const isMobile = useIsMobile();
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
      description: "Nous commençons par un appel gratuit pour comprendre en profondeur votre marque, vos ambitions et vos défis actuels.",
      details: [
        "Appel de diagnostic gratuit (30 min)",
        "Audit de votre marque et positionnement",
        "Analyse de votre marché cible",
        "Proposition de stratégie sur mesure"
      ],
      color: "from-blue-500 to-cyan-500",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600"
    },
    {
      number: "02",
      icon: <MessageSquare className="w-8 h-8" />,
      title: "Stratégie",
      duration: "Semaines 2-3",
      description: "Nous créons votre plan de croissance personnalisé avec des objectifs clairs, une timeline réaliste et un budget adapté.",
      details: [
        "Définition des objectifs mesurables",
        "Roadmap détaillée étape par étape",
        "Sélection des outils et technologies",
        "Validation de la stratégie avec vous"
      ],
      color: "from-purple-500 to-pink-500",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600"
    },
    {
      number: "03",
      icon: <Rocket className="w-8 h-8" />,
      title: "Exécution",
      duration: "Semaines 4-8",
      description: "Notre équipe met en place votre boutique, vos campagnes marketing et tous vos systèmes de vente en mode sprint.",
      details: [
        "Création/refonte de votre site e-commerce",
        "Configuration technique complète",
        "Mise en place des outils d'analyse",
        "Formation de votre équipe (si nécessaire)"
      ],
      color: "from-orange-500 to-red-500",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600"
    },
    {
      number: "04",
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Croissance",
      duration: "Mois 3-6",
      description: "Accompagnement continu pour optimiser, ajuster et multiplier vos résultats mois après mois jusqu'à l'autonomie.",
      details: [
        "Lancement des campagnes marketing",
        "Optimisation continue des performances",
        "A/B testing et amélioration",
        "Reporting mensuel et ajustements"
      ],
      color: "from-emerald-500 to-teal-500",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0
      }
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  return (
    <section className="py-20 md:py-28 bg-earth-gradient relative overflow-hidden">
      {/* Décoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#0f4c81]/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#ff7f50]/5 rounded-full blur-3xl -z-10"></div>

      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          ref={ref}
          className="text-center mb-16 max-w-3xl mx-auto"
          initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          animate={inView || isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 bg-[#0f4c81]/10 border border-[#0f4c81]/20 rounded-full px-4 py-2 mb-6">
            <Zap className="w-4 h-4 text-[#0f4c81]" />
            <span className="text-[#0f4c81] text-xs font-bold tracking-wider uppercase">
              Notre méthode
            </span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold text-[#0f4c81] mb-4">
            Comment nous travaillons
          </h2>
          <p className="text-xl text-gray-600">
            Un processus clair et transparent, de la découverte à la croissance continue
          </p>
        </motion.div>

        {/* Timeline - Version Desktop */}
        <div className="hidden lg:block max-w-7xl mx-auto mb-20">
          {/* Ligne de connexion */}
          <div className="relative mb-16">
            <div className="absolute top-20 left-0 right-0 h-1 bg-gradient-to-r from-blue-200 via-purple-200 via-orange-200 to-emerald-200"></div>
          </div>

          <motion.div
            className="grid grid-cols-4 gap-6"
            initial="hidden"
            animate={inView || isMobile ? "visible" : "hidden"}
            variants={containerVariants}
          >
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className="relative"
                variants={stepVariants}
              >
                {/* Numéro de l'étape avec icône */}
                <div className="relative z-10 mb-6">
                  <div className={`w-40 h-40 mx-auto rounded-2xl bg-gradient-to-br ${step.color} shadow-xl flex flex-col items-center justify-center text-white group hover:scale-110 transition-transform duration-300`}>
                    <div className="text-5xl font-bold opacity-30 mb-2">{step.number}</div>
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      {step.icon}
                    </div>
                  </div>
                </div>

                {/* Contenu */}
                <div className="text-center">
                  <h3 className="text-xl font-bold text-[#0f4c81] mb-2">{step.title}</h3>
                  <div className="inline-block bg-[#ff7f50]/10 text-[#ff7f50] px-3 py-1 rounded-full text-xs font-semibold mb-3">
                    {step.duration}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {step.description}
                  </p>
                  
                  {/* Points clés - visible au hover */}
                  <div className="bg-gray-50 rounded-xl p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ul className="space-y-2 text-xs text-left">
                      {step.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start">
                          <CheckCircle className="w-3 h-3 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Timeline - Version Mobile/Tablette */}
        <motion.div
          className="lg:hidden space-y-6 max-w-2xl mx-auto mb-16"
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={containerVariants}
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="relative bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow"
              variants={stepVariants}
            >
              {/* Header avec gradient */}
              <div className={`bg-gradient-to-r ${step.color} p-6 text-white`}>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                    {step.icon}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold opacity-75 mb-1">{step.number}</div>
                    <h3 className="text-2xl font-bold">{step.title}</h3>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-6">
                <div className="inline-block bg-[#ff7f50]/10 text-[#ff7f50] px-3 py-1 rounded-full text-xs font-semibold mb-4">
                  {step.duration}
                </div>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {step.description}
                </p>
                
                {/* Détails */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <ul className="space-y-2 text-sm">
                    {step.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Encadré accompagnement */}
        <motion.div
          className="bg-gradient-to-r from-[#0f4c81] to-[#1a5a8f] rounded-3xl shadow-2xl p-8 md:p-12 max-w-6xl mx-auto text-white relative overflow-hidden"
          initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          animate={inView || isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: isMobile ? 0 : 0.5, duration: 0.6 }}
        >
          {/* Décoration */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#ff7f50]/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/4 flex justify-center">
                <div className="w-28 h-28 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white/20">
                  <CheckCircle className="w-16 h-16 text-[#ff7f50]" />
                </div>
              </div>
              
              <div className="md:w-3/4 text-center md:text-left">
                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                  Accompagnement garanti jusqu'au succès
                </h3>
                <p className="text-white/90 mb-6 text-lg leading-relaxed">
                  Chaque offre inclut une formation complète, un accompagnement personnalisé 
                  et tous les outils nécessaires pour réussir votre lancement et votre croissance.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 text-center hover:bg-white/15 transition-colors">
                    <Clock className="w-6 h-6 mx-auto mb-2 text-[#ff7f50]" />
                    <div className="text-2xl font-bold mb-1">24h</div>
                    <div className="text-white/80 text-xs">Réponse max</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 text-center hover:bg-white/15 transition-colors">
                    <Users className="w-6 h-6 mx-auto mb-2 text-[#ff7f50]" />
                    <div className="text-2xl font-bold mb-1">Dédiée</div>
                    <div className="text-white/80 text-xs">Équipe</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 text-center hover:bg-white/15 transition-colors">
                    <TrendingUp className="w-6 h-6 mx-auto mb-2 text-[#ff7f50]" />
                    <div className="text-2xl font-bold mb-1">100%</div>
                    <div className="text-white/80 text-xs">Satisfaction</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 text-center hover:bg-white/15 transition-colors">
                    <Zap className="w-6 h-6 mx-auto mb-2 text-[#ff7f50]" />
                    <div className="text-2xl font-bold mb-1">7j/7</div>
                    <div className="text-white/80 text-xs">Support</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProcessSection;