// app/components/home/FAQ.tsx
'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Link } from 'lucide-react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "Qu'est-ce qu'un business e-commerce clé en main ?",
      answer: "Un business e-commerce clé en main est une entreprise en ligne entièrement configurée et prête à être exploitée. Il comprend un site e-commerce optimisé, des fournisseurs validés, une stratégie marketing testée, une formation complète et un accompagnement pour assurer votre réussite."
    },
    {
      question: "Comment se passe le transfert du business ?",
      answer: "Le transfert se fait en plusieurs étapes : signature du contrat, paiement selon l'option choisie, transmission des accès et documents, formation complète sur le fonctionnement du business, et support continu pendant 3 mois pour assurer une transition réussie."
    },
    {
      question: "Combien de temps faut-il pour démarrer ?",
      answer: "Une fois l'acquisition finalisée, vous pouvez démarrer en 1 à 2 semaines. Ce délai comprend la formation, la préparation des stocks initiaux et la configuration finale de votre business."
    },
    {
      question: "Quel type d'accompagnement est inclus ?",
      answer: "Vous bénéficiez d'un accompagnement complet pendant 3 mois incluant : assistance technique, conseils business, aide au marketing, et réponses à toutes vos questions. Notre objectif est de vous accompagner jusqu'à ce que vous soyez parfaitement autonome."
    },
    {
      question: "Puis-je personnaliser le business ?",
      answer: "Oui, vous pouvez personnaliser votre business selon vos préférences tout en conservant les éléments qui ont prouvé leur efficacité. Nous vous conseillons sur les modifications à apporter pour optimiser vos résultats."
    },
    {
      question: "Comment sont calculés les potentiels de revenus ?",
      answer: "Les potentiels de revenus sont basés sur les performances réelles des business similaires que nous avons développés. Ils prennent en compte le taux de conversion moyen, le panier moyen, et les coûts d'acquisition client dans votre marché."
    }
  ];

  return (
    <section className="py-20 bg-[#f8fafc]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#0f4c81] mb-4">
            Questions Fréquentes
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Tout ce que vous devez savoir sur l'acquisition d'un business clé en main
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="mb-4 border border-gray-200 rounded-lg overflow-hidden"
            >
              <button
                className="w-full px-6 py-4 text-left bg-white hover:bg-gray-50 flex justify-between items-center"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-medium text-[#0f4c81]">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-[#ff7f50]" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-[#ff7f50]" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-6 py-4 bg-gray-50 text-gray-600">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-block bg-[#F2F2F2] rounded-lg p-6">
            <p className="text-gray-600">
              Vous avez d'autres questions ? 
              <Link href="https://wa.me/221781362728" className="text-[#0f4c81] ml-2 hover:underline">
                Ecrivez-nous
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;