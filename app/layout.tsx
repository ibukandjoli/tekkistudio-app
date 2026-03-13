import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'TEKKI Studio',
    description: 'Fabrique de Marques E-commerce Africaines'
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="fr" suppressHydrationWarning={true}>
            <body>
                {children}
            </body>
        </html>
    );
}
