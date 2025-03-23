// app/components/global/TekkiChatbot/services/ChatService.ts
import { SupabaseClient } from '@supabase/supabase-js';
import { ChatbotConfig, CommonQuestion, PageContext } from '../types';

/**
 * Service pour gérer toutes les interactions avec l'API du chatbot
 */
export class ChatService {
  private supabase: SupabaseClient;
  private sessionId: string;
  private cache: Map<string, any> = new Map();
  
  constructor(supabase: SupabaseClient, sessionId: string) {
    this.supabase = supabase;
    this.sessionId = sessionId;
  }
  
  /**
   * Charger la configuration du chatbot depuis Supabase
   */
  async loadChatbotConfig(): Promise<{ success: boolean, data?: ChatbotConfig }> {
    try {
      const { data, error } = await this.supabase
        .from('chatbot_config')
        .select('*')
        .single();
      
      if (error) {
        console.error('Erreur lors du chargement de la configuration du chatbot:', error);
        return { success: false };
      }
      
      return { 
        success: true, 
        data: data as ChatbotConfig 
      };
    } catch (error) {
      console.error('Exception lors de la récupération de la configuration:', error);
      return { success: false };
    }
  }
  
  /**
   * Trouver une question fréquente correspondant à un message
   */
  async findMatchingCommonQuestion(message: string): Promise<CommonQuestion | null> {
    try {
      // D'abord, vérifier le cache
      const cacheKey = `question_${this.normalizeText(message)}`;
      if (this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey);
      }
      
      // Récupérer toutes les questions fréquentes actives
      const { data: questions, error } = await this.supabase
        .from('chatbot_common_questions')
        .select('*')
        .eq('is_active', true);

      if (error || !questions || questions.length === 0) {
        return null;
      }

      // Normaliser le message pour la comparaison
      const normalizedMessage = this.normalizeText(message);
      
      // 1. Recherche de correspondance exacte ou forte
      for (const question of questions) {
        const normalizedQuestion = this.normalizeText(question.question);
        
        // Correspondance exacte
        if (normalizedQuestion === normalizedMessage) {
          this.cache.set(cacheKey, question);
          return question;
        }
        
        // Correspondance si l'un contient l'autre (pour les suggestions qui sont des versions abrégées)
        if (normalizedQuestion.includes(normalizedMessage) || 
            normalizedMessage.includes(normalizedQuestion)) {
          this.cache.set(cacheKey, question);
          return question;
        }
      }
      
      // 2. Recherche par mots-clés significatifs (si le message est assez long)
      if (normalizedMessage.length > 10) {
        const messageWords = normalizedMessage.split(' ')
          .filter(word => word.length > 3)
          .filter(word => !['comment', 'pourquoi', 'quand', 'estce', 'avez', 'vous', 'votre', 'pour', 'quels', 'quelles'].includes(word));
        
        if (messageWords.length >= 2) {
          for (const question of questions) {
            const normalizedQuestion = this.normalizeText(question.question);
            
            const matchCount = messageWords.filter(word => normalizedQuestion.includes(word)).length;
            const matchRatio = matchCount / messageWords.length;
            
            if (matchRatio >= 0.7) {
              this.cache.set(cacheKey, question);
              return question;
            }
          }
        }
      }
      
      return null;
    } catch (error) {
      console.error('Erreur lors de la recherche de questions fréquentes:', error);
      return null;
    }
  }
  
  /**
   * Obtenir une réponse de l'API du chatbot
   */
  async getAIResponse(
    message: string, 
    context: PageContext, 
    conversionState?: any
  ): Promise<{
    content: string;
    suggestions: string[];
    needs_human: boolean;
  }> {
    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          context,
          sessionId: this.sessionId,
          conversionState
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la communication avec l\'API');
      }

      const data = await response.json();
      
      // Valider la réponse
      return {
        content: data.content || "Désolé, je n'ai pas pu traiter votre demande. Pouvez-vous reformuler ?",
        suggestions: data.suggestions || [],
        needs_human: data.needs_human || false
      };
    } catch (error) {
      console.error('Erreur API:', error);
      throw error;
    }
  }
  
  /**
   * Sauvegarder une conversation dans Supabase
   */
  async saveConversation(
    userMessage: string, 
    assistantResponse: string, 
    context: PageContext,
    needsHuman: boolean = false
  ): Promise<void> {
    try {
      await this.supabase
        .from('chat_conversations')
        .insert([{
          user_message: userMessage,
          assistant_response: assistantResponse,
          page: context.page,
          url: context.url,
          needs_human: needsHuman,
          session_id: this.sessionId,
          created_at: new Date().toISOString()
        }]);
    } catch (supabaseError) {
      // Ignorer silencieusement les erreurs de sauvegarde
      console.warn('Message non sauvegardé:', supabaseError);
    }
  }
  
  /**
   * Générer des suggestions par défaut pour une catégorie
   */
  generateSuggestionsForCategory(category: string): string[] {
    switch (category) {
      case 'business':
        return ["Voir tous les business", "Comment fonctionne l'accompagnement?", "Contacter un conseiller"];
      case 'formation':
        return ["Quelles formations proposez-vous?", "Prix des formations", "Contacter un conseiller"];
      case 'prix':
        return ["Quels sont les frais mensuels?", "Comment se passe le paiement?", "Contacter un conseiller"];
      case 'service':
        return ["Je veux un site e-commerce", "Quel est le délai de livraison?", "Contacter un conseiller"];
      case 'technique':
        return ["Comment se passe le transfert du business?", "Quelle technologie utilisez-vous?", "Contacter un conseiller"];
      default:
        return ["Voir nos business", "Je veux me former en e-commerce", "Contacter un conseiller"];
    }
  }
  
  /**
   * Normaliser le texte pour la comparaison
   */
  private normalizeText(text: string): string {
    return text.toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")  // Supprimer les accents
      .replace(/[.,?!;:]/g, ' ')        // Remplacer la ponctuation par des espaces
      .replace(/\s+/g, ' ');            // Normaliser les espaces multiples
  }
}