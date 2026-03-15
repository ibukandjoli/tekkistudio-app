import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

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

    // Notification e-mail interne (non bloquant)
    const resendKey = process.env.RESEND_API_KEY;
    const notifEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
    if (resendKey && notifEmail) {
      const resend = new Resend(resendKey);
      const TYPE_LABELS: Record<string, string> = {
        ecommerce: 'E-commerce', vitrine: 'Site vitrine', webapp: 'App web', saas: 'SaaS'
      };
      try {
        await resend.emails.send({
          from: 'TEKKI Studio <notifications@tekkistudio.com>',
          to: notifEmail,
          subject: `🆕 Nouveau projet web — ${full_name.trim()} (${TYPE_LABELS[project_type] || project_type})`,
          html: `
            <h2 style="color:#0f4c81;margin-bottom:16px;">Nouvelle demande de projet web</h2>
            <table style="border-collapse:collapse;width:100%;font-family:sans-serif;font-size:14px;">
              <tr><td style="padding:8px 12px;color:#6b7280;width:160px;">Nom</td><td style="padding:8px 12px;font-weight:600;">${full_name.trim()}</td></tr>
              <tr style="background:#f9fafb;"><td style="padding:8px 12px;color:#6b7280;">E-mail</td><td style="padding:8px 12px;"><a href="mailto:${email.trim()}">${email.trim()}</a></td></tr>
              <tr><td style="padding:8px 12px;color:#6b7280;">WhatsApp</td><td style="padding:8px 12px;"><a href="https://wa.me/${whatsapp.replace(/\D/g, '')}">${whatsapp.trim()}</a></td></tr>
              <tr style="background:#f9fafb;"><td style="padding:8px 12px;color:#6b7280;">Type de projet</td><td style="padding:8px 12px;">${TYPE_LABELS[project_type] || project_type}</td></tr>
              ${company_name ? `<tr><td style="padding:8px 12px;color:#6b7280;">Structure</td><td style="padding:8px 12px;">${company_name.trim()}</td></tr>` : ''}
              ${budget_range ? `<tr style="background:#f9fafb;"><td style="padding:8px 12px;color:#6b7280;">Budget</td><td style="padding:8px 12px;">${budget_range}</td></tr>` : ''}
              ${deadline ? `<tr><td style="padding:8px 12px;color:#6b7280;">Délai</td><td style="padding:8px 12px;">${deadline}</td></tr>` : ''}
              ${responses?.description ? `<tr style="background:#f9fafb;"><td style="padding:8px 12px;color:#6b7280;vertical-align:top;">Description</td><td style="padding:8px 12px;">${responses.description}</td></tr>` : ''}
            </table>
            <div style="margin-top:24px;">
              <a href="https://tekkistudio.com/admin/site-projects/${data.id}" style="background:#ff7f50;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:600;font-family:sans-serif;">Voir la fiche complète →</a>
            </div>
          `,
        });
      } catch (emailError) {
        console.error('Email notification error (non-blocking)');
      }
    }

    return NextResponse.json({ success: true, id: data.id });
  } catch (error: any) {
    console.error('site-project route error:', error.name);
    return NextResponse.json({ success: false, error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
