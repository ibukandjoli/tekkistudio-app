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
  Sparkles 
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
      icon: <Users className="w-7 h-7" />,
      title: "Entrepreneurs avant tout",
      description: "Nous créons, développons et gérons nos propres marques depuis l'Afrique. Nous comprenons vos défis quotidiens parce que nous les vivons nous-mêmes.",
      color: "from-blue-500 to-cyan-500",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600"
    },
    {
      icon: <TrendingUp className="w-7 h-7" />,
      title: "Expertise e-commerce prouvée",
      description: "+8 000 produits vendus, 7 marques africaines accompagnées, +50 sites e-commerce créés, des résultats mesurables et concrets à chaque projet.",
      color: "from-emerald-500 to-teal-500",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600"
    },
    {
      icon: <Globe2 className="w-7 h-7" />,
      title: "Focus marques africaines",
      description: "Nous connaissons les spécificités du marché africain et de la diaspora. Nos stratégies sont adaptées à votre réalité, pas copiées-collées de l'Occident.",
      color: "from-purple-500 to-pink-500",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600"
    },
    {
      icon: <Layers className="w-7 h-7" />,
      title: "Approche holistique",
      description: "De la stratégie au support client, nous gérons tous les aspects de votre croissance. Une équipe, une vision, des résultats.",
      color: "from-orange-500 to-red-500",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600"
    },
    {
      icon: <Eye className="w-7 h-7" />,
      title: "Transparence totale",
      description: "Reporting clair, accès à toutes vos données, aucun chiffre gonflé. Vous savez toujours où va votre investissement et quels résultats vous obtenez.",
      color: "from-rose-500 to-pink-500",
      iconBg: "bg-rose-100",
      iconColor: "text-rose-600"
    },
    {
      icon: <Heart className="w-7 h-7" />,
      title: "Accompagnement humain",
      description: "Une équipe dédiée disponible et à  l'écoute. Pas un simple prestataire qui disparaît après le projet, mais un vrai partenaire de croissance.",
      color: "from-indigo-500 to-purple-500",
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <section className="py-20 md:py-28 bg-[#fdfbf7] relative overflow-hidden">
      {/* Décoration */}
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
          <div className="inline-flex items-center gap-2 bg-[#0f4c81]/10 border border-[#0f4c81]/20 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-[#0f4c81]" />
            <span className="text-[#0f4c81] text-xs font-bold tracking-wider uppercase">
              Notre différence
            </span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold text-[#0f4c81] mb-4">
            Pourquoi choisir TEKKI Studio ?
          </h2>
          <p className="text-xl text-gray-600">
            Ce qui nous rend uniques dans l'écosystème des marques africaines
          </p>
        </motion.div>

        {/* Grille des différenciateurs */}
        <motion.div 
          ref={ref}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto mb-16"
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={containerVariants}
        >
          {differentiators.map((diff, index) => (
            <motion.div
              key={index}
              className="group bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl hover:border-[#ff7f50]/30 transition-all duration-300"
              variants={itemVariants}
              whileHover={{ y: -8 }}
            >
              {/* Icône */}
              <div className="mb-6">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${diff.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                  {diff.icon}
                </div>
              </div>

              {/* Contenu */}
              <h3 className="text-xl font-bold text-[#0f4c81] mb-3 group-hover:text-[#ff7f50] transition-colors">
                {diff.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {diff.description}
              </p>

              {/* Ligne décorative animée */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className={`w-0 h-1 bg-gradient-to-r ${diff.color} rounded-full group-hover:w-full transition-all duration-500`}></div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Bottom */}
        <motion.div
          className="max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <div className="bg-gradient-to-r from-[#0f4c81] to-[#1a5a8f] rounded-3xl p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
            {/* Décoration */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#ff7f50]/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <div className="text-center mb-8">
                <h3 className="text-2xl md:text-4xl font-bold mb-4">
                  Notre expertise à votre service
                </h3>
                <p className="text-white/90 text-lg max-w-3xl mx-auto leading-relaxed">
                  Avec 2 marques créées, +8 000 produits vendus et 7 marques africaines accompagnées, 
                  nous avons prouvé notre expertise dans le domaine du e-commerce africain.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center hover:bg-white/15 transition-colors">
                  <div className="text-4xl font-bold mb-2">2</div>
                  <div className="text-white/80 text-sm">Marques créées</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center hover:bg-white/15 transition-colors">
                  <div className="text-4xl font-bold mb-2">+8 000</div>
                  <div className="text-white/80 text-sm">Produits vendus</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center hover:bg-white/15 transition-colors">
                  <div className="text-4xl font-bold mb-2">7</div>
                  <div className="text-white/80 text-sm">Marques transformées</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <a
                    href="https://wa.me/221781362728?text=Bonjour%20TEKKI%20Studio%20!%20J%27aimerais%20découvrir%20comment%20vous%20pouvez%20m%27aider%20à %20faire%20grandir%20ma%20marque."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center bg-[#ff7f50] hover:bg-[#ff6b3d] text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-xl"
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
                    className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all"
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