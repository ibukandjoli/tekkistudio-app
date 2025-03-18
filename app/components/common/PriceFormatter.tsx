// app/components/common/PriceFormatter.tsx
"use client";

import React from 'react';
import useCountryStore from '../../hooks/useCountryStore';

interface PriceFormatterProps {
  amount: number;
  className?: string;
  showStrike?: boolean;
  showOriginalPrice?: boolean;
}

const PriceFormatter: React.FC<PriceFormatterProps> = ({ 
  amount, 
  className = '',
  showStrike = false,
  showOriginalPrice = false
}) => {
  const { convertPrice } = useCountryStore();
  const { formatted, value } = convertPrice(amount);
  const { currentCountry } = useCountryStore();
  
  if (showStrike) {
    return (
      <span className={`${className} line-through text-gray-500`}>
        {formatted}
      </span>
    );
  }

  if (showOriginalPrice && currentCountry?.currency?.code !== 'XOF') {
    return (
      <span className={className}>
        {formatted} <span className="text-sm opacity-70">({amount.toLocaleString()} FCFA)</span>
      </span>
    );
  }

  return (
    <span className={className}>
      {formatted}
    </span>
  );
};

export default PriceFormatter;