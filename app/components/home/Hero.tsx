// app/components/home/Hero.tsx 
'use client';

import React, { useEffect } from 'react';
import { ArrowRight, CheckCircle, Sparkles, TrendingUp, Globe } from 'lucide-react';
import Link from 'next/link';
import * as framerMotion from 'framer-motion';
const { motion, useAnimation } = framerMotion;
import { useInView } from 'react-intersection-observer';

const HeroSection = () => {
  const controls = useAnimation();
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
        staggerChildren: 0.12,
        delayChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const statsContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.8
      }
    }
  };

  const statItem = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
      {/* Arrière-plan avec gradient optimisé */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#042b65] via-[#0f4c81] to-[#1a5a8f] -z-10"></div>
      
      {/* Overlay pour profondeur */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#ff7f50]/20 via-transparent to-transparent opacity-40 -z-10"></div>
      
      {/* Motif de points subtil */}
      <div className="absolute inset-0 opacity-[0.03] -z-10" style={{
        backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
        backgroundSize: '50px 50px'
      }}></div>
      
      {/* Effets de lumière animés */}
      <motion.div 
        className="absolute top-20 -right-20 w-[500px] h-[500px] bg-[#ff7f50] rounded-full filter blur-[150px] opacity-20 -z-10"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity,
          repeatType: "reverse" 
        }}
      />
      
      <motion.div 
        className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-[#1a5a8f] rounded-full filter blur-[130px] opacity-30 -z-10"
        animate={{ 
          scale: [1, 1.15, 1],
          opacity: [0.3, 0.4, 0.3],
        }}
        transition={{ 
          duration: 10, 
          repeat: Infinity,
          repeatType: "reverse",
          delay: 2
        }}
      />
      
      <div className="container mx-auto px-4">
        <motion.div 
          ref={ref}
          className="max-w-5xl mx-auto text-center"
          initial="hidden"
          animate={controls}
          variants={container}
        >
          {/* Badge d'introduction animé */}
          <motion.div 
            variants={item}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2.5 mb-8 shadow-lg hover:bg-white/15 transition-colors cursor-default"
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="w-4 h-4 text-[#ff7f50] animate-pulse" />
            <span className="text-white/95 text-sm font-semibold tracking-wide">
              Fabrique de marques africaines
            </span>
          </motion.div>
          
          {/* Titre principal - optimisé pour impact maximum */}
          <motion.h1 
            variants={item}
            className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.1] mb-6"
          >
            Transformez votre marque africaine en{' '}
            <span className="relative inline-block">
              <span className="relative z-10 text-[#ff7f50]">success story</span>
              <motion.span
                className="absolute bottom-2 left-0 w-full h-3 bg-[#ff7f50]/30 -z-10"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.8, delay: 1.2 }}
              ></motion.span>
            </span>
            {' '}<br/>e-commerce
          </motion.h1>
          
          {/* Sous-titre - proposition de valeur claire */}
          <motion.p 
            variants={item}
            className="text-lg md:text-xl lg:text-2xl text-white/90 mb-6 max-w-4xl mx-auto leading-relaxed font-light"
          >
            Nous créons nos propres marques et mettons 
            notre expertise au service des marques africaines qui veulent vendre plus, vendre mieux, 
            et vendre partout.
          </motion.p>
          
          {/* Boutons d'action - CTA optimisés */}
          <motion.div 
            variants={item}
            className="flex flex-col sm:flex-row justify-center gap-4 mb-12"
          >
            <motion.div
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link 
                href="/nos-formules" 
                className="group relative inline-flex items-center justify-center bg-[#ff7f50] hover:bg-[#ff6b3d] text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-2xl hover:shadow-[#ff7f50]/50 overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  Découvrir nos offres
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#ff6b3d] to-[#ff7f50] opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Link>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <a 
                href="https://calendly.com/tekki-studio/consultation-gratuite" 
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center bg-white/10 backdrop-blur-md hover:bg-white/20 border-2 border-white/40 hover:border-white/60 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg"
              >
                Réserver un appel gratuit
              </a>
            </motion.div>
          </motion.div>
          
          {/* Trust signals - badges de confiance */}
          <motion.div 
            variants={item}
            className="flex flex-wrap justify-center gap-6 md:gap-8 text-sm"
          >
            <motion.div 
              className="flex items-center text-white/90"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center mr-2.5 border border-emerald-400/30">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
              </div>
              <span className="font-medium">Basés à Dakar, Sénégal</span>
            </motion.div>
            
            <motion.div 
              className="flex items-center text-white/90"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center mr-2.5 border border-emerald-400/30">
                <TrendingUp className="h-4 w-4 text-emerald-400" />
              </div>
              <span className="font-medium">Stratégies testées sur nos marques</span>
            </motion.div>
            
            <motion.div 
              className="flex items-center text-white/90"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center mr-2.5 border border-emerald-400/30">
                <Globe className="h-4 w-4 text-emerald-400" />
              </div>
              <span className="font-medium">Clients en Afrique & diaspora</span>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Statistiques en bas - Preuve sociale chiffrée */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={statsContainer}
        className="mt-20 border-t border-white/10 pt-12 backdrop-blur-sm"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-5xl mx-auto">
            <motion.div 
              className="text-center group"
              variants={statItem}
              whileHover={{ scale: 1.05 }}
            >
              <div className="mb-3">
                <motion.p 
                  className="text-4xl md:text-5xl font-bold text-white mb-1"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.9 }}
                >
                  2
                </motion.p>
                <div className="w-12 h-1 bg-[#ff7f50] mx-auto rounded-full group-hover:w-16 transition-all"></div>
              </div>
              <p className="text-sm text-white/70 font-medium">Marques créées</p>
            </motion.div>
            
            <motion.div 
              className="text-center group"
              variants={statItem}
              whileHover={{ scale: 1.05 }}
            >
              <div className="mb-3">
                <motion.p 
                  className="text-4xl md:text-5xl font-bold text-white mb-1"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 1.0 }}
                >
                  +8 000
                </motion.p>
                <div className="w-12 h-1 bg-[#ff7f50] mx-auto rounded-full group-hover:w-16 transition-all"></div>
              </div>
              <p className="text-sm text-white/70 font-medium">Produits vendus</p>
            </motion.div>
            
            <motion.div 
              className="text-center group"
              variants={statItem}
              whileHover={{ scale: 1.05 }}
            >
              <div className="mb-3">
                <motion.p 
                  className="text-4xl md:text-5xl font-bold text-white mb-1"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 1.1 }}
                >
                  7
                </motion.p>
                <div className="w-12 h-1 bg-[#ff7f50] mx-auto rounded-full group-hover:w-16 transition-all"></div>
              </div>
              <p className="text-sm text-white/70 font-medium">Marques accompagnées</p>
            </motion.div>
            
            <motion.div 
              className="text-center group"
              variants={statItem}
              whileHover={{ scale: 1.05 }}
            >
              <div className="mb-3">
                <motion.p 
                  className="text-4xl md:text-5xl font-bold text-white mb-1"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                >
                  4
                </motion.p>
                <div className="w-12 h-1 bg-[#ff7f50] mx-auto rounded-full group-hover:w-16 transition-all"></div>
              </div>
              <p className="text-sm text-white/70 font-medium">Marchés couverts</p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;