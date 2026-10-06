// app/components/layout/HashScrollFix.tsx
'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Next.js ne recalcule pas toujours la position d'une ancre (#offers, #cases...)
 * après une navigation inter-pages : le scroll initial se base sur une hauteur
 * de page pas encore stabilisée et atterrit trop tôt. On réessaie jusqu'à ce
 * que la position de la cible arrête de bouger entre deux mesures.
 */
export default function HashScrollFix() {
  const pathname = usePathname();

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;

    const id = hash.slice(1);
    let lastTop: number | null = null;
    let stableCount = 0;
    let attempts = 0;

    const interval = setInterval(() => {
      const el = document.getElementById(id);
      attempts += 1;

      if (el) {
        const top = el.getBoundingClientRect().top;
        if (lastTop !== null && Math.abs(top - lastTop) < 2) {
          stableCount += 1;
        } else {
          stableCount = 0;
        }
        lastTop = top;

        if (stableCount >= 2) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          clearInterval(interval);
          return;
        }
      }

      if (attempts >= 15) {
        el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [pathname]);

  return null;
}
