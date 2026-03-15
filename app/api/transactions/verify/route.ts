// app/api/transactions/verify/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  { auth: { autoRefreshToken: false, persistSession: false } }
);

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

    const effectiveProviderTransactionId = providerTransactionId || transactionId;

    // Rechercher par id
    let { data: transaction, error: fetchError } = await supabaseAdmin
      .from('payment_transactions')
      .select('*')
      .eq('id', transactionId)
      .maybeSingle();

    // Rechercher par provider_transaction_id si pas trouvé
    if (!transaction && !fetchError) {
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

    // Ne jamais créer une transaction inconnue — refuser si introuvable
    if (!transaction) {
      return NextResponse.json({
        success: false,
        error: "Transaction introuvable"
      }, { status: 404 });
    }

    const { error: updateError } = await supabaseAdmin
      .from('payment_transactions')
      .update({
        status: 'completed',
        provider_transaction_id: effectiveProviderTransactionId,
        updated_at: new Date().toISOString()
      })
      .eq('id', transaction.id);

    if (updateError) {
      console.error("API verify: Erreur de mise à jour", updateError.code);
      return NextResponse.json({
        success: false,
        error: "Erreur lors de la mise à jour de la transaction"
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Transaction vérifiée avec succès",
      data: { id: transaction.id, status: 'completed' }
    });
  } catch (error: any) {
    console.error("API verify: Erreur non gérée", error.code || error.name);
    return NextResponse.json({
      success: false,
      error: "Erreur interne du serveur"
    }, { status: 500 });
  }
}
