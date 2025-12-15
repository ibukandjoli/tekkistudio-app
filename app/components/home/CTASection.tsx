// app/components/home/CTASection.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Calendar, CheckCircle2, Zap, Users, TrendingUp, Globe2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const CTASection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <section className="py-20 md:py-32 bg-gradient-to-br from-gray-900 via-[#0f4c81] to-gray-900 text-white relative overflow-hidden">
      {/* Animations décoratives */}
      <motion.div
        className="absolute -right-20 -top-20 w-[500px] h-[500px] bg-[#fe6117]/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />

      <motion.div
        className="absolute -left-20 -bottom-20 w-[400px] h-[400px] bg-[#fe6117]/15 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 2
        }}
      />

      {/* Pattern de fond subtil */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="w-full h-full" style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="w-full px-6 md:px-12 lg:px-16 xl:px-20 relative z-10">
        <motion.div
          ref={ref}
          className="max-w-5xl mx-auto text-center"
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={container}
        >
          {/* Badge avec sparkles */}
          <motion.div
            variants={item}
            className="inline-flex items-center gap-2 bg-[#fe6117]/10 border border-[#fe6117]/30 rounded-full px-5 py-2.5 mb-8 backdrop-blur-sm"
          >
            <Sparkles className="w-4 h-4 text-[#fe6117]" />
            <span className="text-white text-sm font-bold tracking-wide uppercase">
              Commencez votre transformation
            </span>
          </motion.div>

          {/* Titre principal */}
          <motion.h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight"
            variants={item}
          >
            Prêt à faire <span className="bg-gradient-to-r from-[#fe6117] to-[#ff8c4d] bg-clip-text text-transparent">rayonner</span> votre marque <br className="hidden md:block"/>
            au-delà de vos frontières ?
          </motion.h2>

          {/* Sous-titre */}
          <motion.p
            className="text-xl md:text-2xl mb-10 text-white/90 leading-relaxed max-w-3xl mx-auto"
            variants={item}
          >
            Rejoignez les marques africaines qui transforment leur ambition en <span className="font-bold text-white">résultats concrets</span>.
            Commencez par un diagnostic gratuit.
          </motion.p>

          {/* Statistiques en bannière */}
          <motion.div
            variants={item}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12"
          >
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 group">
              <div className="w-12 h-12 bg-[#fe6117]/20 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6 text-[#fe6117]" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">2</div>
              <div className="text-sm text-white/70">Marques créées</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 group">
              <div className="w-12 h-12 bg-[#fe6117]/20 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6 text-[#fe6117]" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">+8K</div>
              <div className="text-sm text-white/70">Produits vendus</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 group">
              <div className="w-12 h-12 bg-[#fe6117]/20 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-[#fe6117]" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">+10</div>
              <div className="text-sm text-white/70">Marques accompagnées</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 group">
              <div className="w-12 h-12 bg-[#fe6117]/20 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <Globe2 className="w-6 h-6 text-[#fe6117]" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">9</div>
              <div className="text-sm text-white/70">Pays atteints</div>
            </div>
          </motion.div>

          {/* Boutons CTA */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center mb-10"
            variants={item}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <a
                href="https://wa.me/221781362728?text=Bonjour%20TEKKI%20Studio%20!%20Je%20veux%20transformer%20ma%20marque%20et%20réserver%20mon%20diagnostic%20gratuit."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-[#fe6117] hover:bg-[#e55710] text-white px-10 py-5 rounded-full font-bold text-lg transition-all shadow-2xl hover:shadow-[#fe6117]/50"
              >
                <Calendar className="w-6 h-6 mr-3" />
                Mon diagnostic gratuit
              </a>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/nos-formules"
                className="inline-flex items-center justify-center bg-white/10 backdrop-blur-sm hover:bg-white/20 border-2 border-white/30 hover:border-white/50 text-white px-10 py-5 rounded-full font-bold text-lg transition-all"
              >
                Voir toutes les formules
                <ArrowRight className="w-6 h-6 ml-3" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            variants={item}
            className="flex flex-wrap justify-center gap-6 md:gap-8 text-sm text-white/90 mb-12"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span className="font-medium">Sans engagement</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span className="font-medium">Diagnostic gratuit (30 min)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span className="font-medium">Réponse sous 24h</span>
            </div>
          </motion.div>

          {/* Divider */}
          <motion.div
            variants={item}
            className="my-12 max-w-md mx-auto"
          >
            <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </motion.div>

          {/* Citation inspirante */}
          <motion.div
            variants={item}
            className="max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#fe6117] mb-6">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <blockquote className="text-2xl md:text-3xl font-light italic leading-relaxed text-white/95 mb-4">
              "Nous avons transformé nos propres marques en succès.
              Maintenant, c'est au tour de la vôtre de <span className="text-[#fe6117] font-semibold not-italic">briller</span>."
            </blockquote>
            <p className="text-white/70 font-medium">
              — Ibuka, Fondateur TEKKI Studio
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
