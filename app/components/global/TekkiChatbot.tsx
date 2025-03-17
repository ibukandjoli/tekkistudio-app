// app/components/global/TekkiChatbot.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Loader2, MessageSquare, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import WhatsAppIcon from '../ui/WhatsAppIcon';
import { toast } from 'sonner';

interface Message {
  id: number;
  content: string;
  type: 'assistant' | 'user';
  timestamp: Date;
  context?: {
    page: string;
    url: string;
  };
  suggestions?: string[];
}

interface PageContext {
  page: string;
  url: string;
}

// Questions suggérées initiales
const initialSuggestions = [
  "Je veux acheter un de vos business",
  "Je veux un site e-commerce",
  "Je veux me former en e-commerce",
  "Je veux plus d'infos sur un business"
];

// Fonction pour obtenir un message de bienvenue contextualisé à l'heure
const getWelcomeMessage = (): string => {
  const hour = new Date().getHours();
  let greeting = '';
  
  if (hour >= 5 && hour < 12) {
    greeting = 'Bonjour';
  } else if (hour >= 12 && hour < 18) {
    greeting = 'Bon après-midi';
  } else {
    greeting = 'Bonsoir';
  }

  return `${greeting} 👋🏼 Je suis Sara, Assisante Commerciale chez TEKKI Studio. Comment puis-je vous aider ?`;
};

