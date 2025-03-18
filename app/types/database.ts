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
    channels: string[] | string;
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
  
  // Propriétés additionnelles
  target_audience?: string;
  skill_level_required?: string;
  time_required_weekly?: number | null;
  roi_estimation_months?: number | null;
  active_viewers_count?: number | null;
  garantee_days?: number | null;
  offer_expiry_date?: string | null;
  success_stories?: string[];
  benefits?: string[];
  
  // Structures complexes additionnelles
  common_questions?: Array<{
    question: string;
    answer: string;
  }> | null;
  
  monthly_costs_breakdown?: {
    [key: string]: number | string;
  } | null;
  
  projection_graph_data?: any | null;
  faqs?: any | null;
}

export interface BusinessGalleryProps {
  images: Array<{
    src: string;
    alt: string;
  }>;
  className?: string;
}

// Interfaces pour les props des composants
export interface ROICalculatorProps {
  monthlyPotential: number;
  price: number;
  roiMonths: number;
}

export interface KeyBenefitsProps {
  benefits?: string[];
}

export interface FAQSectionProps {
  questions?: Array<{
    question: string;
    answer: string;
  }> | null;
}

export interface KeyMetricsProps {
  business: Business;
}

export interface SocialProofProps {
  activeVisitors?: number;
  interestedCount?: number;
}

export interface ExclusiveOpportunityBannerProps {
  interestedCount?: number;
}

export interface AccompagnementTimelineProps {}

export interface GuaranteeProps {}

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