// app/components/global/TekkiChatbot/ChatContainer.tsx
import React, { useState, useRef } from 'react';
import { X, Send, Loader2, ArrowDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import WhatsAppIcon from '../../ui/WhatsAppIcon';

import ChatBubble from './ChatBubble';
import MessageList from './MessageList';
import { Message } from './types';

interface ChatContainerProps {
    isOpen: boolean;
    showBubble: boolean;
    isMobileDevice: boolean;
    isIOSDevice: boolean;
    messages: Message[];
    isTyping: boolean;
    userScrolling: boolean;
    messagesContainerRef: React.RefObject<HTMLDivElement>; 
    messagesEndRef: React.RefObject<HTMLDivElement>; 
    onSetOpen: (isOpen: boolean) => void;
    onSetShowBubble: (showBubble: boolean) => void;
    onSendMessage: (message: string) => void;
    onSuggestionClick: (suggestion: string) => void;
    onOpenWhatsApp: () => void;
    onScrollToBottom: (force?: boolean) => void;
  }

const ChatContainer: React.FC<ChatContainerProps> = ({
  isOpen,
  showBubble,
  isMobileDevice,
  isIOSDevice,
  messages,
  isTyping,
  userScrolling,
  onSetOpen,
  onSetShowBubble,
  onSendMessage,
  onSuggestionClick,
  onOpenWhatsApp,
  onScrollToBottom
}) => {
  const [message, setMessage] = useState('');
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  
  const messageInputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Gérer l'envoi du message
  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  // Si le chatbot est fermé, afficher seulement le bouton flottant avec la bulle
  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        {/* Bulle de message */}
        {showBubble && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-20 right-0 min-w-[250px] bg-[#F2F2F2] dark:bg-[#104C81] rounded-xl shadow-lg p-4"
          >
            <button 
              onClick={() => onSetShowBubble(false)}
              className="absolute -top-2 -right-2 bg-white dark:bg-[#093861] rounded-full p-1 shadow-md text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400"
              aria-label="Fermer"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="bg-[#FF7F50] rounded-full">
                <Image 
                  src="/images/logos/fav_tekki.svg" 
                  alt="TEKKI Studio" 
                  width={40} 
                  height={40}
                />
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                Besoin d'aide ? Je suis là !
              </p>
            </div>
          </motion.div>
        )}

        {/* Bouton d'ouverture */}
        <button
          onClick={() => {
            onSetOpen(true);
            onSetShowBubble(false);
          }}
          className="bg-[#FF7F50] text-white rounded-full shadow-lg hover:bg-[#FF7F50]/90 transition-all w-16 h-16 flex items-center justify-center"
          aria-label="Ouvrir le chat"
        >
          <Image 
            src="/images/logos/fav_tekki.svg" 
            alt="TEKKI Studio" 
            width={40} 
            height={40}
          />
        </button>
      </div>
    );
  }

  // Rendu différent pour mobile et desktop
  return (
    <AnimatePresence>
      {isMobileDevice ? (
        // Version Mobile (plein écran)
        <motion.div
        ref={chatContainerRef}
        initial={{ opacity: 0, y: '100%' }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: '100%' }}
        className="fixed inset-0 z-[9998] flex flex-col bg-[#F2F2F2] dark:bg-gray-800 tekki-chatbot-mobile"
        style={{
            width: '100vw',
            maxWidth: '100%',
            overflow: 'hidden',
            paddingBottom: 'env(safe-area-inset-bottom, 80px)',
        }}
        >
          {/* Header - reste fixe */}
          <div className="p-4 bg-[#0f4c81] text-white sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-[#FF7F50] rounded-full p-1">
                  <Image 
                    src="/images/logos/fav_tekki.svg" 
                    alt="TEKKI Studio" 
                    width={30} 
                    height={30}
                  />
                </div>
                <div>
                  <h3 className="font-semibold">Sara de TEKKI Studio</h3>
                  <p className="text-sm text-white/80">
                    Assistante Commerciale
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* Bouton WhatsApp */}
                <button
                  onClick={onOpenWhatsApp}
                  className="flex items-center justify-center w-8 h-8 bg-[#25D366] hover:bg-[#20ba5a] rounded-full transition-colors"
                  aria-label="Contacter sur WhatsApp"
                  title="Parler à un conseiller"
                >
                  <WhatsAppIcon size={16} className="text-white" />
                </button>
                
                {/* Bouton de fermeture */}
                <button
                  onClick={() => onSetOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  aria-label="Fermer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Messages - avec défilement */}
          <MessageList 
            messages={messages}
            isTyping={isTyping}
            isMobileDevice={isMobileDevice}
            messagesContainerRef={messagesContainerRef}
            messagesEndRef={messagesEndRef}
            keyboardOpen={keyboardOpen}
            onSuggestionClick={onSuggestionClick}
          />

          {/* Bouton "Retour en bas" */}
          {userScrolling && (
            <button
              onClick={() => onScrollToBottom(true)}
              className="fixed bottom-20 right-4 bg-[#0f4c81] text-white rounded-full p-2 shadow-lg z-30"
            >
              <ArrowDown className="h-5 w-5" />
            </button>
          )}

          {/* Input */}
          <div 
            className="p-4 bg-white dark:bg-gray-800 border-t dark:border-gray-700 sticky bottom-0 left-0 right-0 z-30 input-container"
            style={{
              width: '100%',
              maxWidth: '100vw',
              boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.05)',
              paddingBottom: 'calc(env(safe-area-inset-bottom, 16px) + 16px)', 
              marginBottom: 0,
            }}
          >
            <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 rounded-full p-2 pl-4 border dark:border-gray-600">
              <input
                ref={messageInputRef}
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Posez votre question..."
                className="flex-1 bg-transparent text-sm text-gray-600 dark:text-gray-300 focus:outline-none border-none"
                style={{
                  width: '100%',
                  minWidth: 0,
                }}
              />
              <button
                onClick={handleSendMessage}
                disabled={!message.trim() || isTyping}
                className={`rounded-full p-2 flex-shrink-0 ${
                  message.trim() && !isTyping
                    ? "bg-[#0f4c81] text-white hover:bg-[#0f4c81]/90"
                    : "bg-gray-100 dark:bg-gray-600 text-gray-400 dark:text-gray-500"
                }`}
                aria-label="Envoyer"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <div className="text-center mt-2">
              <p className="text-[12px] text-gray-400 dark:text-gray-500">
                Chatbot IA créé par{" "}
                <a
                  href="https://getdukka.com"
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="font-bold text-[#066AC3] hover:underline"
                >
                  Dukka
                </a> 
              </p>
            </div>
          </div>
        </motion.div>
      ) : (
        // Version Desktop (fenêtre flottante)
        <motion.div
          ref={chatContainerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-6 right-6 w-[350px] md:w-[400px] h-[600px] z-[9999] flex flex-col bg-[#F2F2F2] dark:bg-gray-800 rounded-2xl shadow-xl border dark:border-gray-700"
        >
          {/* Header */}
          <div className="p-4 bg-[#0f4c81] text-white rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-[#FF7F50] rounded-full p-1">
                  <Image 
                    src="/images/logos/fav_tekki.svg" 
                    alt="TEKKI Studio" 
                    width={30} 
                    height={30}
                  />
                </div>
                <div>
                  <h3 className="font-semibold">Sara de TEKKI Studio</h3>
                  <p className="text-sm text-white/80">
                    Assistante Commerciale
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* Bouton WhatsApp */}
                <button
                  onClick={onOpenWhatsApp}
                  className="flex items-center justify-center w-8 h-8 bg-[#25D366] hover:bg-[#20ba5a] rounded-full transition-colors"
                  aria-label="Contacter sur WhatsApp"
                  title="Parler à un conseiller"
                >
                  <WhatsAppIcon size={16} className="text-white" />
                </button>
                
                {/* Bouton de fermeture */}
                <button
                  onClick={() => onSetOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  aria-label="Fermer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Messages */}
          <MessageList 
            messages={messages}
            isTyping={isTyping}
            isMobileDevice={false}
            messagesContainerRef={messagesContainerRef}
            messagesEndRef={messagesEndRef}
            keyboardOpen={false}
            onSuggestionClick={onSuggestionClick}
          />

          {/* Input */}
          <div className="p-4 bg-white dark:bg-gray-800 border-t dark:border-gray-700 rounded-b-2xl">
            <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 rounded-full p-2 pl-4 border dark:border-gray-600">
              <input
                ref={messageInputRef}
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Posez votre question..."
                className="flex-1 bg-transparent text-sm text-gray-600 dark:text-gray-300 focus:outline-none border-none"
              />
              <button
                onClick={handleSendMessage}
                disabled={!message.trim() || isTyping}
                className={`rounded-full p-2 ${
                  message.trim() && !isTyping
                    ? "bg-[#0f4c81] text-white hover:bg-[#0f4c81]/90"
                    : "bg-gray-100 dark:bg-gray-600 text-gray-400 dark:text-gray-500"
                }`}
                aria-label="Envoyer"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <div className="text-center mt-2">
              <p className="text-[12px] text-gray-400 dark:text-gray-500">
                Chatbot IA créé par{" "}
                <a
                  href="https://getdukka.com"
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="font-bold text-[#066AC3] hover:underline"
                >
                  Dukka
                </a> 
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatContainer;