// app/components/global/TekkiChatbot/types.ts

/**
 * Types pour les messages du chatbot
 */
export interface Message {
    id: number;
    content: string;
    type: 'assistant' | 'user';
    timestamp: Date;
    context?: PageContext;
    suggestions?: string[];
  }
    
  /**
   * Type pour le contexte de la page
   */
  export interface PageContext {
    page: string;
    url: string;
  }
    
  /**
   * Type pour la configuration du chatbot
   */
  export interface ChatbotConfig {
    id: string;
    initial_suggestions: string[];
    welcome_message: string;
    human_trigger_phrases: string[];
    prompt_boost: string;
    ai_model?: string;
    behavior_profile?: string;
    knowledge_base_url?: string;
    knowledge_base_content?: string;
    created_at: string;
    updated_at: string;
  }
    
  /**
   * Type pour les questions fréquentes
   */
  export interface CommonQuestion {
    id: string;
    question: string;
    answer: string;
    category: string;
    is_active: boolean;
    created_at: string;
    customSuggestions?: string[];
  }
    
  /**
   * Type pour les business depuis la base de données
   */
  export interface Business {
    id: string;
    name: string;
    price: number;
    monthly_potential?: number;
    revenue_potential?: number;
    margin?: string | number;
    slug: string;
    category?: string;
    description?: string;
    short_description?: string;
    roi_estimation_months?: number;
    time_required_weekly?: string;
    time_required?: string | number;
    type?: string; 
    status?: string; 
    target_audience?: string; 
    skill_level_required?: string;
    tags?: string[];
    created_at?: string; // Ajouté pour le tri par date
    benefits?: string[]; // Ajouté pour supporter l'affichage des avantages du business
  }
    
  /**
   * Type pour le suivi du funnel de conversion
   */
  export interface ConversionFunnel {
    stage: 'awareness' | 'interest' | 'consideration' | 'decision';
    lastActive: Date;
    businessesViewed: string[];
    topicsDiscussed: string[];
    objections: string[];
    readyToBuy: boolean;
  }
    
  /**
   * Type pour les fallbacks de business
   */
  export interface BusinessFallback {
    description: string;
    keywords: string[];
    price?: number;
    roi?: string;
  }
    
  /**
   * Type pour un message de l'API
   */
  export interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
  }
  
  /**
   * Type pour les props du ChatContainer
   */
  export interface ChatContainerProps {
    isOpen: boolean;
    showBubble: boolean;
    isMobileDevice: boolean;
    isIOSDevice: boolean;
    messages: Message[];
    isTyping: boolean;
    userScrolling: boolean;
    messagesContainerRef: React.RefObject<HTMLDivElement>; // Ajouté pour passer la référence
    messagesEndRef: React.RefObject<HTMLDivElement>; // Ajouté pour passer la référence
    onSetOpen: (isOpen: boolean) => void;
    onSetShowBubble: (showBubble: boolean) => void;
    onSendMessage: (message: string) => void;
    onSuggestionClick: (suggestion: string) => void;
    onOpenWhatsApp: () => void;
    onScrollToBottom: (force?: boolean) => void;
  }