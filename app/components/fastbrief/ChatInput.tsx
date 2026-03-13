"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic } from 'lucide-react';

interface ChatInputProps {
    onSendMessage: (message: string) => void;
    isLoading: boolean;
    disabled?: boolean;
}

export function ChatInput({ onSendMessage, isLoading, disabled }: ChatInputProps) {
    const [input, setInput] = useState('');
    const [isListening, setIsListening] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        // Initialize SpeechRecognition if available
        if (typeof window !== 'undefined') {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            if (SpeechRecognition) {
                const recognition = new SpeechRecognition();
                recognition.continuous = false;
                recognition.interimResults = true;
                recognition.lang = 'fr-FR';

                recognition.onresult = (event: any) => {
                    let finalTranscript = '';
                    let interimTranscript = '';

                    for (let i = event.resultIndex; i < event.results.length; ++i) {
                        if (event.results[i].isFinal) {
                            finalTranscript += event.results[i][0].transcript;
                        } else {
                            interimTranscript += event.results[i][0].transcript;
                        }
                    }

                    // Update input with final/interim. We append to what was already typed.
                    // For simplicity, we just completely replace or append. We will just set it directly
                    // to avoid complex state merging during dictation.
                    // A better way: maintain original input and append.
                    if (finalTranscript || interimTranscript) {
                        // Note: we just overwrite the input with the dictation for ease of use 
                        // or append if user had text. To be safe, we just let it type into the box.
                    }
                };

                // Better implementation:
                recognition.onresult = (event: any) => {
                    const transcript = Array.from(event.results)
                        .map((result: any) => result[0].transcript)
                        .join('');

                    setInput(transcript);
                    if (textareaRef.current) {
                        textareaRef.current.style.height = 'auto';
                        const scrollHeight = textareaRef.current.scrollHeight;
                        textareaRef.current.style.height = Math.min(scrollHeight, 120) + 'px';
                    }
                };

                recognition.onerror = (event: any) => {
                    console.error('Speech recognition error', event.error);
                    setIsListening(false);
                };

                recognition.onend = () => {
                    setIsListening(false);
                };

                recognitionRef.current = recognition;
            }
        }
    }, []);

    const toggleListening = () => {
        if (!recognitionRef.current) {
            alert("Désolé, la dictée vocale n'est pas supportée sur ce navigateur. Utilisez Chrome ou Safari.");
            return;
        }

        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        } else {
            setInput(''); // Clear input before starting new dictation
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (input.trim() && !isLoading && !disabled) {
            onSendMessage(input.trim());
            setInput('');
            // Réinitialiser la hauteur
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInput(e.target.value);
        // Auto-resize
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            const scrollHeight = textareaRef.current.scrollHeight;
            textareaRef.current.style.height = Math.min(scrollHeight, 120) + 'px';
        }
    };

    return (
        <div className="bg-white border-t border-gray-200 px-4 py-3 sm:px-6 w-full z-10">
            <div className="max-w-3xl mx-auto w-full">
                <form onSubmit={handleSubmit} className="flex items-end gap-3 w-full">
                    <textarea
                        ref={textareaRef}
                        value={input}
                        onChange={handleInput}
                        onKeyDown={handleKeyDown}
                        placeholder="Écrivez votre message..."
                        disabled={isLoading || disabled}
                        className="flex-1 max-h-[120px] min-h-[44px] bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-[#0f4c81]/20 focus:border-[#0f4c81] resize-none placeholder-gray-400 disabled:opacity-50 transition-all custom-scrollbar shadow-sm"
                        rows={1}
                    />
                    <button
                        type="button"
                        onClick={toggleListening}
                        disabled={isLoading || disabled}
                        className={`flex-shrink-0 h-[44px] w-[44px] rounded-full flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-sm ${isListening
                            ? 'bg-red-50 text-red-500 hover:bg-red-100 focus:ring-red-200 animate-pulse'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 focus:ring-gray-200 disabled:opacity-50'
                            }`}
                        aria-label="Message vocal"
                    >
                        <Mic size={20} />
                    </button>
                    <button
                        type="submit"
                        disabled={!input.trim() || isLoading || disabled}
                        className="flex-shrink-0 h-[44px] w-[44px] bg-[#0f4c81] text-white rounded-full flex items-center justify-center hover:bg-[#0f4c81]/90 disabled:opacity-50 disabled:hover:bg-[#0f4c81] transition-all focus:outline-none focus:ring-2 focus:ring-[#0f4c81]/20 focus:ring-offset-2 shadow-sm"
                    >
                        <Send size={18} className={input.trim() ? "translate-x-0.5" : ""} />
                    </button>
                </form>

                {/* Easter Egg */}
                <div className="mt-3 text-center">
                    <a
                        href="https://fastbrief.site"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        Propulsé par FastBrief
                    </a>
                </div>
            </div>
        </div>
    );
}
