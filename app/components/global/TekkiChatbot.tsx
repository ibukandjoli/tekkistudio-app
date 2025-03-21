// app/components/global/TekkiChatbot.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Loader2, MessageSquare, ArrowRight, ArrowDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import WhatsAppIcon from '../ui/WhatsAppIcon';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

// Définition des interfaces pour la gestion des types
interface Message {
  id: number;
  content: string;
  type: 'assistant' | 'user';
  timestamp: Date;
  context?: {
    page: string;
    url: string;
  };
  suggestions?: string[];
}

interface PageContext {
  page: string;
  url: string;
}

interface ChatbotConfig {
  id: string;
  initial_suggestions: string[];
  welcome_message: string;
  human_trigger_phrases: string[];
  prompt_boost: string;
  ai_model?: string;
  behavior_profile?: string;
  created_at: string;
  updated_at: string;
}

// Interface pour le suivi du funnel de conversion
interface ConversionFunnel {
  stage: 'awareness' | 'interest' | 'consideration' | 'decision';
  lastActive: Date;
  businessesViewed: string[];
  topicsDiscussed: string[];
  objections: string[];
  readyToBuy: boolean;
}

// Interface pour les fallbacks de business
interface BusinessFallback {
  description: string;
  keywords: string[];
  price?: number;
  roi?: string;
}

interface BusinessFallbacks {
  [key: string]: BusinessFallback;
}

// Interface pour les business depuis la BDD
interface Business {
    id: string;
    name: string;
    price: number;
    monthly_potential?: number;
    slug: string;
    category?: string;
    description?: string;
    roi_estimation_months?: number;
    time_required_weekly?: string; 
    type?: string; 
    status?: string; 
    target_audience?: string; 
    skill_level_required?: string;
  }

// Suggestions critiques à toujours afficher
const criticalSuggestions = [
  "Contacter un conseiller",
  "Ouvrir WhatsApp",
  "Retour à l'accueil",
  "Voir nos business"
];

// Suggestions par défaut au cas où la configuration n'est pas chargée
const defaultSuggestions = [
  "Je veux acheter un de vos business",
  "Je veux un site e-commerce",
  "Je veux me former en e-commerce",
  "Je veux plus d'infos sur un business"
];

// Message de bienvenue par défaut
const getDefaultWelcomeMessage = (): string => {
  const hour = new Date().getHours();
  let greeting = '';
  
  if (hour >= 5 && hour < 12) {
    greeting = 'Bonjour';
  } else if (hour >= 12 && hour < 18) {
    greeting = 'Bon après-midi';
  } else {
    greeting = 'Bonsoir';
  }

  return `${greeting} 👋🏼 Je suis Sara, Assistante Commerciale chez TEKKI Studio. Comment puis-je vous aider ?`;
};

// Fallback par défaut au cas où le chargement échoue
const defaultBusinessFallbacks: BusinessFallbacks = {
  "livres pour enfants": {
    description: "Je suis très heureuse de le savoir ! Puis-je savoir lequel de nos business vous intéresse, et quelles informations vous souhaitez avoir à son sujet ? Cela me permettra de vous aider de manière efficace.",
    keywords: ["livre", "enfant", "littérature", "jeunesse", "éducation"]
  }
};

// Détection d'appareil mobile
const isMobile = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth <= 768 || 
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// Détection d'iOS
const isIOS = () => {
  if (typeof window === 'undefined') return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
};

