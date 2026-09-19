// app/components/home/v2/PortfolioSection.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowUpRight, ArrowRight } from 'lucide-react';

// hasDetail: false pour les marques sans page /cas-clients/[slug] encore rédigée —
// le lien retombe alors sur la liste plutôt que sur une page vide.
const projects = [
  {
    name: 'Momo Le Bottier',
    category: 'Maroquinerie',
    slug: 'momo-le-bottier',
    image: '/images/portfolio/momolebottier.png',
    hasDetail: true,
  },
  {
    name: 'Abarings',
    category: 'Bijouterie',
    slug: 'abarings',
    image: '/images/portfolio/abarings.png',
    hasDetail: true,
  },
  {
    name: '6C No Filter',
    category: 'Cosmétiques',
    slug: '6c-no-filter',
    image: '/images/portfolio/6cnofilter.png',
    hasDetail: true,
  },
  {
    name: 'Ahovi Cosmetics',
    category: 'Beauté',
    slug: 'ahovi-cosmetics',
    image: '/images/portfolio/ahovi.png',
    hasDetail: false,
  },
  {
    name: 'Amani',
    category: 'Santé & Bien-être',
    slug: 'amani',
    image: '/images/portfolio/amani.png',
    hasDetail: false,
  },
  {
    name: 'Viens On S\'Connaît',
    category: 'Jeux & Divertissement',
    slug: 'viens-on-sconnait',
    image: '/images/portfolio/vosc.png',
    hasDetail: false,
  },
];

const PortfolioSection = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section className="py-16 md:py-24 bg-tekki-surface">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-[600px] mb-12"
        >
          <h2 className="font-home-display text-[30px] font-semibold text-tekki-ink tracking-tight mb-3.5">
            Les marques qu&apos;on a accompagnées.
          </h2>
          <p className="font-home-body text-[16px] text-tekki-ink-soft">
            De vraies boutiques en ligne, de vraies ventes, de vraies fondatrices.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {projects.map((project, index) => (
            <motion.div
              key={project.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                href={project.hasDetail ? `/cas-clients/${project.slug}` : '/cas-clients'}
                className="group relative block aspect-[4/5] rounded-2xl overflow-hidden bg-tekki-surface"
              >
                <Image
                  src={project.image}
                  alt={project.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  loading="lazy"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-tekki-ink/80 via-tekki-ink/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

                {/* Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <span className="font-home-body text-tekki-orange text-xs font-semibold mb-1.5 tracking-wider uppercase">
                    {project.category}
                  </span>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-home-display font-semibold text-white">
                      {project.name}
                    </h3>
                    <div className="w-9 h-9 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300">
                      <ArrowUpRight size={18} />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center"
        >
          <Link
            href="/cas-clients"
            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-tekki-ink/15 text-tekki-ink rounded-full font-home-body font-semibold text-sm hover:border-tekki-orange hover:text-tekki-orange transition-all duration-300"
          >
            Voir toutes nos réalisations
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default PortfolioSection;
