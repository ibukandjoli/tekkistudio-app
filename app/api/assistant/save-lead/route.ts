import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { messages, session_duration_seconds } = body;

        console.log("=== NOUVEAU LEAD FASTBRIEF : DEBUT EXTRACTION ===");

        // 1. Appel LLM caché pour extraire et nettoyer les données
        const transcript = messages.map((m: any) => `${m.role.toUpperCase()}: ${m.content}`).join('\n\n');

        const systemPrompt = `
Tu es un assistant d'extraction de données ultra-précis.
Analyse la transcription d'une conversation entre un ASSISTANT et un USER, et extrais les informations sous format JSON strict.

Instructions cruciales :
- brand_name: Le nom de la marque.
- niche: La spécialité (skincare, capillaire, etc).
- contact_email: L'adresse email.
- contact_whatsapp: Le numéro de téléphone. ATTENTION MAXIMALE : S'il y a un numéro, tu dois OBLIGATOIREMENT le formater au format international strict (ex: +33612345678, +221771234567). Supprime tous les espaces, tirets ou parenthèses. Si le code pays manque, essaie de le deviner ou laisse les chiffres tels quels sans aucun espace.
- traction_level: Le niveau de commandes actuel.
- pain_point_hours: Le temps estimé passé par jour sur WhatsApp/Instagram.
- pain_point_summary: Rédige une synthèse de la douleur opérationnelle en UNE SEULE PHRASE claire.

Reponds UNIQUEMENT avec un objet JSON valide, sans balises GFM, sans texte avant ou après.
Exemple de structure:
{
  "brand_name": "",
  "niche": "",
  "contact_email": "",
  "contact_whatsapp": "",
  "traction_level": "",
  "pain_point_hours": "",
  "pain_point_summary": ""
}
`;

        const response = await anthropic.messages.create({
            model: 'claude-sonnet-4-6',
            max_tokens: 1024,
            system: systemPrompt,
            messages: [{ role: 'user', content: transcript }],
            temperature: 0,
        });

        const replyContent = response.content[0].type === 'text' ? response.content[0].text : '{}';

        let extractedData = {};
        try {
            const cleanedJsonStr = replyContent.replace(/```json/g, '').replace(/```/g, '').trim();
            extractedData = JSON.parse(cleanedJsonStr);
        } catch (parseError) {
            console.error("Erreur parsing JSON Anthropic:", replyContent);
            // On continue avec un objet vide s'il y a une erreur
        }

        const typedData = extractedData as any;

        // 2. Construction du Payload Webhook
        const payload = {
            lead_info: {
                brand_name: typedData.brand_name || "",
                niche: typedData.niche || "",
                contact_email: typedData.contact_email || "",
                contact_whatsapp: typedData.contact_whatsapp || ""
            },
            business_context: {
                traction_level: typedData.traction_level || "",
                pain_point_hours: typedData.pain_point_hours || "",
                pain_point_summary: typedData.pain_point_summary || ""
            },
            raw_data: {
                full_transcript: messages,
                session_duration_seconds: session_duration_seconds || 0,
                timestamp: new Date().toISOString()
            }
        };

        console.log("Payload généré :", JSON.stringify(payload, null, 2));

        // 3. Envoi au Webhook Make
        const webhookUrl = process.env.NEXT_PUBLIC_MAKE_WEBHOOK_URL;
        if (webhookUrl) {
            const webhookRes = await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!webhookRes.ok) {
                console.error("Erreur du Webhook Make:", webhookRes.status, await webhookRes.text());
                // On pourrait throw une erreur ici, mais on veut quand même retourner 200 au front 
                // pour que l'UI affiche le message de succès (ou throw pour bloquer l'UI).
                // On va throw pour que le frontend le capte si besoin, ou on le garde silencieux.
            } else {
                console.log("=== LEAD ENVOYÉ AU WEBHOOK AVEC SUCCÈS ===");
            }
        } else {
            console.warn("ATTENTION: NEXT_PUBLIC_MAKE_WEBHOOK_URL n'est pas défini dans .env.local");
        }

        return NextResponse.json({
            success: true,
            message: 'Lead traité et webhook déclenché.'
        });
    } catch (error: any) {
        console.error('Erreur lors du save-lead route:', error);
        return NextResponse.json(
            { error: error.message || 'Erreur lors de la capture' },
            { status: 500 }
        );
    }
}
