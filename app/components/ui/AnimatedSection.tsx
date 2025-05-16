// app/components/ui/AnimatedSection.tsx
'use client';

import React, { useEffect, useRef, ReactNode } from 'react';
import { cn } from '@/app/lib/utils';

type AnimationType = 'fade-in' | 'slide-in' | 'scale-in';

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  animation?: AnimationType;
  delay?: number;
  threshold?: number;
  once?: boolean;
}

const AnimatedSection = ({
  children,
  className,
  animation = 'fade-in',
  delay = 0,
  threshold = 0.1,
  once = true,
}: AnimatedSectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);
  
  useEffect(() => {
    if (!sectionRef.current) return;
    
    const section = sectionRef.current;
    
    const animateSection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && (!once || !hasAnimated.current)) {
          const animationClass = `animate-${animation}`;
          setTimeout(() => {
            section.classList.add(animationClass);
            hasAnimated.current = true;
          }, delay);
          
          if (once) {
            observer.unobserve(section);
          }
        } else if (!entry.isIntersecting && !once && hasAnimated.current) {
          const animationClass = `animate-${animation}`;
          section.classList.remove(animationClass);
          hasAnimated.current = false;
        }
      });
    };
    
    const observer = new IntersectionObserver(animateSection, {
      root: null,
      rootMargin: '0px',
      threshold: threshold,
    });
    
    observer.observe(section);
    
    return () => {
      observer.unobserve(section);
    };
  }, [animation, delay, threshold, once]);
  
  return (
    <div 
      ref={sectionRef} 
      className={cn('opacity-0', className)}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default AnimatedSection;