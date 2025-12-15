// app/components/home/ProblemSection.tsx
'use client';

import React from 'react';
import { AlertCircle, TrendingDown, Users, Zap, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const ProblemSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const challenges = [
    {
      icon: <TrendingDown className="w-8 h-8" />,
      title: "Vous vendez via Instagram et WhatsApp... et vous vous épuisez",
      pain: "Vous gérez chaque commande dans les DM ou sur WhatsApp. Vous répondez aux mêmes questions 50 fois par jour. Vous perdez des ventes lorsque vous dormez. Il est impossible de faire grandir une marque ainsi... et vous le savez.",
      stat: "Cette méthode a une limite",
      statLabel: "et vous l'atteignez rapidement"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Vos produits sont premium, mais votre image en ligne est décevante",
      pain: "Photos de produits de mauvaise qualité. Pas de site web moderne et profesionnel. Aucune cohérence visuelle. Résultat : les clients hésitent, comparent votre marque à celles internationnales... et finissent par acheter ailleurs.",
      stat: "Un client décide en 3 secondes",
      statLabel: "s'il vous fait confiance ou non"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Vous avez de la visibilité, mais pas de machine à convertir",
      pain: "Des gens voient vos posts sur les réseaux, visitent votre page... puis disparaissent. Sans tunnel de conversion, sans boutique en ligne optimisée, sans relances automatisées, vous perdez de l'argent chaque jour.",
      stat: "De la visibilité sans conversion",
      statLabel: "c'est de l'argent qui s'évapore"
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
    <section className="py-20 md:py-32 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
      {/* Décoration de fond subtile */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.02]" style={{
        backgroundImage: 'radial-gradient(circle, #0f4c81 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }}></div>

      <div className="w-full px-6 md:px-12 lg:px-16 xl:px-20 relative z-10">
        {/* En-tête avec empathie */}
        <motion.div
          ref={ref}
          className="text-center mb-16 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Pourquoi tant de marques africaines <br className="hidden md:block"/>
            <span className="text-[#fe6117]">peinent à percer en ligne ?</span>
          </h2>

          <p className="text-xl text-gray-600 leading-relaxed">
            Après avoir accompagné <span className="font-semibold text-gray-900">plus de 10 marques</span> et vendu <span className="font-semibold text-gray-900">+8 000 produits</span> avec nos propres marques, nous avons identifié ce qui bloque vraiment les marques africaines.
          </p>
        </motion.div>

        {/* Grille des défis - Layout moderne */}
        <motion.div
          className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={containerVariants}
        >
          {challenges.map((challenge, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative"
            >
              {/* Numéro du défi */}
              <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-gradient-to-br from-[#fe6117] to-[#ff8c4d] flex items-center justify-center text-white font-bold text-xl shadow-lg z-10">
                {index + 1}
              </div>

              {/* Card du défi */}
              <div className="relative bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:border-[#fe6117]/30 hover:shadow-2xl transition-all duration-300 h-full">
                {/* Icône */}
                <div className="mb-6">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center text-[#fe6117] group-hover:scale-110 transition-transform duration-300">
                    {challenge.icon}
                  </div>
                </div>

                {/* Titre du problème */}
                <h3 className="text-xl font-bold text-gray-900 mb-4 leading-snug">
                  {challenge.title}
                </h3>

                {/* Description empathique */}
                <p className="text-gray-600 leading-relaxed mb-6">
                  {challenge.pain}
                </p>

                {/* Statistique impactante */}
                <div className="pt-6 border-t border-gray-100">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-50 flex items-center justify-center mt-1">
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-red-600">{challenge.stat}</p>
                      <p className="text-sm text-gray-600">{challenge.statLabel}</p>
                    </div>
                  </div>
                </div>

                {/* Ligne décorative animée */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#fe6117] to-[#ff8c4d] rounded-b-2xl scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Section de réassurance - La bonne nouvelle */}
        <motion.div
          className="mt-20 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <div className="relative bg-gradient-to-br from-emerald-50 via-cyan-50 to-blue-50 rounded-3xl p-8 md:p-12 shadow-xl border border-emerald-100 overflow-hidden">
            {/* Décoration de fond */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-200/20 to-cyan-200/20 rounded-full blur-3xl"></div>

            <div className="relative z-10">
              {/* Icône check */}
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-lg mb-6">
                <CheckCircle className="w-8 h-8 text-emerald-500" />
              </div>

              {/* Message de réassurance */}
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                La bonne nouvelle est que <span className="text-[#0f4c81]">ces défis sont surmontables.</span>
              </h3>

              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Nous avons développé une méthode éprouvée qui a permis à <span className="font-semibold text-gray-900">nos propres marques</span> de vendre, en 2 ans, plus de <span className="font-semibold text-gray-900">8000 produits</span> en ligne à des clients en Afrique et à l'international.
              </p>

              {/* Points clés */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center mt-0.5">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Stratégie testée</p>
                    <p className="text-sm text-gray-600">Sur nos propres marques</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center mt-0.5">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Expertise confirmée</p>
                    <p className="text-sm text-gray-600">En e-commerce africain</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center mt-0.5">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Résultats mesurables</p>
                    <p className="text-sm text-gray-600">+8000 produits vendus</p>
                  </div>
                </div>
              </div>

              {/* CTA subtil */}
              <div className="mt-8 pt-8 border-t border-emerald-200">
                <p className="text-center text-xl font-bold text-[#fe6117]">
                  C'est ce que nous proposons de faire pour votre marque.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProblemSection;