export default function TekkiChatbot() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [showBubble, setShowBubble] = useState(true);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: getWelcomeMessage(),
      type: 'assistant',
      timestamp: new Date(),
      suggestions: initialSuggestions
    }
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Faire défiler jusqu'au dernier message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Afficher la bulle après un délai
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBubble(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // Récupérer le contexte de la page actuelle
  const getCurrentPageContext = (): PageContext => {
    let pageName = "";
    
    if (pathname === '/') {
      pageName = "Accueil";
    } else if (pathname.startsWith('/business')) {
      pageName = "Business";
    } else if (pathname.startsWith('/formations')) {
      pageName = "Formations";
    } else if (pathname.startsWith('/marques')) {
      pageName = "Marques";
    } else if (pathname.startsWith('/a-propos')) {
      pageName = "À propos";
    } else if (pathname.startsWith('/services/sites-ecommerce')) {
      pageName = "Services";
    } else {
      pageName = pathname.replace('/', '').charAt(0).toUpperCase() + 
                pathname.slice(1).replace('/', ' ');
    }
    
    return {
      page: pageName,
      url: pathname
    };
  };

  // Fonction pour traiter la réponse de l'IA
  const processAIResponse = async (userQuery: string, context: PageContext): Promise<{
    content: string;
    suggestions: string[];
    needs_human: boolean;
  }> => {
    try {
      // Appel à l'API pour obtenir une réponse de l'IA
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userQuery,
          context: context,
          history: messages.slice(-5).map(msg => ({
            role: msg.type === 'user' ? 'user' : 'assistant',
            content: msg.content
          }))
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la communication avec l\'API');
      }

      const data = await response.json();
      return {
        content: data.content,
        suggestions: data.suggestions || [],
        needs_human: data.needs_human || false
      };
    } catch (error) {
      console.error('Erreur:', error);
      // Réponse de secours en cas d'erreur
      return {
        content: "Je suis désolé, je rencontre des difficultés techniques. Pourriez-vous reformuler votre question ou contacter directement notre équipe sur WhatsApp ?",
        suggestions: ["Contacter le service client", "Retour à l'accueil", "Voir nos business"],
        needs_human: true
      };
    }
  };

  // Ouvrir WhatsApp
  const openWhatsApp = () => {
    // Numéro WhatsApp au format international
    window.open('https://wa.me/221781362728?text=Bonjour%20TEKKI%20Studio,%20j%27ai%20une%20question%20spécifique%20à%20vous%20poser.%20Puis-je%20parler%20à%20un%20une%20vraie%20personne?', '_blank');
  };

  // Envoyer un message
  const sendMessage = async (messageContent: string) => {
    if (!messageContent.trim()) return;
  
    const context = getCurrentPageContext();
    
    // Créer le message utilisateur
    const userMessage: Message = {
      id: Date.now(),
      content: messageContent,
      type: 'user',
      timestamp: new Date(),
      context: context
    };
  
    try {
      setMessages(prev => [...prev, userMessage]);
      setMessage('');
      setIsTyping(true);
  
      // Si c'est une demande de contact direct
      if (messageContent.toLowerCase().includes('contacter le service client') || 
          messageContent.toLowerCase().includes('parler à un conseiller')) {
        setTimeout(() => {
          const contactMessage: Message = {
            id: Date.now() + 1,
            content: "Vous pouvez contacter notre équipe directement sur WhatsApp. Un conseiller vous répondra dans les plus brefs délais.",
            type: 'assistant',
            timestamp: new Date(),
            suggestions: ["Ouvrir WhatsApp", "Revenir aux questions"]
          };
          
          setMessages(prev => [...prev, contactMessage]);
          setIsTyping(false);
        }, 1000);
        return;
      }
  
      // Traiter la réponse de l'IA
      const aiResponse = await processAIResponse(messageContent, context);
  
      // Créer le message de l'assistant
      const assistantMessage: Message = {
        id: Date.now() + 1,
        content: aiResponse.content,
        type: 'assistant',
        timestamp: new Date(),
        context: context,
        suggestions: aiResponse.suggestions
      };
  
      setMessages(prev => [...prev, assistantMessage]);
  
      // Si la réponse indique qu'un humain est nécessaire
      if (aiResponse.needs_human && !aiResponse.suggestions.includes("Contacter le service client")) {
        setTimeout(() => {
          const humanSuggestionMessage: Message = {
            id: Date.now() + 2,
            content: "Souhaitez-vous être mis en relation avec notre équipe pour une réponse plus précise?",
            type: 'assistant',
            timestamp: new Date(),
            suggestions: ["Contacter le service client", "Non merci, continuer"]
          };
          
          setMessages(prev => [...prev, humanSuggestionMessage]);
        }, 1500);
      }
  
      // Sauvegarde dans Supabase
      try {
        await supabase
          .from('chat_conversations')
          .insert([{
            user_message: messageContent,
            assistant_response: aiResponse.content,
            page: context.page,
            url: context.url,
            needs_human: aiResponse.needs_human,
            created_at: new Date().toISOString()
          }]);
      } catch (supabaseError) {
        // Ignorer silencieusement les erreurs de sauvegarde
        console.warn('Message non sauvegardé:', supabaseError);
      }
    } catch (error) {
      console.error('Error processing message:', error);
      
      const errorMessage: Message = {
        id: Date.now() + 1,
        content: "Je suis désolé, je rencontre des difficultés techniques. Pourriez-vous reformuler votre question ou contacter notre équipe directement ?",
        type: 'assistant',
        timestamp: new Date(),
        suggestions: ["Contacter le service client", "Réessayer"]
      };
  
      setMessages(prev => [...prev, errorMessage]);
      
      toast("Quelque chose s'est mal passé. Réessayez ou contactez-nous directement.", {
        description: "Oups !",
      });
    } finally {
      setIsTyping(false);
    }
  };

  // Fonction pour gérer les clics sur les suggestions
  const handleSuggestionClick = (suggestion: string) => {
    if (suggestion === "Ouvrir WhatsApp") {
      openWhatsApp();
      return;
    }
    
    if (suggestion === "Contacter le service client") {
      openWhatsApp();
      return;
    }
    
    if (suggestion === "Retour à l'accueil") {
      window.location.href = "/";
      return;
    }
    
    if (suggestion === "Voir nos business") {
      window.location.href = "/business";
      return;
    }
    
    if (suggestion === "Non merci, continuer") {
      return;
    }
    
    // Pour les autres suggestions, envoyer comme message
    sendMessage(suggestion);
  };

  // Envoyer le message
  const handleSendMessage = async () => {
    if (message.trim()) {
      await sendMessage(message);
    }
  };

  return (
    <>
      {/* Bouton flottant avec bulle de message */}
      {!isOpen && (
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
                onClick={() => setShowBubble(false)}
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

          {/* Bouton */}
          <button
            onClick={() => {
              setIsOpen(true);
              setShowBubble(false);
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
      )}

      {/* Interface de chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 w-[350px] md:w-[400px] h-[600px] bg-[#F2F2F2] dark:bg-gray-800 rounded-2xl shadow-xl flex flex-col overflow-hidden border dark:border-gray-700 z-50"
          >
            {/* Header */}
            <div className="p-4 bg-[#0f4c81] text-white">
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
                {/* Bouton WhatsApp avec logo officiel */}
                <button
                    onClick={openWhatsApp}
                    className="flex items-center justify-center w-8 h-8 bg-[#25D366] hover:bg-[#20ba5a] rounded-full transition-colors"
                    aria-label="Contacter sur WhatsApp"
                    title="Parler à un conseiller"
                >
                    <WhatsAppIcon size={16} className="text-white" />
                </button>
                <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    aria-label="Fermer"
                >
                    <X className="w-5 h-5" />
                </button>
                </div>
            </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      <p className="text-[10px] mt-1 text-gray-500 dark:text-gray-400">
                        {msg.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>

                    {/* Suggestions cliquables */}
                    {msg.type === 'assistant' && msg.suggestions && msg.suggestions.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {msg.suggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="px-3 py-1.5 text-xs bg-[#F2F2F2] dark:bg-gray-600 
                                     rounded-full border border-gray-200 dark:border-gray-500
                                     hover:bg-gray-50 dark:hover:bg-gray-500
                                     transition-colors text-gray-700 dark:text-gray-200"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
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
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white dark:bg-gray-800 border-t dark:border-gray-700">
              <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 rounded-full p-2 pl-4 border dark:border-gray-600">
                <input
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
    </>
  );
}