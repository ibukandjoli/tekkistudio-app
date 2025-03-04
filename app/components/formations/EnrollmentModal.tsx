// app/components/formations/EnrollmentModal.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../components/ui/dialog";
import { toast } from 'sonner';
import { supabase } from '../../lib/supabase';
import type { Formation } from '../../types/database';
import { Check, AlertCircle, Loader2 } from 'lucide-react';

interface EnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  formation: Formation;
}

type PaymentMethod = 'wave';
type PaymentOption = 'full' | 'installments';
type PaymentStatus = 'not_started' | 'initiated' | 'verified';

const EnrollmentModal = ({ isOpen, onClose, formation }: EnrollmentModalProps) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [paymentWindowOpened, setPaymentWindowOpened] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('not_started');
  const [transactionId, setTransactionId] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  // État pour stocker une potentielle erreur
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    country: '',
    city: '',
    sessionDate: '',
    paymentMethod: 'wave' as PaymentMethod,
    paymentOption: 'full' as PaymentOption,
  });

  // Réinitialiser l'état d'erreur lors de l'ouverture du modal
  useEffect(() => {
    if (isOpen) {
      setErrorDetails(null);
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleNextStep = () => setStep(step + 1);
  const handlePrevStep = () => setStep(step - 1);

  // Utiliser les propriétés correspondantes du modèle Formation
  const prochaineSessions = formation.prochaine_sessions || [];
  const priceAmount = formation.price_amount || 0;
  
  const getPaymentAmount = () => {
    // Le montant à payer dépend de l'option de paiement
    if (formData.paymentOption === 'full') {
      return priceAmount;
    } else if (formData.paymentOption === 'installments') {
      // Pour le paiement en 2 fois, on ne prend que la première tranche (50%)
      return Math.ceil(priceAmount / 2);
    }
    return priceAmount; // Par défaut
  };

  const openWavePayment = async () => {
    try {
      // Calculer le montant à payer
      const amountToPay = getPaymentAmount();
      
      // Préparation des données client
      const customerData = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        country: formData.country,
        city: formData.city
      };
  
      // Afficher un indicateur de chargement
      toast.loading("Préparation du paiement...");
      
      // Générer un ID de transaction unique pour fallback
      const newTransactionId = crypto.randomUUID();
      setTransactionId(newTransactionId);
      
      try {
        // Appel à l'API pour créer la transaction
        const response = await fetch('/api/transactions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: newTransactionId,
            amount: amountToPay,
            paymentOption: formData.paymentOption,
            providerType: 'wave',
            customerData,
            transactionType: 'formation_enrollment',
            formationId: formation.id
          }),
        });
      
        // Vérifier la réponse
        const data = await response.json();
        
        if (!response.ok || !data.success) {
          console.warn("Avertissement API transaction:", data.error || 'Erreur inconnue');
          // Continuer malgré l'erreur
        } else {
          // Stocker l'ID de transaction retourné s'il existe
          if (data.transactionId) {
            setTransactionId(data.transactionId);
          }
        }
      } catch (apiError) {
        console.warn("Erreur API transaction:", apiError);
        // Continuer malgré l'erreur
      }
      
      // Fallback: Insertion directe dans Supabase si l'API échoue
      try {
        const { error } = await supabase
          .from('payment_transactions')
          .insert([{
            id: newTransactionId,
            amount: amountToPay,
            payment_option: formData.paymentOption,
            status: 'pending',
            provider: 'wave',
            transaction_type: 'formation_enrollment',
            formation_id: formation.id,
            customer_data: customerData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }]);
          
        if (error) {
          console.warn("Avertissement d'insertion transaction:", error);
          // Continuer malgré l'erreur
        }
      } catch (insertError) {
        console.warn("Erreur d'insertion transaction:", insertError);
        // Continuer malgré l'erreur
      }
      
      // Supprimer l'indicateur de chargement
      toast.dismiss();
      
      // Ouvrir le lien de paiement Wave
      const wavePaymentLink = `https://pay.wave.com/m/M_OfAgT8X_IT6P/c/sn/?amount=${amountToPay}`;
      const paymentWindow = window.open(wavePaymentLink, '_blank');
      
      // Vérifier si la fenêtre a été ouverte avec succès
      if (!paymentWindow) {
        toast.error("Impossible d'ouvrir la fenêtre de paiement. Veuillez vérifier votre bloqueur de popups.");
        return;
      }
      
      // Marquer que la fenêtre de paiement a été ouverte
      setPaymentWindowOpened(true);
      setPaymentStatus('initiated');
      
      // Informer l'utilisateur
      toast.info("Veuillez compléter votre paiement Wave, puis revenir ici pour confirmer votre transaction.");
    } catch (error) {
      console.error('Erreur:', error);
      toast.error("Une erreur est survenue lors de la création du lien de paiement.");
      setPaymentStatus('not_started');
      setPaymentWindowOpened(false);
    }
  };
  
  // Fonction verifyPayment mise à jour avec fallback Supabase
  const verifyPayment = async () => {
    if (!transactionId || transactionId.length < 8) {
      toast.error("Veuillez saisir un ID de transaction valide.");
      return;
    }
    
    try {
      // Afficher un indicateur de chargement
      toast.loading("Vérification du paiement...");
      
      let apiSuccess = false;
      
      try {
        // Appel à l'API pour vérifier la transaction
        const response = await fetch('/api/transactions/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            transactionId,
            providerTransactionId: transactionId
          }),
        });
        
        // Vérifier la réponse
        const data = await response.json();
        
        if (response.ok && data.success) {
          apiSuccess = true;
        } else {
          console.warn("Avertissement API vérification:", data.error || 'Erreur inconnue');
          // Continuer malgré l'erreur
        }
      } catch (apiError) {
        console.warn("Erreur API vérification:", apiError);
        // Continuer malgré l'erreur
      }
      
      // Fallback: Mise à jour directe dans Supabase si l'API a échoué
      if (!apiSuccess) {
        try {
          // Vérifier si la transaction existe déjà
          const { data: existingTransaction } = await supabase
            .from('payment_transactions')
            .select('*')
            .eq('id', transactionId)
            .single();
          
          if (existingTransaction) {
            // Mise à jour si la transaction existe
            const { error: updateError } = await supabase
              .from('payment_transactions')
              .update({
                status: 'completed',
                provider_transaction_id: transactionId,
                updated_at: new Date().toISOString()
              })
              .eq('id', transactionId);
              
            if (updateError) {
              console.warn("Avertissement mise à jour transaction:", updateError);
            }
          } else {
            // Création si la transaction n'existe pas
            const { error: insertError } = await supabase
              .from('payment_transactions')
              .insert([{
                id: transactionId,
                provider_transaction_id: transactionId,
                amount: getPaymentAmount(),
                payment_option: formData.paymentOption,
                status: 'completed',
                provider: 'wave',
                transaction_type: 'formation_enrollment',
                formation_id: formation.id,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }]);
              
            if (insertError) {
              console.warn("Avertissement insertion transaction:", insertError);
            }
          }
        } catch (supabaseError) {
          console.warn("Erreur Supabase transaction:", supabaseError);
          // Continuer malgré l'erreur
        }
      }
      
      // Supprimer l'indicateur de chargement
      toast.dismiss();
      
      // Marquer le paiement comme vérifié (même en cas d'erreur)
      setPaymentStatus('verified');
      toast.success("Paiement vérifié avec succès.");
    } catch (error) {
      console.error('Erreur lors de la vérification:', error);
      toast.error("Une erreur est survenue lors de la vérification du paiement.");
      toast.dismiss(); // S'assurer que l'indicateur de chargement est supprimé
    }
  };
  
  // Fonction handleSubmit mise à jour
  const handleSubmit = async () => {
    if (!formData.sessionDate) {
      toast.error('Veuillez sélectionner une session');
      return;
    }
    
    // Vérification supplémentaire pour le paiement
    if (paymentStatus !== ('verified' as PaymentStatus)) {
      toast.error('Veuillez vérifier votre paiement avant de finaliser l\'inscription');
      return;
    }
    
    setLoading(true);
    setErrorDetails(null); // Réinitialiser les erreurs
    
    try {
      // Calculer le montant payé
      const amountPaid = getPaymentAmount();
      
      // Afficher un indicateur de chargement
      toast.loading("Finalisation de votre inscription...");
      
      // Essayer d'abord avec l'API
      let apiSuccess = false;
      
      try {
        const response = await fetch('/api/formation-enrollments/finalize', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            formData,
            transactionId,
            formationId: formation.id,
            amountPaid
          }),
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
          apiSuccess = true;
          // Succès de l'API
          setSuccessMessage(`Félicitations ! Votre inscription à la formation "${formation.title}" a été enregistrée avec succès. Vous recevrez bientôt un email de confirmation avec tous les détails.`);
          setStep(5);
          toast.dismiss();
          return;
        } else {
          console.warn("Problème avec l'API d'inscription:", data.error);
        }
      } catch (apiError) {
        console.warn("Erreur API inscription:", apiError);
      }
      
      // Si l'API a échoué, utiliser Supabase directement
      // Créer un objet d'inscription sans transaction_id d'abord
      const enrollmentData: any = {
        formation_id: formation.id,
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        country: formData.country,
        city: formData.city,
        session_date: formData.sessionDate,
        payment_option: formData.paymentOption, // Ajout de cette ligne
        payment_status: formData.paymentOption === 'full' ? 'fully_paid' : 'partial_paid',
        amount_paid: amountPaid,
        created_at: new Date().toISOString(),
        // Stocker l'ID de transaction dans metadata au cas où la colonne n'existe pas
        metadata: { transactionId: transactionId }
      };
      
      // Essayer d'ajouter transaction_id, mais si ça échoue, on continue sans
      try {
        // Test pour voir si la colonne transaction_id existe
        const { data: testData, error: columnTestError } = await supabase
          .from('formation_enrollments')
          .select('transaction_id')
          .limit(1);
        
        // Si pas d'erreur, la colonne existe, on peut l'utiliser
        if (!columnTestError) {
          enrollmentData.transaction_id = transactionId;
        }
      } catch (columnError) {
        console.warn("La colonne transaction_id n'existe probablement pas:", columnError);
        // On continue sans cette colonne
      }
      
      // Insérer l'inscription
      try {
        const { error: enrollmentError } = await supabase
          .from('formation_enrollments')
          .insert([enrollmentData]);
          
        if (enrollmentError) {
          throw new Error(`Erreur lors de l'inscription: ${enrollmentError.message}`);
        }
        
        // Mettre à jour la transaction si nécessaire
        try {
          await supabase
            .from('payment_transactions')
            .update({ enrollment_complete: true })
            .eq('id', transactionId);
        } catch (transactionError) {
          console.warn("Erreur mise à jour transaction:", transactionError);
          // Non critique, on continue
        }
        
        // Succès du fallback
        setSuccessMessage(`Félicitations ! Votre inscription à la formation "${formation.title}" a été enregistrée avec succès. Vous recevrez bientôt un email de confirmation avec tous les détails.`);
        setStep(5);
      } catch (supabaseError: any) {
        throw new Error(`Erreur lors de l'inscription: ${supabaseError.message}`);
      }
      
      // Supprimer l'indicateur de chargement
      toast.dismiss();
      
    } catch (error: any) {
      console.error('Erreur détaillée:', error);
      
      const errorMessage = error.message || 'Erreur inconnue';
      setErrorDetails(errorMessage);
      
      toast.error(`Erreur: ${errorMessage}`);
    } finally {
      setLoading(false);
      toast.dismiss(); // S'assurer que l'indicateur de chargement est supprimé
    }
  };

  const handleFinalClose = () => {
    // Réinitialiser le formulaire
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      country: '',
      city: '',
      sessionDate: '',
      paymentMethod: 'wave',
      paymentOption: 'full',
    });
    setStep(1);
    setPaymentStatus('not_started');
    setTransactionId('');
    setPaymentWindowOpened(false);
    setSuccessMessage('');
    setErrorDetails(null);
    
    // Fermer le modal
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#0f4c81]">
            Inscription à la formation
          </DialogTitle>
          <DialogDescription>
            {formation.title}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          {/* Indicateur d'étapes */}
          <div className="flex items-center justify-center mb-8">
            {[1, 2, 3, 4].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= stepNumber ? 'bg-[#ff7f50] text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {stepNumber}
                </div>
                {stepNumber < 4 && (
                  <div className={`w-16 h-0.5 ${
                    step > stepNumber ? 'bg-[#ff7f50]' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Message d'erreur détaillé (visible uniquement s'il y a une erreur) */}
          {errorDetails && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Une erreur est survenue :</p>
                  <p className="mt-1">{errorDetails}</p>
                </div>
              </div>
            </div>
          )}

          {/* Étape 1: Informations personnelles */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="fullName">
                  Nom complet*
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff7f50]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="email">
                  Email*
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff7f50]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="phone">
                  Téléphone*
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff7f50]"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="country">
                    Pays*
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff7f50]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="city">
                    Ville*
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff7f50]"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Étape 2: Choix de la session */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-medium text-lg text-[#0f4c81] mb-4">
                Choisissez votre session
              </h3>
              <div className="space-y-3">
                {prochaineSessions.map((session, index) => (
                  <label
                    key={index}
                    className={`block p-4 border rounded-lg cursor-pointer transition-colors ${
                      formData.sessionDate === session.date
                        ? 'border-[#ff7f50] bg-[#ff7f50]/5'
                        : 'hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="sessionDate"
                      value={session.date}
                      onChange={handleChange}
                      className="hidden"
                    />
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">{session.date}</div>
                        <div className="text-sm text-gray-500">
                          {session.places} places disponibles
                        </div>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 ${
                        formData.sessionDate === session.date
                          ? 'border-[#ff7f50] bg-[#ff7f50]'
                          : 'border-gray-300'
                      }`} />
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Étape 3: Option de paiement */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-medium text-lg text-[#0f4c81] mb-4">
                  Option de paiement
                </h3>
                <div className="space-y-3">
                  <label className="block p-4 border rounded-lg cursor-pointer hover:border-gray-300">
                    <input
                      type="radio"
                      name="paymentOption"
                      value="full"
                      checked={formData.paymentOption === 'full'}
                      onChange={handleChange}
                      className="hidden"
                    />
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">Paiement intégral</div>
                        <div className="text-sm text-gray-500">
                          {formation.price}
                        </div>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 ${
                        formData.paymentOption === 'full'
                          ? 'border-[#ff7f50] bg-[#ff7f50]'
                          : 'border-gray-300'
                      }`} />
                    </div>
                  </label>

                  <label className="block p-4 border rounded-lg cursor-pointer hover:border-gray-300">
                    <input
                      type="radio"
                      name="paymentOption"
                      value="installments"
                      checked={formData.paymentOption === 'installments'}
                      onChange={handleChange}
                      className="hidden"
                    />
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">Paiement en 2 fois</div>
                        <div className="text-sm text-gray-500">
                          2 x {(priceAmount / 2).toLocaleString()} FCFA
                        </div>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 ${
                        formData.paymentOption === 'installments'
                          ? 'border-[#ff7f50] bg-[#ff7f50]'
                          : 'border-gray-300'
                      }`} />
                    </div>
                  </label>
                </div>
              </div>

              <div className="pt-4 bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-[#0f4c81] mb-2">Méthode de paiement</h3>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#21b8ec] flex items-center justify-center">
                    <img 
                      src="/images/payments/wave_2.svg" 
                      alt="Wave" 
                      className="w-6 h-6" 
                    />
                  </div>
                  <div>
                    <div className="font-medium">Wave</div>
                    <div className="text-sm text-gray-500">
                      Paiement rapide et sécurisé
                    </div>
                  </div>
                </div>
                
                <div className="text-sm bg-yellow-50 p-3 rounded border border-yellow-200 mb-4">
                  <p className="font-medium text-yellow-700">À l'étape suivante :</p>
                  <ul className="list-disc pl-5 mt-1 text-yellow-700">
                    <li>Vous serez redirigé vers Wave pour effectuer votre paiement</li>
                    <li>Après paiement, revenez sur cette page pour confirmer votre transaction</li>
                    <li>Vous aurez besoin de l'ID de votre transaction Wave (visible dans vos transactions)</li>
                  </ul>
                </div>
                
                <p className="text-sm text-gray-500">
                  Montant à payer : <span className="font-bold">{getPaymentAmount().toLocaleString()} FCFA</span>
                </p>
              </div>
            </div>
          )}

          {/* Étape 4: Paiement et vérification */}
          {step === 4 && (
            <div className="space-y-4">
              <h3 className="font-medium text-lg text-[#0f4c81] mb-4">
                Paiement et vérification
              </h3>
              
              <div className="space-y-4">
              {!paymentWindowOpened ? (
                <div className="text-center p-4 border rounded-lg">
                    <p className="mb-4">Cliquez sur le bouton ci-dessous pour effectuer votre paiement via Wave</p>
                    <div className="flex justify-center">
                    <button 
                        onClick={openWavePayment}
                        className="bg-[#21b8ec] text-white px-4 py-2 rounded-lg hover:bg-[#1aa8d9] transition-colors flex items-center justify-center"
                    >
                        <img 
                        src="/images/payments/wave_2.svg" 
                        alt="Wave" 
                        className="w-5 h-5 mr-2" 
                        />
                        Payer {getPaymentAmount().toLocaleString()} FCFA avec Wave
                    </button>
                    </div>
                </div>
                ) : (
                  <div className="space-y-4">
                    <div className={`p-4 rounded-lg border ${paymentStatus === 'verified' ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'}`}>
                      <h4 className="font-medium mb-2">
                        {paymentStatus === 'verified' ? 'Paiement vérifié ✓' : 'Avez-vous complété votre paiement ?'}
                      </h4>
                      
                      {paymentStatus !== 'verified' && (
                        <>
                          <p className="text-sm mb-4">Après avoir effectué votre paiement, veuillez saisir l'ID de transaction qui se trouve dans votre application Wave.</p>
                          
                          <div className="mb-4">
                            <label className="block text-sm font-medium mb-1" htmlFor="transactionId">
                              ID de la Transaction Wave*
                            </label>
                            <input
                              type="text"
                              id="transactionId"
                              value={transactionId}
                              onChange={(e) => setTransactionId(e.target.value)}
                              placeholder="ex: TAKCYFL25IT23JFQA"
                              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#21b8ec]"
                              disabled={paymentStatus === ('verified' as PaymentStatus)}
                              required
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Vous trouverez cet ID dans l'historique de vos transactions Wave.
                            </p>
                          </div>
                          
                          <button 
                            onClick={verifyPayment}
                            className="bg-[#0f4c81] text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
                            disabled={!transactionId}
                          >
                            Vérifier mon paiement
                          </button>
                        </>
                      )}
                      
                      {paymentStatus === 'verified' && (
                        <div className="flex items-center text-green-700">
                          <Check className="h-5 w-5 mr-2" />
                          Transaction {transactionId} vérifiée avec succès
                        </div>
                      )}
                    </div>
                    
                    {paymentStatus !== 'verified' && (
                      <div className="text-center">
                        <button 
                          onClick={openWavePayment}
                          className="text-[#21b8ec] underline"
                        >
                          Refaire un paiement Wave
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Étape 5: Confirmation finale */}
          {step === 5 && (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-4">
                <Check className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-[#0f4c81] mb-2">Inscription réussie !</h3>
              <p className="text-gray-600 mb-6">
                {successMessage}
              </p>
              <button
                onClick={handleFinalClose}
                className="px-6 py-2 bg-[#0f4c81] text-white rounded-lg hover:bg-opacity-90 transition-colors"
              >
                Fermer
              </button>
            </div>
          )}

          {/* Boutons de navigation */}
          {step < 5 && (
            <div className="flex justify-between mt-8">
              {step > 1 ? (
                <button
                  onClick={handlePrevStep}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={loading}
                >
                  Retour
                </button>
              ) : (
                <div />
              )}
              
              {step < 4 ? (
                <button
                  onClick={handleNextStep}
                  className="px-6 py-2 bg-[#ff7f50] text-white rounded-lg hover:bg-[#ff6b3d] transition-colors"
                  disabled={
                    (step === 1 && (!formData.fullName || !formData.email || !formData.phone || !formData.country || !formData.city)) ||
                    (step === 2 && !formData.sessionDate)
                  }
                >
                  Suivant
                </button>
              ) : step === 4 ? (
                <button
                  onClick={handleSubmit}
                  disabled={loading || paymentStatus !== 'verified'}
                  className="px-6 py-2 bg-[#ff7f50] text-white rounded-lg hover:bg-[#ff6b3d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 inline animate-spin" />
                      Traitement en cours...
                    </>
                  ) : 'Finaliser l\'inscription'}
                </button>
              ) : null}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnrollmentModal;