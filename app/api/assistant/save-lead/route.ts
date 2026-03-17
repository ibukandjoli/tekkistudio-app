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

Champs à extraire :
- brand_name: Le nom de la marque.
- niche: La spécialité ou le secteur (beauté, mode, alimentation, bien-être, etc.).
- location: La ville et/ou le pays mentionnés.
- target_market: La cible / clientèle visée (ex : "Femmes 25-40 ans en Côte d'Ivoire").
- social_media: Tableau des comptes réseaux sociaux mentionnés. Format : [{"platform": "Instagram", "handle": "@nom_du_compte"}]. Laisser [] si aucun.
- existing_website: URL du site ou boutique en ligne existant(e). Null si aucun.
- monthly_revenue: Chiffre d'affaires mensuel approximatif ou fourchette mentionnée. Null si non mentionné.
- traction_level: Le niveau de commandes actuel (ex : "Quelques commandes par semaine", "Volume quotidien", "En démarrage").
- pain_point_hours: Le temps estimé passé par jour sur WhatsApp/Instagram.
- pain_point_summary: Synthèse de la douleur opérationnelle en UNE SEULE PHRASE claire.
- contact_email: L'adresse email.
- contact_whatsapp: Le numéro WhatsApp. OBLIGATOIREMENT au format international strict (ex: +221771234567). Supprime espaces, tirets, parenthèses. Si le code pays manque, devine-le selon le contexte (pays mentionné) ou laisse les chiffres tels quels.

Réponds UNIQUEMENT avec un objet JSON valide, sans balises GFM, sans texte avant ou après.
Structure exacte attendue :
{
  "brand_name": "",
  "niche": "",
  "location": "",
  "target_market": "",
  "social_media": [],
  "existing_website": null,
  "monthly_revenue": null,
  "traction_level": "",
  "pain_point_hours": "",
  "pain_point_summary": "",
  "contact_email": "",
  "contact_whatsapp": ""
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
        extra_data: {
          location: extractedData.location || null,
          target_market: extractedData.target_market || null,
          social_media: extractedData.social_media || [],
          existing_website: extractedData.existing_website || null,
          monthly_revenue: extractedData.monthly_revenue || null,
        },
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
