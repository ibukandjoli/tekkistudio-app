// app/components/home/OurBrands.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, TrendingUp, Users, Star, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const OurBrandsSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const brands = [
    {
      name: "VIENS ON S'CONNAÎT",
      tagline: "Jeux de conversation",
      description: "Des jeux de cartes avec des questions significatives qui transforment les relations grâce à des conversations authentiques et profondes.",
      image: "/images/brands/vosc.png", 
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50",
      stats: [
        { value: "8 000", label: "Jeux vendus", icon: <TrendingUp className="w-4 h-4" /> },
        { value: "98%", label: "taux de satisfaction", icon: <Star className="w-4 h-4" /> },
        { value: "+5 000", label: "clients", icon: <Users className="w-4 h-4" /> },
        { value: "7", label: "Pays d'export", icon: <Sparkles className="w-4 h-4" /> }
      ],
      learnings: [
        "Comment utiliser le storytelling pour générer 60% des ventes",
        "La stratégie des micro-influenceurs pour booster la notoriété",
        "Comment optimiser les publicités Meta pour le marché africain",
        "Le programme des revendeurs qui a triplé nos ventes en 6 mois"
      ],
      link: "/nos-marques/viens-on-sconnait"
    },
    {
      name: "AMANI",
      tagline: "Bien-être féminin",
      description: "Une ceinture chauffante innovante qui soulage les douleurs menstruelles grâce à la thermothérapie et la massothérapie.",
      image: "/images/brands/amani.png", 
      gradient: "from-rose-500 to-orange-500",
      bgGradient: "from-rose-50 to-orange-50",
      stats: [
        { value: "250", label: "Unités vendues", icon: <TrendingUp className="w-4 h-4" /> },
        { value: "4.7/5", label: "Note moyenne", icon: <Star className="w-4 h-4" /> },
        { value: "95%", label: "Satisfaction", icon: <Users className="w-4 h-4" /> },
        { value: "2", label: "Pays présents", icon: <Sparkles className="w-4 h-4" /> }
      ],
      learnings: [
        "Comment créer une communauté engagée autour d'un produit bien-être",
        "Les stratégies de contenu éducatif qui convertissent en ventes",
        "Comment optimiser les campagnes de pub pour un produit de niche",
        "Comment gérer la logistique et les retours clients efficacement"
      ],
      link: "/nos-marques/amani"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <section className="py-20 md:py-28 bg-[#fff5f0] overflow-hidden relative">
      {/* Décoration de fond */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#ff7f50]/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#0f4c81]/5 rounded-full blur-3xl -z-10"></div>

      <div className="container mx-auto px-4">
        {/* Header de section */}
        <motion.div 
          className="text-center mb-16 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 bg-[#ff7f50]/10 border border-[#ff7f50]/20 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-[#ff7f50]" />
            <span className="text-[#ff7f50] text-xs font-bold tracking-wider uppercase">
              La preuve que ça marche
            </span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold text-[#0f4c81] mb-4">
            Nous pratiquons ce que nous prêchons
          </h2>
          <p className="text-xl text-gray-600">
            Avant d'accompagner votre marque, nous avons créé et fait grandir les nôtres. 
            Voici la preuve concrète que nos stratégies fonctionnent.
          </p>
        </motion.div>

        {/* Les deux marques */}
        <motion.div 
          ref={ref}
          className="grid lg:grid-cols-2 gap-8 mb-16 max-w-7xl mx-auto"
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={containerVariants}
        >
          {brands.map((brand, index) => (
            <motion.div 
              key={index}
              className="group bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-500"
              variants={itemVariants}
              whileHover={{ y: -10 }}
            >
              {/* Image de la marque avec overlay */}
              <div className={`relative h-72 bg-gradient-to-br ${brand.gradient} overflow-hidden`}>
                {/* Placeholder pour l'image 
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white text-center p-8">
                    <div className="text-6xl font-bold mb-4 opacity-20">{brand.name.substring(0, 1)}</div>
                    <p className="text-xl font-bold mb-2">{brand.name}</p>
                    <p className="text-sm opacity-90">Image du produit   intégrer ici</p>
                  </div>
                </div>
                */}
                
                <img 
                  src={brand.image} 
                  alt={brand.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                
                {/* Badge */}
                <div className="absolute top-6 left-6 z-10">
                  <span className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-bold text-[#0f4c81] shadow-lg">
                    {brand.tagline}
                  </span>
                </div>
              </div>

              <div className="p-8">
                {/* Nom et description */}
                <h3 className="text-2xl font-bold text-[#0f4c81] mb-3 group-hover:text-[#ff7f50] transition-colors">
                  {brand.name}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {brand.description}
                </p>

                {/* Statistiques en grille 2x2 */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {brand.stats.map((stat, idx) => (
                    <div 
                      key={idx} 
                      className={`bg-gradient-to-br ${brand.bgGradient} rounded-xl p-4 text-center border border-gray-100 hover:scale-105 transition-transform`}
                    >
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <div className="text-[#ff7f50]">{stat.icon}</div>
                        <div className="text-2xl font-bold text-[#0f4c81]">{stat.value}</div>
                      </div>
                      <div className="text-xs text-gray-600 font-medium">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Ce qu'on a appris */}
                <div className="bg-gray-50 rounded-xl p-5 mb-6">
                  <h4 className="font-semibold text-[#0f4c81] mb-3 flex items-center text-sm">
                    <TrendingUp className="w-4 h-4 mr-2 text-[#ff7f50]" />
                    Ce que nous avons appris
                  </h4>
                  <ul className="space-y-2.5">
                    {brand.learnings.map((learning, idx) => (
                      <li key={idx} className="flex items-start text-sm text-gray-700">
                        <span className="text-[#ff7f50] mr-2 font-bold flex-shrink-0">•</span>
                        <span className="leading-relaxed">{learning}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <Link
                  href={brand.link}
                  className={`block w-full text-center bg-gradient-to-r ${brand.gradient} hover:opacity-90 text-white py-3.5 rounded-xl font-semibold transition-all shadow-md hover:shadow-xl group/btn`}
                >
                  <span className="flex items-center justify-center">
                    Découvrir l'histoire complète
                    <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Section bottom avec CTA vers formules */}
        <motion.div 
          className="max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <div className="bg-gradient-to-r from-[#0f4c81] to-[#1a5a8f] rounded-3xl p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
            {/* Décoration */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#ff7f50]/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 text-center">
              <h3 className="text-2xl md:text-4xl font-bold mb-4">
                Prêt à appliquer ces stratégies à votre marque ?
              </h3>
              <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
                Chaque formule que nous proposons intègre les apprentissages concrets 
                de nos propres succès entrepreneuriaux.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href="/nos-formules"
                    className="inline-flex items-center justify-center bg-[#ff7f50] hover:bg-[#ff6b3d] text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-xl hover:shadow-2xl"
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
                    href="https://wa.me/221781362728?text=Bonjour%20TEKKI%20Studio%20!%20J%27ai%20vu%20vos%20marques%20et%20j%27aimerais%20discuter%20de%20ma%20propre%20marque."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center bg-white/10 backdrop-blur-sm hover:bg-white/20 border-2 border-white/30 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all"
                  >
                    Réserver un appel gratuit
                  </a>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      
    </section>
  );
};

export default OurBrandsSection;