// app/providers/MotionConfigProvider.tsx
'use client';

import React, { ReactNode } from 'react';
import { MotionConfig } from 'framer-motion';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface MotionConfigProviderProps {
  children: ReactNode;
}

export const MotionConfigProvider = ({ children }: MotionConfigProviderProps) => {
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <MotionConfig reducedMotion={prefersReducedMotion ? "always" : "never"}>
      {children}
    </MotionConfig>
  );
};