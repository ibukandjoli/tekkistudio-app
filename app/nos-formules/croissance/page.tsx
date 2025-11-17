// app/nos-formules/croissance/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Rocket,
  CheckCircle,
  Clock,
  TrendingUp,
  Target,
  Zap,
  Users,
  BarChart,
  Mail,
  MessageCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

const CroissancePage = () => {
  const deliverables = [
    {
      icon: <Target className="w-6 h-6" />,
      title: "Diagnostic conversion complet",
      description: "Analyse approfondie de votre tunnel de vente et identification des points de friction"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Stratégie publicités Meta/TikTok/Google",
      description: "Campagnes optimisées pour le marché africain avec ciblage précis"
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email & WhatsApp marketing automatisé",
      description: "Séquences automatisées pour convertir et fidéliser vos clients"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Programme d'influence & ambassadeurs",
      description: "Stratégie micro-influenceurs et système d'affiliation rentable"
    },
    {
      icon: <BarChart className="w-6 h-6" />,
      title: "Analytics & optimisation continue",
      description: "Dashboards personnalisés et optimisation basée sur les données"
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "Accompagnement 3 mois",
      description: "2 sessions stratégiques par mois + support illimité par WhatsApp"
    }
  ];

  const results = [
    "Doublement des ventes en 90 jours (ou accompagnement prolongé gratuitement)",
    "Taux de conversion optimisé (de 1% à 3-5%)",
    "Coût d'acquisition client réduit de 40%",
    "Système d'acquisition automatisé et scalable"
  ];

  const process = [
    {
      step: "Mois 1",
      title: "Diagnostic & Optimisation",
      points: [
        "Audit complet de votre site et parcours client",
        "Optimisation technique et UX",
        "Setup analytics avancé",
        "Tests A/B sur pages clés"
      ]
    },
    {
      step: "Mois 2",
      title: "Acquisition & Automation",
      points: [
        "Lancement campagnes publicitaires",
        "Setup email/WhatsApp marketing",
        "Stratégie contenu et influence",
        "Optimisation continue"
      ]
    },
    {
      step: "Mois 3",
      title: "Scale & Optimisation",
      points: [
        "Augmentation budgets publicitaires",
        "Programme ambassadeurs/affiliation",
        "Retargeting avancé",
        "Passage à l'autonomie"
      ]
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28 bg-gradient-to-br from-orange-500 to-red-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
        <div className="absolute -right-12 top-8 bg-[#ff7f50] text-white px-20 py-2 text-sm font-bold rotate-45 shadow-lg">
          POPULAIRE
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <Link
            href="/nos-formules"
            className="inline-flex items-center text-white/90 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour aux formules
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2 mb-6">
              <Rocket className="w-4 h-4 text-white" />
              <span className="text-white text-sm font-semibold">
                Formule Croissance - La plus populaire
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Multipliez vos ventes de manière systématique
            </h1>
            <p className="text-2xl text-white/90 mb-8">
              Transformez les visiteurs de votre site en clients fidèles
            </p>

            <div className="flex flex-wrap gap-6 text-white/90 mb-8">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">À partir de 1,5M FCFA</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span className="font-semibold">3 mois d'accompagnement</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                <span className="font-semibold">Doublement des ventes garanti</span>
              </div>
            </div>

            <a
              href="https://wa.me/221781362728?text=Bonjour%20TEKKI%20Studio%20!%20J%27aimerais%20obtenir%20un%20devis%20pour%20la%20Formule%20Croissance."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-white text-orange-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-xl"
            >
              Obtenir un devis gratuit
              <ArrowRight className="w-5 h-5 ml-2" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Idéal pour */}
      <section className="py-12 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-[#0f4c81] mb-6 text-center">
              Cette formule est idéale pour votre marque si :
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                "Vous avez un site mais peu de ventes",
                "Vous recevez du trafic qui ne convertit pas",
                "Vous voulez automatiser votre acquisition clients"
              ].map((text, index) => (
                <div key={index} className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border-2 border-orange-100">
                  <CheckCircle className="w-8 h-8 text-orange-600 mb-3" />
                  <p className="text-gray-700 font-medium">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Ce qui est inclus */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0f4c81] mb-12 text-center">
            Ce qui est inclus
          </h2>

          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
            {deliverables.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white mb-4">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-[#0f4c81] mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Processus sur 3 mois */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0f4c81] mb-12 text-center">
            Votre feuille de route sur 3 mois
          </h2>

          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
            {process.map((month, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-8 border-2 border-orange-100"
              >
                <div className="text-4xl font-bold text-orange-600 mb-4">{month.step}</div>
                <h3 className="text-xl font-bold text-[#0f4c81] mb-6">{month.title}</h3>
                <ul className="space-y-3">
                  {month.points.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-sm">{point}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Résultats garantis */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-orange-50 to-red-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0f4c81] mb-6 text-center">
              Résultats garantis
            </h2>
            <div className="bg-white rounded-2xl p-8 shadow-xl mb-8">
              <div className="text-center mb-8">
                <div className="text-6xl font-bold text-orange-600 mb-4">×2</div>
                <p className="text-xl text-gray-700">
                  Doublement de vos ventes en 90 jours<br />
                  <span className="text-orange-600 font-semibold">
                    ou nous continuons gratuitement jusqu'à atteindre cet objectif
                  </span>
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {results.map((result, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{result}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-orange-500 to-red-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Prêt à doubler vos ventes ?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Commencez votre transformation dès aujourd'hui
            </p>

            <a
              href="https://wa.me/221781362728?text=Bonjour%20TEKKI%20Studio%20!%20J%27aimerais%20obtenir%20un%20devis%20pour%20la%20Formule%20Croissance."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-white text-orange-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all shadow-xl"
            >
              Obtenir mon devis gratuit
              <ArrowRight className="w-5 h-5 ml-2" />
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default CroissancePage;
