// app/components/home/v2/EmpathySection.tsx
'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const aiSolves = [
  'Générer un joli site qui affiche votre catalogue produit',
  'Ajouter des boutons pour commander sur WhatsApp',
  'Créer votre espace de gestion de vos commandes',
  'Rédiger les contenus de vos pages',
];

const tekkiBuilds = [
  'Une machine d\'acquisition qui ramène de vrais acheteurs, chaque semaine',
  'Une vendeuse IA, sur votre site, qui répond à vos clients et vend 24h/24',
  'Un tunnel de commande et de paiement qui ne repose pas sur des messages manuels',
  'Un espace de gestion complet qui vous permet de gérer toute votre activité',
];

export default function EmpathySection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="reframe" className="scroll-mt-24 py-16 md:py-24 bg-white border-y border-tekki-ink/8">
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
            Il y a deux ans, notre service phare était la conception de sites e-commerce clé en main, car avoir un site professionnel nécessitait une expertise assez rare. Aujourd&apos;hui, un site se génère en une soirée avec un prompt, grâce à l&apos;IA. Ce qui bloque vraiment vos ventes a changé. Et c&apos;est exactement là-dessus qu&apos;on travaille désormais avec vous.
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
              Ce que l&apos;IA résout déjà
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
