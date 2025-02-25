// app/lib/meta-events.ts
/**
 * Utilitaire pour suivre les événements Meta Pixel
 * Fournit des méthodes pour les événements standard et personnalisés
 */

/**
 * Suit un événement standard sur Meta Pixel
 * 
 * @param eventName - Nom de l'événement standard (ex: 'Purchase', 'Lead', 'ViewContent')
 * @param params - Paramètres supplémentaires pour l'événement
 */
export function trackStandardEvent(
    eventName: 
      | 'AddPaymentInfo'
      | 'AddToCart'
      | 'AddToWishlist'
      | 'CompleteRegistration'
      | 'Contact'
      | 'CustomizeProduct'
      | 'Donate'
      | 'FindLocation'
      | 'InitiateCheckout'
      | 'Lead'
      | 'Purchase'
      | 'Schedule'
      | 'Search'
      | 'StartTrial'
      | 'SubmitApplication'
      | 'Subscribe'
      | 'ViewContent', 
    params?: Record<string, any>
  ) {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', eventName, params);
      console.log(`[Meta Pixel] Événement standard suivi: ${eventName}`, params);
    } else {
      console.warn(`[Meta Pixel] Impossible de suivre l'événement: fbq n'est pas disponible`);
    }
  }
  
  /**
   * Suit un événement personnalisé sur Meta Pixel
   * 
   * @param eventName - Nom de l'événement personnalisé
   * @param params - Paramètres supplémentaires pour l'événement
   */
  export function trackCustomEvent(
    eventName: string, 
    params?: Record<string, any>
  ) {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('trackCustom', eventName, params);
      console.log(`[Meta Pixel] Événement personnalisé suivi: ${eventName}`, params);
    } else {
      console.warn(`[Meta Pixel] Impossible de suivre l'événement: fbq n'est pas disponible`);
    }
  }
  
  // Événements spécifiques à l'application
  export const MetaEvents = {
    // Business
    viewBusiness: (businessId: string, businessName: string) => 
      trackStandardEvent('ViewContent', { 
        content_type: 'business', 
        content_ids: [businessId],
        content_name: businessName
      }),
    
    requestBusinessInfo: (businessId: string, businessName: string) =>
      trackStandardEvent('Lead', { 
        content_type: 'business', 
        content_ids: [businessId],
        content_name: businessName
      }),
    
    // Formations
    viewFormation: (formationId: string, formationName: string) =>
      trackStandardEvent('ViewContent', { 
        content_type: 'formation', 
        content_ids: [formationId],
        content_name: formationName
      }),
    
    enrollFormation: (formationId: string, formationName: string, value: number) =>
      trackStandardEvent('Purchase', { 
        content_type: 'formation',
        content_ids: [formationId],
        content_name: formationName,
        value: value,
        currency: 'XOF'
      }),
    
    // Marques
    viewBrand: (brandId: string, brandName: string) =>
      trackStandardEvent('ViewContent', { 
        content_type: 'brand', 
        content_ids: [brandId],
        content_name: brandName
      }),
    
    // Autres
    subscribe: (type: 'newsletter' | 'whatsapp') =>
      trackStandardEvent('Subscribe', { content_name: type }),
    
    contactForm: () =>
      trackStandardEvent('Contact'),
    
    // Événements personnalisés
    downloadResource: (resourceName: string) =>
      trackCustomEvent('DownloadResource', { resource_name: resourceName }),
    
    watchVideo: (videoName: string) =>
      trackCustomEvent('WatchVideo', { video_name: videoName })
  };
  
  // Types pour l'utilisation dans les composants
  declare global {
    interface Window {
      fbq: (
        method: 'track' | 'init' | 'trackCustom',
        eventName: string,
        params?: Record<string, any>
      ) => void;
    }
  }