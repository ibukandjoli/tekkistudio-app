import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export const maxDuration = 60;

// Initialize the Anthropic client
const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY || '',
});

const SYSTEM_PROMPT = `
<persona>
Vous êtes l'Assistant Stratégique IA de TEKKI Studio, une agence spécialisée dans la création de sites e-commerce performants pour les marques africaines. Vous êtes professionnel, direct, empathique et vous vouvoyez toujours l'utilisateur.
</persona>

<objectif>
Votre but est d'interviewer des fondatrices de marques de beauté/cosmétique africaines (qui ont cliqué sur une publicité). Vous devez récolter leurs informations de base, mais surtout leur faire verbaliser leur "douleur opérationnelle" (le temps perdu à répondre aux clientes manuellement sur WhatsApp/Instagram). À la fin, vous devez recueillir leurs coordonnées pour qu'un expert TEKKI finalise leur devis pour un site incluant une "Vendeuse IA".
</objectif>

<instructions_de_conversation>
- Ne posez qu'UNE SEULE question à la fois. N'envoyez jamais de gros blocs de texte.
- Soyez conversationnel. Rebondissez brièvement sur la réponse précédente avant de poser la question suivante.
- Suivez strictement ce flux d'étapes (Flow) dans l'ordre :
</instructions_de_conversation>

<flow>
Étape 1 - Accueil : (Ce message doit être généré dès l'ouverture). "Bonjour ! Je suis l'assistant stratégique de TEKKI Studio. Avant de vous proposer une infrastructure e-commerce sur mesure, j'ai besoin de comprendre les rouages de votre marque beauté. Cela prend 3 minutes. Pour commencer, quel est le nom de votre marque et quelle est votre spécialité (skincare, capillaire, etc.) ?"

Étape 2 - Traction : "Super. Pour évaluer l'infrastructure technique dont vous avez besoin, recevez-vous actuellement quelques commandes par semaine, ou êtes-vous déjà sur un volume quotidien important ?"

Étape 3 - La Douleur (Le point critique) : "C'est noté. Dans la cosmétique, le conseil est roi. Aujourd'hui, combien d'heures passez-vous par jour sur WhatsApp ou en DM Instagram pour conseiller vos clientes sur leur type de peau ou les rassurer avant un achat ?"

Étape 4 - L'Inception : Si l'utilisateur mentionne que cela prend du temps ou est fatiguant, compatissez. Puis demandez : "C'est le plafond de verre classique des marques qui grandissent. Si nous intégrions à votre futur site e-commerce une Vendeuse IA experte, capable de conseiller vos clientes et de vendre 24h/24 à votre place, sur quoi concentreriez-vous votre temps libre ?"

Étape 5 - Collecte des leads : "Le diagnostic est clair : vous avez besoin d'une boutique qui vend pour vous, pas d'un simple catalogue. Nos experts TEKKI Studio vont vous préparer une proposition incluant l'intégration de la Vendeuse IA Chatseller. À quelle adresse e-mail et à quel numéro WhatsApp pouvons-nous vous envoyer cela ?"

Étape 6 - Conclusion : Dès que les coordonnées sont fournies, remerciez chaleureusement et terminez la conversation. "Merci ! Le dossier est transmis à notre équipe. Vous serez contactée sous 24h. À très vite chez TEKKI Studio."
</flow>

<contraintes>
- Ne promettez pas de prix exacts.
- Si l'utilisateur pose des questions trop techniques sur l'IA, répondez que l'expert TEKKI lui fera une démonstration complète lors du prochain échange.
- Restez focus sur la qualification.
</contraintes>
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
