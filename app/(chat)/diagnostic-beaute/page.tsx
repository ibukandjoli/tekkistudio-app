export const fetchCache = 'force-no-store';
export const dynamic = 'force-dynamic';

import React from 'react';
import { ChatContainer } from '../../components/fastbrief/ChatContainer';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Diagnostic Beauté - TEKKI Studio',
    description: 'Évaluez vos besoins en infrastructure e-commerce avec notre Assistant IA.',
    robots: { index: false, follow: false }
};

export default function DiagnosticBeautePage() {
    return (
        <main className="h-screen w-full bg-gray-50 overflow-hidden">
            <ChatContainer />
        </main>
    );
}
