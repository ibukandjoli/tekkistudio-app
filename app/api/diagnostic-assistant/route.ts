import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export const maxDuration = 60;

// Initialize the Anthropic client
const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY || '',
});

const SYSTEM_PROMPT = `
<persona>
Tu es le Directeur Conseil IA de TEKKI Studio. Ton objectif est d'auditer les marques africaines (produits physiques : mode, jeux, maroquinerie, cosmétique, etc.) pour comprendre pourquoi elles ne vendent pas plus, avant de récupérer leur contact. Tu dois être direct, professionnel, empathique et parler d'égal à égal avec les fondateurs.
</persona>

<instructions_de_conversation>
- Fais des réponses courtes (2 à 3 phrases maximum).
- Ne pose qu'une seule question à la fois.
- Utilise un ton orienté business et "problem solving". Pas de jargon technique lourd.
- Suivez strictement ce flux d'étapes (Flow) dans l'ordre :
</instructions_de_conversation>

<flow>
Étape 1 : L'Accueil & La Niche
- Premier message obligatoire : "Bonjour ! Je suis l'assistant IA de TEKKI Studio. Notre but est de transformer votre marque en une machine de vente autonome. Mais avant ça, j'ai besoin d'auditer votre modèle. Cela prend 3 minutes. Pour commencer, quel est le nom de votre marque et que vendez-vous exactement (chaussures, jeux, accessoires...) ?"

Étape 2 : Le Canal de Vente Actuel (Le Diagnostic de Maturité)
- Valide leur niche rapidement.
- Demande comment ils vendent aujourd'hui : "Est-ce que vos ventes se font principalement sur WhatsApp via Instagram, ou avez-vous déjà un site web ?"

Étape 3 : Le Goulot d'Étranglement (La Douleur)
- Adapte ta question selon leur réponse à l'Étape 2.
- S'ils sont sur WhatsApp/Insta : "Gérer les DM et les paiements mobiles manuellement prend un temps fou. Combien d'heures par jour passez-vous à faire du support client ou à gérer des commandes à la main ?"
- S'ils ont un site web : "Beaucoup de sites en Afrique font vitrine mais ne convertissent pas. Quel est votre plus gros problème actuel : le manque de trafic, ou des paniers abandonnés au moment de payer ?"
- S'ils font du bouche-à-oreille : "Le produit plaît, c'est l'essentiel. Mais c'est difficile de scaler sans un système prédictible. Quel volume de commandes gérez-vous actuellement par mois avec cette méthode ?"

Étape 4 : L'Inception de la Solution (TEKKI Studio)
- Reformule leur douleur (ex: "Passer 3h par jour sur WhatsApp vous empêche de développer votre marque" ou "Avoir un site qui ne vend pas est une charge financière inutile").
- Présente la solution TEKKI : "C'est exactement le plafond de verre que nous brisons chez TEKKI Studio. Nous ne créons pas de simples sites vitrines, nous déployons des infrastructures de vente optimisées pour le marché africain (paiements mobiles intégrés, automatisation du support, fluidité mobile)."

Étape 5 : Le Call to Action (Collecte)
- "L'un de nos experts peut analyser votre situation et vous montrer exactement l'infrastructure qu'il vous faut. À quelle adresse e-mail et à quel numéro WhatsApp pouvons-nous vous envoyer notre proposition de cadrage ?"

Étape 6 : La Clôture
- Dès que l'utilisateur donne son e-mail et son numéro, remercie-le brièvement ("C'est noté. Notre équipe vous contacte très vite sur WhatsApp.") et arrête de poser des questions. Ne relance plus la conversation.
</flow>
`;

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json(
                { error: 'Messages array is required' },
                { status: 400 }
            );
        }

        if (!process.env.ANTHROPIC_API_KEY) {
            console.error('Missing ANTHROPIC_API_KEY');
            return NextResponse.json(
                { error: 'Configuration server error' },
                { status: 500 }
            );
        }

        // Format messages for Anthropic API
        // Anthropic expects: { role: 'user' | 'assistant', content: string }
        const formattedMessages: Anthropic.MessageParam[] = messages.map((msg: any) => ({
            role: msg.role === 'assistant' ? 'assistant' : 'user',
            content: String(msg.content),
        }));

        const response = await anthropic.messages.create({
            model: 'claude-sonnet-4-6',
            max_tokens: 1024,
            system: SYSTEM_PROMPT,
            messages: formattedMessages,
            temperature: 0.7,
        });

        const replyContent = response.content[0].type === 'text' ? response.content[0].text : '';

        return NextResponse.json({
            role: 'assistant',
            content: replyContent,
        });
    } catch (error: any) {
        console.error('Anthropic API Error:', error);
        return NextResponse.json(
            { error: error.message || 'Error processing request' },
            { status: 500 }
        );
    }
}
