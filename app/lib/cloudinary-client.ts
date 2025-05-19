// app/lib/cloudinary-client.ts

// Définition du type pour les options
interface CloudinaryTransformOptions {
    quality?: string;
    format?: string;
    dpr?: string;
    width?: number;
    height?: number;
    crop?: string;
  }
  
  /**
   * Version client/navigateur de l'intégration Cloudinary
   * Cette version n'inclut pas les fonctions qui nécessitent 'fs'
   */
  
  // Fonction utilitaire pour générer des URLs optimisées
  export function getOptimizedImageUrl(publicId: string, options: CloudinaryTransformOptions = {}) {
    // Options par défaut pour l'optimisation
    const defaultOptions: CloudinaryTransformOptions = {
      quality: 'auto', // Qualité auto (Cloudinary optimise)
      format: 'auto',  // Format auto (WebP si supporté)
      dpr: 'auto',     // Ratio de pixels auto basé sur l'appareil
    };
    
    // Construire l'URL manuellement au lieu d'utiliser le SDK
    let cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    
    // Construire la transformation
    const finalOptions = { ...defaultOptions, ...options };
    let transformations = [];
    
    if (finalOptions.quality) transformations.push(`q_${finalOptions.quality}`);
    if (finalOptions.format) transformations.push(`f_${finalOptions.format}`);
    if (finalOptions.dpr) transformations.push(`dpr_${finalOptions.dpr}`);
    if (finalOptions.width) transformations.push(`w_${finalOptions.width}`);
    if (finalOptions.height) transformations.push(`h_${finalOptions.height}`);
    if (finalOptions.crop) transformations.push(`c_${finalOptions.crop}`);
    
    const transformationString = transformations.join(',');
    
    // Format: https://res.cloudinary.com/<cloud_name>/image/upload/<transformations>/<public_id>
    return `https://res.cloudinary.com/${cloudName}/image/upload/${transformationString}/${publicId}`;
  }
  
  // Fonction pour transformer les URLs Cloudinary
  export function transformCloudinaryUrl(url: string, width: number, height: number): string {
    // Ne pas transformer si ce n'est pas une URL Cloudinary
    if (!url.includes('res.cloudinary.com')) {
      return url;
    }
    
    // Format de l'URL Cloudinary:
    // https://res.cloudinary.com/cloud-name/image/upload/v1234567890/folder/file.jpg
    
    // Séparer l'URL en parties
    const parts = url.split('/upload/');
    if (parts.length !== 2) return url;
    
    // Ajouter les transformations
    return `${parts[0]}/upload/q_auto,f_auto,w_${width},h_${height},c_limit/${parts[1]}`;
  }