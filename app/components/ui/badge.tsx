// app/components/ui/badge.tsx
import React, { ReactNode } from 'react';
import { cn } from '@/app/lib/utils';

interface BadgeProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'ecommerce' | 'digital' | 'available' | 'reserved' | 'outline' | 'success' | 'warning' | 'error';
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
    available: 'bg-green-500 text-white',
    reserved: 'bg-amber-500 text-white',
    outline: 'bg-transparent border border-current text-tekki-blue',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-amber-100 text-amber-800',
    error: 'bg-red-100 text-red-800',
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