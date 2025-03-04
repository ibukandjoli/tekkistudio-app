// app/api/ramadan-leads/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';
import { checkAdminAuth } from '@/app/lib/auth-utils';

export async function GET(request: NextRequest) {
  // Vérifier l'authentification admin
  const authCheck = await checkAdminAuth();
  if (!authCheck.isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    
    // Si un ID est fourni, récupérer un lead spécifique
    if (id) {
      // D'abord essayer de lire depuis la table ramadan_promo_leads
      let { data: leadData, error: leadError } = await supabase
        .from('ramadan_promo_leads')
        .select('*')
        .eq('id', id)
        .single();
      
      // Si la table n'existe pas encore, utiliser formation_enrollments comme fallback
      if (leadError && leadError.code === '42P01') {
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('formation_enrollments')
          .select('*')
          .eq('id', id)
          .single();
          
        if (fallbackError) {
          return NextResponse.json({ error: fallbackError.message }, { status: 500 });
        }
        
        // Convertir les données du fallback au format attendu
        leadData = {
          id: fallbackData.id,
          created_at: fallbackData.created_at,
          full_name: fallbackData.full_name,
          email: fallbackData.email,
          phone: fallbackData.phone,
          country: fallbackData.country,
          city: fallbackData.city,
          business_name: fallbackData.metadata?.businessName || '',
          business_description: fallbackData.metadata?.businessDescription || '',
          existing_website: fallbackData.metadata?.existingWebsite || '',
          lead_source: fallbackData.metadata?.howDidYouHear || '',
          payment_status: fallbackData.payment_status,
          amount_paid: fallbackData.amount_paid,
          total_amount: fallbackData.amount_paid * 2, // Estimation basée sur 50%
          transaction_id: fallbackData.metadata?.transactionId || '',
          status: fallbackData.metadata?.status || 'new',
          notes: fallbackData.metadata?.notes || ''
        };
      } else if (leadError) {
        return NextResponse.json({ error: leadError.message }, { status: 500 });
      }
      
      return NextResponse.json({ lead: leadData });
    }
    
    // Sinon, récupérer tous les leads
    // D'abord essayer de lire depuis la table ramadan_promo_leads
    let { data: ramadanLeads, error: ramadanError } = await supabase
      .from('ramadan_promo_leads')
      .select('*')
      .order('created_at', { ascending: false });
    
    // Si la table n'existe pas encore, utiliser formation_enrollments comme fallback
    if (ramadanError && ramadanError.code === '42P01') {
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('formation_enrollments')
        .select('*')
        .eq('formation_id', 'promo-ramadan-2024')
        .order('created_at', { ascending: false });
        
      if (fallbackError) {
        return NextResponse.json({ error: fallbackError.message }, { status: 500 });
      }
      
      // Convertir les données du fallback au format attendu
      const convertedLeads = (fallbackData || []).map(fallbackLead => ({
        id: fallbackLead.id,
        created_at: fallbackLead.created_at,
        full_name: fallbackLead.full_name,
        email: fallbackLead.email,
        phone: fallbackLead.phone,
        country: fallbackLead.country,
        city: fallbackLead.city,
        business_name: fallbackLead.metadata?.businessName || '',
        business_description: fallbackLead.metadata?.businessDescription || '',
        existing_website: fallbackLead.metadata?.existingWebsite || '',
        lead_source: fallbackLead.metadata?.howDidYouHear || '',
        payment_status: fallbackLead.payment_status,
        amount_paid: fallbackLead.amount_paid,
        total_amount: fallbackLead.amount_paid * 2, // Estimation basée sur 50%
        transaction_id: fallbackLead.metadata?.transactionId || '',
        status: fallbackLead.metadata?.status || 'new',
        notes: fallbackLead.metadata?.notes || ''
      }));
      
      return NextResponse.json({ leads: convertedLeads });
    } else if (ramadanError) {
      return NextResponse.json({ error: ramadanError.message }, { status: 500 });
    }
    
    return NextResponse.json({ leads: ramadanLeads || [] });
  } catch (error: any) {
    console.error('Error in API route:', error);
    return NextResponse.json({ error: error.message || 'An error occurred' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  // Vérifier l'authentification admin
  const authCheck = await checkAdminAuth();
  if (!authCheck.isAuthenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const data = await request.json();
    const { id, status, notes } = data;
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    
    // Construire l'objet de mise à jour
    const updateData: Record<string, any> = {};
    if (status !== undefined) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;
    
    // Si aucune donnée à mettre à jour, retourner une erreur
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No data to update' }, { status: 400 });
    }
    
    // D'abord essayer de mettre à jour dans la table principale
    const { error: updateError } = await supabase
      .from('ramadan_promo_leads')
      .update(updateData)
      .eq('id', id);
    
    if (updateError) {
      if (updateError.code === '42P01') { // Si la table n'existe pas
        // Récupérer d'abord les données actuelles pour les métadonnées
        const { data: currentData, error: fetchError } = await supabase
          .from('formation_enrollments')
          .select('metadata')
          .eq('id', id)
          .single();
          
        if (fetchError) {
          return NextResponse.json({ error: fetchError.message }, { status: 500 });
        }
        
        // Mettre à jour les métadonnées dans la table fallback
        const { error: fallbackError } = await supabase
          .from('formation_enrollments')
          .update({
            metadata: {
              ...currentData.metadata,
              ...(status !== undefined ? { status } : {}),
              ...(notes !== undefined ? { notes } : {})
            }
          })
          .eq('id', id);
        
        if (fallbackError) {
          return NextResponse.json({ error: fallbackError.message }, { status: 500 });
        }
      } else {
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }
    }
    
    // Enregistrer l'activité si le statut a été modifié
    if (status !== undefined) {
      await supabase
        .from('activity_logs')
        .insert([
          {
            type: 'lead_status_update',
            description: `Statut du lead Ramadan mis à jour pour l'ID ${id}: ${status}`,
            metadata: { 
              leadId: id,
              newStatus: status
            }
          }
        ]);
    }
    
    return NextResponse.json({ success: true, message: 'Lead updated successfully' });
  } catch (error: any) {
    console.error('Error in API route:', error);
    return NextResponse.json({ error: error.message || 'An error occurred' }, { status: 500 });
  }
}