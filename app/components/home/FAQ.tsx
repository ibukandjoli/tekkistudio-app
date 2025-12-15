// app/components/home/FAQ.tsx
'use client';

import React, { useState } from 'react';
import { ChevronDown, MessageCircle, Sparkles } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const FAQ = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "Pourquoi choisir TEKKI Studio plutôt qu'une autre agence ?",
      answer: "Nous ne sommes pas une agence classique. Nous sommes des entrepreneurs qui ont créé et développé leurs propres marques (VIENS ON S'CONNAÎT avec 8 000 jeux vendus, et AMANI avec +250 exemplaires vendus). Chaque stratégie que nous proposons a d'abord été testée et validée sur nos propres marques. Vous ne payez pas pour de la théorie, mais pour ce qui a réellement fonctionné."
    },
    {
      question: "Travaillez-vous avec tous les types de marques ?",
      answer: "Nous nous spécialisons dans les marques africaines de bien-être et d'accessoires (cosmétiques, soins naturels, bijoux, maroquinerie, mode, produits lifestyle). Cette spécialisation nous permet de connaître parfaitement votre marché, vos clients, vos concurrents et les stratégies qui fonctionnent dans votre secteur. Nous accompagnons des marques ambitieuses qui veulent passer du local à l'international."
    },
    {
      question: "Quelle formule choisir pour ma marque ?",
      answer: "Cela dépend de votre situation actuelle. Si vous n'avez pas encore de site e-commerce ou qu'il ne vend pas, la Formule Démarrage est idéale. Si vous avez un site mais peu de ventes, la Formule Croissance est faite pour vous. Si vous générez déjà plus de 5M FCFA/mois et visez l'international, optez pour la Formule Expansion. Nous pouvons aussi faire un Audit de Départ (remboursable) pour vous conseiller précisément."
    },
    {
      question: "Combien de temps avant de voir des résultats ?",
      answer: "Cela varie selon la formule choisie et le type de produits que vous proposez. Avec la Formule Démarrage, l'objectif est vos 50 premières ventes en ligne dans les 60 jours. Avec la Formule Croissance, nous visons un doublement des ventes en 90 jours (sinon nous continuons gratuitement jusqu'à atteindre cet objectif). Avec la Formule Expansion, l'objectif est 30% de votre CA venant de l'international dans les 12 mois. Nous fixons toujours des objectifs mesurables et réalistes."
    },
    {
      question: "Comment se passe l'accompagnement concrètement ?",
      answer: "L'accompagnement est personnalisé selon votre formule : appels réguliers (hebdomadaires ou bimensuels), accès direct à notre équipe par WhatsApp/email avec réponse sous 24h maximum, formation sur tous les outils et stratégies, revue de vos performances et ajustements continus. Nous restons à vos côtés jusqu'à ce que vous soyez parfaitement autonome et que vos objectifs soient atteints."
    },
    {
      question: "Puis-je payer en plusieurs fois ?",
      answer: "Oui, nous proposons des facilités de paiement adaptées au marché africain. Généralement : 60% à la signature du contrat, et 40% à la livraison finale. Pour nos offres avec accompagnement mensuel (Croissance et Expansion), vous payez un montant initial puis des versements mensuels. Nous acceptons les paiements par virement, Mobile Money (Orange Money, Wave), cartes bancaires et cash."
    },
    {
      question: "Offrez-vous des garanties sur les résultats ?",
      answer: "Oui, chaque formule inclut une garantie concrète. Formule Démarrage : votre site fonctionne parfaitement ou nous continuons jusqu'à ce qu'il fonctionne (gratuit). Formule Croissance : vous doublez vos ventes en 90 jours ou nous prolongeons l'accompagnement gratuitement. Formule Expansion : 30% de votre CA vient de l'international en 12 mois ou nous continuons jusqu'à atteindre cet objectif. Nous croyons en nos méthodes car elles ont marché pour nous."
    },
    {
      question: "Que se passe-t-il après la fin de l'accompagnement ?",
      answer: "À la fin de votre accompagnement, vous êtes totalement autonome avec tous les outils, compétences et systèmes pour continuer à grandir seul. Cependant, nous restons disponibles pour des questions ponctuelles et vous pouvez souscrire à un accompagnement continu mensuel si vous souhaitez que nous restions votre partenaire de croissance sur le long terme. Beaucoup de nos clients le font car cela leur permet d'aller encore plus loin."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  const whatsappUrl = "https://wa.me/221781362728?text=Bonjour%20TEKKI%20Studio%20!%20J%27ai%20une%20question%20dont%20je%20ne%20trouve%20pas%20la%20réponse%20sur%20votre%20site.";

  return (
    <section className="py-20 md:py-32 bg-white relative overflow-hidden">
      {/* Décoration */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#fe6117]/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#0f4c81]/5 rounded-full blur-3xl"></div>

      <div className="w-full px-6 md:px-12 lg:px-16 xl:px-20 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-16 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 bg-[#fe6117]/10 border border-[#fe6117]/20 rounded-full px-5 py-2.5 mb-6">
            <Sparkles className="w-4 h-4 text-[#fe6117]" />
            <span className="text-[#fe6117] text-sm font-bold tracking-wide uppercase">
              Questions fréquentes
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Tout ce que vous devez <span className="text-[#fe6117]">savoir</span>
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            Les réponses aux questions les plus fréquentes sur notre accompagnement.
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          className="max-w-4xl mx-auto"
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={containerVariants}
        >
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              className="mb-4"
              variants={itemVariants}
            >
              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:border-[#fe6117]/30 transition-all duration-300">
                <button
                  className="w-full px-6 md:px-8 py-6 text-left hover:bg-gray-50 flex justify-between items-center transition-all group"
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  aria-expanded={openIndex === index}
                >
                  <span className="font-bold text-gray-900 text-base md:text-lg pr-4 group-hover:text-[#fe6117] transition-colors">
                    {faq.question}
                  </span>
                  <div className={`flex-shrink-0 p-2 rounded-full transition-all ${
                    openIndex === index
                      ? 'bg-[#fe6117]/10 rotate-180'
                      : 'bg-gray-100 group-hover:bg-[#fe6117]/10'
                  }`}>
                    <ChevronDown className={`w-5 h-5 transition-colors ${
                      openIndex === index ? 'text-[#fe6117]' : 'text-gray-500'
                    }`} />
                  </div>
                </button>

                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 md:px-8 py-6 bg-gray-50 text-gray-700 text-lg leading-relaxed border-t border-gray-200">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA bottom */}
        <motion.div
          className="mt-16 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <div className="bg-gradient-to-br from-gray-900 via-[#0f4c81] to-gray-900 rounded-3xl p-10 md:p-12 text-white shadow-2xl relative overflow-hidden">
            {/* Décoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#fe6117]/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>

            <div className="relative z-10 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#fe6117] mb-6">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>

              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Vous avez d'autres questions ?
              </h3>
              <p className="text-white/90 mb-8 text-lg leading-relaxed max-w-2xl mx-auto">
                Notre équipe est disponible pour répondre à toutes vos questions
                et vous aider à choisir la formule adaptée à votre marque.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center py-4 px-8 rounded-full bg-[#25D366] text-white font-bold hover:bg-[#20BD5C] transition-colors shadow-lg hover:shadow-xl text-lg"
                  >
                    <FaWhatsapp className="mr-3 text-xl" />
                    Discuter sur WhatsApp
                  </a>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <a
                    href="mailto:hello@tekkistudio.com"
                    className="inline-flex items-center justify-center py-4 px-8 rounded-full bg-white/10 backdrop-blur-sm border-2 border-white/30 hover:border-white/50 text-white font-bold hover:bg-white/20 transition-colors text-lg"
                  >
                    Envoyer un email
                  </a>
                </motion.div>
              </div>

              {/* Trust badge */}
              <div className="mt-8 flex items-center justify-center gap-2 text-sm text-white/80">
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                <span>Réponse sous 24h garantie</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;