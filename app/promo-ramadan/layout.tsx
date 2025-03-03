import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Offre Spéciale Ramadan - Site E-commerce + Stratégie Meta | TEKKI Studio',
  description: 'Profitez de notre offre spéciale Ramadan : site e-commerce professionnel + stratégie d\'acquisition client sur Meta pour seulement 465 000 FCFA au lieu de 695 000 FCFA. Livraison en 7 jours !',
  keywords: 'site e-commerce, promotion ramadan, commerce en ligne, création site web, stratégie meta, facebook ads, instagram ads, offre limitée, TEKKI Studio, Sénégal, Afrique',
  openGraph: {
    title: 'Offre Exceptionnelle Ramadan - Site E-commerce Professionnel',
    description: 'Profitez de notre offre spéciale Ramadan : site e-commerce professionnel + stratégie d\'acquisition client sur Meta avec 33% de réduction. Offre limitée à 7 clients !',
    type: 'website',
    locale: 'fr_FR',
    images: [
      {
        url: 'https://tekkistudio.com/images/promo/ramadan-2024-og.jpg',
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