// app/components/common/CurrencySelectorWrapper.tsx
'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import CurrencySelector from './CurrencySelector';

const CurrencySelectorWrapper = () => {
  const pathname = usePathname();
  const [shouldRender, setShouldRender] = useState(false);
  
  useEffect(() => {
    setShouldRender(pathname === '/');
  }, [pathname]);
  
  if (!shouldRender) return null;
  
  return <CurrencySelector />;
};

export default CurrencySelectorWrapper;