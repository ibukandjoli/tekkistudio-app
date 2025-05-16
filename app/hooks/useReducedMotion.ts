// app/hooks/useReducedMotion.ts
'use client';

import { useEffect, useState } from 'react';

export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Vérifier si le navigateur supporte la requête media
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    // Définir l'état initial
    setPrefersReducedMotion(mediaQuery.matches);
    
    // Ajouter un listener pour les changements
    const handleChange = () => {
      setPrefersReducedMotion(mediaQuery.matches);
    };
    
    // Ajouter l'écouteur d'événement pour les changements de préférence
    mediaQuery.addEventListener('change', handleChange);
    
    // Nettoyer l'écouteur à la destruction du composant
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return prefersReducedMotion;
};