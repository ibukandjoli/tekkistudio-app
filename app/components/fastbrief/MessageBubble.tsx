"use client";

import React, { useState, useEffect, useRef } from 'react';
import { User, Send, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export type MessageRole = 'assistant' | 'user';

export interface ChatMessage {
    id: string;
    role: MessageRole;
    content: string;
    isStreaming?: boolean;
}

interface MessageBubbleProps {
    message: ChatMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
    const isAssistant = message.role === 'assistant';

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex w-full mb-4 ${isAssistant ? 'justify-start' : 'justify-end'}`}
        >
            <div className={`flex max-w-[85%] sm:max-w-[75%] ${isAssistant ? 'flex-row' : 'flex-row-reverse'} items-end gap-2`}>
                {/* Avatar */}
                <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center overflow-hidden ${isAssistant ? 'bg-[#0f4c81]/5 border border-[#0f4c81]/10' : 'bg-[#0f4c81] text-white'
                    }`}>
                    {isAssistant ? (
                        <Image
                            src="/images/logos/tekki-large.png"
                            alt="TEKKI"
                            width={20}
                            height={20}
                            className="object-contain"
                        />
                    ) : <User size={16} />}
                </div>

                {/* Bubble */}
                <div
                    className={`px-4 py-3 rounded-2xl text-[15px] leading-relaxed shadow-sm ${isAssistant
                        ? 'bg-white border border-gray-100 text-gray-800 rounded-bl-sm'
                        : 'bg-[#0f4c81] text-white rounded-br-sm'
                        }`}
                >
                    {message.content}
                    {message.isStreaming && (
                        <span className="inline-block w-1.5 h-4 ml-1 align-middle bg-[#0f4c81] animate-pulse" />
                    )}
                </div>
            </div>
        </motion.div>
    );
}
