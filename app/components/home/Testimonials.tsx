// app/components/home/Testimonials.tsx
'use client';

import React from 'react';
import { Star } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: "Fatou D.",
      role: "Propriétaire d'Abarings",
      image: "/images/testimonials/fatou.jpg", 
      text: "Avant de travailler avec TEKKI Studio, j'avais essayé d'autres solutions qui étaient soit trop chères, soit de mauvaise qualité. Ils ont réussi à créer exactement ce dont j'avais besoin, à un prix abordable. J'adore mon site.",
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
      image: "/images/testimonials/fatou.jpg", 
      text: "L'équipe de TEKKI Studio est extrêmement professionnelle et disponible. J'avais besoin d'un site professionnel pour ma marque de cosmétiques naturels, et ils ont fait un travail magnifique en moins de 10 jours.",
      businessType: "Produits cosmétiques naturels",
      rating: 5
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#0f4c81] mb-4">
            Des entrepreneurs qui nous font confiance
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Voici ce que disent les marques pour lesquelles nous avons conçu des business e-commerce sur mesure.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl shadow-lg p-6 relative"
            >
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 rounded-full bg-gray-200 mr-4">
                  {/* En attendant les vraies photos */}
                  <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-[#0f4c81]">
                    {testimonial.name[0]}
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-[#0f4c81]">{testimonial.name}</h3>
                  <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  <p className="text-[#ff7f50] text-sm">{testimonial.businessType}</p>
                </div>
              </div>

              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-[#ff7f50] text-[#ff7f50]"
                  />
                ))}
              </div>

              <blockquote className="text-gray-600 italic">
                "{testimonial.text}"
              </blockquote>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-block bg-white rounded-lg p-6 shadow-lg">
            <div className="text-2xl font-bold text-[#0f4c81] mb-2">
              100% de satisfaction
            </div>
            <p className="text-gray-600">
              Tous nos clients sont satisfaits de leur acquisition et continuent de développer leur business avec succès
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;