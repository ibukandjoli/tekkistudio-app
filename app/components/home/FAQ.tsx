// app/components/home/FAQ.tsx
'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, MessageCircle } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import Link from 'next/link';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // Premier élément ouvert par défaut

  const faqs = [
    {
      question: "Qu'est-ce qu'un business clé en main ?",
      answer: "Un business clé en main est un business entièrement configuré et prêt à être exploité. Il comprend tous les éléments nécessaires pour démarrer sans partir de zéro : site optimisé, fournisseurs validés, produits sourcés ou plateforme digitale complète, stratégie marketing établie, formation pour la prise en main et un accompagnement de 2 à 3 mois pour assurer votre réussite."
    },
    {
      question: "Quelle est la différence entre un business e-commerce et un business digital ?",
      answer: "Un business e-commerce implique la vente de produits physiques qui nécessitent une gestion de stock et une logistique de livraison. Un business digital, quant à lui, propose des solutions 100% en ligne (applications, logiciels, produits numériques, etc.) sans nécessiter de gestion de stock ou d'expédition, ce qui facilite son démarrage et son scaling international."
    },
    {
      question: "Comment se passe le transfert du business ?",
      answer: "Une fois le contrat signé et le paiement effectué, nous nous chargeons des modifications souhaitées au site, puis nous vous remettons tous les accès au site et tous les éléments nécessaires au lancement : contacts fournisseurs, stock de produits (si compris), stratégie marketing complète, formation pour la prise en main, etc. Nous vous accompagnons ensuite pendant les premiers mois pour vous aider à générer vos premières ventes."
    },
    {
      question: "Combien de temps faut-il pour démarrer ?",
      answer: "Une fois l'acquisition finalisée, vous pouvez démarrer en 1 à 3 semaines, selon le business choisi et la disponibilité des produits ou ressources. Ce délai comprend la formation, la préparation des stocks initiaux (pour l'e-commerce), et la configuration finale de votre business. Les business digitaux peuvent généralement être lancés plus rapidement que les business e-commerce."
    },
    {
      question: "Comment fonctionne l'acquisition progressive ?",
      answer: "L'acquisition progressive vous permet de démarrer avec seulement 40% du prix total. Vous versez ensuite 10% + frais administratifs du prix total chaque mois pendant 6 mois. Vous pouvez gérer et développer le business dès l'apport initial, mais le transfert complet de propriété n'est effectué qu'après le dernier versement. Cette formule offre un mois d'accompagnement supplémentaire par rapport à l'acquisition complète."
    },
    {
      question: "Quel type d'accompagnement est inclus ?",
      answer: "Vous bénéficiez d'un accompagnement complet pendant 2 mois (3 mois pour l'acquisition progressive) incluant : assistance technique, conseils business, aide au marketing, et réponses à toutes vos questions. Notre objectif est de vous accompagner jusqu'à ce que vous commenciez à générer vos premières ventes et soyez parfaitement autonome dans la gestion de votre business."
    },
    {
      question: "Puis-je personnaliser le business ?",
      answer: "Oui, vous pouvez personnaliser votre business selon vos préférences tout en conservant les éléments qui ont prouvé leur efficacité. Nous vous conseillons sur les modifications à apporter pour optimiser vos résultats, car certains éléments sont parfois cruciaux pour la réussite d'un business, surtout en ligne. Toutes les personnalisations initiales sont incluses dans le prix d'acquisition."
    }
  ];

  // URL WhatsApp correctement formatée
  const whatsappUrl = "https://wa.me/221781362728?text=Bonjour%20TEKKI%20Studio%20!%20J%27ai%20une%20question%20%C3%A0%20vous%20poser%20dont%20je%20ne%20trouve%20pas%20la%20r%C3%A9ponse%20sur%20votre%20site.";

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0f4c81] mb-4">
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
              className="mb-4 border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <button
                className="w-full px-6 py-5 text-left bg-white hover:bg-gray-50 flex justify-between items-center transition-all"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                aria-expanded={openIndex === index}
              >
                <span className="font-medium text-[#0f4c81] text-lg">{faq.question}</span>
                <div className={`p-1.5 rounded-full ml-4 transition-colors ${openIndex === index ? 'bg-[#ff7f50]/10' : 'bg-gray-100'}`}>
                  {openIndex === index ? (
                    <ChevronUp className={`w-5 h-5 ${openIndex === index ? 'text-[#ff7f50]' : 'text-gray-500'}`} />
                  ) : (
                    <ChevronDown className={`w-5 h-5 ${openIndex === index ? 'text-[#ff7f50]' : 'text-gray-500'}`} />
                  )}
                </div>
              </button>
              <div 
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-[500px]' : 'max-h-0'
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
          <div className="inline-block bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              <p className="text-gray-700">Vous avez d'autres questions ?</p>
              <a 
                href={whatsappUrl}
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center py-2 px-4 rounded-full bg-[#25D366] text-white font-medium hover:bg-[#20BD5C] transition-colors whitespace-nowrap"
              >
                <FaWhatsapp /> 
                &nbsp;Contactez-nous sur WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;