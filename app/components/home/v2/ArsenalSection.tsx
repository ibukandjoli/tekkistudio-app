// app/components/home/v2/ArsenalSection.tsx
'use client';

import Link from 'next/link';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { trackCustomEvent } from '@/app/lib/meta-events';

const offers = [
  {
    step: 'Étape 1',
    name: 'Diagnostic',
    offreParam: 'diagnostic',
    price: 'Gratuit',
    priceNote: null,
    description: '10 à 15 minutes pour identifier précisément ce qui bloque vos ventes aujourd\'hui.',
    features: [
      'Audit de votre présence actuelle (site, réseaux, WhatsApp)',
      'Diagnostic personnalisé sous 24h',
      'Recommandation claire de la suite, sans engagement',
    ],
    cta: 'Commencer le diagnostic',
    featured: false,
  },
  {
    step: 'Étape 2 · Le plus choisi',
    name: 'Sprint Acquisition',
    offreParam: 'sprint',
    price: 'À partir de 195 000 FCFA',
    priceNote: '/ 30 jours',
    description:
      "Pour tester le système avant d'investir plus : une campagne d'acquisition complète, avec des résultats mesurables à la fin.",
    features: [
      'Campagnes Meta/TikTok gérées pendant 30 jours',
      'Créas, ciblage et budget pris en charge',
      'Rapport de résultats chiffré à J+30',
      'Paiement en 2 fois possible',
    ],
    cta: 'Démarrer un sprint',
    featured: true,
  },
  {
    step: 'Étape 3',
    name: 'Fabrique complète',
    offreParam: 'fabrique',
    price: '695 000 FCFA',
    priceNote: null,
    description:
      "L'accompagnement complet : boutique, Vendeuse IA et acquisition, construits ensemble comme un seul système.",
    features: [
      'Boutique Shopify ou TEKKIShop optimisée pour la conversion',
      'Vendeuse IA installée et entraînée sur vos produits',
      "Stratégie d'acquisition multi-canal",
      'Paiement en 2 ou 3 fois possible',
    ],
    cta: 'En discuter',
    featured: false,
  },
];

export default function ArsenalSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="offers" className="py-16 md:py-24 bg-tekki-cream">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-[600px] mb-12"
        >
          <h2 className="font-home-display text-[30px] font-semibold text-tekki-ink tracking-tight mb-3.5">
            Une offre pour chaque étape.
          </h2>
          <p className="font-home-body text-[16px] text-tekki-ink-soft">
            Vous n&apos;avez pas à engager 695 000 FCFA d&apos;un coup pour savoir si ça marche pour vous. Commencez petit, avec des résultats mesurables avant d&apos;aller plus loin.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-[22px] items-stretch">
          {offers.map((offer, index) => (
            <motion.div
              key={offer.name}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.12 }}
              className={`flex flex-col p-7 rounded-2xl bg-white ${
                offer.featured
                  ? 'border-2 border-tekki-orange relative'
                  : 'border border-tekki-ink/10'
              }`}
            >
              <span
                className={`font-home-body text-[13px] font-semibold mb-2.5 ${
                  offer.featured ? 'text-tekki-orange-deep' : 'text-tekki-ink-soft'
                }`}
              >
                {offer.step}
              </span>
              <h3 className="font-home-display text-[22px] font-semibold text-tekki-ink mb-2.5">{offer.name}</h3>
              <div className="font-home-mono text-[25px] font-semibold text-tekki-ink mb-1 tabular-nums">
                {offer.price}
                {offer.priceNote && (
                  <span className="font-home-body text-[13px] font-normal text-tekki-ink-soft ml-1">
                    {offer.priceNote}
                  </span>
                )}
              </div>
              <p className="font-home-body text-[14px] text-tekki-ink-soft mb-5">{offer.description}</p>

              <ul className="flex flex-col gap-2.5 mb-6 flex-grow">
                {offer.features.map((f) => (
                  <li key={f} className="flex gap-[9px] font-home-body text-[14px] text-tekki-ink">
                    <Check size={16} className="text-tekki-green flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href={`/diagnostic?offre=${offer.offreParam}`}
                onClick={() => trackCustomEvent('pricing_cta_click', { offer: offer.name, offre: offer.offreParam })}
                className={`w-full text-center px-6 py-3 rounded-full font-home-body font-semibold text-sm transition-all ${
                  offer.featured
                    ? 'bg-tekki-orange hover:bg-tekki-orange-hover text-white'
                    : 'border border-tekki-ink/15 text-tekki-ink hover:border-tekki-orange hover:text-tekki-orange'
                }`}
              >
                {offer.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
