// app/components/analytics/MetaPixel.tsx
'use client';

import { usePathname } from 'next/navigation';
import Script from 'next/script';
import { useEffect } from 'react';

// Vous devez remplacer cette valeur par votre ID pixel Meta réel
const META_PIXEL_ID = '601446776036363';

/**
 * Composant pour l'intégration du Pixel Meta (Facebook)
 * - Charge le script du Pixel Meta
 * - Déclenche les événements de page view à chaque changement de route
 * - Fournit une fonction pour suivre des événements personnalisés
 */
export default function MetaPixel() {
  const pathname = usePathname();

  // Suivre les changements de page
  useEffect(() => {
    if (pathname) {
      // Vérifier que window.fbq est disponible avant de l'appeler
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'PageView');
      }
    }
  }, [pathname]);

  return (
    <>
      {/* Script d'initialisation du Pixel Meta */}
      <Script id="meta-pixel-script" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${META_PIXEL_ID}');
          fbq('track', 'PageView');
        `}
      </Script>

      {/* Noscript fallback pour les utilisateurs sans JavaScript */}
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}

// Types pour le Pixel Meta
declare global {
  interface Window {
    fbq: (
      method: 'track' | 'init' | 'trackCustom',
      eventName: string,
      params?: Record<string, any>
    ) => void;
  }
}