// app/components/home/AcquisitionOptions.tsx avec animations
'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ShoppingBag, 
  Rocket, 
  CheckCircle, 
  ArrowRight 
} from 'lucide-react';
import * as framerMotion from 'framer-motion';
const { motion, useAnimation } = framerMotion;
import { useInView } from 'react-intersection-observer';

const AcquisitionOptions = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const titleVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" }
    }
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };
  
  const cardVariant = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };
  
  const listItemVariant = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <section className="py-20 bg-white overflow-hidden relative">
      {/* Grille décorative en arrière-plan */}
      <div className="absolute inset-0 opacity-5">
        <div className="grid grid-cols-12 h-full">
          {[...Array(48)].map((_, i) => (
            <div key={i} className="border border-gray-400" />
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial="hidden"
          animate="visible"
          variants={titleVariants}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#0f4c81] mb-4">
            Deux façons d'acquérir votre business
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choisissez l'option qui correspond le mieux à votre situation et à vos objectifs
          </p>
        </motion.div>
        
        <motion.div 
          ref={ref}
          className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto"
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={containerVariants}
        >
          {/* Option standard */}
          <motion.div 
            className="bg-white rounded-xl shadow-xl p-8 border border-gray-100 hover:border-[#0f4c81] transition-all relative overflow-hidden"
            variants={cardVariant}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#0f4c81]/5 rounded-bl-full -z-1"></div>
            
            <div className="flex items-start mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <ShoppingBag className="w-8 h-8 text-[#0f4c81]" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-[#0f4c81] mb-1">Acquisition Complète</h3>
                <p className="text-gray-500">Transfert immédiat et complet</p>
              </div>
            </div>
            
            <p className="text-gray-600 mb-6">
              Pour ceux qui souhaitent un transfert immédiat et complet de la propriété du business,
              avec tous les éléments livrés en une seule fois.
            </p>
            
            <motion.ul 
              className="space-y-4 mb-8"
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              variants={containerVariants}
            >
              <motion.li 
                className="flex items-start"
                variants={listItemVariant}
              >
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                <span className="text-gray-700">Transfert immédiat de propriété</span>
              </motion.li>
              <motion.li 
                className="flex items-start"
                variants={listItemVariant}
              >
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                <span className="text-gray-700">Paiement en 1 à 3 fois après signature du contrat d'acquisition</span>
              </motion.li>
              <motion.li 
                className="flex items-start"
                variants={listItemVariant}
              >
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                <span className="text-gray-700">2 mois d'accompagnement inclus</span>
              </motion.li>
              <motion.li 
                className="flex items-start"
                variants={listItemVariant}
              >
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                <span className="text-gray-700">Tous les éléments du business livrés immédiatement</span>
              </motion.li>
            </motion.ul>
            
            <Link 
              href="/business"
              className="w-full bg-[#0f4c81] hover:bg-[#0a3c67] text-white py-3 rounded-lg flex items-center justify-center font-medium transition-colors"
            >
              Voir les business disponibles
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </motion.div>
          
          {/* Option progressive */}
          <motion.div 
            className="bg-white rounded-xl shadow-xl p-8 border border-gray-100 hover:border-[#ff7f50] transition-all relative overflow-hidden"
            variants={cardVariant}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <motion.div 
              className="absolute -right-6 top-6"
              initial={{ rotate: 45, x: 20 }}
              animate={{ rotate: 45, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <span className="bg-[#ff7f50] text-white px-12 py-1 block text-xs font-medium">
                NOUVEAU
              </span>
            </motion.div>
            
            <div className="absolute top-0 left-0 w-32 h-32 bg-[#ff7f50]/5 rounded-br-full -z-1"></div>
            
            <div className="flex items-start mb-6">
              <div className="w-16 h-16 bg-[#ff7f50]/20 rounded-full flex items-center justify-center mr-4">
                <Rocket className="w-8 h-8 text-[#ff7f50]" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-[#ff7f50] mb-1">Acquisition Progressive</h3>
                <p className="text-gray-500">Transfert progressif en 6 mois</p>
              </div>
            </div>
            
            <p className="text-gray-600 mb-6">
              Démarrez avec seulement 40% du prix total et versez le reste progressivement sur 6 mois
              pendant que vous développez déjà votre activité.
            </p>
            
            <motion.ul 
              className="space-y-4 mb-8"
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              variants={containerVariants}
            >
              <motion.li 
                className="flex items-start"
                variants={listItemVariant}
              >
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                <span className="text-gray-700">Transfert progressif de propriété</span>
              </motion.li>
              <motion.li 
                className="flex items-start"
                variants={listItemVariant}
              >
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                <span className="text-gray-700">Versements mensuels de 10% + frais pendant 6 mois</span>
              </motion.li>
              <motion.li 
                className="flex items-start"
                variants={listItemVariant}
              >
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                <span className="text-gray-700">2 mois d'accompagnement inclus</span>
              </motion.li>
              <motion.li 
                className="flex items-start"
                variants={listItemVariant}
              >
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                <span className="text-gray-700">Développez votre business pendant que vous payez</span>
              </motion.li>
            </motion.ul>
            
            <Link 
              href="/acquisition-options"
              className="w-full bg-[#ff7f50] hover:bg-[#ff6b3d] text-white py-3 rounded-lg flex items-center justify-center font-medium transition-colors"
            >
              En savoir plus sur ce modèle
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <Link 
            href="/business"
            className="inline-flex items-center text-[#0f4c81] font-medium hover:text-[#ff7f50] transition-colors"
          >
            Découvrir les business en vente
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default AcquisitionOptions;