// app/components/global/TekkiChatbot/hooks/useChatState.ts
import { useState } from 'react';
import { ChatbotConfig, Message } from '../types';

export function useChatState() {
    const [chatState, setChatState] = useState({
        isOpen: false,
        showBubble: true,
        config: null as ChatbotConfig | null, // Utiliser union type
      });
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  
  // Ajouter un message à la liste
  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, message]);
  };
  
  return {
    chatState,
    setChatState,
    messages,
    setMessages,
    addMessage,
    isTyping,
    setIsTyping
  };
}