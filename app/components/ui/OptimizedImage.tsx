// app/components/ui/OptimizedImage.tsx

import React from 'react';
import Image from 'next/image';
import { cn } from '@/app/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  // Ajoutez ces propriétés
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
  onError, // Assurez-vous de les inclure ici aussi
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

// Fonction pour transformer les URLs Cloudinary
function transformCloudinaryUrl(url: string, width: number, height: number): string {
  // Ne pas transformer si ce n'est pas une URL Cloudinary
  if (!url.includes('res.cloudinary.com')) {
    return url;
  }
  
  // Format de l'URL Cloudinary:
  // https://res.cloudinary.com/cloud-name/image/upload/v1234567890/folder/file.jpg
  
  // Séparer l'URL en parties
  const parts = url.split('/upload/');
  if (parts.length !== 2) return url;
  
  // Ajouter les transformations
  return `${parts[0]}/upload/q_auto,f_auto,w_${width},h_${height},c_limit/${parts[1]}`;
}

export default OptimizedImage;