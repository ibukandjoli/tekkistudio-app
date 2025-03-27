// app/api/ecommerce/create-lead/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

// Créer un client Supabase avec les permissions admin
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
    
    // 1. Essayer d'abord d'insérer dans la table ecommerce_leads (celle que l'admin cherche)
    console.log("API create-lead: Tentative d'insertion dans ecommerce_leads");
    try {
      const ecommerceData = {
        id: uuidv4(),
        full_name: leadData.full_name,
        email: leadData.email,
        phone: leadData.phone,
        country: leadData.country || '',
        city: leadData.city || '',
        business_name: leadData.business_name || '',
        business_description: leadData.business_description || '',
        existing_website: leadData.existing_website || null,
        lead_source: leadData.lead_source || null,
        payment_status: leadData.payment_status || 'pending',
        amount_paid: leadData.amount_paid || 0,
        total_amount: leadData.total_amount || 0,
        transaction_id: leadData.transaction_id || null,
        status: leadData.status || 'new',
        platform: leadData.platform || 'shopify',
        notes: leadData.notes || '',
        contact_method: leadData.contact_method || 'contact_later',
        payment_option: leadData.payment_option || 'partial',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const { data, error } = await supabaseAdmin
        .from('ecommerce_leads')
        .insert([ecommerceData])
        .select();

      if (error) {
        console.warn("API create-lead: Erreur d'insertion ecommerce_leads", error);
        // Si erreur de table inexistante, on continue vers le fallback
        if (error.code !== '42P01') throw error;
      } else if (data && data.length > 0) {
        leadId = data[0].id;
        console.log("API create-lead: Insertion ecommerce_leads réussie, ID:", leadId);
      }
    } catch (insertError) {
      console.warn("API create-lead: Exception lors de l'insertion ecommerce_leads", insertError);
      // Nous continuons pour essayer le fallback
    }

    // 2. Fallback: utiliser ramadan_promo_leads (l'autre table que l'admin cherche)
    if (!leadId) {
      console.log("API create-lead: Utilisation du fallback ramadan_promo_leads");
      try {
        const ramadanLeadData = {
          id: uuidv4(),
          full_name: leadData.full_name,
          email: leadData.email,
          phone: leadData.phone,
          country: leadData.country || '',
          city: leadData.city || '',
          business_name: leadData.business_name || '',
          business_description: leadData.business_description || '',
          existing_website: leadData.existing_website || null,
          lead_source: leadData.lead_source || null,
          payment_status: leadData.payment_status || 'pending',
          amount_paid: leadData.amount_paid || 0,
          total_amount: leadData.total_amount || 0,
          transaction_id: leadData.transaction_id || null,
          status: leadData.status || 'new',
          notes: leadData.notes || '',
          contact_method: leadData.contact_method || 'contact_later',
          payment_option: leadData.payment_option || 'partial',
          // Ajouter un champ platform qui n'existe pas dans la table d'origine
          // mais qui est attendu par l'interface admin
          platform: leadData.platform || 'shopify',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        const { data, error } = await supabaseAdmin
          .from('ramadan_promo_leads')
          .insert([ramadanLeadData])
          .select();
          
        if (error) {
          console.error("API create-lead: Erreur insertion fallback ramadan_promo_leads", error);
          throw error;
        } else if (data && data.length > 0) {
          leadId = data[0].id;
          console.log("API create-lead: Insertion ramadan_promo_leads réussie, ID:", leadId);
        } else {
          console.error("API create-lead: Aucune donnée retournée par le fallback");
          throw new Error("Échec de l'insertion fallback");
        }
      } catch (fallbackError: any) {
        console.error("API create-lead: Exception ramadan_promo_leads", fallbackError);
        
        // 3. Dernier recours: utiliser formation_enrollments comme fallback final
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
            },
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          
          const { data, error } = await supabaseAdmin
            .from('formation_enrollments')
            .insert([fallbackData])
            .select();
            
          if (error) throw error;
          if (data && data.length > 0) {
            leadId = data[0].id;
            console.log("API create-lead: Insertion formation_enrollments réussie, ID:", leadId);
          }
        } catch (formationError: any) {
          console.error("API create-lead: Erreur formation_enrollments", formationError);
          throw formationError;
        }
      }
    }

    // 4. Si transaction_id existe, mettre à jour la transaction
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

    // 5. Journalisation
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