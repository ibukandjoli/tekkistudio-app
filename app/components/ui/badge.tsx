// app/components/ui/badge.tsx
import React, { ReactNode } from 'react';
import { cn } from '@/app/lib/utils';

interface BadgeProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'ecommerce' | 'digital' | 'available' | 'reserved' | 'outline' | 'success' | 'warning' | 'error' | 'secondary' | 'physical' | 'jobFeatured' | 'jobActive' | 'jobInactive' | 'candidateNew' | 'candidateReviewing' | 'candidateInterview' | 'candidateHired' | 'candidateRejected';
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Badge component for displaying status, categories, or labels
 */
export function Badge({
  children,
  className,
  variant = 'default',
  size = 'md',
}: BadgeProps) {
  // Variant styles
  const variantStyles = {
    default: 'bg-gray-100 text-gray-800',
    ecommerce: 'bg-tekki-blue text-white',
    digital: 'bg-tekki-coral text-white',
    physical: 'bg-green-100 text-green-700',
    available: 'bg-green-500 text-white',
    reserved: 'bg-amber-500 text-white',
    outline: 'bg-transparent border border-current text-tekki-blue',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-amber-100 text-amber-800',
    error: 'bg-red-100 text-red-800',
    secondary: 'bg-gray-200 text-gray-700',
    // Nouvelles variantes pour les offres d'emploi
    jobFeatured: 'bg-purple-100 text-purple-800 border border-purple-200',
    jobActive: 'bg-green-100 text-green-800 border border-green-200',
    jobInactive: 'bg-gray-100 text-gray-600 border border-gray-200',
    // Nouvelles variantes pour les candidatures
    candidateNew: 'bg-blue-100 text-blue-800 border border-blue-200',
    candidateReviewing: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    candidateInterview: 'bg-purple-100 text-purple-800 border border-purple-200',
    candidateHired: 'bg-green-100 text-green-800 border border-green-200', 
    candidateRejected: 'bg-red-100 text-red-800 border border-red-200'
  };

  // Size styles
  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-3 py-1',
    lg: 'text-sm px-4 py-1.5',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center font-medium rounded-full',
        variantStyles[variant as keyof typeof variantStyles],
        sizeStyles[size as keyof typeof sizeStyles],
        className
      )}
    >
      {children}
    </span>
  );
}

export default Badge;