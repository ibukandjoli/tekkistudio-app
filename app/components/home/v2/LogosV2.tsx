// app/components/home/v2/LogosV2.tsx
'use client';

import { motion } from 'framer-motion';

const LogosV2 = () => {
  const brands = [
    { name: 'Momo Le Bottier', logo: '/images/clients/momo-le-bottier.png' },
    { name: 'Abarings', logo: '/images/clients/abarings.avif' },
    { name: '6C No Filter', logo: '/images/clients/6c-no-filter.webp' },
    { name: 'Racines Précieuses', logo: '/images/clients/racines-precieuses.avif' },
    { name: 'Ahovi Beauty Cosmetics', logo: '/images/clients/ahovi-beauty.png' },
    { name: 'VIENS ON S\'CONNAÎT', logo: '/images/clients/viens-on-sconnait.png' },
    { name: 'AMANI', logo: '/images/clients/amani.svg' },
  ];

  const duplicatedBrands = [...brands, ...brands];

  return (
    <section className="py-10 md:py-14 bg-tekki-surface overflow-hidden">
      <div className="w-full px-4 sm:px-6">
        <div className="text-center mb-8">
          <p className="text-sm font-medium text-tekki-blue/40 uppercase tracking-widest">
            Elles ont choisi TEKKI Studio
          </p>
        </div>

        <div className="relative">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-tekki-surface to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-tekki-surface to-transparent z-10 pointer-events-none" />

          <div className="flex overflow-hidden">
            <motion.div
              className="flex gap-14 md:gap-24 items-center whitespace-nowrap"
              animate={{
                x: [0, -140 * brands.length],
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: 'loop',
                  duration: 40,
                  ease: 'linear',
                },
              }}
            >
              {duplicatedBrands.map((brand, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 opacity-60 hover:opacity-100 transition-all duration-500"
                  style={{
                    filter: 'grayscale(100%) contrast(0.3) brightness(0.5)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.filter = 'grayscale(0%) contrast(1) brightness(1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.filter = 'grayscale(100%) contrast(0.3) brightness(0.5)';
                  }}
                >
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="h-8 w-auto object-contain"
                    loading="lazy"
                  />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LogosV2;
