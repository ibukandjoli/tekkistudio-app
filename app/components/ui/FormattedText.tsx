// app/components/ui/FormattedText.tsx
'use client';

import React from 'react';
import { cn } from '@/app/lib/utils';

interface FormattedTextProps {
  text: string;
  className?: string;
}

/**
 * Composant pour afficher un texte formaté en respectant les retours à la ligne
 * et autres formatages basiques
 */
const FormattedText: React.FC<FormattedTextProps> = ({ text, className }) => {
  if (!text) return null;
  
  // Diviser le texte par paragraphe (deux retours à la ligne)
  const paragraphs = text.split(/\n\n+/);
  
  return (
    <div className={cn("text-gray-600", className)}>
      {paragraphs.map((paragraph, i) => {
        // Si le paragraphe est vide, ne rien afficher
        if (!paragraph.trim()) return null;
        
        // Diviser le paragraphe en lignes (un retour à la ligne)
        const lines = paragraph.split(/\n/);
        
        return (
          <p key={i} className="mb-4 last:mb-0">
            {lines.map((line, j) => (
              <React.Fragment key={j}>
                {line}
                {j < lines.length - 1 && <br />}
              </React.Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
};

export default FormattedText;