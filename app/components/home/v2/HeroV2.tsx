// app/components/home/v2/HeroV2.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { motion, animate } from 'framer-motion';
import { trackCustomEvent } from '@/app/lib/meta-events';

const proofStats = [
  { prefix: '+', end: 10, suffix: '', label: 'marques accompagnées' },
  { prefix: '+', end: 200, suffix: '%', label: 'de ventes en plus, en moyenne' },
  { prefix: '', end: 13, suffix: ' ans', label: "d'expérience dans l'e-commerce" },
];

function useCountUp(end: number, delay = 0, duration = 1.4) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const controls = animate(0, end, {
      duration,
      delay,
      ease: 'easeOut',
      onUpdate: (v) => setValue(v),
    });
    return () => controls.stop();
  }, [end, delay, duration]);
  return value;
}

function formatThousands(n: number) {
  return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

function AnimatedStat({ prefix, end, suffix, label, delay }: { prefix: string; end: number; suffix: string; label: string; delay: number }) {
  const value = useCountUp(end, delay);
  return (
    <div className="flex flex-col gap-0.5 min-w-0">
      <span className="font-home-mono text-[17px] sm:text-[20px] font-semibold text-tekki-orange-deep tabular-nums whitespace-nowrap">
        {prefix}{Math.round(value)}{suffix}
      </span>
      <span className="font-home-body text-[11px] sm:text-[12.5px] text-tekki-ink-soft leading-snug">{label}</span>
    </div>
  );
}

function AnimatedAmount({ end, delay }: { end: number; delay: number }) {
  const value = useCountUp(end, delay, 1.6);
  return <>{formatThousands(value)}</>;
}

// Entrée en rebond pour les cartes flottantes — attire l'oeil au chargement.
const cardBounce = (delay: number) => ({
  initial: { opacity: 0, y: -24, scale: 0.7 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: { type: 'spring' as const, bounce: 0.55, duration: 0.9, delay },
});

export default function HeroV2() {
  return (
    <section className="relative w-full bg-tekki-cream overflow-hidden pt-28 pb-20 md:pt-36 md:pb-24">
      {/* Soft radial gradients - pushed to edges, away from text */}
      <div className="absolute top-[-15%] right-[-10%] w-[600px] h-[600px] rounded-full bg-tekki-orange/[0.04] blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-15%] left-[-10%] w-[500px] h-[500px] rounded-full bg-tekki-blue/[0.03] blur-[130px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-14 items-start lg:items-stretch">
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
                +10 marques accompagnées
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="font-home-display text-[34px] sm:text-[42px] md:text-[50px] font-semibold text-tekki-ink tracking-tight mb-[18px] leading-[1.12]"
            >
              Votre site est beau.<br />Mais est-ce qu&apos;il <span className="text-tekki-orange">vend</span>&nbsp;?
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="font-home-body text-[17px] text-tekki-ink-soft mb-7 max-w-[430px] leading-relaxed"
            >
              Nous construisons le système complet pour attirer vos clients et les accompagner jusqu&apos;à l&apos;achat : boutique adaptée à votre marché, acquisition ajustée au stade de votre marque et vendeuse IA formée sur vos produits.
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
              className="flex flex-nowrap gap-x-4 sm:gap-x-7 pt-6 border-t border-tekki-ink/10"
            >
              {proofStats.map((stat, i) => (
                <AnimatedStat key={stat.label} {...stat} delay={0.7 + i * 0.15} />
              ))}
            </motion.div>
          </div>

          {/* Visual column — photo + floating data cards, aligned to the top of the H1 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="w-full pb-8 lg:pb-0 lg:h-full"
          >
            <div className="relative aspect-[6/7] max-w-[420px] mx-auto lg:mx-0 lg:aspect-auto lg:h-full lg:w-full lg:max-w-none">
              {/* Photo — Lucie, fondatrice d'Itoko Beauty */}
              <div className="absolute inset-0 rounded-2xl overflow-hidden">
                <Image
                  src="/images/hero.png"
                  alt="Lucie, fondatrice d'Itoko Beauty, avec ses produits"
                  fill
                  priority
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 420px, 580px"
                />
              </div>

              {/* Floating card — ventes ce mois */}
              <motion.div
                {...cardBounce(0.6)}
                className="absolute top-3 left-3 bg-white rounded-lg shadow-lg shadow-black/10 px-3 py-2.5 border border-tekki-ink/8 z-20 max-w-[160px]"
              >
                <p className="font-home-body text-[9.5px] text-tekki-ink-soft mb-0.5 leading-tight">Ventes ce mois</p>
                <p className="font-home-mono text-[15px] font-semibold text-tekki-ink tabular-nums leading-tight whitespace-nowrap">
                  <AnimatedAmount end={1850000} delay={0.9} /> <span className="text-[9.5px] font-home-body font-normal">FCFA</span>
                </p>
                <p className="font-home-body text-[10px] text-tekki-green font-semibold mt-0.5 leading-tight">
                  +42% vs mois dernier
                </p>
              </motion.div>

              {/* Floating badge — nouvelle commande */}
              <motion.div
                {...cardBounce(0.85)}
                className="absolute bottom-24 right-3 flex items-center gap-1.5 bg-white rounded-full shadow-lg shadow-black/10 pl-1.5 pr-3 py-1.5 border border-tekki-green/20 z-20"
              >
                <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tekki-green opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-tekki-green" />
                </span>
                <div>
                  <p className="font-home-body text-[9.5px] font-semibold text-tekki-ink leading-tight">
                    Nouvelle commande
                  </p>
                  <p className="font-home-body text-[9px] text-tekki-ink-soft leading-tight">
                    Dakar · 45 000 FCFA
                  </p>
                </div>
              </motion.div>

              {/* Identity card — overlaps the bottom edge of the photo */}
              <motion.div
                {...cardBounce(1.05)}
                className="absolute -bottom-6 left-3 right-3 bg-white rounded-xl shadow-xl shadow-black/10 p-4 border border-tekki-ink/8 z-30 flex items-center gap-3"
              >
                <div className="w-11 h-11 rounded-full overflow-hidden flex-shrink-0 relative border border-tekki-ink/8">
                  <Image
                    src="/images/clients/logo-itoko.png"
                    alt="Itoko Beauty"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="font-home-body text-[13px] font-semibold text-tekki-ink truncate">
                    Itoko Beauty
                  </p>
                  <p className="font-home-body text-[11.5px] text-tekki-ink-soft truncate">
                    Lucie · itokobeauty.com
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
