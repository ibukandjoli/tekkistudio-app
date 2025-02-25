// app/components/icons/WaveIcon.tsx
import React from 'react';
import Image from 'next/image';

interface WaveIconProps {
  className?: string;
  size?: number;
}

export const WaveIcon: React.FC<WaveIconProps> = ({ className = "", size = 24 }) => {
  return (
    <Image 
      src="/images/payments/wave_2.svg" 
      alt="Wave" 
      width={size} 
      height={size}
      className={className}
    />
  );
};

export default WaveIcon;