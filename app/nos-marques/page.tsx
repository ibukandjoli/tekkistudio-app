// app/nos-marques/page.tsx
import type { Metadata } from 'next';
import NosMarquesContent from './NosMarquesContent';

export const metadata: Metadata = {
  title: 'Les Marques de TEKKI Studio | Fabrique de Marques Africaines',
  description: 'Découvrez VIENS ON S\'CONNAÎT (+8 000 jeux vendus) et AMANI (+250 produits vendus). Nous appliquons nos stratégies e-commerce sur nos propres marques avant de vous les proposer.',
  keywords: 'marques africaines, e-commerce Afrique, VIENS ON S\'CONNAÎT, AMANI, création marque, stratégie e-commerce, vente en ligne Afrique',
  openGraph: {
    title: 'Les Marques de TEKKI Studio | Fabrique de Marques Africaines',
    description: 'Découvrez comment nous avons créé et développé VIENS ON S\'CONNAÎT (+8 000 jeux vendus) et AMANI (+250 produits vendus). Stratégies e-commerce testées et validées.',
    url: 'https://tekkistudio.com/nos-marques',
    siteName: 'TEKKI Studio',
    locale: 'fr_FR',
    type: 'website',
    images: [
      {
        url: '/images/brands/vosc.png',
        width: 1200,
        height: 630,
        alt: 'TEKKI Studio - Nos Marques Africaines',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nos Marques | TEKKI Studio',
    description: 'VIENS ON S\'CONNAÎT et AMANI : nos marques africaines à succès. Stratégies e-commerce éprouvées.',
    images: ['/images/brands/vosc.png'],
  },
  alternates: {
    canonical: 'https://tekkistudio.com/nos-marques',
  },
};

export default function NosMarquesPage() {
  return <NosMarquesContent />;
}
