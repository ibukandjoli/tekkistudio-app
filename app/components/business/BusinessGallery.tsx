// app/components/business/BusinessGallery.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Loader2, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { cn } from '@/app/lib/utils';

interface ImageType {
  src: string;
  alt?: string;
}

interface BusinessGalleryProps {
  images?: Array<ImageType | string> | null;
  className?: string;
  onImageClick?: (index: number) => void;
}

const BusinessGallery: React.FC<BusinessGalleryProps> = ({ images = [], className = '', onImageClick }) => {
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [imagesLoaded, setImagesLoaded] = useState<boolean[]>([]);
  const [imagesError, setImagesError] = useState<boolean[]>([]);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Normaliser le format des images
  const normalizedImages: ImageType[] = !images ? [] : Array.isArray(images) 
    ? images.map(img => {
        if (typeof img === 'string') {
          return { src: img, alt: 'Image du business' };
        } else if (img && typeof img === 'object' && 'src' in img) {
          return img as ImageType;
        }
        return { src: '/placeholder.svg', alt: 'Image par défaut' };
      })
    : [];

  // Initialiser les états de chargement et d'erreur des images
  useEffect(() => {
    setImagesLoaded(new Array(normalizedImages.length).fill(false));
    setImagesError(new Array(normalizedImages.length).fill(false));
  }, [normalizedImages.length]);

  const handleImageLoad = (index: number) => {
    setImagesLoaded(prev => {
      const newState = [...prev];
      newState[index] = true;
      return newState;
    });
  };

  const handleImageError = (index: number) => {
    setImagesError(prev => {
      const newState = [...prev];
      newState[index] = true;
      return newState;
    });
  };

  const handlePrevious = () => {
    setSelectedImage(prev => 
      prev === 0 ? normalizedImages.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setSelectedImage(prev => 
      prev === normalizedImages.length - 1 ? 0 : prev + 1
    );
  };

  // Gestion du swipe sur mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleNext();
    }
    if (isRightSwipe) {
      handlePrevious();
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  // Image de secours si pas d'images ou toutes en erreur
  if (!normalizedImages.length || (normalizedImages.length > 0 && imagesError.every(error => error))) {
    return (
      <div className={`w-full aspect-[4/3] bg-gray-100 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p>Aucune image disponible</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      {/* Image principale */}
      <div 
        className="relative bg-gray-100 rounded-lg overflow-hidden mb-4 aspect-[4/3] cursor-pointer" 
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={() => onImageClick && onImageClick(selectedImage)}
      >
        {!imagesLoaded[selectedImage] && !imagesError[selectedImage] && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <Loader2 className="w-10 h-10 text-tekki-orange animate-spin" />
          </div>
        )}
        
        <img
          src={normalizedImages[selectedImage]?.src}
          alt={normalizedImages[selectedImage]?.alt || `Image ${selectedImage + 1}`}
          className="w-full h-full object-cover"
          onLoad={() => handleImageLoad(selectedImage)}
          onError={() => handleImageError(selectedImage)}
        />
        
        {imagesError[selectedImage] && (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-sm">Impossible de charger l'image</p>
            </div>
          </div>
        )}

        {normalizedImages.length > 1 && (
          <>
            <button 
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/70 rounded-full flex items-center justify-center shadow hover:bg-white transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                handlePrevious();
              }}
            >
              <ChevronLeft className="w-5 h-5 text-gray-800" />
            </button>
            <button 
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/70 rounded-full flex items-center justify-center shadow hover:bg-white transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
            >
              <ChevronRight className="w-5 h-5 text-gray-800" />
            </button>
          </>
        )}
      </div>

      {/* Miniatures - Affichées horizontalement avec défilement */}
      {normalizedImages.length > 1 && (
        <div className="overflow-x-auto py-2">
          <div className="flex gap-2 md:grid md:grid-cols-4 md:gap-2">
            {normalizedImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative flex-none w-20 h-16 md:w-auto md:h-auto aspect-video rounded-lg overflow-hidden ${
                  selectedImage === index ? 'ring-2 ring-tekki-orange' : 'opacity-70'
                }`}
              >
                <img
                  src={image.src}
                  alt={`Miniature ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback pour les miniatures
                    e.currentTarget.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"%3E%3Crect width="100" height="100" fill="%23f2f2f2"/%3E%3Ctext x="50" y="50" font-size="18" text-anchor="middle" alignment-baseline="middle" font-family="sans-serif" fill="%23999999"%3EImage%3C/text%3E%3C/svg%3E';
                  }}
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessGallery;