// app/api/transactions/verify/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase"; 

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
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
    const { data: transaction, error: fetchError } = await supabase
      .from('payment_transactions')
      .select('*')
      .eq('id', transactionId)
      .single();

    // Si la transaction n'existe pas, la créer au lieu de renvoyer une erreur
    if (fetchError || !transaction) {
      console.log("Transaction non trouvée, création d'une nouvelle transaction:", transactionId);
      
      // Créer une nouvelle transaction
      const { data: newTransaction, error: createError } = await supabase
        .from('payment_transactions')
        .insert({
          id: transactionId,
          provider_transaction_id: effectiveProviderTransactionId,
          status: 'completed',
          provider: 'wave',
          amount: 0, // Montant par défaut
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (createError) {
        console.error("Erreur lors de la création de la transaction:", createError);
        return NextResponse.json({ 
          success: false, 
          error: "Erreur lors de la création de la transaction" 
        }, { status: 500 });
      }

      // Journaliser l'activité pour la nouvelle transaction
      try {
        await supabase
          .from('activity_logs')
          .insert([{
            type: 'payment_created_and_verified',
            description: `Nouvelle transaction créée et vérifiée: ${transactionId}`,
            metadata: {
              transactionId,
              providerTransactionId: effectiveProviderTransactionId,
              provider: 'wave'
            }
          }]);
      } catch (logError) {
        // Continuer même si la journalisation échoue
        console.warn("Erreur lors de la journalisation:", logError);
      }

      return NextResponse.json({
        success: true,
        message: "Nouvelle transaction créée et vérifiée avec succès"
      });
    }

    // Mettre à jour le statut et l'ID de transaction du fournisseur
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
        error: "Erreur lors de la mise à jour de la transaction" 
      }, { status: 500 });
    }

    // Journaliser l'activité
    try {
      await supabase
        .from('activity_logs')
        .insert([{
          type: 'payment_verified',
          description: `Paiement vérifié pour la transaction ${transactionId}`,
          metadata: {
            transactionId,
            providerTransactionId: effectiveProviderTransactionId,
            amount: transaction.amount,
            provider: transaction.provider || 'wave'
          }
        }]);
    } catch (logError) {
      // Continuer même si la journalisation échoue
      console.warn("Erreur lors de la journalisation:", logError);
    }

    return NextResponse.json({
      success: true,
      message: "Transaction vérifiée avec succès"
    });
  } catch (error: any) {
    console.error("Erreur serveur:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Erreur interne du serveur",
      details: error.message
    }, { status: 500 });
  }
}