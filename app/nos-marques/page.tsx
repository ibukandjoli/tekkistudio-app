// app/nos-marques/page.tsx
import type { Metadata } from 'next';
import NosMarquesContent from './NosMarquesContent';

export const metadata: Metadata = {
  title: 'Nos Marques | TEKKI Studio - Marques Africaines créées et développées',
  description: 'Découvrez VIENS ON S\'CONNAÎT (+8 000 jeux vendus) et AMANI (bien-être féminin). Nous testons nos stratégies e-commerce sur nos propres marques avant de vous les proposer.',
  keywords: 'marques africaines, e-commerce Afrique, VIENS ON S\'CONNAÎT, AMANI, création marque, stratégie e-commerce, vente en ligne Afrique',
  openGraph: {
    title: 'Nos Marques | TEKKI Studio - Marques Africaines',
    description: 'Découvrez comment nous avons créé et développé VIENS ON S\'CONNAÎT (+8 000 jeux vendus) et AMANI. Stratégies e-commerce testées et validées.',
    url: 'https://tekkistudio.com/nos-marques',
    siteName: 'TEKKI Studio',
    locale: 'fr_FR',
    type: 'website',
    images: [
      {
        url: '/images/og-nos-marques.jpg',
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
    images: ['/images/twitter-nos-marques.jpg'],
  },
  alternates: {
    canonical: 'https://tekkistudio.com/nos-marques',
  },
};

export default function NosMarquesPage() {
  return <NosMarquesContent />;
}
