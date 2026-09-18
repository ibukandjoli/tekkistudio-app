// app/components/home/v2/SkinInTheGameSection.tsx
'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export default function SkinInTheGameSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="differenciateur" className="py-16 md:py-24 bg-tekki-surface-warm border-y border-tekki-ink/8">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text Column */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block font-home-body text-[12.5px] font-semibold text-tekki-orange-deep uppercase tracking-widest mb-4">
              Notre différence
            </span>

            <h2 className="font-home-display text-[30px] font-semibold text-tekki-ink tracking-tight mb-5 leading-tight">
              On ne vous conseille pas depuis un bureau.
            </h2>

            <div className="space-y-4 mb-8">
              <p className="font-home-body text-tekki-ink-soft text-[16px] leading-relaxed">
                Avant d&apos;accompagner votre marque, on a lancé les nôtres.{' '}
                <strong className="text-tekki-ink font-semibold">Viens On S&apos;Connaît</strong>,{' '}
                <strong className="text-tekki-ink font-semibold">Amani</strong> : ce sont nos propres créations, qu&apos;on gère encore aujourd&apos;hui. On connaît la réalité des stocks à gérer, des clients exigeants, des livreurs peu fiables, et des paiements à la livraison incertains.
              </p>
              <p className="font-home-body text-tekki-ink-soft text-[16px] leading-relaxed">
                Chaque stratégie qu&apos;on vous recommande, on l&apos;a d&apos;abord testée avec notre propre argent.{' '}
                <span className="text-tekki-orange-deep font-semibold">C&apos;est pour ça que ça marche.</span>
              </p>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8">
              <div className="flex flex-col">
                <span className="font-home-mono text-[28px] font-semibold text-tekki-ink tabular-nums">100%</span>
                <span className="font-home-body text-[13px] text-tekki-ink-soft mt-1">Testé sur nos propres marques</span>
              </div>
              <div className="w-px h-14 bg-tekki-ink/10 rounded-full" />
              <div className="flex flex-col">
                <span className="font-home-mono text-[28px] font-semibold text-tekki-ink tabular-nums">3</span>
                <span className="font-home-body text-[13px] text-tekki-ink-soft mt-1">Marques créées en interne</span>
              </div>
            </div>
          </motion.div>

          {/* Visual Column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative h-[500px] md:h-[580px] w-full"
          >
            {/* VOSC Image */}
            <div className="absolute top-0 right-0 w-[65%] h-[55%] rounded-2xl overflow-hidden shadow-xl shadow-tekki-ink/10 z-20 border border-white/50">
              <Image
                src="/images/brands/vosc.png"
                alt="Viens on s'connaît"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 65vw, 35vw"
                loading="lazy"
              />
            </div>

            {/* AMANI Image */}
            <div className="absolute bottom-0 left-0 w-[70%] h-[55%] rounded-2xl overflow-hidden shadow-xl shadow-tekki-ink/10 z-30 border border-white/50">
              <Image
                src="/images/brands/amani-2.png"
                alt="Amani Products"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 70vw, 40vw"
                loading="lazy"
              />
            </div>

            {/* Decorative element */}
            <div className="absolute top-[15%] left-[10%] w-24 h-24 rounded-full bg-tekki-orange/10 blur-xl z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
