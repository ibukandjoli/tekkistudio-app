// app/components/analytics/MetaPixel.tsx
'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';
import { useEffect } from 'react';

// Remplacer cette valeur par votre ID pixel Meta réel
const META_PIXEL_ID = '601446776036363';

// Type simple pour les paramètres d'événement
type EventParams = Record<string, any>;

/**
 * Interface pour les paramètres de l'API Conversions
 */
interface ConversionAPIParams {
  eventName: string;
  eventId?: string;
  userData?: {
    email?: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
    city?: string;
    country?: string;
  };
  customData?: Record<string, any>;
}

/**
 * Composant pour l'intégration complète du Pixel Meta et de l'API Conversions
 * - Charge le script du Pixel Meta
 * - Initialise l'API Conversions
 * - Déclenche les événements de page view à chaque changement de route
 * - Fournit des fonctions utilitaires pour le tracking d'événements
 */
export default function MetaPixel() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Suivre les changements de page
  useEffect(() => {
    if (pathname) {
      // Générer un ID d'événement unique pour la synchronisation avec l'API Conversions
      const eventId = `pageview_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      
      // Vérifier que window.fbq est disponible avant de l'appeler
      if (typeof window !== 'undefined' && window.fbq) {
        // Tracker l'événement PageView de manière compatible
        window.fbq('track', 'PageView');
        
        // Envoi des données via l'API Conversions (côté serveur via API route)
        sendServerSideEvent({
          eventName: 'PageView',
          eventId: eventId,
          customData: {
            page_path: pathname,
            page_url: `${window.location.origin}${pathname}${searchParams ? '?' + searchParams.toString() : ''}`,
            page_title: document.title
          }
        });
      }
    }
  }, [pathname, searchParams]);

  return (
    <>
      {/* Script d'initialisation du Pixel Meta avec support de l'API Conversions */}
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
          
          // Initialisation du Pixel Meta
          fbq('init', '${META_PIXEL_ID}');
          
          // Premier événement PageView automatique
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

/**
 * Envoie un événement au serveur pour traitement via l'API Conversions Meta
 * Permet de contourner les bloqueurs de publicités et d'améliorer la précision du tracking
 */
async function sendServerSideEvent(params: ConversionAPIParams) {
  try {
    const response = await fetch('/api/track-conversion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
    
    if (!response.ok) {
      console.error('Erreur lors de l\'envoi de l\'événement au serveur');
    }
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'événement au serveur:', error);
  }
}