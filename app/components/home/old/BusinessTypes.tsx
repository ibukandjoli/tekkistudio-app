// app/components/home/BusinessTypes.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle, ShoppingBag, Zap } from 'lucide-react';
import { formatPrice } from '@/app/lib/utils/price-utils';
import useCountryStore from '@/app/hooks/useCountryStore';
import * as framerMotion from 'framer-motion';
const { motion, useAnimation } = framerMotion;
import { useInView } from 'react-intersection-observer';

const BusinessTypes = () => {
  const { currentCountry } = useCountryStore();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.1
      }
    }
  };
  
  const titleVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" }
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
  
  return (
    <section id="business-types" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={titleVariants}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#0f4c81] mb-4">
            Types de business
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choisissez le modèle qui correspond le mieux à votre budget et vos objectifs
          </p>
        </motion.div>

        <motion.div 
          ref={ref}
          className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto"
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={container}
        >
          {/* Business E-commerce */}
          <motion.div 
            className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 hover:border-[#0f4c81] transition-colors"
            variants={cardVariant}
            whileHover={{ y: -5, transition: { duration: 0.3 } }}
          >
            <div className="flex items-start mb-6">
              <div className="bg-[#0f4c81]/10 p-4 rounded-2xl mr-4">
                <ShoppingBag className="w-8 h-8 text-[#0f4c81]" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-[#0f4c81] mb-2">Business E-commerce</h3>
                <p className="text-gray-500">Des boutiques en ligne complètes + produits sourcés</p>
              </div>
            </div>

            <p className="text-gray-600 mb-6">
              Des boutiques en ligne complètes avec produits physiques, fournisseurs établis et stratégies marketing complètes.
            </p>
            
            <div className="bg-gray-50 p-6 rounded-xl mb-6">
              <h4 className="font-medium text-[#0f4c81] mb-4">Idéal pour vous si :</h4>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <span>Vous aimez vendre des produits physiques</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <span>Vous avez les moyens d'acheter du stock</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <span>Vous ne craignez pas de gérer la logistique</span>
                </li>
              </ul>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="text-center p-4 bg-[#0f4c81]/5 rounded-lg">
                <p className="font-medium text-[#0f4c81]">À partir de</p>
                <p className="text-2xl font-bold text-[#0f4c81]">{formatPrice(378000)}</p>
              </div>
              <div className="text-center p-4 bg-[#0f4c81]/5 rounded-lg">
                <p className="font-medium text-[#0f4c81]">Marge potentielle</p>
                <p className="text-2xl font-bold text-[#ff7f50]">30 à 45%</p>
              </div>
            </div>
            
            <Link 
              href="/business?filter=physical"
              className="w-full bg-[#0f4c81] hover:bg-[#0a3c67] text-white py-3 rounded-lg flex items-center justify-center font-medium transition-colors"
            >
              Voir les business e-commerce
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </motion.div>
          
          {/* Business Digitaux */}
          <motion.div 
            className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 hover:border-[#ff7f50] transition-colors relative"
            variants={cardVariant}
            whileHover={{ y: -5, transition: { duration: 0.3 } }}
          >
            <div className="absolute -right-3 top-8">
              <motion.span 
                className="bg-blue-500 text-white px-3 py-1 text-sm font-medium rounded-full"
                initial={{ rotate: 12 }}
                animate={{ rotate: [12, 8, 12] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                NOUVEAU
              </motion.span>
            </div>
            
            <div className="flex items-start mb-6">
              <div className="bg-[#ff7f50]/10 p-4 rounded-2xl mr-4">
                <Zap className="w-8 h-8 text-[#ff7f50]" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-[#0f4c81] mb-2">Business Digitaux</h3>
                <p className="text-gray-500">Des solutions 100% en ligne sans gestion de stock</p>
              </div>
            </div>

            <p className="text-gray-600 mb-6">
              Des applications web/mobile, microSaaS et plateformes de contenu 100% en ligne qui nécessitent 0 stock, 0 logistique.
            </p>
            
            <div className="bg-gray-50 p-6 rounded-xl mb-6">
              <h4 className="font-medium text-[#0f4c81] mb-4">Idéal pour vous si :</h4>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <span>Vous préférez les business 100% digitaux</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <span>Vous souhaitez démarrer rapidement</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <span>Vous souhaitez opérer depuis n'importe où</span>
                </li>
              </ul>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="text-center p-4 bg-[#ff7f50]/5 rounded-lg">
                <p className="font-medium text-[#0f4c81]">À partir de</p>
                <p className="text-2xl font-bold text-[#0f4c81]">{formatPrice(800000)}</p>
              </div>
              <div className="text-center p-4 bg-[#ff7f50]/5 rounded-lg">
                <p className="font-medium text-[#0f4c81]">Marge potentielle</p>
                <p className="text-2xl font-bold text-[#ff7f50]">70 à 90%</p>
              </div>
            </div>
            
            <Link 
              href="/business?filter=digital"
              className="w-full bg-[#ff7f50] hover:bg-[#ff6b3d] text-white py-3 rounded-lg flex items-center justify-center font-medium transition-colors"
            >
              Voir les business digitaux
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <Link 
            href="/comparatif-acquisition"
            className="inline-flex items-center text-[#0f4c81] font-medium hover:text-[#ff7f50]"
          >
            Comparer les deux modèles en détail
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default BusinessTypes;