// app/components/ui/Section.tsx

import React, { ReactNode } from 'react';
import { cn } from '@/app/lib/utils';
import Container from './Container';
import AnimatedSection from './AnimatedSection';

interface SectionProps {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  id?: string;
  animated?: boolean;
  animation?: 'fade-in' | 'slide-in' | 'scale-in';
  background?: 'white' | 'light' | 'primary' | 'gradient' | 'none';
  paddingY?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

/**
 * Section component that provides consistent padding, background, and animation options
 */
const Section = ({
  children,
  className,
  containerClassName,
  id,
  animated = true,
  animation = 'fade-in',
  background = 'white',
  paddingY = 'lg',
  maxWidth = '2xl',
}: SectionProps) => {
  const backgroundClasses = {
    white: 'bg-white',
    light: 'bg-gray-50',
    primary: 'bg-tekki-blue text-white',
    gradient: 'bg-gradient-to-r from-tekki-blue to-tekki-darkblue text-white',
    none: '',
  };

  const paddingClasses = {
    none: '',
    sm: 'py-8',
    md: 'py-12',
    lg: 'py-16 md:py-20',
    xl: 'py-20 md:py-24',
  };

  const sectionContent = (
    <section
      id={id}
      className={cn(
        backgroundClasses[background],
        paddingClasses[paddingY],
        'relative overflow-hidden',
        className
      )}
    >
      <Container className={containerClassName} maxWidth={maxWidth}>
        {children}
      </Container>
    </section>
  );

  if (animated) {
    return (
      <AnimatedSection animation={animation} once={true} threshold={0.1}>
        {sectionContent}
      </AnimatedSection>
    );
  }

  return sectionContent;
};

export default Section;