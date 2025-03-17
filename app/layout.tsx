// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Suspense } from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import MetaPixel from './components/analytics/MetaPixel';
import { Toaster } from 'sonner';
import TekkiChatbot from './components/global/TekkiChatbot';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TEKKI Studio - Fabrique de Marques',
  description: 'Première Fabrique de Marques d\'Afrique de l\'Ouest',
  keywords: 'fabrique de marques, business ecommerce, formation entrepreneuriat, marques de niche',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        {/* Balises meta supplémentaires pour SEO */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="author" content="TEKKI Studio" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="TEKKI Studio - Fabrique de Marques" />
        <meta property="og:description" content="Première Fabrique de Marques d'Afrique de l'Ouest" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://tekkistudio.com" />
        <meta property="og:image" content="https://tekkistudio.com/images/tekkistudio/tekki-social.png" />
        <link rel="canonical" href="https://tekkistudio.com" />
        <link rel="icon" href="https://tekkistudio.com/images/tekkistudio/fav.png" />
      </head>
      <body className={inter.className}>
        {/* Composant Pixel Meta pour le suivi - maintenant avec Suspense */}
        <Suspense fallback={null}>
          <MetaPixel />
        </Suspense>
        
        {/* Structure principale du site */}
        <Header />
        <main>
          <Suspense fallback={<div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0f4c81]"></div>
          </div>}>
            {children}
          </Suspense>
        </main>
        <Footer />
        
        {/* Intégration du chatbot */}
        <TekkiChatbot />
        
        {/* Système de notifications */}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}