import React from 'react';
import { ChatContainer } from '@/app/components/diagnostic/ChatContainer';

export const metadata = {
    title: 'Diagnostic E-commerce | TEKKI Studio',
    description: "Auditez votre modèle de vente et transformez votre marque en une machine de vente autonome.",
};

export default function DiagnosticPage() {
    return (
        <main className="min-h-screen bg-gray-50 flex flex-col">
            <ChatContainer />
        </main>
    );
}
