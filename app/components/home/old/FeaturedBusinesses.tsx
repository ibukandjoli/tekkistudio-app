// app/components/home/FeaturedBusinesses.tsx 
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { getAvailableBusinesses } from '../../lib/db';
import type { Business } from '../../types/database';
import { formatPrice } from '../../lib/utils/price-utils';
import * as framerMotion from 'framer-motion';
const { motion, useAnimation } = framerMotion;
import { useInView } from 'react-intersection-observer';

const FeaturedBusinesses = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(0);
  const businessesPerPage = 3;
  
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const data = await getAvailableBusinesses();
        setBusinesses(data);
      } catch (error) {
        console.error('Erreur lors du chargement des business:', error);
        setError('Une erreur est survenue lors du chargement des données.');
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, []);

  // Calculer le prix d'entrée (40% du prix total)
  const calculateEntryPrice = (price: number) => {
    return Math.round(price * 0.4);
  };

  // Filtrer les business selon l'onglet actif
  const filteredBusinesses = activeTab === 'all' 
    ? businesses
    : businesses.filter(business => business.type === activeTab);

  // Obtenir les business pour la page courante
  const getCurrentPageBusinesses = () => {
    const startIndex = currentPage * businessesPerPage;
    return filteredBusinesses.slice(startIndex, startIndex + businessesPerPage);
  };

  // Calculer le nombre total de pages
  const pageCount = Math.ceil(filteredBusinesses.length / businessesPerPage);

  // Naviguer entre les pages
  const goToNextPage = () => {
    if (currentPage < pageCount - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
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
  
  const tabsVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, delay: 0.3 }
    }
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.4
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
  
  const ctaVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, delay: 0.6 }
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0f4c81] mb-4">
              Business en vedette
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Un instant pendant que nous chargeons nos business disponibles...
            </p>
          </div>
          <div className="flex justify-center">
            <motion.div 
              className="w-12 h-12 rounded-full border-4 border-[#ff7f50] border-t-transparent"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            ></motion.div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <div className="text-red-600">{error}</div>
        </div>
      </section>
    );
  }
  
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-10"
          initial="hidden"
          animate="visible"
          variants={titleVariants}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#0f4c81] mb-4">
            Business en vedette
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez nos meilleures opportunités prêtes à être reprises et développées
          </p>
        </motion.div>
        
        {/* Onglets de filtrage */}
        <motion.div 
          className="flex justify-center mb-10"
          initial="hidden"
          animate="visible"
          variants={tabsVariants}
        >
          <div className="inline-flex bg-white rounded-full shadow-md p-1.5">
            <button 
              onClick={() => {setActiveTab('all'); setCurrentPage(0);}}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-colors ${
                activeTab === 'all' 
                  ? 'bg-[#0f4c81] text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Tous les business
            </button>
            <button 
              onClick={() => {setActiveTab('physical'); setCurrentPage(0);}}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-colors ${
                activeTab === 'physical' 
                  ? 'bg-[#0f4c81] text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              E-commerce
            </button>
            <button 
              onClick={() => {setActiveTab('digital'); setCurrentPage(0);}}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-colors ${
                activeTab === 'digital' 
                  ? 'bg-[#0f4c81] text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              100% Digitaux
            </button>
          </div>
        </motion.div>
        
        {/* Grille des business */}
        {getCurrentPageBusinesses().length > 0 ? (
          <>
            <motion.div 
              ref={ref}
              className="grid md:grid-cols-3 gap-8"
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              variants={containerVariants}
            >
              {getCurrentPageBusinesses().map((business, index) => (
                <motion.div 
                  key={business.id} 
                  className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl hover:border-gray-200 transition-all group"
                  variants={itemVariants}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <div className="aspect-video relative overflow-hidden">
                    <img 
                      src={business.images[0]?.src || '/placeholder-business.jpg'} 
                      alt={business.images[0]?.alt || business.name}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                      <span className="px-3 py-1 rounded-full text-xs text-white font-medium bg-green-500">
                        Disponible
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs text-white font-medium ${
                        business.type === 'digital' ? 'bg-blue-500' : 'bg-[#ff7f50]'
                      }`}>
                        {business.type === 'digital' ? 'Digital' : 'E-commerce'}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-[#0f4c81] mb-2 group-hover:text-[#ff7f50] transition-colors">
                      {business.name}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {business.pitch}
                    </p>

                    <div className="space-y-4 mb-6">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600">Prix</span>
                        <div className="text-right">
                          <span className="font-bold text-[#0f4c81] block">
                            {formatPrice(business.price)}
                          </span>
                          <span className="text-sm text-gray-500">
                            ou à partir de {formatPrice(calculateEntryPrice(business.price))}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600">Potentiel mensuel</span>
                        <span className="font-bold text-[#ff7f50]">
                          {formatPrice(business.monthly_potential)}
                        </span>
                      </div>
                    </div>

                    <Link 
                      href={`/business/${business.slug}`}
                      className="w-full bg-[#ff7f50] text-white py-3 rounded-lg hover:bg-[#ff6b3d] transition-colors flex items-center justify-center font-medium"
                    >
                      Voir ce business
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Pagination */}
            {pageCount > 1 && (
              <motion.div 
                className="flex justify-center items-center mt-12 space-x-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <button 
                  onClick={goToPrevPage}
                  disabled={currentPage === 0}
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    currentPage === 0 
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                      : 'bg-white text-[#0f4c81] shadow-md hover:bg-gray-50'
                  }`}
                  aria-label="Page précédente"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <div className="text-gray-600">
                  Page {currentPage + 1} sur {pageCount}
                </div>
                
                <button 
                  onClick={goToNextPage}
                  disabled={currentPage >= pageCount - 1}
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    currentPage >= pageCount - 1 
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                      : 'bg-white text-[#0f4c81] shadow-md hover:bg-gray-50'
                  }`}
                  aria-label="Page suivante"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}
          </>
        ) : (
          <motion.div 
            className="text-center py-10 bg-white rounded-xl shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-gray-600 mb-4">Aucun business disponible dans cette catégorie pour le moment.</p>
            <p className="text-[#0f4c81]">Nous travaillons constamment sur de nouveaux business. Revenez bientôt !</p>
          </motion.div>
        )}
        
        {/* CTA pour voir plus */}
        <motion.div 
          className="mt-12 text-center"
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={ctaVariants}
        >
          <Link 
            href="/business"
            className="inline-flex items-center bg-[#0f4c81] text-white px-8 py-4 rounded-lg hover:bg-[#0a3c67] transition-colors font-medium"
          >
            Voir tous les business
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedBusinesses;