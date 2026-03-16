import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { checkAdminAuth } from '@/app/lib/auth-utils';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  const auth = await checkAdminAuth();
  if (!auth.isAuthenticated) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const status = searchParams.get('status') || 'all';
  const source = searchParams.get('source') || 'all';
  const search = searchParams.get('search') || '';
  const offset = (page - 1) * limit;

  let query = supabaseAdmin
    .from('diagnostic_leads')
    .select('id, source, brand_name, niche, contact_email, contact_whatsapp, traction_level, pain_point_hours, pain_point_summary, session_duration_seconds, status, notes, created_at', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (status !== 'all') query = query.eq('status', status);
  if (source !== 'all') query = query.eq('source', source);
  if (search) {
    query = query.or(
      `brand_name.ilike.%${search}%,niche.ilike.%${search}%,contact_email.ilike.%${search}%,contact_whatsapp.ilike.%${search}%`
    );
  }

  const { data, count, error } = await query;
  if (error) {
    return NextResponse.json({ error: 'Erreur base de données' }, { status: 500 });
  }

  return NextResponse.json({
    data,
    count,
    page,
    totalPages: Math.ceil((count || 0) / limit),
    perPage: limit,
  });
}

export async function PATCH(request: NextRequest) {
  const auth = await checkAdminAuth();
  if (!auth.isAuthenticated) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const body = await request.json();
  const { id, status, notes } = body;
  if (!id) return NextResponse.json({ error: 'ID requis' }, { status: 400 });

  const updates: any = {};
  if (status !== undefined) updates.status = status;
  if (notes !== undefined) updates.notes = notes;

  const { error } = await supabaseAdmin
    .from('diagnostic_leads')
    .update(updates)
    .eq('id', id);

  if (error) return NextResponse.json({ error: 'Erreur mise à jour' }, { status: 500 });
  return NextResponse.json({ success: true });
}
