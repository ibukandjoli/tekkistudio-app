import './globals.css';
import type { Metadata } from 'next';
import { Instrument_Sans, Inter, IBM_Plex_Mono } from 'next/font/google';

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
  weight: ['400', '500', '600', '700'],
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
      className={`${instrumentSans.variable} ${inter.variable} ${ibmPlexMono.variable}`}
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
