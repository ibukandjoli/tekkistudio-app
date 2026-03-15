// app/components/home/v2/ServicesSection.tsx
'use client';

import { Store, Bot, Rocket } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export default function ServicesSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const services = [
    {
      icon: <Store className="w-6 h-6 text-tekki-orange" />,
      title: 'Une boutique qui vend vraiment',
      description:
        'On crée ou refond votre boutique en ligne sur Shopify, optimisée pour que vos visiteurs passent à l\'achat. Adaptée au mobile, paiements locaux intégrés, et une expérience pensée pour vos clients africains.',
      badge: null,
    },
    {
      icon: <Bot className="w-6 h-6 text-tekki-orange" />,
      title: 'Une assistante de vente qui ne dort jamais',
      description:
        'On installe dans votre site une Vendeuse IA experte de vos produits, qui répond à vos clients, les conseille, recommande vos produits et les guide jusqu\'à l\'achat — même à 3h du matin. Résultat : moins de messages WhatsApp, et plus de ventes.',
      badge: 'Exclusif TEKKI',
    },
    {
      icon: <Rocket className="w-6 h-6 text-tekki-orange" />,
      title: 'Une stratégie pour attirer les bons clients',
      description:
        'On met en place vos publicités sur Meta et TikTok, vos campagnes d\'emails et SMS, vos collaborations avec des influenceurs, et votre stratégie de création de contenu, afin que vos futurs clients trouvent votre marque et passent à l\'achat.',
      badge: null,
    },
  ];

  return (
    <section id="services" className="py-16 md:py-24 bg-white">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-tekki-blue tracking-tight mb-4">
            Ce qu&apos;on construit pour vous.
          </h2>
          <p className="text-tekki-blue/50 text-lg max-w-2xl mx-auto">
            Pas de pack standard. On part de votre situation et on construit ce dont votre marque a réellement besoin.
          </p>
        </motion.div>

        {/* Services */}
        <div className="flex flex-col gap-5 max-w-3xl mx-auto">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className={`relative p-7 rounded-2xl flex items-start gap-5 transition-all duration-300 hover:shadow-lg ${service.badge
                ? 'bg-gradient-to-r from-tekki-orange/5 to-white border-2 border-tekki-orange/15 hover:shadow-tekki-orange/10'
                : 'bg-tekki-cream border border-tekki-blue/8 hover:shadow-tekki-blue/5'
                }`}
            >
              {service.badge && (
                <div className="absolute top-0 right-0 px-3 py-1.5 bg-tekki-orange text-white text-xs font-bold rounded-bl-xl rounded-tr-2xl">
                  {service.badge}
                </div>
              )}

              <div className="w-11 h-11 bg-tekki-orange/10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                {service.icon}
              </div>

              <div>
                <h3 className="font-heading text-lg font-bold text-tekki-blue mb-2">
                  {service.title}
                </h3>
                <p className="text-tekki-blue/55 leading-relaxed">
                  {service.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
