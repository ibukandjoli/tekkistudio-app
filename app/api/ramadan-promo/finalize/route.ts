// app/api/ramadan-promo/finalize/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase"; 

// Types pour validation
interface FormData {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  businessName: string;
  businessDescription: string;
  existingWebsite?: string;
  howDidYouHear?: string;
  paymentOption: string;
  contactMethod: string;
}

interface RequestBody {
  formData: FormData;
  transactionId?: string | null;
  paymentStatus: string;
  amountPaid: number;
  totalAmount: number;
  contactMethod: string;
}

export async function POST(request: NextRequest) {
  console.log("API: Début de la requête finalize");
  
  try {
    // Récupérer et valider le corps de la requête
    let body: RequestBody;
    try {
      body = await request.json();
      console.log("API finalize: Données reçues", JSON.stringify(body));
    } catch (parseError) {
      console.error("API finalize: Erreur de parsing JSON", parseError);
      return NextResponse.json({ 
        success: false, 
        error: "Format de requête invalide" 
      }, { status: 400 });
    }
    
    // Validation de base
    const { formData, transactionId, paymentStatus, amountPaid, totalAmount, contactMethod } = body;
    
    if (!formData || !formData.fullName || !formData.email || !formData.businessName) {
      console.error("API finalize: Données manquantes", formData);
      return NextResponse.json({ 
        success: false, 
        error: "Données requises manquantes" 
      }, { status: 400 });
    }

    let leadId;
    let insertData = {
      full_name: formData.fullName,
      email: formData.email,
      phone: formData.phone || '',
      country: formData.country || '',
      city: formData.city || '',
      business_name: formData.businessName || '',
      business_description: formData.businessDescription || '',
      existing_website: formData.existingWebsite || null,
      lead_source: formData.howDidYouHear || null,
      payment_option: formData.paymentOption || 'partial',
      payment_status: paymentStatus || 'pending',
      amount_paid: amountPaid || 0,
      transaction_id: transactionId || null,
      total_amount: totalAmount || 0,
      status: contactMethod === 'pay_now' ? 'new' : 'pending_contact',
      notes: contactMethod === 'contact_later' ? 'Client souhaite être contacté avant paiement' : '',
      contact_method: contactMethod || 'contact_later'
    };
    
    console.log("API finalize: Tentative d'insertion avec données:", JSON.stringify(insertData));

    // Tentative d'insertion avec le client normal
    try {
      const { data, error } = await supabase
        .from('ramadan_promo_leads')
        .insert([insertData])
        .select();
      
      if (error) {
        console.error("API finalize: Erreur insertion normale:", error);
        // Nous continuons malgré l'erreur pour tenter le fallback
      } else if (data && data.length > 0) {
        leadId = data[0].id;
        console.log("API finalize: Insertion réussie, ID:", leadId);
      }
    } catch (insertError) {
      console.error("API finalize: Exception lors de l'insertion:", insertError);
      // Nous continuons malgré l'erreur pour tenter le fallback
    }

    // Si aucun leadId n'a été obtenu, utiliser un fallback
    if (!leadId) {
      console.log("API finalize: Utilisation du fallback formation_enrollments");
      try {
        const fallbackData = {
          formation_id: 'promo-ramadan-2024',
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone || '',
          country: formData.country || '',
          city: formData.city || '',
          payment_option: formData.paymentOption || 'partial',
          payment_status: paymentStatus || 'pending',
          amount_paid: amountPaid || 0,
          metadata: {
            businessName: formData.businessName || '',
            businessDescription: formData.businessDescription || '',
            existingWebsite: formData.existingWebsite || null,
            howDidYouHear: formData.howDidYouHear || null,
            promoType: 'ramadan_2024',
            transactionId: transactionId || null,
            status: contactMethod === 'pay_now' ? 'new' : 'pending_contact',
            notes: contactMethod === 'contact_later' ? 'Client souhaite être contacté avant paiement' : '',
            contactMethod: contactMethod || 'contact_later',
            totalAmount: totalAmount || 0
          }
        };
        
        const { data, error } = await supabase
          .from('formation_enrollments')
          .insert([fallbackData])
          .select();
          
        if (error) {
          console.error("API finalize: Erreur insertion fallback:", error);
          throw new Error(`Erreur fallback: ${error.message}`);
        } else if (data && data.length > 0) {
          leadId = data[0].id;
          console.log("API finalize: Insertion fallback réussie, ID:", leadId);
        } else {
          console.error("API finalize: Aucune donnée retournée par le fallback");
          throw new Error("Échec de l'insertion fallback");
        }
      } catch (fallbackError) {
        console.error("API finalize: Exception globale fallback:", fallbackError);
        throw fallbackError;
      }
    }

    // Si nous sommes arrivés ici, l'insertion a réussi d'une manière ou d'une autre
    // Mise à jour de la transaction si elle existe
    if (leadId && transactionId) {
      console.log("API finalize: Mise à jour de la transaction", transactionId);
      try {
        await supabase
          .from('payment_transactions')
          .update({ 
            lead_id: leadId,
            status: 'completed',
            updated_at: new Date().toISOString()
          })
          .eq('id', transactionId);
      } catch (txError) {
        console.warn("API finalize: Erreur mise à jour transaction (non bloquante):", txError);
      }
    }

    // Journalisation de l'activité (non bloquante)
    try {
      let activityDescription = contactMethod === 'pay_now'
        ? `Inscription avec ${transactionId ? 'paiement' : 'sans paiement'} à la promo Ramadan par ${formData.fullName}`
        : `Demande d'information pour la promo Ramadan par ${formData.fullName}`;
        
      await supabase
        .from('activity_logs')
        .insert([{
          type: 'promo_enrollment',
          description: activityDescription,
          metadata: { 
            email: formData.email, 
            leadId,
            transactionId,
            paymentStatus,
            contactMethod
          }
        }]);
        
      console.log("API finalize: Log d'activité enregistré");
    } catch (logError) {
      console.warn("API finalize: Erreur lors de la création du log (non bloquante):", logError);
    }

    console.log("API finalize: Succès de la requête");
    return NextResponse.json({
      success: true,
      leadId,
      message: "Inscription finalisée avec succès"
    });
    
  } catch (error: any) {
    console.error("API finalize: Erreur serveur non gérée:", error);
    
    // Formatage clair de l'erreur pour le client
    const errorDetails = error.message || "Erreur inconnue";
    return NextResponse.json({ 
      success: false, 
      error: "Erreur lors de la finalisation de l'inscription",
      details: errorDetails
    }, { status: 500 });
  }
}