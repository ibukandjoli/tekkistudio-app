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
import CurrencySelectorWrapper from './components/common/CurrencySelectorWrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TEKKI Studio - Fabrique de Marques & Business E-commerce',
  description: 'Vous souhaitez vous lancer dans l\'E-commerce? Nous vous aidons à le faire sans que vous ayez à partir de zéro. Achetez l\'un de nos business e-commerce complet et prêt à être lancé, ou sollicitez nos services pour la création de votre business de A à Z, ou la conception de votre site e-commerce.',
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
        <meta 
          name="viewport" 
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" 
        />
        <meta name="robots" content="index, follow" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        {/* Composant Pixel Meta pour le suivi - maintenant avec Suspense */}
        <Suspense fallback={null}>
          <MetaPixel />
        </Suspense>
        
        {/* Structure principale du site */}
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
        
        {/* Système de notifications */}
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}