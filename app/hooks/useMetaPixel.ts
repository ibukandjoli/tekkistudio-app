import { useState, useCallback } from 'react';

type EventData = Record<string, any>;

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
 * Hook personnalisé pour faciliter l'utilisation du Pixel Meta et de l'API Conversions
 * 
 * @example
 * const { trackEvent, trackConversion, isTracking } = useMetaPixel();
 * 
 * // Utilisation pour un événement standard
 * const handleClick = () => {
 *   trackEvent('AddToCart', { product_id: '12345', value: 99.99 });
 * };
 * 
 * // Utilisation pour une conversion importante
 * const handlePurchase = () => {
 *   trackConversion('Purchase', {
 *     value: 99.99,
 *     currency: 'XOF',
 *     order_id: 'ORDER123'
 *   });
 * };
 */
export default function useMetaPixel() {
  const [isTracking, setIsTracking] = useState(false);

  /**
   * Envoie un événement au Pixel Meta
   * Idéal pour les interactions utilisateur non critiques
   */
  const trackEvent = useCallback((eventName: string, data: EventData = {}) => {
    if (typeof window === 'undefined' || !window.fbq) return;

    try {
      window.fbq('track', eventName, data);
    } catch (error) {
      console.error(`Erreur lors du tracking de l'événement ${eventName}:`, error);
    }
  }, []);

  /**
   * Envoie un événement au Pixel Meta ET à l'API Conversions
   * Idéal pour les conversions importantes (achats, leads, etc.)
   */
  const trackConversion = useCallback(async (eventName: string, data: EventData = {}, userData?: ConversionAPIParams['userData']) => {
    if (typeof window === 'undefined') return;

    setIsTracking(true);

    try {
      // Générer un ID d'événement unique pour la synchronisation
      const eventId = `conv_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

      // Envoyer via le Pixel (browser-side)
      if (window.fbq) {
        window.fbq('track', eventName, data, { eventID: eventId });
      }

      // Envoyer via l'API Conversions (server-side)
      await sendServerSideEvent({
        eventName,
        eventId,
        userData,
        customData: data
      });
    } catch (error) {
      console.error(`Erreur lors du tracking de la conversion ${eventName}:`, error);
    } finally {
      setIsTracking(false);
    }
  }, []);

  return { trackEvent, trackConversion, isTracking };
}

/**
 * Envoie un événement au serveur pour traitement via l'API Conversions
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
    
    return response.json();
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'événement au serveur:', error);
    throw error;
  }
}