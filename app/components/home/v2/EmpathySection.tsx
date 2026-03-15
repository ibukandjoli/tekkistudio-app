// app/components/home/v2/EmpathySection.tsx
'use client';

import { Clock, ShoppingCart, BarChart2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export default function EmpathySection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const painPoints = [
    {
      icon: <Clock className="w-7 h-7 text-tekki-orange" />,
      title: 'Vendre sur WhatsApp est difficile',
      description:
        'Vous répondez manuellement à chaque client. Vous perdez des ventes lorsque vous êtes indisponible. Vos ventes dépendent de vous seul.',
    },
    {
      icon: <ShoppingCart className="w-7 h-7 text-tekki-orange" />,
      title: 'Avoir un site web ne suffit plus',
      description:
        'Vous avez investi dans un site, mais les visiteurs repartent sans acheter. Votre boutique en ligne est belle, mais elle ne convertit pas les visiteurs en clients.',
    },
    {
      icon: <BarChart2 className="w-7 h-7 text-tekki-orange" />,
      title: 'La visibilité ne garantit rien',
      description:
        'Vos posts ont des likes, vos stories ont des vues, mais les ventes ne suivent pas. Vous dépensez de l\'énergie sans voir des résultats sur vos ventes.',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-tekki-cream">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-tekki-blue tracking-tight mb-4">
            On connaît vos galères.
          </h2>
          <p className="text-tekki-blue/50 text-lg max-w-2xl mx-auto">
            Après avoir accompagné plus de 10 marques africaines et plus de 50 e-commerçants, voici les problèmes qui reviennent le plus souvent.
          </p>
        </motion.div>

        {/* Pain Point Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {painPoints.map((point, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="bg-white border border-tekki-blue/8 p-8 rounded-2xl hover:shadow-lg hover:shadow-tekki-blue/5 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-tekki-orange/8 rounded-xl flex items-center justify-center mb-5">
                {point.icon}
              </div>
              <h3 className="font-heading text-xl font-bold text-tekki-blue mb-3">
                {point.title}
              </h3>
              <p className="text-tekki-blue/55 leading-relaxed">
                {point.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Conclusion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center"
        >
          <p className="text-xl md:text-2xl font-medium text-tekki-blue/70">
            Ces problèmes ont des solutions concrètes.
            <br className="hidden sm:block" />
            <span className="text-tekki-orange font-semibold"> Et c&apos;est exactement pour ça qu&apos;on existe.</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
