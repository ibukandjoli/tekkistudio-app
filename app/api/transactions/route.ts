// app/api/transactions/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

// Créer un client Supabase avec les permissions admin
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || '', // Attention: ceci est la clé service avec accès admin
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export async function POST(request: NextRequest) {
  try {
    console.log("API /transactions: Début de la requête");
    const body = await request.json();
    console.log("API /transactions: Corps de la requête reçu", JSON.stringify(body));
    
    const { 
      amount, 
      paymentOption, 
      providerType = 'wave',
      customerData,
      transactionType,
      formationId = null
    } = body;

    // Validation des données requises
    if (!amount || !customerData) {
      console.log("API /transactions: Données manquantes", { amount, customerData });
      return NextResponse.json({ 
        success: false, 
        error: "Données incomplètes pour la transaction" 
      }, { status: 400 });
    }

    // Création d'un ID de transaction unique
    const transactionId = randomUUID();
    console.log("API /transactions: ID de transaction généré", transactionId);

    // Données de la transaction
    const transactionData = {
      id: transactionId,
      amount,
      payment_option: paymentOption,
      status: 'pending',
      provider: providerType,
      transaction_type: transactionType || 'generic',
      formation_id: formationId,
      customer_data: customerData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    console.log("API /transactions: Données de transaction prêtes", JSON.stringify(transactionData));

    try {
      // Enregistrement dans la table payment_transactions avec le client admin
      const { error } = await supabaseAdmin
        .from('payment_transactions')
        .insert([transactionData]);

      if (error) {
        console.error("API /transactions: Erreur d'insertion", error);
        
        // Journaliser l'erreur mais poursuivre sans bloquer l'utilisateur
        // Cela permet à l'utilisateur de continuer même si l'insertion échoue
        console.warn("Poursuite de la transaction malgré l'erreur d'insertion");
      } else {
        console.log("API /transactions: Transaction enregistrée avec succès");
      }
    } catch (insertError) {
      console.error("API /transactions: Exception pendant l'insertion", insertError);
      // Ne pas bloquer le processus si l'insertion échoue
    }

    // Construction et retour du lien Wave
    const wavePaymentLink = `https://pay.wave.com/m/M_OfAgT8X_IT6P/c/sn/?amount=${amount}`;
    
    return NextResponse.json({
      success: true,
      transactionId,
      paymentLink: wavePaymentLink
    });
  } catch (error: any) {
    console.error("API /transactions: Erreur critique", error);
    return NextResponse.json({ 
      success: false, 
      error: "Erreur interne du serveur",
      details: error.message
    }, { status: 500 });
  }
}