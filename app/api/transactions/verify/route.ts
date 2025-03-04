// app/api/transactions/verify/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase"; 

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { transactionId, providerTransactionId } = body;

    if (!transactionId || !providerTransactionId) {
      return NextResponse.json({ 
        success: false, 
        error: "ID de transaction et ID de transaction du fournisseur requis" 
      }, { status: 400 });
    }

    // Vérifier si la transaction existe
    const { data: transaction, error: fetchError } = await supabase
      .from('payment_transactions')
      .select('*')
      .eq('id', transactionId)
      .single();

    if (fetchError || !transaction) {
      console.error("Erreur lors de la récupération de la transaction:", fetchError);
      return NextResponse.json({ 
        success: false, 
        error: "Transaction non trouvée" 
      }, { status: 404 });
    }

    // Mettre à jour le statut et l'ID de transaction du fournisseur
    const { error: updateError } = await supabase
      .from('payment_transactions')
      .update({
        status: 'completed',
        provider_transaction_id: providerTransactionId,
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
            providerTransactionId,
            amount: transaction.amount,
            provider: transaction.provider
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