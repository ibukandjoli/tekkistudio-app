// app/components/global/TekkiChatbot/hooks/useConversionFunnel.ts
import { useState, useEffect } from 'react';
import { supabase } from '../../../../lib/supabase';

interface ConversionFunnel {
  stage: 'awareness' | 'interest' | 'consideration' | 'decision';
  lastActive: Date;
  businessesViewed: string[];
  topicsDiscussed: string[];
  objections: string[];
  readyToBuy: boolean;
}

export function useConversionFunnel(sessionId: string, pathname?: string) {
  const [conversionFunnel, setConversionFunnel] = useState<ConversionFunnel>({
    stage: 'awareness',
    lastActive: new Date(),
    businessesViewed: [],
    topicsDiscussed: [],
    objections: [],
    readyToBuy: false
  });
  
  // Enregistrer l'état du funnel
  useEffect(() => {
    const saveFunnelState = async () => {
      try {
        // Enregistrer dans Supabase
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
    
    // Sauvegarder uniquement si le funnel a été modifié
    if (conversionFunnel.topicsDiscussed.length > 0 || 
        conversionFunnel.businessesViewed.length > 0 ||
        conversionFunnel.stage !== 'awareness') {
      saveFunnelState();
    }
  }, [conversionFunnel.stage, conversionFunnel.readyToBuy, sessionId, pathname]);
  
  /**
   * Mettre à jour l'état du funnel
   */
  const updateFunnelState = (messageOrUpdate: string | Partial<ConversionFunnel>, isUserMessage: boolean = false) => {
    // Si c'est un objet de mise à jour directe
    if (typeof messageOrUpdate !== 'string') {
      setConversionFunnel(prev => ({
        ...prev,
        ...messageOrUpdate,
        lastActive: new Date()
      }));
      return;
    }
    
    // C'est un message
    const message = messageOrUpdate;
    
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
  
  /**
   * Extraire les sujets mentionnés dans un message
   */
  const extractTopics = (message: string): string[] => {
    const topics = [];
    const messageLC = message.toLowerCase();
    
    if (/prix|coût|tarif|budget|investir/i.test(messageLC)) topics.push('prix');
    if (/temps|heures|disponible|gérer/i.test(messageLC)) topics.push('temps');
    if (/accompagnement|support|aide|formation/i.test(messageLC)) topics.push('accompagnement');
    if (/rentab|profit|revenue|gagner|mois/i.test(messageLC)) topics.push('rentabilité');
    if (/experience|compétence|débutant|savoir/i.test(messageLC)) topics.push('expérience');
    
    return topics;
  };
  
  /**
   * Détecter les objections dans un message
   */
  const detectObjections = (message: string): string[] => {
    const objections = [];
    const messageLC = message.toLowerCase();
    
    if (/cher|élevé|trop|budget/i.test(messageLC)) objections.push('prix');
    if (/temps|occupé|chargé|disponible/i.test(messageLC)) objections.push('temps');
    if (/difficile|compliqué|complexe/i.test(messageLC)) objections.push('complexité');
    if (/risque|peur|inquiet|échec/i.test(messageLC)) objections.push('risque');
    if (/expérience|compétence|savoir|capable/i.test(messageLC)) objections.push('compétence');
    
    return objections;
  };
  
  /**
   * Extraire le nom d'un business mentionné
   */
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
  
  /**
   * Déterminer l'étape du funnel en fonction du message
   */
  const determineStage = (
    message: string, 
    currentStage: 'awareness' | 'interest' | 'consideration' | 'decision',
    isUserMessage: boolean
  ): 'awareness' | 'interest' | 'consideration' | 'decision' => {
    if (!isUserMessage) return currentStage;
    
    const messageLC = message.toLowerCase();
    
    // Progression vers étape décision
    if (/acheter|acquérir|procéder|achat|prêt|acquisition|comment faire/i.test(messageLC)) {
      return 'decision';
    }
    
    // Progression vers étape considération
    if (/prix|coût|combien|frais|investissement|comparaison|différence/i.test(messageLC)) {
      return currentStage === 'decision' ? 'decision' : 'consideration';
    }
    
    // Progression vers étape intérêt
    if (/plus d'info|détails|fonctionnement|comment ça marche|avantage|intéressé/i.test(messageLC)) {
      return currentStage === 'decision' || currentStage === 'consideration' 
        ? currentStage 
        : 'interest';
    }
    
    return currentStage;
  };
  
  /**
   * Vérifier si le message indique que l'utilisateur est prêt à acheter
   */
  const isReadyToBuy = (message: string): boolean => {
    return /je veux acheter|je veux acquérir|je suis prêt|je souhaite acheter|comment procéder/i.test(message);
  };
  
  return {
    conversionFunnel,
    updateFunnelState
  };
}