// app/api/create-payment-link/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';
import { randomUUID } from 'crypto';

export async function POST(request: Request) {
  try {
    const { formationId, paymentOption, formData } = await request.json();
    
    // Vérification de la formation et récupération des informations
    const { data: formation, error } = await supabase
      .from('formations')
      .select('*')
      .eq('id', formationId)
      .single();
      
    if (error || !formation) {
      return NextResponse.json({ error: 'Formation non trouvée' }, { status: 404 });
    }
    
    // Calcul sécurisé du montant côté serveur
    const amountToPay = paymentOption === 'installments'
      ? Math.ceil(formation.price_amount / 2)
      : formation.price_amount;
      
    // Création d'un identifiant unique pour cette transaction
    const transactionId = randomUUID();
    
    // Stocker la transaction en attente dans la base de données
    const { data: transaction, error: insertError } = await supabase
      .from('payment_transactions')
      .insert([{
        id: transactionId,
        formation_id: formationId,
        amount: amountToPay,
        payment_option: paymentOption,
        status: 'pending',
        provider: 'wave',
        customer_data: formData
      }])
      .select()
      .single();
    
    if (insertError) {
      console.error('Erreur lors de la création de la transaction:', insertError);
      return NextResponse.json({ error: 'Erreur lors de la création de la transaction' }, { status: 500 });
    }
    
    // Création du lien Wave avec seulement le montant
    // Gardons une URL propre comme Wave l'attend
    const wavePaymentLink = `https://pay.wave.com/m/M_OfAgT8X_IT6P/c/sn/?amount=${amountToPay}`;
    
    return NextResponse.json({ 
      success: true,
      paymentLink: wavePaymentLink, 
      transactionId: transaction.id 
    });
  } catch (error) {
    console.error('Erreur lors de la création du lien de paiement:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur' }, { status: 500 });
  }
}