// app/components/home/CTASection.tsx avec animations
'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import * as framerMotion from 'framer-motion';
const { motion, useAnimation } = framerMotion;
import { useInView } from 'react-intersection-observer';

const CTASection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" }
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-[#042b65] via-[#1a5a8f] to-[#ff7f50] text-white relative overflow-hidden">
      
      {/* Animation du cercle décoratif */}
      <motion.div 
        className="absolute -right-20 -top-20 w-80 h-80 bg-[#ff7f50]/10 rounded-full blur-3xl"
        animate={{ 
          scale: [1, 1.05, 1],
          opacity: [0.1, 0.15, 0.1],
        }}
        transition={{ 
          duration: 5, 
          repeat: Infinity,
          repeatType: "reverse" 
        }}
      ></motion.div>
      
      <motion.div 
        className="absolute -left-20 -bottom-20 w-80 h-80 bg-[#ff7f50]/10 rounded-full blur-3xl"
        animate={{ 
          scale: [1, 1.05, 1],
          opacity: [0.1, 0.15, 0.1],
        }}
        transition={{ 
          duration: 5, 
          repeat: Infinity,
          repeatType: "reverse",
          delay: 1.5
        }}
      ></motion.div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          ref={ref}
          className="max-w-4xl mx-auto text-center"
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={container}
        >
          <motion.h2 
           className="text-3xl md:text-5xl font-bold mb-6"
           variants={item}
         >
           Prêt à lancer votre business en ligne ?
         </motion.h2>
         
         <motion.p 
           className="text-xl md:text-2xl mb-10 opacity-90"
           variants={item}
         >
           Rejoignez les entrepreneurs qui ont déjà sauté le pas 
           et lancé leur activité en ligne sans partir de zéro.
         </motion.p>
         
         <motion.div 
           className="flex flex-col sm:flex-row gap-6 justify-center"
           variants={item}
         >
           <motion.div
             whileHover={{ scale: 1.05 }}
             whileTap={{ scale: 0.98 }}
           >
             <Link 
               href="/business"
               className="bg-[#ff7f50] hover:bg-[#ff6b3d] text-white px-8 py-4 rounded-lg font-medium transition-colors flex items-center justify-center"
             >
               Voir les business disponibles
               <ArrowRight className="w-5 h-5 ml-2" />
             </Link>
           </motion.div>
           
           <motion.div
             whileHover={{ scale: 1.05 }}
             whileTap={{ scale: 0.98 }}
           >
             <a 
               href="/comparatif-acquisition" 
               target="_blank"
               rel="noopener noreferrer"
               className="bg-white hover:bg-gray-100 text-[#0f4c81] px-8 py-4 rounded-lg font-medium transition-colors flex items-center justify-center"
             >
               Comparez les types de business
             </a>
           </motion.div>
         </motion.div>
       </motion.div>
     </div>
   </section>
 );
};

export default CTASection;