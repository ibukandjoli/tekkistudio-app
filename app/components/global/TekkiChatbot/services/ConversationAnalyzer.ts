// app/components/global/TekkiChatbot/services/ConversationAnalyzer.ts

/**
 * Service pour analyser les conversations et détecter les intentions
 */
export class ConversationAnalyzer {
    /**
     * Analyser un message pour détecter les intentions
     */
    analyzeMessage(message: string): {
      isContactRequest: boolean;
      isExactBusinessName: boolean;
      isGeneralBusinessInterest: boolean;
      isBusinessListRequest: boolean;
      isSpecificBusinessInterest: boolean;
      specificBusinessName?: string;
      isBusinessAspectQuery: boolean;
      businessAspect?: { businessName: string; aspect: string };
    } {
      const messageLC = message.toLowerCase();
      
      // Détecter une demande de contact
      const isContactRequest = this.isContactRequest(messageLC);
      
      // Détecter un intérêt général pour les business
      const isGeneralBusinessInterest = this.isGeneralBusinessInterest(messageLC);
      
      // Détecter une demande de liste de business
      const isBusinessListRequest = this.isBusinessListRequest(messageLC);
      
      // Détecter un intérêt pour un business spécifique
      const specificBusinessInfo = this.detectSpecificBusinessInterest(messageLC);
      const isSpecificBusinessInterest = !!specificBusinessInfo;
      
      // Détecter une question sur un aspect d'un business
      const businessAspect = this.detectBusinessAspectQuery(messageLC);
      const isBusinessAspectQuery = !!businessAspect;
      
      return {
        isContactRequest,
        isExactBusinessName: false, 
        isGeneralBusinessInterest,
        isBusinessListRequest,
        isSpecificBusinessInterest,
        specificBusinessName: specificBusinessInfo,
        isBusinessAspectQuery,
        businessAspect
      };
    }
    
    /**
     * Vérifier si le message est une demande de contact
     */
    private isContactRequest(message: string): boolean {
      return message.includes('contacter un conseiller') || 
             message.includes('contacter le service client') ||
             message.includes('parler à un conseiller') ||
             message.includes('parler à un humain') ||
             message.includes('parler à quelqu\'un') ||
             message.includes('besoin d\'aide urgente');
    }
    
    /**
     * Vérifier si le message exprime un intérêt général pour les business
     */
    private isGeneralBusinessInterest(message: string): boolean {
      return message === "je suis intéressé par un business" || 
             message === "je veux acheter un business" ||
             message === "montrez-moi vos business" ||
             message === "je cherche un business" || 
             message === "quels business proposez-vous" ||
             message === "je veux acheter un de vos business";
    }
    
    /**
     * Vérifier si le message demande une liste des business
     */
    private isBusinessListRequest(message: string): boolean {
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
      
      return businessKeywords.some(keyword => message.includes(keyword));
    }
    
    /**
     * Détecter un intérêt pour un business spécifique
     */
    private detectSpecificBusinessInterest(message: string): string | undefined {
        // Si le message commence par "En savoir plus sur" suivi d'un nom de business
        const interestMatch = message.match(/^En savoir plus sur (.+)$/i);
        if (interestMatch && interestMatch[1]) {
          return interestMatch[1].trim();
        }
        
        return undefined; 
      }
    
    /**
     * Détecter une question sur un aspect spécifique d'un business
     */
    private detectBusinessAspectQuery(message: string): { businessName: string; aspect: string } | undefined {
      // Patterns pour détecter les différents aspects
      const aspectPatterns = [
        { 
          regex: /(?:rentabilité|prix|co[ûu]t|tarif|combien co[ûu]te|budget)(?:.+?)(?:de|du|pour|sur)(?:.+?)([a-zÀ-ÿ0-9&\s-]+)/i, 
          aspect: 'rentabilité' 
        },
        { 
          regex: /(?:temps|heures|disponibilité|consacrer)(?:.+?)(?:pour|de|du)(?:.+?)([a-zÀ-ÿ0-9&\s-]+)/i, 
          aspect: 'temps' 
        },
        { 
          regex: /(?:compétences?|expérience|niveau|savoir-faire|connaissance)(?:.+?)(?:pour|de|du)(?:.+?)([a-zÀ-ÿ0-9&\s-]+)/i, 
          aspect: 'compétences' 
        },
        { 
          regex: /(?:accompagnement|aide|support|assistance|coaching)(?:.+?)(?:pour|de|du)(?:.+?)([a-zÀ-ÿ0-9&\s-]+)/i, 
          aspect: 'accompagnement' 
        },
        { 
          regex: /(?:processus|étapes|acquérir|acquisition|acheter|achat)(?:.+?)(?:de|du|pour)(?:.+?)([a-zÀ-ÿ0-9&\s-]+)/i, 
          aspect: 'acquisition' 
        }
      ];
      
      // Cas standard: "Aspect de Business"
      for (const pattern of aspectPatterns) {
        const match = message.match(pattern.regex);
        if (match && match[1]) {
          return {
            businessName: match[1].trim(),
            aspect: pattern.aspect
          };
        }
      }
      
      return undefined;
    }
  }