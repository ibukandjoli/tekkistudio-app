// app/lib/cloudinary.ts

import { v2 as cloudinary } from 'cloudinary';

// Configuration de Cloudinary avec vos identifiants
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default cloudinary;

// Fonction utilitaire pour générer des URLs optimisées
export function getOptimizedImageUrl(publicId: string, options = {}) {
  // Options par défaut pour l'optimisation
  const defaultOptions = {
    quality: 'auto', // Qualité auto (Cloudinary optimise)
    format: 'auto',  // Format auto (WebP si supporté)
    fetch_format: 'auto',
    dpr: 'auto',     // Ratio de pixels auto basé sur l'appareil
  };
  
  const finalOptions = { ...defaultOptions, ...options };
  return cloudinary.url(publicId, finalOptions);
}