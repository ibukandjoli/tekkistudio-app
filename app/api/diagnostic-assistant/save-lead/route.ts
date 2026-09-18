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
    const { messages, session_duration_seconds, offre } = body;

    const transcript = messages
      .map((m: any) => `${m.role.toUpperCase()}: ${m.content}`)
      .join('\n\n');

    const systemPrompt = `
Tu es un assistant d'extraction de données ultra-précis.
Analyse la transcription d'une conversation entre un ASSISTANT et un USER, et extrais les informations sous format JSON strict.

Instructions cruciales :
- brand_name: Le nom de la marque.
- niche: La spécialité (mode, jeux, beauté, artisanat, etc).
- location: Ville et/ou pays où la marque est basée.
- target_customer: Description du client idéal telle que formulée par le fondateur.
- contact_email: L'adresse email.
- contact_whatsapp: Le numéro de téléphone. ATTENTION MAXIMALE : S'il y a un numéro, tu dois OBLIGATOIREMENT le formater au format international strict (ex: +33612345678, +221771234567). Supprime tous les espaces, tirets ou parenthèses. Si le code pays manque, essaie de le deviner ou laisse les chiffres tels quels sans aucun espace.
- sales_channel: Le canal de vente principal actuel (WhatsApp/Instagram, site web, bouche-à-oreille...).
- existing_site_platform: Si un site existe déjà, la plateforme utilisée (Shopify, TEKKIShop, un autre prestataire, un outil IA type Lovable). Laisse vide si pas de site.
- payment_method: Le ou les modes de paiement utilisés par les clients finaux (Mobile Money, carte bancaire, paiement à la livraison).
- traction_level: Le niveau de commandes actuel (volume par mois).
- monthly_revenue_range: La fourchette de chiffre d'affaires mensuel si elle a été donnée. Laisse vide si la personne a éludé la question — ne jamais inventer une valeur.
- social_followers_count: Le nombre d'abonnés mentionné sur le compte principal.
- posting_frequency: La fréquence de publication déclarée (par jour/semaine/mois).
- viral_content_description: Description du contenu le plus viral tel que raconté par le fondateur.
- social_content_gaps: À partir de la description du contenu viral et de la fréquence de publication, identifie en 1-2 phrases ce qui semble avoir été mal exploité — par exemple : absence de call-to-action clair sur ce contenu, fréquence de publication trop faible pour capitaliser sur le succès, absence de collaboration avec des créateurs UGC pour dupliquer l'effet. Base-toi uniquement sur ce qui a été dit, ne suppose rien qui ne soit pas dans la transcription.
- pain_point_hours: Le temps estimé passé par jour sur WhatsApp/Instagram.
- pain_point_summary: Rédige une synthèse de la douleur opérationnelle en UNE SEULE PHRASE claire.

Reponds UNIQUEMENT avec un objet JSON valide, sans balises GFM, sans texte avant ou après.
Exemple de structure:
{
  "brand_name": "",
  "niche": "",
  "location": "",
  "target_customer": "",
  "contact_email": "",
  "contact_whatsapp": "",
  "sales_channel": "",
  "existing_site_platform": "",
  "payment_method": "",
  "traction_level": "",
  "monthly_revenue_range": "",
  "social_followers_count": "",
  "posting_frequency": "",
  "viral_content_description": "",
  "social_content_gaps": "",
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
        source: 'diagnostic',
        offer_intent: offre || 'diagnostic',
        brand_name: extractedData.brand_name || null,
        niche: extractedData.niche || null,
        location: extractedData.location || null,
        target_customer: extractedData.target_customer || null,
        contact_email: extractedData.contact_email || null,
        contact_whatsapp: extractedData.contact_whatsapp || null,
        sales_channel: extractedData.sales_channel || null,
        existing_site_platform: extractedData.existing_site_platform || null,
        payment_method: extractedData.payment_method || null,
        traction_level: extractedData.traction_level || null,
        monthly_revenue_range: extractedData.monthly_revenue_range || null,
        social_followers_count: extractedData.social_followers_count || null,
        posting_frequency: extractedData.posting_frequency || null,
        viral_content_description: extractedData.viral_content_description || null,
        social_content_gaps: extractedData.social_content_gaps || null,
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
          location: extractedData.location || '',
          target_customer: extractedData.target_customer || '',
          contact_email: extractedData.contact_email || '',
          contact_whatsapp: extractedData.contact_whatsapp || '',
          offer_intent: offre || 'diagnostic',
        },
        business_context: {
          sales_channel: extractedData.sales_channel || '',
          existing_site_platform: extractedData.existing_site_platform || '',
          payment_method: extractedData.payment_method || '',
          traction_level: extractedData.traction_level || '',
          monthly_revenue_range: extractedData.monthly_revenue_range || '',
          pain_point_hours: extractedData.pain_point_hours || '',
          pain_point_summary: extractedData.pain_point_summary || '',
        },
        social_audit: {
          followers_count: extractedData.social_followers_count || '',
          posting_frequency: extractedData.posting_frequency || '',
          viral_content_description: extractedData.viral_content_description || '',
          content_gaps: extractedData.social_content_gaps || '',
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
