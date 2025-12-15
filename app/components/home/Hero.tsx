// app/components/home/Hero.tsx
'use client';

import React from 'react';
import { ArrowRight, Sparkles, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import * as framerMotion from 'framer-motion';
const { motion } = framerMotion;

const HeroSection = () => {
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

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.7, ease: "easeOut" }
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden bg-gradient-to-br from-gray-900 via-[#0f4c81] to-gray-900">
      {/* Arrière-plan décoratif - continuité avec Header */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#fe6117]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl"></div>
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
        backgroundSize: '50px 50px'
      }}></div>

      {/* Effets de lumière animés */}
      <motion.div
        className="absolute top-40 -right-20 w-[500px] h-[500px] bg-[#fe6117] rounded-full filter blur-[150px] opacity-10"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.15, 0.1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />

      <div className="w-full px-6 md:px-12 lg:px-16 xl:px-20 relative z-10 py-32 md:py-40 flex-grow">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Colonne gauche - Contenu */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="text-left"
          >
            {/* Badge */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2.5 mb-8"
            >
              <Sparkles className="w-4 h-4 text-[#fe6117]" />
              <span className="text-white/95 text-xs font-bold tracking-wide uppercase">
                La Fabrique de marques africaines
              </span>
            </motion.div>

            {/* Titre principal */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.1] mb-6"
            >
              Votre marque a du potentiel. Nous la transformons en{' '}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-[#fe6117] to-[#ff8c4d] bg-clip-text text-transparent">
                  succès e-commerce
                </span>
              </span>
              {' '}
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed max-w-2xl"
            >
              Nous avons vendu <span className="font-bold text-white">+8 000 produits</span> en 2 ans avec nos propres marques.
              A présent, nous appliquons ces stratégies aux <span className="font-bold text-white">marques africaines</span> qui veulent exploser leurs ventes en ligne.
            </motion.p>

            {/* Points clés */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-4 mb-8"
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span className="text-white/90 text-sm md:text-base">2 marques créées</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span className="text-white/90 text-sm md:text-base">+8 000 produits vendus</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span className="text-white/90 text-sm md:text-base">+10 marques accompagnées</span>
              </div>
            </motion.div>

            {/* CTAs */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                href="/nos-formules"
                className="group inline-flex items-center justify-center bg-[#fe6117] hover:bg-[#e55710] text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-2xl hover:shadow-[#fe6117]/50 hover:scale-105"
              >
                Découvrir nos offres
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>

              <a
                href="https://calendly.com/tekki-studio/consultation-gratuite"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-white/10 backdrop-blur-md hover:bg-white/20 border-2 border-white/30 hover:border-white/50 text-white px-8 py-4 rounded-full font-bold text-lg transition-all"
              >
                Réserver un appel gratuit
              </a>
            </motion.div>
          </motion.div>

          {/* Colonne droite - Visuals portfolio */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="hidden lg:block relative"
          >
            {/* Grille d'images portfolio */}
            <div className="grid grid-cols-2 gap-6">
              <motion.div
                variants={imageVariants}
                className="relative h-64 rounded-2xl overflow-hidden shadow-2xl group"
              >
                <img
                  src="/images/brands/amani-2.png"
                  alt="Amani"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 opacity-20 group-hover:opacity-10 transition-opacity"></div>
              </motion.div>

              <motion.div
                variants={imageVariants}
                transition={{ delay: 0.1 }}
                className="relative h-64 rounded-2xl overflow-hidden shadow-2xl group mt-8"
              >
                <img
                  src="/images/portfolio/6cnofilter.png"
                  alt="6C No Filter"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 opacity-20 group-hover:opacity-10 transition-opacity"></div>
              </motion.div>

              <motion.div
                variants={imageVariants}
                transition={{ delay: 0.2 }}
                className="relative h-64 rounded-2xl overflow-hidden shadow-2xl group"
              >
                <img
                  src="/images/brands/vosc.png"
                  alt="Viens On S'Connait"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 opacity-20 group-hover:opacity-10 transition-opacity"></div>
              </motion.div>

              <motion.div
                variants={imageVariants}
                transition={{ delay: 0.3 }}
                className="relative h-64 rounded-2xl overflow-hidden shadow-2xl group -mt-8"
              >
                <img
                  src="/images/portfolio/abarings.png"
                  alt="Abarings"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 opacity-20 group-hover:opacity-10 transition-opacity"></div>
              </motion.div>
            </div>

            {/* Badge de stats flottant */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-6 shadow-2xl"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#fe6117] to-[#ff8c4d] flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-[#0f4c81]">+8 000</p>
                  <p className="text-sm text-gray-600">Produits vendus</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Section logos clients - Pleine largeur avec défilement */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="w-full border-t border-white/10 bg-white/5 backdrop-blur-sm py-8 relative z-10 overflow-hidden"
      >
        <div className="w-full">
          <p className="text-white/80 text-sm font-bold uppercase tracking-wider text-center mb-6 px-6">
            Elles nous ont fait confiance
          </p>

          {/* Gradient gauche */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-gray-900 via-[#0f4c81]/80 to-transparent z-10 pointer-events-none"></div>

          {/* Gradient droit */}
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-gray-900 via-[#0f4c81]/80 to-transparent z-10 pointer-events-none"></div>

          {/* Carrousel de logos */}
          <motion.div
            className="flex gap-12 md:gap-16 items-center"
            animate={{
              x: [0, -1400],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 30,
                ease: "linear",
              },
            }}
          >
            {/* Dupliquer les logos pour un défilement infini */}
            {[
              { name: 'Momo Le Bottier', logo: '/images/clients/momo-le-bottier.png' },
              { name: 'Abarings', logo: '/images/clients/abarings.avif' },
              { name: '6C No Filter', logo: '/images/clients/6c-no-filter.webp' },
              { name: 'Racines Précieuses', logo: '/images/clients/racines-precieuses.avif' },
              { name: 'Ahovi Beauty Cosmetics', logo: '/images/clients/ahovi-beauty.png' },
              { name: 'VIENS ON S\'CONNAÎT', logo: '/images/clients/viens-on-sconnait.png' },
              { name: 'AMANI', logo: '/images/clients/amani.svg' },
              // Deuxième série pour le défilement infini
              { name: 'Momo Le Bottier', logo: '/images/clients/momo-le-bottier.png' },
              { name: 'Abarings', logo: '/images/clients/abarings.avif' },
              { name: '6C No Filter', logo: '/images/clients/6c-no-filter.webp' },
              { name: 'Racines Précieuses', logo: '/images/clients/racines-precieuses.avif' },
              { name: 'Ahovi Beauty Cosmetics', logo: '/images/clients/ahovi-beauty.png' },
              { name: 'VIENS ON S\'CONNAÎT', logo: '/images/clients/viens-on-sconnait.png' },
              { name: 'AMANI', logo: '/images/clients/amani.svg' },
            ].map((brand, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-32 md:w-40 h-16 flex items-center justify-center"
              >
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="max-w-full max-h-full object-contain brightness-0 invert opacity-70 hover:opacity-100 transition-opacity duration-300"
                />
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
