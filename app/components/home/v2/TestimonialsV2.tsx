// app/components/home/v2/TestimonialsV2.tsx
'use client';

import { Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';

const TestimonialsV2 = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const testimonials = [
    {
      name: 'Fatou D.',
      role: 'Fondatrice',
      brand: 'Abarings',
      image: '/images/testimonials/fatou.jpg',
      text: "Avant TEKKI Studio, j'avais beaucoup de mal à gérer les commandes de mes bijoux, surtout celles venant de l'international. Grâce au site créé pour ma marque, tout est automatisé et je peux me concentrer sur la création.",
      rating: 5,
    },
    {
      name: 'Maguette D.',
      role: 'Fondateur',
      brand: 'Momo Le Bottier',
      image: '/images/testimonials/maguette.jpg',
      text: "TEKKI Studio a transformé notre marque avec un site professionnel qui dépasse nos attentes. Nos clients partout dans le monde peuvent désormais commander en ligne 24h/24 et être livrés. C'était notre objectif.",
      rating: 5,
    },
    {
      name: 'Fatou C.',
      role: 'Fondatrice',
      brand: '6C No Filter',
      image: '/images/testimonials/cisse.jpg',
      text: "L'équipe est extrêmement professionnelle et disponible. J'avais besoin d'un site professionnel pour ma marque de cosmétiques, ils ont livré un travail magnifique en moins de 10 jours. Je recommande à 100% !",
      rating: 5,
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-tekki-cream">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-tekki-blue tracking-tight mb-4">
            Ce que disent les fondatrices
            <br className="hidden md:block" /> qu&apos;on accompagne.
          </h2>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, index) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 25 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="bg-white border border-tekki-blue/8 rounded-2xl p-7 flex flex-col hover:shadow-lg hover:shadow-tekki-blue/5 transition-all duration-300"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-5">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-tekki-blue/65 leading-relaxed mb-7 flex-grow italic">
                &ldquo;{t.text}&rdquo;
              </blockquote>

              {/* Separator */}
              <div className="h-px bg-tekki-blue/8 mb-5" />

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 relative">
                  <Image src={t.image} alt={t.name} fill className="object-cover" />
                </div>
                <div>
                  <p className="font-semibold text-tekki-blue text-sm">{t.name}</p>
                  <p className="text-tekki-blue/40 text-xs">
                    {t.role}, {t.brand}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsV2;
