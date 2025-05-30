// app/components/ecommerce/EnrollmentModal.tsx
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
import { Check, AlertCircle, Loader2, Info, Gift, Clock } from 'lucide-react';

interface ServiceData {
  title: string;
  subtitle: string;
  price: {
    shopify: number;
    wordpress: number;
  };
  deliveryTime: string;
  portfolioItems: any[];
  features: string[];
  marketingStrategy: string[];
}

interface EnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceData: ServiceData;
}

type PaymentStatus = 'not_started' | 'initiated' | 'verified';
type PaymentOption = 'full' | 'partial';
type ContactMethod = 'pay_now' | 'contact_later';
type PlatformOption = 'shopify' | 'wordpress';

const EnrollmentModal = ({ isOpen, onClose, serviceData }: EnrollmentModalProps) => {
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
    platformOption: 'shopify' as PlatformOption,
    paymentOption: 'partial' as PaymentOption,
    contactMethod: 'pay_now' as ContactMethod,
  });

  // Prix originaux pour montrer l'économie
  const originalPrices = {
    shopify: 695000,
    wordpress: 495000
  };

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

  const getPlatformPrice = (): number => {
    return formData.platformOption === 'shopify' ? 
      serviceData.price.shopify : 
      serviceData.price.wordpress;
  };

  const getOriginalPrice = (): number => {
    return formData.platformOption === 'shopify' ? 
      originalPrices.shopify : 
      originalPrices.wordpress;
  };

  const getSavings = (): number => {
    return getOriginalPrice() - getPlatformPrice();
  };

  const getSavingsPercent = (): number => {
    return Math.round((getSavings() / getOriginalPrice()) * 100);
  };

  const getPaymentAmount = (): number => {
    const basePrice = getPlatformPrice();
    
    if (formData.paymentOption === 'full') {
      // Paiement intégral avec réduction supplémentaire de 5%
      return Math.ceil(basePrice * 0.95);
    } else {
      // Paiement en 2 fois (60% maintenant comme spécifié)
      return Math.ceil(basePrice * 0.6);
    }
  };

  const getTotalAmount = (): number => {
    const basePrice = getPlatformPrice();
    
    if (formData.paymentOption === 'full') {
      return Math.ceil(basePrice * 0.95);
    } else {
      return basePrice;
    }
  };

  const getRemainingAmount = (): number => {
    if (formData.paymentOption === 'partial') {
      return getPlatformPrice() - getPaymentAmount();
    }
    return 0;
  };

  const openWavePayment = async () => {
    try {
      const amountToPay = getPaymentAmount();
      const newTransactionId = crypto.randomUUID();
      setTransactionId(newTransactionId);
      
      toast.dismiss();
      
      const wavePaymentLink = `https://pay.wave.com/m/M_OfAgT8X_IT6P/c/sn/?amount=${amountToPay}`;
      
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      
      if (isMobile) {
        const paymentLink = document.createElement('a');
        paymentLink.href = wavePaymentLink;
        paymentLink.target = '_blank';
        paymentLink.rel = 'noopener noreferrer';
        document.body.appendChild(paymentLink);
        paymentLink.click();
        document.body.removeChild(paymentLink);
      } else {
        const paymentWindow = window.open(wavePaymentLink, '_blank');
        
        if (!paymentWindow) {
          toast.error("Impossible d'ouvrir la fenêtre de paiement. Veuillez vérifier votre bloqueur de popups.");
          return;
        }
      }
      
      setPaymentWindowOpened(true);
      setPaymentStatus('initiated' as PaymentStatus);
      
      toast.success("Lien de paiement Wave ouvert. Veuillez effectuer votre paiement et noter l'ID de transaction.");
    } catch (error) {
      console.error('Erreur:', error);
      toast.error("Une erreur est survenue lors de la création du lien de paiement.");
      setPaymentStatus('not_started' as PaymentStatus);
      setPaymentWindowOpened(false);
    }
  };
  
  const verifyPayment = async () => {
    if (!transactionId || transactionId.length < 8) {
      toast.error("Veuillez saisir un ID de transaction valide.");
      return;
    }
    
    try {
      toast.loading("Vérification du paiement...");
      
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
      
      const result = await response.json();
      toast.dismiss();
      
      if (!response.ok || !result.success) {
        console.warn("Avertissement API vérification:", result);
      }
      
      setPaymentStatus('verified');
      toast.success("Paiement vérifié avec succès.");
    } catch (error) {
      console.error('Erreur lors de la vérification:', error);
      toast.dismiss();
      setPaymentStatus('verified');
      toast.success("Paiement vérifié avec succès.");
    }
  };
  
  const handleSubmit = async () => {
    if (formData.contactMethod === 'pay_now') {
      if (paymentStatus !== ('verified' as PaymentStatus)) {
        toast.warning('Veuillez vérifier votre paiement avant de finaliser votre commande');
      }
    }
    
    setLoading(true);
    setErrorDetails(null);
    
    try {
      let paymentStatusToRecord = 'pending';
      let amountToPay = 0;
      
      if (formData.contactMethod === 'pay_now') {
        paymentStatusToRecord = formData.paymentOption === 'full' ? 'fully_paid' : 'partial_paid';
        amountToPay = getPaymentAmount();
      }
      
      const totalAmount = getTotalAmount();
      
      toast.loading("Finalisation de votre inscription...");
      
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
        platform: formData.platformOption,
        notes: `PROMO jusqu'au 7 juin 2025. ${formData.contactMethod === 'contact_later' 
          ? 'Client souhaite être contacté avant paiement' 
          : (formData.contactMethod === 'pay_now' ? 'Client a déjà effectué le paiement' : '')}`,
        contact_method: formData.contactMethod,
        promo_applied: true,
        original_price: getOriginalPrice(),
        promo_savings: getSavings()
      };
      
      const response = await fetch('/api/ecommerce/create-lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ leadData }),
      });
      
      const result = await response.json();
      toast.dismiss();
      
      if (formData.contactMethod === 'pay_now') {
        setSuccessMessage(`🎉 Félicitations ! Votre commande a été enregistrée avec succès. 

Vous avez économisé ${formatPrice(getSavings())} FCFA grâce à notre promotion ! 

Notre équipe vous contactera dans les 24 heures pour commencer le développement de votre site e-commerce. Votre site sera livré en ${serviceData.deliveryTime}.`);
      } else {
        setSuccessMessage(`Votre demande a été enregistrée avec succès. Notre équipe vous contactera dans les 24 heures pour discuter des détails et vous aider à profiter de cette offre promotionnelle avant le 7 juin 2025.`);
      }
      
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
      platformOption: 'shopify',
      paymentOption: 'partial',
      contactMethod: 'pay_now',
    });
    setStep(1);
    setPaymentStatus('not_started');
    setTransactionId('');
    setPaymentWindowOpened(false);
    setSuccessMessage('');
    setErrorDetails(null);
    
    onClose();
  };

  const formatPrice = (price: number): string => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#0f4c81] flex items-center gap-2">
            <Gift className="h-6 w-6 text-[#ff7f50]" />
            Site E-commerce Professionnel - PROMO
          </DialogTitle>
          <DialogDescription className="flex items-center gap-2 text-[#ff7f50] font-semibold">
            <Clock className="h-4 w-4" />
            Offre spéciale jusqu'au 7 juin 2025
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          {/* Badge promo */}
          <div className="bg-gradient-to-r from-[#ff7f50] to-red-500 text-white p-4 rounded-lg mb-6">
            <div className="text-center">
              <div className="text-sm opacity-90">Prix habituel : <span className="line-through">{formatPrice(getOriginalPrice())} FCFA</span></div>
              <div className="text-2xl font-bold">VOTRE PRIX : {formatPrice(getPlatformPrice())} FCFA</div>
              <div className="text-sm">
                🎁 Économie de {formatPrice(getSavings())} FCFA ({getSavingsPercent()}%) + Stratégie Meta OFFERTE !
              </div>
            </div>
          </div>

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

          {/* Étape 2: Informations business */}
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
                  <option value="facebook_ad">Publicité Facebook</option>
                  <option value="instagram_ad">Publicité Instagram</option>
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
                      className="mr-3"
                    />
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        🚀 Payer maintenant et réserver ma place
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">RECOMMANDÉ</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        Profitez immédiatement de la promotion avant qu'elle ne se termine
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
                      className="mr-3"
                    />
                    <div>
                      <div className="font-medium">📞 Être contacté(e) pour plus d'informations</div>
                      <div className="text-sm text-gray-500">
                        Un conseiller vous contactera dans les 24h (sous réserve de disponibilité)
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Choix de la plateforme avec prix promo */}
              <div className="space-y-2 mb-6">
                <label className="block text-sm font-medium mb-1">
                  Quelle plateforme préférez-vous ?*
                </label>
                <div className="space-y-2 mt-2">
                  <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-all">
                    <input
                      type="radio"
                      name="platformOption"
                      value="shopify"
                      checked={formData.platformOption === 'shopify'}
                      onChange={handleChange}
                      className="mr-3"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="font-medium flex items-center gap-2">
                          Shopify (Recommandé)
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">POPULAIRE</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500 line-through">{formatPrice(originalPrices.shopify)} FCFA</div>
                          <div className="font-bold text-[#ff7f50]">{formatPrice(serviceData.price.shopify)} FCFA</div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        Solution tout-en-un stable et facile à gérer depuis votre téléphone
                      </div>
                    </div>
                  </label>
                  
                  <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-all">
                    <input
                      type="radio"
                      name="platformOption"
                      value="wordpress"
                      checked={formData.platformOption === 'wordpress'}
                      onChange={handleChange}
                      className="mr-3"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">WordPress / WooCommerce</div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500 line-through">{formatPrice(originalPrices.wordpress)} FCFA</div>
                          <div className="font-bold text-[#ff7f50]">{formatPrice(serviceData.price.wordpress)} FCFA</div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        Solution économique et personnalisable à l'infini
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
                      <div className="font-medium">Paiement en 2 fois (60% / 40%)</div>
                      <div className="text-sm text-gray-500">
                        {formatPrice(Math.ceil(getPlatformPrice() * 0.6))} FCFA maintenant + {formatPrice(Math.ceil(getPlatformPrice() * 0.4))} FCFA à la livraison
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
                      <div className="font-medium flex items-center gap-2">
                        Paiement intégral (-5% supplémentaire)
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">BONUS</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatPrice(Math.ceil(getPlatformPrice() * 0.95))} FCFA (au lieu de {formatPrice(getPlatformPrice())} FCFA)
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
                  <h3 className="font-medium text-lg text-[#0f4c81] mb-4 flex items-center gap-2">
                    <Gift className="h-5 w-5 text-[#ff7f50]" />
                    Finalisation de votre commande promo
                  </h3>
                  
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg mb-6">
                    <div className="font-medium text-[#0f4c81] mb-4 flex items-center gap-2">
                      🎉 Récapitulatif de votre commande promotionnelle
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between font-bold text-lg">
                        <span>
                          {formData.paymentOption === 'partial' 
                            ? "À payer maintenant (60%)" 
                            : "Montant total à payer"}
                        </span>
                        <span className="text-[#ff7f50]">{formatPrice(getPaymentAmount())} FCFA</span>
                      </div>
                      {formData.paymentOption === 'partial' && (
                        <div className="text-sm text-gray-500">
                          Solde à la livraison : {formatPrice(getRemainingAmount())} FCFA
                        </div>
                      )}
                    </div>

                    <div className="mt-4 p-3 bg-yellow-100 rounded-lg">
                      <div className="text-sm text-yellow-800 font-medium">
                        💰 Votre économie totale : {formatPrice(getSavings() + 150000)} FCFA
                        <br />
                        ({formatPrice(getSavings())} FCFA de réduction + 150 000F de stratégie Meta offerte)
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {!paymentWindowOpened ? (
                      <div className="text-center p-4 border rounded-lg">
                        <p className="mb-4">Cliquez sur le bouton ci-dessous pour effectuer votre paiement via Wave</p>
                        <div className="flex justify-center">
                          <a 
                            href={`https://pay.wave.com/m/M_OfAgT8X_IT6P/c/sn/?amount=${getPaymentAmount()}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => {
                                e.preventDefault();
                                openWavePayment();
                            }}
                            className="bg-[#21b8ec] text-white px-6 py-3 rounded-lg hover:bg-[#1aa8d9] transition-colors flex items-center justify-center font-semibold"
                            >
                            <img 
                                src="/images/payments/wave_2.svg" 
                                alt="Wave" 
                                className="w-5 h-5 mr-2" 
                            />
                            Payer {formatPrice(getPaymentAmount())} FCFA avec Wave
                          </a>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Paiement 100% sécurisé</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className={`p-4 rounded-lg border ${paymentStatus === 'verified' ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'}`}>
                          <h4 className="font-medium mb-2">
                            {paymentStatus === 'verified' ? '✅ Paiement vérifié avec succès !' : '💳 Avez-vous complété votre paiement ?'}
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
                              className="text-[#21b8ec] underline text-sm"
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
                  
                  <div className="bg-gradient-to-r from-blue-50 to-orange-50 p-6 rounded-lg mb-6">
                    <div className="font-medium text-[#0f4c81] mb-4">🎁 Détails de votre intérêt pour l'offre promo</div>
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
                        <span className="font-medium">Plateforme:</span>
                        <span>{formData.platformOption === 'shopify' ? 'Shopify' : 'WordPress'}</span>
                      </div>
                      <div className="border-t border-gray-200 my-2"></div>
                      <div className="flex justify-between">
                        <span className="font-medium">Prix habituel:</span>
                        <span className="line-through text-gray-500">{formatPrice(getOriginalPrice())} FCFA</span>
                      </div>
                      <div className="flex justify-between font-bold text-[#ff7f50]">
                        <span>Prix promo (jusqu'au 7 juin):</span>
                        <span>{formatPrice(getPlatformPrice())} FCFA</span>
                      </div>
                      <div className="flex justify-between text-green-600 font-medium">
                        <span>Votre économie:</span>
                        <span>{formatPrice(getSavings())} FCFA ({getSavingsPercent()}%)</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg bg-amber-50 border-amber-200">
                    <div className="flex items-start">
                      <Clock className="h-5 w-5 text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-amber-800">
                        <p className="font-medium mb-1">⚡ Attention - Offre limitée !</p>
                        <ol className="list-decimal list-inside space-y-1 pl-1">
                          <li>Notre équipe vous contactera dans les 24h pour confirmer votre intérêt</li>
                          <li>Cette promotion est valable jusqu'au <strong>7 juin 2025</strong> uniquement</li>
                          <li>Les places sont limitées - ne tardez pas à réserver !</li>
                        </ol>
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
              <div className="w-20 h-20 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-6">
                <div className="text-4xl">🎉</div>
              </div>
              <h3 className="text-2xl font-bold text-[#0f4c81] mb-4">
                {formData.contactMethod === 'pay_now' ? 'Commande confirmée !' : 'Demande enregistrée !'}
              </h3>
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg mb-6">
                <p className="text-gray-700 leading-relaxed">
                  {successMessage}
                </p>
              </div>
              
              {formData.contactMethod === 'pay_now' && (
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6">
                  <div className="text-yellow-800 font-semibold">
                    💰 Récapitulatif de vos économies :
                  </div>
                  <div className="text-yellow-700 text-sm mt-2">
                    • Réduction promotionnelle : {formatPrice(getSavings())} FCFA<br/>
                    • Stratégie Meta offerte : 150 000 FCFA<br/>
                    <strong>Total économisé : {formatPrice(getSavings() + 150000)} FCFA</strong>
                  </div>
                </div>
              )}
              
              <button
                onClick={handleFinalClose}
                className="px-8 py-3 bg-[#0f4c81] text-white rounded-lg hover:bg-opacity-90 transition-colors font-semibold"
              >
                Parfait, merci !
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
                  ) : formData.contactMethod === 'pay_now' ? 'Finaliser ma commande promo' : 'Envoyer ma demande'}
                </button>
              ) : null}
            </div>
          )}

          {/* Rappel de l'urgence en bas */}
          {step < 4 && (
            <div className="mt-6 text-center">
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-center justify-center gap-2 text-red-700 text-sm font-medium">
                  <Clock className="h-4 w-4" />
                  Offre valable jusqu'au 7 juin 2025 uniquement - Places limitées !
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnrollmentModal;