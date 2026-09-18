// app/components/home/v2/HeroV2.tsx
'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { trackCustomEvent } from '@/app/lib/meta-events';

const proofStats = [
  { value: '+10', label: 'marques accompagnées' },
  { value: '+200%', label: 'de ventes en plus, en moyenne' },
];

const orderRows = [
  { name: 'Nouvelle commande', detail: 'Dakar, Sénégal · via campagne Meta', amount: '+24 500', isNew: true },
  { name: 'Fatoumata S.', detail: "Abidjan, Côte d'Ivoire", amount: '+61 000', isNew: false },
  { name: 'Client international', detail: 'Paris, France', amount: '+38 200', isNew: false },
];

const barHeights = [34, 48, 40, 62, 55, 74, 100];

export default function HeroV2() {
  return (
    <section className="relative w-full bg-tekki-cream overflow-hidden pt-28 pb-16 md:pt-36 md:pb-20">
      {/* Soft radial gradients - pushed to edges, away from text */}
      <div className="absolute top-[-15%] right-[-10%] w-[600px] h-[600px] rounded-full bg-tekki-orange/[0.04] blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-15%] left-[-10%] w-[500px] h-[500px] rounded-full bg-tekki-blue/[0.03] blur-[130px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-14 items-start">
          {/* Text column */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-tekki-orange/8 border border-tekki-orange/15 mb-4"
            >
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tekki-orange opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-tekki-orange" />
              </span>
              <span className="text-sm font-medium text-tekki-orange tracking-wide">
                La Fabrique de Marques Africaines
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="font-home-display text-[32px] sm:text-[38px] md:text-[42px] font-semibold text-tekki-ink tracking-tight mb-[18px] leading-[1.14]"
            >
              Un joli site ne vous ramènera pas de ventes.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="font-home-body text-[17px] text-tekki-ink-soft mb-7 max-w-[430px] leading-relaxed"
            >
              Ni vos posts Instagram/TikTok viraux d'ailleurs, tant qu&apos;ils n&apos;ont pas la bonne structure. Chez TEKKI Studio, on construit le système complet qui permet à votre marque de vendre réellement.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="flex flex-col items-start gap-4 mb-8"
            >
              <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
                <Link
                  href="/diagnostic"
                  onClick={() => trackCustomEvent('hero_cta_click')}
                  className="whitespace-nowrap inline-flex items-center justify-center gap-2 px-8 py-4 bg-tekki-orange hover:bg-tekki-orange-hover text-white rounded-full font-home-body font-semibold text-[15px] transition-all duration-300 group shadow-lg shadow-tekki-orange/20 hover:shadow-xl hover:shadow-tekki-orange/30 hover:-translate-y-0.5"
                >
                  Faire le diagnostic de ma marque
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/#cases"
                  className="whitespace-nowrap inline-flex items-center gap-1.5 font-home-body text-[15px] text-tekki-ink font-semibold hover:text-tekki-orange transition-colors"
                >
                  Voir les résultats obtenus
                  <ArrowRight size={16} />
                </Link>
              </div>
              <p className="font-home-body text-[13px] text-tekki-ink-soft">
                Diagnostic gratuit · Réponse sous 24h · Sans engagement
              </p>
            </motion.div>

            {/* Proof strip */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="flex flex-wrap gap-x-8 gap-y-4 pt-6 border-t border-tekki-ink/10"
            >
              {proofStats.map((stat) => (
                <div key={stat.label} className="flex flex-col gap-0.5">
                  <span className="font-home-mono text-[20px] font-semibold text-tekki-orange-deep tabular-nums">
                    {stat.value}
                  </span>
                  <span className="font-home-body text-[12.5px] text-tekki-ink-soft max-w-[170px]">{stat.label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Dashboard mock column — aligned to the top of the H1, not centered on the column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="w-full lg:mt-[60px]"
          >
            <div
              role="img"
              aria-label="Aperçu illustratif d'un tableau de bord de ventes générées"
              className="bg-white border border-tekki-ink/10 rounded-2xl p-[22px] shadow-[0_24px_50px_-30px_rgba(37,27,18,0.25)]"
            >
              <div className="flex items-center gap-2 font-home-body text-[13px] text-tekki-ink-soft mb-[18px]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tekki-green opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-tekki-green" />
                </span>
                Moteur d&apos;acquisition — en direct
              </div>

              <div className="font-home-mono text-[29px] font-semibold text-tekki-ink tabular-nums mb-1">
                1 284 600 <span className="font-home-body text-[15px] font-normal text-tekki-ink-soft">FCFA</span>
              </div>
              <div className="font-home-body text-[12.5px] text-tekki-ink-soft mb-5">
                Ventes générées cette semaine, marque Abarings
              </div>

              <div className="flex items-end gap-1.5 h-[52px] mb-[22px]">
                {barHeights.map((h, i) => (
                  <div
                    key={i}
                    className={`flex-1 rounded-t-sm ${i === barHeights.length - 1 ? 'bg-tekki-orange' : 'bg-tekki-orange/15'}`}
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>

              <div className="flex flex-col gap-2.5">
                {orderRows.map((row) => (
                  <div
                    key={row.name}
                    className={`flex items-center justify-between rounded-lg px-3.5 py-2.5 border ${
                      row.isNew
                        ? 'bg-tekki-green/[0.07] border-tekki-green/30'
                        : 'bg-tekki-surface border-tekki-ink/8'
                    }`}
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className="font-home-body font-semibold text-tekki-ink text-[13px]">{row.name}</span>
                      <span className="font-home-body text-tekki-ink-soft text-[11.5px]">{row.detail}</span>
                    </div>
                    <span className="font-home-mono font-semibold text-tekki-green text-[13px] tabular-nums">
                      {row.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
