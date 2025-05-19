// app/components/ui/OptimizedImage.tsx

import React from 'react';
import Image from 'next/image';
import { cn } from '@/app/lib/utils';
import { transformCloudinaryUrl } from '@/app/lib/cloudinary-client';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  onLoadingComplete?: () => void;
  onError?: () => void;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width = 500,
  height = 300,
  className,
  priority = false,
  objectFit = 'cover',
  onLoadingComplete,
  onError,
}) => {
  // Vérifier si c'est une URL Cloudinary
  const isCloudinaryUrl = src.includes('res.cloudinary.com');
  
  // Optimiser l'URL si c'est Cloudinary
  const optimizedSrc = isCloudinaryUrl 
    ? transformCloudinaryUrl(src, width, height) 
    : src;
    
  return (
    <div className={cn('overflow-hidden', className)} style={{ position: 'relative' }}>
      <Image
        src={optimizedSrc}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        loading={priority ? 'eager' : 'lazy'}
        className={cn('transition-opacity duration-300', {
          'object-cover': objectFit === 'cover',
          'object-contain': objectFit === 'contain',
          'object-fill': objectFit === 'fill',
          'object-none': objectFit === 'none',
          'object-scale-down': objectFit === 'scale-down',
        })}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII="
        placeholder="blur"
        onLoadingComplete={onLoadingComplete}
        onError={onError}
      />
    </div>
  );
};

export default OptimizedImage;