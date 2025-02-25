// app/lib/utils/date-utils.ts

/**
 * Formate une date en texte relatif (aujourd'hui, hier, il y a X jours, etc.)
 * @param dateString La date à formater
 * @returns Texte formaté en format relatif
 */
export function formatRelativeDate(dateString: string): string {
    if (!dateString) return "Date inconnue";
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Date invalide";
    
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Aujourd'hui";
    if (diffDays === 1) return "Hier";
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `Il y a ${weeks} semaine${weeks > 1 ? 's' : ''}`;
    }
    if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `Il y a ${months} mois`;
    }
    
    const years = Math.floor(diffDays / 365);
    return `Il y a ${years} an${years > 1 ? 's' : ''}`;
  }
  
  /**
   * Formate une date selon le format français (JJ/MM/AAAA)
   * @param dateString La date à formater
   * @returns Date formatée
   */
  export function formatDate(dateString: string): string {
    if (!dateString) return "";
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
  
  /**
   * Ajoute la notion de date et heure (JJ/MM/AAAA à HH:MM)
   * @param dateString La date à formater
   * @returns Date et heure formatées
   */
  export function formatDateTime(dateString: string): string {
    if (!dateString) return "";
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";
    
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }