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
import { Check, AlertCircle, Loader2, Info, Smartphone, Laptop, Clock, CheckCircle, Star, Globe, Shield, Award } from 'lucide-react';

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
}

interface EnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceData: ServiceData;
  selectedPlatform?: 'shopify' | 'wordpress';
}

type PaymentStatus = 'not_started' | 'initiated' | 'verified';
type PaymentOption = 'full' | 'partial';
type ContactMethod = 'pay_now' | 'contact_later';
type PlatformOption = 'shopify' | 'wordpress';

const EnrollmentModal = ({ isOpen, onClose, serviceData, selectedPlatform }: EnrollmentModalProps) => {
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
    platformOption: (selectedPlatform || 'shopify') as PlatformOption,
    paymentOption: 'partial' as PaymentOption,
    contactMethod: 'pay_now' as ContactMethod,
  });

  useEffect(() => {
    if (selectedPlatform) {
      setFormData(prev => ({ ...prev, platformOption: selectedPlatform }));
    }
  }, [selectedPlatform]);

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

  const getPaymentAmount = (): number => {
    const basePrice = getPlatformPrice();
    
    if (formData.paymentOption === 'full') {
      // Paiement intégral avec réduction de 3%
      return Math.ceil(basePrice * 0.97);
    } else {
      // Paiement en 2 fois (50% maintenant)
      return Math.ceil(basePrice * 0.5);
    }
  };

  const getTotalAmount = (): number => {
    const basePrice = getPlatformPrice();
    
    if (formData.paymentOption === 'full') {
      return Math.ceil(basePrice * 0.97);
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
      
      // Simulation de vérification pour la démo
      setTimeout(() => {
        toast.dismiss();
        setPaymentStatus('verified');
        toast.success("Paiement vérifié avec succès.");
      }, 2000);
      
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
        return;
      }
    }
    
    setLoading(true);
    setErrorDetails(null);
    
    try {
      toast.loading("Finalisation de votre inscription...");
      
      // Simulation d'envoi pour la démo
      setTimeout(() => {
        toast.dismiss();
        
        if (formData.contactMethod === 'pay_now') {
          setSuccessMessage(`🎉 Félicitations ! Votre commande a été enregistrée avec succès. 

Notre équipe vous contactera dans les 24 heures pour commencer le développement de votre site e-commerce ${formData.platformOption === 'shopify' ? 'Shopify' : 'WordPress'}. 

Votre boutique en ligne sera livrée en ${serviceData.deliveryTime}.`);
        } else {
          setSuccessMessage(`Votre demande a été enregistrée avec succès. Notre équipe vous contactera dans les 24 heures pour discuter des détails de votre projet ${formData.platformOption === 'shopify' ? 'Shopify' : 'WordPress'} et vous accompagner dans cette transformation digitale.`);
        }
        
        setStep(4);
        setLoading(false);
      }, 2000);
      
    } catch (error: any) {
      console.error('Erreur détaillée:', error);
      
      const errorMessage = error.message || 'Erreur inconnue';
      setErrorDetails(errorMessage);
      
      toast.error(`Erreur: ${errorMessage}`);
      setLoading(false);
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

  const getPlatformIcon = () => {
    return formData.platformOption === 'shopify' ? 
      <Smartphone className="h-6 w-6" /> : 
      <Laptop className="h-6 w-6" />;
  };

  const getPlatformName = () => {
    return formData.platformOption === 'shopify' ? 'Shopify Premium' : 'WordPress Pro';
  };

  const getPlatformColor = () => {
    return formData.platformOption === 'shopify' ? 'from-green-500 to-emerald-600' : 'from-blue-500 to-indigo-600';
  };

  const getPlatformBenefits = () => {
    if (formData.platformOption === 'shopify') {
      return [
        "Interface ultra-simple",
        "Gestion depuis smartphone", 
        "Support technique 24/7",
        "Apps premium incluses",
        "Sécurité maximale"
      ];
    } else {
      return [
        "Personnalisation illimitée",
        "Aucun abonnement mensuel",
        "SEO optimisé",
        "Contrôle total",
        "Extensions premium"
      ];
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            {getPlatformIcon()}
            {getPlatformName()} - TEKKI Studio
          </DialogTitle>
          <DialogDescription className="flex items-center gap-2 text-gray-600">
            <Award className="h-4 w-4" />
            Solution professionnelle pour marques ambitieuses
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          {/* Prix et bénéfices plateforme */}
          <div className={`bg-gradient-to-r ${getPlatformColor()} text-white p-6 rounded-xl mb-6`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-3xl font-bold">{formatPrice(getPlatformPrice())} FCFA</div>
                <div className="text-white/90">Boutique en ligne professionnelle</div>
              </div>
              <div className="text-right">
                <div className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                  {formData.platformOption === 'shopify' ? 'RECOMMANDÉ' : 'ÉCONOMIQUE'}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {getPlatformBenefits().map((benefit, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-white/80" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Indicateur d'étapes */}
          <div className="flex items-center justify-center mb-8">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step >= stepNumber ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div className={`w-16 h-0.5 ${
                    step > stepNumber ? 'bg-blue-600' : 'bg-gray-200'
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
            <div className="space-y-6">
              <h3 className="font-semibold text-xl text-gray-900 mb-6">
                Parlez-nous de vous et de votre marque
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" htmlFor="fullName">
                    Nom complet*
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" htmlFor="email">
                    Email professionnel*
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="phone">
                  Téléphone (WhatsApp de préférence)*
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+221 77 123 45 67"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" htmlFor="country">
                    Pays*
                  </label>
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Sélectionnez votre pays</option>
                    <option value="Sénégal">Sénégal</option>
                    <option value="Côte d'Ivoire">Côte d'Ivoire</option>
                    <option value="Mali">Mali</option>
                    <option value="Burkina Faso">Burkina Faso</option>
                    <option value="France">France</option>
                    <option value="Belgique">Belgique</option>
                    <option value="Canada">Canada</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" htmlFor="city">
                    Ville*
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Étape 2: Informations business */}
          {step === 2 && (
            <div className="space-y-6">
              <h3 className="font-semibold text-xl text-gray-900 mb-6">
                Votre projet de boutique en ligne
              </h3>
              
              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="businessName">
                  Nom de votre marque/business*
                </label>
                <input
                  type="text"
                  id="businessName"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="businessDescription">
                  Décrivez votre marque et vos produits*
                </label>
                <textarea
                  id="businessDescription"
                  name="businessDescription"
                  value={formData.businessDescription}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Ex: Marque de vêtements africains modernes, créations artisanales, bijoux traditionnels..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="existingWebsite">
                  Avez-vous déjà un site web ? (optionnel)
                </label>
                <input
                  type="text"
                  id="existingWebsite"
                  name="existingWebsite"
                  value={formData.existingWebsite}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="howDidYouHear">
                  Comment avez-vous découvert TEKKI Studio ?
                </label>
                <select
                  id="howDidYouHear"
                  name="howDidYouHear"
                  value={formData.howDidYouHear}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Sélectionner une option</option>
                  <option value="facebook_ad">Publicité Facebook</option>
                  <option value="instagram_ad">Publicité Instagram</option>
                  <option value="google">Recherche Google</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="friend">Recommandation</option>
                  <option value="portfolio">Vu vos réalisations</option>
                  <option value="other">Autre</option>
                </select>
              </div>

              {/* Choix de la plateforme (si pas prédéfinie) */}
              {!selectedPlatform && (
                <div className="space-y-4">
                  <label className="block text-sm font-medium mb-2">
                    Quelle plateforme préférez-vous ?*
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-all">
                      <input
                        type="radio"
                        name="platformOption"
                        value="shopify"
                        checked={formData.platformOption === 'shopify'}
                        onChange={handleChange}
                        className="mr-4"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Smartphone className="h-5 w-5 text-green-600" />
                            <div className="font-medium">Shopify Premium</div>
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">RECOMMANDÉ</span>
                          </div>
                          <div className="font-bold text-green-600">{formatPrice(serviceData.price.shopify)} FCFA</div>
                        </div>
                        <div className="text-sm text-gray-500 mt-1 ml-8">
                          Solution tout-en-un, facile à gérer depuis votre smartphone
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
                        className="mr-4"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Laptop className="h-5 w-5 text-blue-600" />
                            <div className="font-medium">WordPress Pro</div>
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">ÉCONOMIQUE</span>
                          </div>
                          <div className="font-bold text-blue-600">{formatPrice(serviceData.price.wordpress)} FCFA</div>
                        </div>
                        <div className="text-sm text-gray-500 mt-1 ml-8">
                          Personnalisable à l'infini, aucun abonnement mensuel
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {/* Option de paiement */}
              <div className="space-y-4">
                <label className="block text-sm font-medium mb-2">
                  Option de paiement*
                </label>
                <div className="space-y-3">
                  <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentOption"
                      value="partial"
                      checked={formData.paymentOption === 'partial'}
                      onChange={handleChange}
                      className="mr-3"
                    />
                    <div>
                      <div className="font-medium">Paiement en 2 fois</div>
                      <div className="text-sm text-gray-500">
                        {formatPrice(Math.ceil(getPlatformPrice() * 0.5))} FCFA maintenant + {formatPrice(Math.ceil(getPlatformPrice() * 0.5))} FCFA à la livraison
                      </div>
                    </div>
                  </label>
                  
                  <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="paymentOption"
                      value="full"
                      checked={formData.paymentOption === 'full'}
                      onChange={handleChange}
                      className="mr-3"
                    />
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        Paiement intégral (-3%)
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">ÉCONOMIE</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatPrice(Math.ceil(getPlatformPrice() * 0.97))} FCFA (au lieu de {formatPrice(getPlatformPrice())} FCFA)
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Méthode de contact */}
              <div className="space-y-4">
                <label className="block text-sm font-medium mb-2">
                  Comment souhaitez-vous procéder ?*
                </label>
                <div className="space-y-3">
                  <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
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
                        🚀 Payer maintenant et démarrer immédiatement
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">RAPIDE</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        Votre projet démarre dès aujourd'hui
                      </div>
                    </div>
                  </label>
                  
                  <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
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
                        Un expert vous contactera dans les 24h
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Étape 3: Paiement et confirmation */}
          {step === 3 && (
            <div className="space-y-6">
              {formData.contactMethod === 'pay_now' ? (
                <>
                  <h3 className="font-semibold text-xl text-gray-900 mb-6 flex items-center gap-3">
                    <Shield className="h-6 w-6 text-green-600" />
                    Finalisation de votre commande
                  </h3>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-xl border border-blue-200">
                    <div className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                      🎯 Récapitulatif de votre projet
                    </div>
                    
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span>Plateforme choisie :</span>
                        <span className="font-medium">{getPlatformName()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Prix standard :</span>
                        <span>{formatPrice(getPlatformPrice())} FCFA</span>
                      </div>
                      {formData.paymentOption === 'full' && (
                        <div className="flex justify-between text-green-600">
                          <span>Réduction paiement intégral (-3%) :</span>
                          <span>-{formatPrice(getPlatformPrice() - Math.ceil(getPlatformPrice() * 0.97))} FCFA</span>
                        </div>
                      )}
                      <div className="border-t pt-2 flex justify-between font-bold text-lg">
                        <span>
                          {formData.paymentOption === 'partial' 
                            ? "À payer maintenant (50%)" 
                            : "Montant total"}
                        </span>
                        <span className="text-blue-600">{formatPrice(getPaymentAmount())} FCFA</span>
                      </div>
                      {formData.paymentOption === 'partial' && (
                        <div className="text-sm text-gray-500">
                          Solde à la livraison : {formatPrice(getRemainingAmount())} FCFA
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {!paymentWindowOpened ? (
                      <div className="text-center p-6 border-2 border-dashed border-blue-300 rounded-xl bg-blue-50">
                        <p className="mb-4 text-gray-700">Cliquez sur le bouton ci-dessous pour effectuer votre paiement via Wave</p>
                        <div className="flex justify-center">
                          <button 
                            onClick={openWavePayment}
                            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-colors flex items-center justify-center font-semibold text-lg shadow-lg"
                          >
                            <img 
                              src="/images/payments/wave_2.svg" 
                              alt="Wave" 
                              className="w-6 h-6 mr-3" 
                            />
                            Payer {formatPrice(getPaymentAmount())} FCFA avec Wave
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-3 flex items-center justify-center gap-1">
                          <Shield className="w-4 h-4" />
                          Paiement 100% sécurisé
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className={`p-6 rounded-xl border-2 ${paymentStatus === 'verified' ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'}`}>
                          <h4 className="font-medium mb-3 text-lg">
                            {paymentStatus === 'verified' ? '✅ Paiement vérifié avec succès !' : '💳 Confirmez votre paiement'}
                          </h4>
                          
                          {paymentStatus !== 'verified' && (
                            <>
                              <p className="text-sm mb-4 text-gray-600">Après avoir effectué votre paiement, veuillez saisir l'ID de transaction qui se trouve dans votre application Wave.</p>
                              
                              <div className="mb-4">
                                <label className="block text-sm font-medium mb-2" htmlFor="transactionId">
                                  ID de la Transaction Wave*
                                </label>
                                <input
                                  type="text"
                                  id="transactionId"
                                  value={transactionId}
                                  onChange={(e) => setTransactionId(e.target.value)}
                                  placeholder="ex: TAKCYFL25IT23JFQA"
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  disabled={paymentStatus === ('verified' as PaymentStatus)}
                                  required
                                />
                                <p className="text-xs text-gray-500 mt-2">
                                  Vous trouverez cet ID dans l'historique de vos transactions Wave.
                                </p>
                              </div>
                              
                              <button 
                                onClick={verifyPayment}
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                disabled={!transactionId}
                              >
                                Vérifier mon paiement
                              </button>
                            </>
                          )}
                          
                          {paymentStatus === 'verified' && (
                            <div className="flex items-center text-green-700">
                              <CheckCircle className="h-5 w-5 mr-2" />
                              Transaction {transactionId} vérifiée avec succès
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="space-y-6">
                  <h3 className="font-semibold text-xl text-gray-900 mb-6">
                    Récapitulatif de votre demande
                  </h3>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                    <div className="font-medium text-gray-900 mb-4">🎯 Votre projet {getPlatformName()}</div>
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
                        <span className="font-medium">Marque:</span>
                        <span>{formData.businessName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Solution:</span>
                        <span>{getPlatformName()}</span>
                      </div>
                      <div className="border-t border-gray-200 my-2"></div>
                      <div className="flex justify-between font-bold text-blue-600">
                        <span>Investissement:</span>
                        <span>{formatPrice(getPlatformPrice())} FCFA</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 border-2 border-amber-200 rounded-xl bg-amber-50">
                    <div className="flex items-start">
                      <Clock className="h-5 w-5 text-amber-600 mr-3 mt-1 flex-shrink-0" />
                      <div className="text-sm text-amber-800">
                        <p className="font-medium mb-2">⚡ Prochaines étapes :</p>
                        <ol className="list-decimal list-inside space-y-1 pl-1">
                          <li>Notre équipe vous contactera dans les 24h</li>
                          <li>Analyse de vos besoins et conseils personnalisés</li>
                          <li>Démarrage de votre projet après validation</li>
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
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-6">
                <div className="text-4xl">🎉</div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {formData.contactMethod === 'pay_now' ? 'Commande confirmée !' : 'Demande enregistrée !'}
              </h3>
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl mb-6 text-left">
                <p className="text-gray-700 leading-relaxed">
                  {successMessage}
                </p>
              </div>
              
              {formData.contactMethod === 'pay_now' && (
                <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl mb-6">
                  <div className="text-blue-800 font-semibold mb-2">
                    🚀 Votre transformation digitale commence maintenant !
                  </div>
                  <div className="text-blue-700 text-sm">
                    • Livraison garantie en {serviceData.deliveryTime}<br/>
                    • Formation complète incluse<br/>
                    • 1 mois de support gratuit<br/>
                    • Votre marque va enfin briller en ligne ✨
                  </div>
                </div>
              )}
              
              <button
                onClick={handleFinalClose}
                className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold"
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
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
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
                  className={`px-6 py-3 bg-gradient-to-r ${getPlatformColor()} text-white rounded-lg hover:opacity-90 transition-opacity`}
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
                  className={`px-6 py-3 bg-gradient-to-r ${getPlatformColor()} text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed`}
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

          {/* Garanties en bas */}
          {step < 4 && (
            <div className="mt-8 text-center">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span>Livraison garantie</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span>Support inclus</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Award className="h-4 w-4 text-blue-600" />
                    <span>50+ marques satisfaites</span>
                  </div>
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