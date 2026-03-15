import { Suspense } from 'react';
import MetaPixel from '@/app/components/analytics/MetaPixel';
import { Toaster } from 'sonner';

export default function StandaloneLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={null}>
        <MetaPixel />
      </Suspense>
      {children}
      <Toaster position="top-right" richColors />
    </>
  );
}
