// app/api/ecommerce/create-lead/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

// Créer un client Supabase avec les permissions admin (comme dans vos autres fichiers)
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

export async function POST(request: NextRequest) {
  console.log("API create-lead: Début de la requête");
  
  try {
    // Parsing sécurisé du JSON
    let body;
    try {
      body = await request.json();
      console.log("API create-lead: Corps de la requête", JSON.stringify(body));
    } catch (parseError) {
      console.error("API create-lead: Erreur de parsing JSON", parseError);
      return NextResponse.json({ 
        success: false, 
        error: "Format de requête invalide" 
      }, { status: 400 });
    }
    
    const { leadData } = body;

    if (!leadData || !leadData.full_name || !leadData.email || !leadData.phone) {
      console.error("API create-lead: Données incomplètes", leadData);
      return NextResponse.json({ 
        success: false, 
        error: "Données incomplètes" 
      }, { status: 400 });
    }

    let leadId;
    
    // 1. Essayer d'abord d'insérer dans business_interests
    console.log("API create-lead: Tentative d'insertion dans business_interests");
    try {
      const interestData = {
        id: uuidv4(),
        business_id: null,
        full_name: leadData.full_name,
        email: leadData.email,
        phone: leadData.phone,
        country: leadData.country || '',
        city: leadData.city || '',
        payment_option: leadData.payment_option,
        investment_readiness: null,
        experience: null,
        timeline: null,
        questions: leadData.business_description || null,
        status: leadData.status || 'new',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        subscribe_to_updates: false
      };
      
      const { data, error } = await supabaseAdmin
        .from('business_interests')
        .insert([interestData])
        .select();

      if (error) {
        console.warn("API create-lead: Erreur d'insertion business_interests", error);
        // Nous continuons pour essayer le fallback
      } else if (data && data.length > 0) {
        leadId = data[0].id;
        console.log("API create-lead: Insertion business_interests réussie, ID:", leadId);
      }
    } catch (insertError) {
      console.warn("API create-lead: Exception lors de l'insertion business_interests", insertError);
      // Nous continuons pour essayer le fallback
    }

    // 2. Fallback: utiliser formation_enrollments (comme dans ramadan-promo)
    if (!leadId) {
      console.log("API create-lead: Utilisation du fallback formation_enrollments");
      try {
        const fallbackData = {
          formation_id: 'ecommerce-service',
          full_name: leadData.full_name,
          email: leadData.email,
          phone: leadData.phone || '',
          country: leadData.country || '',
          city: leadData.city || '',
          payment_option: leadData.payment_option || 'partial',
          payment_status: leadData.payment_status || 'pending',
          amount_paid: leadData.amount_paid || 0,
          metadata: {
            businessName: leadData.business_name || '',
            businessDescription: leadData.business_description || '',
            existingWebsite: leadData.existing_website || null,
            howDidYouHear: leadData.lead_source || null,
            serviceType: 'ecommerce',
            transactionId: leadData.transaction_id || null,
            status: leadData.status || 'new',
            notes: leadData.notes || '',
            contactMethod: leadData.contact_method || 'contact_later',
            totalAmount: leadData.total_amount || 0,
            platform: leadData.platform || 'shopify'
          }
        };
        
        const { data, error } = await supabaseAdmin
          .from('formation_enrollments')
          .insert([fallbackData])
          .select();
          
        if (error) {
          console.error("API create-lead: Erreur insertion fallback", error);
          throw new Error(`Erreur fallback: ${error.message}`);
        } else if (data && data.length > 0) {
          leadId = data[0].id;
          console.log("API create-lead: Insertion fallback réussie, ID:", leadId);
        } else {
          console.error("API create-lead: Aucune donnée retournée par le fallback");
          throw new Error("Échec de l'insertion fallback");
        }
      } catch (fallbackError: any) {
        console.error("API create-lead: Exception globale fallback", fallbackError);
        throw fallbackError;
      }
    }

    // 3. Si transaction_id existe, mettre à jour la transaction
    if (leadId && leadData.transaction_id) {
      console.log("API create-lead: Mise à jour de la transaction", leadData.transaction_id);
      try {
        await supabaseAdmin
          .from('payment_transactions')
          .update({ 
            lead_id: leadId,
            status: 'completed',
            updated_at: new Date().toISOString()
          })
          .eq('id', leadData.transaction_id);
      } catch (txError) {
        console.warn("API create-lead: Erreur mise à jour transaction (non bloquante)", txError);
      }
    }

    // 4. Journalisation
    try {
      const activityDescription = `Nouvelle demande e-commerce de ${leadData.full_name} (${leadData.email})`;
      
      await supabaseAdmin
        .from('activity_logs')
        .insert([{
          type: 'ecommerce_lead_created',
          description: activityDescription,
          metadata: {
            leadId,
            email: leadData.email,
            phone: leadData.phone,
            transactionId: leadData.transaction_id,
            platform: leadData.platform
          },
          created_at: new Date().toISOString()
        }]);
        
      console.log("API create-lead: Log d'activité enregistré");
    } catch (logError) {
      console.warn("API create-lead: Erreur journalisation (non bloquante)", logError);
    }

    return NextResponse.json({
      success: true,
      data: {
        id: leadId,
        message: "Demande enregistrée avec succès"
      }
    });
  } catch (error: any) {
    console.error("API create-lead: Erreur serveur", error);
    return NextResponse.json({ 
      success: false, 
      error: "Erreur lors de l'enregistrement de la demande",
      details: error.message || "Erreur inconnue"
    }, { status: 500 });
  }
}