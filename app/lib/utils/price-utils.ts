// app/lib/utils/price-utils.ts
import { useCountryStore } from "@/app/hooks/useCountryStore";

/**
 * Formate un prix pour l'affichage avec des séparateurs
 * @param price Le prix à formater (nombre ou chaîne)
 * @param includeCurrency Si true, ajoute la devise à la fin
 * @returns Le prix formaté avec des séparateurs
 */
export function formatPrice(price: string | number, includeCurrency = true): string {
  // Essayer d'utiliser le store de devise si disponible
  try {
    const { currentCountry, convertPrice } = useCountryStore.getState();
    
    if (currentCountry) {
      // Convertir le prix en nombre
      let numericPrice: number;
      if (typeof price === 'string') {
        numericPrice = priceToNumber(price);
      } else {
        numericPrice = price;
      }
      
      const { formatted } = convertPrice(numericPrice);
      return formatted;
    }
  } catch (error) {
    // Si le store n'est pas disponible, utiliser le formatage classique
    console.log("Currency store not available, using default formatting");
  }
  
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

/**
 * Calcule le montant de la réduction entre deux prix
 * @param originalPrice Prix original
 * @param currentPrice Prix actuel (avec réduction)
 * @returns Texte formaté montrant la réduction
 */
export function formatDiscount(originalPrice: number, currentPrice: number): string {
  if (originalPrice <= currentPrice) return '';
  
  const discountAmount = originalPrice - currentPrice;
  const discountPercentage = Math.round((discountAmount / originalPrice) * 100);
  
  return `Économisez ${formatPrice(discountAmount)} (${discountPercentage}%)`;
}

/**
 * Calcule le nombre de mois pour atteindre le retour sur investissement
 * @param investment Montant de l'investissement
 * @param monthlyRevenue Revenu mensuel projeté
 * @returns Nombre de mois pour atteindre le ROI
 */
export function calculateROI(investment: number, monthlyRevenue: number): number {
  if (monthlyRevenue <= 0) return 0;
  return Math.ceil(investment / monthlyRevenue);
}