"use client";

import React, { useState, useEffect } from 'react';
import { MessageList } from '../fastbrief/MessageList';
import { ChatInput } from '../fastbrief/ChatInput';
import { ChatMessage } from '../fastbrief/MessageBubble';
import { X } from 'lucide-react';
import Image from 'next/image';

// Pour que TypeScript accepte window.fbq
declare global {
    interface Window {
        fbq: (method: "track" | "init" | "trackCustom", eventName: string, params?: Record<string, any>) => void;
    }
}

const INITIAL_MESSAGE: ChatMessage = {
    id: 'msg-init-1',
    role: 'assistant',
    content: "Bonjour ! Je suis l'assistant IA de TEKKI Studio. Notre but est de transformer votre marque en une machine de vente autonome. Mais avant ça, j'ai besoin d'auditer votre modèle. Cela prend 3 minutes. Pour commencer, quel est le nom de votre marque et que vendez-vous exactement (chaussures, jeux, accessoires...) ?"
};

export function ChatContainer() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const sessionStartTime = React.useRef<number>(0);

    useEffect(() => {
        // Initiation du chat après un petit délai pour l'effet "typing"
        const initChat = async () => {
            setIsLoading(true);
            await new Promise(resolve => setTimeout(resolve, 1500));
            setMessages([INITIAL_MESSAGE]);
            setIsLoading(false);
            setHasStarted(true);
            sessionStartTime.current = Date.now();
        };

        if (!hasStarted) {
            initChat();
        }
    }, [hasStarted]);

    const handleSendMessage = async (content: string) => {
        const userMessage: ChatMessage = {
            id: `msg-user-${Date.now()}`,
            role: 'user',
            content
        };

        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setIsLoading(true);

        try {
            const response = await fetch('/api/diagnostic-assistant', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    // exclude the initial greeting or keep it? The prompt says "Étape 1 - Accueil : (Ce message doit être généré dès l'ouverture).". It's better to send the whole history.
                    messages: newMessages.map(m => ({ role: m.role, content: m.content }))
                })
            });

            if (!response.ok) {
                throw new Error('API Error');
            }

            const data = await response.json();

            const gptMessage: ChatMessage = {
                id: `msg-ast-${Date.now()}`,
                role: 'assistant',
                content: data.content
            };

            const fullHistory = [...newMessages, gptMessage];
            setMessages(fullHistory);

            // Vérification de la fin de l'interview (Étape 6)
            const contentStr = data.content.toLowerCase();
            if (contentStr.includes("notre équipe vous contacte")) {
                const session_duration_seconds = Math.floor((Date.now() - sessionStartTime.current) / 1000);

                fetch('/api/diagnostic-assistant/save-lead', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        messages: fullHistory,
                        session_duration_seconds
                    })
                })
                    .then(async (res) => {
                        if (res.ok) {
                            setIsSuccess(true);
                            try {
                                if (typeof window !== 'undefined' && window.fbq) {
                                    window.fbq('track', 'Lead');
                                }
                            } catch (e) {
                                console.error("Erreur Pixel Meta:", e);
                            }
                        } else {
                            console.error("Erreur serveur Webhook:", await res.text());
                        }
                    })
                    .catch(e => console.error("Erreur Fetch Webhook:", e));
            }
        } catch (error) {
            console.error(error);
            const errorMessage: ChatMessage = {
                id: `msg-err-${Date.now()}`,
                role: 'assistant',
                content: "Un instant, je rassemble mes notes..."
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-gray-100/80 flex justify-center">
            <div className="w-full max-w-3xl h-[100dvh] bg-[#f9fafb] flex flex-col relative shadow-xl sm:border-x border-gray-200/60">
                {/* Header */}
                <div className="flex-shrink-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between z-10 w-full">
                    <div className="flex items-center gap-3 w-full">
                        <div className="h-10 w-10 relative bg-[#0f4c81]/5 rounded-full flex items-center justify-center overflow-hidden">
                            <Image
                                src="/images/logos/tekki-large.png"
                                alt="TEKKI Studio"
                                width={40}
                                height={40}
                                className="object-cover w-full h-full"
                            />
                        </div>
                        <div className="flex-1">
                            <h1 className="text-[15px] font-semibold text-gray-900 leading-tight">TEKKI Studio</h1>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                <p className="text-[12px] text-gray-500 font-medium">Assistant Stratégique</p>
                            </div>
                        </div>
                        <a
                            href="https://tekkistudio.com"
                            title="Quitter et retourner à l'accueil"
                            className="h-8 w-8 flex items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-gray-600 rounded-full transition-colors flex-shrink-0"
                        >
                            <X size={18} className="text-gray-400 hover:text-gray-600" />
                        </a>
                    </div>
                </div>

                {/* Main Chat Area */}
                <MessageList messages={messages} isTyping={isLoading && hasStarted} />

                {/* Input Area */}
                <div className="flex-shrink-0 relative">
                    <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} disabled={isSuccess} />

                    {isSuccess && (
                        <div className="absolute top-0 left-0 right-0 -mt-10 flex justify-center pointer-events-none">
                            <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium shadow-sm flex items-center gap-2 border border-green-200 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                Dossier transmis en toute sécurité ✅
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
