// app/components/home/Testimonials.tsx
'use client';

import React from 'react';
import { Star } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: "Abdoulaye S.",
      role: "Propriétaire de Samelectro",
      image: "/images/testimonials/sam.jpg", 
      text: "J'ai acquis mon business e-commerce auprès de TEKKI Studio il y a 6 mois. L'accompagnement a été remarquable et aujourd'hui, mon business génère un revenu mensuel stable. Une excellente décision !",
      businessType: "Appareils Eco-énergetiques",
      rating: 5
    },
    {
      name: "Fatou D.",
      role: "Propriétaire d'Abarings",
      image: "/images/testimonials/fatou.jpg", 
      text: "Ce qui m'a le plus impressionné, c'est la qualité de la formation et du support. Tout était prêt à l'emploi et j'ai pu me concentrer sur le développement de mon business.",
      businessType: "Bijoux artisanaux",
      rating: 5
    },
    {
      name: "Maguette D.",
      role: "Propriétaire de Momo Le Bottier",
      image: "/images/testimonials/maguette.jpg", 
      text: "Un investissement qui en vaut vraiment la peine. L'équipe de TEKKI Studio a tout mis en œuvre pour faciliter mon démarrage. Après 3 mois, j'ai déjà dépassé mes objectifs.",
      businessType: "Chaussures & sacs artisanaux",
      rating: 5
    }
  ];

  return (
    <section className="py-20 bg-[#f8fafc]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#0f4c81] mb-4">
            Ils nous font confiance
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez les témoignages des clients qui ont acquis et développé leur business e-commerce avec notre accompagnement
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