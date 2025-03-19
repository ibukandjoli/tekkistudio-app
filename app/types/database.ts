// app/types/database.ts

// Structure pour les questions fréquentes
export interface FAQ {
  question: string;
  answer: string;
}

// Structure pour les histoires de réussite
export interface SuccessStory {
  name: string;
  business: string;
  testimonial: string;
  revenue?: string;
  photo?: string;
}

// Structure pour les données de projection graphique
export interface ProjectionGraphData {
  months: string[];
  revenue: number[];
  expenses: number[];
  profit: number[];
}

// Structure pour la répartition des coûts mensuels
export interface MonthlyCostsBreakdown {
  hosting?: number;
  marketing?: number;
  stock?: number;
  other?: number;
  [key: string]: number | undefined;
}

// Structure pour l'image
export interface BusinessImage {
  src: string;
  alt: string;
}

// Structure pour l'analyse du marché
export interface MarketAnalysis {
  size: string;
  growth: string;
  competition: string;
  opportunity: string;
}

// Structure pour les détails du produit
export interface ProductDetails {
  type: string;
  margin: string;
  suppliers: string;
  logistics: string;
}

// Structure pour la stratégie marketing
export interface MarketingStrategy {
  channels: string[] | string;
  targetAudience: string;
  acquisitionCost: string;
  conversionRate: string;
}

// Structure pour les aspects financiers
export interface Financials {
  setupCost: string;
  monthlyExpenses: string;
  breakevenPoint: string;
  roi: string;
}

// Business type complet
export interface Business {
  id: string;
  created_at: string;
  updated_at: string;
  
  // Informations de base
  slug: string;
  name: string;
  category: string;
  type: 'physical' | 'digital';
  status: 'available' | 'reserved' | 'sold';
  price: number;
  original_price: number;
  monthly_potential: number;
  pitch: string;
  description: string;
  
  // Données structurées
  images: BusinessImage[];
  market_analysis: MarketAnalysis;
  product_details: ProductDetails;
  marketing_strategy: MarketingStrategy;
  financials: Financials;
  
  // Caractéristiques et inclusions
  includes: string[];
  benefits?: string[];
  
  // Données pour le public cible
  target_audience?: string;
  skill_level_required?: string;
  time_required_weekly?: number | null;
  
  // Données financières additionnelles
  roi_estimation_months?: number | null;
  monthly_costs_breakdown?: MonthlyCostsBreakdown | null;
  
  // Historique et preuves sociales
  success_stories?: SuccessStory[];
  
  // Questions et réponses
  common_questions?: FAQ[] | null;
  faqs?: FAQ[] | null;
  
  // Dynamique de l'offre
  active_viewers_count?: number | null;
  offer_expiry_date?: string | null;
  garantee_days?: number | null;
  
  // Données pour visualisations
  projection_graph_data?: ProjectionGraphData | null;
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