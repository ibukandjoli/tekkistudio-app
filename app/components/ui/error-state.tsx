// app/components/ui/error-state.tsx
import React from 'react';

interface ErrorStateProps {
  message?: string;
  retry?: () => void;
}

export default function ErrorState({ message = "Une erreur est survenue", retry }: ErrorStateProps) {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="space-y-4 text-center">
        <svg
          className="w-16 h-16 text-red-500 mx-auto"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <p className="text-gray-600">{message}</p>
        {retry && (
          <button
            onClick={retry}
            className="text-[#ff7f50] hover:text-[#ff6b3d] font-medium"
          >
            Réessayer
          </button>
        )}
      </div>
    </div>
  );
}