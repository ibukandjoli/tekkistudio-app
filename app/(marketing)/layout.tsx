// app/(marketing)/layout.tsx

import type { Metadata } from 'next';
import { Suspense } from 'react';
import Header from '@/app/components/layout/Header';
import Footer from '@/app/components/layout/Footer';
import HashScrollFix from '@/app/components/layout/HashScrollFix';
import MetaPixel from '@/app/components/analytics/MetaPixel';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'TEKKI Studio — La Fabrique de Marques Africaines qui Vendent',
  description: "Site e-commerce, Vendeuse IA et stratégie d'acquisition : on construit le système complet qui transforme votre visibilité en ventes. Stratégies testées sur nos propres marques avant d'être proposées aux vôtres.",
  keywords: 'e-commerce afrique, agence digitale afrique, marque africaine, boutique en ligne senegal, vendre en ligne afrique, agence e-commerce dakar, croissance digitale, marques africaines, TEKKI Studio',
  authors: [{ name: 'TEKKI Studio' }],
  creator: 'TEKKI Studio',
  publisher: 'TEKKI Studio',
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://tekkistudio.com',
    title: 'TEKKI Studio — La Fabrique de Marques Africaines qui Vendent',
    description: "Site e-commerce, Vendeuse IA et stratégie d'acquisition : on construit le système complet qui transforme votre visibilité en ventes. Stratégies testées sur nos propres marques avant d'être proposées aux vôtres.",
    siteName: 'TEKKI Studio',
    images: [
      {
        url: '/images/tekkistudio-og.png',
        width: 1731,
        height: 909,
        alt: 'TEKKI Studio - Une jolie marque ne suffit pas, il faut des ventes',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TEKKI Studio — La Fabrique de Marques Africaines qui Vendent',
    description: "Site e-commerce, Vendeuse IA et stratégie d'acquisition : on construit le système complet qui transforme votre visibilité en ventes. Stratégies testées sur nos propres marques avant d'être proposées aux vôtres.",
    creator: '@tekkistudio',
    images: ['/images/tekkistudio-og.png'],
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
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-tekki-cream text-tekki-blue min-h-screen flex flex-col">
      <Suspense fallback={null}>
        <MetaPixel />
      </Suspense>
      <HashScrollFix />

      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />

      <Toaster
        position="top-right"
        richColors
        closeButton
        toastOptions={{
          className: 'shadow-medium rounded-lg',
          duration: 5000,
        }}
      />
    </div>
  );
}
