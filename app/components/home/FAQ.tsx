// app/components/home/FAQ.tsx
'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, MessageCircle } from 'lucide-react';
import Link from 'next/link';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // Premier élément ouvert par défaut

  const faqs = [
    {
      question: "Qu'est-ce qu'un business e-commerce clé en main ?",
      answer: "Un business e-commerce clé en main est un business en ligne entièrement configuré et prêt à être exploité. Il comprend un site e-commerce optimisé et fini, des fournisseurs validés, des produits sourcés, une stratégie marketing complète établie, une formation pour la prise en main et un accompagnement de 2 mois pour assurer votre réussite."
    },
    {
      question: "Comment se passe le transfert du business ?",
      answer: "Une fois le contrat signé et le paiement effectué, nous nous chargeons des modifications que vous souhaitez apporter au site, si vous en avez, puis nous vous remettons tous les accès au site, ainsi que tous les éléments dont vous avez besoin pour lancer votre business et commencer à générer des revenus : contacts fournisseurs, stock de produits (si compris), stratégie marketing complète, formation pour la prise en main du business, etc."
    },
    {
      question: "Combien de temps faut-il pour démarrer ?",
      answer: "Une fois l'acquisition finalisée, vous pouvez démarrer en 1 à 2 semaines, selon le business choisi et la disponibilité des produits. Ce délai comprend la formation, la préparation des stocks initiaux, si nécessaire, et la configuration finale de votre business."
    },
    {
      question: "Quel type d'accompagnement est inclus ?",
      answer: "Vous bénéficiez d'un accompagnement complet pendant 2 mois incluant : assistance technique, conseils business, aide au marketing, et réponses à toutes vos questions. Notre objectif est de vous accompagner jusqu'à ce que vous commenciez à générer vos premières ventes et soyez parfaitement autonome."
    },
    {
      question: "Puis-je personnaliser le business ?",
      answer: "Oui, vous pouvez personnaliser votre business selon vos préférences tout en conservant les éléments qui ont prouvé leur efficacité. Nous vous conseillons sur les modifications à apporter pour optimiser vos résultats, car certains éléments souvent négligés sont parfois cruciaux pour la réussite ou l'échec d'un business, surtout en ligne."
    },
    {
      question: "Comment sont calculés les potentiels de revenus ?",
      answer: "Les potentiels de revenus sont basés sur les performances réelles des business similaires que nous avons développés ou étudiés. Ils prennent en compte le taux de conversion moyen, le panier moyen, et les coûts d'acquisition client dans votre marché."
    },
    {
      question: "Y a-t-il des frais récurrents à prévoir ?",
      answer: "Oui, comme pour tout business e-commerce, vous devrez prévoir des frais mensuels pour l'hébergement du site, les outils de marketing, et éventuellement la publicité. Nous vous fournissons un budget prévisionnel détaillé pour que vous puissiez anticiper ces coûts qui sont généralement entre 50 000 et 150 000 FCFA par mois selon le business."
    }
  ];

  // URL WhatsApp correctement formatée
  const whatsappUrl = "https://wa.me/221781362728?text=Bonjour%20TEKKI%20Studio%20!%20J%27ai%20une%20question%20%C3%A0%20vous%20poser%20dont%20je%20ne%20trouve%20pas%20la%20r%C3%A9ponse%20sur%20votre%20site.";

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
              className="mb-4 border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <button
                className="w-full px-6 py-5 text-left bg-white hover:bg-gray-50 flex justify-between items-center transition-all"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                aria-expanded={openIndex === index}
              >
                <span className="font-medium text-[#0f4c81] text-lg">{faq.question}</span>
                <div className="bg-gray-100 rounded-full p-1 ml-4 flex-shrink-0">
                  {openIndex === index ? (
                    <ChevronUp className="w-5 h-5 text-[#ff7f50]" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-[#ff7f50]" />
                  )}
                </div>
              </button>
              <div 
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-6 py-5 bg-gray-50 text-gray-700 leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-block bg-white rounded-lg p-6 shadow-md border border-gray-100">
            <p className="text-gray-700 flex items-center justify-center gap-2">
              <span>Vous avez d'autres questions?</span>
              <a 
                href={whatsappUrl}
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#0f4c81] font-medium ml-1 hover:text-[#ff7f50] transition-colors flex items-center"
              >
                <MessageCircle className="w-5 h-5 mr-1" />
                Écrivez-nous sur WhatsApp
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;