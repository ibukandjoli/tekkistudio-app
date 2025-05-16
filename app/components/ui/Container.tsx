// app/components/ui/Container.tsx - Ajustement des marges

import React, { ReactNode } from 'react';
import { cn } from '@/app/lib/utils';

interface ContainerProps {
  children: ReactNode;
  className?: string;
  as?: React.ElementType;
  id?: string;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

/**
 * Container component that provides consistent padding and maximum width
 * Can be rendered as any HTML element via the "as" prop
 */
const Container = ({
  children,
  className,
  as: Component = 'div',
  id,
  maxWidth = '2xl',
}: ContainerProps) => {
  const maxWidthClasses = {
    xs: 'max-w-screen-sm',
    sm: 'max-w-screen-md',
    md: 'max-w-screen-lg',
    lg: 'max-w-screen-xl',
    xl: 'max-w-screen-2xl',
    '2xl': 'max-w-[1536px]',
    full: 'max-w-[1800px]', // Largeur maximale du conteneur
  };

  return (
    <Component
      id={id}
      className={cn(
        'mx-auto px-10', // Marges fixes de 15px (équivalent à px-4 dans Tailwind)
        maxWidthClasses[maxWidth],
        className
      )}
    >
      {children}
    </Component>
  );
};

export default Container;