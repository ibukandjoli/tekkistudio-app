// app/components/home/v2/CTAFinalSection.tsx
'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { trackCustomEvent } from '@/app/lib/meta-events';

export default function CTAFinalSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section className="py-16 md:py-24 bg-tekki-orange relative overflow-hidden">
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
          <h2 className="font-home-display text-[32px] font-semibold text-white tracking-tight mb-4 leading-tight">
            Prêt à vendre plus, sans tout faire reposer sur vous ?
          </h2>

          <p className="font-home-body text-white/[0.88] text-[15.5px] mb-8 max-w-xl mx-auto leading-relaxed">
            On commence par un diagnostic gratuit de votre marque. Réponse personnalisée sous 24h.
          </p>

          <Link
            href="/diagnostic?offre=diagnostic"
            onClick={() => trackCustomEvent('pricing_cta_click', { location: 'final_cta', offre: 'diagnostic' })}
            className="inline-flex items-center justify-center gap-2 px-[28px] py-[14px] bg-white hover:shadow-xl hover:shadow-black/25 text-tekki-orange-deep rounded-full font-home-body font-semibold text-[15.5px] transition-all duration-300 group hover:-translate-y-0.5"
          >
            Faire le diagnostic gratuitement
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
