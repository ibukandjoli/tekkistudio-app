// app/components/global/TekkiChatbot/index.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { supabase } from '../../../lib/supabase';

// Composants
import ChatContainer from './ChatContainer';
import ChatBubble from './ChatBubble';
import { useChatState } from './hooks/useChatState';
import { useDeviceDetection } from './hooks/useDeviceDetection';
import { useScrollBehavior } from './hooks/useScrollBehavior';
import { useConversionFunnel } from './hooks/useConversionFunnel';
import InterestModal from '../../business/InterestModal';
import { formatPrice } from '@/app/lib/utils/price-utils';

// Types
import { Message, Business, PageContext } from './types';

// Services
import { BusinessService } from './services/BusinessService';
import { ChatService } from './services/ChatService';
import { ConversationAnalyzer } from './services/ConversationAnalyzer';

// Type pour l'analyse d'intention de message
interface MessageIntent {
  isContactRequest: boolean;
  isExactBusinessName: boolean;
  isGeneralBusinessInterest: boolean;
  isBusinessListRequest: boolean;
  isSpecificBusinessInterest: boolean;
  specificBusinessName?: string;
  isBusinessAspectQuery: boolean;
  businessAspect?: {
    businessName: string;
    aspect: string;
  };
}

// Type pour une réponse du service
interface ServiceResponse {
  content: string;
  suggestions: string[];
}

// Type pour la réponse de l'API IA
interface AIResponse {
  content: string;
  suggestions: string[];
  needs_human: boolean;
}

// Type pour les questions communes
interface CommonQuestion {
  answer: string;
  category: string;
  customSuggestions?: string[];
}

// Type pour la mise à jour du funnel de conversion
type FunnelUpdate = string | {
  businessesViewed?: string[];
  stage?: string;
}

/**
 * Fonction garde de type pour vérifier si une valeur est une chaîne de caractères
 */
function isString(value: unknown): value is string {
  return typeof value === 'string';
}

/**
 * Filtre les suggestions pour éviter les répétitions et incohérences
 */
const getFilteredSuggestions = (suggestions: string[], context: string, lastUserMessage?: string): string[] => {
    // Notez le "?" qui indique que lastUserMessage est optionnel (string | undefined)
    if (!suggestions || !Array.isArray(suggestions)) return [];
    
    // Filtrer les suggestions en fonction du contexte
    let filtered = [...suggestions];
    
    // Utilisation de l'opérateur de chaînage optionnel "?." pour une vérification plus propre
    if (lastUserMessage?.includes("site e-commerce") || context === 'Services') {
      filtered = filtered.filter(s => !s.includes("site e-commerce") && s !== "Quel est le délai de livraison?");
    }
    
    if (lastUserMessage?.includes("me former") || lastUserMessage?.includes("formation")) {
      filtered = filtered.filter(s => !s.includes("me former") && !s.includes("formation e-commerce"));
    }
    
    // Éviter de proposer une suggestion qui est exactement le dernier message
    if (lastUserMessage) {
      filtered = filtered.filter(s => s !== lastUserMessage);
    }
    
    return filtered;
  };

/**
 * Composant principal du chatbot TEKKI Studio
 * Gère l'état global et coordonne les sous-composants
 */
