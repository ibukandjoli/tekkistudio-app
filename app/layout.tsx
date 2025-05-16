// app/layout.tsx

import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Suspense } from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import MetaPixel from './components/analytics/MetaPixel';
import { Toaster } from 'sonner';
import TekkiChatbot from '@/app/components/global/TekkiChatbot/index';
import CurrencySelectorWrapper from './components/common/CurrencySelectorWrapper';

// Utilisation de la police Inter avec tous les sous-ensembles nécessaires
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'TEKKI Studio - Fabrique de Business en ligne clé en main',
  description: 'Lancez-vous dans l\'e-commerce ou le digital sans partir de zéro. Achetez un business en ligne clé en main 100% opérationnel et commencez à générer des revenus',
  keywords: 'business en ligne, business clé en main, online business, business en ligne afrique, e-commerce, business digital, marques de niche, marque de produits, fabrique de marque, entrepreneur africain, Sénégal, Côte d\'Ivoire',
  authors: [{ name: 'TEKKI Studio' }],
  creator: 'TEKKI Studio',
  publisher: 'TEKKI Studio',
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://tekkistudio.com',
    title: 'TEKKI Studio - Fabrique de Business en ligne en Main',
    description: 'Lancez-vous dans l\'e-commerce ou le digital sans partir de zéro. Achetez un business en ligne clé en main 100% opérationnel et commencez à générer des revenus',
    siteName: 'TEKKI Studio',
    images: [
      {
        url: '/images/tekkistudio-og.jpg',
        width: 1200,
        height: 630,
        alt: 'TEKKI Studio - Fabrique de Business E-commerce et Digitaux Clé en Main',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TEKKI Studio - Fabrique de Business E-commerce et Digitaux Clé en Main',
    description: 'Lancez-vous dans l\'e-commerce ou le digital sans partir de zéro. Achetez un business clé en main 100% opérationnel et commencez à générer des revenus.',
    creator: '@tekkistudio',
    images: ['/images/tekkistudio-og.jpg'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: '#0f4c81'
      }
    ]
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
      className={inter.variable} 
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
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#0f4c81" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="msapplication-TileColor" content="#0f4c81" />
        
        {/* Ajout d'attributs pour éviter les erreurs d'hydratation */}
        <meta data-lt-installed="true" />
        
        {/* Préchargement des ressources critiques */}
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin="anonymous"
        />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`bg-background text-foreground min-h-screen flex flex-col`}>
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

        {/* Sélecteur de devise */}
        <CurrencySelectorWrapper />
        
        {/* Intégration du chatbot */}
        <TekkiChatbot />
        
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