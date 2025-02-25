// app/lib/seo.ts
import type { Metadata } from 'next';

/**
 * Génère les métadonnées SEO pour une page spécifique
 * 
 * @param title - Titre de la page
 * @param description - Description de la page
 * @param keywords - Mots-clés de la page (séparés par des virgules)
 * @param image - URL de l'image à utiliser pour les partages sociaux (og:image)
 * @param url - URL canonique de la page
 * @returns Metadata - Objet de métadonnées formaté pour Next.js
 */
export function generateSEO({
  title,
  description,
  keywords,
  image = '/images/logo.png',
  url,
}: {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
}): Metadata {
  // Assurez-vous que le titre inclut le nom du site
  const fullTitle = title.includes('TEKKI Studio') 
    ? title 
    : `${title} | TEKKI Studio`;
  
  // URL absolue pour l'image
  const absoluteImageUrl = image.startsWith('http') 
    ? image 
    : `https://tekkistudio.com${image}`;
  
  // URL canonique
  const canonicalUrl = url 
    ? url.startsWith('http') ? url : `https://tekkistudio.com${url}` 
    : 'https://tekkistudio.com';

  return {
    title: fullTitle,
    description,
    keywords: keywords || 'fabrique de marques, business ecommerce, formation entrepreneuriat',
    authors: [{ name: 'TEKKI Studio' }],
    openGraph: {
      title: fullTitle,
      description,
      url: canonicalUrl,
      siteName: 'TEKKI Studio',
      images: [{ url: absoluteImageUrl, width: 1200, height: 630 }],
      locale: 'fr_FR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [absoluteImageUrl],
    },
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
  };
}

/**
 * Génère un slug à partir d'une chaîne
 * Utile pour créer des URLs conviviales
 * 
 * @param text - Texte à convertir en slug
 * @returns string - Slug généré
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