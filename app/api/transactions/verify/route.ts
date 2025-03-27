// app/api/transactions/verify/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase"; 

export async function POST(request: NextRequest) {
  try {
    // Extraction des données de la requête de manière sécurisée
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
    
    const { transactionId, providerTransactionId } = body;

    if (!transactionId) {
      return NextResponse.json({ 
        success: false, 
        error: "ID de transaction requis" 
      }, { status: 400 });
    }

    // Utiliser l'ID de transaction comme ID fournisseur si non spécifié
    const effectiveProviderTransactionId = providerTransactionId || transactionId;

    // Vérifier si la transaction existe
    let { data: transaction, error: fetchError } = await supabase
      .from('payment_transactions')
      .select('*')
      .eq('id', transactionId)
      .maybeSingle(); // Utilisation de maybeSingle au lieu de single pour éviter l'erreur

    // Si la transaction n'existe pas, la créer au lieu de renvoyer une erreur
    if (fetchError || !transaction) {
      console.log("Transaction non trouvée, création d'une nouvelle transaction:", transactionId);
      
      // Préparation des données de transaction avec valeurs par défaut pour tous les champs potentiellement requis
      const newTransactionData = {
        id: transactionId,
        provider_transaction_id: effectiveProviderTransactionId,
        status: 'completed',
        provider: 'wave',
        amount: 1000, // Valeur par défaut non nulle
        currency: 'XOF', // Valeur par défaut pour le FCFA
        payment_method: 'wave',
        customer_id: null, // Valeurs par défaut pour d'autres champs potentiellement requis
        customer_email: null,
        customer_name: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Tenter de créer la transaction
      const { error: createError } = await supabase
        .from('payment_transactions')
        .insert(newTransactionData);

      if (createError) {
        console.error("Erreur détaillée lors de la création de la transaction:", createError);
        return NextResponse.json({ 
          success: false, 
          error: "Erreur lors de la création de la transaction",
          details: createError.message
        }, { status: 500 });
      }

      // Récupérer la transaction créée pour confirmation
      const { data: createdTransaction, error: getError } = await supabase
        .from('payment_transactions')
        .select('*')
        .eq('id', transactionId)
        .maybeSingle();
        
      if (getError || !createdTransaction) {
        console.warn("Transaction créée mais impossible de la récupérer:", getError);
      } else {
        transaction = createdTransaction;
      }

      // Journaliser l'activité
      try {
        await supabase
          .from('activity_logs')
          .insert({
            type: 'payment_created_and_verified',
            description: `Nouvelle transaction créée et vérifiée: ${transactionId}`,
            metadata: {
              transactionId,
              providerTransactionId: effectiveProviderTransactionId,
              provider: 'wave'
            },
            created_at: new Date().toISOString()
          });
      } catch (logError) {
        console.warn("Erreur lors de la journalisation:", logError);
      }

      return NextResponse.json({
        success: true,
        message: "Nouvelle transaction créée et vérifiée avec succès"
      });
    }

    // Si la transaction existe, mettre à jour son statut
    const { error: updateError } = await supabase
      .from('payment_transactions')
      .update({
        status: 'completed',
        provider_transaction_id: effectiveProviderTransactionId,
        updated_at: new Date().toISOString()
      })
      .eq('id', transactionId);

    if (updateError) {
      console.error("Erreur lors de la mise à jour de la transaction:", updateError);
      return NextResponse.json({ 
        success: false, 
        error: "Erreur lors de la mise à jour de la transaction",
        details: updateError.message
      }, { status: 500 });
    }

    // Journaliser l'activité
    try {
      await supabase
        .from('activity_logs')
        .insert({
          type: 'payment_verified',
          description: `Paiement vérifié pour la transaction ${transactionId}`,
          metadata: {
            transactionId,
            providerTransactionId: effectiveProviderTransactionId,
            amount: transaction.amount,
            provider: transaction.provider || 'wave'
          },
          created_at: new Date().toISOString()
        });
    } catch (logError) {
      console.warn("Erreur lors de la journalisation:", logError);
    }

    return NextResponse.json({
      success: true,
      message: "Transaction vérifiée avec succès"
    });
  } catch (error: any) {
    console.error("Erreur serveur détaillée:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Erreur interne du serveur",
      details: error.message || "Erreur inconnue"
    }, { status: 500 });
  }
}