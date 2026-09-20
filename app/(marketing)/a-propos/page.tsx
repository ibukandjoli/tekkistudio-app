// app/(marketing)/a-propos/page.tsx
'use client';

import Link from 'next/link';
import {
  Heart, Target, Award, Calendar, ArrowRight,
  Lightbulb, TrendingUp, Zap, Star,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const milestones = [
  { year: '2023', title: 'Création de TEKKI Studio', description: "Fondation de la première Fabrique de Marques de Niche d'Afrique de l'Ouest." },
  { year: '2023', title: "Lancement de Viens On S'Connaît", description: 'Création et lancement réussi de notre première marque de jeux de conversation.' },
  { year: '2024', title: "Lancement d'Amani", description: 'Développement et lancement de notre 2e marque, dédiée au bien-être féminin.' },
  { year: '2024', title: "Début de l'accompagnement", description: "Ouverture de notre offre d'accompagnement pour aider d'autres marques africaines." },
  { year: '2025', title: 'Expansion continue', description: 'Développement de nouvelles marques et accompagnement de plus de marques africaines vers le succès e-commerce.' },
  { year: '2026', title: "Lancement d'Itoko Beauty", description: 'Notre 3e marque maison, dédiée aux produits capillaires et accessoires, rejoint la famille TEKKI.' },
];

const expertiseCards = [
  {
    icon: Lightbulb,
    title: 'Fabrique de Marques',
    description: "Nous identifions des besoins non satisfaits sur le marché africain et créons des marques qui y répondent concrètement.",
    stats: [
      { value: '12 000+', label: 'produits vendus, toutes marques confondues' },
      { value: '7', label: "pays d'export" },
      { value: '3', label: 'marques créées en interne' },
    ],
    cta: { label: 'Découvrir nos marques', href: '/nos-marques' },
  },
  {
    icon: TrendingUp,
    title: 'Accompagnement E-commerce',
    description: "Nous aidons les marques africaines à atteindre leurs objectifs e-commerce en leur transmettant les stratégies qui ont fait le succès de nos propres marques.",
    stats: [
      { value: '+200%', label: 'de croissance CA en moyenne' },
      { value: '+10', label: 'marques accompagnées' },
      { value: '100%', label: 'de nos stratégies testées sur nos propres marques d\'abord' },
    ],
    cta: { label: 'Voir nos cas clients', href: '/cas-clients' },
  },
];

const approachItems = [
  { icon: Zap, title: "Testez d'abord, enseignez ensuite", body: "Chaque stratégie que nous recommandons a d'abord été testée sur nos propres marques. Nous ne vendons jamais de la théorie, uniquement des techniques qui ont généré des résultats mesurables." },
  { icon: Target, title: 'Expertise du marché africain', body: "Nous comprenons les spécificités du marché africain : paiements mobile money, logistique locale, comportements d'achat, réseaux sociaux privilégiés." },
  { icon: Award, title: 'Accompagnement complet', body: "De la création de votre site e-commerce à l'optimisation de vos campagnes publicitaires, nous vous accompagnons à chaque étape avec des stratégies éprouvées." },
];

const values = [
  { icon: Star, title: 'Authenticité', description: 'Nous ne vendons que ce que nous avons testé et validé sur nos propres marques.' },
  { icon: Target, title: 'Résultats', description: 'Notre succès se mesure à vos ventes, pas à nos promesses.' },
  { icon: Heart, title: 'Impact', description: 'Nous créons des solutions qui transforment positivement les marques africaines.' },
];

export default function AboutPage() {
  const [missionRef, missionInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [timelineRef, timelineInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [expertiseRef, expertiseInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [approachRef, approachInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [visionRef, visionInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <main className="font-home-body bg-tekki-cream">

      {/* ── Hero ────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-24 overflow-hidden bg-gradient-to-b from-tekki-orange/[0.06] to-tekki-cream">
        <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-tekki-orange/8 border border-tekki-orange/15 mb-6">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tekki-orange opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-tekki-orange" />
              </span>
              <span className="font-home-body text-sm font-medium text-tekki-orange tracking-wide">
                La Fabrique de Marques Africaines
              </span>
            </div>

            <h1 className="font-home-display text-[34px] sm:text-[42px] md:text-[48px] font-semibold text-tekki-ink tracking-tight mb-4 leading-[1.15]">
              À Propos de <span className="text-tekki-orange">TEKKI Studio</span>
            </h1>
            <p className="font-home-body text-[17px] text-tekki-ink-soft leading-relaxed max-w-xl mx-auto">
              Une fabrique de marques qui accompagne les marques africaines vers le succès e-commerce — avec des stratégies testées sur notre propre argent.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Mission ─────────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-white border-y border-tekki-ink/8">
        <div ref={missionRef} className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={missionInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="max-w-[760px] mx-auto"
          >
            <h2 className="font-home-display text-[28px] font-semibold text-tekki-ink tracking-tight text-center mb-10">
              Notre Mission
            </h2>
            <div className="bg-tekki-cream rounded-2xl p-8 md:p-9 border border-tekki-ink/8">
              <p className="font-home-body text-tekki-ink-soft text-[16px] leading-relaxed mb-4">
                La mission de TEKKI Studio a toujours été la même :{' '}
                <strong className="text-tekki-ink font-semibold">transformer les marques de produits africaines en succès commercial grâce à l&apos;e-commerce.</strong>{' '}
                Nous le faisons pour nos propres marques — Viens On S&apos;Connaît, Amani et Itoko Beauty — et pour celles de nos clients.
              </p>
              <p className="font-home-body text-tekki-ink-soft text-[16px] leading-relaxed mb-4">
                Notre expertise unique vient du fait que nous testons d&apos;abord toutes nos stratégies sur nos propres marques. Chaque technique de marketing, chaque optimisation de conversion, chaque stratégie de croissance que nous recommandons a déjà fait ses preuves chez nous, avant d&apos;être proposée à qui que ce soit.
              </p>
              <p className="font-home-body text-tekki-ink-soft text-[16px] leading-relaxed">
                Vous ne payez pas pour de la théorie ou des conseils génériques. Vous bénéficiez de stratégies testées, validées et optimisées sur le terrain africain, par des entrepreneurs qui comprennent vos défis parce qu&apos;ils les vivent quotidiennement.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Timeline ────────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-tekki-surface-warm border-b border-tekki-ink/8">
        <div ref={timelineRef} className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={timelineInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="font-home-display text-[28px] font-semibold text-tekki-ink tracking-tight text-center mb-14"
          >
            Notre Parcours
          </motion.h2>
          <div className="max-w-[720px] mx-auto relative pl-[46px]">
            <div className="absolute left-[15px] top-1.5 bottom-1.5 w-[2px] bg-tekki-ink/10" />
            {milestones.map((milestone, index) => (
              <motion.div
                key={`${milestone.year}-${milestone.title}`}
                initial={{ opacity: 0, y: 20 }}
                animate={timelineInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="relative mb-6 last:mb-0"
              >
                <span className="absolute -left-[46px] top-0.5 w-8 h-8 rounded-full bg-tekki-orange/8 border border-tekki-orange/25 flex items-center justify-center text-tekki-orange-deep">
                  <Calendar className="w-3.5 h-3.5" />
                </span>
                <div className="bg-white rounded-2xl border border-tekki-ink/8 p-5 md:p-[22px]">
                  <div className="font-home-mono text-[12.5px] font-semibold text-tekki-orange-deep mb-1">{milestone.year}</div>
                  <h3 className="font-home-display text-[16px] font-semibold text-tekki-ink mb-1.5">{milestone.title}</h3>
                  <p className="font-home-body text-[14.5px] text-tekki-ink-soft leading-relaxed">{milestone.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Double Expertise ────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-white">
        <div ref={expertiseRef} className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={expertiseInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="font-home-display text-[28px] font-semibold text-tekki-ink tracking-tight text-center mb-12"
          >
            Notre Double Expertise
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-[22px] max-w-[900px] mx-auto">
            {expertiseCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={expertiseInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.12 }}
                  className="bg-tekki-cream rounded-2xl p-7 md:p-8 border border-tekki-ink/8"
                >
                  <div className="w-[46px] h-[46px] rounded-xl bg-tekki-orange/8 flex items-center justify-center text-tekki-orange-deep mb-5">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-home-display text-[20px] font-semibold text-tekki-ink mb-2.5">{card.title}</h3>
                  <p className="font-home-body text-[14.5px] text-tekki-ink-soft leading-relaxed mb-5">{card.description}</p>
                  <div className="flex flex-col gap-2.5 pt-4 border-t border-tekki-ink/10 mb-5">
                    {card.stats.map((stat) => (
                      <div key={stat.label} className="flex items-baseline gap-2 font-home-body text-[13.5px] text-tekki-ink-soft">
                        <span className="font-home-mono text-[15px] font-semibold text-tekki-ink flex-shrink-0">
                          {stat.value.split(' ').map((part, i, arr) => (
                            <span key={i}>
                              {i > 0 && <span className="font-home-body"> </span>}
                              {part}
                            </span>
                          ))}
                        </span>
                        {stat.label}
                      </div>
                    ))}
                  </div>
                  <Link
                    href={card.cta.href}
                    className="inline-flex items-center gap-1.5 font-home-body text-[14px] font-semibold text-tekki-orange-deep hover:gap-2.5 transition-all"
                  >
                    {card.cta.label} <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Approche ────────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-tekki-surface-warm border-y border-tekki-ink/8">
        <div ref={approachRef} className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={approachInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="font-home-display text-[28px] font-semibold text-tekki-ink tracking-tight text-center mb-12"
          >
            Notre Approche Unique
          </motion.h2>
          <div className="flex flex-col gap-4 max-w-[760px] mx-auto">
            {approachItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={approachInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex gap-[18px] items-start bg-white rounded-2xl border border-tekki-ink/8 p-6"
                >
                  <div className="w-10 h-10 rounded-[10px] bg-tekki-orange/8 flex items-center justify-center text-tekki-orange-deep flex-shrink-0">
                    <Icon className="w-[17px] h-[17px]" />
                  </div>
                  <div>
                    <h3 className="font-home-display text-[16px] font-semibold text-tekki-ink mb-1.5">{item.title}</h3>
                    <p className="font-home-body text-[14.5px] text-tekki-ink-soft leading-relaxed">{item.body}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Vision & Valeurs ──────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-white">
        <div ref={visionRef} className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={visionInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="max-w-[640px] mx-auto text-center mb-9"
          >
            <h2 className="font-home-display text-[28px] font-semibold text-tekki-ink tracking-tight mb-3.5">
              Notre Vision
            </h2>
            <p className="font-home-body text-[15.5px] text-tekki-ink-soft leading-relaxed">
              Devenir la référence africaine en création de marques et en accompagnement e-commerce, reconnue pour transformer des marques locales en success stories régionales et internationales.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-[18px] max-w-[820px] mx-auto">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={visionInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center bg-tekki-cream rounded-2xl border border-tekki-ink/8 p-6"
                >
                  <div className="w-[42px] h-[42px] rounded-full bg-tekki-orange/8 flex items-center justify-center text-tekki-orange-deep mx-auto mb-3.5">
                    <Icon className="w-[18px] h-[18px]" />
                  </div>
                  <h3 className="font-home-display text-[15.5px] font-semibold text-tekki-ink mb-2">{value.title}</h3>
                  <p className="font-home-body text-[13.5px] text-tekki-ink-soft leading-relaxed">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA finale ──────────────────────────────────────── */}
      <section className="py-16 md:py-24 bg-tekki-orange relative overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[400px] h-[400px] rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute bottom-[-15%] left-[-5%] w-[300px] h-[300px] rounded-full bg-white/5 pointer-events-none" />

        <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-home-display text-[30px] md:text-[32px] font-semibold text-white tracking-tight mb-4 leading-tight">
              Prêt à transformer votre marque en success story e-commerce ?
            </h2>
            <p className="font-home-body text-white/[0.88] text-[15.5px] mb-8 max-w-xl mx-auto leading-relaxed">
              Découvrez nos formules d&apos;accompagnement et bénéficiez de stratégies testées sur nos propres marques.
            </p>
            <Link
              href="/diagnostic"
              className="inline-flex items-center justify-center gap-2 px-[28px] py-[14px] bg-white hover:shadow-xl hover:shadow-black/25 text-tekki-orange-deep rounded-full font-home-body font-semibold text-[15.5px] transition-all duration-300 group hover:-translate-y-0.5"
            >
              Faire le diagnostic gratuit
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
