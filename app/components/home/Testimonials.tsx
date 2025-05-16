// app/components/home/Testimonials.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Star, ArrowLeft, ArrowRight, Quote } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: "Fatou D.",
      role: "Propriétaire d'Abarings",
      image: "/images/testimonials/fatou.jpg",
      text: "Avant de travailler avec TEKKI Studio, j'avais essayé d'autres solutions qui étaient soit trop chères, soit de mauvaise qualité. Ils ont réussi à créer exactement ce dont j'avais besoin, à un prix abordable. J'adore mon site et les résultats sont au rendez-vous.",
      businessType: "Bijoux artisanaux",
      rating: 5
    },
    {
      name: "Maguette D.",
      role: "Propriétaire de Momo Le Bottier",
      image: "/images/testimonials/maguette.jpg",
      text: "TEKKI Studio a transformé notre marque avec un site e-commerce professionnel qui dépasse toutes nos attentes. Nous pouvons désormais vendre en boutique et sur Internet, surtout aux clients qui ne sont pas à Dakar.",
      businessType: "Chaussures & sacs artisanaux",
      rating: 5
    },
    {
      name: "Fatou C.",
      role: "Propriétaire de 6C No Filter",
      image: "/images/testimonials/cisse.jpg",
      text: "L'équipe de TEKKI Studio est extrêmement professionnelle et disponible. J'avais besoin d'un site professionnel pour ma marque de cosmétiques naturels, et ils ont fait un travail magnifique en moins de 10 jours.",
      businessType: "Produits cosmétiques naturels",
      rating: 5
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

  // Auto-rotate testimonials every 7 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextTestimonial();
    }, 7000);
    return () => clearInterval(interval);
  }, [activeIndex]);

  return (
    <section className="py-20 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0f4c81] mb-4">
            Des entrepreneurs qui nous font confiance
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Voici ce que disent les entrepreneurs que nous avons accompagnés
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="relative">
            {/* Navigation arrows - desktop */}
            <div className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 hidden md:block">
              <button
                onClick={prevTestimonial}
                className="bg-white shadow-lg w-12 h-12 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
                aria-label="Précédent témoignage"
              >
                <ArrowLeft className="w-5 h-5 text-[#0f4c81]" />
              </button>
            </div>
            
            <div className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 hidden md:block">
              <button
                onClick={nextTestimonial}
                className="bg-white shadow-lg w-12 h-12 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
                aria-label="Prochain témoignage"
              >
                <ArrowRight className="w-5 h-5 text-[#0f4c81]" />
              </button>
            </div>
            
            {/* Testimonial carousel */}
            <div className="overflow-hidden relative">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${activeIndex * 100}%)` }}
              >
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="w-full flex-shrink-0">
                    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 relative">
                      {/* Quote icon */}
                      <div className="absolute top-8 right-8 opacity-10">
                        <Quote className="w-16 h-16 text-[#0f4c81]" />
                      </div>
                      
                      <div className="flex flex-col md:flex-row gap-8">
                        <div className="md:w-1/3">
                          <div className="bg-gray-100 h-48 w-48 md:h-full md:w-full rounded-xl flex items-center justify-center mx-auto mb-4 md:mb-0 overflow-hidden">
                            {testimonial.image ? (
                              <img 
                                src={testimonial.image} 
                                alt={testimonial.name}
                                className="w-full h-full object-cover" 
                              />
                            ) : (
                              <div className="w-20 h-20 bg-[#0f4c81] rounded-full flex items-center justify-center text-white text-4xl font-bold">
                                {testimonial.name[0]}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="md:w-2/3">
                          <div className="flex items-center mb-2">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <Star key={i} className="w-5 h-5 fill-[#ff7f50] text-[#ff7f50]" />
                            ))}
                          </div>
                          
                          <blockquote className="text-xl md:text-2xl text-gray-700 mb-6 font-light leading-relaxed">
                            "{testimonial.text}"
                          </blockquote>
                          
                          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
                            <div>
                              <div className="font-bold text-lg text-[#0f4c81]">{testimonial.name}</div>
                              <div className="text-gray-600">{testimonial.role}</div>
                            </div>
                            <div className="hidden md:block w-0.5 h-12 bg-gray-300"></div>
                            <div className="text-[#ff7f50] font-medium">{testimonial.businessType}</div>
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
          <div className="flex justify-center mt-8 space-x-3">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setActiveIndex(index);
                  setIsAnimating(true);
                  setTimeout(() => setIsAnimating(false), 500);
                }}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === activeIndex ? 'bg-[#ff7f50]' : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Voir témoignage ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="max-w-2xl mx-auto mt-16 text-center">
          <div className="inline-block bg-[#0f4c81] text-white px-6 py-2 rounded-full font-medium">
            100% de satisfaction client
          </div>
          <p className="text-gray-600 mt-4">
            Tous nos clients sont satisfaits de leur acquisition et continuent de développer leur business avec succès.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;