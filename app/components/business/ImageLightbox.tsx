// app/components/business/ImageLightbox.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageType {
  src: string;
  alt?: string;
}

interface ImageLightboxProps {
  images: Array<ImageType | string>;
  initialIndex?: number;
  onClose: () => void;
}

const ImageLightbox: React.FC<ImageLightboxProps> = ({ 
  images, 
  initialIndex = 0, 
  onClose 
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(initialIndex);
  const [loading, setLoading] = useState<boolean>(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Normaliser le format des images
  const normalizedImages: ImageType[] = images.map(img => {
    if (typeof img === 'string') {
      return { src: img, alt: 'Image du business' };
    } else if (img && typeof img === 'object' && 'src' in img) {
      return img as ImageType;
    }
    return { src: '/placeholder.svg', alt: 'Image par défaut' };
  });

  // Fermer avec la touche Échap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Précharger l'image actuelle
  useEffect(() => {
    setLoading(true);
    const img = new Image();
    img.src = normalizedImages[currentIndex]?.src || '';
    img.onload = () => setLoading(false);
    img.onerror = () => setLoading(false);
  }, [currentIndex, normalizedImages]);

  const handlePrevious = () => {
    setCurrentIndex(prev => 
      prev === 0 ? normalizedImages.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex(prev => 
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
      {/* Bouton de fermeture */}
      <button 
        className="absolute top-4 right-4 z-10 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70 transition-all"
        onClick={onClose}
      >
        <X className="w-6 h-6" />
      </button>

      {/* Navigation */}
      <div 
        className="absolute inset-0 flex items-center justify-between px-4"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <button 
          className="p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 text-white transition-all transform hover:scale-110"
          onClick={handlePrevious}
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
        <button 
          className="p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 text-white transition-all transform hover:scale-110"
          onClick={handleNext}
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>

      {/* Image actuelle */}
      <div className="w-full h-full flex items-center justify-center p-4 sm:p-10">
        {loading ? (
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        ) : (
          <img
            src={normalizedImages[currentIndex]?.src}
            alt={normalizedImages[currentIndex]?.alt || `Image ${currentIndex + 1}`}
            className="max-w-full max-h-full object-contain"
            draggable="false"
          />
        )}
      </div>

      {/* Indicateur de position */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 rounded-full px-3 py-1 text-white text-sm">
        {currentIndex + 1} / {normalizedImages.length}
      </div>

      {/* Miniatures (optionnelles, à afficher sur les écrans plus grands) */}
      {normalizedImages.length > 1 && (
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 hidden lg:flex space-x-2 overflow-x-auto">
          {normalizedImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-16 h-12 border-2 rounded overflow-hidden ${
                index === currentIndex ? 'border-tekki-orange' : 'border-transparent'
              }`}
            >
              <img 
                src={image.src} 
                alt={`Miniature ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageLightbox;