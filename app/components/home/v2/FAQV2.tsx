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
      question: 'Pourquoi ne pas juste faire mon site avec l\'IA (Lovable, etc.) ?',
      answer:
        "Vous pouvez, et beaucoup de nos clientes commencent comme ça. Le problème n'est pas le site : c'est que ces pages affichent un catalogue mais ne vendent pas toutes seules — les commandes repartent sur WhatsApp, gérées à la main, sans automatisation ni acquisition derrière. Si vous avez déjà un site généré par IA, on peut souvent le connecter au reste du système (paiement, Vendeuse IA, publicité) plutôt que de tout recommencer.",
    },
    {
      question: 'Combien de temps avant de voir des résultats ?',
      answer:
        "Le Sprint Acquisition livre un premier rapport chiffré à 30 jours. Pour un accompagnement complet, comptez 2 à 6 semaines pour la mise en place, puis un suivi continu sur les résultats.",
    },
    {
      question: "Est-ce qu'on peut vous payer en plusieurs fois ?",
      answer:
        "Oui, sur le Sprint Acquisition comme sur la Fabrique complète. On en discute ensemble à l'issue du diagnostic, selon votre situation.",
    },
    {
      question: 'Est-ce que vous travaillez avec tous les types de marques ?',
      answer:
        "Nous travaillons surtout avec des marques de produits (mode, beauté, bien-être, maison) qui ont déjà des produits à vendre — que vous ayez déjà un site ou que vous partiez de zéro.",
    },
    {
      question: "Par où est-ce qu'on commence ?",
      answer:
        "Par le diagnostic gratuit. Dix minutes suffisent pour qu'on identifie ensemble ce qui bloque vos ventes, et la meilleure porte d'entrée pour votre situation.",
    },
  ];

  return (
    <section id="faq" className="scroll-mt-24 py-16 md:py-24 bg-tekki-cream">
      <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-home-display text-[30px] font-semibold text-tekki-ink tracking-tight">
            Vos questions, nos réponses.
          </h2>
        </motion.div>

        {/* Accordion */}
        <div className="divide-y divide-tekki-ink/8">
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
                  className={`font-home-display text-[17px] font-semibold transition-colors ${openIndex === index ? 'text-tekki-orange-deep' : 'text-tekki-ink group-hover:text-tekki-orange-deep'
                    }`}
                >
                  {faq.question}
                </span>
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all ${openIndex === index
                    ? 'bg-tekki-orange/10 text-tekki-orange-deep'
                    : 'bg-tekki-surface text-tekki-ink-soft'
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
                    <p className="font-home-body pb-6 text-tekki-ink-soft leading-relaxed text-[15px]">
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
