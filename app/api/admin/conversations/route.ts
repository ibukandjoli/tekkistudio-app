// app/api/admin/conversations/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Client Supabase avec clé de service (contourne les RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Obtenir le nombre total de conversations (avec filtres)
async function getTotalCount(filter: string, timeRange: string, search: string) {
  try {
    let query = supabaseAdmin
      .from('chat_conversations')
      .select('id', { count: 'exact', head: true });
    
    // Appliquer le filtre needs_human
    if (filter === 'needs_human') {
      query = query.eq('needs_human', true);
    }
    
    // Appliquer le filtre de date si nécessaire
    if (timeRange !== 'all') {
      const now = new Date();
      let startDate: Date;
      
      switch(timeRange) {
        case '24hours':
          startDate = new Date(now.setDate(now.getDate() - 1));
          break;
        case '7days':
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case '30days':
          startDate = new Date(now.setDate(now.getDate() - 30));
          break;
        default:
          startDate = new Date(0); // 1970
      }
      
      query = query.gte('created_at', startDate.toISOString());
    }
    
    // Appliquer la recherche
    if (search) {
      query = query.or(`user_message.ilike.%${search}%,assistant_response.ilike.%${search}%`);
    }
    
    const { count, error } = await query;
    
    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.error("Erreur lors du comptage:", error);
    return 0;
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '15');
    const filter = searchParams.get('filter') || 'all';
    const timeRange = searchParams.get('timeRange') || 'all';
    const search = searchParams.get('search') || '';
    
    console.log("API: Requête conversations avec params:", { page, limit, filter, timeRange, search });
    
    // Calculer l'offset pour la pagination
    const from = (page - 1) * limit;
    
    // Construire la requête de base
    let query = supabaseAdmin
      .from('chat_conversations')
      .select('*');
    
    // Appliquer le filtre needs_human
    if (filter === 'needs_human') {
      query = query.eq('needs_human', true);
    }
    
    // Appliquer le filtre de date si nécessaire
    if (timeRange !== 'all') {
      const now = new Date();
      let startDate: Date;
      
      switch(timeRange) {
        case '24hours':
          startDate = new Date(now.setDate(now.getDate() - 1));
          break;
        case '7days':
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case '30days':
          startDate = new Date(now.setDate(now.getDate() - 30));
          break;
        default:
          startDate = new Date(0); // 1970
      }
      
      query = query.gte('created_at', startDate.toISOString());
    }
    
    // Appliquer la recherche
    if (search) {
      query = query.or(`user_message.ilike.%${search}%,assistant_response.ilike.%${search}%`);
    }
    
    // Obtenir le nombre total d'éléments pour la pagination
    const totalCount = await getTotalCount(filter, timeRange, search);
    
    // Exécuter la requête avec tri et pagination
    const { data, error } = await query
      .order('created_at', { ascending: false })
      .range(from, from + limit - 1);
    
    if (error) {
      console.error("Erreur API conversations:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    // Calculer les pages totales
    const totalPages = Math.ceil(totalCount / limit);
    
    console.log("API: Retour données:", { 
      count: totalCount, 
      dataLength: data?.length || 0,
      totalPages
    });
    
    return NextResponse.json({
      data: data || [],
      count: totalCount,
      page,
      totalPages,
      perPage: limit
    });
  } catch (error) {
    console.error("Exception API conversations:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

// Endpoint pour créer une conversation de test
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const testData = body.data || {
      user_message: "Test de la fonctionnalité de conversations",
      assistant_response: "Ceci est une réponse de test pour vérifier l'affichage des conversations",
      page: "Page de test",
      url: "/test",
      needs_human: false,
      created_at: new Date().toISOString()
    };
    
    const { data, error } = await supabaseAdmin
      .from('chat_conversations')
      .insert([testData])
      .select();
    
    if (error) {
      console.error("Erreur création conversation test:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error("Exception création conversation:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la conversation test" },
      { status: 500 }
    );
  }
}