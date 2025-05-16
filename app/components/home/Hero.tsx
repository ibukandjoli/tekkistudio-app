// app/components/home/Hero.tsx avec animations
'use client';

import React, { useEffect } from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import * as framerMotion from 'framer-motion';
const { motion, useAnimation } = framerMotion;
import { useInView } from 'react-intersection-observer';

const HeroSection = () => {
  const controls = useAnimation();
  const statsControls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2
  });
  
  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" }
    }
  };

  const statsContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 1.2
      }
    }
  };

  const statItem = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <section className="relative pt-32 pb-10 md:pt-40 md:pb-16 overflow-hidden">
      {/* Arrière-plan avec gradient amélioré */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#042b65] via-[#1a5a8f] to-[#ff7f50] -z-10"></div>
      
      {/* Overlay radial gradient pour ajouter de la profondeur */}
      <div className="absolute inset-0 bg-gradient-radial from-[#1e69a3]/30 to-transparent opacity-70 -z-10"></div>
      
      {/* Motif de fond subtil */}
      <div className="absolute inset-0 bg-[url('/img/pattern.svg')] bg-repeat opacity-5 -z-10"></div>
      
      {/* Effets de lumière */}
      <div className="absolute top-20 left-[10%] w-80 h-80 bg-[#3d85c6] rounded-full filter blur-[100px] opacity-20 -z-10"></div>
      <div className="absolute bottom-20 right-[5%] w-96 h-96 bg-[#ff7f50] rounded-full filter blur-[120px] opacity-10 -z-10"></div>
      
      <div className="container mx-auto px-4">
        <motion.div 
          ref={ref}
          className="max-w-4xl mx-auto text-center mb-12"
          initial="hidden"
          animate={controls}
          variants={container}
        >
          {/* Titre principal - plus concis et impactant */}
          <motion.h1 
            variants={item}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
          >
            Acquérez un business en ligne <span className="text-[#ff7f50]">prêt à générer des revenus</span>
          </motion.h1>
          
          {/* Sous-titre simplifié */}
          <motion.p 
            variants={item}
            className="text-xl text-white/90 mb-10 max-w-2xl mx-auto"
          >
            Lancez votre business e-commerce ou digital sans partir de zéro.
          </motion.p>
          
          {/* Boutons d'action centrés et espacés */}
          <motion.div 
            variants={item}
            className="flex flex-col sm:flex-row justify-center gap-4 mb-10"
          >
            <Link 
              href="/business" 
              className="bg-[#ff7f50] hover:bg-[#ff6b3d] text-white px-8 py-4 rounded-lg font-medium transition-colors flex items-center justify-center shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
            >
              Découvrir les business en vente
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link 
              href="/comparatif-acquisition" 
              className="bg-white hover:bg-gray-100 text-[#0f4c81] px-8 py-4 rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
            >
              Comparer les types de business
            </Link>
          </motion.div>
          
          {/* Avantages simplifiés */}
          <motion.div 
            variants={item}
            className="flex flex-wrap justify-center gap-6 mb-10"
          >
            <div className="flex items-center text-white">
              <CheckCircle className="h-5 w-5 text-[#ff7f50] mr-2" />
              <span>Formation incluse</span>
            </div>
            <div className="flex items-center text-white">
              <CheckCircle className="h-5 w-5 text-[#ff7f50] mr-2" />
              <span>2 mois d'accompagnement</span>
            </div>
            <div className="flex items-center text-white">
              <CheckCircle className="h-5 w-5 text-[#ff7f50] mr-2" />
              <span>Support réactif 7j/7</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Statistiques simplifiées dans une bande au bas de la hero section - ESPACE RÉDUIT */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={statsContainer}
        className="mt-8 border-t border-white/20 pt-4 pb-4 backdrop-blur-sm bg-[#0f4c81]/30"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <motion.div className="text-center" variants={statItem}>
              <motion.p 
                className="text-2xl md:text-3xl font-bold text-white"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.3 }}
              >
                +10
              </motion.p>
              <p className="text-sm text-white/70">Business créés</p>
            </motion.div>
            <motion.div className="text-center" variants={statItem}>
              <motion.p 
                className="text-2xl md:text-3xl font-bold text-white"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.4 }}
              >
                +10K
              </motion.p>
              <p className="text-sm text-white/70">Clients satisfaits</p>
            </motion.div>
            <motion.div className="text-center" variants={statItem}>
              <motion.p 
                className="text-2xl md:text-3xl font-bold text-white"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.5 }}
              >
                4 mois
              </motion.p>
              <p className="text-sm text-white/70">ROI moyen</p>
            </motion.div>
            <motion.div className="text-center" variants={statItem}>
              <motion.p 
                className="text-2xl md:text-3xl font-bold text-white"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.6 }}
              >
                7j/7
              </motion.p>
              <p className="text-sm text-white/70">Support disponible</p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;