// app/api/ecommerce/create-lead/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    // Parsing sécurisé du JSON
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error("Erreur de parsing JSON:", parseError);
      return NextResponse.json({ 
        success: false, 
        error: "Format de requête invalide" 
      }, { status: 400 });
    }
    
    const { leadData } = body;

    if (!leadData || !leadData.full_name || !leadData.email || !leadData.phone) {
      return NextResponse.json({ 
        success: false, 
        error: "Données incomplètes" 
      }, { status: 400 });
    }

    // Préparation des données conformément à la structure de la table
    const interestData = {
      id: crypto.randomUUID(), // Générer un UUID
      business_id: null, // Peut être null ou un business spécifique
      full_name: leadData.full_name,
      email: leadData.email,
      phone: leadData.phone,
      country: leadData.country || null,
      city: leadData.city || null,
      payment_option: leadData.payment_option || null,
      experience: leadData.experience || null,
      investment_readiness: leadData.investment_readiness || null,
      timeline: leadData.timeline || null,
      questions: leadData.business_description || null, // Utiliser business_description comme questions
      status: leadData.status || 'new',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_whatsapp: leadData.is_whatsapp || false,
      subscribe_to_updates: leadData.subscribe_to_updates || false
    };

    // Insertion des données dans la table business_interests
    const { data, error } = await supabase
      .from('business_interests')
      .insert(interestData)
      .select()
      .single();

    if (error) {
      console.error("Erreur d'insertion:", error);
      return NextResponse.json({ 
        success: false, 
        error: "Erreur lors de l'enregistrement de la demande",
        details: error.message 
      }, { status: 500 });
    }

    // Journaliser l'activité
    try {
      await supabase
        .from('activity_logs')
        .insert({
          type: 'lead_created',
          description: `Nouvelle demande de ${interestData.full_name} (${interestData.email})`,
          metadata: {
            lead_id: data.id,
            email: interestData.email,
            phone: interestData.phone,
            payment_option: interestData.payment_option
          },
          created_at: new Date().toISOString()
        });
    } catch (logError) {
      console.warn("Erreur lors de la journalisation:", logError);
      // Continuer malgré l'erreur de journalisation
    }

    // Retourner une réponse de succès
    return NextResponse.json({
      success: true,
      data: {
        id: data.id,
        message: "Demande enregistrée avec succès"
      }
    });
  } catch (error: any) {
    console.error("Erreur serveur:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Erreur interne du serveur",
      details: error.message || "Erreur inconnue"
    }, { status: 500 });
  }
}