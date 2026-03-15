// app/components/home/v2/HeroV2.tsx
'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HeroV2() {
  return (
    <section className="relative w-full min-h-[90vh] bg-tekki-cream flex items-center justify-center overflow-hidden pt-24 pb-16 md:pt-28 md:pb-20">
      {/* Soft radial gradients - pushed to edges, away from text */}
      <div className="absolute top-[-15%] right-[-10%] w-[600px] h-[600px] rounded-full bg-tekki-orange/[0.04] blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-15%] left-[-10%] w-[500px] h-[500px] rounded-full bg-tekki-blue/[0.03] blur-[130px] pointer-events-none" />

      {/* Large decorative circles - only in far corners */}
      <div className="absolute top-[5%] left-[-3%] w-72 h-72 border border-tekki-orange/[0.05] rounded-full pointer-events-none hidden md:block" />
      <div className="absolute bottom-[5%] right-[-3%] w-60 h-60 border border-tekki-blue/[0.04] rounded-full pointer-events-none hidden md:block" />

      {/* Small floating accent dots - far from center */}
      <div className="absolute top-[18%] left-[5%] w-2 h-2 bg-tekki-orange/[0.12] rounded-full pointer-events-none hidden lg:block" />
      <div className="absolute top-[30%] left-[3%] w-1.5 h-1.5 bg-tekki-blue/[0.08] rounded-full pointer-events-none hidden lg:block" />
      <div className="absolute bottom-[25%] right-[4%] w-2.5 h-2.5 bg-tekki-orange/[0.10] rounded-full pointer-events-none hidden lg:block" />
      <div className="absolute bottom-[40%] right-[6%] w-1.5 h-1.5 bg-tekki-blue/[0.06] rounded-full pointer-events-none hidden lg:block" />
      <div className="absolute top-[70%] left-[7%] w-2 h-2 border border-tekki-orange/[0.08] rounded-full pointer-events-none hidden lg:block" />
      <div className="absolute top-[15%] right-[8%] w-3 h-3 border border-tekki-blue/[0.05] rounded-full pointer-events-none hidden lg:block" />

      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-tekki-orange/8 border border-tekki-orange/15 mb-8"
        >
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tekki-orange opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-tekki-orange" />
          </span>
          <span className="text-sm font-medium text-tekki-orange tracking-wide">
            La Fabrique de Marques Africaines
          </span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-tekki-blue tracking-tight mb-6 leading-[1.1]"
        >
          Vos produits méritent mieux
          <br className="hidden sm:block" />
          <span className="text-tekki-orange"> qu&apos;un compte Instagram.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-lg sm:text-xl text-tekki-blue/60 mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          On crée pour vous <strong>une boutique en ligne conçue pour vendre</strong>. On automatise vos ventes grâce à l&apos;IA et on vous libère de WhatsApp. Pour que votre marque grandisse <strong>sans que tout repose sur vous</strong>.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="flex flex-col items-center gap-4"
        >
          <Link
            href="/diagnostic"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-tekki-orange hover:bg-tekki-orange-hover text-white rounded-full font-semibold text-lg transition-all duration-300 group shadow-lg shadow-tekki-orange/20 hover:shadow-xl hover:shadow-tekki-orange/30 hover:-translate-y-0.5"
          >
            Faire le diagnostic de ma marque
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <p className="text-sm text-tekki-blue/40">
            Gratuit · Sans engagement · Résultat en 24h
          </p>
        </motion.div>
      </div>
    </section>
  );
}
