// app/components/home/WhyTekkiStudio.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import {
  Users,
  TrendingUp,
  Globe2,
  Layers,
  Eye,
  Heart,
  ArrowRight,
  Sparkles,
  CheckCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const WhyTekkiStudio = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const differentiators = [
    {
      number: "01",
      icon: <Users className="w-7 h-7" />,
      title: "Entrepreneurs avant tout",
      description: "Nous créons, développons et gérons nos propres marques depuis l'Afrique. Nous comprenons vos défis quotidiens parce que nous les vivons nous-mêmes.",
      color: "from-[#fe6117] to-[#ff8c4d]",
      highlight: "+2 marques créées"
    },
    {
      number: "02",
      icon: <TrendingUp className="w-7 h-7" />,
      title: "Expertise e-commerce prouvée",
      description: "+8 000 produits vendus, +10 marques africaines accompagnées, +50 sites e-commerce créés, des résultats mesurables et concrets à chaque projet.",
      color: "from-emerald-500 to-teal-500",
      highlight: "+8K produits vendus"
    },
    {
      number: "03",
      icon: <Globe2 className="w-7 h-7" />,
      title: "Focus marques africaines",
      description: "Nous connaissons les spécificités du marché africain et de la diaspora. Nos stratégies sont adaptées à votre réalité, pas copiées-collées de l'Occident.",
      color: "from-[#0f4c81] to-[#1a5a8f]",
      highlight: "100% marques africaines"
    },
    {
      number: "04",
      icon: <Layers className="w-7 h-7" />,
      title: "Approche holistique",
      description: "De la stratégie au support client, nous gérons tous les aspects de votre croissance. Une équipe, une vision, des résultats.",
      color: "from-purple-500 to-pink-500",
      highlight: "Solution complète A-Z"
    },
    {
      number: "05",
      icon: <Eye className="w-7 h-7" />,
      title: "Transparence totale",
      description: "Reporting clair, accès à toutes vos données, aucun chiffre gonflé. Vous savez toujours où va votre investissement et quels résultats vous obtenez.",
      color: "from-amber-500 to-orange-500",
      highlight: "Données 100% accessibles"
    },
    {
      number: "06",
      icon: <Heart className="w-7 h-7" />,
      title: "Accompagnement humain",
      description: "Une équipe dédiée disponible et à l'écoute. Pas un simple prestataire qui disparaît après le projet, mais un vrai partenaire de croissance.",
      color: "from-rose-500 to-pink-500",
      highlight: "Support 24/7"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
    <section className="py-20 md:py-32 bg-white relative overflow-hidden">
      {/* Décoration */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#fe6117]/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#0f4c81]/5 rounded-full blur-3xl"></div>

      <div className="w-full px-6 md:px-12 lg:px-16 xl:px-20 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-20 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 bg-[#fe6117]/10 border border-[#fe6117]/20 rounded-full px-5 py-2.5 mb-6">
            <Sparkles className="w-4 h-4 text-[#fe6117]" />
            <span className="text-[#fe6117] text-sm font-bold tracking-wide uppercase">
              Notre différence
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Pourquoi choisir <span className="text-[#fe6117]">TEKKI Studio</span> ?
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            <span className="font-semibold text-gray-900">6 raisons</span> qui font de nous le partenaire idéal pour accompagner votre marque.
          </p>
        </motion.div>

        {/* Grille des différenciateurs - 2 colonnes sur desktop */}
        <motion.div
          ref={ref}
          className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-20"
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={containerVariants}
        >
          {differentiators.map((diff, index) => (
            <motion.div
              key={index}
              className="group relative"
              variants={itemVariants}
            >
              {/* Numéro badge flottant */}
              <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-gradient-to-br from-[#fe6117] to-[#ff8c4d] flex items-center justify-center text-white font-bold text-lg shadow-xl z-10">
                {diff.number}
              </div>

              {/* Card */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-2xl hover:border-[#fe6117]/30 transition-all duration-500 h-full flex flex-col">
                {/* Icône avec gradient */}
                <div className="mb-6">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${diff.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                    {diff.icon}
                  </div>
                </div>

                {/* Titre */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#fe6117] transition-colors">
                  {diff.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed mb-6 flex-grow">
                  {diff.description}
                </p>

                {/* Séparateur */}
                <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-4"></div>

                {/* Highlight badge */}
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <span className="text-sm font-semibold text-emerald-600">{diff.highlight}</span>
                </div>

                {/* Ligne décorative animée en bas */}
                <div className="mt-6">
                  <div className={`h-1 bg-gradient-to-r ${diff.color} rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}></div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Section Stats + CTA combinée */}
        <motion.div
          className="max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <div className="bg-gradient-to-br from-gray-900 via-[#0f4c81] to-gray-900 rounded-3xl p-10 md:p-14 text-white shadow-2xl relative overflow-hidden">
            {/* Décoration */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#fe6117]/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>

            <div className="relative z-10">
              {/* Header */}
              <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#fe6117] mb-6">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl md:text-4xl font-bold mb-4">
                  Notre expertise à votre service
                </h3>
                <p className="text-white/90 text-lg leading-relaxed max-w-2xl mx-auto">
                  Avec 2 marques créées, +8 000 produits vendus et 10 marques africaines accompagnées,
                  nous avons <span className="font-bold text-white">prouvé notre expertise</span> dans l'e-commerce.
                </p>
              </div>

              {/* Stats grid */}
              <div className="grid md:grid-cols-4 gap-6 mb-10">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-all duration-300 group">
                  <div className="w-12 h-12 bg-[#fe6117]/20 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <Sparkles className="w-6 h-6 text-[#fe6117]" />
                  </div>
                  <div className="text-4xl font-bold mb-2">2</div>
                  <div className="text-white/70 text-sm">Marques créées</div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-all duration-300 group">
                  <div className="w-12 h-12 bg-[#fe6117]/20 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <TrendingUp className="w-6 h-6 text-[#fe6117]" />
                  </div>
                  <div className="text-4xl font-bold mb-2">+8K</div>
                  <div className="text-white/70 text-sm">Produits vendus</div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-all duration-300 group">
                  <div className="w-12 h-12 bg-[#fe6117]/20 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <Users className="w-6 h-6 text-[#fe6117]" />
                  </div>
                  <div className="text-4xl font-bold mb-2">+10</div>
                  <div className="text-white/70 text-sm">Marques accompagnées</div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-all duration-300 group">
                  <div className="w-12 h-12 bg-[#fe6117]/20 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <Globe2 className="w-6 h-6 text-[#fe6117]" />
                  </div>
                  <div className="text-4xl font-bold mb-2">9</div>
                  <div className="text-white/70 text-sm">Pays atteints</div>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <a
                    href="https://wa.me/221781362728?text=Bonjour%20TEKKI%20Studio%20!%20J%27aimerais%20découvrir%20comment%20vous%20pouvez%20m%27aider%20à%20faire%20grandir%20ma%20marque."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center bg-[#fe6117] hover:bg-[#e55710] text-white px-10 py-5 rounded-full font-bold text-lg transition-all shadow-xl hover:shadow-2xl"
                  >
                    Discutons de votre marque
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </a>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href="/nos-marques"
                    className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white px-10 py-5 rounded-full font-bold text-lg transition-all"
                  >
                    Voir nos marques
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyTekkiStudio;
