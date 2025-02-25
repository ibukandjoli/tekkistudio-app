// app/components/analytics/MetaPixel.tsx
'use client';

import Script from 'next/script';

// Remplacer cette valeur par votre ID pixel Meta réel
const META_PIXEL_ID = '601446776036363';

/**
 * Composant principal pour l'intégration du Pixel Meta
 * Ne contient pas de hooks qui requièrent Suspense
 */
export default function MetaPixel() {
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

      {/* Composant qui gère les événements de navigation séparément */}
      <PageViewTracker />
    </>
  );
}

/**
 * Composant séparé pour le tracking des pages vues
 * Utilise useSearchParams() et est encapsulé dans un Suspense
 */
function PageViewTracker() {
  // Import dynamique pour éviter les erreurs de suspense
  const { useEffect } = require('react');
  const { usePathname, useSearchParams } = require('next/navigation');

  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Suivre les changements de page
  useEffect(() => {
    if (pathname && typeof window !== 'undefined' && window.fbq) {
      // Générer un ID d'événement unique pour la synchronisation avec l'API Conversions
      const eventId = `pageview_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      
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
  }, [pathname, searchParams]);

  return null;
}

/**
 * Envoie un événement au serveur pour traitement via l'API Conversions Meta
 */
async function sendServerSideEvent(params: any) {
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