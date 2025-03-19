'use client';

import React, { useState, useCallback, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { BusinessGalleryProps } from '@/app/types/database';
import { Loader2 } from 'lucide-react';

const BusinessGallery: React.FC<BusinessGalleryProps> = ({ images = [], className = '' }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mainCarouselRef, mainEmbla] = useEmblaCarousel({ loop: true });
  const [thumbCarouselRef, thumbEmbla] = useEmblaCarousel({
    containScroll: 'keepSnaps',
    dragFree: true,
  });
  const [imagesLoaded, setImagesLoaded] = useState<boolean[]>([]);
  const [imagesError, setImagesError] = useState<boolean[]>([]);

  // Initialiser les états de chargement et d'erreur des images
  useEffect(() => {
    setImagesLoaded(new Array(images.length).fill(false));
    setImagesError(new Array(images.length).fill(false));
  }, [images.length]);

  // Synchronisation des carousels
  useEffect(() => {
    if (!mainEmbla || !thumbEmbla) return;

    const onSelect = () => {
      const index = mainEmbla.selectedScrollSnap();
      setSelectedIndex(index);
      thumbEmbla.scrollTo(index);
    };

    mainEmbla.on('select', onSelect);
    
    return () => {
      mainEmbla.off('select', onSelect);
    };
  }, [mainEmbla, thumbEmbla]);

  const onThumbClick = useCallback(
    (index: number) => {
      if (!mainEmbla || !thumbEmbla) return;
      mainEmbla.scrollTo(index);
      setSelectedIndex(index);
    },
    [mainEmbla, thumbEmbla]
  );

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

  // Image de secours si pas d'images ou toutes en erreur
  if (!images || images.length === 0 || (images.length > 0 && imagesError.every(error => error))) {
    return (
      <div className={`w-full h-[400px] bg-gray-100 rounded-lg flex items-center justify-center ${className}`}>
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
    <div className={`w-full ${className}`}>
      {/* Main Carousel */}
      <div className="overflow-hidden rounded-lg" ref={mainCarouselRef}>
        <div className="flex">
          {images.map((image, index) => (
            <div 
              key={index} 
              className="relative flex-[0_0_100%] min-w-0"
            >
              {!imagesLoaded[index] && !imagesError[index] && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <Loader2 className="w-10 h-10 text-[#ff7f50] animate-spin" />
                </div>
              )}
              
              <img
                src={image.src}
                alt={image.alt || `Image ${index + 1}`}
                className="w-full h-[400px] object-cover"
                onLoad={() => handleImageLoad(index)}
                onError={() => handleImageError(index)}
              />
              {imagesError[index] && (
                <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p className="text-sm">Impossible de charger l'image</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Thumbnails - Seulement affiché s'il y a plus d'une image */}
      {images.length > 1 && (
        <div className="mt-4 overflow-hidden" ref={thumbCarouselRef}>
          <div className="flex gap-2">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => onThumbClick(index)}
                className={`relative flex-[0_0_20%] min-w-0 transition-opacity ${
                  selectedIndex === index ? 'opacity-100 ring-2 ring-[#ff7f50]' : 'opacity-70'
                }`}
              >
                <img
                  src={image.src}
                  alt={`Miniature ${index + 1}`}
                  className="w-full h-20 object-cover rounded"
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