import './globals.css';
import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Outfit } from 'next/font/google';

// Configuration d'Outfit pour les titres
const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
  weight: ['400', '500', '600', '700', '800', '900']
});

// Configuration de Plus Jakarta Sans pour le corps de texte
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jakarta',
  weight: ['400', '500', '600', '700', '800']
});

export const metadata: Metadata = {
  title: 'TEKKI Studio',
  description: 'Fabrique de Marques E-commerce Africaines'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      className={`${outfit.variable} ${plusJakarta.variable}`}
      suppressHydrationWarning={true}
    >
      <body className="font-body antialiased">
        {children}
      </body>
    </html>
  );
}
