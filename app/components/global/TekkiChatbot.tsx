// app/components/global/TekkiChatbot.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Loader2, MessageSquare, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import WhatsAppIcon from '../ui/WhatsAppIcon';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

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
  created_at: string;
  updated_at: string;
}

// Suivi du funnel de conversion
interface ConversionFunnel {
  stage: 'awareness' | 'interest' | 'consideration' | 'decision';
  lastActive: Date;
  businessesViewed: string[];
  topicsDiscussed: string[];
  objections: string[];
  readyToBuy: boolean;
}

// Suggestions critiques à toujours afficher
const criticalSuggestions = [
  "Contacter le service client",
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

// Message de bienvenue par défaut au cas où la configuration n'est pas chargée
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

// Détection d'appareil mobile
const isMobile = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth <= 768 || 
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
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
  const [sessionId] = useState(() => uuidv4()); // ID unique pour la session
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
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

  // Détection du mobile
  useEffect(() => {
    setIsMobileDevice(isMobile());
    const handleResize = () => setIsMobileDevice(isMobile());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  // Fonction pour mettre à jour le funnel de conversion
  const updateConversionFunnel = (message: string, isUserMessage: boolean) => {
    setConversionFunnel(prev => {
      const newFunnel = { ...prev, lastActive: new Date() };
      
      // Extraire les sujets discutés
      const topics = extractTopics(message);
      if (topics.length > 0) {
        newFunnel.topicsDiscussed = [...new Set([...prev.topicsDiscussed, ...topics])];
      }
      
      // Détecter les objections (seulement dans les messages utilisateur)
      if (isUserMessage) {
        const objections = detectObjections(message);
        if (objections.length > 0) {
          newFunnel.objections = [...new Set([...prev.objections, ...objections])];
        }
      }
      
      // Extraire les business mentionnés
      const businessMentioned = extractBusinessName(message);
      if (businessMentioned && !prev.businessesViewed.includes(businessMentioned)) {
        newFunnel.businessesViewed = [...prev.businessesViewed, businessMentioned];
      }
      
      // Mettre à jour l'étape du funnel
      newFunnel.stage = determineStage(message, prev.stage, isUserMessage);
      
      // Détecter si prêt à acheter
      if (isReadyToBuy(message) && isUserMessage) {
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

  // Fonction pour rendre les liens cliquables dans les messages de l'IA
  const parseMessageWithLinks = (text: string) => {
    // Regex pour identifier les liens Markdown de la forme [texte](url)
    const markdownLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;

    // Si aucun lien Markdown n'est trouvé, retourner le texte tel quel
    if (!markdownLinkRegex.test(text)) {
      return text;
    }

    // Diviser le texte en segments (texte normal et liens)
    const segments = [];
    let lastIndex = 0;
    let match;

    // Réinitialiser le regex pour une nouvelle recherche
    markdownLinkRegex.lastIndex = 0;

    while ((match = markdownLinkRegex.exec(text)) !== null) {
      // Ajouter le texte avant le lien
      if (match.index > lastIndex) {
        segments.push(text.substring(lastIndex, match.index));
      }

      // Ajouter le lien en tant qu'élément cliquable
      segments.push(
        <a 
          key={match.index} 
          href={match[2]} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-[#FF7F50] hover:underline"
        >
          {match[1]}
        </a>
      );

      lastIndex = match.index + match[0].length;
    }

    // Ajouter le reste du texte après le dernier lien
    if (lastIndex < text.length) {
      segments.push(text.substring(lastIndex));
    }

    return <>{segments}</>;
  };

  // Déterminer si nous devons afficher les suggestions pour un message
  const shouldShowSuggestions = (msg: Message): boolean => {
    // Premier message d'accueil
    if (msg.id === 1) return true;
    
    // Contact service client uniquement si explicitement demandé
    const needsContactOption = msg.content.toLowerCase().includes("besoin d'aide") || 
                              msg.content.toLowerCase().includes("assistance") ||
                              msg.content.toLowerCase().includes("parler à quelqu'un");
    
    if (needsContactOption && msg.suggestions?.includes("Contacter le service client")) {
      // Ne conserver que les suggestions critiques
      msg.suggestions = msg.suggestions.filter(s => 
        s === "Contacter le service client" || 
        s === "Ouvrir WhatsApp"
      );
      return true;
    }
    
    // Pas de suggestions pour les autres messages
    return false;
  };

  // Faire défiler jusqu'au dernier message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
    // Vérifier d'abord si le message contient des déclencheurs d'assistance humaine
    const needsHuman = requiresHumanAssistance(userQuery);
    
    if (needsHuman) {
      return {
        content: "Je détecte que vous avez besoin d'une assistance plus personnalisée. Souhaitez-vous être mis en relation avec un membre de notre équipe ?",
        suggestions: ["Contacter le service client", "Non merci, continuer"],
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
      return {
        content: data.content,
        suggestions: data.suggestions || [],
        needs_human: data.needs_human || false
      };
    } catch (error) {
      console.error('Erreur:', error);
      // Réponse de secours en cas d'erreur
      return {
        content: "Je suis désolé, je rencontre des difficultés techniques. Pourriez-vous reformuler votre question ou contacter directement notre équipe sur WhatsApp ?",
        suggestions: ["Contacter le service client", "Retour à l'accueil", "Voir nos business"],
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
  
      // Si c'est une demande de contact direct
      if (messageContent.toLowerCase().includes('contacter le service client') || 
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
  
      // Traiter la réponse de l'IA
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
      if (aiResponse.needs_human && !aiResponse.suggestions.includes("Contacter le service client")) {
        setTimeout(() => {
          const humanSuggestionMessage: Message = {
            id: Date.now() + 2,
            content: "Souhaitez-vous être mis en relation avec notre équipe pour une réponse plus précise?",
            type: 'assistant',
            timestamp: new Date(),
            suggestions: ["Contacter le service client", "Non merci, continuer"]
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
        content: "Je suis désolé, je rencontre des difficultés techniques. Pourriez-vous reformuler votre question ou contacter notre équipe directement ?",
        type: 'assistant',
        timestamp: new Date(),
        suggestions: ["Contacter le service client", "Réessayer"]
      };
  
      setMessages(prev => [...prev, errorMessage]);
      
      toast("Quelque chose s'est mal passé. Réessayez ou contactez-nous directement.", {
        description: "Oups !",
      });
    } finally {
      setIsTyping(false);
    }
  };

  // Fonction pour gérer les clics sur les suggestions
  const handleSuggestionClick = (suggestion: string) => {
    if (suggestion === "Ouvrir WhatsApp") {
      openWhatsApp();
      return;
    }
    
    if (suggestion === "Contacter le service client") {
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
    
    if (suggestion === "Non merci, continuer") {
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
          <motion.div
            initial={{ opacity: 0, y: isMobileDevice ? '100%' : 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: isMobileDevice ? '100%' : 20 }}
            className={`fixed ${
              isMobileDevice 
                ? 'inset-0 z-50' 
                : 'bottom-6 right-6 w-[350px] md:w-[400px] h-[600px]'
            } bg-[#F2F2F2] dark:bg-gray-800 rounded-2xl shadow-xl flex flex-col overflow-hidden border dark:border-gray-700 z-50`}
          >
            {/* Header */}
            <div className="p-4 bg-[#0f4c81] text-white">
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
                {/* Bouton WhatsApp avec logo officiel */}
                <button
                    onClick={openWhatsApp}
                    className="flex items-center justify-center w-8 h-8 bg-[#25D366] hover:bg-[#20ba5a] rounded-full transition-colors"
                    aria-label="Contacter sur WhatsApp"
                    title="Parler à un conseiller"
                >
                    <WhatsAppIcon size={16} className="text-white" />
                </button>
                {isMobileDevice ? (
                  <div className="h-1 w-6 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto"></div>
                ) : (
                  <button
                      onClick={() => setIsOpen(false)}
                      className="p-2 hover:bg-white/10 rounded-full transition-colors"
                      aria-label="Fermer"
                  >
                      <X className="w-5 h-5" />
                  </button>
                )}
                </div>
            </div>
            </div>
            
            {/* Indicateur de glissement pour fermer sur mobile */}
            {isMobileDevice && (
              <div 
                className="w-full flex justify-center py-1 cursor-pointer" 
                onClick={() => setIsOpen(false)}
              >
                <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
                      <div className="text-sm whitespace-pre-wrap">
                        {msg.type === 'assistant' 
                          ? parseMessageWithLinks(msg.content)
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

                    {/* Suggestions cliquables - uniquement pour le message d'accueil ou suggestions spéciales */}
                    {msg.type === 'assistant' && msg.suggestions && msg.suggestions.length > 0 && shouldShowSuggestions(msg) && (
                      <div className="flex flex-wrap gap-2">
                        {msg.suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="px-3 py-1.5 text-xs bg-[#F2F2F2] dark:bg-gray-600 
                                     rounded-full border border-gray-200 dark:border-gray-500
                                     hover:bg-gray-50 dark:hover:bg-gray-500
                                     transition-colors text-gray-700 dark:text-gray-200"
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
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className={`p-4 bg-white dark:bg-gray-800 border-t dark:border-gray-700 ${isMobileDevice ? 'pb-safe-area-bottom' : ''}`}>
              <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 rounded-full p-2 pl-4 border dark:border-gray-600">
                <input
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
      </AnimatePresence>
    </>
  );
}