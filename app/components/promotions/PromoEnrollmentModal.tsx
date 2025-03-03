// app/components/promotions/PromoEnrollmentModal.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/app/components/ui/dialog";
import { toast } from 'sonner';
import { supabase } from '@/app/lib/supabase';
import { Check, AlertCircle, Loader2 } from 'lucide-react';

interface PromoData {
  title: string;
  subtitle: string;
  price: {
    original: number;
    discounted: number;
  };
  endDate: string;
  maxClients: number;
  remainingSpots: number;
  deliveryTime: string;
  portfolioItems: any[];
  features: string[];
  marketingStrategy: string[];
  faqs: any[];
}

interface PromoEnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  promoData: PromoData;
}

type PaymentStatus = 'not_started' | 'initiated' | 'verified';

const PromoEnrollmentModal = ({ isOpen, onClose, promoData }: PromoEnrollmentModalProps) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [paymentWindowOpened, setPaymentWindowOpened] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('not_started');
  const [transactionId, setTransactionId] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    country: '',
    city: '',
    businessName: '',
    businessDescription: '',
    existingWebsite: '',
    howDidYouHear: '',
  });

  // Réinitialiser l'état d'erreur lors de l'ouverture du modal
  useEffect(() => {
    if (isOpen) {
      setErrorDetails(null);
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleNextStep = () => setStep(step + 1);
  const handlePrevStep = () => setStep(step - 1);

  // Calculer le montant du premier paiement (50% du prix total)
  const getPaymentAmount = () => {
    return Math.ceil(promoData.price.discounted / 2);
  };

  const openWavePayment = async () => {
    try {
      // Calculer le montant à payer (50% du prix total)
      const amountToPay = getPaymentAmount();
      
      // Générer un ID de transaction simple pour référence
      const tempTransactionId = `TX${Date.now()}${Math.floor(Math.random() * 10000)}`;
      setTransactionId(tempTransactionId);
      
      // Enregistrer la transaction AVANT d'ouvrir Wave
      try {
        const { error } = await supabase
          .from('payment_transactions')
          .insert([{
            id: tempTransactionId,
            amount: amountToPay,
            payment_option: 'partial',
            status: 'pending',
            provider: 'wave',
            transaction_type: 'promo_ramadan',
            customer_data: {
              fullName: formData.fullName,
              email: formData.email,
              phone: formData.phone,
              country: formData.country,
              city: formData.city,
              businessName: formData.businessName,
              businessDescription: formData.businessDescription
            }
          }]);
          
        if (error) {
          console.warn('Erreur lors de l\'enregistrement de la transaction:', error);
          toast.error("Erreur lors de l'enregistrement de la transaction. Veuillez réessayer.");
          return; // Ne pas continuer si l'enregistrement échoue
        } else {
          console.log('Transaction enregistrée avec ID:', tempTransactionId);
        }
      } catch (err) {
        console.warn('Erreur lors de l\'enregistrement de la transaction:', err);
        toast.error("Erreur lors de l'enregistrement de la transaction. Veuillez réessayer.");
        return; // Ne pas continuer si l'enregistrement échoue
      }
      
      // Créer le lien de paiement Wave et l'ouvrir
      const wavePaymentLink = `https://pay.wave.com/m/M_OfAgT8X_IT6P/c/sn/?amount=${amountToPay}`;
      window.open(wavePaymentLink, '_blank');
      
      // Marquer que la fenêtre de paiement a été ouverte
      setPaymentWindowOpened(true);
      setPaymentStatus('initiated');
      
      // Afficher un message à l'utilisateur
      toast.info("Veuillez compléter votre paiement Wave, puis revenir ici pour confirmer votre transaction.");
    } catch (error) {
      console.error('Erreur:', error);
      toast.error("Une erreur est survenue lors de la création du lien de paiement.");
      setPaymentStatus('not_started');
      setPaymentWindowOpened(false);
    }
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
    // Vérification pour le paiement
    if (paymentStatus !== 'verified') {
      toast.error('Veuillez vérifier votre paiement avant de finaliser votre commande');
      return;
    }
    
    setLoading(true);
    setErrorDetails(null); // Réinitialiser les erreurs
    
    try {
      // 1. Enregistrer dans formation_enrollments (table temporaire pour cette promotion)
      const { data, error } = await supabase
        .from('formation_enrollments')
        .insert([
          {
            formation_id: 'promo-ramadan-2024', // ID spécial pour cette promotion
            full_name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            country: formData.country,
            city: formData.city,
            payment_option: 'partial',
            payment_status: 'partial',
            amount_paid: getPaymentAmount(),
            metadata: {
              businessName: formData.businessName,
              businessDescription: formData.businessDescription,
              existingWebsite: formData.existingWebsite,
              howDidYouHear: formData.howDidYouHear,
              promoType: 'ramadan_2024'
            }
          }
        ])
        .select();

      if (error) {
        throw new Error(`Erreur lors de l'enregistrement: ${error.message || JSON.stringify(error)}`);
      }
      
      const enrollmentId = data?.[0]?.id;
      
      // 2. Mettre à jour la transaction de paiement avec l'ID d'inscription
      if (transactionId && enrollmentId) {
        try {
          const { error: updateError } = await supabase
            .from('payment_transactions')
            .update({ 
              enrollment_id: enrollmentId,
              status: 'completed',
              provider_transaction_id: transactionId,
              updated_at: new Date().toISOString()
            })
            .eq('id', transactionId);
            
          if (updateError) {
            console.warn('Erreur lors de la mise à jour de la transaction:', updateError);
          }
        } catch (err) {
          console.warn('Exception lors de la mise à jour de la transaction:', err);
        }
      }
      
      // 3. Enregistrer dans activity_logs
      try {
        await supabase
          .from('activity_logs')
          .insert([
            {
              type: 'promo_enrollment',
              description: `Inscription à la promo Ramadan par ${formData.fullName} pour ${formData.businessName}`,
              metadata: { 
                email: formData.email, 
                enrollmentId: enrollmentId,
                waveTransactionId: transactionId,
                promoType: 'ramadan_2024'
              }
            }
          ]);
      } catch (logError) {
        console.warn('Erreur lors de la création du log:', logError);
      }

      // Afficher un message de succès
      setSuccessMessage(`Félicitations ! Votre commande a été enregistrée avec succès. Notre équipe vous contactera dans les 24 heures pour commencer le développement de votre site e-commerce.`);
      
      // Avancer à l'étape de confirmation finale
      setStep(4);
      
    } catch (error: any) {
      console.error('Erreur détaillée:', error);
      
      const errorMessage = error.message || 'Erreur inconnue';
      setErrorDetails(errorMessage);
      
      toast.error(`Erreur: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFinalClose = () => {
    // Réinitialiser le formulaire et l'état
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      country: '',
      city: '',
      businessName: '',
      businessDescription: '',
      existingWebsite: '',
      howDidYouHear: '',
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

  // Formater le montant avec espace comme séparateur de milliers
  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#0f4c81]">
            Offre Spéciale Ramadan
          </DialogTitle>
          <DialogDescription>
            {promoData.subtitle}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          {/* Indicateur d'étapes */}
          <div className="flex items-center justify-center mb-8">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= stepNumber ? 'bg-[#ff7f50] text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
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
              <h3 className="font-medium text-lg text-[#0f4c81] mb-4">
                Vos informations personnelles
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
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
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="phone">
                  Téléphone (WhatsApp de préférence)*
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

          {/* Étape 2: Informations sur le business */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-medium text-lg text-[#0f4c81] mb-4">
                Informations sur votre business
              </h3>
              
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="businessName">
                  Nom de votre business/marque*
                </label>
                <input
                  type="text"
                  id="businessName"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff7f50]"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="businessDescription">
                  Description de votre business/produits*
                </label>
                <textarea
                  id="businessDescription"
                  name="businessDescription"
                  value={formData.businessDescription}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff7f50]"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="existingWebsite">
                  Avez-vous déjà un site web ? (Si oui, indiquez l'URL)
                </label>
                <input
                  type="text"
                  id="existingWebsite"
                  name="existingWebsite"
                  value={formData.existingWebsite}
                  onChange={handleChange}
                  placeholder="https://"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff7f50]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="howDidYouHear">
                  Comment avez-vous entendu parler de cette offre ?
                </label>
                <select
                  id="howDidYouHear"
                  name="howDidYouHear"
                  value={formData.howDidYouHear}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff7f50]"
                >
                  <option value="">Sélectionner une option</option>
                  <option value="facebook">Facebook</option>
                  <option value="instagram">Instagram</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="friend">Recommandation d'un ami</option>
                  <option value="search">Moteur de recherche</option>
                  <option value="other">Autre</option>
                </select>
              </div>
            </div>
          )}

          {/* Étape 3: Paiement et vérification */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="font-medium text-lg text-[#0f4c81] mb-4">
                Paiement de l'acompte
              </h3>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="font-medium text-[#0f4c81] mb-2">Récapitulatif de votre commande</div>
                <div className="flex justify-between mb-1">
                  <span>Site e-commerce professionnel + Stratégie Meta</span>
                  <span>{formatPrice(promoData.price.discounted)} FCFA</span>
                </div>
                <div className="flex justify-between mb-1 text-sm text-gray-500">
                  <span>Prix normal</span>
                  <span className="line-through">{formatPrice(promoData.price.original)} FCFA</span>
                </div>
                <div className="border-t border-gray-200 my-2"></div>
                <div className="flex justify-between font-bold">
                  <span>Acompte à payer maintenant (50%)</span>
                  <span className="text-[#ff7f50]">{formatPrice(getPaymentAmount())} FCFA</span>
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  Le solde de {formatPrice(getPaymentAmount())} FCFA sera à payer 30 jours après la livraison
                </div>
              </div>
              
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
                        Payer {formatPrice(getPaymentAmount())} FCFA avec Wave
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
                              disabled={paymentStatus === 'verified'}
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
          
          {/* Étape 4: Confirmation finale */}
          {step === 4 && (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-4">
                <Check className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-[#0f4c81] mb-2">Commande validée !</h3>
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
          {step < 4 && (
            <div className="flex justify-between mt-8">
              {step > 1 ? (
                <button
                  onClick={handlePrevStep}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={loading}
                >
                  Précédent
                </button>
              ) : (
                <div />
              )}
              
              {step < 3 ? (
                <button
                  onClick={handleNextStep}
                  className="px-6 py-2 bg-[#ff7f50] text-white rounded-lg hover:bg-[#ff6b3d] transition-colors"
                  disabled={
                    (step === 1 && (!formData.fullName || !formData.email || !formData.phone || !formData.country || !formData.city)) ||
                    (step === 2 && (!formData.businessName || !formData.businessDescription))
                  }
                >
                  Suivant
                </button>
              ) : step === 3 ? (
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
                  ) : 'Finaliser ma commande'}
                </button>
              ) : null}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PromoEnrollmentModal;