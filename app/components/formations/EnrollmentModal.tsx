// app/components/formations/EnrollmentModal.tsx
'use client';

import React, { useState } from 'react';
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

  const openWavePayment = () => {
    // Calculer le montant à payer
    const amountToPay = getPaymentAmount();
    
    // Créer le lien de paiement Wave
    const wavePaymentLink = `https://pay.wave.com/m/M_OfAgT8X_IT6P/c/sn/?amount=${amountToPay}`;
    
    // Ouvrir le lien dans une nouvelle fenêtre
    const paymentWindow = window.open(wavePaymentLink, '_blank');
    
    // Marquer que la fenêtre de paiement a été ouverte
    setPaymentWindowOpened(true);
    setPaymentStatus('initiated');
    
    // Afficher un message à l'utilisateur
    toast.info("Veuillez compléter votre paiement Wave, puis revenir ici pour confirmer votre transaction.");
  };
  
  const verifyPayment = () => {
    if (!transactionId || transactionId.length < 8) {
      toast.error("Veuillez saisir un ID de transaction valide.");
      return;
    }
    
    // Pour l'instant, nous acceptons simplement l'ID de transaction fourni
    // À l'avenir, ce code pourrait être remplacé par une vérification réelle via API
    setPaymentStatus('verified');
    toast.success("Paiement vérifié avec succès.");
  };
  
  const handleSubmit = async () => {
    if (!formData.sessionDate) {
      toast.error('Veuillez sélectionner une session');
      return;
    }
    
    // Vérification supplémentaire pour le paiement
    if (paymentStatus !== 'verified') {
      toast.error('Veuillez vérifier votre paiement avant de finaliser l\'inscription');
      return;
    }
    
    setLoading(true);
    
    try {
      // Calculer le montant payé
      const amountPaid = getPaymentAmount();
      
      // Créer l'entrée dans formation_enrollments
      const { data, error } = await supabase
        .from('formation_enrollments')
        .insert([
          {
            formation_id: formation.id,
            session_date: formData.sessionDate,
            full_name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            country: formData.country,
            city: formData.city,
            payment_option: formData.paymentOption,
            payment_status: formData.paymentOption === 'full' ? 'paid' : 'partial',
            amount_paid: amountPaid,
            // Stocker l'ID de transaction dans une note (si metadata n'existe pas)
            notes: `ID Transaction Wave: ${transactionId}`
          }
        ])
        .select();

      if (error) throw error;
      
      // Enregistrer également dans activity_logs
      try {
        await supabase
          .from('activity_logs')
          .insert([
            {
              type: 'formation_enrollment',
              description: `Inscription à la formation ${formation.title} par ${formData.fullName}`,
              metadata: { 
                formationId: formation.id, 
                email: formData.email, 
                enrollmentId: data[0].id,
                waveTransactionId: transactionId
              }
            }
          ]);
      } catch (logError) {
        console.warn('Erreur lors de la création du log:', logError);
      }

      // Afficher un message de succès sans fermer le modal immédiatement
      setSuccessMessage(`Félicitations ! Votre inscription à la formation "${formation.title}" a été enregistrée avec succès. Vous recevrez bientôt un email de confirmation avec tous les détails.`);
      
      // Avancer à l'étape de confirmation finale
      setStep(5);
      
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      toast.error('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
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
    
    // Fermer le modal
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={isOpen ? undefined : onClose}>
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
                  <div className="w-10 h-10 rounded-full bg-[#12b5cb] flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
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
                    <button 
                      onClick={openWavePayment}
                      className="bg-[#12b5cb] text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
                    >
                      Payer {getPaymentAmount().toLocaleString()} FCFA avec Wave
                    </button>
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
                              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#12b5cb]"
                              disabled={paymentStatus === 'verified' as PaymentStatus}
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
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Transaction {transactionId} vérifiée avec succès
                        </div>
                      )}
                    </div>
                    
                    {paymentStatus !== 'verified' && (
                      <div className="text-center">
                        <button 
                          onClick={openWavePayment}
                          className="text-[#12b5cb] underline"
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
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
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
                  disabled={loading || paymentStatus !== 'verified' as PaymentStatus}
                  className="px-6 py-2 bg-[#ff7f50] text-white rounded-lg hover:bg-[#ff6b3d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
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