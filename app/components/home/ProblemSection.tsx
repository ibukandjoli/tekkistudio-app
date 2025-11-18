// app/components/home/ProblemSection.tsx
'use client';

import React from 'react';
import { TrendingDown, Settings, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const ProblemSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const problems = [
    {
      icon: <TrendingDown className="w-10 h-10" />,
      title: "Visibilité limitée",
      description: "Vos produits sont exceptionnels, mais votre marque peine à atteindre de nouveaux clients au-delà de votre base actuelle. De nombreux potentiels clients cherchent activement des produits authentiques, mais ne vous trouvent pas sur Internet.",
      impact: "Opportunités manquées"
    },
    {
      icon: <Settings className="w-10 h-10" />,
      title: "E-commerce trop complexe",
      description: "Concevoir une boutique en ligne performante demande des compétences techniques, marketing, et logistiques que vous n'avez pas. Entre le site, les paiements, la livraison et la publicité, c'est un casse-tête que vous peinez à résoudre.",
      impact: "Temps et énergie perdus"
    },
    {
      icon: <BarChart3 className="w-10 h-10" />,
      title: "Ventes qui stagnent",
      description: "Vous avez peut-être une présence sur Instagram ou même un site web, mais les ventes ne décollent pas comme vous l'espériez. Vous ne savez pas comment attirer de nouveaux clients qualifiés, ni transformer vos visiteurs actuels en clients fidèles.",
      impact: "Croissance bloquée"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
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
    <section className="py-20 md:py-28 bg-warm-gradient relative overflow-hidden">
      {/* Décoration de fond */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#0f4c81]/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#ff7f50]/5 rounded-full blur-3xl -z-10"></div>

      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div 
          className="text-center mb-16 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 bg-red-50 border border-red-100 rounded-full px-4 py-2 mb-6">
            <span className="text-red-600 text-xs font-bold tracking-wider uppercase">
              Le défi des marques africaines
            </span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold text-[#0f4c81] mb-4">
            Des produits exceptionnels, mais des ventes qui stagnent
          </h2>
          <p className="text-xl text-gray-600">
            Nous comprenons les défis uniques auxquels font face les marques africaines 
            qui veulent vendre en ligne et se développer à l'international.
          </p>
        </motion.div>

        {/* Grille des problèmes */}
        <motion.div 
          ref={ref}
          className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={containerVariants}
        >
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              className="group relative bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:border-[#ff7f50]/30 hover:shadow-2xl transition-all duration-300"
              variants={itemVariants}
              whileHover={{ y: -8 }}
            >
              {/* Badge impact */}
              <div className="absolute -top-3 right-6">
                <div className="bg-red-100 text-red-600 text-xs font-bold px-3 py-1 rounded-full border border-red-200">
                  {problem.impact}
                </div>
              </div>

              {/* Icône */}
              <div className="mb-6">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                  {problem.icon}
                </div>
              </div>

              {/* Contenu */}
              <h3 className="text-xl font-bold text-[#0f4c81] mb-4 group-hover:text-[#ff7f50] transition-colors">
                {problem.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {problem.description}
              </p>

              {/* Ligne décorative animée */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="w-0 h-1 bg-gradient-to-r from-[#ff7f50] to-[#ff6b3d] rounded-full group-hover:w-full transition-all duration-500"></div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Transition vers la solution */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <div className="inline-block bg-gradient-to-r from-gray-50 to-white rounded-2xl p-8 shadow-lg border border-gray-200 max-w-3xl">
            <p className="text-lg text-gray-700 mb-4">
              <span className="font-semibold text-[#0f4c81]">La bonne nouvelle </span> 
              {' '}est que ces défis sont surmontables avec la bonne stratégie, le bon partenaire et une excellente compréhension du marché de l'e-commerce.
            </p>
            <p className="text-2xl font-bold text-[#ff7f50]">
              C'est exactement ce que nous faisons chez TEKKI Studio.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProblemSection;