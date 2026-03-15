// app/components/home/v2/SkinInTheGameSection.tsx
'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export default function SkinInTheGameSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="differenciateur" className="py-16 md:py-24 bg-[#FFF8F5]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text Column */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-sm font-semibold text-tekki-orange uppercase tracking-widest mb-4">
              Notre différence
            </span>

            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-tekki-blue tracking-tight mb-6 leading-tight">
              On ne vous conseille pas
              <br className="hidden sm:block" />
              depuis un bureau.
            </h2>

            <div className="space-y-5 mb-8">
              <p className="text-tekki-blue/60 text-lg leading-relaxed">
                Avant d&apos;accompagner votre marque, on a lancé les nôtres.{' '}
                <strong className="text-tekki-blue font-semibold">Viens On S&apos;Connaît</strong>,{' '}
                <strong className="text-tekki-blue font-semibold">Amani</strong> : ce sont nos propres créations, qu&apos;on gère encore aujourd&apos;hui. On connaît la réalité des stocks à gérer, des clients exigeants, des livreurs peu fiables, et des paiements à la livraison incertains.
              </p>
              <p className="text-tekki-blue/60 text-lg leading-relaxed">
                Chaque stratégie qu&apos;on vous recommande, on l&apos;a d&apos;abord testée avec notre propre argent.{' '}
                <span className="text-tekki-orange font-semibold">C&apos;est pour ça que ça marche.</span>
              </p>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8">
              <div className="flex flex-col">
                <span className="font-heading text-3xl md:text-4xl font-bold text-tekki-blue">100%</span>
                <span className="text-sm text-tekki-blue/40 mt-1">Testé sur nos propres marques</span>
              </div>
              <div className="w-px h-14 bg-tekki-blue/10 rounded-full" />
              <div className="flex flex-col">
                <span className="font-heading text-3xl md:text-4xl font-bold text-tekki-blue">3</span>
                <span className="text-sm text-tekki-blue/40 mt-1">Marques créées en interne</span>
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
            <div className="absolute top-0 right-0 w-[65%] h-[55%] rounded-2xl overflow-hidden shadow-xl shadow-tekki-blue/10 z-20 border border-white/50">
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
            <div className="absolute bottom-0 left-0 w-[70%] h-[55%] rounded-2xl overflow-hidden shadow-xl shadow-tekki-blue/10 z-30 border border-white/50">
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
