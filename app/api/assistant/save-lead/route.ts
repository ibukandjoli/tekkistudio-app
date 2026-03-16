import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || '' });

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, session_duration_seconds } = body;

    const transcript = messages
      .map((m: any) => `${m.role.toUpperCase()}: ${m.content}`)
      .join('\n\n');

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

    const replyContent =
      response.content[0].type === 'text' ? response.content[0].text : '{}';

    let extractedData: any = {};
    try {
      const cleaned = replyContent.replace(/```json/g, '').replace(/```/g, '').trim();
      extractedData = JSON.parse(cleaned);
    } catch {
      // Continue with empty object if parsing fails
    }

    // 1. Sauvegarde dans Supabase (source de vérité)
    const { error: dbError } = await supabaseAdmin
      .from('diagnostic_leads')
      .insert({
        source: 'diagnostic-beaute',
        brand_name: extractedData.brand_name || null,
        niche: extractedData.niche || null,
        contact_email: extractedData.contact_email || null,
        contact_whatsapp: extractedData.contact_whatsapp || null,
        traction_level: extractedData.traction_level || null,
        pain_point_hours: extractedData.pain_point_hours || null,
        pain_point_summary: extractedData.pain_point_summary || null,
        full_transcript: messages,
        session_duration_seconds: session_duration_seconds || 0,
        status: 'nouveau',
      });

    if (dbError) {
      console.error('Erreur Supabase diagnostic_leads:', dbError.message);
    }

    // 2. Envoi au Webhook Make (non-bloquant)
    const webhookUrl = process.env.MAKE_WEBHOOK_URL;
    if (webhookUrl) {
      const payload = {
        lead_info: {
          brand_name: extractedData.brand_name || '',
          niche: extractedData.niche || '',
          contact_email: extractedData.contact_email || '',
          contact_whatsapp: extractedData.contact_whatsapp || '',
        },
        business_context: {
          traction_level: extractedData.traction_level || '',
          pain_point_hours: extractedData.pain_point_hours || '',
          pain_point_summary: extractedData.pain_point_summary || '',
        },
        raw_data: {
          full_transcript: messages,
          session_duration_seconds: session_duration_seconds || 0,
          timestamp: new Date().toISOString(),
        },
      };
      fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch(() => {});
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Erreur save-lead:', error);
    return NextResponse.json({ error: 'Erreur lors de la capture' }, { status: 500 });
  }
}
