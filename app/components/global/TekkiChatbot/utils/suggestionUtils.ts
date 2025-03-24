// app/components/global/TekkiChatbot/utils/suggestionUtils.ts

import { Message, PageContext } from '../types';

/**
 * Filtre les suggestions pour éviter les répétitions et incohérences
 * @param suggestions Liste des suggestions à filtrer
 * @param context Contexte de la page actuelle
 * @param messageHistory Historique récent des messages
 * @returns Liste filtrée de suggestions
 */
export function filterSuggestions(
  suggestions: string[],
  context: PageContext,
  messageHistory: Message[] = []
): string[] {
  if (!suggestions || !Array.isArray(suggestions)) return [];
  
  // Récupérer les derniers messages pour le contexte
  const lastMessages = messageHistory.slice(-5);
  const lastUserMessage = lastMessages.find(m => m.type === 'user')?.content || '';
  
  // Filtrer les suggestions en fonction du contexte
  let filtered = [...suggestions];
  
  // Éviter de montrer des suggestions pour des actions déjà effectuées
  filtered = filtered.filter(suggestion => {
    // Éviter de suggérer ce que l'utilisateur vient de dire
    if (suggestion === lastUserMessage) return false;
    
    // Éviter de suggérer à nouveau des sujets déjà abordés
    const suggestionTopic = getSuggestionTopic(suggestion);
    const recentlyDiscussed = lastMessages.some(message => 
      message.type === 'user' && messageContainsTopic(message.content, suggestionTopic)
    );
    
    // Si le sujet a été récemment discuté, ne pas le suggérer à nouveau
    // sauf pour des exceptions comme "Voir tous les business" qui restent pertinentes
    if (recentlyDiscussed && !isAlwaysRelevantSuggestion(suggestion)) {
      return false;
    }
    
    return true;
  });
  
  // Filtrer par contexte de page
  if (context.page === 'Business') {
    // Dans le contexte business, prioriser les suggestions liées aux business
    filtered = prioritizeBusinessSuggestions(filtered);
  } else if (context.page === 'Formations') {
    // Dans le contexte formation, retirer les suggestions de business non pertinentes
    filtered = filtered.filter(s => !s.includes('business') || isAlwaysRelevantSuggestion(s));
  }
  
  // Si on a déjà une suggestion d'acquisition, la mettre en avant
  const acquisitionSuggestions = [
    "Je veux acquérir ce business", 
    "Je souhaite l'acquérir", 
    "Je le prends"
  ];
  
  if (acquisitionSuggestions.some(s => filtered.includes(s))) {
    // Réorganiser pour mettre les suggestions d'acquisition en premier
    filtered.sort((a, b) => {
      const aIsAcquisition = acquisitionSuggestions.includes(a);
      const bIsAcquisition = acquisitionSuggestions.includes(b);
      
      if (aIsAcquisition && !bIsAcquisition) return -1;
      if (!aIsAcquisition && bIsAcquisition) return 1;
      return 0;
    });
  }
  
  return filtered;
}

/**
 * Détermine si une suggestion est toujours pertinente peu importe le contexte
 */
function isAlwaysRelevantSuggestion(suggestion: string): boolean {
  const alwaysRelevant = [
    "Voir tous les business",
    "Contacter un conseiller", 
    "J'ai une autre question",
    "Voir les formations"
  ];
  
  return alwaysRelevant.some(s => suggestion.includes(s));
}

/**
 * Extrait le sujet principal d'une suggestion
 */
function getSuggestionTopic(suggestion: string): string {
  if (suggestion.includes('site e-commerce')) return 'site e-commerce';
  if (suggestion.includes('formation') || suggestion.includes('me former')) return 'formation';
  if (suggestion.includes('business')) return 'business';
  if (suggestion.includes('prix') || suggestion.includes('tarif')) return 'prix';
  if (suggestion.includes('accompagnement')) return 'accompagnement';
  if (suggestion.includes('délai')) return 'délai';
  
  return suggestion; // Par défaut, le sujet est la suggestion entière
}

/**
 * Vérifie si un message contient un sujet spécifique
 */
function messageContainsTopic(message: string, topic: string): boolean {
  const messageLower = message.toLowerCase();
  const topicLower = topic.toLowerCase();
  
  // Cas spéciaux pour certains sujets
  if (topicLower === 'business' && messageLower.includes('business')) return true;
  if (topicLower === 'site e-commerce' && 
     (messageLower.includes('site') || messageLower.includes('e-commerce'))) return true;
  if (topicLower === 'formation' && 
     (messageLower.includes('formation') || messageLower.includes('me former'))) return true;
  
  return messageLower.includes(topicLower);
}

/**
 * Réorganise les suggestions pour prioriser celles liées aux business
 */
function prioritizeBusinessSuggestions(suggestions: string[]): string[] {
  const businessKeywords = ['business', 'acquérir', 'acheter', 'prix'];
  
  return suggestions.sort((a, b) => {
    const aIsBusiness = businessKeywords.some(keyword => a.toLowerCase().includes(keyword));
    const bIsBusiness = businessKeywords.some(keyword => b.toLowerCase().includes(keyword));
    
    if (aIsBusiness && !bIsBusiness) return -1;
    if (!aIsBusiness && bIsBusiness) return 1;
    return 0;
  });
}