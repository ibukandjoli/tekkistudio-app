// app/components/home/Testimonials.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Star, ArrowLeft, ArrowRight, Quote, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useIsMobile } from '@/app/hooks/useIsMobile';

const Testimonials = () => {
  const isMobile = useIsMobile();
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
      rating: 5,
      color: "from-purple-500 to-pink-500"
    },
    {
      name: "Maguette D.",
      role: "Fondateur",
      brand: "Momo Le Bottier - Chaussures artisanales",
      image: "/images/testimonials/maguette.jpg",
      text: "TEKKI Studio a transformé notre marque avec un site professionnel qui dépasse nos attentes. Nos clients partout dans le monde peuvent désormais commander leurs chaussures et sacs et être livrés. C'était notre objectif.",
      result: "Ventes internationales",
      rating: 5,
      color: "from-blue-500 to-cyan-500"
    },
    {
      name: "Fatou C.",
      role: "Fondatrice",
      brand: "6C No Filter - Cosmétiques naturels",
      image: "/images/testimonials/cisse.jpg",
      text: "L'équipe est extrêmement professionnelle et disponible. J'avais besoin d'un site professionnel pour ma marque de cosmétiques, ils ont livré un travail magnifique en moins de 10 jours. Je recommande à 100% !",
      result: "Site livré en 10 jours",
      rating: 5,
      color: "from-emerald-500 to-teal-500"
    }
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const nextTestimonial = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const prevTestimonial = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
    setTimeout(() => setIsAnimating(false), 500);
  };

  // Auto-rotate
  useEffect(() => {
    const interval = setInterval(() => {
      nextTestimonial();
    }, 7000);
    return () => clearInterval(interval);
  }, [activeIndex]);

  return (
    <section className="py-20 md:py-28 bg-[#fff5f0] overflow-hidden relative">
      {/* Décoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#ff7f50]/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#0f4c81]/5 rounded-full blur-3xl -z-10"></div>

      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          ref={ref}
          className="text-center mb-16 max-w-3xl mx-auto"
          initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          animate={inView || isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span className="text-emerald-700 text-xs font-bold tracking-wider uppercase">
              Témoignages clients
            </span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold text-[#0f4c81] mb-4">
            Des marques qui nous font confiance
          </h2>
          <p className="text-xl text-gray-600">
            Voici ce que disent les entrepreneurs africains que nous avons accompagnés 
            dans la transformation digitale de leur marque
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <div className="relative">
            {/* Navigation arrows - desktop */}
            <div className="absolute -left-4 md:-left-20 top-1/2 -translate-y-1/2 z-10 hidden md:block">
              <motion.button
                onClick={prevTestimonial}
                className="bg-white/90 backdrop-blur-sm shadow-xl w-14 h-14 rounded-full flex items-center justify-center hover:bg-white transition-all border border-gray-200/50"
                aria-label="Témoignage précédent"
                whileHover={{ scale: 1.1, x: -4 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-6 h-6 text-[#0f4c81]" />
              </motion.button>
            </div>
            
            <div className="absolute -right-4 md:-right-20 top-1/2 -translate-y-1/2 z-10 hidden md:block">
              <motion.button
                onClick={nextTestimonial}
                className="bg-white/90 backdrop-blur-sm shadow-xl w-14 h-14 rounded-full flex items-center justify-center hover:bg-white transition-all border border-gray-200/50"
                aria-label="Témoignage suivant"
                whileHover={{ scale: 1.1, x: 4 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowRight className="w-6 h-6 text-[#0f4c81]" />
              </motion.button>
            </div>
            
            {/* Carousel */}
            <div className="overflow-hidden relative">
              <div className="flex">
                {testimonials.map((testimonial, index) => (
                  <div 
                    key={index} 
                    className={`w-full flex-shrink-0 px-4 transition-opacity duration-500 ${
                      index === activeIndex ? 'opacity-100' : 'opacity-0 absolute inset-0'
                    }`}
                  >
                    {/* Card moderne sans bordures */}
                    <div className={`relative bg-gradient-to-br ${testimonial.color} rounded-3xl p-8 md:p-12 shadow-2xl`}>
                      {/* Quote icon en arrière-plan */}
                      <Quote className="absolute top-8 right-8 w-24 h-24 text-white/10" />
                      
                      {/* Contenu */}
                      <div className="relative z-10 max-w-4xl mx-auto">
                        {/* Rating */}
                        <div className="flex items-center gap-1 mb-6">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-6 h-6 fill-white text-white" />
                          ))}
                        </div>
                        
                        {/* Témoignage */}
                        <blockquote className="text-2xl md:text-3xl text-white font-light leading-relaxed mb-8">
                          "{testimonial.text}"
                        </blockquote>
                        
                        {/* Auteur et résultat */}
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                          {/* Infos auteur */}
                          <div className="flex items-center gap-4">
                            {/* Photo circulaire */}
                            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-2xl font-bold border-2 border-white/30">
                              {testimonial.name[0]}
                              {/* Décommentez quand vous aurez les photos :
                              <img 
                                src={testimonial.image} 
                                alt={testimonial.name}
                                className="w-full h-full object-cover rounded-full" 
                              />
                              */}
                            </div>
                            
                            <div>
                              <div className="font-bold text-lg text-white mb-1">
                                {testimonial.name}
                              </div>
                              <div className="text-white/80 text-sm">
                                {testimonial.role}, {testimonial.brand}
                              </div>
                            </div>
                          </div>
                          
                          {/* Badge résultat */}
                          <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-xl px-6 py-3 text-center">
                            <div className="text-white/80 text-xs font-semibold mb-1">Résultat</div>
                            <div className="text-white text-lg font-bold whitespace-nowrap">{testimonial.result}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Indicators */}
          <div className="flex justify-center mt-10 gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setActiveIndex(index);
                  setIsAnimating(true);
                  setTimeout(() => setIsAnimating(false), 500);
                }}
                className={`transition-all duration-300 rounded-full ${
                  index === activeIndex 
                    ? 'w-10 h-2.5 bg-[#ff7f50] shadow-lg' 
                    : 'w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Voir témoignage ${index + 1}`}
              />
            ))}
          </div>

          {/* Mobile navigation */}
          <div className="flex md:hidden justify-center gap-4 mt-8">
            <motion.button
              onClick={prevTestimonial}
              className="bg-white/90 backdrop-blur-sm shadow-lg w-12 h-12 rounded-full flex items-center justify-center hover:bg-white border border-gray-200/50"
              aria-label="Témoignage précédent"
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5 text-[#0f4c81]" />
            </motion.button>
            <motion.button
              onClick={nextTestimonial}
              className="bg-white/90 backdrop-blur-sm shadow-lg w-12 h-12 rounded-full flex items-center justify-center hover:bg-white border border-gray-200/50"
              aria-label="Témoignage suivant"
              whileTap={{ scale: 0.95 }}
            >
              <ArrowRight className="w-5 h-5 text-[#0f4c81]" />
            </motion.button>
          </div>
        </div>

        {/* Badge satisfaction */}
        <motion.div
          className="max-w-4xl mx-auto mt-20 text-center"
          initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          animate={inView || isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: isMobile ? 0 : 0.5, duration: 0.6 }}
        >
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[#0f4c81] to-[#1a5a8f] text-white px-6 py-3 rounded-full font-bold text-lg mb-4">
              <Star className="w-6 h-6 fill-white" />
              <span>100% de satisfaction client</span>
            </div>
            <p className="text-gray-600 text-lg leading-relaxed">
              Toutes les marques que nous accompagnons continuent de grandir 
              et recommandent nos services à d'autres entrepreneurs africains
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;