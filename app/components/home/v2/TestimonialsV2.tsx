// app/components/home/v2/TestimonialsV2.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { trackCustomEvent } from '@/app/lib/meta-events';

const cases = [
  {
    slug: 'abarings',
    tag: 'Bijouterie artisanale',
    name: 'Abarings',
    metrics: [
      { value: '+150%', label: 'ventes internationales' },
      { value: '100%', label: 'commandes automatisées' },
    ],
    quote:
      "Avant, je gérais chaque commande à la main, surtout celles de l'international. Aujourd'hui c'est le système qui vend pendant que je crée.",
    author: 'Fatou D.',
    role: 'Fondatrice',
    image: '/images/testimonials/fatou.jpg',
    hasDetail: true,
  },
  {
    slug: 'ahovi-cosmetics',
    tag: 'Cosmétiques naturels',
    name: 'Ahovi Cosmetics',
    metrics: [
      { value: '+180%', label: 'croissance CA' },
      { value: '5', label: 'nouvelles villes touchées' },
    ],
    quote:
      "Je ne cherchais pas juste un site. Je cherchais à vendre au-delà de mon quartier. C'est ce qui s'est passé en quelques mois.",
    author: 'Katia K.',
    role: 'Fondatrice',
    image: null,
    // Pas encore de page /cas-clients/ahovi-cosmetics rédigée — le lien retombe sur la liste.
    hasDetail: false,
  },
  {
    slug: 'momo-le-bottier',
    tag: 'Maroquinerie',
    name: 'Momo Le Bottier',
    metrics: [
      { value: '10', label: 'pays livrés' },
      { value: '100%', label: 'ventes automatisées' },
    ],
    quote:
      "Nos clients partout dans le monde commandent désormais 24h/24, sans qu'on doive être derrière chaque message.",
    author: 'Maguette D.',
    role: 'Co-fondateur',
    image: '/images/testimonials/maguette.jpg',
    hasDetail: true,
  },
];

const TestimonialsV2 = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="cases" className="py-16 md:py-24 bg-white">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-[600px] mb-12"
        >
          <h2 className="font-home-display text-[30px] font-semibold text-tekki-ink tracking-tight mb-3.5">
            Ce que ça donne, concrètement.
          </h2>
          <p className="font-home-body text-[16px] text-tekki-ink-soft">
            Trois marques, trois points de départ différents — le même travail de fond : transformer la visibilité en ventes mesurables.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-[22px]">
          {cases.map((c, index) => (
            <motion.div
              key={c.slug}
              initial={{ opacity: 0, y: 25 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="bg-tekki-cream border border-tekki-ink/8 rounded-2xl p-[26px] flex flex-col gap-4 hover:shadow-lg hover:shadow-tekki-ink/5 transition-all duration-300"
            >
              <div>
                <span className="font-home-body text-[12.5px] font-semibold text-tekki-orange-deep">
                  {c.tag}
                </span>
                <h3 className="font-home-display text-[19px] font-semibold text-tekki-ink mt-1">{c.name}</h3>
              </div>

              <div className="flex gap-[18px] py-3.5 border-y border-tekki-ink/10">
                {c.metrics.map((m) => (
                  <div key={m.label}>
                    <span className="block font-home-mono text-[18px] font-semibold text-tekki-ink tabular-nums">
                      {m.value}
                    </span>
                    <span className="font-home-body text-[11.5px] text-tekki-ink-soft">{m.label}</span>
                  </div>
                ))}
              </div>

              <blockquote className="font-home-body text-[14.5px] text-tekki-ink-soft leading-relaxed flex-grow italic">
                &ldquo;{c.quote}&rdquo;
              </blockquote>

              <div className="flex items-center gap-3">
                {c.image ? (
                  <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 relative">
                    <Image src={c.image} alt={c.author} fill className="object-cover" />
                  </div>
                ) : (
                  <div className="w-9 h-9 rounded-full bg-tekki-orange/15 text-tekki-orange-deep flex items-center justify-center flex-shrink-0 font-home-display font-semibold text-sm">
                    {c.author.charAt(0)}
                  </div>
                )}
                <span className="font-home-body text-[13px] font-semibold text-tekki-ink">
                  {c.author} — {c.role}
                </span>
              </div>

              <Link
                href={c.hasDetail ? `/cas-clients/${c.slug}` : '/cas-clients'}
                onClick={() => trackCustomEvent('case_study_click', { case_slug: c.slug })}
                className="font-home-body text-sm font-semibold text-tekki-ink-soft hover:text-tekki-orange transition-colors"
              >
                Voir le cas complet →
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsV2;
