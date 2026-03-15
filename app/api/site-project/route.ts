import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[+\d][\d\s\-().]{6,20}$/;
const VALID_TYPES = ['ecommerce', 'vitrine', 'webapp', 'saas'];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { full_name, email, whatsapp, project_type, company_name, budget_range, deadline, responses } = body;

    // Validation
    if (!full_name?.trim() || !email?.trim() || !whatsapp?.trim() || !project_type) {
      return NextResponse.json({ success: false, error: 'Champs obligatoires manquants' }, { status: 400 });
    }
    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json({ success: false, error: 'Adresse email invalide' }, { status: 400 });
    }
    if (!PHONE_REGEX.test(whatsapp)) {
      return NextResponse.json({ success: false, error: 'Numéro WhatsApp invalide' }, { status: 400 });
    }
    if (!VALID_TYPES.includes(project_type)) {
      return NextResponse.json({ success: false, error: 'Type de projet invalide' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('site_project_requests')
      .insert([{
        full_name: full_name.trim(),
        email: email.trim().toLowerCase(),
        whatsapp: whatsapp.trim(),
        project_type,
        company_name: company_name?.trim() || null,
        budget_range: budget_range || null,
        deadline: deadline || null,
        responses: responses || {},
        status: 'new',
      }])
      .select('id')
      .single();

    if (error) {
      console.error('site-project insert error:', error.code);
      return NextResponse.json({ success: false, error: 'Erreur lors de l\'enregistrement' }, { status: 500 });
    }

    // Webhook Make.com (non bloquant)
    const webhookUrl = process.env.MAKE_WEBHOOK_PROJECT_URL;
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: data.id,
            full_name: full_name.trim(),
            email: email.trim().toLowerCase(),
            whatsapp: whatsapp.trim(),
            project_type,
            company_name: company_name?.trim() || '',
            budget_range: budget_range || '',
            deadline: deadline || '',
            summary: responses?.description || '',
            timestamp: new Date().toISOString(),
          }),
        });
      } catch (webhookError) {
        console.error('Webhook project error (non-blocking)');
      }
    }

    return NextResponse.json({ success: true, id: data.id });
  } catch (error: any) {
    console.error('site-project route error:', error.name);
    return NextResponse.json({ success: false, error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
