// app/layout.tsx

import './globals.css';
import type { Metadata } from 'next';
import { Inter, Fraunces } from 'next/font/google';
import { Suspense } from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import MetaPixel from './components/analytics/MetaPixel';
import { Toaster } from 'sonner';
import CurrencySelectorWrapper from './components/common/CurrencySelectorWrapper';

// Configuration de Fraunces pour les titres (police élégante et professionnelle)
const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fraunces',
  weight: ['400', '500', '600', '700', '800', '900']
});

// Configuration d'Inter pour le corps de texte
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['400', '500', '600', '700']
});

export const metadata: Metadata = {
  title: 'TEKKI Studio - Créateurs & accélérateurs de marques africaines',
  description: 'L\'agence de croissance digitale des marques africaines ambitieuses. Nous créons nos propres marques et mettons notre expertise au service des marques africaines qui veulent vendre plus, vendre mieux, et vendre partout.',
  keywords: 'e-commerce afrique, agence digitale afrique, marque africaine, boutique en ligne sénégal, vendre en ligne afrique, agence e-commerce dakar, croissance digitale, marques africaines, TEKKI Studio',
  authors: [{ name: 'TEKKI Studio' }],
  creator: 'TEKKI Studio',
  publisher: 'TEKKI Studio',
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://tekkistudio.com',
    title: 'TEKKI Studio - Créateurs & accélérateurs de marques africaines',
    description: 'Nous créons nos propres marques et mettons notre expertise au service des marques africaines qui veulent vendre plus, vendre mieux, et vendre partout.',
    siteName: 'TEKKI Studio',
    images: [
      {
        url: '/images/tekkistudio-og.jpg',
        width: 1200,
        height: 630,
        alt: 'TEKKI Studio - Créateurs & accélérateurs de marques africaines',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TEKKI Studio - Créateurs & accélérateurs de marques africaines',
    description: 'Nous créons nos propres marques et mettons notre expertise au service des marques africaines qui veulent vendre plus, vendre mieux, et vendre partout.',
    creator: '@tekkistudio',
    images: ['/images/tekkistudio-og.jpg'],
  },
  icons: {
    icon: [
      { url: '/images/tekkistudio/fav.png' },
      { url: '/images/tekkistudio/fav.png', sizes: '16x16', type: 'image/png' },
      { url: '/images/tekkistudio/fav.png', sizes: '32x32', type: 'image/png' }
    ],
    apple: [
      { url: '/images/tekkistudio/fav.png', sizes: '180x180', type: 'image/png' }
    ],
    shortcut: '/images/tekkistudio/fav.png'
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      className={`${fraunces.variable} ${inter.variable}`}
      suppressHydrationWarning={true}
    >
      <head>
        {/* Balises meta supplémentaires pour SEO et performance */}
        <meta 
          name="viewport" 
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" 
        />
        <meta name="robots" content="index, follow" />
        <meta name="theme-color" content="#0f4c81" />
        
        {/* Favicons et icônes */}
        <link rel="icon" href="/images/tekkistudio/fav.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/images/tekkistudio/fav.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/images/tekkistudio/fav.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/images/tekkistudio/fav.png" />
        <link rel="shortcut icon" href="/images/tekkistudio/fav.png" />
        <meta name="msapplication-TileColor" content="#0f4c81" />
        
        {/* Ajout d'attributs pour éviter les erreurs d'hydratation */}
        <meta data-lt-installed="true" />
        
        {/* Préchargement des ressources critiques pour les polices */}
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-body antialiased bg-background text-foreground min-h-screen flex flex-col">
        {/* Composant Pixel Meta pour le suivi - avec Suspense */}
        <Suspense fallback={null}>
          <MetaPixel />
        </Suspense>
        
        {/* Structure principale du site avec animations */}
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>

        {/* Sélecteur de devise - maintenant masqué sur mobile */}
        <div className="hidden md:block">
          <CurrencySelectorWrapper />
        </div>
        
        {/* Intégration du chatbot - maintenant masqué sur mobile 
        <div className="hidden md:block">
          <TekkiChatbot />
        </div>
        */}
        
        {/* Système de notifications amélioré */}
        <Toaster 
          position="top-right" 
          richColors 
          closeButton 
          toastOptions={{
            className: 'shadow-medium rounded-lg',
            duration: 5000,
          }}
        />
        
        {/* Script pour les animations au scroll - Utiliser un client-side effect avec useEffect serait préférable */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              document.addEventListener('DOMContentLoaded', function() {
                const animatedElements = document.querySelectorAll('.animate-on-scroll');
                
                const observer = new IntersectionObserver((entries) => {
                  entries.forEach(entry => {
                    if (entry.isIntersecting) {
                      entry.target.classList.add('animate-fade-in');
                      observer.unobserve(entry.target);
                    }
                  });
                }, {
                  threshold: 0.1
                });
                
                animatedElements.forEach(el => {
                  observer.observe(el);
                });
              });
            `,
          }}
        />
      </body>
    </html>
  );
}