/**
 * Utilitaires pour la manipulation de chaînes de caractères
 */

/**
 * Génère un slug à partir d'une chaîne de texte
 * Utile pour les URLs et les identifiants
 * 
 * @param text - Texte d'entrée à convertir en slug
 * @returns Un slug en minuscules, sans accents, sans caractères spéciaux
 */
export function generateSlug(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD') // Normaliser les caractères accentués
      .replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
      .replace(/[^\w\s-]/g, '') // Supprimer les caractères spéciaux
      .replace(/\s+/g, '-') // Remplacer les espaces par des tirets
      .replace(/--+/g, '-') // Éviter les tirets multiples
      .trim(); // Supprimer les espaces au début et à la fin
  }
  
  /**
   * Tronque un texte à une longueur maximale donnée et ajoute des points de suspension
   * 
   * @param text - Texte à tronquer
   * @param maxLength - Longueur maximale (défaut: 100)
   * @returns Le texte tronqué avec "..." si nécessaire
   */
  export function truncateText(text: string, maxLength: number = 100): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }
  
  /**
   * Formate un prix en une chaîne lisible avec séparateurs de milliers
   * 
   * @param amount - Montant numérique
   * @param currency - Code de devise (défaut: 'FCFA')
   * @returns Prix formaté (ex: 150,000 FCFA)
   */
  export function formatPrice(amount: number, currency: string = 'FCFA'): string {
    return `${amount.toLocaleString('fr-FR')} ${currency}`;
  }
  
  /**
   * Convertit une chaîne de prix en nombre
   * Utile pour extraire la valeur numérique d'un prix affiché
   * 
   * @param priceString - Chaîne contenant un prix (ex: "150,000 FCFA")
   * @returns Valeur numérique du prix
   */
  export function priceToNumber(priceString: string): number {
    // Supprimer tout sauf les chiffres et les points/virgules
    const numeric = priceString.replace(/[^\d.,]/g, '');
    // Normaliser le séparateur décimal (remplacer les virgules par des points)
    const normalized = numeric.replace(/,/g, '.');
    // Convertir en nombre
    return parseFloat(normalized) || 0;
  }
  
  /**
   * Génère un ID unique basé sur un timestamp et des caractères aléatoires
   * Utile pour les IDs temporaires côté client
   * 
   * @returns Chaîne unique pour identifier un élément
   */
  export function generateUniqueId(): string {
    return `id_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }