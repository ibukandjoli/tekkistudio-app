// app/a-propos/page.tsx
'use client';

import React from 'react';
import {
  Heart, Target, Award, Calendar, ArrowRight,
  ExternalLink, Lightbulb, TrendingUp, Zap, Star
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1 } }),
};

const AboutPage = () => {
  const [missionRef, missionInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [valuesRef, valuesInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const milestones = [
    { year: '2023', title: 'Création de TEKKI Studio', description: "Fondation de la première Fabrique de Marques de Niche d'Afrique de l'Ouest." },
    { year: '2023', title: "Lancement de VIENS ON S'CONNAÎT", description: 'Création et lancement réussi de notre première marque de jeux de conversation.' },
    { year: '2024', title: 'Lancement de AMANI', description: 'Développement et lancement de notre 2e marque dédiée au bien-être féminin.' },
    { year: '2024', title: "Début de l'accompagnement", description: "Ouverture de notre offre d'accompagnement pour aider d'autres marques africaines." },
    { year: '2025', title: 'Expansion continue', description: "Développement de nouvelles marques et accompagnement de plus de marques africaines vers le succès e-commerce." },
  ];

  return (
    <main className="font-body bg-tekki-cream">

      {/* ── Hero ────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-tekki-orange/[0.04] rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-tekki-blue/[0.03] rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible"
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-tekki-orange/8 border border-tekki-orange/15 mb-8">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tekki-orange opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-tekki-orange" />
              </span>
              <span className="text-sm font-medium text-tekki-orange tracking-wide">La Fabrique de Marques Africaines</span>
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-tekki-blue leading-tight tracking-tight mb-6">
              À Propos de <span className="text-tekki-orange">TEKKI Studio</span>
            </h1>
            <p className="text-lg md:text-xl text-tekki-blue/60 leading-relaxed">
              Une fabrique de marques qui accompagne les marques africaines vers le succès e-commerce — avec des stratégies testées sur notre propre argent.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Mission ─────────────────────────────────────────── */}
      <section className="py-20 bg-white border-y border-tekki-blue/8">
        <div ref={missionRef} className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeUp} initial="hidden" animate={missionInView ? 'visible' : 'hidden'}
            className="max-w-3xl mx-auto"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-tekki-blue text-center mb-10">
              Notre Mission
            </h2>
            <div className="bg-tekki-cream rounded-2xl p-8 border border-tekki-blue/8">
              <p className="text-tekki-blue/70 text-lg leading-relaxed mb-6">
                <strong className="text-tekki-blue">TEKKI Studio</strong> est une fabrique de marques africaines qui crée ses propres marques tout en accompagnant d'autres marques du continent à devenir des success stories e-commerce.
              </p>
              <p className="text-tekki-blue/70 text-lg leading-relaxed mb-6">
                Notre expertise unique provient du fait que nous testons d'abord toutes nos stratégies sur nos propres marques. Chaque technique de marketing, chaque optimisation de conversion, chaque stratégie de croissance que nous recommandons a déjà fait ses preuves sur VIENS ON S'CONNAÎT, AMANI ou nos autres marques.
              </p>
              <p className="text-tekki-blue/70 text-lg leading-relaxed">
                Vous ne payez pas pour de la théorie ou des conseils génériques. Vous bénéficiez de stratégies testées, validées et optimisées sur le terrain africain, par des entrepreneurs qui comprennent vos défis parce qu'ils les vivent quotidiennement.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Timeline ────────────────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="font-heading text-3xl md:text-4xl font-bold text-tekki-blue text-center mb-14"
          >
            Notre Parcours
          </motion.h2>
          <div className="max-w-3xl mx-auto relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-tekki-blue/10 hidden md:block" />
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                custom={index} variants={fadeUp} initial="hidden"
                whileInView="visible" viewport={{ once: true }}
                className="flex gap-8 mb-10 last:mb-0 group"
              >
                <div className="hidden md:flex flex-col items-center">
                  <div className="w-12 h-12 bg-tekki-blue rounded-full flex items-center justify-center text-white flex-shrink-0 group-hover:bg-tekki-orange transition-colors duration-300">
                    <Calendar className="w-5 h-5" />
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-tekki-blue/8 shadow-sm hover:shadow-md transition-shadow w-full group-hover:border-tekki-orange/20">
                  <div className="text-tekki-orange font-bold text-sm mb-1">{milestone.year}</div>
                  <h3 className="font-heading text-lg font-bold text-tekki-blue mb-2">{milestone.title}</h3>
                  <p className="text-tekki-blue/60 leading-relaxed">{milestone.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Double Expertise ────────────────────────────────── */}
      <section className="py-20 bg-white border-y border-tekki-blue/8">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="font-heading text-3xl md:text-4xl font-bold text-tekki-blue text-center mb-12"
          >
            Notre Double Expertise
          </motion.h2>
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
            {/* Fabrique */}
            <motion.div
              variants={fadeUp} custom={0} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="bg-tekki-cream rounded-2xl p-8 border border-tekki-blue/8 hover:border-tekki-orange/20 transition-colors group"
            >
              <div className="w-14 h-14 bg-tekki-orange/10 rounded-xl flex items-center justify-center text-tekki-orange mb-5 group-hover:bg-tekki-orange group-hover:text-white transition-all">
                <Lightbulb className="w-7 h-7" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-tekki-blue mb-4">Fabrique de Marques</h3>
              <p className="text-tekki-blue/60 mb-5 leading-relaxed">
                Nous identifions des besoins non satisfaits sur le marché africain et créons des marques qui y répondent concrètement.
              </p>
              <ul className="space-y-2 mb-6">
                {['+8 000 produits vendus', '7 pays d\'export', '+95% de satisfaction client'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-tekki-blue/70">
                    <span className="w-1.5 h-1.5 rounded-full bg-tekki-orange flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/nos-marques" className="inline-flex items-center gap-2 font-semibold text-tekki-orange hover:gap-3 transition-all text-sm">
                Découvrir nos marques <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            {/* Accompagnement */}
            <motion.div
              variants={fadeUp} custom={1} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="bg-tekki-cream rounded-2xl p-8 border border-tekki-blue/8 hover:border-tekki-orange/20 transition-colors group"
            >
              <div className="w-14 h-14 bg-tekki-orange/10 rounded-xl flex items-center justify-center text-tekki-orange mb-5 group-hover:bg-tekki-orange group-hover:text-white transition-all">
                <TrendingUp className="w-7 h-7" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-tekki-blue mb-4">Accompagnement E-commerce</h3>
              <p className="text-tekki-blue/60 mb-5 leading-relaxed">
                Nous aidons les marques africaines à atteindre leurs objectifs e-commerce en leur transmettant les stratégies qui ont fait le succès de nos propres marques.
              </p>
              <ul className="space-y-2 mb-6">
                {['+200% de croissance CA en moyenne', 'Stratégies testées et validées', '100% de satisfaction client'].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-tekki-blue/70">
                    <span className="w-1.5 h-1.5 rounded-full bg-tekki-orange flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/cas-clients" className="inline-flex items-center gap-2 font-semibold text-tekki-orange hover:gap-3 transition-all text-sm">
                Voir nos cas clients <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Approche ────────────────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="font-heading text-3xl md:text-4xl font-bold text-tekki-blue text-center mb-12"
          >
            Notre Approche Unique
          </motion.h2>
          <div className="max-w-3xl mx-auto space-y-5">
            {[
              { icon: <Zap className="w-6 h-6" />, title: "Testez d'abord, enseignez ensuite", body: "Chaque stratégie que nous recommandons a d'abord été testée sur nos propres marques. Nous ne vendons jamais de la théorie, uniquement des techniques qui ont généré des résultats mesurables." },
              { icon: <Target className="w-6 h-6" />, title: 'Expertise du marché africain', body: "Nous comprenons les spécificités du marché africain : paiements mobile money, logistique locale, comportements d'achat, réseaux sociaux privilégiés." },
              { icon: <Award className="w-6 h-6" />, title: 'Accompagnement complet', body: "De la création de votre site e-commerce à l'optimisation de vos campagnes publicitaires, nous vous accompagnons à chaque étape avec des stratégies éprouvées." },
            ].map((item, index) => (
              <motion.div
                key={index} custom={index} variants={fadeUp} initial="hidden"
                whileInView="visible" viewport={{ once: true }}
                className="bg-white rounded-2xl p-7 border border-tekki-blue/8 flex gap-5 group hover:border-tekki-orange/20 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-tekki-orange/8 flex items-center justify-center text-tekki-orange flex-shrink-0 group-hover:bg-tekki-orange group-hover:text-white transition-all">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-heading text-xl font-bold text-tekki-blue mb-2">{item.title}</h3>
                  <p className="text-tekki-blue/60 leading-relaxed">{item.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Valeurs ─────────────────────────────────────────── */}
      <section ref={valuesRef} className="py-20 bg-white border-y border-tekki-blue/8">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeUp} initial="hidden" animate={valuesInView ? 'visible' : 'hidden'}
            className="text-center mb-12"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-tekki-blue mb-4">Notre Vision</h2>
            <p className="text-tekki-blue/60 text-lg max-w-3xl mx-auto leading-relaxed">
              Devenir la référence africaine en création de marques et en accompagnement e-commerce, reconnue pour transformer des marques locales en success stories régionales et internationales.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { icon: <Star className="w-7 h-7" />, title: 'Authenticité', description: 'Nous ne vendons que ce que nous avons testé et validé sur nos propres marques.' },
              { icon: <Target className="w-7 h-7" />, title: 'Résultats', description: 'Notre succès se mesure à vos ventes, pas à nos promesses.' },
              { icon: <Heart className="w-7 h-7" />, title: 'Impact', description: 'Nous créons des solutions qui transforment positivement les marques africaines.' },
            ].map((value, index) => (
              <motion.div
                key={index} custom={index} variants={fadeUp}
                initial="hidden" animate={valuesInView ? 'visible' : 'hidden'}
                className="text-center p-7 bg-tekki-cream rounded-2xl border border-tekki-blue/8 hover:border-tekki-orange/20 transition-colors group"
              >
                <div className="w-16 h-16 bg-tekki-orange/8 rounded-full flex items-center justify-center mx-auto mb-4 text-tekki-orange group-hover:bg-tekki-orange group-hover:text-white transition-all">
                  {value.icon}
                </div>
                <h3 className="font-heading text-xl font-bold text-tekki-blue mb-2">{value.title}</h3>
                <p className="text-tekki-blue/60 text-sm leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────── */}
      <section className="py-20 bg-tekki-blue border-b border-white/10 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
              Prêt à transformer votre marque en{' '}
              <span className="text-tekki-orange">success story e-commerce</span> ?
            </h2>
            <p className="text-lg text-white/60 mb-10 max-w-xl mx-auto leading-relaxed">
              Découvrez nos formules d'accompagnement et bénéficiez de stratégies testées sur nos propres marques.
            </p>

            <div className="flex justify-center">
              <Link
                href="/diagnostic"
                className="inline-flex items-center justify-center bg-tekki-orange hover:bg-tekki-orange/90 text-white px-8 py-4 rounded-full font-bold text-base transition-all shadow-[0_0_30px_rgba(234,88,12,0.3)] hover:shadow-[0_0_40px_rgba(234,88,12,0.4)] hover:-translate-y-0.5 group"
              >
                Faire le diagnostic gratuit
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
