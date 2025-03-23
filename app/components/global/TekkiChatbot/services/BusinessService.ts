// app/components/global/TekkiChatbot/services/BusinessService.ts

import { SupabaseClient } from '@supabase/supabase-js';
import { Business } from '../types';

/**
 * Service de gestion des business
 */
export class BusinessService {
  private businesses: Business[] = [];
  private supabase: SupabaseClient;

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
  }

  /**
   * Charger les business depuis la base de données
   */
  async loadBusinesses() {
    try {
      const { data, error } = await this.supabase
        .from('businesses')
        .select('*')
        .eq('status', 'available') // Filtrer uniquement par status "available"
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      this.businesses = data || [];
      return { success: true, data: this.businesses };
    } catch (error) {
      console.error('Erreur lors du chargement des business:', error);
      return { success: false, error };
    }
  }

  /**
   * Définir la liste des business
   */
  setBusinesses(businesses: Business[]) {
    // Filtrer pour ne garder que les business disponibles
    this.businesses = businesses.filter(b => b.status === 'available');
  }

  /**
   * Récupérer la liste des business
   */
  getBusinesses(): Business[] {
    return this.businesses;
  }

  /**
   * Trouver un business par son nom exact
   */
  findExactBusiness(businessName: string): Business | null {
    const business = this.businesses.find(
      b => b.name.toLowerCase() === businessName.toLowerCase()
    );
    return business || null;
  }

  /**
   * Trouver des business par mot-clé
   */
  findBusinessesByKeyword(keyword: string): Business[] {
    return this.businesses.filter(
      b => b.name.toLowerCase().includes(keyword.toLowerCase()) ||
           (b.description && b.description.toLowerCase().includes(keyword.toLowerCase()))
    );
  }

  /**
   * Génère une réponse concernant la liste des business
   */
  generateBusinessListResponse(businesses: Business[]) {
    // Filtrer pour ne garder que les business disponibles
    const availableBusinesses = businesses.filter(b => b.status === 'available');
    
    // Limiter à 5 business pour la liste
    const listedBusinesses = availableBusinesses.slice(0, 5);
    
    let content = "Voici nos business actuellement disponibles :\n\n";
    
    listedBusinesses.forEach(business => {
      // Utiliser la short_description si elle existe, ou utiliser la description normale
      // ou recourir à un message par défaut
      const shortDesc = business.description ? 
        (business.description.length > 100 ? 
          business.description.substring(0, 100) + '...' : 
          business.description) : 
        'Business e-commerce clé en main';
        
      content += `• **${business.name}** - ${business.price.toLocaleString()} FCFA\n   ${shortDesc}\n\n`;
    });
    
    content += "Chaque business inclut un accompagnement de 2 mois pour vous garantir un démarrage optimal. Quel business vous intéresse particulièrement ?";
    
    // Créer des suggestions avec les noms des business
    const suggestions = listedBusinesses.map(b => b.name);
    suggestions.push("Je ne sais pas encore lequel choisir");
    
    return {
      content,
      suggestions
    };
  }

  /**
   * Génère une réponse pour un business spécifique
   */
  generateBusinessSpecificResponse(businessName: string) {
    const business = this.findExactBusiness(businessName);
    
    if (!business) {
      return {
        content: `Je n'ai pas trouvé de business disponible correspondant à "${businessName}". Voulez-vous voir la liste complète de nos business disponibles ?`,
        suggestions: ["Voir tous les business", "J'ai une autre question"]
      };
    }
    
    const content = `Le business "${business.name}" est disponible à ${business.price.toLocaleString()} FCFA. 
    
${business.description || `C'est une opportunité e-commerce clé en main qui inclut un site web fonctionnel, une stratégie marketing, une formation complète et un accompagnement de 2 mois.`}

Avez-vous déjà parcouru la page de ce business pour découvrir tous les détails ?`;
    
    return {
      content,
      suggestions: ["Oui, je l'ai fait", "Non, pas encore"]
    };
  }

  /**
   * Gère la réponse pour une question sur un aspect spécifique d'un business
   */
  handleBusinessAspectResponse(businessName: string, aspect: string) {
    const business = this.findExactBusiness(businessName);
    
    if (!business) {
      return null;
    }
    
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
    else {
      return null; // Aucune correspondance trouvée
    }
    
    return {
      content,
      suggestions
    };
  }

  /**
   * Recommande un business en fonction du profil de l'utilisateur
   */
  recommendBusinessForProfile(budget: number, sector: string, timeAvailable: string): Business | null {
    // Filtrer les business par budget, uniquement parmi ceux disponibles
    let filteredBusinesses = this.businesses.filter(b => b.price <= budget && b.status === 'available');
    
    // Filtrer par secteur si spécifié
    if (sector && sector !== "tous") {
      filteredBusinesses = filteredBusinesses.filter(b => 
        b.category?.toLowerCase().includes(sector.toLowerCase()) ||
        b.target_audience?.toLowerCase().includes(sector.toLowerCase())
      );
    }
    
    // Filtrer par temps disponible
    if (timeAvailable) {
      const timeHours = this.parseTimeAvailable(timeAvailable);
      if (timeHours > 0) {
        filteredBusinesses = filteredBusinesses.filter(b => {
          if (!b.time_required_weekly) return true;
          
          // Extraire les chiffres de time_required_weekly (ex: "10-15")
          const matches = b.time_required_weekly.match(/(\d+)/g);
          if (matches && matches.length > 0) {
            const maxHours = parseInt(matches[matches.length > 1 ? 1 : 0], 10);
            return !isNaN(maxHours) ? maxHours <= timeHours : true;
          }
          return true;
        });
      }
    }
    
    // Retourner le premier business correspondant ou null
    return filteredBusinesses.length > 0 ? filteredBusinesses[0] : null;
  }
  
  /**
   * Convertit une chaîne de temps disponible en nombre d'heures
   */
  private parseTimeAvailable(timeAvailable: string): number {
    if (timeAvailable.includes("5h") || timeAvailable.includes("moins de 10h")) {
      return 5;
    } else if (timeAvailable.includes("10h") || timeAvailable.includes("10-15h")) {
      return 10;
    } else if (timeAvailable.includes("15h") || timeAvailable.includes("15-20h")) {
      return 15;
    } else if (timeAvailable.includes("20h") || timeAvailable.includes("plus de 20h")) {
      return 20;
    } else {
      return 0; // Valeur par défaut
    }
  }
}