// app/promo-ramadan/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Offre Spéciale Ramadan - Carême - Site E-commerce + Stratégie Meta | TEKKI Studio',
  description: 'Profitez de notre offre spéciale pour obtenir, en 7 jours ouvrés, un site e-commerce professionnel + stratégie d\'acquisition client sur Facebook & Instagram pour seulement 465 000 FCFA au lieu de 695 000 FCFA, payable en 2 fois.',
  keywords: 'site e-commerce, ramadan, carême, promotion ramadan, vente en ligne, commerce en ligne, création site web, stratégie meta, facebook ads, instagram ads, offre limitée, TEKKI Studio, Sénégal, Afrique',
  openGraph: {
    title: 'Offre Exceptionnelle - Obtenez un site e-commerce professionnel',
    description: 'Profitez de notre offre spéciale Ramadan : site e-commerce professionnel + stratégie d\'acquisition client sur Meta avec 33% de réduction. Offre limitée à 7 clients !',
    type: 'website',
    locale: 'fr_FR',
    images: [
      {
        url: 'https://tekkistudio.com/images/promo/ramandan_2025.png',
        width: 1200,
        height: 630,
        alt: 'Offre Spéciale Ramadan TEKKI Studio',
      },
    ],
  },
};

export default function RamadanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}