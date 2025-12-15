// app/components/home/Realisations.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const RealisationsSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const portfolio = [
    {
      name: "Momo Le Bottier",
      category: "Maroquinerie",
      url: "https://momolebottier.com",
      image: "/images/portfolio/momolebottier.png"
    },
    {
      name: "Abarings",
      category: "Bijouterie",
      url: "https://abarings.com",
      image: "/images/portfolio/abarings.png"
    },
    {
      name: "6C No Filter",
      category: "Cosmétiques",
      url: "https://6cnofilter.com",
      image: "/images/portfolio/6cnofilter.png"
    },
    {
      name: "Ahovi Cosmetics",
      category: "Beauté",
      url: "https://ahovi-cosmetics.myshopify.com",
      image: "/images/portfolio/ahovi.png"
    },
    {
      name: "Amani",
      category: "Santé & Bien-être",
      url: "https://amani-senegal.myshopify.com",
      image: "/images/portfolio/amani.png"
    },
    {
      name: "Viens On S'Connait",
      category: "Jeux & Divertissement",
      url: "https://viensonsconnait.com",
      image: "/images/portfolio/vosc.png"
    }
  ];

  return (
    <section className="py-20 md:py-28 bg-[#f5f3ed] relative overflow-hidden">
      <div className="w-full px-6 md:px-12 lg:px-16 xl:px-20">
        {/* En-tête */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="w-full flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#fe6117]/10 border border-[#fe6117]/20 rounded-full px-4 py-2 mb-6">
                <span className="text-[#fe6117] text-xs font-bold tracking-wider uppercase">
                  Portfolio
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
                Nos réalisations
              </h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-xl">
                Découvrez les marques africaines qui ont fait confiance à notre expertise et ont transformé leur présence en ligne.
              </p>
            </div>

            {/* Statistiques */}
            <div className="flex flex-wrap gap-6 md:gap-8">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-[#0f4c81] mb-1">+10</div>
                <div className="text-sm text-gray-600 font-medium">Marques accompagnées</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-[#0f4c81] mb-1">+8 000</div>
                <div className="text-sm text-gray-600 font-medium">Produits vendus</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-[#0f4c81] mb-1">3</div>
                <div className="text-sm text-gray-600 font-medium">Marchés couverts</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Grille de projets */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolio.map((site, index) => (
            <motion.a
              key={index}
              href={site.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              {/* Image de fond */}
              <div className="absolute inset-0 overflow-hidden">
                <Image
                  src={site.image}
                  alt={site.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {/* Overlay sombre pour meilleure lisibilité */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent group-hover:from-black/80 transition-all duration-300"></div>
              </div>

              {/* Contenu en overlay */}
              <div className="absolute inset-0 p-6 flex flex-col justify-between">
                {/* Nom du projet en haut */}
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 transform group-hover:translate-y-[-4px] transition-transform duration-300">
                    {site.name}
                  </h3>
                </div>

                {/* Badge catégorie et lien en bas */}
                <div className="space-y-3">
                  <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm text-white text-sm font-medium rounded-full border border-white/30">
                    {site.category}
                  </span>
                  <div className="flex items-center text-white/90 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span>Voir le site</span>
                    <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Effet hover - overlay subtil */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#fe6117]/0 to-[#fe6117]/0 group-hover:from-[#fe6117]/10 group-hover:to-transparent transition-all duration-300"></div>
            </motion.a>
          ))}
        </div>

        {/* CTA en bas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-12 text-center"
        >
          <a
            href="/nos-formules"
            className="inline-flex items-center justify-center bg-[#fe6117] hover:bg-[#e55710] text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-xl hover:shadow-2xl hover:scale-105"
          >
            Transformer ma marque
            <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default RealisationsSection;
