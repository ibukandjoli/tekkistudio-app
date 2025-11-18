// app/components/home/CTASection.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Calendar, CheckCircle2, Zap } from 'lucide-react';
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
        staggerChildren: 0.15,
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
    <section className="py-20 md:py-28 bg-gradient-to-br from-[#042b65] via-[#0f4c81] to-[#1a5a8f] text-white relative overflow-hidden">
      
      {/* Animations décoratives */}
      <motion.div 
        className="absolute -right-20 -top-20 w-[500px] h-[500px] bg-[#ff7f50]/20 rounded-full blur-3xl"
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
        className="absolute -left-20 -bottom-20 w-[400px] h-[400px] bg-[#ff7f50]/15 rounded-full blur-3xl"
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
      <div className="absolute inset-0 opacity-5">
        <div className="grid grid-cols-12 h-full">
          {[...Array(60)].map((_, i) => (
            <div key={i} className="border border-white/30" />
          ))}
        </div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
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
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2.5 mb-8"
          >
            <Sparkles className="w-4 h-4 text-[#ff7f50]" />
            <span className="text-white/95 text-sm font-bold tracking-wide">
              COMMENCEZ VOTRE TRANSFORMATION
            </span>
          </motion.div>

          {/* Titre principal */}
          <motion.h2 
            className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
            variants={item}
          >
            Prêt à faire rayonner votre marque au-delà de vos frontières ?
          </motion.h2>
          
          {/* Sous-titre */}
          <motion.p 
            className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto leading-relaxed"
            variants={item}
          >
            Rejoignez les marques africaines qui transforment leur ambition en résultats concrets. 
            Commencez par un diagnostic gratuit.
          </motion.p>

          {/* Statistiques en bannière */}
          <motion.div
            variants={item}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-10 max-w-4xl mx-auto"
          >
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 hover:bg-white/15 transition-colors">
              <div className="text-3xl md:text-4xl font-bold text-[#ff7f50] mb-1">2</div>
              <div className="text-sm text-white/80">Marques créées</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 hover:bg-white/15 transition-colors">
              <div className="text-3xl md:text-4xl font-bold text-[#ff7f50] mb-1">+8 000</div>
              <div className="text-sm text-white/80">Produits vendus</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 hover:bg-white/15 transition-colors">
              <div className="text-3xl md:text-4xl font-bold text-[#ff7f50] mb-1">7</div>
              <div className="text-sm text-white/80">Marques accompagnées</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 hover:bg-white/15 transition-colors">
              <div className="text-3xl md:text-4xl font-bold text-[#ff7f50] mb-1">4</div>
              <div className="text-sm text-white/80">Marchés couverts</div>
            </div>
          </motion.div>
          
          {/* Boutons CTA */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center mb-10"
            variants={item}
          >
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <a
                href="https://wa.me/221781362728?text=Bonjour%20TEKKI%20Studio%20!%20Je%20veux%20transformer%20ma%20marque%20et%20réserver%20mon%20diagnostic%20gratuit."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-[#ff7f50] hover:bg-[#ff6b3d] text-white px-8 py-4 md:px-10 md:py-5 rounded-xl font-bold text-lg transition-all shadow-2xl hover:shadow-[#ff7f50]/50"
              >
                <Calendar className="w-6 h-6 mr-3" />
                Réserver mon diagnostic gratuit
              </a>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href="/nos-formules"
                className="inline-flex items-center justify-center bg-white/10 backdrop-blur-sm hover:bg-white/20 border-2 border-white/30 hover:border-white/50 text-white px-8 py-4 md:px-10 md:py-5 rounded-xl font-bold text-lg transition-all"
              >
                Voir toutes les offres
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
              <div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center border border-emerald-400/30">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="font-medium">Sans engagement</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center border border-emerald-400/30">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="font-medium">Diagnostic gratuit (30 min)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center border border-emerald-400/30">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="font-medium">Réponse sous 24h</span>
            </div>
          </motion.div>

          {/* Divider */}
          <motion.div 
            variants={item}
            className="my-12 max-w-md mx-auto"
          >
            <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          </motion.div>

          {/* Citation inspirante */}
          <motion.div
            variants={item}
            className="max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#ff7f50]/20 border-2 border-[#ff7f50]/30 mb-6">
              <Zap className="w-8 h-8 text-[#ff7f50]" />
            </div>
            <blockquote className="text-xl md:text-2xl font-light italic leading-relaxed text-white/90 mb-4">
              "Nous avons transformé nos propres marques en succès. 
              Maintenant, c'est au tour de la vôtre de briller."
            </blockquote>
            <p className="text-white/70 text-sm font-medium">
              — Ibuka, Fondateur TEKKI Studio
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;