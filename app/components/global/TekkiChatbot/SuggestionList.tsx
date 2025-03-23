// app/components/global/TekkiChatbot/SuggestionList.tsx
import React from 'react';

interface SuggestionListProps {
  suggestions: string[];
  isMobile: boolean;
  onSuggestionClick: (suggestion: string) => void;
}

const SuggestionList: React.FC<SuggestionListProps> = ({
  suggestions,
  isMobile,
  onSuggestionClick
}) => {
  // Afficher tous les suggestions, pas seulement la première
  console.log("SuggestionList reçoit:", suggestions);
  
  return (
    <div className="flex flex-wrap gap-2">
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          onClick={() => onSuggestionClick(suggestion)}
          className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600
                    text-gray-700 dark:text-gray-200 text-sm rounded-full py-2 px-4
                    transition-colors whitespace-normal text-left"
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
};

export default SuggestionList;