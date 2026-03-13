"use client";

import React, { useEffect, useRef } from 'react';
import { MessageBubble, ChatMessage } from './MessageBubble';
import { motion } from 'framer-motion';

interface MessageListProps {
    messages: ChatMessage[];
    isTyping: boolean;
}

export function MessageList({ messages, isTyping }: MessageListProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    return (
        <div className="flex-1 overflow-y-auto px-4 py-8 bg-[#f9fafb] w-full">
            <div className="max-w-3xl mx-auto w-full flex flex-col">
                {messages.map((message) => (
                    <MessageBubble key={message.id} message={message} />
                ))}

                {isTyping && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex w-full mb-4 justify-start"
                    >
                        <div className="flex max-w-[85%] sm:max-w-[75%] flex-row items-end gap-2">
                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-[#0f4c81]/10 text-[#0f4c81] flex items-center justify-center shadow-sm">
                                <span className="flex space-x-1">
                                    <span className="w-1.5 h-1.5 bg-[#0f4c81]/60 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                    <span className="w-1.5 h-1.5 bg-[#0f4c81]/60 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                    <span className="w-1.5 h-1.5 bg-[#0f4c81]/60 rounded-full animate-bounce"></span>
                                </span>
                            </div>
                        </div>
                    </motion.div>
                )}
                <div ref={messagesEndRef} className="h-8" />
            </div>
        </div>
    );
}
