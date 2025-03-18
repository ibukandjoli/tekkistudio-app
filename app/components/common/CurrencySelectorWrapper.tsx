// app/components/common/CurrencySelectorWrapper.tsx
'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import CurrencySelector from './CurrencySelector';

const CurrencySelectorWrapper = () => {
  const pathname = usePathname();
  const [shouldRender, setShouldRender] = useState(false);
  
  useEffect(() => {
    // Liste des chemins où le sélecteur de devise doit apparaître
    const validPaths = [
      '/', // Page d'accueil
      '/business', // Page de liste des business
      '/business/', // Pour s'assurer de capturer les variations
    ];
    
    // Vérifie si le chemin actuel commence par un des chemins valides
    // ou s'il s'agit d'une page de détail d'un business (format: /business/[slug])
    const shouldShow = 
      validPaths.some(path => pathname === path) || 
      pathname.startsWith('/business/');
    
    setShouldRender(shouldShow);
  }, [pathname]);
  
  if (!shouldRender) return null;
  
  return <CurrencySelector />;
};

export default CurrencySelectorWrapper;