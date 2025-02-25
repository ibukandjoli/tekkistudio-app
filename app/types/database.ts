// app/types/database.ts
export interface Business {
    id: string;
    slug: string;
    name: string;
    category: string;
    type: 'physical' | 'digital';
    status: 'available' | 'sold';
    price: number;
    original_price: number;
    monthly_potential: number;
    pitch: string;
    description: string;
    images: {
      src: string;
      alt: string;
    }[];
    market_analysis: {
      size: string;
      growth: string;
      competition: string;
      opportunity: string;
    };
    product_details: {
      type: string;
      margin: string;
      suppliers: string;
      logistics: string;
    };
    marketing_strategy: {
      channels: string[];
      targetAudience: string;
      acquisitionCost: string;
      conversionRate: string;
    };
    financials: {
      setupCost: string;
      monthlyExpenses: string;
      breakevenPoint: string;
      roi: string;
    };
    includes: string[];
    created_at: string;
    updated_at: string;
  }
  
  export interface Brand {
    id: string;
    slug: string;
    name: string;
    category: string;
    description: string;
    short_description: string;
    challenge: string;
    solution: string;
    metrics: {
      sales: string;
      revenue: string;
      growth: string;
      rating: string;
      customers: string;
      countries: string;
    };
    timeline: {
      date: string;
      title: string;
      description: string;
    }[];
    images: {
      main: string;
      gallery: string[];
    };
    testimonials: {
      name: string;
      role: string;
      text: string;
    }[];
    products: {
      name: string;
      description: string;
      price: string;
    }[];
    created_at: string;
    updated_at: string;
  }
  
  export interface Formation {
    id: string;
    slug: string;
    title: string;
    category: string;
    description: string;
    long_description: string;
    duration: string;
    sessions: string;
    level: 'Débutant' | 'Intermédiaire' | 'Avancé' | 'Tous niveaux';
    price: string;
    price_amount: number;
    icon: string;
    benefits: string[];
    modules: {
      title: string;
      description: string;
      lessons: string[];
    }[];
    prerequisites: string[];
    formateur: {
      name: string;
      role: string;
      bio: string;
    };
    prochaine_sessions: {
      date: string;
      places: number;
    }[];
    created_at: string;
    updated_at: string;
  }

  export interface AdminUser {
    id: string;
    user_id: string;
    email: string;
    role: 'admin' | 'super_admin';
    created_at: string;
    updated_at: string;
  }
  
  export interface WhatsAppSubscriber {
    id: string;
    phone: string;
    country: string;
    subscribed_at: string;
    status: 'active' | 'inactive';
    last_message_sent: string | null;
  }
  
  export interface BusinessInterest {
    id: string;
    business_id: string;
    full_name: string;
    email: string;
    phone: string;
    country: string;
    city: string;
    payment_option: string;
    investment_readiness: string;
    experience: string | null;
    timeline: string;
    questions: string | null;
    status: 'new' | 'contacted' | 'negotiating' | 'sold' | 'cancelled';
    created_at: string;
    updated_at: string;
  }
  
  export interface FormationEnrollment {
    id: string;
    formation_id: string;
    session_date: string;
    full_name: string;
    email: string;
    phone: string;
    country: string;
    city: string;
    payment_option: string;
    payment_status: 'pending' | 'partial' | 'completed' | 'failed';
    amount_paid: number;
    created_at: string;
    updated_at: string;
  }
  
  export interface Payment {
    id: string;
    type: 'business' | 'formation';
    reference_id: string;
    amount: number;
    payment_method: string;
    payment_provider: string;
    provider_transaction_id: string | null;
    status: 'pending' | 'completed' | 'failed';
    created_at: string;
    updated_at: string;
  }