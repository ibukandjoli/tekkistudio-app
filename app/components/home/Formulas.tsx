// app/components/home/Formulas.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle, Search, Zap, Rocket, Globe, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const FormulasSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.05
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const formulas = [
    {
      id: 'audit-depart',
      icon: <Search className="w-7 h-7" />,
      name: 'Audit de Départ',
      tagline: 'Comprenez votre potentiel',
      description: 'Un diagnostic complet de votre présence digitale pour savoir exactement quoi faire ensuite.',
      price: '245 000F CFA',
      priceNote: 'Remboursable si formule souscrite',
      duration: '1 semaine',
      idealFor: [
        'Vous ne savez pas par oà¹ commencer',
        'Vous voulez un plan clair avant d\'investir',
        'Vous avez besoin d\'un regard expert'
      ],
      includes: [
        'Audit complet de votre présence digitale',
        'Analyse de 3-5 concurrents directs',
        'Rapport détaillé de 15-20 pages',
        'Session de présentation de 90 minutes',
        'Roadmap personnalisé sur 6 mois'
      ],
      color: 'from-emerald-500 to-teal-500',
      bgGradient: 'from-emerald-50 to-teal-50',
      borderColor: 'border-emerald-200',
      hoverBorder: 'hover:border-emerald-400'
    },
    {
      id: 'demarrage',
      icon: <Zap className="w-7 h-7" />,
      name: 'Formule Démarrage',
      tagline: 'Lancez votre présence en ligne',
      description: 'Créez votre boutique en ligne professionnelle et accueillez vos premiers clients digitaux.',
      price: 'À partir de 500 000F CFA',
      priceNote: 'Devis personnalisé selon vos besoins',
      duration: '4-6 semaines',
      idealFor: [
        'Vous n\'avez pas encore de site e-commerce',
        'Votre site actuel ne vend pas',
        'Vous vendez uniquement via WhatsApp/Instagram'
      ],
      includes: [
        'Boutique en ligne moderne et professionnelle',
        'Design adapté aux téléphones (80% du trafic)',
        'Optimisation pour les conversions (ventes)',
        'Référencement sur Google et ChatGPT',
        'Formation prise en main complète'
      ],
      color: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50',
      borderColor: 'border-blue-200',
      hoverBorder: 'hover:border-blue-400'
    },
    {
      id: 'croissance',
      icon: <Rocket className="w-7 h-7" />,
      name: 'Formule Croissance',
      tagline: 'Multipliez vos ventes',
      badge: 'POPULAIRE',
      description: 'Transformez les visiteurs de votre site en clients fidèles et faites croître vos ventes de manière systématique.',
      price: 'À partir de 1,5M FCFA',
      priceNote: 'Devis personnalisé selon vos besoins',
      duration: '3 mois',
      idealFor: [
        'Vous avez un site mais peu de ventes',
        'Vous recevez du trafic qui ne convertit pas',
        'Vous voulez automatiser votre acquisition clients'
      ],
      includes: [
        'Tout de la Formule Démarrage (si besoin)',
        'Diagnostic conversion complet',
        'Stratégie publicités Meta/TikTok/Google Ads',
        'Système email/WhatsApp marketing automatisé',
        'Accompagnement de 3 mois (2 sessions/mois)'
      ],
      color: 'from-orange-500 to-red-500',
      bgGradient: 'from-orange-50 to-red-50',
      borderColor: 'border-orange-300',
      hoverBorder: 'hover:border-orange-500',
      featured: true
    },
    {
      id: 'expansion',
      icon: <Globe className="w-7 h-7" />,
      name: 'Formule Expansion',
      tagline: 'Rayonnez à l\'international',
      description: 'Devenez une référence dans votre secteur et vendez au-delà des frontières africaines.',
      price: 'À partir de 2,5M FCFA',
      priceNote: 'Devis personnalisé selon vos besoins',
      duration: '6-12 mois',
      idealFor: [
        'Vous générez déjà +5M FCFA/mois',
        'Vous voulez conquérir l\'international',
        'Vous visez le statut de marque premium'
      ],
      includes: [
        'Tout de la formule Croissance',
        'Stratégie expansion régionale/internationale',
        'Direction artistique de marque premium',
        'Développement de solutions sur-mesure',
        'Accompagnement de 6 mois (1 session/semaine)'
      ],
      color: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50',
      borderColor: 'border-purple-200',
      hoverBorder: 'hover:border-purple-400'
    }
  ];

  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-african-warm to-white relative overflow-hidden">
      {/* Décoration de fond */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5">
        <div className="absolute top-20 right-10 w-96 h-96 bg-[#ff7f50] rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#0f4c81] rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div 
          className="text-center mb-16 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 bg-[#ff7f50]/10 border border-[#ff7f50]/20 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-[#ff7f50]" />
            <span className="text-[#ff7f50] text-xs font-bold tracking-wider uppercase">
              Nos Offres
            </span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold text-[#0f4c81] mb-4">
            Choisissez votre niveau d'ambition
          </h2>
          <p className="text-xl text-gray-600">
            Du diagnostic initial à l'expansion internationale, une offre adaptée 
            à chaque étape de votre croissance
          </p>
        </motion.div>

        {/* Grille des formules */}
        <motion.div 
          ref={ref}
          className="grid md:grid-cols-2 gap-8 max-w-7xl mx-auto mb-12"
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={containerVariants}
        >
          {formulas.map((formula) => (
            <motion.div
              key={formula.id}
              className={`bg-white rounded-3xl shadow-lg border-2 ${formula.borderColor} ${formula.hoverBorder} transition-all duration-300 overflow-hidden group hover:shadow-2xl relative ${formula.featured ? 'md:scale-105 z-10' : ''}`}
              variants={cardVariants}
              whileHover={{ y: -5 }}
            >
              {/* Badge populaire si featured */}
              {formula.badge && (
                <div className="absolute -right-12 top-8 bg-[#ff7f50] text-white px-12 py-1.5 text-xs font-bold rotate-45 shadow-lg z-20">
                  {formula.badge}
                </div>
              )}

              {/* Header avec gradient */}
              <div className={`bg-gradient-to-r ${formula.color} p-8 text-white relative overflow-hidden`}>
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                <div className="relative z-10">
                  <div className={`inline-block p-3 bg-white/20 backdrop-blur-sm rounded-xl mb-4`}>
                    {formula.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-1">{formula.name}</h3>
                  <p className="text-white/90 text-sm mb-5">{formula.tagline}</p>
                  <div className="space-y-1">
                    <p className="text-3xl font-bold">{formula.price}</p>
                    <p className="text-sm text-white/80">{formula.priceNote}</p>
                    <p className="text-sm text-white/80 flex items-center gap-1">
                      <span>â±</span> {formula.duration}
                    </p>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-8">
                {/* Description */}
                <p className="text-gray-700 mb-6 leading-relaxed">
                  {formula.description}
                </p>

                {/* Idéal pour */}
                <div className={`bg-gradient-to-br ${formula.bgGradient} rounded-xl p-5 mb-6 border ${formula.borderColor}`}>
                  <h4 className={`font-semibold text-[#0f4c81] mb-3 text-sm uppercase tracking-wide`}>
                    Idéal pour votre marque si :
                  </h4>
                  <ul className="space-y-2">
                    {formula.idealFor.map((item, idx) => (
                      <li key={idx} className="flex items-start text-sm text-gray-700">
                        <CheckCircle className={`w-4 h-4 text-emerald-500 mt-0.5 mr-2 flex-shrink-0`} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Ce qui est inclus */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">
                    Ce qui est inclus :
                  </h4>
                  <ul className="space-y-2.5">
                    {formula.includes.map((item, idx) => (
                      <li key={idx} className="flex items-start text-sm text-gray-600">
                        <span className={`text-emerald-500 mr-2 font-bold`}>✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <Link
                  href={`/nos-formules/${formula.id}`}
                  className={`block w-full text-center bg-gradient-to-r ${formula.color} hover:opacity-90 text-white py-3.5 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg group/btn`}
                >
                  <span className="flex items-center justify-center">
                    En savoir plus sur cette offre
                    <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div 
          className="text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <div className="bg-gradient-to-r from-gray-50 to-white rounded-3xl p-8 md:p-12 border-2 border-gray-200 shadow-lg">
            <h3 className="text-2xl md:text-3xl font-bold text-[#0f4c81] mb-4">
              Pas sûr de votre choix ?
            </h3>
            <p className="text-gray-600 mb-8 text-lg leading-relaxed">
              Réservez un appel gratuit de 30 minutes avec notre équipe. Nous analyserons 
              votre situation et vous conseillerons la formule la plus adaptée à vos objectifs 
              et votre budget.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <a
                  href="https://wa.me/221781362728?text=Bonjour%20TEKKI%20Studio%20!%20J%27aimerais%20discuter%20pour%20savoir%20quelle%20formule%20me%20convient%20le%20mieux."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center bg-[#ff7f50] hover:bg-[#ff6b3d] text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-xl hover:shadow-2xl"
                >
                  Réserver un appel gratuit
                  <ArrowRight className="w-5 h-5 ml-2" />
                </a>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/nos-formules"
                  className="inline-flex items-center justify-center bg-white hover:bg-gray-50 border-2 border-[#0f4c81] text-[#0f4c81] px-8 py-4 rounded-xl font-bold text-lg transition-all"
                >
                  Comparer toutes les formules
                </Link>
              </motion.div>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                <span>Sans engagement</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                <span>Devis gratuit sous 24h</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                <span>100% personnalisé</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FormulasSection;