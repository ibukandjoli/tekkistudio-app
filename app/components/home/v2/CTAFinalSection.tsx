// app/components/home/v2/CTAFinalSection.tsx
'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export default function CTAFinalSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section className="py-16 md:py-24 bg-tekki-orange relative overflow-hidden">
      {/* Subtle pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Decorative circles */}
      <div className="absolute top-[-20%] right-[-10%] w-[400px] h-[400px] rounded-full bg-white/5 pointer-events-none" />
      <div className="absolute bottom-[-15%] left-[-5%] w-[300px] h-[300px] rounded-full bg-white/5 pointer-events-none" />

      <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-5 leading-tight">
            Prêt à vendre plus,
            <br className="hidden sm:block" />
            sans travailler plus ?
          </h2>

          <p className="text-white/80 text-lg md:text-xl mb-10 max-w-xl mx-auto leading-relaxed">
            On commence par un diagnostic gratuit de votre marque. 10 à 15 minutes pour identifier ce qui bloque vos ventes et ce qu&apos;on peut faire pour vous.
          </p>

          <Link
            href="/diagnostic"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-tekki-orange rounded-full font-bold text-lg transition-all duration-300 group hover:shadow-xl hover:shadow-black/10 hover:-translate-y-0.5"
          >
            Faire le diagnostic gratuitement
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>

          <p className="mt-5 text-white/50 text-sm">
            Sans engagement · Réponse sous 24h · 100% personnalisé
          </p>
        </motion.div>
      </div>
    </section>
  );
}
