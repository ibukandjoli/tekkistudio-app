import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Créer votre site ou application web | TEKKI Studio',
  description:
    'Décrivez votre projet en 8 étapes : site e-commerce, site vitrine, application web ou SaaS. Notre équipe vous recontacte sous 48h avec une proposition sur mesure.',
  openGraph: {
    title: 'Créer votre site ou application web | TEKKI Studio',
    description:
      'Décrivez votre projet en 8 étapes : site e-commerce, site vitrine, application web ou SaaS. Notre équipe vous recontacte sous 48h avec une proposition sur mesure.',
    url: 'https://www.tekkistudio.com/projet-web',
    siteName: 'TEKKI Studio',
    images: [
      {
        url: 'https://www.tekkistudio.com/images/tekkistudio/og-projet-web.jpg',
        width: 1200,
        height: 630,
        alt: 'TEKKI Studio — Créez votre site ou application web',
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Créer votre site ou application web | TEKKI Studio',
    description:
      'Décrivez votre projet en 8 étapes. Notre équipe vous recontacte sous 48h avec une proposition sur mesure.',
    images: ['https://www.tekkistudio.com/images/tekkistudio/og-projet-web.jpg'],
  },
};

export default function ProjetWebLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
