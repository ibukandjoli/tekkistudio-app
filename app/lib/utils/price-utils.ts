// app/lib/utils/price-utils.ts

/**
 * Formate un prix pour l'affichage avec des séparateurs
 * @param price Le prix à formater (nombre ou chaîne)
 * @param includeCurrency Si true, ajoute "FCFA" à la fin
 * @returns Le prix formaté avec des séparateurs
 */
export function formatPrice(price: string | number, includeCurrency = true): string {
    // Si le prix est une chaîne qui contient déjà "FCFA", extraire la partie numérique
    if (typeof price === 'string' && price.includes('FCFA')) {
      const numericPart = price.replace(/[^\d.]/g, '');
      const numericValue = parseFloat(numericPart);
      
      if (isNaN(numericValue)) return price; // Retourner tel quel si pas un nombre
      
      const formattedNumber = new Intl.NumberFormat('fr-FR', {
        maximumFractionDigits: 0
      }).format(numericValue);
      
      return includeCurrency ? `${formattedNumber} FCFA` : formattedNumber;
    }
    
    // Si c'est une chaîne simple ou un nombre
    let numericValue: number;
    
    if (typeof price === 'string') {
      numericValue = parseFloat(price.replace(/[^\d.]/g, ''));
      if (isNaN(numericValue)) return price; // Retourner tel quel si pas un nombre
    } else {
      numericValue = price;
    }
    
    // Formater avec des séparateurs
    const formattedNumber = new Intl.NumberFormat('fr-FR', {
      maximumFractionDigits: 0
    }).format(numericValue);
    
    return includeCurrency ? `${formattedNumber} FCFA` : formattedNumber;
  }
  
  /**
   * Convertit un prix formaté en nombre
   * @param price Le prix formaté (chaîne ou nombre)
   * @returns Le prix en tant que nombre
   */
  export function priceToNumber(price: string | number): number {
    // Si c'est déjà un nombre, retourner directement
    if (typeof price === 'number') return price;
    
    // Supprimer tout ce qui n'est pas un chiffre, un point ou une virgule
    const cleanedString = price.replace(/[^\d.,]/g, '');
    
    // Remplacer les virgules par des points pour la conversion
    const normalizedString = cleanedString.replace(',', '.');
    
    // Convertir en nombre
    const result = parseFloat(normalizedString);
    
    // Retourner 0 si la conversion échoue
    return isNaN(result) ? 0 : result;
  }