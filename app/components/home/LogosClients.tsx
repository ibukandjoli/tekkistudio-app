// app/components/home/LogosClients.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const LogosClients = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  // Liste des marques - vous remplacerez avec vos vrais logos
  const brands = [
    { name: 'Momo Le Bottier', logo: '/images/clients/momo-le-bottier.png' },
    { name: 'Abarings', logo: '/images/clients/abarings.avif' },
    { name: '6C No Filter', logo: '/images/clients/6c-no-filter.webp' },
    { name: 'Racines Précieuses', logo: '/images/clients/racines-precieuses.avif' },
    { name: 'Ahovi Beauty Cosmetics', logo: '/images/clients/ahovi-beauty.png' },
    { name: 'VIENS ON S\'CONNAÎT', logo: '/images/clients/viens-on-sconnait.png' },
    { name: 'AMANI', logo: '/images/clients/amani.svg' },
  ];

  // Dupliquer les logos pour un défilement infini fluide
  const duplicatedBrands = [...brands, ...brands];

  return (
    <section className="py-16 md:py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Titre principal */}
        <motion.div
          ref={ref}
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-2">
            Quelques-unes des marques que nous avons accompagnées
          </h2>
        </motion.div>

        {/* Carrousel infini */}
        <div className="relative mb-8">
          {/* Gradient gauche */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
          
          {/* Gradient droit */}
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

          {/* Container du carrousel */}
          <div className="overflow-hidden py-8">
            <motion.div
              className="flex gap-12 md:gap-16"
              animate={{
                x: [0, -1000 * (brands.length / 7)],
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
              {duplicatedBrands.map((brand, index) => (
                <motion.div
                  key={index}
                  className="flex-shrink-0 w-48 md:w-56 h-28 flex items-center justify-center group"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="relative w-full h-full bg-white rounded-xl flex items-center justify-center p-6">
                    {/* Placeholder pour le logo - À remplacer par vos vrais logos
                    <div className="text-center">
                      <div className="text-3xl font-bold text-[#0f4c81] opacity-20 group-hover:opacity-30 transition-opacity mb-1">
                        {brand.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="text-xs text-gray-500 font-medium group-hover:text-[#ff7f50] transition-colors">
                        {brand.name}
                      </div>
                    </div>
                    */}

                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="max-w-full max-h-full object-contain grayscale opacity-75 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                    />

                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Citation témoignage 
        <motion.div
          className="text-center max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <blockquote className="text-2xl md:text-3xl lg:text-4xl font-normal text-gray-900 leading-relaxed mb-6">
            "Travailler avec <span className="text-[#0f4c81] font-semibold">TEKKI Studio</span>, c'est comme découvrir que vous rouliez avec le{' '}
            <span className="text-[#0f4c81] font-semibold">frein à main</span>."
          </blockquote>
          <p className="text-gray-600 text-lg">
            - Une marque agréablement surprise.
          </p>
        </motion.div>
        */}
      </div>
    </section>
  );
};

export default LogosClients;