// app/lib/utils/lead-utils.ts

// Types
export interface RamadanLead {
    id: string;
    created_at: string;
    full_name: string;
    email: string;
    phone: string;
    country: string;
    city: string;
    business_name: string;
    business_description: string;
    existing_website: string;
    lead_source: string;
    payment_status: string;
    amount_paid: number;
    total_amount: number;
    transaction_id: string;
    status: 'new' | 'contacted' | 'in_progress' | 'completed' | 'cancelled';
    notes: string;
  }
  
  export interface FallbackLead {
    id: string;
    created_at: string;
    formation_id: string;
    full_name: string;
    email: string;
    phone: string;
    country: string;
    city: string;
    payment_status: string;
    amount_paid: number;
    metadata: {
      businessName: string;
      businessDescription: string;
      existingWebsite: string;
      howDidYouHear: string;
      promoType: string;
      transactionId: string;
      status?: string;
      notes?: string;
    };
  }
  
  /**
   * Convertit un lead du format fallback (formation_enrollments) au format standard (ramadan_promo_leads)
   */
  export const convertFallbackLead = (fallbackLead: FallbackLead): RamadanLead => {
    return {
      id: fallbackLead.id,
      created_at: fallbackLead.created_at,
      full_name: fallbackLead.full_name,
      email: fallbackLead.email,
      phone: fallbackLead.phone,
      country: fallbackLead.country,
      city: fallbackLead.city,
      business_name: fallbackLead.metadata?.businessName || '',
      business_description: fallbackLead.metadata?.businessDescription || '',
      existing_website: fallbackLead.metadata?.existingWebsite || '',
      lead_source: fallbackLead.metadata?.howDidYouHear || '',
      payment_status: fallbackLead.payment_status,
      amount_paid: fallbackLead.amount_paid,
      total_amount: fallbackLead.amount_paid * 2, // Estimation basée sur 50%
      transaction_id: fallbackLead.metadata?.transactionId || '',
      status: (fallbackLead.metadata?.status as any) || 'new',
      notes: fallbackLead.metadata?.notes || ''
    };
  };
  
  /**
   * Obtient la classe CSS pour le badge de statut
   */
  export const getStatusBadgeClass = (status: string): string => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  /**
   * Traduit un statut en français
   */
  export const translateStatus = (status: string): string => {
    switch (status) {
      case 'new': return 'Nouveau';
      case 'contacted': return 'Contacté';
      case 'in_progress': return 'En cours';
      case 'completed': return 'Terminé';
      case 'cancelled': return 'Annulé';
      default: return status;
    }
  };
  
  /**
   * Traduit un statut de paiement en français
   */
  export const translatePaymentStatus = (status: string): string => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'partial_paid': return 'Partiellement payé';
      case 'fully_paid': return 'Payé intégralement';
      case 'cancelled': return 'Annulé';
      default: return status;
    }
  };
  
  /**
   * Formate un prix avec des espaces comme séparateurs de milliers
   */
  export const formatPrice = (price: number): string => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };
  
  /**
   * Formate une date au format français
   */
  export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };