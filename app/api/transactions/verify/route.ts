// app/api/transactions/verify/route.ts
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
  console.log("API verify: Début de la requête");
  
  try {
    const body = await request.json();
    console.log("API verify: Corps de la requête", JSON.stringify(body));
    
    const { transactionId, providerTransactionId } = body;

    if (!transactionId) {
      console.log("API verify: ID de transaction manquant");
      return NextResponse.json({ 
        success: false, 
        error: "ID de transaction requis" 
      }, { status: 400 });
    }

    // Utiliser l'ID de transaction comme ID fournisseur si non spécifié
    const effectiveProviderTransactionId = providerTransactionId || transactionId;

    // Vérifier si la transaction existe
    console.log("API verify: Recherche de la transaction", transactionId);
    let { data: transaction, error: fetchError } = await supabaseAdmin
      .from('payment_transactions')
      .select('*')
      .eq('id', transactionId)
      .maybeSingle();

    // Vérifier également par provider_transaction_id si pas trouvé par id
    if (!transaction && !fetchError) {
      console.log("API verify: Recherche par provider_transaction_id", effectiveProviderTransactionId);
      const { data: altTransaction, error: altFetchError } = await supabaseAdmin
        .from('payment_transactions')
        .select('*')
        .eq('provider_transaction_id', effectiveProviderTransactionId)
        .maybeSingle();
        
      if (altTransaction) {
        transaction = altTransaction;
      } else if (altFetchError) {
        fetchError = altFetchError;
      }
    }

    // Si la transaction n'existe pas, la créer
    if (!transaction) {
      console.log("API verify: Transaction non trouvée, création");
      
      // Générer un nouvel UUID pour la transaction
      const dbUuid = transactionId.includes("-") ? transactionId : uuidv4();
      
      const transactionData = {
        id: dbUuid,
        provider_transaction_id: effectiveProviderTransactionId,
        status: 'completed',
        provider: 'wave',
        amount: 0, // Montant par défaut
        transaction_type: 'ecommerce',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        customer_data: { source: 'ecommerce_verification' }
      };
      
      console.log("API verify: Données de création", JSON.stringify(transactionData));
      
      const { data: newTransaction, error: createError } = await supabaseAdmin
        .from('payment_transactions')
        .insert([transactionData])
        .select()
        .maybeSingle();

      if (createError) {
        console.error("API verify: Erreur de création", createError);
        return NextResponse.json({ 
          success: false, 
          error: "Erreur lors de la création de la transaction",
          details: createError.message 
        }, { status: 500 });
      }
      
      transaction = newTransaction;
      console.log("API verify: Transaction créée avec succès");

      // Journaliser l'activité
      try {
        await supabaseAdmin
          .from('activity_logs')
          .insert([{
            type: 'payment_created_and_verified',
            description: `Nouvelle transaction créée et vérifiée: ${transactionId}`,
            metadata: {
              transactionId,
              providerTransactionId: effectiveProviderTransactionId,
              provider: 'wave'
            },
            created_at: new Date().toISOString()
          }]);
          
        console.log("API verify: Activité journalisée");
      } catch (logError) {
        console.warn("API verify: Erreur de journalisation (non bloquante)", logError);
      }
    } else {
      // Mettre à jour le statut
      console.log("API verify: Mise à jour de la transaction existante");
      const { error: updateError } = await supabaseAdmin
        .from('payment_transactions')
        .update({
          status: 'completed',
          provider_transaction_id: effectiveProviderTransactionId,
          updated_at: new Date().toISOString()
        })
        .eq('id', transaction.id);

      if (updateError) {
        console.error("API verify: Erreur de mise à jour", updateError);
        return NextResponse.json({ 
          success: false, 
          error: "Erreur lors de la mise à jour de la transaction",
          details: updateError.message
        }, { status: 500 });
      }
      
      console.log("API verify: Transaction mise à jour avec succès");
    }

    return NextResponse.json({
      success: true,
      message: "Transaction vérifiée avec succès",
      data: {
        id: transaction.id,
        status: 'completed'
      }
    });
  } catch (error: any) {
    console.error("API verify: Erreur non gérée", error);
    return NextResponse.json({ 
      success: false, 
      error: "Erreur interne du serveur",
      details: error.message || "Erreur inconnue"
    }, { status: 500 });
  }
}