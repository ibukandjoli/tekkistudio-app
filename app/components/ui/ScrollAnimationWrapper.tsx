// app/components/ui/ScrollAnimationWrapper.tsx
'use client';

import React, { ReactNode } from 'react';
import { motion, Variants } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface ScrollAnimationWrapperProps {
  children: ReactNode;
  className?: string;
  variants?: Variants;
  customVariant?: string;
  delay?: number;
  duration?: number;
  threshold?: number;
  triggerOnce?: boolean;
  direction?: 'up' | 'down' | 'left' | 'right';
}

const defaultVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 }
};

export const ScrollAnimationWrapper = ({
  children,
  className,
  variants = defaultVariants,
  customVariant,
  delay = 0,
  duration = 0.6,
  threshold = 0.1,
  triggerOnce = true,
  direction = 'up'
}: ScrollAnimationWrapperProps) => {
  const [ref, inView] = useInView({
    triggerOnce,
    threshold
  });

  // Créer des variants basés sur la direction si aucun variant personnalisé n'est fourni
  const getDirectionalVariants = () => {
    if (variants !== defaultVariants) return variants;

    const directionOffset = 50;
    
    switch (direction) {
      case 'up':
        return {
          hidden: { opacity: 0, y: directionOffset },
          visible: { opacity: 1, y: 0 }
        };
      case 'down':
        return {
          hidden: { opacity: 0, y: -directionOffset },
          visible: { opacity: 1, y: 0 }
        };
      case 'left':
        return {
          hidden: { opacity: 0, x: directionOffset },
          visible: { opacity: 1, x: 0 }
        };
      case 'right':
        return {
          hidden: { opacity: 0, x: -directionOffset },
          visible: { opacity: 1, x: 0 }
        };
      default:
        return defaultVariants;
    }
  };

  // Variants finaux
  const finalVariants = getDirectionalVariants();

  // Animation customisée si requis
  const customAnimation = customVariant ? {
    [customVariant]: {
      opacity: 1,
      y: 0,
      transition: { delay, duration, ease: "easeOut" }
    }
  } : {};

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? (customVariant || "visible") : "hidden"}
      variants={{
        ...finalVariants,
        ...customAnimation
      }}
      transition={{ duration, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};