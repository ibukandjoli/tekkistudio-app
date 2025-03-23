// app/components/global/TekkiChatbot/hooks/useScrollBehavior.ts
import { useState, useRef, useEffect } from 'react';

export function useScrollBehavior() {
  const [userScrolling, setUserScrolling] = useState(false);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null); 
  
  useEffect(() => {
    const handleScroll = () => {
      if (!messagesContainerRef.current) return;
      
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const isScrollingUp = scrollTop < lastScrollTop;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 50;
      
      setLastScrollTop(scrollTop);
      
      if (isScrollingUp) {
        setUserScrolling(true);
      } else if (isNearBottom) {
        setUserScrolling(false);
      }
    };
    
    const messagesContainer = messagesContainerRef.current;
    if (messagesContainer) {
      messagesContainer.addEventListener('scroll', handleScroll);
    }
    
    return () => {
      if (messagesContainer) {
        messagesContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, [lastScrollTop]);
  
  const scrollToBottom = (force = false) => {
    if (!messagesContainerRef.current || (userScrolling && !force)) return;
    
    try {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      }
    } catch (e) {
      console.warn('Erreur de scroll:', e);
    }
  };
  
  return {
    userScrolling,
    setUserScrolling,
    lastScrollTop,
    setLastScrollTop,
    messagesContainerRef,
    messagesEndRef, 
    scrollToBottom
  };
}