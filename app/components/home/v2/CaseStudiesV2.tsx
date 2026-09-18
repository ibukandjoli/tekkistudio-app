// app/components/home/v2/CaseStudiesV2.tsx
'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const stats = [
  { value: '+200%', label: 'de ventes en plus, en moyenne, après notre accompagnement' },
  { value: '+12 000', label: 'produits vendus pour nos marques accompagnées' },
  { value: '4.9/5', label: 'note moyenne donnée par nos clientes' },
];

const CaseStudiesV2 = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section className="py-12 md:py-14 bg-tekki-surface border-y border-tekki-ink/8">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={ref}
          className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-8"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="border-l-2 border-tekki-orange pl-4"
            >
              <span className="block font-home-mono text-[24px] sm:text-[28px] font-semibold text-tekki-ink tabular-nums mb-1">
                {stat.value}
              </span>
              <span className="font-home-body text-[13px] text-tekki-ink-soft leading-snug">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CaseStudiesV2;
