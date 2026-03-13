import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Diagnostic Beauté - AI',
    description: 'Assistant Stratégique TEKKI Studio'
};

export default function ChatLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="bg-white min-h-screen w-full font-sans antialiased text-gray-900">
            {children}
        </div>
    );
}
