// app/components/common/CurrencySelector.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';
import useCountryStore from '@/app/hooks/useCountryStore';
import { CountrySelector } from './CountrySelector';

const CurrencySelector: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentCountry } = useCountryStore();
  const [isVisible, setIsVisible] = useState(false);

  // Ajouter un effet pour afficher le sélecteur après un court délai
  // pour éviter de perturber le chargement initial de la page
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 z-20 flex items-center space-x-2 bg-white border border-gray-200 rounded-full px-3 py-2 shadow-md hover:shadow-lg transition-shadow"
        aria-label="Changer la devise"
      >
        <Globe className="w-4 h-4 text-gray-600" />
        <span className="text-sm font-medium text-gray-800 flex items-center">
          {currentCountry?.flag} <span className="ml-1 hidden sm:inline">{currentCountry?.currency?.code}</span>
        </span>
      </button>

      <CountrySelector 
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
};

export default CurrencySelector;