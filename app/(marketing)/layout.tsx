// app/(marketing)/layout.tsx

import type { Metadata } from 'next';
import { Suspense } from 'react';
import Header from '@/app/components/layout/Header';
import Footer from '@/app/components/layout/Footer';
import MetaPixel from '@/app/components/analytics/MetaPixel';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'TEKKI Studio - Fabrique de Marques E-commerce Africaines',
  description: 'Nous avons vendu +8 000 produits en ligne en 2 ans avec nos propres marques. A present, nous appliquons ces strategies aux marques africaines qui veulent exploser leurs ventes en ligne.',
  keywords: 'e-commerce afrique, agence digitale afrique, marque africaine, boutique en ligne senegal, vendre en ligne afrique, agence e-commerce dakar, croissance digitale, marques africaines, TEKKI Studio',
  authors: [{ name: 'TEKKI Studio' }],
  creator: 'TEKKI Studio',
  publisher: 'TEKKI Studio',
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://tekkistudio.com',
    title: 'TEKKI Studio - Fabrique de Marques E-commerce Africaines',
    description: 'Nous avons vendu +8 000 produits en ligne en 2 ans avec nos propres marques.',
    siteName: 'TEKKI Studio',
    images: [
      {
        url: '/images/tekkistudio-og.jpg',
        width: 1200,
        height: 630,
        alt: 'TEKKI Studio - Fabrique de Marques E-commerce Africaines',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TEKKI Studio - Fabrique de Marques E-commerce Africaines',
    description: 'Nous avons vendu +8 000 produits en ligne en 2 ans avec nos propres marques.',
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
