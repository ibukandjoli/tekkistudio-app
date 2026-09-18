// app/components/home/v2/ServicesSection.tsx
'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const buildSteps = [
  {
    idx: '01',
    badge: 'Ce qui manque le plus aujourd\'hui',
    title: 'Une stratégie qui vous amène les bons clients',
    description:
      "Publicités Meta et TikTok, campagnes email et SMS, collaborations avec des créateurs — pensées pour que des inconnus découvrent votre marque et passent commande, pas juste pour générer des vues.",
  },
  {
    idx: '02',
    badge: null,
    title: 'Une assistante de vente qui ne dort jamais',
    description:
      "Une Vendeuse IA installée dans votre boutique, qui connaît vos produits, répond à vos clients et les guide jusqu'à l'achat — même à 3h du matin, même un dimanche.",
  },
  {
    idx: '03',
    badge: null,
    title: 'Une boutique conçue pour convertir, pas juste pour exister',
    description:
      "Sur Shopify ou TEKKIShop, notre solution adaptée au mobile, avec les paiements locaux intégrés. Si vous avez déjà un site, qu'il ait été fait avec l'IA ou non, on peut souvent le brancher au reste du système plutôt que tout refaire.",
  },
];

export default function ServicesSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="build" className="py-16 md:py-24 bg-white border-y border-tekki-ink/8">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-[600px] mb-12"
        >
          <h2 className="font-home-display text-[30px] font-semibold text-tekki-ink tracking-tight mb-3.5">
            Ce qu&apos;on construit pour vous.
          </h2>
          <p className="font-home-body text-[16px] text-tekki-ink-soft">
            Pas de pack standard. On part de ce qui bloque réellement vos ventes — dans cet ordre de priorité.
          </p>
        </motion.div>

        <div className="flex flex-col border-t border-tekki-ink/10">
          {buildSteps.map((step, index) => (
            <motion.div
              key={step.idx}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.12 }}
              className="grid grid-cols-[auto_1fr] md:grid-cols-[90px_1fr_1fr] gap-x-6 md:gap-x-[30px] gap-y-2 py-[30px] border-b border-tekki-ink/10"
            >
              <div
                className={`font-home-mono text-[14px] pt-1 tabular-nums ${
                  index === 0 ? 'text-tekki-orange-deep font-semibold' : 'text-tekki-ink-soft'
                }`}
              >
                {step.idx}
              </div>
              <div className="col-span-1 md:col-span-1">
                {step.badge && (
                  <span className="inline-block font-home-body text-[11.5px] font-semibold bg-tekki-orange text-white px-2.5 py-1 rounded-full mb-2.5">
                    {step.badge}
                  </span>
                )}
                <h3 className="font-home-display text-[20px] font-semibold text-tekki-ink">{step.title}</h3>
              </div>
              <p className="col-span-2 md:col-span-1 font-home-body text-[15px] text-tekki-ink-soft leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
