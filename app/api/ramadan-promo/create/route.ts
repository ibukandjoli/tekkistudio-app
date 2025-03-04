// app/api/ramadan-promo/create/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  console.log("🔍 API create: Début de la requête");
  
  try {
    // Vérifier que les variables d'environnement sont chargées
    console.log("🔑 Vérification des variables d'environnement");
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl) {
      console.error("❌ URL Supabase manquante");
      return NextResponse.json({ 
        success: false, 
        error: "Configuration serveur incorrecte: URL Supabase manquante" 
      }, { status: 500 });
    }
    
    if (!serviceKey) {
      console.error("❌ Clé de service Supabase manquante");
      return NextResponse.json({ 
        success: false, 
        error: "Configuration serveur incorrecte: Clé de service manquante" 
      }, { status: 500 });
    }
    
    console.log("✅ Variables d'environnement chargées");
    
    // Créer un client Supabase avec les permissions admin
    const supabaseAdmin = createClient(
      supabaseUrl,
      serviceKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );
    
    // Extraire les données de la requête
    const body = await request.json();
    console.log("📋 Données reçues", JSON.stringify(body));

    if (!body.leadData) {
      console.error("❌ Données manquantes dans la requête");
      return NextResponse.json({ 
        success: false, 
        error: "Données manquantes" 
      }, { status: 400 });
    }

    console.log("🔄 Tentative d'insertion dans ramadan_promo_leads");
    
    // Insertion directe dans ramadan_promo_leads avec la clé service
    const { data, error } = await supabaseAdmin
      .from('ramadan_promo_leads')
      .insert([body.leadData])
      .select();

    if (error) {
      console.error("❌ Erreur d'insertion:", error);
      return NextResponse.json({ 
        success: false, 
        error: "Erreur lors de l'enregistrement", 
        details: error.message,
        code: error.code
      }, { status: 500 });
    }

    console.log("✅ Insertion réussie, ID:", data[0].id);
    
    return NextResponse.json({
      success: true,
      leadId: data[0].id
    });
  } catch (error: any) {
    console.error("❌ Erreur serveur:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Erreur serveur", 
      details: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}