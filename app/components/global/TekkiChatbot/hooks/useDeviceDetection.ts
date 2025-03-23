// app/components/global/TekkiChatbot/hooks/useDeviceDetection.ts
import { useState, useEffect } from 'react';

export function useDeviceDetection() {
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [isIOSDevice, setIsIOSDevice] = useState(false);
  
  useEffect(() => {
    // Détection d'appareil mobile
    const detectMobile = () => {
      if (typeof window === 'undefined') return false;
      return window.innerWidth <= 768 || 
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    };
    
    // Détection d'iOS
    const detectIOS = () => {
      if (typeof window === 'undefined') return false;
      return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    };
    
    setIsMobileDevice(detectMobile());
    setIsIOSDevice(detectIOS());
    
    const handleResize = () => setIsMobileDevice(detectMobile());
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return { isMobileDevice, isIOSDevice };
}