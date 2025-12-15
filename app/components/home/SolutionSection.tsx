// app/components/home/SolutionSection.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { Target, Rocket, TrendingUp, ArrowRight, Lightbulb, CheckCircle2, Store } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const SolutionSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const pillars = [
    {
      icon: <Store className="w-8 h-8" />,
      title: "Boutique E-commerce",
      subtitle: "Automatisez vos ventes, libérez votre temps",
      description: "Fini les commandes gérées dans les DM. Nous créons votre boutique en ligne professionnelle qui vend pour vous 24h/24.",
      benefits: [
        "Design moderne et professionnel",
        "Catalogue produits optimisé",
        "Gestion des commandes simplifiée"
      ]
    },
    {
      icon: <Rocket className="w-8 h-8" />,
      title: "Identité de Marque",
      subtitle: "Inspirez confiance au premier regard",
      description: "Une image professionnelle qui reflète enfin la qualité de vos produits et vous différencie de la concurrence.",
      benefits: [
        "Design moderne et cohérent",
        "Photos et visuels de qualité",
        "Expérience client premium"
      ]
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Acquisition & Croissance",
      subtitle: "Transformez votre audience en clients",
      description: "Nous mettons en place les stratégies idoines pour attirer du trafic qualifié et le convertir en ventes régulières.",
      benefits: [
        "Publicité Meta, Google & TikTok",
        "Marketing WhatsApp automatisé",
        "Optimisation continue des conversions"
      ]
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-[#0a1628] via-[#0f4c81] to-[#0a1628] relative overflow-hidden">
      {/* Décoration de fond - Grille subtile */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03]" style={{
        backgroundImage: 'radial-gradient(circle, #fe6117 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }}></div>

      {/* Grands cercles de lumière */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#fe6117]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#fe6117]/5 rounded-full blur-3xl"></div>

      <div className="w-full px-6 md:px-12 lg:px-16 xl:px-20 relative z-10">
        {/* En-tête */}
        <motion.div
          ref={ref}
          className="text-center mb-16 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 bg-[#fe6117]/10 border border-[#fe6117]/30 rounded-full px-5 py-2.5 mb-6 backdrop-blur-sm">
            <Lightbulb className="w-4 h-4 text-[#fe6117]" />
            <span className="text-[#fe6117] text-sm font-bold tracking-wide uppercase">
              Notre approche
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            Notre méthode en <span className="text-[#fe6117]">3 piliers</span> <br className="hidden md:block"/>
            pour transformer votre marque
          </h2>

          <p className="text-xl text-white/80 leading-relaxed">
            Une approche complète et éprouvée qui résout directement vos <span className="font-semibold text-white">3 obstacles majeurs</span>.
          </p>
        </motion.div>

        {/* Grille des 3 piliers - Même structure que ProblemSection */}
        <motion.div
          className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-20"
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={containerVariants}
        >
          {pillars.map((pillar, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative"
            >
              {/* Numéro du pilier - Même style que ProblemSection */}
              <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-gradient-to-br from-[#fe6117] to-[#ff8c4d] flex items-center justify-center text-white font-bold text-xl shadow-lg z-10">
                {index + 1}
              </div>

              {/* Card du pilier */}
              <div className="relative bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:border-[#fe6117]/50 hover:bg-white/10 transition-all duration-300 h-full">
                {/* Icône */}
                <div className="mb-6">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#fe6117]/20 to-[#ff8c4d]/20 flex items-center justify-center text-[#fe6117] group-hover:scale-110 transition-transform duration-300">
                    {pillar.icon}
                  </div>
                </div>

                {/* Titre du pilier */}
                <h3 className="text-xl font-bold text-white mb-2 leading-snug">
                  {pillar.title}
                </h3>

                {/* Sous-titre accrocheur */}
                <p className="text-[#fe6117] font-semibold mb-4">
                  {pillar.subtitle}
                </p>

                {/* Description */}
                <p className="text-white/70 leading-relaxed mb-6">
                  {pillar.description}
                </p>

                {/* Liste des bénéfices */}
                <div className="pt-6 border-t border-white/10 space-y-3">
                  {pillar.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#fe6117] flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-white/80">{benefit}</span>
                    </div>
                  ))}
                </div>

                {/* Ligne décorative animée - Même style que ProblemSection */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#fe6117] to-[#ff8c4d] rounded-b-2xl scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Section "Pourquoi ça fonctionne" - Contraste fort */}
        <motion.div
          className="max-w-4xl mx-auto mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <div className="relative bg-gradient-to-br from-[#fe6117] to-[#ff8c4d] rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden">
            {/* Décoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl"></div>

            <div className="relative z-10">
              {/* Message fort */}
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Pourquoi notre méthode fonctionne ?
              </h3>

              <p className="text-lg text-white/95 leading-relaxed mb-8">
                Parce que nous l'avons appliquée à <span className="font-bold">nos propres marques</span> et avons vu les résultats.
                Nous ne sommes pas une simple agence qui théorise et tâtonne. <span className="font-bold">Nous vivons les mêmes défis que vous</span> et nous savons exactement ce qui fonctionne.
              </p>

              {/* Statistiques clés */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="text-4xl font-bold text-white mb-2">+10</div>
                  <p className="text-white/80 text-sm">Marques africaines accompagnées</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="text-4xl font-bold text-white mb-2">+8000</div>
                  <p className="text-white/80 text-sm">Produits de nos marques vendus en 2 ans</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="text-4xl font-bold text-white mb-2">3</div>
                  <p className="text-white/80 text-sm">Marchés adressés (Sénégal, Côte d'Ivoire, France)</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA Section - Design épuré */}
        <motion.div
          className="text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Êtes-vous prêt à faire briller votre marque ?
          </h3>

          <p className="text-lg text-white/80 mb-8">
            Découvrez quelle formule correspond le mieux à votre niveau d'ambition.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/nos-formules"
                className="inline-flex items-center justify-center bg-[#fe6117] hover:bg-[#e55710] text-white px-10 py-5 rounded-full font-bold text-lg transition-all shadow-xl hover:shadow-2xl"
              >
                Découvrir nos formules
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <a
                href="https://wa.me/221781362728?text=Bonjour%20TEKKI%20Studio%20!%20J%27aimerais%20discuter%20de%20ma%20marque%20et%20savoir%20comment%20vous%20pouvez%20m%27aider."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white px-10 py-5 rounded-full font-bold text-lg transition-all"
              >
                Réserver un appel gratuit
              </a>
            </motion.div>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-white/70">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#fe6117]" />
              <span>Sans engagement</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#fe6117]" />
              <span>Diagnostic gratuit</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#fe6117]" />
              <span>Réponse sous 24h</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SolutionSection;
