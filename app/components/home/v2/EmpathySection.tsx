// app/components/home/v2/EmpathySection.tsx
'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const aiSolves = [
  'Générer une page qui affiche votre catalogue',
  'Un design correct en quelques minutes',
  'Un lien à partager sur WhatsApp ou Instagram',
];

const tekkiBuilds = [
  'Un système de publicité qui ramène de vrais acheteurs, chaque semaine',
  'Une vendeuse IA qui répond, conseille et convertit 24h/24 — sans vous',
  'Un tunnel de commande et de paiement qui ne repose pas sur des messages manuels',
];

export default function EmpathySection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="reframe" className="py-16 md:py-24 bg-white border-y border-tekki-ink/8">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-[600px] mb-12"
        >
          <h2 className="font-home-display text-[30px] font-semibold text-tekki-ink tracking-tight mb-3.5">
            Votre problème a changé. Notre offre aussi.
          </h2>
          <p className="font-home-body text-[16px] text-tekki-ink-soft">
            Il y a deux ans, avoir un site professionnel était rare. Aujourd&apos;hui, un site se génère en une soirée avec un prompt. Ce qui bloque vraiment vos ventes a changé — et c&apos;est exactement là-dessus qu&apos;on travaille avec vous.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-[18px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="p-[30px] rounded-2xl border border-tekki-ink/10 bg-tekki-cream"
          >
            <p className="font-home-body text-[12.5px] font-semibold text-tekki-ink-soft mb-3.5">
              Ce que l&apos;IA générative résout déjà
            </p>
            <ul className="flex flex-col gap-3.5">
              {aiSolves.map((item) => (
                <li key={item} className="flex gap-[11px] font-home-body text-[15px] text-tekki-ink">
                  <span className="text-tekki-ink-soft flex-shrink-0">—</span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="p-[30px] rounded-2xl border border-tekki-orange/25 bg-tekki-orange/[0.06]"
          >
            <p className="font-home-body text-[12.5px] font-semibold text-tekki-orange-deep mb-3.5">
              Ce qui reste rare — et ce qu&apos;on construit
            </p>
            <ul className="flex flex-col gap-3.5">
              {tekkiBuilds.map((item) => (
                <li key={item} className="flex gap-[11px] font-home-body text-[15px] text-tekki-ink">
                  <span className="text-tekki-orange-deep font-bold flex-shrink-0">→</span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
