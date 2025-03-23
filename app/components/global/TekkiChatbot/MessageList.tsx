// app/components/global/TekkiChatbot/MessageList.tsx
import React, { useEffect } from 'react';
import Image from 'next/image';
import { Message } from './types';
import MessageDisplay from './MessageDisplay';

interface MessageListProps {
  messages: Message[];
  isTyping: boolean;
  isMobileDevice: boolean;
  messagesContainerRef: React.RefObject<HTMLDivElement>;
  messagesEndRef: React.RefObject<HTMLDivElement>; // Ajouté
  keyboardOpen: boolean;
  onSuggestionClick: (suggestion: string) => void;
}

const MessageList: React.FC<MessageListProps> = ({
  messages,
  isTyping,
  isMobileDevice,
  messagesContainerRef,
  messagesEndRef, // Utilisé correctement
  keyboardOpen,
  onSuggestionClick
}) => {
  // Log des suggestions pour débogage
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage?.suggestions && lastMessage.suggestions.length > 0) {
        console.log("Dernières suggestions:", lastMessage.suggestions);
      }
    }
  }, [messages]);

  // Fonction pour déterminer si on doit afficher les suggestions pour un message
  const shouldShowSuggestions = (msg: Message): boolean => {
    // Premier message d'accueil
    if (msg.id === 1) return true;
    
    // Messages d'erreur techniques
    if (msg.content.includes("difficultés techniques") || msg.content.includes("momentanément indisponible")) return true;
    
    // Contact service client uniquement si explicitement demandé
    const needsContactOption = msg.content.toLowerCase().includes("besoin d'aide") || 
                              msg.content.toLowerCase().includes("assistance") ||
                              msg.content.toLowerCase().includes("parler à quelqu'un");
    
    if (needsContactOption && msg.suggestions && (msg.suggestions.includes("Contacter un conseiller") || msg.suggestions.includes("Contacter le service client"))) {
        // Ne conserver que les suggestions critiques
        return true;
    }
    
    // Afficher les suggestions pour les réponses significatives avec des suggestions
    return msg.suggestions ? msg.suggestions.length > 0 : false;
  };

  // Style conditionnel pour le conteneur de messages
  const messageContainerStyle = {
    height: isMobileDevice 
      ? keyboardOpen 
        ? 'calc(100vh - 220px)' 
        : 'calc(100vh - 160px)' 
      : 'auto',
    width: '100%',
    overflow: 'auto',
    paddingBottom: isMobileDevice ? '120px' : '0',
    maxWidth: isMobileDevice ? '100vw' : 'auto',
  };

  return (
    <div 
      ref={messagesContainerRef}
      className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar tekki-chatbot-messages"
      style={messageContainerStyle}
    >
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`flex gap-3 ${
            msg.type === 'user' ? "justify-end" : ""
          }`}
        >
          {msg.type === 'assistant' && (
            <div className="w-8 h-8 rounded-full bg-[#FF7F50] flex items-center justify-center flex-shrink-0">
              <Image 
                src="/images/logos/fav_tekki.svg" 
                alt="TEKKI Studio" 
                width={20} 
                height={20}
              />
            </div>
          )}
          
          <div className={`max-w-[80%] space-y-3 ${
            msg.type === 'assistant' 
              ? "text-gray-800 dark:text-gray-200" 
              : "text-white"
          }`}>
            {/* Message principal */}
            <div className={`rounded-2xl p-3 ${
              msg.type === 'assistant' 
                ? "bg-gray-100 dark:bg-gray-700" 
                : "bg-[#0f4c81]"
            }`}>
              <MessageDisplay content={msg.content} type={msg.type} />
              <p className="text-[10px] mt-1 text-gray-500 dark:text-gray-400">
                {msg.timestamp.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </div>

            {/* Suggestions cliquables */}
            {msg.type === 'assistant' && msg.suggestions && msg.suggestions.length > 0 && shouldShowSuggestions(msg) && (
            <div className="flex flex-wrap gap-2">
                {msg.suggestions.map((suggestion, index) => {
                // Vérifier que suggestion est bien une chaîne de caractères
                if (typeof suggestion === 'string') {
                    return (
                    <button
                        key={index}
                        onClick={() => onSuggestionClick(suggestion)}
                        className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600
                                text-gray-700 dark:text-gray-200 text-sm rounded-full py-2 px-4
                                transition-colors whitespace-normal text-left"
                    >
                        {suggestion}
                    </button>
                    );
                }
                return null;
                })}
            </div>
            )}
          </div>
        </div>
      ))}
      
      {/* Indicateur de saisie */}
      {isTyping && (
        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
          <div className="flex space-x-1">
            <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-500 animate-pulse"></div>
            <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-500 animate-pulse delay-75"></div>
            <div className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-500 animate-pulse delay-150"></div>
          </div>
          <span className="text-sm">Sara écrit...</span>
        </div>
      )}
      
      {/* Point de référence pour le défilement automatique */}
      <div ref={messagesEndRef} className="h-1 min-h-[1px] w-full" />
    </div>
  );
};

export default MessageList;