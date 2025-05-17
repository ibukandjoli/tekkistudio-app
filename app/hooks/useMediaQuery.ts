// app/hooks/useMediaQuery.ts

import { useState, useEffect } from 'react';

/**
 * Hook personnalisé pour détecter si un media query correspond à l'écran actuel
 * @param query - La media query à vérifier (ex: '(max-width: 640px)')
 * @returns boolean - True si la media query correspond, false sinon
 */
export const useMediaQuery = (query: string): boolean => {
  // État par défaut à false pour le rendu côté serveur
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Vérifier si window est disponible (client-side uniquement)
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia(query);
      
      // Définir initialement la valeur
      setMatches(mediaQuery.matches);
      
      // Définir un listener pour les changements
      const handler = (event: MediaQueryListEvent) => {
        setMatches(event.matches);
      };
      
      // Ajouter l'event listener
      mediaQuery.addEventListener('change', handler);
      
      // Nettoyer lors du démontage du composant
      return () => {
        mediaQuery.removeEventListener('change', handler);
      };
    }
    
    // Si côté serveur, retourne false
    return () => {};
  }, [query]);

  return matches;
};

export default useMediaQuery;