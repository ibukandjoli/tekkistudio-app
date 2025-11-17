// app/components/home/WhyUs.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Lightbulb,
  Target,
  Users,
  TrendingUp,
  Shield,
  Heart,
  ArrowRight
} from 'lucide-react';
import * as framerMotion from 'framer-motion';
const { motion } = framerMotion;
import { useInView } from 'react-intersection-observer';

const WhyTekkiStudio = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const reasons = [
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: "Entrepreneurs avant tout",
      description: "Nous avons créé, lancé et fait grandir nos propres marques. Nous connaissons vos défis de l'intérieur, pas de la théorie."
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Stratégies testées et validées",
      description: "Chaque recommandation vient de notre expérience réelle. 140M FCFA de CA généré avec nos marques prouve que ça marche."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Expertise sectorielle pointue",
      description: "Spécialisés dans le bien-être et les accessoires, nous connaissons votre marché, vos clients et vos concurrents."
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Résultats mesurables garantis",
      description: "Nous ne vendons pas du rêve. Objectifs clairs, métriques précises, garanties concrètes sur chaque formule."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Accompagnement jusqu'au succès",
      description: "De la conception à la croissance, nous restons à vos côtés. Votre succès est notre seul KPI qui compte."
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Passion pour l'Afrique",
      description: "Notre mission : faire rayonner les marques africaines au-delà des frontières. Chaque projet est une fierté."
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
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-[#0f4c81] mb-4">
            Pourquoi nous sommes différents
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Nous ne sommes pas une agence classique. Nous sommes des entrepreneurs 
            qui partagent ce qui a marché pour eux.
          </p>
        </motion.div>

        {/* Grille des raisons */}
        <motion.div 
          ref={ref}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={containerVariants}
        >
          {reasons.map((reason, index) => (
            <motion.div
              key={index}
              className="bg-white p-8 rounded-xl shadow-md border border-gray-100 hover:border-[#ff7f50] hover:shadow-xl transition-all duration-300 group"
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-[#0f4c81]/10 to-[#ff7f50]/10 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <div className="text-[#0f4c81] group-hover:text-[#ff7f50] transition-colors">
                  {reason.icon}
                </div>
              </div>
              <h3 className="text-xl font-bold text-[#0f4c81] mb-3 group-hover:text-[#ff7f50] transition-colors">
                {reason.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {reason.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Section expertise avec chiffres */}
        <motion.div 
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0f4c81] to-[#1a5a8f] shadow-2xl p-8 md:p-12 max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          {/* Pattern en arrière-plan */}
          <div className="absolute inset-0 opacity-10">
            <div className="grid grid-cols-8 h-full">
              {[...Array(32)].map((_, i) => (
                <div key={i} className="border border-white/20" />
              ))}
            </div>
          </div>
          
          <div className="relative z-10 text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Notre expertise à votre service
            </h3>
            <p className="text-white/90 text-lg max-w-3xl mx-auto mb-10">
              Avec 2 marques créées, 50+ marques accompagnées et 200+ entrepreneurs formés, 
              nous avons prouvé notre expertise dans le domaine de l'e-commerce africain.
            </p>

            <div className="grid md:grid-cols-4 gap-6 mb-10">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="text-4xl font-bold text-white mb-2">2</div>
                <div className="text-white/80 text-sm">Marques créées et développées</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="text-4xl font-bold text-white mb-2">140M+</div>
                <div className="text-white/80 text-sm">FCFA de CA généré</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="text-4xl font-bold text-white mb-2">50+</div>
                <div className="text-white/80 text-sm">Marques accompagnées</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="text-4xl font-bold text-white mb-2">200+</div>
                <div className="text-white/80 text-sm">Entrepreneurs formés</div>
              </div>
            </div>

            <Link 
              href="/equipe"
              className="inline-flex items-center bg-[#ff7f50] hover:bg-[#ff6b3d] text-white px-8 py-4 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl"
            >
              Rencontrer l'équipe
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyTekkiStudio;