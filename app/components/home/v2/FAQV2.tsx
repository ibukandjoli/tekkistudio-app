// app/components/home/v2/FAQV2.tsx
'use client';

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const FAQV2 = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "Pourquoi choisir TEKKI Studio plutôt qu'une agence classique ?",
      answer:
        "La plupart des agences et freelances ne savent pas réellement ce que c'est que de vendre en ligne, surtout en Afrique. Ils vous livrent un joli site et vous laissent vous débrouiller pour attirer des ventes. Contrairement à eux, nous sommes sur le terrain comme vous, avec nos propres marques. Nous savons ce qui marche et ce qui ne marche pas. Nous savons ce qui amène un inconnu à acheter, et ce qui fait fuir un client. Chaque solution qu'on vous propose a d'abord été testée avec notre propre argent.",
    },
    {
      question: 'Est-ce que vous travaillez avec tous les types de marques ?',
      answer:
        "On accompagne principalement les marques africaines dans la mode, la beauté, le lifestyle et l'alimentaire. Si vous vendez un produit physique et que vous voulez développer vos ventes en ligne, on peut très probablement vous aider.",
    },
    {
      question: 'Combien de temps avant de voir des résultats ?',
      answer:
        "Les premiers résultats (trafic, premières commandes en ligne) apparaissent généralement dans les 4 à 8 semaines suivant le lancement de votre site et de la stratégie mise en place. Une croissance solide et durable se construit sur 3 à 6 mois.",
    },
    {
      question: "Est-ce qu'on peut vous payer en plusieurs fois ?",
      answer:
        "Oui. On propose des modalités de paiement adaptées selon la formule choisie. C'est un point qu'on discute lors du diagnostic, en fonction de votre situation.",
    },
    {
      question: "Par où est-ce qu'on commence ?",
      answer:
        "Par le diagnostic gratuit. En 24 heures, on identifie ce qui bloque vos ventes et on vous dit honnêtement si on peut vous aider — et comment. Sans engagement de votre côté.",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-tekki-cream">
      <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-tekki-blue tracking-tight">
            Vos questions, nos réponses.
          </h2>
        </motion.div>

        {/* Accordion */}
        <div className="divide-y divide-tekki-blue/8">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: index * 0.08 }}
            >
              <button
                className="w-full py-6 text-left flex justify-between items-start gap-4 group"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span
                  className={`font-semibold text-lg transition-colors ${openIndex === index ? 'text-tekki-orange' : 'text-tekki-blue group-hover:text-tekki-orange'
                    }`}
                >
                  {faq.question}
                </span>
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${openIndex === index
                    ? 'bg-tekki-orange/10 text-tekki-orange'
                    : 'bg-tekki-surface text-tekki-blue/40'
                    }`}
                >
                  {openIndex === index ? <Minus size={16} /> : <Plus size={16} />}
                </div>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <p className="pb-6 text-tekki-blue/55 leading-relaxed text-[16px]">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQV2;
