// app/components/global/TekkiChatbot/ChatBubble.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import Image from 'next/image';

interface ChatBubbleProps {
  onClose: () => void;
  onClick: () => void;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ onClose, onClick }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="absolute bottom-20 right-0 min-w-[250px] bg-[#F2F2F2] dark:bg-[#104C81] rounded-xl shadow-lg p-4"
    >
      <button 
        onClick={onClose}
        className="absolute -top-2 -right-2 bg-white dark:bg-[#093861] rounded-full p-1 shadow-md text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400"
        aria-label="Fermer"
      >
        <X className="w-4 h-4" />
      </button>
      <div 
        className="flex items-center space-x-3 cursor-pointer" 
        onClick={onClick}
      >
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
  );
};

export default ChatBubble;