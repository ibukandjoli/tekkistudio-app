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
import { Check, AlertCircle, Loader2, Info } from 'lucide-react';

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

// Définir correctement le type avec les trois états possibles
type PaymentStatus = 'not_started' | 'initiated' | 'verified';
type PaymentOption = 'full' | 'partial';
type ContactMethod = 'pay_now' | 'contact_later';

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
    paymentOption: 'partial' as PaymentOption, // Option de paiement par défaut (en 2 fois)
    contactMethod: 'pay_now' as ContactMethod, // Nouvelle propriété
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

  // Calculer le montant du paiement en fonction de l'option choisie
  const getPaymentAmount = (): number => {
    if (formData.paymentOption === 'full') {
      // Paiement intégral avec réduction de 10%
      return Math.ceil(promoData.price.discounted * 0.9);
    } else {
      // Paiement en 2 fois (50% maintenant)
      return Math.ceil(promoData.price.discounted / 2);
    }
  };

  // Fonction pour obtenir le montant total à payer
  const getTotalAmount = (): number => {
    if (formData.paymentOption === 'full') {
      // Paiement intégral avec réduction de 10%
      return Math.ceil(promoData.price.discounted * 0.9);
    } else {
      // Prix normal sans réduction pour le paiement en 2 fois
      return promoData.price.discounted;
    }
  };

  const openWavePayment = async () => {
    try {
      // Calculer le montant à payer
      const amountToPay = getPaymentAmount();
      
      // Générer un ID de transaction unique
      const newTransactionId = crypto.randomUUID();
      setTransactionId(newTransactionId);
      
      // Préparation des données client
      const customerData = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        country: formData.country,
        city: formData.city,
        businessName: formData.businessName,
        businessDescription: formData.businessDescription
      };
  
      // Afficher un indicateur de chargement
      toast.loading("Préparation du paiement...");
      
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
            transactionType: 'promo_ramadan'
          }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          console.warn("Avertissement API transaction:", errorData);
          // Continuer malgré l'erreur
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
            transaction_type: 'promo_ramadan',
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
      setPaymentStatus('initiated' as PaymentStatus);
      
      // Informer l'utilisateur
      toast.success("Lien de paiement Wave ouvert. Veuillez effectuer votre paiement et noter l'ID de transaction.");
    } catch (error) {
      console.error('Erreur:', error);
      toast.error("Une erreur est survenue lors de la création du lien de paiement.");
      setPaymentStatus('not_started' as PaymentStatus);
      setPaymentWindowOpened(false);
    }
  };
  
  // Fonction verifyPayment mise à jour
  const verifyPayment = async () => {
    if (!transactionId || transactionId.length < 8) {
      toast.error("Veuillez saisir un ID de transaction valide.");
      return;
    }
    
    try {
      // Afficher un indicateur de chargement
      toast.loading("Vérification du paiement...");
      
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
        
        if (!response.ok) {
          const errorData = await response.json();
          console.warn("Avertissement API vérification:", errorData);
          // Continuer malgré l'erreur
        }
      } catch (apiError) {
        console.warn("Erreur API vérification:", apiError);
        // Continuer malgré l'erreur
      }
      
      // Fallback: Mise à jour directe dans Supabase
      try {
        const { error } = await supabase
          .from('payment_transactions')
          .update({
            status: 'completed',
            provider_transaction_id: transactionId,
            updated_at: new Date().toISOString()
          })
          .eq('id', transactionId);
          
        if (error) {
          console.warn("Avertissement mise à jour transaction:", error);
          // Continuer malgré l'erreur
        }
      } catch (updateError) {
        console.warn("Erreur mise à jour transaction:", updateError);
        // Continuer malgré l'erreur
      }
      
      // Supprimer l'indicateur de chargement
      toast.dismiss();
      
      // Marquer le paiement comme vérifié
      setPaymentStatus('verified');
      toast.success("Paiement vérifié avec succès.");
    } catch (error) {
      console.error('Erreur lors de la vérification:', error);
      toast.error("Une erreur est survenue lors de la vérification du paiement.");
      toast.dismiss();
    }
  };
  
  // Fonction handleSubmit mise à jour pour utiliser l'API
  const handleSubmit = async () => {
    // Vérification différente selon la méthode choisie
    if (formData.contactMethod === 'pay_now') {
      // Vérification pour le paiement
      if (paymentStatus !== ('verified' as PaymentStatus)) {
        toast.error('Veuillez vérifier votre paiement avant de finaliser votre commande');
        return;
      }
    }
    
    setLoading(true);
    setErrorDetails(null); // Réinitialiser les erreurs
    
    try {
      // Déterminer le statut de paiement à enregistrer
      let paymentStatusToRecord = 'pending';
      let amountToPay = 0;
      
      if (formData.contactMethod === 'pay_now') {
        paymentStatusToRecord = formData.paymentOption === 'full' ? 'fully_paid' : 'partial_paid';
        amountToPay = getPaymentAmount();
      }
      
      const totalAmount = getTotalAmount();
      
      // Afficher un indicateur de chargement
      toast.loading("Finalisation de votre inscription...");
      
      // Préparer les données pour l'API
    const leadData = {
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        country: formData.country,
        city: formData.city,
        business_name: formData.businessName,
        business_description: formData.businessDescription,
        existing_website: formData.existingWebsite || null,
        lead_source: formData.howDidYouHear || null,
        payment_option: formData.paymentOption,
        payment_status: paymentStatusToRecord,
        amount_paid: amountToPay,
        transaction_id: formData.contactMethod === 'pay_now' ? transactionId : null,
        total_amount: totalAmount,
        status: 'new', 
        notes: formData.contactMethod === 'contact_later' 
        ? 'Client souhaite être contacté avant paiement' 
        : (formData.contactMethod === 'pay_now' ? 'Client a déjà effectué le paiement' : ''),
        contact_method: formData.contactMethod
    };
      
      // Appeler l'API pour insérer dans ramadan_promo_leads uniquement
      const response = await fetch('/api/ramadan-promo/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ leadData }),
      });
      
      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || "Erreur lors de l'enregistrement de la demande");
      }
      
      // Supprimer l'indicateur de chargement
      toast.dismiss();
      
      // Afficher un message de succès adapté
      if (formData.contactMethod === 'pay_now') {
        setSuccessMessage(`Félicitations ! Votre commande a été enregistrée avec succès. Notre équipe vous contactera dans les 24 heures pour commencer le développement de votre site e-commerce.`);
      } else {
        setSuccessMessage(`Votre demande a été enregistrée avec succès. Notre équipe vous contactera dans les 24 heures pour discuter des détails et confirmer votre participation.`);
      }
      
      // Avancer à l'étape de confirmation finale
      setStep(4);
    } catch (error: any) {
      console.error('Erreur détaillée:', error);
      
      const errorMessage = error.message || 'Erreur inconnue';
      setErrorDetails(errorMessage);
      
      toast.error(`Erreur: ${errorMessage}`);
    } finally {
      setLoading(false);
      toast.dismiss();
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
      paymentOption: 'partial',
      contactMethod: 'pay_now',
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
  const formatPrice = (price: number): string => {
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

              <div className="space-y-4 mb-6">
                <label className="block text-sm font-medium mb-1">
                  Comment souhaitez-vous procéder ?*
                </label>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="contactMethod"
                      value="pay_now"
                      checked={formData.contactMethod === 'pay_now'}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <div>
                      <div className="font-medium">Payer maintenant et réserver ma place</div>
                      <div className="text-sm text-gray-500">
                        Réservez votre place immédiatement via paiement Wave
                      </div>
                    </div>
                  </label>
                  
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="contactMethod"
                      value="contact_later"
                      checked={formData.contactMethod === 'contact_later'}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <div>
                      <div className="font-medium">Être contacté(e) pour plus d'informations</div>
                      <div className="text-sm text-gray-500">
                        Un conseiller vous contactera dans les 24h (places limitées)
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Option de paiement*
                </label>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentOption"
                      value="partial"
                      checked={formData.paymentOption === 'partial'}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <div>
                      <div className="font-medium">Paiement en 2 fois</div>
                      <div className="text-sm text-gray-500">
                        {formatPrice(Math.ceil(promoData.price.discounted / 2))} FCFA maintenant + {formatPrice(Math.ceil(promoData.price.discounted / 2))} FCFA dans 30 jours
                      </div>
                    </div>
                  </label>
                  
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentOption"
                      value="full"
                      checked={formData.paymentOption === 'full'}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <div>
                      <div className="font-medium">Paiement intégral (-10%)</div>
                      <div className="text-sm text-gray-500">
                        {formatPrice(Math.ceil(promoData.price.discounted * 0.9))} FCFA (au lieu de {formatPrice(promoData.price.discounted)} FCFA)
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Étape 3: Paiement et vérification */}
          {step === 3 && (
            <div className="space-y-4">
              {formData.contactMethod === 'pay_now' ? (
                <>
                  <h3 className="font-medium text-lg text-[#0f4c81] mb-4">
                    Paiement{formData.paymentOption === 'partial' ? " de l'acompte" : ""}
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
                    {formData.paymentOption === 'full' && (
                      <div className="flex justify-between mb-1 text-sm text-green-600">
                        <span>Réduction paiement intégral (10%)</span>
                        <span>-{formatPrice(Math.ceil(promoData.price.discounted * 0.1))} FCFA</span>
                      </div>
                    )}
                    <div className="border-t border-gray-200 my-2"></div>
                    <div className="flex justify-between font-bold">
                      <span>
                        {formData.paymentOption === 'partial' 
                          ? "Acompte à payer maintenant (50%)" 
                          : "Montant total à payer"}
                      </span>
                      <span className="text-[#ff7f50]">{formatPrice(getPaymentAmount())} FCFA</span>
                    </div>
                    {formData.paymentOption === 'partial' && (
                      <div className="text-sm text-gray-500 mt-1">
                        Le solde de {formatPrice(Math.ceil(promoData.price.discounted / 2))} FCFA sera à payer 30 jours après la livraison
                      </div>
                    )}
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
                </>
              ) : (
                <div className="space-y-4">
                  <h3 className="font-medium text-lg text-[#0f4c81] mb-4">
                    Récapitulatif de votre demande
                  </h3>
                  
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <div className="font-medium text-[#0f4c81] mb-2">Détails de votre intérêt</div>
                    <div className="space-y-2 text-gray-700">
                      <div className="flex justify-between">
                        <span className="font-medium">Nom:</span>
                        <span>{formData.fullName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Email:</span>
                        <span>{formData.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Téléphone:</span>
                        <span>{formData.phone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Business:</span>
                        <span>{formData.businessName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Prix de l'offre:</span>
                        <span>{formatPrice(promoData.price.discounted)} FCFA</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg bg-blue-50">
                    <div className="flex items-start">
                      <Info className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-blue-800">
                        <p className="font-medium mb-1">Prochaines étapes:</p>
                        <ol className="list-decimal list-inside space-y-1 pl-1">
                          <li>Notre équipe vous contactera par téléphone ou email dans les 24h</li>
                          <li>Nous répondrons à toutes vos questions sur l'offre</li>
                          <li>Si vous décidez de procéder, nous vous aiderons pour le paiement</li>
                        </ol>
                        <p className="mt-2 text-[#ff7f50] font-medium">N'oubliez pas : les places sont limitées à {promoData.maxClients} participants !</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
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
                  disabled={loading || (formData.contactMethod === 'pay_now' && paymentStatus !== 'verified')}
                  className="px-6 py-2 bg-[#ff7f50] text-white rounded-lg hover:bg-[#ff6b3d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 inline animate-spin" />
                      Traitement en cours...
                    </>
                  ) : formData.contactMethod === 'pay_now' ? 'Finaliser ma commande' : 'Envoyer ma demande'}
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