export default function TekkiChatbot() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [showBubble, setShowBubble] = useState(true);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [config, setConfig] = useState<ChatbotConfig | null>(null);
  const [isConfigLoading, setIsConfigLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [isIOSDevice, setIsIOSDevice] = useState(false);
  const [sessionId] = useState(() => uuidv4()); // ID unique pour la session
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [businessFallbacks, setBusinessFallbacks] = useState<BusinessFallbacks>(defaultBusinessFallbacks);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isFirstRenderComplete, setIsFirstRenderComplete] = useState(false);
  const [userScrolling, setUserScrolling] = useState(false);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  
  // État du funnel de conversion
  const [conversionFunnel, setConversionFunnel] = useState<ConversionFunnel>({
    stage: 'awareness',
    lastActive: new Date(),
    businessesViewed: [],
    topicsDiscussed: [],
    objections: [],
    readyToBuy: false
  });

  // Si nous sommes sur une page admin, on ne rend pas le chatbot
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  // Fonction auxiliaire pour traiter les URLs ordinaires dans un segment de texte
  const parseUrlsInText = (text: string) => {
    if (!text.includes('http')) return text;
    
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const segments: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;
    
    // Réinitialiser le regex pour une nouvelle recherche
    urlRegex.lastIndex = 0;
    
    while ((match = urlRegex.exec(text)) !== null) {
      // Ajouter le texte avant l'URL
      if (match.index > lastIndex) {
        segments.push(text.substring(lastIndex, match.index));
      }
      
      // Ajouter l'URL en tant qu'élément cliquable
      segments.push(
        <a 
          key={`url-${match.index}`} 
          href={match[0]} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-[#FF7F50] hover:underline font-medium"
        >
          {match[0]}
        </a>
      );
      
      lastIndex = match.index + match[0].length;
    }
    
    // Ajouter le reste du texte après la dernière URL
    if (lastIndex < text.length) {
      segments.push(text.substring(lastIndex));
    }
    
    return <>{segments}</>;
  };

  // Fonction améliorée pour rendre les liens cliquables
  const parseMessageWithLinks = (text: string) => {
    // Regex pour identifier les liens Markdown de la forme [texte](url)
    const markdownLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    
    // Si aucun lien potentiel détecté, retourner le texte intact
    if (!text.includes('http') && !text.includes('[')) {
      return text;
    }

    // Traiter les liens Markdown
    if (text.includes('[') && text.includes('](')) {
      // Diviser le texte en segments (texte normal et liens)
      const segments: React.ReactNode[] = [];
      let lastIndex = 0;
      let match;
      
      // Réinitialiser le regex pour une nouvelle recherche
      markdownLinkRegex.lastIndex = 0;
      
      while ((match = markdownLinkRegex.exec(text)) !== null) {
        // Ajouter le texte avant le lien
        if (match.index > lastIndex) {
          // Traiter ce segment pour les URLs ordinaires
          const beforeText = text.substring(lastIndex, match.index);
          segments.push(parseUrlsInText(beforeText));
        }
        
        // Ajouter le lien Markdown en tant qu'élément cliquable
        segments.push(
          <a 
            key={`md-${match.index}`} 
            href={match[2]} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[#FF7F50] hover:underline font-medium"
          >
            {match[1]}
          </a>
        );
        
        lastIndex = match.index + match[0].length;
      }
      
      // Ajouter le reste du texte après le dernier lien
      if (lastIndex < text.length) {
        segments.push(parseUrlsInText(text.substring(lastIndex)));
      }
      
      return <>{segments}</>;
    }
    
    // Si pas de liens Markdown, traiter les URLs ordinaires
    return parseUrlsInText(text);
  };

  // Fonction pour formater le texte avec des paragraphes
  const formatMessageText = (text: string) => {
    // Diviser le texte en paragraphes (séparés par des lignes vides ou simples)
    const paragraphs = text.split(/\n{1,}/g);
    
    return (
      <>
        {paragraphs.map((paragraph, index) => (
          <p key={index} className={index > 0 ? "mt-3" : ""}>
            {parseMessageWithLinks(paragraph)}
          </p>
        ))}
      </>
    );
  };

  // Charger les businesses depuis Supabase à l'initialisation
  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const { data, error } = await supabase
          .from('businesses')
          .select('id, name, price, monthly_potential, slug, category, description, roi_estimation_months')
          .eq('status', 'available')
          .order('name');
        
        if (error) {
          console.error("Erreur lors du chargement des business:", error);
          return;
        }
        
        if (data && data.length > 0) {
          console.log("Businesses chargés avec succès:", data.length);
          setBusinesses(data);
          
          // Créer également des fallbacks basés sur les businesses chargés
          const fallbacksMap: BusinessFallbacks = {};
          data.forEach(business => {
            const keywords = business.category 
              ? [business.category, ...business.name.toLowerCase().split(/\s+/)]
              : business.name.toLowerCase().split(/\s+/);
            
            fallbacksMap[business.name] = {
              description: business.description || `${business.name} est l'un de nos business e-commerce clé en main à ${business.price.toLocaleString()} FCFA avec un potentiel mensuel de ${business.monthly_potential?.toLocaleString() || 'N/A'} FCFA.`,
              keywords: [...new Set(keywords.filter((k: string) => k.length > 2))] as string[],
              price: business.price,
              roi: business.roi_estimation_months ? `Le ROI estimé est d'environ ${business.roi_estimation_months} mois.` : undefined
            };
          });
          
          // Fusionner avec les fallbacks existants
          setBusinessFallbacks(prevFallbacks => ({
            ...prevFallbacks,
            ...fallbacksMap
          }));
        }
      } catch (err) {
        console.error("Exception lors du chargement des business:", err);
      }
    };
    
    fetchBusinesses();
  }, []);

  // Marquage du premier rendu terminé
  useEffect(() => {
    setIsFirstRenderComplete(true);
  }, []);

  // Détection du mobile et iOS
  useEffect(() => {
    setIsMobileDevice(isMobile());
    setIsIOSDevice(isIOS());
    const handleResize = () => setIsMobileDevice(isMobile());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Chargement des fallbacks de business depuis Supabase
  useEffect(() => {
    const loadBusinessFallbacks = async () => {
      try {
        // Charger les business et leurs fallbacks depuis Supabase
        const { data, error } = await supabase
          .from('business_fallbacks')
          .select('*');
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          // Transformer les données en format utilisable
          const fallbacksMap: BusinessFallbacks = {};
          data.forEach(item => {
            fallbacksMap[item.name] = {
              description: item.description,
              keywords: item.keywords || [],
              price: item.price,
              roi: item.roi
            };
          });
          
          setBusinessFallbacks(fallbacksMap);
        } else {
          // Utiliser les fallbacks par défaut si aucune donnée
          setBusinessFallbacks(defaultBusinessFallbacks);
        }
      } catch (err) {
        console.error("Erreur lors du chargement des fallbacks:", err);
        // Fallbacks par défaut en cas d'erreur
        setBusinessFallbacks(defaultBusinessFallbacks);
      }
    };
    
    loadBusinessFallbacks();
  }, []);

  // Gestion avancée du clavier mobile
  useEffect(() => {
    if (!isMobileDevice) return;

    // Variables pour suivre la hauteur de la fenêtre
    let originalWindowHeight = window.innerHeight;
    
    // Détection améliorée de l'ouverture du clavier virtuel
    const detectKeyboard = () => {
      // Sur iOS, la hauteur de window ne change pas nécessairement comme prévu
      // On utilise une approche basée sur la différence de hauteur
      const currentWindowHeight = window.innerHeight;
      const heightDifference = originalWindowHeight - currentWindowHeight;
      
      // Si la différence est significative (plus de 150px), le clavier est probablement ouvert
      const isKeyboardVisible = heightDifference > 150;
      
      setKeyboardOpen(isKeyboardVisible);
      
      if (isKeyboardVisible) {
        // Ajuster les styles quand le clavier est ouvert
        document.body.classList.add('keyboard-visible');
        
        // Assurer que l'interface reste fixe
        if (chatContainerRef.current) {
          chatContainerRef.current.style.width = '100vw';
          chatContainerRef.current.style.maxWidth = '100%';
          chatContainerRef.current.style.overflowX = 'hidden';
        }
        
        // S'assurer que le champ de saisie est visible
        setTimeout(() => {
          scrollToBottom();
          messageInputRef.current?.focus();
        }, 100);
      } else {
        // Restaurer les styles quand le clavier se ferme
        document.body.classList.remove('keyboard-visible');
        
        // Réinitialiser la hauteur originale lors d'un changement d'orientation
        if (Math.abs(originalWindowHeight - currentWindowHeight) < 150) {
          originalWindowHeight = currentWindowHeight;
        }
        
        setTimeout(scrollToBottom, 100);
      }
    };

    // Détecter les changements dans la taille de fenêtre (ouverture/fermeture du clavier)
    window.addEventListener('resize', detectKeyboard);
    
    // Pour iOS, nous surveillons également l'orientation
    window.addEventListener('orientationchange', () => {
      // Laisser le temps au navigateur de mettre à jour les dimensions
      setTimeout(() => {
        originalWindowHeight = window.innerHeight;
        detectKeyboard();
      }, 300);
    });

    // Empêcher le scroll du body quand le chat est ouvert sur mobile
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100%';
      
      // Stocker la hauteur originale au moment de l'ouverture
      originalWindowHeight = window.innerHeight;
      
      // Vérifier immédiatement l'état du clavier
      detectKeyboard();
    }

    return () => {
      window.removeEventListener('resize', detectKeyboard);
      window.removeEventListener('orientationchange', detectKeyboard);
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
      document.body.classList.remove('keyboard-visible');
    };
  }, [isOpen, isMobileDevice]);

  // Gestion spécifique pour iOS
  useEffect(() => {
    if (!isMobileDevice || !isIOSDevice) return;
    
    // Spécifique à iOS: gérer le redimensionnement de la page quand le clavier s'ouvre
    const handleIOSKeyboard = () => {
      // S'assurer que le champ d'entrée reste visible
      if (messagesContainerRef.current && keyboardOpen) {
        // Sur iOS, nous devons décaler le contenu vers le haut
        messagesContainerRef.current.style.height = `calc(100vh - 160px - ${document.activeElement === messageInputRef.current ? '300px' : '0px'})`;
      }
      
      // Définir des fonctions spécifiques de gestion d'événements
      const handleFocus = () => scrollToBottom();
      const handleBlur = () => {
        if (messagesContainerRef.current) {
          messagesContainerRef.current.style.height = keyboardOpen ? 'calc(100vh - 160px)' : 'auto';
        }
        setTimeout(scrollToBottom, 100);
      };
      
      // S'assurer que le focus et le blur sont correctement gérés
      if (messageInputRef.current) {
        messageInputRef.current.addEventListener('focus', handleFocus);
        messageInputRef.current.addEventListener('blur', handleBlur);
      }
      
      return () => {
        if (messageInputRef.current) {
          messageInputRef.current.removeEventListener('focus', handleFocus);
          messageInputRef.current.removeEventListener('blur', handleBlur);
        }
      };
    };
    
    handleIOSKeyboard();
    
    // Ajouter un gestionnaire pour améliorer le défilement sur iOS
    const enhancedIOSScroll = () => {
      // Technique de défilement supplémentaire pour iOS
      if (messagesContainerRef.current && messagesEndRef.current) {
        setTimeout(() => {
          if (messagesContainerRef.current) {
            const scrollHeight = messagesContainerRef.current.scrollHeight;
            messagesContainerRef.current.scrollTop = scrollHeight;
            
            // Parfois le premier scroll ne fonctionne pas sur iOS, donc on réessaie
            setTimeout(() => {
              if (messagesContainerRef.current) {
                messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
              }
            }, 50);
          }
        }, 10);
      }
    };
    
    // Attacher le gestionnaire aux événements de défilement et de touch
    if (messagesContainerRef.current) {
      messagesContainerRef.current.addEventListener('touchend', enhancedIOSScroll);
      messagesContainerRef.current.addEventListener('touchmove', enhancedIOSScroll);
    }
    
    return () => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.removeEventListener('touchend', enhancedIOSScroll);
        messagesContainerRef.current.removeEventListener('touchmove', enhancedIOSScroll);
      }
    };
  }, [keyboardOpen, isMobileDevice, isIOSDevice]);

  // Charger la configuration du chatbot au démarrage
  useEffect(() => {
    const fetchChatbotConfig = async () => {
      try {
        setIsConfigLoading(true);
        
        const { data, error } = await supabase
          .from('chatbot_config')
          .select('*')
          .single();
        
        if (error) {
          console.error('Erreur lors du chargement de la configuration du chatbot:', error);
          // En cas d'erreur, on utilise les valeurs par défaut
          initializeChatWithDefaults();
        } else if (data) {
          setConfig(data);
          
          // Initialiser les messages avec le message de bienvenue de la configuration
          setMessages([{
            id: 1,
            content: data.welcome_message || getDefaultWelcomeMessage(),
            type: 'assistant',
            timestamp: new Date(),
            suggestions: data.initial_suggestions && data.initial_suggestions.length > 0 
              ? data.initial_suggestions 
              : defaultSuggestions
          }]);
        } else {
          // Si pas de données, on utilise les valeurs par défaut
          initializeChatWithDefaults();
        }
      } catch (error) {
        console.error('Erreur lors de la récupération de la configuration:', error);
        initializeChatWithDefaults();
      } finally {
        setIsConfigLoading(false);
      }
    };

    fetchChatbotConfig();
  }, []);

  // Ajouter un effet pour détecter le défilement de l'utilisateur
  useEffect(() => {
    const handleScroll = () => {
      if (!messagesContainerRef.current) return;
      
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const isScrollingUp = scrollTop < lastScrollTop;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 50;
      
      setLastScrollTop(scrollTop);
      
      if (isScrollingUp) {
        setUserScrolling(true);
      } else if (isNearBottom) {
        setUserScrolling(false);
      }
    };
    
    const messagesContainer = messagesContainerRef.current;
    if (messagesContainer) {
      messagesContainer.addEventListener('scroll', handleScroll);
    }
    
    return () => {
      if (messagesContainer) {
        messagesContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, [lastScrollTop]);

  // Observer les nouveaux messages pour un défilement automatique
  useEffect(() => {
    if (isFirstRenderComplete) {
      // Scroll automatique uniquement pour les nouveaux messages ou si l'utilisateur n'est pas en train de défiler
      const isNewMessage = messages.length > 0;
      if (isNewMessage && !userScrolling) {
        // Utiliser un seul timeout au lieu de multiples défilements forcés
        setTimeout(() => scrollToBottom(), 100);
      }
    }
  }, [messages, isTyping, isFirstRenderComplete, userScrolling]);

  // Forcer le scrolling lorsque le chatbot est ouvert
  useEffect(() => {
    if (isOpen && isFirstRenderComplete) {
      setTimeout(scrollToBottom, 300);
    }
  }, [isOpen, isFirstRenderComplete]);

  // Enregistrer l'état du funnel
  useEffect(() => {
    // Sauvegarder l'état du funnel à chaque changement d'étape
    const saveFunnelState = async () => {
      try {
        // Ne sauvegarder que si l'utilisateur a interagi
        if (messages.length <= 1) return;
        
        // Enregistrer dans une nouvelle table 'chat_conversion_funnel'
        await supabase.from('chat_conversion_funnel').insert([{
          session_id: sessionId,
          funnel_stage: conversionFunnel.stage,
          businesses_viewed: conversionFunnel.businessesViewed,
          topics_discussed: conversionFunnel.topicsDiscussed,
          objections: conversionFunnel.objections,
          ready_to_buy: conversionFunnel.readyToBuy,
          url: pathname || '/',
          created_at: new Date().toISOString()
        }]);
      } catch (error) {
        console.warn('Erreur lors de la sauvegarde du funnel:', error);
      }
    };
    
    saveFunnelState();
  }, [conversionFunnel.stage, conversionFunnel.readyToBuy, messages.length, pathname, sessionId]);

  // Fonction pour initialiser le chat avec des valeurs par défaut
  const initializeChatWithDefaults = () => {
    setMessages([{
      id: 1,
      content: getDefaultWelcomeMessage(),
      type: 'assistant',
      timestamp: new Date(),
      suggestions: defaultSuggestions
    }]);
  };
  
  // Fonction améliorée pour détecter le business mentionné dans le message
  // Cette version utilise une approche par score de pertinence
  const detectBusinessType = (messageText: string): string | null => {
    const messageLC = messageText.toLowerCase();
    
    // Structure pour stocker les scores de chaque business
    interface BusinessScore {
      name: string;
      score: number; 
    }
    
    const scores: BusinessScore[] = [];
    
    // Calculer un score pour chaque business
    for (const [businessName, businessInfo] of Object.entries(businessFallbacks)) {
      let score = 0;
      
      // Correspondance directe avec le nom du business (poids élevé)
      if (messageLC.includes(businessName.toLowerCase())) {
        score += 10;
      }
      
      // Recherche de correspondance partielle du nom (ex: "livres" dans "livres pour enfants")
      const businessNameWords = businessName.toLowerCase().split(/\s+/);
      for (const word of businessNameWords) {
        if (word.length > 3 && messageLC.includes(word)) {
          score += 5;
        }
      }
      
      // Correspondance avec les mots-clés (poids moyen)
      if (businessInfo.keywords) {
        for (const keyword of businessInfo.keywords) {
          if (messageLC.includes(keyword.toLowerCase())) {
            score += 3;
          }
        }
      }
      
      // Recherche de correspondance contextuelle
      if (messageLC.includes('prix') && businessInfo.price) {
        score += 2;
      }
      
      if (messageLC.includes('rentab') || messageLC.includes('roi') || messageLC.includes('retour')) {
        score += 2;
      }
      
      // Ajouter le business avec son score à notre liste
      if (score > 0) {
        scores.push({ name: businessName, score });
      }
    }
    
    // Si nous avons des correspondances, prendre celle avec le score le plus élevé
    if (scores.length > 0) {
      // Trier par score décroissant
      scores.sort((a, b) => b.score - a.score);
      
      // Un score minimum pour considérer une correspondance valide
      if (scores[0].score >= 3) {
        return scores[0].name;
      }
    }
    
    // Vérifier s'il s'agit d'une demande de liste de business
    if (isAskingForBusinessList(messageLC)) {
      return "BUSINESS_LIST";
    }
    
    // Pas de correspondance trouvée
    return null;
  };
  
  // Fonction pour vérifier si un message correspond à plusieurs business 
  // afin de générer une réponse spéciale
  const detectMultipleBusinessInterest = (messageText: string): Business[] => {
    const messageLC = messageText.toLowerCase();
    const matchedBusinesses: Business[] = [];
    
    // Mots-clés indiquant un intérêt général pour les business
    const generalInterestKeywords = [
      'tous', 'toutes', 'liste', 'quels', 'quelles', 'types de business', 
      'business disponibles', 'business proposés', 'business en vente',
      'montrez-moi', 'business avez-vous', 'ensemble des business'
    ];
    
    // Si le message contient des mots-clés d'intérêt général
    const hasGeneralInterest = generalInterestKeywords.some(keyword => 
      messageLC.includes(keyword.toLowerCase())
    );
    
    if (hasGeneralInterest) {
        // Lister tous les business disponibles (limités à 6)
        const businessSuggestions = businesses.slice(0, 6).map(b => `En savoir plus sur ${b.name}`);
        return businesses.slice(0, 6);
      }
    
    // Sinon, chercher des correspondances spécifiques
    for (const business of businesses) {
      const businessNameLC = business.name.toLowerCase();
      const categoryLC = business.category?.toLowerCase() || '';
      
      // Vérifier si le nom du business est mentionné
      if (messageLC.includes(businessNameLC)) {
        matchedBusinesses.push(business);
      } 
      // Vérifier si la catégorie est mentionnée
      else if (categoryLC && messageLC.includes(categoryLC)) {
        matchedBusinesses.push(business);
      }
    }
    
    return matchedBusinesses;
  };

  // Fonction pour vérifier si le message demande une liste des business
  const isAskingForBusinessList = (messageText: string): boolean => {
    const lowerCaseMessage = messageText.toLowerCase();
    
    // Mots clés qui indiquent que l'utilisateur veut voir les business disponibles
    const businessKeywords = [
      'quels sont les business',
      'liste des business',
      'business disponible',
      'business en vente',
      'voir les business',
      'montrer les business',
      'business proposé',
      'quel business',
      'quels business',
      'business que vous avez',
      'business que vous proposez',
      'tous vos business'
    ];
    
    return businessKeywords.some(keyword => lowerCaseMessage.includes(keyword));
  };

  // Fonction pour générer une réponse avec la liste des business disponibles
  const generateBusinessListResponse = (): { content: string; suggestions: string[] } => {
    if (!businesses || businesses.length === 0) {
      return {
        content: "Je suis désolée, je n'ai pas pu récupérer la liste des business actuellement disponibles. Veuillez réessayer ultérieurement ou contacter directement nos conseillers pour plus d'informations.",
        suggestions: ["Contacter un conseiller", "Voir nos formations", "Revenir plus tard"]
      };
    }
    
    let responseText = "Voici les business actuellement disponibles à la vente chez TEKKI Studio :\n\n";
    
    businesses.forEach((business, index) => {
      responseText += `${index + 1}. **${business.name}** - ${business.price.toLocaleString()} FCFA\n`;
      if (business.monthly_potential) {
        responseText += `   Potentiel mensuel: ${business.monthly_potential.toLocaleString()} FCFA\n`;
      }
      if (business.roi_estimation_months) {
        responseText += `   ROI estimé: ${business.roi_estimation_months} mois\n`;
      }
      responseText += "\n";
    });
    
    responseText += "Pour plus de détails sur un business spécifique, n'hésitez pas à me demander. Lequel vous intéresse le plus ?";
    
    // Générer des suggestions basées sur les business disponibles (limité à 6)
    const businessSuggestions = businesses
      .slice(0, 6)
      .map(b => `En savoir plus sur ${b.name}`);
      
    // Ajouter une option pour contacter un conseiller
    const allSuggestions = [...businessSuggestions];
    if (allSuggestions.length < 6) {
      allSuggestions.push("Contacter un conseiller");
    }
    
    return {
      content: responseText,
      suggestions: allSuggestions
    };
  };

  // Ajouter cette fonction pour générer une réponse spécifique à un business
const generateBusinessSpecificResponse = (businessName: string): { content: string; suggestions: string[] } => {
    // Trouver le business correspondant dans la liste des business
    const business = businesses.find(b => 
      b.name.toLowerCase() === businessName.toLowerCase() ||
      b.name.toLowerCase().includes(businessName.toLowerCase()) ||
      businessName.toLowerCase().includes(b.name.toLowerCase())
    );
    
    if (!business) {
      return {
        content: `Je ne trouve pas d'informations sur "${businessName}". Voulez-vous voir la liste de tous nos business disponibles ?`,
        suggestions: ["Voir tous les business", "Contacter un conseiller"]
      };
    }
    
    // Créer une réponse plus conversationnelle et orientée vente
    let content = `C'est un excellent choix ! Qu'aimeriez-vous savoir plus précisément sur cette opportunité ?`;
    
    // Générer des suggestions pertinentes et spécifiques à ce business
    const suggestions = [
      `Rentabilité de ${business.name}`,
      `Temps nécessaire pour gérer ${business.name}`,
      `Compétences requises pour développer ${business.name}`,
      `Avantages de ${business.name}`,
      `Coûts mensuels pour développer ${business.name}`
    ];
    
    // Limiter à 4 suggestions + "Contacter un conseiller"
    return {
      content: content,
      suggestions: [...suggestions.slice(0, 4), "Contacter un conseiller"]
    };
  };
  
  // Fonction pour traiter les questions spécifiques sur un aspect d'un business
  const handleBusinessSpecificQuery = (businessName: string, aspect: string): { content: string; suggestions: string[] } => {
    const business = businesses.find(b => 
      b.name.toLowerCase() === businessName.toLowerCase() ||
      b.name.toLowerCase().includes(businessName.toLowerCase()) ||
      businessName.toLowerCase().includes(b.name.toLowerCase())
    );
    
    if (!business) {
      return {
        content: `Je ne trouve pas d'informations sur "${businessName}". Voulez-vous voir la liste de tous nos business disponibles ?`,
        suggestions: ["Voir tous les business", "Contacter un conseiller"]
      };
    }
    
    let content = "";
    let suggestions = [];
    
    // Répondre en fonction de l'aspect demandé
    if (aspect.toLowerCase().includes('rentabilité')) {
      content = `Ce business offre une rentabilité exceptionnelle avec des marges brutes pouvant atteindre ${business.monthly_potential?.toLocaleString() || "plusieurs millions de"} FCFA par mois. 
      
  Avec un ROI estimé à ${business.roi_estimation_months || "quelques"} mois, c'est une véritable opportunité pour démarrer dans l'e-commerce de manière sûre.
  
  Notre accompagnement de 2 mois inclus vous aide à atteindre ce potentiel rapidement.`;
      
      suggestions = [`Comment démarrer ${business.name}`, `Combien coûte ${business.name}`];
    } 
    else if (aspect.toLowerCase().includes('temps')) {
      content = `Pour gérer efficacement ce business, nous recommandons d'y consacrer environ ${business.time_required_weekly || "10-15"} heures par semaine. 
      
  Notre accompagnement de 2 mois vous permettra d'optimiser votre temps et de mettre en place des processus efficaces pour maximiser votre rentabilité même avec un temps limité.`;
      
      suggestions = [`Est-ce possible à temps partiel`, `Compétences pour développer ${business.name}`];
    }
    else if (aspect.toLowerCase().includes('compétence')) {
      content = `Ce business a été conçu pour être accessible aux débutants. 
      
  Vous n'avez pas besoin de compétences techniques spécifiques pour réussir. Le savoir-faire s'acquiert par la pratique et avec du temps. Notre accompagnement de 2 mois vous guidera à chaque étape et vous inculquera toutes les compétences nécessaires pour réussir.
  
  Nous vous fournirons un support continu pour garantir votre succès.`;
      
      suggestions = [`Combien de temps pour être rentable`, `Avantages de ${business.name}`];
    }
    else if (aspect.toLowerCase().includes('avantage')) {
      content = `Ce business présente de nombreux avantages :
  
  - Faible investissement initial par rapport au potentiel de gains
  - Accompagnement personnalisé de 2 mois inclus
  - Modèle déjà validé sur le marché
  - Très faible risque d'échec
  - Possibilité de gestion à distance
  - Support technique continu
  - Business unique (vendu à une seule personne)`;
      
      suggestions = [`Comment fonctionne l'accompagnement`, `Rentabilité de ${business.name}`];
    }
    else if (aspect.toLowerCase().includes('coût') || aspect.toLowerCase().includes('mensuel')) {
      content = `Pour ce business, les coûts mensuels à prévoir sont d'environ ${
        business.type === 'physical' 
          ? '80 000 à 500 000 FCFA (achat de stock, marketing, frais du site)'
          : '50 000 à 300 000 FCFA (marketing et frais du site)'
      }.
      
  Ces coûts sont très rapidement amortis grâce au potentiel mensuel estimé à ${business.monthly_potential?.toLocaleString() || "plusieurs millions"} FCFA.`;
      
      suggestions = [`ROI de ${business.name}`, `Comment maximiser la rentabilité`];
    }
    else {
      // Réponse par défaut si l'aspect n'est pas reconnu
      content = `Ce business est une excellente opportunité avec un investissement initial de ${business.price?.toLocaleString() || "N/A"} FCFA.
      
  Son potentiel mensuel est estimé à ${business.monthly_potential?.toLocaleString() || "N/A"} FCFA, avec un retour sur investissement d'environ ${business.roi_estimation_months || "quelques"} mois.
  
  Quel aspect vous intéresse le plus ?`;
      
      suggestions = [`Rentabilité de ${business.name}`, `Temps nécessaire pour gérer ${business.name}`];
    }
    
    // Ajouter des suggestions pour continuer la conversation
    if (!suggestions.some(s => s.toLowerCase().includes('accompagnement'))) {
      suggestions.push(`Comment fonctionne l'accompagnement`);
    }
    suggestions.push("Contacter un conseiller");
    
    return {
      content: content,
      suggestions: suggestions.slice(0, 5)  // Limiter à 5 suggestions
    };
  };
  
  // Fonction pour détecter si un message concerne un aspect spécifique d'un business
  const detectBusinessAspectQuery = (message: string): { businessName: string; aspect: string } | null => {
    // Détecter les patterns comme "Rentabilité de [Business]" ou "Temps nécessaire pour [Business]"
    const aspectPatterns = [
      { regex: /rentabilité(?:\s+de\s+|\s+du\s+|\s+pour\s+|\s+)(.+)/i, aspect: 'rentabilité' },
      { regex: /temps(?:\s+nécessaire)?(?:\s+pour\s+|\s+du\s+|\s+de\s+)(.+)/i, aspect: 'temps' },
      { regex: /compétences?(?:\s+requises?)?(?:\s+pour\s+|\s+du\s+|\s+de\s+)(.+)/i, aspect: 'compétence' },
      { regex: /avantages?(?:\s+de\s+|\s+du\s+|\s+pour\s+)(.+)/i, aspect: 'avantage' },
      { regex: /coûts?(?:\s+mensuels?)?(?:\s+pour\s+|\s+du\s+|\s+de\s+)(.+)/i, aspect: 'coût' }
    ];
    
    for (const pattern of aspectPatterns) {
      const match = message.match(pattern.regex);
      if (match && match[1]) {
        return {
          businessName: match[1].trim(),
          aspect: pattern.aspect
        };
      }
    }
    
    return null;
  };
  
  // Fonction pour détecter si un message demande plus d'infos sur un business spécifique
  const detectBusinessInterestMessage = (message: string): string | null => {
    // Détecter les patterns comme "En savoir plus sur [Business]"
    const match = message.match(/en\s+savoir\s+plus\s+sur\s+(.+)/i);
    if (match && match[1]) {
      return match[1].trim();
    }
    
    return null;
  };

  // Fonction pour mettre à jour le funnel de conversion
  const updateConversionFunnel = (messageText: string, isUserMessage: boolean) => {
    setConversionFunnel(prev => {
      const newFunnel = { ...prev, lastActive: new Date() };
      
      // Extraire les sujets discutés
      const topics = extractTopics(messageText);
      if (topics.length > 0) {
        newFunnel.topicsDiscussed = [...new Set([...prev.topicsDiscussed, ...topics])];
      }
      
      // Détecter les objections (seulement dans les messages utilisateur)
      if (isUserMessage) {
        const objections = detectObjections(messageText);
        if (objections.length > 0) {
          newFunnel.objections = [...new Set([...prev.objections, ...objections])];
        }
      }
      
      // Extraire les business mentionnés
      const businessMentioned = extractBusinessName(messageText);
      if (businessMentioned && !prev.businessesViewed.includes(businessMentioned)) {
        newFunnel.businessesViewed = [...prev.businessesViewed, businessMentioned];
      }
      
      // Vérifier également le type de business
      const businessType = detectBusinessType(messageText);
      if (businessType && businessType !== "BUSINESS_LIST" && !prev.businessesViewed.includes(businessType)) {
        newFunnel.businessesViewed = [...prev.businessesViewed, businessType];
      }
      
      // Mise en correspondance avec des business spécifiques
      const matchedBusinesses = detectMultipleBusinessInterest(messageText);
      if (matchedBusinesses.length > 0) {
        const newBusinesses = matchedBusinesses
          .map(b => b.name)
          .filter(name => !prev.businessesViewed.includes(name));
        
        if (newBusinesses.length > 0) {
          newFunnel.businessesViewed = [...prev.businessesViewed, ...newBusinesses];
        }
      }
      
      // Mettre à jour l'étape du funnel
      newFunnel.stage = determineStage(messageText, prev.stage, isUserMessage);
      
      // Détecter si prêt à acheter
      if (isReadyToBuy(messageText) && isUserMessage) {
        newFunnel.readyToBuy = true;
      }
      
      return newFunnel;
    });
  };

  // Fonctions d'analyse pour le funnel de conversion
  const extractTopics = (message: string): string[] => {
    const topics = [];
    
    if (/prix|coût|tarif|budget|investir/i.test(message)) topics.push('prix');
    if (/temps|heures|disponible|gérer/i.test(message)) topics.push('temps');
    if (/accompagnement|support|aide|formation/i.test(message)) topics.push('accompagnement');
    if (/rentab|profit|revenue|gagner|mois/i.test(message)) topics.push('rentabilité');
    if (/experience|compétence|débutant|savoir/i.test(message)) topics.push('expérience');
    
    return topics;
  };

  const detectObjections = (message: string): string[] => {
    const objections = [];
    
    if (/cher|élevé|trop|budget/i.test(message)) objections.push('prix');
    if (/temps|occupé|chargé|disponible/i.test(message)) objections.push('temps');
    if (/difficile|compliqué|complexe/i.test(message)) objections.push('complexité');
    if (/risque|peur|inquiet|échec/i.test(message)) objections.push('risque');
    if (/expérience|compétence|savoir|capable/i.test(message)) objections.push('compétence');
    
    return objections;
  };

  const extractBusinessName = (message: string): string | null => {
    // Patterns pour détecter les noms de business courants
    const patterns = [
      /business\s+([a-z0-9&\s-]+)/i,
      /e-commerce\s+de\s+([a-z0-9&\s-]+)/i,
      /boutique\s+de\s+([a-z0-9&\s-]+)/i
    ];
    
    for (const pattern of patterns) {
      const match = message.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
    
    return null;
  };

  const determineStage = (
    message: string, 
    currentStage: 'awareness' | 'interest' | 'consideration' | 'decision',
    isUserMessage: boolean
  ): 'awareness' | 'interest' | 'consideration' | 'decision' => {
    if (!isUserMessage) return currentStage;
    
    // Progression vers étape décision
    if (/acheter|acquérir|procéder|achat|prêt|acquisition|comment faire/i.test(message)) {
      return 'decision';
    }
    
    // Progression vers étape considération
    if (/prix|coût|combien|frais|investissement|comparaison|différence/i.test(message)) {
      return currentStage === 'decision' ? 'decision' : 'consideration';
    }
    
    // Progression vers étape intérêt
    if (/plus d'info|détails|fonctionnement|comment ça marche|avantage|intéressé/i.test(message)) {
      return currentStage === 'decision' || currentStage === 'consideration' 
        ? currentStage 
        : 'interest';
    }
    
    return currentStage;
  };

  const isReadyToBuy = (message: string): boolean => {
    return /je veux acheter|je veux acquérir|je suis prêt|je souhaite acheter|comment procéder/i.test(message);
  };

  // Vérifier si le message concerne un business spécifique et utiliser le fallback
  const handleBusinessSpecificMessage = (messageText: string): { handled: boolean, content?: string, suggestions?: string[] } => {
    // Vérifier d'abord si l'utilisateur demande une liste des business
    if (isAskingForBusinessList(messageText)) {
      const response = generateBusinessListResponse();
      return {
        handled: true,
        content: response.content,
        suggestions: response.suggestions
      };
    }
    
    // Vérifier la correspondance avec plusieurs business
    const matchedBusinesses = detectMultipleBusinessInterest(messageText);
    if (matchedBusinesses.length > 1) {
      // Générer une réponse qui présente plusieurs business
      let content = "Voici les business qui pourraient vous intéresser :\n\n";
      
      matchedBusinesses.forEach((business, index) => {
        content += `**${business.name}** - ${business.price.toLocaleString()} FCFA\n`;
        if (business.monthly_potential) {
          content += `Potentiel mensuel: ${business.monthly_potential.toLocaleString()} FCFA\n`;
        }
        if (business.roi_estimation_months) {
          content += `ROI estimé: ${business.roi_estimation_months} mois\n`;
        }
        content += `\n`;
      });
      
      content += "Lequel de ces business vous intéresse le plus ? Je peux vous donner plus de détails sur celui de votre choix.";
      
      return {
        handled: true,
        content,
        suggestions: matchedBusinesses.map(b => `Parlez-moi du business ${b.name}`).slice(0, 3)
      };
    }
    
    // Vérifier ensuite pour un business spécifique
    const businessName = detectBusinessType(messageText);
    
    if (businessName && businessName !== "BUSINESS_LIST" && businessFallbacks[businessName]) {
      return {
        handled: true,
        content: generateBusinessResponse(businessName),
        suggestions: [
          "Combien ça coûte exactement ?",
          "Quelles sont les étapes pour lancer ?",
          "Contacter un conseiller"
        ]
      };
    }
    
    return { handled: false };
  };

  // Génération de réponse dynamique pour un business
  const generateBusinessResponse = (businessName: string): string => {
    const business = businessFallbacks[businessName];
    if (!business) return "";
    
    // Rechercher le business correspondant dans la liste des business chargés
    const matchedBusiness = businesses.find(b => b.name.toLowerCase() === businessName.toLowerCase());
    
    // Créer une réponse structurée à partir des données
    let response = business.description || "";
    
    if (matchedBusiness) {
      // Utiliser les données du business chargé si disponible
      response += `\n\nLe prix est de ${matchedBusiness.price.toLocaleString()} FCFA.`;
      
      if (matchedBusiness.monthly_potential) {
        response += `\nLe potentiel mensuel est estimé à ${matchedBusiness.monthly_potential.toLocaleString()} FCFA.`;
      }
      
      if (matchedBusiness.roi_estimation_months) {
        response += `\nLe retour sur investissement estimé est d'environ ${matchedBusiness.roi_estimation_months} mois.`;
      }
      
      // Ajouter la page du business
      if (matchedBusiness.slug) {
        response += `\n\nVous pouvez consulter tous les détails sur la page du business : [${matchedBusiness.name}](https://tekkistudio.com/business/${matchedBusiness.slug})`;
      }
    } else {
      // Utiliser les données du fallback
      if (business.price) {
        response += `\n\nLe prix est de ${business.price.toLocaleString()} FCFA.`;
      }
      
      if (business.roi) {
        response += ` ${business.roi}`;
      }
    }
    
    // Ajouter une phrase finale encourageant à l'action
    response += "\n\nCe business inclut un accompagnement de 2 mois pour vous aider à le lancer efficacement. Êtes-vous intéressé(e) par ce business ?";
    
    return response;
  };

  // Déterminer si nous devons afficher les suggestions pour un message
  const shouldShowSuggestions = (msg: Message): boolean => {
    // Premier message d'accueil
    if (msg.id === 1) return true;
    
    // Messages d'erreur techniques
    if (msg.content.includes("difficultés techniques") || msg.content.includes("momentanément indisponible")) return true;
    
    // Contact service client uniquement si explicitement demandé
    const needsContactOption = msg.content.toLowerCase().includes("besoin d'aide") || 
                              msg.content.toLowerCase().includes("assistance") ||
                              msg.content.toLowerCase().includes("parler à quelqu'un");
    
    if (needsContactOption && msg.suggestions && (msg.suggestions.includes("Contacter un conseiller") || msg.suggestions.includes("Contacter le service client"))) {
        // Ne conserver que les suggestions critiques
        msg.suggestions = msg.suggestions.filter(s =>
        s === "Contacter un conseiller" ||
        s === "Contacter le service client" ||
        s === "Ouvrir WhatsApp"
        );
        return true;
    }
    
    // Afficher les suggestions pour les réponses significatives avec des suggestions
    return msg.suggestions ? msg.suggestions.length > 0 : false;
  };

  // Version améliorée de scrollToBottom
  const scrollToBottom = (force = false) => {
    if (!messagesEndRef.current || (userScrolling && !force)) return;
    
    try {
      // Approche simplifiée - utiliser juste la méthode scrollTop standard
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        
        // Pour iOS, parfois un léger délai est nécessaire
        if (isIOSDevice) {
          setTimeout(() => {
            if (messagesContainerRef.current) {
              messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
            }
          }, 50);
        }
      }
    } catch (e) {
      console.warn('Erreur de scroll:', e);
    }
  };

  // Afficher la bulle après un délai
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBubble(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // Récupérer le contexte de la page actuelle
  const getCurrentPageContext = (): PageContext => {
    let pageName = "";
    
    if (pathname === '/') {
      pageName = "Accueil";
    } else if (pathname?.startsWith('/business')) {
      pageName = "Business";
    } else if (pathname?.startsWith('/formations')) {
      pageName = "Formations";
    } else if (pathname?.startsWith('/marques')) {
      pageName = "Marques";
    } else if (pathname?.startsWith('/a-propos')) {
      pageName = "À propos";
    } else if (pathname?.startsWith('/services/sites-ecommerce')) {
      pageName = "Services";
    } else {
      pageName = pathname?.replace('/', '').charAt(0).toUpperCase() + 
                pathname?.slice(1).replace('/', ' ') || "Page inconnue";
    }
    
    return {
      page: pageName,
      url: pathname || "/"
    };
  };

  // Fonction pour vérifier si un message déclenche une réponse humaine
  const requiresHumanAssistance = (messageText: string): boolean => {
    if (!config || !config.human_trigger_phrases || config.human_trigger_phrases.length === 0) {
      return false;
    }
    
    const lowerCaseMessage = messageText.toLowerCase();
    return config.human_trigger_phrases.some(phrase => 
      lowerCaseMessage.includes(phrase.toLowerCase())
    );
  };

  // Fonction pour traiter la réponse de l'IA
  const processAIResponse = async (userQuery: string, context: PageContext): Promise<{
    content: string;
    suggestions: string[];
    needs_human: boolean;
  }> => {
    // Vérifier d'abord si l'utilisateur demande une liste des business
    if (isAskingForBusinessList(userQuery)) {
      const response = generateBusinessListResponse();
      return {
        content: response.content,
        suggestions: response.suggestions,
        needs_human: false
      };
    }
    
    // 2. Vérifier si le message concerne un business spécifique
    const businessResponse = handleBusinessSpecificMessage(userQuery);
    if (businessResponse.handled) {
      return {
        content: businessResponse.content!,
        suggestions: businessResponse.suggestions!,
        needs_human: false
      };
    }
    
    // 3. Vérifier si le message contient des déclencheurs d'assistance humaine
    const needsHuman = requiresHumanAssistance(userQuery);
    
    if (needsHuman) {
      return {
        content: "Je comprends que votre demande nécessite une attention particulière. Préférez-vous échanger directement avec un membre de notre équipe pour une assistance plus personnalisée ?",
        suggestions: ["Contacter un conseiller", "Non merci, continuer"],
        needs_human: true
      };
    }
    
    try {
      // Appel à l'API pour obtenir une réponse de l'IA
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userQuery,
          context: context,
          history: messages.slice(-5).map(msg => ({
            role: msg.type === 'user' ? 'user' : 'assistant',
            content: msg.content
          })),
          sessionId: sessionId,
          conversionState: conversionFunnel
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la communication avec l\'API');
      }

      const data = await response.json();
      
      // Remplacer "Contacter le service client" par "Contacter un conseiller" dans les suggestions
      const suggestions = data.suggestions?.map((suggestion: string) => 
        suggestion === "Contacter le service client" ? "Contacter un conseiller" : suggestion
      ) || [];
      
      return {
        content: data.content,
        suggestions: suggestions,
        needs_human: data.needs_human || false
      };
    } catch (error) {
      console.error('Erreur:', error);
      
      // Si nous avons des business chargés localement, utilisez-les pour répondre
      if (isAskingForBusinessList(userQuery) && businesses.length > 0) {
        const response = generateBusinessListResponse();
        return {
          content: response.content,
          suggestions: response.suggestions,
          needs_human: false
        };
      }
      
      // Réponse de secours en cas d'erreur
      return {
        content: "Je n'ai présentement pas la réponse adéquate à votre message. Puis-je vous proposer d'échanger directement avec un membre de l'équipe TEKKI Studio qui pourra répondre à toutes vos questions ?",
        suggestions: ["Contacter un conseiller", "Réessayer plus tard"],
        needs_human: true
      };
    }
  };

  // Ouvrir WhatsApp
  const openWhatsApp = () => {
    // Numéro WhatsApp au format international
    window.open('https://wa.me/221781362728?text=Bonjour%20TEKKI%20Studio,%20j%27ai%20une%20question%20spécifique%20à%20vous%20poser.%20Puis-je%20parler%20à%20un%20une%20vraie%20personne?', '_blank');
  };

  // Envoyer un message
  const sendMessage = async (messageContent: string) => {
    if (!messageContent.trim()) return;
  
    const context = getCurrentPageContext();
    
    // Créer le message utilisateur
    const userMessage: Message = {
      id: Date.now(),
      content: messageContent,
      type: 'user',
      timestamp: new Date(),
      context: context
    };
  
    try {
      // Mettre à jour le funnel avec le message utilisateur
      updateConversionFunnel(messageContent, true);
      
      setMessages(prev => [...prev, userMessage]);
      setMessage('');
      setIsTyping(true);
      
      // Réinitialiser l'état de défilement utilisateur pour permettre un défilement automatique
      setUserScrolling(false);
  
      // Cas 1: Demande de contact direct
      if (messageContent.toLowerCase().includes('contacter un conseiller') || 
          messageContent.toLowerCase().includes('contacter le service client') ||
          messageContent.toLowerCase().includes('parler à un conseiller')) {
        setTimeout(() => {
          const contactMessage: Message = {
            id: Date.now() + 1,
            content: "Vous pouvez contacter notre équipe directement sur WhatsApp. Un conseiller vous répondra dans les plus brefs délais.",
            type: 'assistant',
            timestamp: new Date(),
            suggestions: ["Ouvrir WhatsApp", "Revenir aux questions"]
          };
          
          setMessages(prev => [...prev, contactMessage]);
          setIsTyping(false);
        }, 1000);
        return;
      }
      
      // Cas 2: Demande d'en savoir plus sur un business spécifique
      const businessInterest = detectBusinessInterestMessage(messageContent);
      if (businessInterest) {
        setTimeout(() => {
          const response = generateBusinessSpecificResponse(businessInterest);
          const businessMessage: Message = {
            id: Date.now() + 1,
            content: response.content,
            type: 'assistant',
            timestamp: new Date(),
            suggestions: response.suggestions
          };
          
          setMessages(prev => [...prev, businessMessage]);
          setIsTyping(false);
        }, 1000);
        return;
      }
      
      // Cas 3: Question sur un aspect spécifique d'un business
      const aspectQuery = detectBusinessAspectQuery(messageContent);
      if (aspectQuery) {
        setTimeout(() => {
          const response = handleBusinessSpecificQuery(
            aspectQuery.businessName, 
            aspectQuery.aspect
          );
          
          const aspectMessage: Message = {
            id: Date.now() + 1,
            content: response.content,
            type: 'assistant',
            timestamp: new Date(),
            suggestions: response.suggestions
          };
          
          setMessages(prev => [...prev, aspectMessage]);
          setIsTyping(false);
        }, 1000);
        return;
      }
  
      // Pour les autres cas, utiliser l'API comme avant
      const aiResponse = await processAIResponse(messageContent, context);
  
      // Créer le message de l'assistant
      const assistantMessage: Message = {
        id: Date.now() + 1,
        content: aiResponse.content,
        type: 'assistant',
        timestamp: new Date(),
        context: context,
        suggestions: aiResponse.suggestions
      };
  
      setMessages(prev => [...prev, assistantMessage]);
      
      // Mettre à jour le funnel avec la réponse du chatbot
      updateConversionFunnel(assistantMessage.content, false);
  
      // Si la réponse indique qu'un humain est nécessaire
      if (aiResponse.needs_human && !aiResponse.suggestions.includes("Contacter un conseiller") && !aiResponse.suggestions.includes("Contacter le service client")) {
        setTimeout(() => {
          const humanSuggestionMessage: Message = {
            id: Date.now() + 2,
            content: "Souhaitez-vous échanger directement avec un conseiller pour plus de précisions sur ce sujet ?",
            type: 'assistant',
            timestamp: new Date(),
            suggestions: ["Contacter un conseiller", "Non merci, continuer"]
          };
          
          setMessages(prev => [...prev, humanSuggestionMessage]);
        }, 1500);
      }
  
      // Sauvegarde dans Supabase
      try {
        await supabase
          .from('chat_conversations')
          .insert([{
            user_message: messageContent,
            assistant_response: aiResponse.content,
            page: context.page,
            url: context.url,
            needs_human: aiResponse.needs_human,
            session_id: sessionId,
            funnel_stage: conversionFunnel.stage,
            created_at: new Date().toISOString()
          }]);
      } catch (supabaseError) {
        // Ignorer silencieusement les erreurs de sauvegarde
        console.warn('Message non sauvegardé:', supabaseError);
      }
    } catch (error) {
      console.error('Error processing message:', error);
      
      const errorMessage: Message = {
        id: Date.now() + 1,
        content: "Je suis momentanément indisponible. Puis-je vous proposer d'échanger directement avec un conseiller qui pourra répondre à toutes vos questions ?",
        type: 'assistant',
        timestamp: new Date(),
        suggestions: ["Contacter un conseiller", "Réessayer plus tard"]
      };
  
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
      setTimeout(() => scrollToBottom(true), 100);
    }
  };

  // Nouvelle fonction pour détecter un intérêt spécifique pour un business
function detectSpecificBusinessInterest(message: string): string | null {
    // Si le message commence par "En savoir plus sur" suivi d'un nom de business
    const interestMatch = message.match(/^En savoir plus sur (.+)$/i);
    if (interestMatch && interestMatch[1]) {
      return interestMatch[1].trim();
    }
    
    return null;
  }

  // Fonction pour gérer les clics sur les suggestions
  const handleSuggestionClick = (suggestion: string) => {
    if (suggestion === "Ouvrir WhatsApp" || suggestion === "Contacter un conseiller" || suggestion === "Contacter le service client") {
      openWhatsApp();
      return;
    }
    
    if (suggestion === "Retour à l'accueil") {
      window.location.href = "/";
      return;
    }
    
    if (suggestion === "Voir nos business") {
      window.location.href = "/business";
      return;
    }
    
    if (suggestion === "Non merci, continuer" || suggestion === "Réessayer plus tard") {
      return;
    }
    
    // Pour les autres suggestions, envoyer comme message
    sendMessage(suggestion);
  };

  // Envoyer le message
  const handleSendMessage = async () => {
    if (message.trim()) {
      await sendMessage(message);
    }
  };

  // Afficher un chargement pendant que la configuration se charge
  if (isConfigLoading) {
    return null; // On ne montre rien pendant le chargement initial
  }

  // Fonction pour obtenir les termes associés à une catégorie de business
  const getCategoryTermsForBusiness = (businessName: string): string[] => {
    // Implémentation simplifiée - à enrichir selon vos catégories
    if (businessName.toLowerCase().includes('livre')) {
      return ['lecture', 'education', 'enfant', 'jeunesse'];
    }
    if (businessName.toLowerCase().includes('meuble')) {
      return ['décoration', 'ameublement', 'mobilier', 'chambre'];
    }
    if (businessName.toLowerCase().includes('sécurité')) {
      return ['protection', 'surveillance', 'camera', 'alarme'];
    }
    // Par défaut retourner un tableau vide
    return [];
  };

  // Fonction pour obtenir les termes connexes à un business
  const getRelatedTermsForBusiness = (businessName: string): string[] => {
    // Implémentation simplifiée - à enrichir selon vos business
    if (businessName.toLowerCase().includes('livre')) {
      return ['histoire', 'conte', 'personnalisé', 'lecture'];
    }
    if (businessName.toLowerCase().includes('meuble')) {
      return ['décoration', 'accessoire', 'design', 'enfant'];
    }
    if (businessName.toLowerCase().includes('sécurité')) {
      return ['protection', 'caméra', 'alarme', 'maison', 'entreprise'];
    }
    // Par défaut retourner un tableau vide
    return [];
  };

  // Composant rendu
  return (
    <>
      {/* Bouton flottant avec bulle de message */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          {/* Bulle de message */}
          {showBubble && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-20 right-0 min-w-[250px] bg-[#F2F2F2] dark:bg-[#104C81] rounded-xl shadow-lg p-4"
            >
              <button 
                onClick={() => setShowBubble(false)}
                className="absolute -top-2 -right-2 bg-white dark:bg-[#093861] rounded-full p-1 shadow-md text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400"
                aria-label="Fermer"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="bg-[#FF7F50] rounded-full">
                  <Image 
                    src="/images/logos/fav_tekki.svg" 
                    alt="TEKKI Studio" 
                    width={40} 
                    height={40}
                  />
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                  Besoin d'aide ? Je suis là !
                </p>
              </div>
            </motion.div>
          )}

          {/* Bouton */}
          <button
            onClick={() => {
              setIsOpen(true);
              setShowBubble(false);
            }}
            className="bg-[#FF7F50] text-white rounded-full shadow-lg hover:bg-[#FF7F50]/90 transition-all w-16 h-16 flex items-center justify-center"
            aria-label="Ouvrir le chat"
          >
            <Image 
              src="/images/logos/fav_tekki.svg" 
              alt="TEKKI Studio" 
              width={40} 
              height={40}
            />
          </button>
        </div>
      )}

      {/* Interface de chat */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Version Mobile (plein écran) */}
            {isMobileDevice && (
              <motion.div
              ref={chatContainerRef}
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              className="fixed inset-0 z-[9999] flex flex-col bg-[#F2F2F2] dark:bg-gray-800 tekki-chatbot-mobile"
              style={{
                width: '100vw',
                maxWidth: '100%',
                overflow: 'hidden',
                // Ajouter cette ligne pour tenir compte de la zone sécurisée sur iOS
                paddingBottom: 'env(safe-area-inset-bottom, 80px)',
              }}
            >
                {/* Header - reste fixe, ne change pas de taille */}
                <div className="p-4 bg-[#0f4c81] text-white sticky top-0 z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-[#FF7F50] rounded-full p-1">
                        <Image 
                          src="/images/logos/fav_tekki.svg" 
                          alt="TEKKI Studio" 
                          width={30} 
                          height={30}
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold">Sara de TEKKI Studio</h3>
                        <p className="text-sm text-white/80">
                          Assistante Commerciale
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* Bouton WhatsApp */}
                      <button
                        onClick={openWhatsApp}
                        className="flex items-center justify-center w-8 h-8 bg-[#25D366] hover:bg-[#20ba5a] rounded-full transition-colors"
                        aria-label="Contacter sur WhatsApp"
                        title="Parler à un conseiller"
                      >
                        <WhatsAppIcon size={16} className="text-white" />
                      </button>
                      
                      {/* Bouton de fermeture */}
                      <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                        aria-label="Fermer"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Messages - Utilise flex-1 avec overflow-auto pour permettre le défilement */}
                <div 
                  ref={messagesContainerRef}
                  className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar tekki-chatbot-messages"
                  style={{ 
                    height: keyboardOpen ? 'calc(100vh - 220px)' : 'calc(100vh - 160px)',
                    width: '100%',
                    overflow: 'auto',
                    paddingBottom: '120px',
                    maxWidth: '100vw',
                  }}
                >
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex gap-3 ${
                        msg.type === 'user' ? "justify-end" : ""
                      }`}
                    >
                      {msg.type === 'assistant' && (
                        <div className="w-8 h-8 rounded-full bg-[#FF7F50] flex items-center justify-center flex-shrink-0">
                          <Image 
                            src="/images/logos/fav_tekki.svg" 
                            alt="TEKKI Studio" 
                            width={20} 
                            height={20}
                          />
                        </div>
                      )}
                      
                      <div className={`max-w-[80%] space-y-3 ${
                        msg.type === 'assistant' 
                          ? "text-gray-800 dark:text-gray-200" 
                          : "text-white"
                      }`}>
                        {/* Message principal */}
                        <div className={`rounded-2xl p-3 ${
                          msg.type === 'assistant' 
                            ? "bg-gray-100 dark:bg-gray-700" 
                            : "bg-[#0f4c81]"
                        }`}>
                          <div className="text-sm">
                            {msg.type === 'assistant' 
                              ? formatMessageText(msg.content)
                              : msg.content
                            }
                          </div>
                          <p className="text-[10px] mt-1 text-gray-500 dark:text-gray-400">
                            {msg.timestamp.toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </p>
                        </div>

                        {/* Suggestions cliquables */}
                        {msg.type === 'assistant' && msg.suggestions && msg.suggestions.length > 0 && shouldShowSuggestions(msg) && (
                          <div className="flex flex-wrap gap-2">
                            {msg.suggestions.map((suggestion, index) => (
                              <button
                                key={index}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="px-3 py-2.5 text-sm bg-[#F2F2F2] dark:bg-gray-600 
                                         rounded-full border border-gray-200 dark:border-gray-500
                                         hover:bg-gray-50 dark:hover:bg-gray-500
                                         transition-colors text-gray-700 dark:text-gray-200
                                         min-h-[40px] min-w-[100px] font-medium"
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-500 animate-pulse"></div>
                        <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-500 animate-pulse delay-75"></div>
                        <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-500 animate-pulse delay-150"></div>
                      </div>
                      <span className="text-sm">Sara écrit...</span>
                    </div>
                  )}
                  <div ref={messagesEndRef} className="h-1 min-h-[1px] w-full" />
                </div>

                {/* Bouton "Retour en bas" */}
                {userScrolling && (
                  <button
                    onClick={() => {
                      setUserScrolling(false);
                      scrollToBottom(true);
                    }}
                    className="fixed bottom-20 right-4 bg-[#0f4c81] text-white rounded-full p-2 shadow-lg z-30"
                  >
                    <ArrowDown className="h-5 w-5" />
                  </button>
                )}

                {/* Input - sticky at bottom with width constraints */}
                <div 
                    className="p-4 bg-white dark:bg-gray-800 border-t dark:border-gray-700 sticky bottom-0 left-0 right-0 z-30 input-container"
                    style={{
                    width: '100%',
                    maxWidth: '100vw',
                    boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.05)',
                    paddingBottom: 'calc(env(safe-area-inset-bottom, 16px) + 16px)', 
                    marginBottom: 0,
                    }}
                >
                  <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 rounded-full p-2 pl-4 border dark:border-gray-600">
                    <input
                      ref={messageInputRef}
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      placeholder="Posez votre question..."
                      className="flex-1 bg-transparent text-sm text-gray-600 dark:text-gray-300 focus:outline-none border-none"
                      style={{
                        width: '100%',
                        minWidth: 0,
                      }}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!message.trim() || isTyping}
                      className={`rounded-full p-2 flex-shrink-0 ${
                        message.trim() && !isTyping
                          ? "bg-[#0f4c81] text-white hover:bg-[#0f4c81]/90"
                          : "bg-gray-100 dark:bg-gray-600 text-gray-400 dark:text-gray-500"
                      }`}
                      aria-label="Envoyer"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="text-center mt-2">
                    <p className="text-[12px] text-gray-400 dark:text-gray-500">
                      Chatbot IA créé par{" "}
                      <a
                        href="https://getdukka.com"
                        target="_blank"
                        rel="noopener noreferrer" 
                        className="font-bold text-[#066AC3] hover:underline"
                      >
                        Dukka
                      </a> 
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Version Desktop (fenêtre flottante) */}
            {!isMobileDevice && (
              <motion.div
                ref={chatContainerRef}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="fixed bottom-6 right-6 w-[350px] md:w-[400px] h-[600px] z-[9999] flex flex-col bg-[#F2F2F2] dark:bg-gray-800 rounded-2xl shadow-xl border dark:border-gray-700"
              >
                {/* Header */}
                <div className="p-4 bg-[#0f4c81] text-white rounded-t-2xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-[#FF7F50] rounded-full p-1">
                        <Image 
                          src="/images/logos/fav_tekki.svg" 
                          alt="TEKKI Studio" 
                          width={30} 
                          height={30}
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold">Sara de TEKKI Studio</h3>
                        <p className="text-sm text-white/80">
                          Assistante Commerciale
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* Bouton WhatsApp */}
                      <button
                        onClick={openWhatsApp}
                        className="flex items-center justify-center w-8 h-8 bg-[#25D366] hover:bg-[#20ba5a] rounded-full transition-colors"
                        aria-label="Contacter sur WhatsApp"
                        title="Parler à un conseiller"
                      >
                        <WhatsAppIcon size={16} className="text-white" />
                      </button>
                      
                      {/* Bouton de fermeture */}
                      <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                        aria-label="Fermer"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Messages - flexible height */}
                <div 
                  ref={messagesContainerRef}
                  className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar"
                >
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex gap-3 ${
                        msg.type === 'user' ? "justify-end" : ""
                      }`}
                    >
                      {msg.type === 'assistant' && (
                        <div className="w-8 h-8 rounded-full bg-[#FF7F50] flex items-center justify-center flex-shrink-0">
                          <Image 
                            src="/images/logos/fav_tekki.svg" 
                            alt="TEKKI Studio" 
                            width={20} 
                            height={20}
                          />
                        </div>
                      )}
                      
                      <div className={`max-w-[80%] space-y-3 ${
                        msg.type === 'assistant' 
                          ? "text-gray-800 dark:text-gray-200" 
                          : "text-white"
                      }`}>
                        {/* Message principal */}
                        <div className={`rounded-2xl p-3 ${
                          msg.type === 'assistant' 
                            ? "bg-gray-100 dark:bg-gray-700" 
                            : "bg-[#0f4c81]"
                        }`}>
                          <div className="text-sm">
                            {msg.type === 'assistant' 
                              ? formatMessageText(msg.content)
                              : msg.content
                            }
                          </div>
                          <p className="text-[10px] mt-1 text-gray-500 dark:text-gray-400">
                            {msg.timestamp.toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </p>
                        </div>

                        {/* Suggestions cliquables */}
                        {msg.type === 'assistant' && msg.suggestions && msg.suggestions.length > 0 && shouldShowSuggestions(msg) && (
                          <div className="flex flex-wrap gap-2">
                            {msg.suggestions.map((suggestion, index) => (
                              <button
                                key={index}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="px-3 py-2 text-xs bg-[#F2F2F2] dark:bg-gray-600 
                                         rounded-full border border-gray-200 dark:border-gray-500
                                         hover:bg-gray-50 dark:hover:bg-gray-500
                                         transition-colors text-gray-700 dark:text-gray-200
                                         min-h-[34px] min-w-[80px] font-medium"
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-500 animate-pulse"></div>
                        <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-500 animate-pulse delay-75"></div>
                        <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-500 animate-pulse delay-150"></div>
                      </div>
                      <span className="text-sm">Sara écrit...</span>
                    </div>
                  )}
                  <div ref={messagesEndRef} className="h-1 min-h-[1px] w-full" />
                </div>

                {/* Input */}
                <div className="p-4 bg-white dark:bg-gray-800 border-t dark:border-gray-700 rounded-b-2xl">
                  <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 rounded-full p-2 pl-4 border dark:border-gray-600">
                    <input
                      ref={messageInputRef}
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      placeholder="Posez votre question..."
                      className="flex-1 bg-transparent text-sm text-gray-600 dark:text-gray-300 focus:outline-none border-none"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!message.trim() || isTyping}
                      className={`rounded-full p-2 ${
                        message.trim() && !isTyping
                          ? "bg-[#0f4c81] text-white hover:bg-[#0f4c81]/90"
                          : "bg-gray-100 dark:bg-gray-600 text-gray-400 dark:text-gray-500"
                      }`}
                      aria-label="Envoyer"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="text-center mt-2">
                    <p className="text-[12px] text-gray-400 dark:text-gray-500">
                      Chatbot IA créé par{" "}
                      <a
                        href="https://getdukka.com"
                        target="_blank"
                        rel="noopener noreferrer" 
                        className="font-bold text-[#066AC3] hover:underline"
                      >
                        Dukka
                      </a> 
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </>
        )}
      </AnimatePresence>
    </>
  );
}