// app/components/home/Testimonials.tsx
'use client';

import React from 'react';
import { Star, Quote, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const Testimonials = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const testimonials = [
    {
      name: "Fatou D.",
      role: "Fondatrice",
      brand: "Abarings - Bijoux artisanaux",
      image: "/images/testimonials/fatou.jpg",
      text: "Avant TEKKI Studio, j'avais beaucoup de mal à gérer les commandes de mes bijoux, surtout celles venant de l'international. Grâce au site créé pour ma marque, tout est automatisé et je peux me concentrer sur la création.",
      result: "Boutique automatisée",
      rating: 5
    },
    {
      name: "Maguette D.",
      role: "Fondateur",
      brand: "Momo Le Bottier - Chaussures artisanales",
      image: "/images/testimonials/maguette.jpg",
      text: "TEKKI Studio a transformé notre marque avec un site professionnel qui dépasse nos attentes. Nos clients partout dans le monde peuvent désormais commander leurs chaussures et sacs et être livrés. C'était notre objectif.",
      result: "Ventes internationales",
      rating: 5
    },
    {
      name: "Fatou C.",
      role: "Fondatrice",
      brand: "6C No Filter - Cosmétiques naturels",
      image: "/images/testimonials/cisse.jpg",
      text: "L'équipe est extrêmement professionnelle et disponible. J'avais besoin d'un site professionnel pour ma marque de cosmétiques, ils ont livré un travail magnifique en moins de 10 jours. Je recommande à 100% !",
      result: "Site livré en 10 jours",
      rating: 5
    }
  ];

  // Dupliquer les témoignages pour créer un effet de loop infini
  const duplicatedTestimonials = [...testimonials, ...testimonials, ...testimonials];

  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-white via-amber-50/20 to-white overflow-hidden relative">
      {/* Décoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#fe6117]/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#0f4c81]/5 rounded-full blur-3xl"></div>

      <div className="w-full px-6 md:px-12 lg:px-16 xl:px-20 relative z-10">
        {/* Header */}
        <motion.div
          ref={ref}
          className="text-center mb-16 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 bg-[#fe6117]/10 border border-[#fe6117]/20 rounded-full px-5 py-2.5 mb-6">
            <Sparkles className="w-4 h-4 text-[#fe6117]" />
            <span className="text-[#fe6117] text-sm font-bold tracking-wide uppercase">
              Témoignages clients
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Ce que disent les entrepreneurs <br className="hidden md:block"/>
            qui nous font <span className="text-[#fe6117]">confiance</span>
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            Découvrez comment nous avons aidé des <span className="font-semibold text-gray-900">marques africaines</span> à vendre plus et mieux en ligne.
          </p>
        </motion.div>

        {/* Carousel infini */}
        <div className="relative mb-16">
          <div className="overflow-hidden">
            {/* Animation de défilement infini */}
            <motion.div
              className="flex gap-6"
              animate={{
                x: [0, -1800], // Ajuster selon la largeur des cartes
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
              {duplicatedTestimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-[350px] md:w-[450px]"
                >
                  {/* Card témoignage */}
                  <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl hover:border-[#fe6117]/30 transition-all duration-500 h-full flex flex-col">
                    {/* Quote icon */}
                    <div className="mb-6">
                      <Quote className="w-12 h-12 text-[#fe6117]/20" />
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>

                    {/* Témoignage */}
                    <blockquote className="text-gray-700 text-lg leading-relaxed mb-8 flex-grow">
                      "{testimonial.text}"
                    </blockquote>

                    {/* Séparateur */}
                    <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-6"></div>

                    {/* Auteur */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-4">
                        {/* Avatar */}
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#fe6117] to-[#ff8c4d] flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                          {testimonial.name[0]}
                        </div>

                        <div>
                          <div className="font-bold text-gray-900 text-base mb-1">
                            {testimonial.name}
                          </div>
                          <div className="text-gray-600 text-sm">
                            {testimonial.role}
                          </div>
                          <div className="text-gray-500 text-xs font-medium">
                            {testimonial.brand}
                          </div>
                        </div>
                      </div>

                      {/* Badge résultat */}
                      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl px-4 py-2 text-center flex-shrink-0">
                        <div className="text-emerald-600 text-xs font-bold whitespace-nowrap">
                          {testimonial.result}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Gradients de fade sur les côtés */}
          <div className="absolute top-0 left-0 bottom-0 w-32 bg-gradient-to-r from-white via-white/50 to-transparent pointer-events-none"></div>
          <div className="absolute top-0 right-0 bottom-0 w-32 bg-gradient-to-l from-white via-white/50 to-transparent pointer-events-none"></div>
        </div>

        {/* Badge satisfaction */}
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <div className="bg-gradient-to-br from-gray-900 via-[#0f4c81] to-gray-900 rounded-3xl p-10 md:p-12 text-white shadow-2xl relative overflow-hidden">
            {/* Décoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#fe6117]/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>

            <div className="relative z-10 text-center">
              <p className="text-white/90 text-xl leading-relaxed max-w-2xl mx-auto">
                Toutes les marques que nous accompagnons continuent de grandir
                et <span className="font-bold text-white">recommandent nos services</span> à d'autres entrepreneurs africains.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
