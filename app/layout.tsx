import './globals.css';
import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Outfit, Instrument_Sans, Inter, IBM_Plex_Mono } from 'next/font/google';

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

// Polices de la refonte homepage (tokens du mockup validé) — scopées à la homepage
const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-instrument',
  weight: ['400', '500', '600', '700'],
});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['400', '500', '600'],
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plex-mono',
  weight: ['500', '600'],
});

export const metadata: Metadata = {
  title: 'TEKKI Studio',
  description: 'Fabrique de Marques E-commerce Africaines'
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      className={`${outfit.variable} ${plusJakarta.variable} ${instrumentSans.variable} ${inter.variable} ${ibmPlexMono.variable}`}
      suppressHydrationWarning={true}
    >
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://ythxumuniqxvfrwapfft.supabase.co" />
        <link rel="dns-prefetch" href="https://ythxumuniqxvfrwapfft.supabase.co" />
      </head>
      <body className="font-body antialiased">
        {children}
      </body>
    </html>
  );
}