export default function TekkiChatbot() {
  const pathname = usePathname();
  const [sessionId] = useState(() => uuidv4());
  const [isFirstRenderComplete, setIsFirstRenderComplete] = useState(false);
  const [isConfigLoading, setIsConfigLoading] = useState(true);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [currentActiveBusiness, setCurrentActiveBusiness] = useState<Business | null>(null);
  
  // État pour contrôler le modal d'acquisition
  const [modalBusinessData, setModalBusinessData] = useState<{
    isOpen: boolean;
    business: Business | null;
  }>({
    isOpen: false,
    business: null
  });
  
  // Utilisation des hooks personnalisés pour découpler la logique
  const { isMobileDevice, isIOSDevice } = useDeviceDetection();
  const { chatState, setChatState, messages, setMessages, addMessage, isTyping, setIsTyping } = useChatState();
  const { userScrolling, setUserScrolling, scrollToBottom, messagesContainerRef, messagesEndRef } = useScrollBehavior();
  const { conversionFunnel, updateFunnelState } = useConversionFunnel(sessionId, pathname);
  
  // Services
  const businessService = new BusinessService(supabase);
  const chatService = new ChatService(supabase, sessionId);
  const analyzer = new ConversationAnalyzer();
  
  // Ignorer le rendu sur les pages admin
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  // Marquer le premier rendu comme terminé
  useEffect(() => {
    setIsFirstRenderComplete(true);
  }, []);

  // Charger les businesses et la configuration au démarrage
  useEffect(() => {
    const initialize = async () => {
      try {
        setIsConfigLoading(true);
        
        // Chargement en parallèle pour optimiser les performances
        const [configResult, businessesResult] = await Promise.all([
          chatService.loadChatbotConfig(),
          businessService.loadBusinesses()
        ]);
        
        console.log("Résultat du chargement des business:", businessesResult);
        
        // Initialiser le chat avec la configuration
        if (configResult.success && configResult.data) {
          setChatState(prev => ({ ...prev, config: configResult.data || null }));
          
          // Définir le message de bienvenue initial
          setMessages([{
            id: 1,
            content: configResult.data.welcome_message || getDefaultWelcomeMessage(),
            type: 'assistant',
            timestamp: new Date(),
            suggestions: configResult.data.initial_suggestions || getDefaultSuggestions()
          }]);
        } else {
          // Utiliser les valeurs par défaut en cas d'erreur
          initializeChatWithDefaults();
        }
        
        // Stocker les businesses chargés LOCALEMENT ET dans le service
        if (businessesResult.success && businessesResult.data) {
          console.log("Stockage de", businessesResult.data.length, "business");
          setBusinesses(businessesResult.data); // État local
          businessService.setBusinesses(businessesResult.data); // Service
        } else {
          console.warn("Échec du chargement des business:", businessesResult.error);
        }
      } catch (error) {
        console.error('Erreur d\'initialisation:', error);
        initializeChatWithDefaults();
      } finally {
        setIsConfigLoading(false);
      }
    };
    
    initialize();
  }, []);

  // Observer les nouveaux messages pour un défilement automatique
  useEffect(() => {
    if (isFirstRenderComplete && messages.length > 0 && !userScrolling) {
      setTimeout(() => scrollToBottom(), 100);
    }
  }, [messages, isTyping, isFirstRenderComplete, userScrolling, scrollToBottom]);

  // Forcer le défilement lorsque le chatbot est ouvert
  useEffect(() => {
    if (chatState.isOpen && isFirstRenderComplete) {
      setTimeout(scrollToBottom, 300);
    }
  }, [chatState.isOpen, isFirstRenderComplete, scrollToBottom]);

  /**
   * Fonction pour obtenir un message de bienvenue par défaut selon l'heure
   */
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

  /**
   * Obtenir les suggestions par défaut
   */
  const getDefaultSuggestions = (): string[] => {
    return [
      "Je suis intéressé par un business",
      "Je veux un site e-commerce",
      "Je veux me former en e-commerce"
    ];
  };

  /**
   * Initialiser le chat avec des valeurs par défaut
   */
  const initializeChatWithDefaults = () => {
    setMessages([{
      id: 1,
      content: getDefaultWelcomeMessage(),
      type: 'assistant',
      timestamp: new Date(),
      suggestions: getDefaultSuggestions()
    }]);
  };

  /**
   * Récupérer le contexte de la page actuelle
   */
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

  /**
   * Fonction utilitaire pour trouver le business en cours dans la conversation
   */
  const findCurrentBusinessInConversation = (): string | null => {
    try {
      // Parcourir les derniers messages pour trouver une référence à un business
      const recentMessages = [...messages].slice(-8).reverse(); // Prendre les 8 derniers messages
      
      // 1. Chercher d'abord dans les messages assistant qui posent des questions spécifiques
      const businessQuestionMsg = recentMessages.find(m => 
        m.type === 'assistant' && 
        (m.content.includes("Puis-je savoir lequel de nos business vous intéresse") ||
         m.content.includes("Qu'aimeriez-vous savoir plus précisément sur") ||
         m.content.includes("Avez-vous déjà parcouru la page de ce business"))
      );
      
      if (businessQuestionMsg) {
        // Extraire le nom du business s'il est mentionné
        const businessMatch = businessQuestionMsg.content.match(/sur ([^?]+)\s?\?/);
        if (businessMatch && businessMatch[1]) {
          const potentialName = businessMatch[1].trim();
          // Vérifier si c'est un nom de business valide
          const matchedBusiness = businesses.find(b => 
            b.name.toLowerCase() === potentialName.toLowerCase() ||
            potentialName.toLowerCase().includes(b.name.toLowerCase())
          );
          
          if (matchedBusiness) {
            console.log("Business identifié dans question assistant:", matchedBusiness.name);
            return matchedBusiness.name;
          }
        }
      }
      
      // 2. Chercher dans les messages utilisateur pour trouver une mention de business
      for (const msg of recentMessages) {
        if (msg.type === 'user') {
          const matchedBusiness = businesses.find(b => 
            msg.content === b.name || 
            msg.content.toLowerCase().includes(b.name.toLowerCase())
          );
          
          if (matchedBusiness) {
            console.log("Business identifié dans message utilisateur:", matchedBusiness.name);
            return matchedBusiness.name;
          }
        }
      }
      
      // 3. Vérifier les suggestions cliquées récemment
      const suggestionsClicked = recentMessages
        .filter(m => m.type === 'user')
        .map(m => m.content);
      
      for (const suggestion of suggestionsClicked) {
        const matchedBusiness = businesses.find(b => b.name === suggestion);
        if (matchedBusiness) {
          console.log("Business identifié via suggestion cliquée:", matchedBusiness.name);
          return matchedBusiness.name;
        }
      }
      
      // 4. Chercher dans le contexte des messages précédents
      const contextWithBusiness = recentMessages
        .filter(m => m.context && m.context.url)
        .find(m => m.context?.url.startsWith('/business/') && !m.context?.url.endsWith('/business'));
      
      if (contextWithBusiness && contextWithBusiness.context) {
        const businessSlug = contextWithBusiness.context.url.split('/').pop();
        const matchedBusiness = businesses.find(b => b.slug === businessSlug);
        
        if (matchedBusiness) {
          console.log("Business identifié via contexte URL:", matchedBusiness.name);
          return matchedBusiness.name;
        }
      }
      
      return null;
    } catch (error) {
      console.error("Erreur lors de la recherche du business dans la conversation:", error);
      return null;
    }
  };

  /**
   * Traiter un intérêt général pour les business
   */
  const handleGeneralBusinessInterest = () => {
    setTimeout(() => {
      try {
        // Filtrer uniquement les business avec status "available"
        const availableBusinesses = businesses.filter(b => b.status === 'available');
        console.log("Business disponibles:", availableBusinesses);
        
        // Liste des suggestions à afficher
        let businessSuggestions: string[] = [];
        
        if (availableBusinesses && availableBusinesses.length > 0) {
          // Utiliser les business disponibles (jusqu'à 6)
          const businessesToShow = availableBusinesses.slice(0, Math.min(6, availableBusinesses.length));
          businessSuggestions = businessesToShow.map(b => b.name);
          console.log("Noms des business extraits:", businessSuggestions);
        } else {
          // Fallback avec des suggestions par défaut
          businessSuggestions = [
            "Business E-commerce",
            "Business Dropshipping",
            "Business Print on Demand", 
            "Business Services en ligne",
            "Business Niche spécialisée"
          ];
          console.log("Utilisation des suggestions par défaut");
        }
        
        // Ajouter l'option "Je ne sais pas encore"
        const allSuggestions = [...businessSuggestions, "Je ne sais pas encore lequel choisir"];
        
        // Filtrer les suggestions pour plus de cohérence avec le contexte actuel
        const lastUserMessage = messages.length > 0 
        ? (messages[messages.length - 1].type === 'user' 
            ? messages[messages.length - 1].content 
            : undefined) 
        : undefined;
            
        const filteredSuggestions = getFilteredSuggestions(allSuggestions, "Business", lastUserMessage);
        
        console.log("Suggestions finales:", filteredSuggestions);
        
        // Créer et ajouter le message
        const businessInterestMessage: Message = {
          id: Date.now() + 1,
          content: "Je suis très heureuse de l'apprendre ! Puis-je savoir lequel de nos business vous intéresse ?",
          type: 'assistant',
          timestamp: new Date(),
          suggestions: filteredSuggestions
        };
        
        addMessage(businessInterestMessage);
        setIsTyping(false);
      } catch (error) {
        console.error("Erreur dans handleGeneralBusinessInterest:", error);
        
        // Message de secours en cas d'erreur
        const fallbackMessage: Message = {
          id: Date.now() + 1,
          content: "Je suis très heureuse de l'apprendre ! Puis-je savoir lequel de nos business vous intéresse ?",
          type: 'assistant',
          timestamp: new Date(),
          suggestions: ["Business E-commerce", "Business Dropshipping", "Je ne sais pas encore lequel choisir"]
        };
        
        addMessage(fallbackMessage);
        setIsTyping(false);
      }
    }, 1000);
  };

  /**
   * Gestion de la sélection d'un business spécifique
   */
  const handleBusinessSelection = (businessName: string) => {
    setTimeout(() => {
      // Chercher dans l'état local, uniquement parmi les business disponibles
      const selectedBusiness = businesses.find(
        b => b.name.toLowerCase() === businessName.toLowerCase() && b.status === 'available'
      );
      
      console.log("Business sélectionné:", selectedBusiness);
      
      if (!selectedBusiness) {
        // Business non trouvé ou non disponible, gérer ce cas
        handleUnknownBusiness(businessName);
        return;
      }
      
      // Stocker le business actif
      setCurrentActiveBusiness(selectedBusiness);
      
      const businessSelectionMessage: Message = {
        id: Date.now() + 1,
        content: `C'est un excellent choix ! Avez-vous déjà parcouru la page de ce business pour découvrir les détails ?`,
        type: 'assistant',
        timestamp: new Date(),
        context: getCurrentPageContext(),
        suggestions: ["Oui, je l'ai fait", "Non, pas encore"]
      };
      
      // Mettre à jour le funnel de conversion
      updateFunnelState({
        businessesViewed: [selectedBusiness.name],
        stage: 'interest'
      });
      
      addMessage(businessSelectionMessage);
      setIsTyping(false);
    }, 1000);
  };

  /**
   * Gestion de la réponse "Oui, j'ai parcouru la page"
   */
  const handleBusinessPageViewed = (businessName: string) => {
    setTimeout(() => {
      // Utiliser l'état local pour trouver le business, uniquement parmi ceux disponibles
      const business = businesses.find(
        b => b.name.toLowerCase() === businessName.toLowerCase() && b.status === 'available'
      );
      
      if (!business) {
        // Gérer le cas où le business n'existe pas ou n'est plus disponible
        handleUnknownBusiness(businessName);
        return;
      }
      
      // Mettre à jour le business actif
      setCurrentActiveBusiness(business);
      
      const viewedPageMessage: Message = {
        id: Date.now() + 1,
        content: `Super ! Qu'aimeriez-vous savoir plus précisément sur ${business.name} ?`,
        type: 'assistant',
        timestamp: new Date(),
        context: getCurrentPageContext(),
        suggestions: [
          "Comment se passe l'acquisition ?",
          "Dans combien de temps serai-je rentable ?", 
          "Que faut-il pour le gérer et le développer ?",
          "Quels sont les avantages de ce business ?"
        ]
      };
      
      // Mettre à jour le funnel
      updateFunnelState({
        stage: 'interest',
        businessesViewed: [business.name]
      });
      
      addMessage(viewedPageMessage);
      setIsTyping(false);
    }, 1000);
  };

  /**
   * Gestion de la réponse "Non, pas encore"
   */
  const handleBusinessPageNotViewed = (businessName: string) => {
    setTimeout(() => {
      // Utiliser l'état local pour trouver le business, uniquement parmi ceux disponibles
      const business = businesses.find(
        b => b.name.toLowerCase() === businessName.toLowerCase() && b.status === 'available'
      );
      
      if (!business) {
        // Gérer le cas où le business n'existe pas ou n'est plus disponible
        handleUnknownBusiness(businessName);
        return;
      }
      
      // Mettre à jour le business actif
      setCurrentActiveBusiness(business);
      
      // Construire l'URL de la page du business
      const businessSlug = business.slug || business.name.toLowerCase().replace(/\s+/g, '-');
      const businessUrl = `https://tekkistudio.com/business/${businessSlug}`;
      
      const notViewedPageMessage: Message = {
        id: Date.now() + 1,
        content: `Je vous recommande de parcourir la page du business pour avoir toutes les informations à son sujet. Si vous êtes prêt(e) à l'acquérir, cliquez sur le bouton "Je veux ce business" et remplissez le formulaire d'acquisition.\n\nCliquez ici pour accéder à la page du business : [voir le business](${businessUrl})`,
        type: 'assistant',
        timestamp: new Date(),
        context: getCurrentPageContext(),
        suggestions: ["Je vais voir la page", "J'ai une autre question"]
      };
      
      // Mettre à jour le funnel
      updateFunnelState({
        stage: 'interest',
        businessesViewed: [business.name]
      });
      
      addMessage(notViewedPageMessage);
      setIsTyping(false);
    }, 1000);
  };

  /**
   * Gestion des questions sur l'acquisition d'un business
   */
  const handleBusinessAcquisitionQuery = (businessName: string) => {
    setTimeout(() => {
      // Utiliser l'état local pour trouver le business, uniquement parmi ceux disponibles
      const business = businesses.find(
        b => b.name.toLowerCase() === businessName.toLowerCase() && b.status === 'available'
      );
      
      if (!business) {
        handleUnknownBusiness(businessName);
        return;
      }
      
      // Mettre à jour le business actif
      setCurrentActiveBusiness(business);
      
      const acquisitionMessage: Message = {
        id: Date.now() + 1,
        content: `Pour acquérir ${business.name}, c'est très simple :\n\n1. Rendez-vous sur la page du business et cliquez sur "Je veux ce business"\n2. Remplissez le formulaire de manifestation d'intérêt et envoyez-le\n3. Notre équipe vous contactera dans les 24h suivantes pour discuter des détails de l'acquisition\n4. Après validation, vous recevrez le contrat d'acquisition que vous devrez signer avant d'effectuer le paiement\n5. Une fois le paiement effectué, nous planifierons votre session d'onboarding et vous remettrons tous les accès au site ainsi que tous les éléments du business\n\nL'accompagnement de 2 mois commence dès que votre business est officiellement lancé, c'est-à-dire après le lancement de votre première campagne de publicité.`,
        type: 'assistant',
        timestamp: new Date(),
        context: getCurrentPageContext(),
        suggestions: [
          "Je veux acquérir ce business", 
          "J'ai une autre question", 
          "Contacter un conseiller"
        ]
      };
      
      updateFunnelState({
        stage: 'decision',
        businessesViewed: [business.name]
      });
      
      addMessage(acquisitionMessage);
      setIsTyping(false);
    }, 1000);
  };

  /**
   * Gestion des questions sur la rentabilité d'un business
   */
  const handleBusinessProfitabilityQuery = (businessName: string) => {
    setTimeout(() => {
      // Utiliser l'état local pour trouver le business, uniquement parmi ceux disponibles
      const business = businesses.find(
        b => b.name.toLowerCase() === businessName.toLowerCase() && b.status === 'available'
      );
      
      if (!business) {
        handleUnknownBusiness(businessName);
        return;
      }
      
      // Mettre à jour le business actif
      setCurrentActiveBusiness(business);
      
      // Cette réponse devrait être personnalisée pour chaque business dans un environnement de production
      const profitabilityMessage: Message = {
        id: Date.now() + 1,
        content: `Concernant la rentabilité de ${business.name}, nos clients atteignent généralement le seuil de rentabilité en ${business.roi_estimation_months || 3} à ${(business.roi_estimation_months || 3) + 3} mois après le lancement.\n\nCe business a un potentiel de chiffre d'affaires mensuel de ${business.monthly_potential?.toLocaleString() || "X"} FCFA.\n\nCela dit, la rapidité avec laquelle vous atteindrez la rentabilité dépendra de plusieurs facteurs, notamment votre investissement en marketing et votre engagement dans le développement du business.`,
        type: 'assistant',
        timestamp: new Date(),
        context: getCurrentPageContext(),
        suggestions: [
          "Combien faut-il investir en marketing ?",
          "Comment se passe l'accompagnement ?",
          "Je souhaite l'acquérir"
        ]
      };
      
      updateFunnelState({
        stage: 'consideration',
        businessesViewed: [business.name]
      });
      
      addMessage(profitabilityMessage);
      setIsTyping(false);
    }, 1000);
  };

  /**
   * Gestion des questions sur les compétences et le temps nécessaires
   */
  const handleBusinessRequirementsQuery = (businessName: string) => {
    setTimeout(() => {
      // Utiliser l'état local pour trouver le business, uniquement parmi ceux disponibles
      const business = businesses.find(
        b => b.name.toLowerCase() === businessName.toLowerCase() && b.status === 'available'
      );
      
      if (!business) {
        handleUnknownBusiness(businessName);
        return;
      }
      
      // Mettre à jour le business actif
      setCurrentActiveBusiness(business);
      
      // Cette réponse devrait être personnalisée pour chaque business dans un environnement de production
      const requirementsMessage: Message = {
        id: Date.now() + 1,
        content: `Pour gérer ${business.name} efficacement, vous aurez besoin :\n\n- De consacrer environ ${business.time_required_weekly || "10-15"} heures par semaine au business\n- De compétences de base en marketing digital (que nous vous aiderons à développer)\n- D'une présence en ligne pour suivre les commandes et les interactions clients\n\nVous n'avez pas besoin de compétences techniques avancées car nous avons structuré le business pour qu'il soit accessible aux débutants. Notre accompagnement de 2 mois vous permettra d'acquérir toutes les compétences nécessaires pour gérer et développer ce business.`,
        type: 'assistant',
        timestamp: new Date(),
        context: getCurrentPageContext(),
        suggestions: [
          "Comment se passe l'accompagnement ?",
          "Je n'ai aucune expérience, est-ce un problème ?",
          "Je souhaite l'acquérir"
        ]
      };
      
      updateFunnelState({
        stage: 'consideration',
        businessesViewed: [business.name]
      });
      
      addMessage(requirementsMessage);
      setIsTyping(false);
    }, 1000);
  };

  /**
   * Gestion des questions sur les avantages d'un business
   */
  const handleBusinessAdvantagesQuery = (businessName: string) => {
    setTimeout(() => {
      // Utiliser l'état local pour trouver le business, uniquement parmi ceux disponibles
      const business = businesses.find(
        b => b.name.toLowerCase() === businessName.toLowerCase() && b.status === 'available'
      );
      
      if (!business) {
        handleUnknownBusiness(businessName);
        return;
      }
      
      // Mettre à jour le business actif
      setCurrentActiveBusiness(business);
      
      // Récupérer les avantages du business s'ils existent
      let businessBenefits = "";
      if (business.benefits && Array.isArray(business.benefits) && business.benefits.length > 0) {
        businessBenefits = business.benefits.map((benefit: string) => `- ${benefit}`).join("\n");
      } else {
        businessBenefits = `- Un marché en croissance avec une forte demande
- Une marge bénéficiaire élevée
- Un business 100% en ligne, gérable depuis n'importe où
- Des fournisseurs fiables déjà identifiés
- Une stratégie marketing éprouvée
- Notre accompagnement personnalisé de 2 mois
- Un potentiel d'évolution et de diversification important`;
      }
      
      const advantagesMessage: Message = {
        id: Date.now() + 1,
        content: `Les principaux avantages de ${business.name} sont :\n\n${businessBenefits}\n\nCe business a été spécifiquement conçu pour être facile à démarrer et à faire évoluer, même pour des entrepreneurs débutants.`,
        type: 'assistant',
        timestamp: new Date(),
        context: getCurrentPageContext(),
        suggestions: [
          "Quels sont les risques ?",
          "Comment se passe l'acquisition ?",
          "Je souhaite l'acquérir"
        ]
      };
      
      updateFunnelState({
        stage: 'consideration',
        businessesViewed: [business.name]
      });
      
      addMessage(advantagesMessage);
      setIsTyping(false);
    }, 1000);
  };

  /**
   * Fonction pour aider à choisir un business adapté au profil
   */
  const handleBusinessSelectionHelp = () => {
    setTimeout(() => {
      const helpMessage: Message = {
        id: Date.now() + 1,
        content: "Je serais ravie de vous aider à choisir le business qui correspond le mieux à votre profil. Pour cela, j'aurais besoin d'en savoir un peu plus sur vous :",
        type: 'assistant',
        timestamp: new Date(),
        context: getCurrentPageContext(),
        suggestions: [
          "Quel est votre budget ?",
          "Quel secteur vous intéresse ?",
          "Combien de temps pouvez-vous y consacrer ?",
          "Parler à un conseiller"
        ]
      };
      
      updateFunnelState({
        stage: 'awareness'
      });
      
      addMessage(helpMessage);
      setIsTyping(false);
    }, 1000);
  };

  /**
   * Gestion des business inconnus
   */
  const handleUnknownBusiness = (businessName: string) => {
    setTimeout(() => {
      const unknownBusinessMessage: Message = {
        id: Date.now() + 1,
        content: `Il semble y avoir une petite confusion, nous n'avons pas actuellement de business disponible sur ${businessName}. Voici cependant nos business les plus populaires :`,
        type: 'assistant',
        timestamp: new Date(),
        context: getCurrentPageContext()
      };
      
      // Récupérer les 3 business les plus populaires pour les suggestions
      // Utiliser l'état local plutôt que le service, uniquement les business disponibles
      const popularBusinesses = businesses
        .filter(b => b.status === 'available')
        .slice(0, 3);
        
      const suggestions = popularBusinesses.map(b => b.name);
      
      unknownBusinessMessage.suggestions = [
        ...suggestions,
        "Pourriez-vous me dire plus sur ce qui vous intéresse ?",
        "Voir tous les business disponibles",
        "Parler à un conseiller"
      ];
      
      addMessage(unknownBusinessMessage);
      setIsTyping(false);
    }, 1000);
  };

  /**
   * Gestionnaire pour la suggestion "Prix des formations"
   */
  const handleFormationPrices = async () => {
    try {
      setIsTyping(true);
      
      // Récupérer les formations depuis Supabase
      let formationsData;
      
      try {
        const { data, error } = await supabase
          .from('formations')
          .select('*')
          .eq('is_active', true);
        
        if (error) throw error;
        formationsData = data;
      } catch (err) {
        console.error("Erreur lors de la récupération des formations:", err);
        // Données de secours en cas d'erreur
        formationsData = [
          { title: "Les Fondamentaux de l'E-commerce", price: 80000, level: "Débutant", duration: "1 semaines" },
          { title: "Marketing Digital pour E-commerce", price: 180000, level: "Intermédiaire", duration: "3 semaines" },
          { title: "Gestion du service client en e-commerce", price: 120000, level: "Tous niveaux", duration: "1 semaines" },
          { title: "Gestion de site e-commerce", price: 120000, level: "Avancé", duration: "2 semaines" }
        ];
      }
      
      // Formater la réponse avec les prix
      let content = "Voici nos formations avec leurs tarifs :\n\n";
      
      formationsData.forEach((formation: any) => {
        const formattedPrice = formatPrice(formation.price);
        content += `• **${formation.title}** - ${formattedPrice}\n`;
        content += `   Niveau: ${formation.level || 'Tous niveaux'}, Durée: ${formation.duration || 'N/A'}\n\n`;
      });
      
      content += "Nous proposons également une réduction de 10% pour l'inscription à plusieurs formations simultanément.";
      
      // Ajouter le message au chat
      const formationPricesMessage: Message = {
        id: Date.now() + 1,
        content,
        type: 'assistant',
        timestamp: new Date(),
        context: getCurrentPageContext(),
        suggestions: [
          "M'inscrire à une formation", 
          "Voir le programme détaillé", 
          "Contacter un conseiller"
        ]
      };
      
      addMessage(formationPricesMessage);
      
      // Sauvegarder dans Supabase
      chatService.saveConversation("Prix des formations", content, getCurrentPageContext());
    } catch (error) {
      console.error("Erreur lors de la récupération des prix des formations:", error);
      
      // Message d'erreur
      const errorMessage: Message = {
        id: Date.now() + 1,
        content: "Je suis désolée, je n'arrive pas à récupérer les informations sur les prix des formations en ce moment. Vous pouvez consulter notre page Formations ou contacter notre équipe pour obtenir ces informations.",
        type: 'assistant',
        timestamp: new Date(),
        suggestions: ["Voir les formations", "Contacter un conseiller"]
      };
      
      addMessage(errorMessage);
    } finally {
      setIsTyping(false);
    }
  };

  /**
   * Gestionnaire spécifique pour "Je veux un site e-commerce"
   */
  const handleEcommerceWebsiteRequest = () => {
    // Message expliquant le service de création de site e-commerce
    try {
      setIsTyping(true);
      
      setTimeout(() => {
        const content = `Excellente décision ! Chez TEKKI Studio, nous proposons une offre de création de sites e-commerce professionnels qui convertissent réellement les visiteurs en clients.
        
Cette offre comprend :
• Un site e-commerce entièrement fonctionnel et optimisé pour la conversion
• Une stratégie d'acquisition de clients via Meta (Facebook & Instagram)
• Une formation vidéo sur la prise en main du site
• 2 mois d'accompagnement post-lancement
        
Le délai de livraison du site est de 7 jours ouvrés.
        
Voulez-vous en savoir plus sur cette offre ou avez-vous des questions particulières ?`;
        
        const ecommerceMessage: Message = {
          id: Date.now() + 1,
          content,
          type: 'assistant',
          timestamp: new Date(),
          context: getCurrentPageContext(),
          suggestions: [
            "Quel est le prix du service ?", 
            "Comment se déroule le processus ?", 
            "Contacter un conseiller"
          ]
        };
        
        addMessage(ecommerceMessage);
        setIsTyping(false);
      }, 1000);
    } catch (error) {
      console.error("Erreur dans handleEcommerceWebsiteRequest:", error);
      setIsTyping(false);
    }
  };
  
  /**
   * Gestion de la fermeture du modal avec confirmation
   */
  const handleModalClose = (formSubmitted: boolean = false) => {
    // Fermer le modal
    setModalBusinessData({ 
      isOpen: false, 
      business: null 
    });
    
    // Si le formulaire a été soumis, ajouter un message de confirmation
    if (formSubmitted && currentActiveBusiness) {
      const confirmationMessage: Message = {
        id: Date.now() + 1,
        content: `Félicitations ! Votre demande d'acquisition pour ${currentActiveBusiness.name} a bien été enregistrée. Notre équipe vous contactera dans les 24 heures pour discuter des prochaines étapes et finaliser l'acquisition.`,
        type: 'assistant',
        timestamp: new Date(),
        suggestions: [
          "Parfait, merci !",
          "J'ai une autre question"
        ]
      };
      
      addMessage(confirmationMessage);
    }
  };

  /**
   * Gestionnaire de clic sur les suggestions
   */
  const handleSuggestionClick = async (suggestion: string) => {
    // Gestion de l'acquisition du business
    if (suggestion === "Je veux acquérir ce business" || suggestion === "Je souhaite l'acquérir" || suggestion === "Je le prends") {
      // D'abord, ajouter le message de l'utilisateur
      const userMessage: Message = {
        id: Date.now(),
        content: suggestion,
        type: 'user',
        timestamp: new Date(),
        context: getCurrentPageContext()
      };
      
      addMessage(userMessage);
      setIsTyping(true);
      
      // Mettre à jour le funnel de conversion
      updateFunnelState({
        stage: 'decision'
      });
      
      // Si nous connaissons le business actuellement discuté
      if (currentActiveBusiness) {
        // Récupérer les informations du business
        const businessSlug = currentActiveBusiness.slug;
        const businessName = currentActiveBusiness.name;
        
        setTimeout(() => {
          // Message avec lien direct + proposition d'ouvrir le modal
          const acquisitionMessage: Message = {
            id: Date.now() + 1,
            content: `C'est fantastique ! Vous pouvez acquérir ${businessName} de deux façons :\n\n1. En remplissant le formulaire d'acquisition directement ici dans notre chat\n2. En visitant la page du business : [voir ${businessName}](https://tekkistudio.com/business/${businessSlug})\n\nQue préférez-vous ?`,
            type: 'assistant',
            timestamp: new Date(),
            suggestions: [
              "Remplir le formulaire ici", 
              "Visiter la page du business", 
              "J'ai une question avant"
            ]
          };
          
          addMessage(acquisitionMessage);
          setIsTyping(false);
        }, 1000);
      } else {
        // Si nous ne connaissons pas le business spécifique
        setTimeout(() => {
          const fallbackMessage: Message = {
            id: Date.now() + 1,
            content: `C'est fantastique que vous souhaitiez acquérir un business ! Pour vous aider efficacement, pourriez-vous préciser quel business vous intéresse particulièrement ?`,
            type: 'assistant',
            timestamp: new Date(),
            suggestions: [
              "Voir tous les business disponibles",
              "Parler à un conseiller"
            ]
          };
          
          addMessage(fallbackMessage);
          setIsTyping(false);
        }, 1000);
      }
      
      return;
    }

    // Remplir le formulaire ici
    if (suggestion === "Remplir le formulaire ici") {
      const userMessage: Message = {
        id: Date.now(),
        content: suggestion,
        type: 'user',
        timestamp: new Date(),
        context: getCurrentPageContext()
      };
      
      addMessage(userMessage);
      setIsTyping(true);
      
      if (currentActiveBusiness) {
        if (isMobileDevice) {
          // Sur mobile: rediriger vers la page du business avec un paramètre pour ouvrir le modal
          setTimeout(() => {
            const businessSlug = currentActiveBusiness.slug || 
              currentActiveBusiness.name.toLowerCase().replace(/\s+/g, '-');
            
            // Message informant l'utilisateur de la redirection
            const redirectMessage: Message = {
              id: Date.now() + 1,
              content: `Pour finaliser votre demande sur mobile, je vous redirige vers la page du business ${currentActiveBusiness.name} où vous pourrez remplir le formulaire d'acquisition.`,
              type: 'assistant',
              timestamp: new Date()
            };
            
            addMessage(redirectMessage);
            setIsTyping(false);
            
            // Redirection après un court délai pour permettre la lecture du message
            setTimeout(() => {
              window.location.href = `/business/${businessSlug}?showInterest=true`;
            }, 3000);
          }, 1000);
        } else {
          // Sur desktop: ouvrir le modal directement
          setTimeout(() => {
            setModalBusinessData({
              isOpen: true,
              business: currentActiveBusiness
            });
            setIsTyping(false);
          }, 500);
        }
      }
      return;
    }
    
    // Maintenir les cas spéciaux existants
    if (suggestion === "Ouvrir WhatsApp" || suggestion === "Contacter un conseiller" || suggestion === "Contacter le service client") {
      openWhatsApp();
      return;
    }
    
    if (suggestion === "Retour à l'accueil") {
      window.location.href = "/";
      return;
    }
    
    if (suggestion === "Voir nos business" || suggestion === "Voir tous les business" || suggestion === "Voir tous les business disponibles") {
      window.location.href = "/business";
      return;
    }
    
    if (suggestion === "Non merci, continuer" || suggestion === "Réessayer plus tard") {
      return;
    }
    
    // Gestion du flux de conversation pour les business
    
    // Cas 1: Intérêt général pour un business
    if (suggestion === "Je suis intéressé par un business") {
      const userMessage: Message = {
        id: Date.now(),
        content: suggestion,
        type: 'user',
        timestamp: new Date(),
        context: getCurrentPageContext()
      };
      
      addMessage(userMessage);
      setIsTyping(true);
      
      // Mettre à jour le funnel
      updateFunnelState(suggestion, true);
      
      // Gérer l'intérêt général
      handleGeneralBusinessInterest();
      return;
    }
    
    // Prix des formations
    if (suggestion === "Prix des formations") {
      const userMessage: Message = {
        id: Date.now(),
        content: suggestion,
        type: 'user',
        timestamp: new Date(),
        context: getCurrentPageContext()
      };
      
      addMessage(userMessage);
      setIsTyping(true);
      
      // Utiliser le gestionnaire spécifique
      handleFormationPrices();
      return;
    }
    
    // Je veux un site e-commerce
    if (suggestion === "Je veux un site e-commerce") {
      const userMessage: Message = {
        id: Date.now(),
        content: suggestion,
        type: 'user',
        timestamp: new Date(),
        context: getCurrentPageContext()
      };
      
      addMessage(userMessage);
      setIsTyping(true);
      
      // Utiliser le gestionnaire spécifique
      handleEcommerceWebsiteRequest();
      return;
    }
    
    // Cas 2: L'utilisateur a choisi un business spécifique et indique avoir vu la page
    if (suggestion === "Oui, je l'ai fait") {
      try {
        // Trouver le dernier message du chatbot pour déterminer de quel business il s'agit
        const lastAssistantMessage = [...messages].reverse().find(m => m.type === 'assistant');
        const lastUserMessage = [...messages].reverse().find(m => m.type === 'user');
        
        // Extraire le nom du business du contexte de la conversation
        let businessName = "";
        
        // Chercher dans le contenu du message de l'assistant
        if (lastAssistantMessage && lastAssistantMessage.content.includes("Avez-vous déjà parcouru la page de ce business")) {
          // Dans ce cas, chercher le business dans les messages précédents
          const businessMessages = [...messages].filter(m => 
            m.type === 'user' && 
            businesses.some(b => m.content === b.name || m.content.includes(b.name))
          );
          
          if (businessMessages.length > 0) {
            // Trouver le nom du business dans le dernier message qui mentionne un business
            const businessMatch = businesses.find(b => 
              businessMessages[businessMessages.length - 1].content === b.name || 
              businessMessages[businessMessages.length - 1].content.includes(b.name)
            );
            
            if (businessMatch) {
              businessName = businessMatch.name;
              console.log("Business identifié par analyse de conversation:", businessName);
            }
          }
        }
        
        if (!businessName && lastUserMessage) {
          // Vérifier si le dernier message de l'utilisateur correspond à un business
          const matchedBusiness = businesses.find(b => 
            lastUserMessage.content === b.name || 
            lastUserMessage.content.toLowerCase().includes(b.name.toLowerCase())
          );
          
          if (matchedBusiness) {
            businessName = matchedBusiness.name;
            console.log("Business identifié par le dernier message utilisateur:", businessName);
          }
        }
        
        if (!businessName) {
          // Utiliser la fonction dédiée pour trouver le business en contexte
          businessName = findCurrentBusinessInConversation() || "";
          console.log("Business identifié par la fonction dédiée:", businessName);
        }
        
        if (!businessName && currentActiveBusiness) {
          // Utiliser le business actif si disponible
          businessName = currentActiveBusiness.name;
          console.log("Business identifié via currentActiveBusiness:", businessName);
        }
        
        if (!businessName) {
          console.warn("Impossible d'identifier le business concerné");
          // Fallback si le business n'est pas identifiable
          handleGeneralBusinessInterest();
          return;
        }
        
        const userMessage: Message = {
          id: Date.now(),
          content: suggestion,
          type: 'user',
          timestamp: new Date(),
          context: getCurrentPageContext()
        };
        
        addMessage(userMessage);
        setIsTyping(true);
        
        // Gérer la suite du flux
        handleBusinessPageViewed(businessName);
        
      } catch (error) {
        console.error("Erreur lors du traitement de la suggestion:", error);
        handleGeneralBusinessInterest();
      }
      return;
    }
    
    // Cas 3: L'utilisateur a choisi un business spécifique mais n'a pas vu la page
    if (suggestion === "Non, pas encore") {
      try {
        // Même logique améliorée pour trouver le business concerné
        let businessName = findCurrentBusinessInConversation();
        
        if (!businessName && currentActiveBusiness) {
          businessName = currentActiveBusiness.name;
        }
        
        if (!businessName) {
          // Chercher dans les derniers messages
          const recentMessages = [...messages].slice(-5);
          for (const msg of recentMessages) {
            if (msg.type === 'user') {
              const matchedBusiness = businesses.find(b => 
                msg.content === b.name || 
                msg.content.toLowerCase().includes(b.name.toLowerCase())
              );
              
              if (matchedBusiness) {
                businessName = matchedBusiness.name;
                break;
              }
            }
          }
        }
        
        if (!businessName) {
          console.warn("Impossible d'identifier le business pour 'Non, pas encore'");
          handleGeneralBusinessInterest();
          return;
        }
        
        const userMessage: Message = {
          id: Date.now(),
          content: suggestion,
          type: 'user',
          timestamp: new Date(),
          context: getCurrentPageContext()
        };
        
        addMessage(userMessage);
        setIsTyping(true);
        
        // Gérer la suite du flux
        handleBusinessPageNotViewed(businessName);
      } catch (error) {
        console.error("Erreur lors du traitement de Non, pas encore:", error);
        handleGeneralBusinessInterest();
      }
      return;
    }
    
    // Cas 4: Questions spécifiques sur un business
    if (suggestion === "Comment se passe l'acquisition ?" || 
        suggestion === "Dans combien de temps serai-je rentable ?" || 
        suggestion === "Que faut-il pour le gérer et le développer ?" || 
        suggestion === "Quels sont les avantages de ce business ?") {
      
      try {
        // Trouver le business concerné par la conversation actuelle
        let businessName = findCurrentBusinessInConversation();
        
        // Utiliser le business actif si disponible
        if (!businessName && currentActiveBusiness) {
          businessName = currentActiveBusiness.name;
        }
        
        if (!businessName) {
          console.warn("Impossible d'identifier le business pour la question:", suggestion);
          // Utiliser le flux général si on ne peut pas identifier le business
          const userMessage: Message = {
            id: Date.now(),
            content: suggestion,
            type: 'user',
            timestamp: new Date(),
            context: getCurrentPageContext()
          };
          
          addMessage(userMessage);
          setIsTyping(true);
          
          // Simuler une réponse générique après 1s
          setTimeout(() => {
            const genericResponse: Message = {
              id: Date.now() + 1,
              content: "Pour répondre précisément à cette question, j'aurais besoin de savoir quel business vous intéresse. Pouvez-vous me préciser le nom du business ?",
              type: 'assistant',
              timestamp: new Date(),
              suggestions: ["Voir tous les business disponibles", "Parler à un conseiller"]
            };
            
            addMessage(genericResponse);
            setIsTyping(false);
          }, 1000);
          
          return;
        }
        
        const userMessage: Message = {
          id: Date.now(),
          content: suggestion,
          type: 'user',
          timestamp: new Date(),
          context: getCurrentPageContext()
        };
        
        addMessage(userMessage);
        setIsTyping(true);
        
        // Diriger vers le bon handler selon la question
        if (suggestion === "Comment se passe l'acquisition ?" || 
            ((suggestion as string).includes("acquisition"))) {
          handleBusinessAcquisitionQuery(businessName);
        } 
        else if (suggestion === "Dans combien de temps serai-je rentable ?" || 
                ((suggestion as string).includes("rentable"))) {
          handleBusinessProfitabilityQuery(businessName);
        }
        else if (suggestion === "Que faut-il pour le gérer et le développer ?" || 
                ((suggestion as string).includes("gérer"))) {
          handleBusinessRequirementsQuery(businessName);
        }
        else if (suggestion === "Quels sont les avantages de ce business ?" || 
                ((suggestion as string).includes("avantages"))) {
          handleBusinessAdvantagesQuery(businessName);
        }
        
      } catch (error) {
        console.error("Erreur lors du traitement de la suggestion:", error);
        sendMessage(suggestion); // Fallback vers le processus standard
      }
      
      return;
    }
    
    // Cas 5: Vérifier si la suggestion est un nom de business
    const matchedBusiness = businesses.find(b => suggestion === b.name && b.status === 'available');
    
    if (matchedBusiness) {
      const userMessage: Message = {
        id: Date.now(),
        content: suggestion,
        type: 'user',
        timestamp: new Date(),
        context: getCurrentPageContext()
      };
      
      addMessage(userMessage);
      setIsTyping(true);
      
      // Mettre à jour le funnel
      updateFunnelState(suggestion, true);
      
      // Gérer la sélection de business
      handleBusinessSelection(suggestion);
      return;
    }
    
    // Vérifier si la suggestion correspond à une question fréquente
    const matchedQuestion = await chatService.findMatchingCommonQuestion(suggestion);
    
    if (matchedQuestion) {
      // Si on trouve une correspondance, ajouter directement la question et la réponse
      const userMessage: Message = {
        id: Date.now(),
        content: suggestion,
        type: 'user',
        timestamp: new Date(),
        context: getCurrentPageContext()
      };
      
      addMessage(userMessage);
      setIsTyping(true);
      
      // Mettre à jour le funnel de conversion
      updateFunnelState(suggestion, true);
      
      // Simuler un délai de réponse pour un effet naturel
      setTimeout(() => {
        const assistantMessage: Message = {
          id: Date.now() + 1,
          content: matchedQuestion.answer,
          type: 'assistant',
          timestamp: new Date(),
          context: getCurrentPageContext(),
          suggestions: matchedQuestion.customSuggestions || chatService.generateSuggestionsForCategory(matchedQuestion.category)
        };
        
        addMessage(assistantMessage);
        setIsTyping(false);
        
        // Enregistrer la conversation
        chatService.saveConversation(suggestion, matchedQuestion.answer, getCurrentPageContext());
        
        // Mettre à jour le funnel avec la réponse
        updateFunnelState(matchedQuestion.answer, false);
      }, 1000);
    } else {
      // Pour les autres suggestions, envoyer comme message normal
      sendMessage(suggestion);
    }
  };

  /**
   * Ouvrir WhatsApp
   */
  const openWhatsApp = () => {
    window.open('https://wa.me/221781362728?text=Bonjour%20TEKKI%20Studio,%20j%27ai%20une%20question%20spécifique%20à%20vous%20poser.%20Puis-je%20parler%20à%20un%20une%20vraie%20personne?', '_blank');
  };

  /**
   * Envoyer un message
   */
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
      updateFunnelState(messageContent, true);
      
      addMessage(userMessage);
      setIsTyping(true);
      
      // Réinitialiser l'état de défilement utilisateur pour permettre un défilement automatique
      setUserScrolling(false);
      
      // Analyser le message pour détecter les intentions
      const messageIntent = analyzer.analyzeMessage(messageContent) as MessageIntent;
      
      // Cas spécifiques prioritaires
      if (messageIntent.isContactRequest) {
        handleContactRequest();
        return;
      }
      
      if (messageIntent.isExactBusinessName) {
        // Utiliser l'état local au lieu du service, filtrer par disponibilité
        const business = businesses.find(
          b => b.name.toLowerCase() === messageContent.toLowerCase() && b.status === 'available'
        );
        
        if (business) {
          handleExactBusinessMatch(business);
          return;
        }
      }
      
      if (messageIntent.isGeneralBusinessInterest) {
        handleGeneralBusinessInterest();
        return;
      }
      
      if (messageIntent.isBusinessListRequest) {
        handleBusinessListRequest();
        return;
      }
      
      if (messageIntent.isSpecificBusinessInterest && messageIntent.specificBusinessName) {
        handleSpecificBusinessInterest(messageIntent.specificBusinessName);
        return;
      }
      
      if (messageIntent.isBusinessAspectQuery && messageIntent.businessAspect) {
        const { businessName, aspect } = messageIntent.businessAspect;
        handleBusinessAspectQuery(businessName, aspect);
        return;
      }
      
      // Pour les autres cas, utiliser l'API
      await processAndAddAIResponse(messageContent, context);
    } catch (error) {
      console.error('Error processing message:', error);
      
      const errorMessage: Message = {
        id: Date.now() + 1,
        content: "Je suis momentanément indisponible. Puis-je vous proposer d'échanger directement avec un conseiller qui pourra répondre à toutes vos questions ?",
        type: 'assistant',
        timestamp: new Date(),
        suggestions: ["Contacter un conseiller", "Réessayer plus tard"]
      };
  
      addMessage(errorMessage);
      setIsTyping(false);
      setTimeout(() => scrollToBottom(true), 100);
    }
  };

  /**
   * Traiter une demande de contact
   */
  const handleContactRequest = () => {
    setTimeout(() => {
      const contactMessage: Message = {
        id: Date.now() + 1,
        content: "Vous pouvez contacter notre équipe directement sur WhatsApp. Un conseiller vous répondra dans les plus brefs délais.",
        type: 'assistant',
        timestamp: new Date(),
        suggestions: ["Ouvrir WhatsApp", "Revenir aux questions"]
      };
      
      addMessage(contactMessage);
      setIsTyping(false);
    }, 1000);
  };

  /**
   * Traiter une correspondance exacte avec un business
   */
  const handleExactBusinessMatch = (business: Business) => {
    setTimeout(() => {
      // Mettre à jour le business actif
      setCurrentActiveBusiness(business);
      
      // Générer une réponse conversationnelle sur ce business spécifique
      const conversationalResponse = `
C'est un excellent choix ! Le business "${business.name}" est une opportunité très intéressante disponible à ${business.price.toLocaleString()} FCFA.

C'est un business avec un fort potentiel de rentabilité et qui inclut notre accompagnement de 2 mois pour vous assurer un démarrage optimal.

Avez-vous déjà parcouru la page de ce business pour découvrir tous les détails ?`;

      const specificBusinessMessage: Message = {
        id: Date.now() + 1,
        content: conversationalResponse,
        type: 'assistant',
        timestamp: new Date(),
        suggestions: [
          "Oui, je l'ai fait",
          "Non, pas encore"
        ]
      };
      
      // Mettre à jour le funnel de conversion
      updateFunnelState({
        businessesViewed: [business.name],
        stage: 'interest'
      });
      
      addMessage(specificBusinessMessage);
      setIsTyping(false);
    }, 1000);
  };

  /**
   * Traiter une demande de liste des business
   */
  const handleBusinessListRequest = () => {
    setTimeout(() => {
      // Utiliser uniquement les business disponibles
      const availableBusinesses = businesses.filter(b => b.status === 'available');
      const response = businessService.generateBusinessListResponse(availableBusinesses) as ServiceResponse;
      
      const businessListMessage: Message = {
        id: Date.now() + 1,
        content: response.content,
        type: 'assistant',
        timestamp: new Date(),
        suggestions: response.suggestions
      };
      
      addMessage(businessListMessage);
      setIsTyping(false);
    }, 1000);
  };

  /**
   * Traiter un intérêt pour un business spécifique
   */
  const handleSpecificBusinessInterest = (businessName: string) => {
    setTimeout(() => {
      // Vérifier si le business est disponible
      const business = businesses.find(
        b => b.name.toLowerCase() === businessName.toLowerCase() && b.status === 'available'
      );
      
      if (business) {
        // Mettre à jour le business actif
        setCurrentActiveBusiness(business);
        
        // Générer une réponse pour ce business spécifique
        const specificResponse = {
          content: `Le business "${business.name}" est disponible à ${business.price.toLocaleString()} FCFA. 
    
${business.description || `C'est une opportunité e-commerce clé en main qui inclut un site web fonctionnel, une stratégie marketing, une formation complète et un accompagnement de 2 mois.`}

Avez-vous déjà parcouru la page de ce business pour découvrir tous les détails ?`,
          suggestions: ["Oui, je l'ai fait", "Non, pas encore"]
        };
        
        const businessMessage: Message = {
          id: Date.now() + 1,
          content: specificResponse.content,
          type: 'assistant',
          timestamp: new Date(),
          suggestions: specificResponse.suggestions
        };
        
        addMessage(businessMessage);
        setIsTyping(false);
        return;
      }
      
      // Si le business n'existe pas ou n'est pas disponible
      const response = businessService.generateBusinessSpecificResponse(businessName) as ServiceResponse;
      
      const businessMessage: Message = {
        id: Date.now() + 1,
        content: response.content,
        type: 'assistant',
        timestamp: new Date(),
        suggestions: response.suggestions
      };
      
      addMessage(businessMessage);
      setIsTyping(false);
    }, 1000);
  };

  /**
   * Traiter une question sur un aspect spécifique d'un business
   */
  const handleBusinessAspectQuery = (businessName: string, aspect: string) => {
    setTimeout(() => {
      // Vérifier si le business est disponible
      const business = businesses.find(
        b => b.name.toLowerCase() === businessName.toLowerCase() && b.status === 'available'
      );
      
      if (business) {
        // Mettre à jour le business actif
        setCurrentActiveBusiness(business);
        
        // Générer une réponse spécifique selon l'aspect demandé
        let content = "";
        let suggestions: string[] = [];
        
        // Gérer les différents aspects
        if (aspect.includes("prix") || aspect.includes("coût") || aspect.includes("tarif")) {
          content = `Le business "${business.name}" est disponible à ${business.price.toLocaleString()} FCFA. Ce prix inclut tout ce dont vous avez besoin pour démarrer : le site web, la stratégie marketing, la formation et l'accompagnement de 2 mois.`;
          suggestions = ["Comment se passe l'acquisition ?", "Quels sont les coûts additionnels ?", "Je veux l'acquérir"];
        } 
        else if (aspect.includes("rentabilité") || aspect.includes("revenu") || aspect.includes("profit")) {
          const roi = business.roi_estimation_months || "3 à 6";
          const revenue = business.monthly_potential?.toLocaleString() || "X";
          content = `Pour "${business.name}", nos clients atteignent généralement le seuil de rentabilité en ${roi} mois. Ce business a un potentiel de chiffre d'affaires mensuel de ${revenue} FCFA.`;
          suggestions = ["Combien faut-il investir en marketing ?", "Combien de temps par semaine y consacrer ?", "Je veux l'acquérir"];
        }
        else if (aspect.includes("accompagnement") || aspect.includes("formation")) {
          content = `L'accompagnement pour "${business.name}" dure 2 mois et comprend :\n• Des sessions hebdomadaires avec un expert\n• Une formation complète sur la gestion du business\n• Un support prioritaire par WhatsApp\n• Des conseils personnalisés pour le marketing et la croissance`;
          suggestions = ["Comment se déroulent les sessions ?", "Que se passe-t-il après les 2 mois ?", "Je veux l'acquérir"];
        }
        else if (aspect.includes("temps") || aspect.includes("compétence") || aspect.includes("expérience")) {
          const timeRequired = business.time_required_weekly || "10-15";
          const skillLevel = business.skill_level_required || "débutant";
          content = `Pour gérer "${business.name}", vous aurez besoin de consacrer environ ${timeRequired} heures par semaine. Ce business est adapté pour un niveau ${skillLevel}. Notre accompagnement vous permettra d'acquérir toutes les compétences nécessaires.`;
          suggestions = ["Est-ce gérable en parallèle d'un emploi ?", "Comment se passe l'accompagnement ?", "Je veux l'acquérir"];
        }
        
        if (content) {
          const aspectMessage: Message = {
            id: Date.now() + 1,
            content: content,
            type: 'assistant',
            timestamp: new Date(),
            context: getCurrentPageContext(),
            suggestions: suggestions
          };
          
          // Mettre à jour le funnel de conversion
          updateFunnelState({
            stage: 'consideration',
            businessesViewed: [business.name]
          });
          
          addMessage(aspectMessage);
          setIsTyping(false);
          return;
        }
      }
      
      // Utiliser le service pour une réponse générique
      const response = businessService.handleBusinessAspectResponse(businessName, aspect) as ServiceResponse | null;
      
      if (response) {
        const aspectMessage: Message = {
          id: Date.now() + 1,
          content: response.content,
          type: 'assistant',
          timestamp: new Date(),
          suggestions: response.suggestions
        };
        
        // Mettre à jour le funnel de conversion
        updateFunnelState({
          stage: 'consideration',
          businessesViewed: [businessName]
        });
        
        addMessage(aspectMessage);
        setIsTyping(false);
      } else {
        // Si aucune réponse spécifique n'est disponible, passer à l'API
        processAndAddAIResponse(businessName, getCurrentPageContext());
      }
    }, 1000);
  };

  /**
   * Traiter la réponse de l'API et l'ajouter aux messages
   */
  const processAndAddAIResponse = async (messageContent: string, context: PageContext) => {
    try {
      const aiResponse = await chatService.getAIResponse(messageContent, context, conversionFunnel) as AIResponse;
  
      // Filtrer les suggestions pour éviter les redondances
      const lastUserMessage = messages.length > 0 
        ? (messages[messages.length - 1].type === 'user' 
            ? messages[messages.length - 1].content 
            : undefined) 
        : undefined;
      
      // Filtrer les suggestions dans la réponse
      if (Array.isArray(aiResponse.suggestions)) {
        aiResponse.suggestions = getFilteredSuggestions(
          aiResponse.suggestions, 
          context.page,
          lastUserMessage
        );
      }
  
      // Créer le message de l'assistant
      const assistantMessage: Message = {
        id: Date.now() + 1,
        content: aiResponse.content,
        type: 'assistant',
        timestamp: new Date(),
        context: context,
        suggestions: aiResponse.suggestions
      };
  
      addMessage(assistantMessage);
      
      // Mettre à jour le funnel avec la réponse du chatbot
      updateFunnelState(assistantMessage.content, false);
  
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
          
          addMessage(humanSuggestionMessage);
        }, 1500);
      }
  
      // Sauvegarde dans Supabase
      chatService.saveConversation(messageContent, aiResponse.content, context, aiResponse.needs_human);
    } catch (error) {
      console.error('Error:', error);
      throw error; // Re-lancer l'erreur pour la gestion en amont
    }
  };

  // Afficher un chargement pendant que la configuration se charge
  if (isConfigLoading) {
    return null; // On ne montre rien pendant le chargement initial
  }

  // Rendu du composant principal
  return (
    <>
      <ChatContainer 
        isOpen={chatState.isOpen}
        showBubble={chatState.showBubble}
        isMobileDevice={isMobileDevice}
        isIOSDevice={isIOSDevice}
        messages={messages}
        isTyping={isTyping}
        userScrolling={userScrolling}
        messagesContainerRef={messagesContainerRef}
        messagesEndRef={messagesEndRef}
        onSetOpen={(isOpen) => setChatState(prev => ({ ...prev, isOpen }))}
        onSetShowBubble={(showBubble) => setChatState(prev => ({ ...prev, showBubble }))}
        onSendMessage={sendMessage}
        onSuggestionClick={handleSuggestionClick}
        onOpenWhatsApp={openWhatsApp}
        onScrollToBottom={scrollToBottom}
      />
      
      {/* Modal d'acquisition intégré au chatbot */}
        {modalBusinessData.isOpen && modalBusinessData.business && 
        console.log("Tentative d'affichage du modal pour:", modalBusinessData.business.name)}

        {modalBusinessData.isOpen && modalBusinessData.business && (
        <div className="z-[10050]"> {/* Wrapper avec z-index supérieur */}
            <InterestModal
            isOpen={modalBusinessData.isOpen}
            onClose={(formSubmitted?: boolean) => handleModalClose(formSubmitted || false)}
            businessName={modalBusinessData.business.name}
            businessPrice={formatPrice(modalBusinessData.business.price)}
            businessId={modalBusinessData.business.id}
            />
        </div>
        )}
    </>
  );
}