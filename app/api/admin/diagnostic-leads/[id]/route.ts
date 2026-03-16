import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { checkAdminAuth } from '@/app/lib/auth-utils';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await checkAdminAuth();
  if (!auth.isAuthenticated) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from('diagnostic_leads')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Lead introuvable' }, { status: 404 });
  }

  return NextResponse.json(data);
}
