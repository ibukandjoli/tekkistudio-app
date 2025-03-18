// app/components/business/BusinessGallery.tsx
'use client';

import React, { useState, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { BusinessGalleryProps } from '@/app/types/database';

const BusinessGallery: React.FC<BusinessGalleryProps> = ({ images, className = '' }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mainCarouselRef, mainEmbla] = useEmblaCarousel({ loop: true });
  const [thumbCarouselRef, thumbEmbla] = useEmblaCarousel({
    containScroll: 'keepSnaps',
    dragFree: true,
  });

  const onThumbClick = useCallback(
    (index: number) => {
      if (!mainEmbla || !thumbEmbla) return;
      mainEmbla.scrollTo(index);
      setSelectedIndex(index);
    },
    [mainEmbla, thumbEmbla]
  );

  return (
    <div className="w-full">
      {/* Main Carousel */}
      <div className="overflow-hidden" ref={mainCarouselRef}>
        <div className="flex">
          {images.map((image, index) => (
            <div 
              key={index} 
              className="relative flex-[0_0_100%] min-w-0"
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-[400px] object-cover rounded-lg"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Thumbnails */}
      <div className="mt-4 overflow-hidden" ref={thumbCarouselRef}>
        <div className="flex gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => onThumbClick(index)}
              className={`relative flex-[0_0_20%] min-w-0 transition-opacity ${
                selectedIndex === index ? 'opacity-100' : 'opacity-50'
              }`}
            >
              <img
                src={image.src}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-20 object-cover rounded"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BusinessGallery;