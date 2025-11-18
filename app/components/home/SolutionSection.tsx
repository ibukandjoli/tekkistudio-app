// app/components/home/SolutionSection.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { Target, ShoppingCart, TrendingUp, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const SolutionSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const pillars = [
    {
      icon: <Target className="w-8 h-8" />,
      title: "Stratégie E-commerce",
      description: "Nous commençons par comprendre votre marque, votre marché et vos ambitions. Puis nous créons votre feuille de route personnalisée.",
      features: [
        "Audit complet de votre marque",
        "Positionnement et proposition de valeur",
        "Stratégie d'acquisition multi-canal",
        "Plan d'action sur mesure"
      ],
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-50 to-cyan-50"
    },
    {
      icon: <ShoppingCart className="w-8 h-8" />,
      title: "Boutique Haute Performance",
      description: "Nous créons votre site e-commerce optimisé pour convertir les visiteurs en clients, avec une expérience fluide et professionnelle, adaptée à tous les écrans.",
      features: [
        "Design moderne et responsive",
        "Expérience utilisateur optimisée",
        "Référencement sur Google & ChatGPT",
        "Optimisation des conversions (ventes)"
      ],
      color: "from-purple-500 to-pink-500",
      bgColor: "from-purple-50 to-pink-50"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Croissance & Optimisation",
      description: "Nous mettons en place toutes les stratégies d'acquisition et de fidélisation pour générer des ventes constantes et croissantes pour les produits de votre marque.",
      features: [
        "Publicité digitale (Meta, Google, TikTok)",
        "Marketing de contenu et storytelling",
        "WhatsApp marketing et automatisation",
        "Analytics et optimisation continue"
      ],
      color: "from-orange-500 to-red-500",
      bgColor: "from-orange-50 to-red-50"
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

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-white to-tekki-blue-25 relative overflow-hidden">
      {/* Décoration de fond */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#ff7f50]/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#0f4c81]/5 rounded-full blur-3xl -z-10"></div>

      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div 
          className="text-center mb-16 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-full px-4 py-2 mb-6">
            <Zap className="w-4 h-4 text-emerald-600" />
            <span className="text-emerald-700 text-xs font-bold tracking-wider uppercase">
              Notre approche
            </span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold text-[#0f4c81] mb-6">
            TEKKI Studio : le partenaire de croissance de votre marque
          </h2>
          
          <p className="text-xl text-gray-600 mb-6">
            Nous ne sommes pas une simple agence. Nous sommes une fabrique de marques qui 
            comprend vos défis parce que nous les vivons nous-mêmes.
          </p>

          {/* Différenciateur clé */}
          <div className="inline-block bg-gradient-to-r from-[#ff7f50]/10 to-[#ff6b3d]/10 border border-[#ff7f50]/20 rounded-2xl p-6 mt-4">
            <p className="text-lg font-semibold text-[#0f4c81]">
              Nous avons créé et développé nos propres marques <span className="text-[#ff7f50]">(VIENS ON S'CONNAÎT et AMANI)</span> 
              {' '}. Nous savons ce qui fonctionne et l'appliquons aux marques africaines que nous accompagnons.
            </p>
          </div>
        </motion.div>

        {/* Titre des 3 piliers */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <h3 className="text-2xl md:text-3xl font-bold text-[#0f4c81] mb-3">
            Notre méthode en 3 piliers
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Une approche complète qui couvre tous les aspects de votre succès e-commerce
          </p>
        </motion.div>

        {/* Grille des 3 piliers */}
        <motion.div 
          ref={ref}
          className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16"
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={containerVariants}
        >
          {pillars.map((pillar, index) => (
            <motion.div
              key={index}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300"
              variants={itemVariants}
              whileHover={{ y: -8 }}
            >
              {/* Header avec gradient */}
              <div className={`bg-gradient-to-br ${pillar.color} p-6 text-white relative overflow-hidden`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4">
                    {pillar.icon}
                  </div>
                  <h4 className="text-xl font-bold">{pillar.title}</h4>
                </div>
              </div>

              {/* Body */}
              <div className="p-6">
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {pillar.description}
                </p>

                {/* Features list */}
                <div className="space-y-3">
                  {pillar.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ligne décorative animée */}
              <div className="px-6 pb-6">
                <div className={`w-0 h-1 bg-gradient-to-r ${pillar.color} rounded-full group-hover:w-full transition-all duration-500`}></div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <div className="bg-gradient-to-r from-[#0f4c81] to-[#1a5a8f] rounded-3xl p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
            {/* Décoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#ff7f50]/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 text-center">
              <div className="text-center mb-8">
                <h3 className="text-2xl md:text-4xl font-bold mb-4">
                  Prêt à appliquer ces stratégies ?
                </h3>
                <p className="text-white/90 text-lg max-w-2xl mx-auto">
                  Découvrez quelle offre correspond le mieux à votre niveau d'ambition 
                  et commencez votre transformation digitale dès aujourd'hui.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href="/nos-formules"
                    className="inline-flex items-center justify-center bg-[#ff7f50] hover:bg-[#ff6b3d] text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-xl hover:shadow-2xl"
                  >
                    Découvrir nos offres
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <a
                    href="https://wa.me/221781362728?text=Bonjour%20TEKKI%20Studio%20!%20J%27aimerais%20discuter%20de%20ma%20marque%20et%20savoir%20comment%20vous%20pouvez%20m%27aider."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all"
                  >
                    Réserver un appel gratuit
                  </a>
                </motion.div>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-white/80">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>Sans engagement</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>Diagnostic gratuit</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>Réponse sous 24h</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SolutionSection;