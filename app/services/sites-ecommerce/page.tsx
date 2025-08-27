// app/services/sites-ecommerce/page.tsx
'use client';

import React, { useState, useRef } from 'react';
import { 
  Calendar, 
  Check, 
  Package, 
  PieChart, 
  Award, 
  ShoppingCart, 
  Star, 
  ArrowRight, 
  Shield, 
  Zap, 
  BarChart, 
  XCircle,
  ExternalLink,
  Clock,
  TrendingUp,
  MessageCircle,
  AlertCircle,
  Smartphone,
  Laptop,
  Globe,
  Target,
  Users,
  Palette,
  LineChart,
  Heart,
  CheckCircle,
  PlayCircle,
  Quote,
  Lightbulb,
  Megaphone,
  Trophy,
  Bot,
  MessageSquare,
  Sparkles,
  TrendingDown,
  UserCheck,
  ShoppingBag,
  Plus,
  Send
} from 'lucide-react';

// Simuler les composants nécessaires pour la démo
interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

const Container = ({ children, className = "" }: ContainerProps) => (
  <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
    {children}
  </div>
);

interface PriceFormatterProps {
  amount: number;
}

const PriceFormatter = ({ amount }: PriceFormatterProps) => {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " FCFA";
};

// Types pour le modal
type PaymentStatus = 'not_started' | 'initiated' | 'verified';
type PaymentOption = 'full' | 'partial';
type ContactMethod = 'pay_now' | 'contact_later';
type PlatformOption = 'shopify' | 'wordpress';

// Composant Modal d'inscription complet
interface EcommerceModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlatform: 'shopify' | 'wordpress' | null;
  serviceData: {
    title: string;
    subtitle: string;
    price: {
      shopify: number;
      wordpress: number;
    };
    deliveryTime: string;
    portfolioItems: any[];
    features: string[];
  };
}

const EcommerceModal = ({ isOpen, onClose, selectedPlatform, serviceData }: EcommerceModalProps) => {
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

  React.useEffect(() => {
    if (selectedPlatform) {
      setFormData(prev => ({ ...prev, platformOption: selectedPlatform }));
    }
  }, [selectedPlatform]);

  React.useEffect(() => {
    if (isOpen) {
      setErrorDetails(null);
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
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
      return Math.ceil(basePrice * 0.95); // 5% de réduction
    } else {
      return Math.ceil(basePrice * 0.5);
    }
  };

  const getTotalAmount = (): number => {
    const basePrice = getPlatformPrice();
    
    if (formData.paymentOption === 'full') {
      return Math.ceil(basePrice * 0.95); // 5% de réduction
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
        window.open(wavePaymentLink, '_blank');
      }
      
      setPaymentWindowOpened(true);
      setPaymentStatus('initiated' as PaymentStatus);
      
    } catch (error) {
      console.error('Erreur:', error);
      setPaymentStatus('not_started' as PaymentStatus);
      setPaymentWindowOpened(false);
    }
  };
  
  const verifyPayment = async () => {
    if (!transactionId || transactionId.length < 8) {
      alert("Veuillez saisir un ID de transaction valide.");
      return;
    }
    
    try {
      // Simulation de vérification
      setTimeout(() => {
        setPaymentStatus('verified' as PaymentStatus);
        alert("Paiement vérifié avec succès.");
      }, 2000);
      
    } catch (error) {
      console.error('Erreur lors de la vérification:', error);
      setPaymentStatus('verified' as PaymentStatus);
      alert("Paiement vérifié avec succès.");
    }
  };
  
  const handleSubmit = async () => {
    if (formData.contactMethod === 'pay_now') {
      if (paymentStatus !== ('verified' as PaymentStatus)) {
        alert('Veuillez vérifier votre paiement avant de finaliser votre commande');
        return;
      }
    }
    
    setLoading(true);
    setErrorDetails(null);
    
    try {
      // Simulation d'envoi
      setTimeout(() => {
        if (formData.contactMethod === 'pay_now') {
          setSuccessMessage(`🎉 Félicitations ! Votre commande a été enregistrée avec succès. 

Notre équipe vous contactera dans les 24 heures pour commencer le développement de votre site e-commerce ${formData.platformOption === 'shopify' ? 'Shopify' : 'WordPress'} avec ChatSeller inclus. 

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
      platformOption: 'shopify' as PlatformOption,
      paymentOption: 'partial' as PaymentOption,
      contactMethod: 'pay_now' as ContactMethod,
    });
    setStep(1);
    setPaymentStatus('not_started' as PaymentStatus);
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
        "ChatSeller : Vendeur IA inclus",
        "Sécurité maximale"
      ];
    } else {
      return [
        "Personnalisation illimitée",
        "Aucun abonnement mensuel",
        "SEO optimisé",
        "ChatSeller : Vendeur IA inclus",
        "Contrôle total",
        "Extensions premium"
      ];
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {getPlatformIcon()}
            <h2 className="text-2xl font-bold text-gray-900">{getPlatformName()}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        {/* Prix et bénéfices plateforme */}
        <div className={`bg-gradient-to-r ${getPlatformColor()} text-white p-4 md:p-6 rounded-xl mb-6`}>
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div>
              <div className="text-2xl md:text-3xl font-bold">{formatPrice(getPlatformPrice())} FCFA</div>
              <div className="text-white/90 text-sm md:text-base">Boutique professionnelle pour marques</div>
            </div>
            <div className="text-right">
              <div className="bg-white/20 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium">
                {formData.platformOption === 'shopify' ? 'RECOMMANDÉ' : 'ÉCONOMIQUE'}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
            {getPlatformBenefits().map((benefit, index) => (
              <div key={index} className="flex items-center gap-2 text-xs md:text-sm">
                <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-white/80 flex-shrink-0" />
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

        {/* Étape 1: Informations personnelles */}
        {step === 1 && (
          <div className="space-y-6">
            <h3 className="font-semibold text-xl text-gray-900 mb-6">
              Parlez-nous de vous et de votre marque
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nom complet*</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email professionnel*</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Téléphone (WhatsApp)*</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+221 77 123 45 67"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Pays*</label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                <label className="block text-sm font-medium mb-2">Ville*</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <label className="block text-sm font-medium mb-2">Nom de votre marque/business*</label>
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Décrivez votre marque et vos produits*</label>
              <textarea
                name="businessDescription"
                value={formData.businessDescription}
                onChange={handleChange}
                rows={4}
                placeholder="Ex: Marque de vêtements africains modernes, créations artisanales, bijoux traditionnels..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Avez-vous déjà un site web ?</label>
              <input
                type="text"
                name="existingWebsite"
                value={formData.existingWebsite}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Bonus ChatSeller */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-xl border border-purple-200">
              <div className="flex items-center gap-3 mb-4">
                <Bot className="h-6 w-6 text-purple-600" />
                <h4 className="font-bold text-gray-900">Bonus : ChatSeller inclus</h4>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">GRATUIT</span>
              </div>
              <p className="text-sm text-gray-700 mb-3">
                En partenariat avec ChatSeller, votre boutique inclut automatiquement un Vendeur IA qui :
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-purple-500" />
                  <span>Répond aux questions clients 24/7</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-purple-500" />
                  <span>Booste vos conversions automatiquement</span>
                </div>
              </div>
            </div>

            {/* Choix de la plateforme (si pas prédéfinie) */}
            {!selectedPlatform && (
              <div className="space-y-4">
                <label className="block text-sm font-medium mb-2">Quelle plateforme préférez-vous ?*</label>
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
                        Solution tout-en-un, facile à gérer depuis smartphone + ChatSeller inclus
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
                        Personnalisable à l'infini, aucun abonnement + ChatSeller inclus
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* Option de paiement */}
            <div className="space-y-4">
              <label className="block text-sm font-medium mb-2">Option de paiement*</label>
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
                      Paiement intégral (-5%)
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">ÉCONOMIE</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatPrice(Math.ceil(getPlatformPrice() * 0.95))} FCFA (au lieu de {formatPrice(getPlatformPrice())} FCFA)
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Méthode de contact */}
            <div className="space-y-4">
              <label className="block text-sm font-medium mb-2">Comment souhaitez-vous procéder ?*</label>
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
                    <div className="text-sm text-gray-500">Votre projet démarre dès aujourd'hui</div>
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
                    <div className="text-sm text-gray-500">Un expert vous contactera dans les 24h</div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Étape 3: Paiement */}
        {step === 3 && (
          <div className="space-y-6">
            {formData.contactMethod === 'pay_now' ? (
              <>
                <h3 className="font-semibold text-xl text-gray-900 mb-6 flex items-center gap-3">
                  <Shield className="h-6 w-6 text-green-600" />
                  Finalisation de votre commande
                </h3>
                
                <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-xl border border-blue-200">
                  <div className="font-medium text-gray-900 mb-4">🎯 Récapitulatif de votre projet</div>
                  
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
                        <span>Réduction paiement intégral (-5%) :</span>
                        <span>-{formatPrice(getPlatformPrice() - Math.ceil(getPlatformPrice() * 0.95))} FCFA</span>
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

                {/* Rappel ChatSeller inclus */}
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-xl border border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Bot className="h-5 w-5 text-purple-600" />
                    <span className="font-medium text-gray-900">Bonus inclus : ChatSeller</span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">GRATUIT</span>
                  </div>
                  <p className="text-sm text-gray-700">
                    Vendeur IA pour booster automatiquement vos conversions (valeur 50 000 FCFA)
                  </p>
                </div>
                
                <div className="space-y-4">
                  {!paymentWindowOpened ? (
                    <div className="text-center p-6 border-2 border-dashed border-blue-300 rounded-xl bg-blue-50">
                      <p className="mb-4 text-gray-700">Cliquez sur le bouton ci-dessous pour effectuer votre paiement via Wave</p>
                      <button 
                        onClick={openWavePayment}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-colors flex items-center justify-center font-semibold text-lg shadow-lg mx-auto"
                      >
                        <span className="mr-3">💳</span>
                        Payer {formatPrice(getPaymentAmount())} FCFA avec Wave
                      </button>
                      <p className="text-xs text-gray-500 mt-3">🛡️ Paiement 100% sécurisé</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className={`p-6 rounded-xl border-2 ${paymentStatus === ('verified' as PaymentStatus) ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'}`}>
                        <h4 className="font-medium mb-3 text-lg">
                          {paymentStatus === ('verified' as PaymentStatus) ? '✅ Paiement vérifié avec succès !' : '💳 Confirmez votre paiement'}
                        </h4>
                        
                        {paymentStatus !== ('verified' as PaymentStatus) && (
                          <>
                            <p className="text-sm mb-4 text-gray-600">Après avoir effectué votre paiement, veuillez saisir l'ID de transaction qui se trouve dans votre application Wave.</p>
                            
                            <div className="mb-4">
                              <label className="block text-sm font-medium mb-2">ID de la Transaction Wave*</label>
                              <input
                                type="text"
                                value={transactionId}
                                onChange={(e) => setTransactionId(e.target.value)}
                                placeholder="ex: TAKCYFL25IT23JFQA"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                disabled={paymentStatus === ('verified' as PaymentStatus)}
                                required
                              />
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
                        
                        {paymentStatus === ('verified' as PaymentStatus) && (
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
                <h3 className="font-semibold text-xl text-gray-900 mb-6">Récapitulatif de votre demande</h3>
                
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
                        <li>Configuration de votre ChatSeller personnalisé</li>
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
                disabled={loading || (formData.contactMethod === 'pay_now' && paymentStatus !== ('verified' as PaymentStatus))}
                className={`px-6 py-3 bg-gradient-to-r ${getPlatformColor()} text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2 inline-block" />
                    Traitement...
                  </>
                ) : formData.contactMethod === 'pay_now' ? 'Finaliser ma commande' : 'Envoyer ma demande'}
              </button>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

// Données mises à jour
const serviceData = {
  title: "Sites E-commerce Professionnels pour Marques",
  subtitle: "La solution complète pour faire rayonner votre marque en ligne",
  shopifyPrice: 695000,
  wordpressPrice: 495000,
  deliveryTime: "7-10 jours ouvrés",
  portfolioItems: [
    { name: "Momo Le Bottier", url: "https://momolebottier.com", image: "/images/portfolio/momolebottier.png", category: "Chaussures" },
    { name: "Abarings", url: "https://abarings.com", image: "/images/portfolio/abarings.png", category: "Bijoux" },
    { name: "YoupyBaby", url: "https://youpybaby.com", image: "/images/portfolio/youpybaby.png", category: "Enfants" },
    { name: "Maika Déco", url: "https://maikadeco.com", image: "/images/portfolio/maikadeco.png", category: "Décoration" },
    { name: "6C No Filter", url: "https://6cnofilter.com", image: "/images/portfolio/6cnofilter.png", category: "Mode" },
    { name: "Viens on s'connaît", url: "https://viensonsconnait.com", image: "/images/portfolio/viensonsconnait.png", category: "Événements" }
  ],
  brandChallenges: [
    {
      icon: "📱",
      title: "Ventes limitées sur WhatsApp",
      description: "Vous vendez uniquement via les réseaux sociaux et WhatsApp, ce qui limite le potentiel réel de votre marque."
    },
    {
      icon: "😴",
      title: "Aucune vente la nuit",
      description: "Alors qu'Internet est ouvert 24h/24, votre marque arrête de vendre lorsque vous et vos équipes dormez."
    },
    {
      icon: "📊",
      title: "Pas de données sur vos clients",
      description: "Vous devez constamment trouver de nouveaux clients, car vous peinez à fidéliser ceux que vous avez déjà."
    },
    {
      icon: "🌍",
      title: "Portée limitée",
      description: "Vous êtes limité à votre marché local, alors que votre marque pourrait toucher des clients dans toute l'Afrique et au delà."
    },
    {
      icon: "💳",
      title: "Paiements compliqués",
      description: "Vous collectez manuellement chaque paiement, ce qui est épuisant et peut entraîner des erreurs dans votre trésorerie."
    },
    {
      icon: "🏪",
      title: "Image amateur",
      description: "Votre marque ne rassure pas votre cible, car vous n'avez pas de site professionnel crédible comme les grandes marques."
    }
  ],
  brandBenefits: [
    {
      icon: "🚀",
      title: "Ventes 24h/24, 7j/7",
      description: "Votre boutique en ligne travaille pour votre marque et génère des ventes, même la nuit, pendant que vous dormez."
    },
    {
      icon: "🌟",
      title: "Image de marque professionnelle",
      description: "Votre marque est perçue comme sérieuse et crédible, ce qui rassure vos potentiels clients et augmente vos ventes."
    },
    {
      icon: "📈",
      title: "Croissance exponentielle",
      description: "Vous vendez plus, plus vite, et à plus de clients, car votre site travaille en toute autonomie, sans aucune limite."
    },
    {
      icon: "💡",
      title: "Données précieuses",
      description: "Vous collectez des données sur vos clients, ce qui vous permet de mieux comprendre leurs besoins et améliorer vos offres."
    },
    {
      icon: "🌍",
      title: "Expansion internationale",
      description: "Votre marque peut atteindre des potentiels clients dans toute l'Afrique et au-delà, sans limites géographiques."
    },
    {
      icon: "⚡",
      title: "Automatisation complète",
      description: "La collecte des commandes et paiements est automatisée, ce qui vous permet de vous concentrer sur votre cœur de métier."
    }
  ],
  chatSellerFeatures: [
    {
      icon: <Bot className="w-6 h-6" />,
      title: "Vendeur IA Personnalisé",
      description: "Un agent commercial virtuel avec nom, avatar, titre et personnalité adapté à votre marque, et formé sur vos produits."
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Conversations Naturelles",
      description: "Interface de chat moderne qui permet à vos visiteurs de poser leurs questions comme à un vendeur réel."
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Reconnaissance Produits",
      description: "Identifie automatiquement le produit consulté et fournit des informations précises et personnalisées."
    },
    {
      icon: <ShoppingBag className="w-6 h-6" />,
      title: "Collecte de Commandes",
      description: "Collecte les informations de commande directement dans la conversation et facilite l'achat."
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Upsell Intelligent",
      description: "Propose automatiquement des produits complémentaires pertinents pour augmenter le panier moyen."
    },
    {
      icon: <UserCheck className="w-6 h-6" />,
      title: "Objections Levées",
      description: "Répond aux doutes, rassure les clients indécis et les guide vers l'achat avec expertise."
    }
  ],
  whyChooseUs: [
    {
      icon: <Award className="w-8 h-8" />,
      title: "Experts en marques africaines",
      description: "Nous comprenons les spécificités du marché africain et créons des expériences qui résonnent avec votre audience locale."
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "Fabrique de marques à succès",
      description: "Nous créons nos propres marques qui cartonnent en ligne. Cette expertise, nous la mettons au service de votre marque."
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Conversion avant tout",
      description: "Chaque élément de votre site est pensé pour transformer vos visiteurs en acheteurs, puis en clients fidèles."
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Mobile-first pour l'Afrique",
      description: "Tous nos sites sont optimisés pour Smartphone, car nous savons que 80% de vos clients utilisent leur mobile."
    }
  ],
  testimonials: [
    {
      name: "Mme Diouf",
      brand: "Momo Le Bottier",
      content: "TEKKI Studio a transformé notre marque de chaussures artisanales. En 3 mois, nous avons triplé nos ventes et touché des clients dans toute l'Afrique de l'Ouest.",
      avatar: "MD",
      rating: 5
    },
    {
      name: "Fatou Diedhiou", 
      brand: "Abarings",
      content: "Enfin une équipe qui comprend les marques africaines ! Notre boutique en ligne reflète parfaitement l'essence de notre marque de bijoux.",
      avatar: "FD",
      rating: 5
    },
    {
      name: "Mme Ndiaye",
      brand: "YoupyBaby", 
      content: "Grâce à TEKKI Studio, notre marque pour enfants a une présence en ligne professionnelle. Les commandes arrivent même la nuit !",
      avatar: "FN", 
      rating: 5
    }
  ],
  faqs: [
    {
      question: "Pourquoi choisir TEKKI Studio plutôt qu'un freelance ?",
      answer: "Nous sommes spécialisés dans les marques et l'e-commerce, principalement en Afrique. En tant que créateurs de marques à succès, nous savons exactement ce qui fonctionne pour faire décoller une marque en ligne. Nos sites ne sont pas de simples catalogues, ce sont de véritables machines de vente."
    },
    {
      question: "Quelle est la différence entre Shopify et WordPress ?",
      answer: "Shopify est une solution tout-en-un, facile à gérer, même depuis un smartphone. C'est idéal si vous voulez vous concentrer sur votre marque et ne pas avoir à gérer les aspects techniques. WordPress avec Woocommerce offre plus de personnalisation et pas d'abonnement mensuel. C'est parfait si vous avez des besoins techniques spécifiques."
    },
    {
      question: "Qu'est-ce que ChatSeller exactement ?",
      answer: "ChatSeller est un bonus que nous offrons en partenariat avec cette plateforme IA. C'est un Vendeur IA intelligent intégré dans votre boutique qui répond aux questions de vos visiteurs, les rassure et peut collecter les commandes. Il apparaît sous forme d'un bouton sur vos pages produits et booste significativement vos conversions."
    },
    {
      question: "ChatSeller coûte-t-il un supplément ?",
      answer: "Non ! ChatSeller est inclus gratuitement dans tous nos projets e-commerce grâce à notre partenariat. C'est notre façon de vous donner un avantage concurrentiel sans coût supplémentaire."
    },
    {
      question: "Combien de temps faut-il pour créer le site ?",
      answer: "7 à 10 jours ouvrés pour un site complet et optimisé avec ChatSeller intégré. Nous travaillons rapidement sans compromettre la qualité, car nous savons que le temps c'est de l'argent pour votre marque."
    },
    {
      question: "Puis-je voir des exemples de vos réalisations ?",
      answer: "Bien sûr ! Consultez notre portfolio ci-dessous avec des marques comme Momo Le Bottier, Abarings, YoupyBaby. Chaque site reflète l'identité unique de la marque tout en optimisant les conversions."
    }
  ]
};

export default function EcommerceServicePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<'shopify' | 'wordpress' | null>(null);
  const portfolioRef = useRef<HTMLElement>(null);
  const servicesRef = useRef<HTMLElement>(null);
  const chatSellerRef = useRef<HTMLElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const openModal = (platform: 'shopify' | 'wordpress') => {
    setSelectedPlatform(platform);
    setIsModalOpen(true);
  };

  return (
    <main className="overflow-x-hidden">
      {/* Hero Section - Focus marques */}
      <section className="relative pt-20 pb-32 bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 overflow-hidden">
        {/* Motifs décoratifs */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-300 rounded-full blur-3xl"></div>
        </div>

        <Container className="relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            {/* Badge d'introduction */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full mt-8 mb-8">
              <Trophy className="w-5 h-5 text-yellow-300" />
              <span className="text-white font-medium">
                Créateur #1 en Afrique de Sites pour les Marques
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
              Faites rayonner votre 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400"> marque</span> sur Internet
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-12 leading-relaxed max-w-4xl mx-auto">
              Bénéficiez de notre expertise en création de sites e-commerce pour les marques en Afrique, et obtenez une boutique en ligne professionnelle + un Vendeur IA intelligent qui convertit vos visiteurs en clients.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
              <button
                onClick={() => scrollToSection(servicesRef)}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-black px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-2xl flex items-center gap-3"
              >
                <ShoppingCart className="w-6 h-6" />
                Créer ma boutique en ligne
                <ArrowRight className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => scrollToSection(portfolioRef)}
                className="text-white border-2 border-white/30 hover:border-white/60 hover:bg-white/10 px-8 py-4 rounded-xl font-semibold transition-all flex items-center gap-3"
              >
                <PlayCircle className="w-6 h-6" />
                Voir nos réalisations
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-yellow-300 mb-2">+50</div>
                <div className="text-white/80 text-sm">Marques accompagnées</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-yellow-300 mb-2">230%</div>
                <div className="text-white/80 text-sm">Croissance moyenne</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-yellow-300 mb-2">24/7</div>
                <div className="text-white/80 text-sm">Ventes automatiques</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-yellow-300 mb-2">+15</div>
                <div className="text-white/80 text-sm">Pays couverts</div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Problèmes des marques */}
      <section className="py-20 bg-gray-50">
        <Container>
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Votre marque mérite une boutique en ligne crédible
            </h2>
            <p className="text-xl text-gray-600">
              Nous comprenons les défis des marques africaines qui veulent réussir en ligne
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {serviceData.brandChallenges.map((challenge, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all group">
                <div className="text-4xl mb-4">{challenge.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {challenge.title}
                </h3>
                <p className="text-gray-600">{challenge.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white p-8 rounded-2xl max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold mb-4">
                Arrêtez de limiter le potentiel de votre marque
              </h3>
              <p className="text-lg opacity-90">
                Chaque jour sans site e-commerce, c'est des ventes perdues, 
                des clients qui vont chez la concurrence, et votre marque qui stagne. 
                <strong> Il est temps de passer au niveau supérieur.</strong>
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Solutions - Transformation */}
      <section className="py-20 bg-white">
        <Container>
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Transformez votre marque en 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> empire digital</span> 🚀
            </h2>
            <p className="text-xl text-gray-600">
              Voici ce qui change quand votre marque a enfin la boutique en ligne qu'elle mérite
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {serviceData.brandBenefits.map((benefit, index) => (
              <div key={index} className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl border border-blue-100 hover:shadow-xl transition-all group hover:scale-105">
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Section ChatSeller - Bonus */}
      <section ref={chatSellerRef} className="py-20 bg-gradient-to-br from-purple-50 to-indigo-50">
        <Container>
          <div className="max-w-4xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800 px-4 py-2 rounded-full mb-6 font-medium">
              <Plus className="w-4 h-4" />
              BONUS EXCLUSIF
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Votre 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600"> Vendeur IA</span> personnel
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Grâce à notre partenariat avec ChatSeller, chaque boutique que nous créons inclut automatiquement un Vendeur IA pour booster vos conversions.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto items-center mb-16">
            {/* Interface ChatSeller */}
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                {/* Header du chat */}
                <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <Bot className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-semibold">Aminata - Conseillère Mode</div>
                      <div className="text-sm opacity-90">En ligne • Répond instantanément</div>
                    </div>
                  </div>
                </div>
                
                {/* Messages du chat */}
                <div className="p-4 space-y-4 h-96 overflow-y-auto bg-gray-50">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      A
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm max-w-xs">
                      <p className="text-sm">Bonjour 👋🏼 Je suis Aminata, votre conseillère personnelle. Je vois que vous vous intéressez à nos robes prêt-à-porter. Comment puis-je vous aider ?</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <div className="bg-purple-600 text-white p-3 rounded-lg max-w-xs">
                      <p className="text-sm">Bonjour Aminata ! Je cherche une robe pour un mariage, en taille M.</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      A
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm max-w-xs">
                      <p className="text-sm">Je vois ! Alors, pour un mariage, je vous recommande notre robe "Élégance Wax" en taille M. Elle est disponible en 3 coloris. Souhaitez-vous que je vous montre les options ?</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <div className="bg-purple-600 text-white p-3 rounded-lg max-w-xs">
                      <p className="text-sm">Oui, s'il vous plaît ! Et combien coûte-t-elle ?</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      A
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm max-w-xs">
                      <p className="text-sm">Elle est à 45 000 FCFA avec livraison gratuite. Je peux vous proposer un ensemble assorti (foulard + bijoux) pour seulement 15 000 FCFA de plus. Ça vous intéresse ?</p>
                    </div>
                  </div>
                </div>
                
                {/* Zone de saisie */}
                <div className="p-4 border-t">
                  <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">
                    <input 
                      type="text" 
                      placeholder="Posez votre question..."
                      className="flex-1 bg-transparent outline-none text-sm"
                      disabled
                    />
                    <button className="text-purple-600">
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Badge flottant */}
              <div className="absolute -top-4 -right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                Vente réalisée !
              </div>
            </div>
            
            {/* Fonctionnalités */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-8">
                Ce que fait votre Vendeur IA :
              </h3>
              
              <div className="space-y-6">
                {serviceData.chatSellerFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-4 group">
                    <div className="text-purple-600 group-hover:text-purple-700 transition-colors flex-shrink-0">
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                        {feature.title}
                      </h4>
                      <p className="text-gray-600">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Résultat garanti
                </h4>
                <p className="text-gray-700">
                  Vos conversions augmentent de <strong>200 à 300%</strong> car vos visiteurs sont accompagnés comme dans une boutique physique avec un vendeur expert.
                </p>
              </div>
            </div>
          </div>

          {/* CTA ChatSeller */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-8 rounded-2xl max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold mb-4 flex items-center justify-center gap-3">
                <Bot className="w-8 h-8" />
                ChatSeller inclus GRATUITEMENT
              </h3>
              <p className="text-lg opacity-90 mb-6">
                Grâce à notre partenariat, chaque site e-commerce que nous créons inclut un Vendeur IA sans coût supplémentaire. C'est notre façon de vous donner un avantage concurrentiel unique.
              </p>
              <button
                onClick={() => scrollToSection(servicesRef)}
                className="bg-white text-purple-600 px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors"
              >
                Découvrir nos offres avec ChatSeller
              </button>
            </div>
          </div>
        </Container>
      </section>

      {/* Nos offres avec ChatSeller inclus */}
      <section ref={servicesRef} className="py-20 bg-gradient-to-br from-gray-900 to-blue-900">
              <Container>
                <div className="max-w-4xl mx-auto text-center mb-16">
                  <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                    Boutique E-commerce + Vendeur IA Intelligent = Succès Garanti
                  </h2>
                  <p className="text-xl text-white/80">
                    Deux solutions professionnelles, ChatSeller inclus gratuitement dans les deux
                  </p>
                </div>
                
                <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                  {/* Offre Shopify + ChatSeller */}
                  <div className="bg-white rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all group hover:scale-105 relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-gradient-to-l from-green-500 to-emerald-400 text-white px-6 py-2 rounded-bl-2xl">
                      <span className="font-bold text-sm">TOUT-EN-UN</span>
                    </div>
                    
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center">
                        <Smartphone className="w-8 h-8 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">Shopify Premium + ChatSeller</h3>
                        <p className="text-green-600 font-medium">La solution complète avec Vendeur IA</p>
                      </div>
                    </div>
                    
                    <div className="mb-8">
                      <div className="text-4xl font-bold text-gray-900 mb-2">
                        <PriceFormatter amount={serviceData.shopifyPrice} />
                      </div>
                      <p className="text-gray-600">Boutique + Vendeur IA inclus</p>
                    </div>
      
                    {/* Badge ChatSeller */}
                    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-xl mb-6 border border-purple-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Bot className="w-5 h-5 text-purple-600" />
                        <span className="font-bold text-gray-900">ChatSeller inclus</span>
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">GRATUIT</span>
                      </div>
                      <p className="text-sm text-gray-700">Vendeur IA personnalisé qui convertit vos visiteurs en clients</p>
                    </div>
                    
                    <div className="space-y-4 mb-8">
                      {[
                        "Design sur-mesure reflétant votre marque",
                        "Interface ultra-simple (gérable depuis smartphone)",
                        "Vendeur IA personnalisé, disponible 24h/24",
                        "Conversations qui convertissent automatiquement",
                        "Applications premium pour automatisation",
                        "Support technique + formation",
                        "Ajout de fonctionnalités uniques",
                        "1 mois d'accompagnement gratuit"
                      ].map((feature, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <button
                      onClick={() => openModal('shopify')}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-3"
                    >
                      <Bot className="w-5 h-5" />
                      Choisir Shopify + ChatSeller
                      <ArrowRight className="w-5 h-5" />
                    </button>
                    
                    <p className="text-center text-sm text-gray-500 mt-4">
                      Parfait pour les marques qui veulent la simplicité + IA
                    </p>
                  </div>
      
                  {/* Offre WordPress + ChatSeller */}
                  <div className="bg-white rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all group hover:scale-105 relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-gradient-to-l from-blue-500 to-indigo-400 text-white px-6 py-2 rounded-bl-2xl">
                      <span className="font-bold text-sm">PERSONNALISABLE</span>
                    </div>
                    
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
                        <Laptop className="w-8 h-8 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">WordPress Pro + ChatSeller</h3>
                        <p className="text-blue-600 font-medium">Personnalisation infinie + Vendeur IA</p>
                      </div>
                    </div>
                    
                    <div className="mb-8">
                      <div className="text-4xl font-bold text-gray-900 mb-2">
                        <PriceFormatter amount={serviceData.wordpressPrice} />
                      </div>
                      <p className="text-gray-600">Boutique + Vendeur IA inclus</p>
                    </div>
      
                    {/* Badge ChatSeller */}
                    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-xl mb-6 border border-purple-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Bot className="w-5 h-5 text-purple-600" />
                        <span className="font-bold text-gray-900">ChatSeller inclus</span>
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">GRATUIT</span>
                      </div>
                      <p className="text-sm text-gray-700">Vendeur IA entièrement personnalisable selon vos besoins</p>
                    </div>
                    
                    <div className="space-y-4 mb-8">
                      {[
                        "Design 100% personnalisé pour votre marque",
                        "Aucun abonnement mensuel (hébergement d'1 an)",
                        "Vendeur IA personnalisé, disponible 24h/24",
                        "WooCommerce optimisé pour conversions",
                        "SEO avancé pour Google & réseaux sociaux",
                        "2 Extensions premium incluses",
                        "Formation complète pour gérer votre site",
                        "1 mois de support gratuit"
                      ].map((feature, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <button
                      onClick={() => openModal('wordpress')}
                      className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-3"
                    >
                      <Bot className="w-5 h-5" />
                      Choisir WordPress + ChatSeller
                      <ArrowRight className="w-5 h-5" />
                    </button>
                    
                    <p className="text-center text-sm text-gray-500 mt-4">
                      Parfait pour les marques qui veulent le contrôle
                    </p>
                  </div>
                </div>
      
                <div className="text-center mt-16">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-3xl mx-auto">
                    <h3 className="text-2xl font-bold text-white mb-4">
                      Vous hésitez entre les deux solutions ?
                    </h3>
                    <p className="text-white/90 mb-6">
                      Nos experts analysent votre marque et vous conseillent la solution la plus adaptée à votre situation. 
                      Consultation gratuite de 15min.
                    </p>
                    <a 
                      href="https://calendly.com/tekki-studio" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-white text-gray-900 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors inline-block"
                    >
                      Réserver une consultation gratuite
                    </a>
                  </div>
                </div>
              </Container>
            </section>

      {/* Portfolio */}
      <section ref={portfolioRef} className="py-20 bg-white">
        <Container>
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Des marques africaines qui 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-red-500"> cartonnent</span> grâce à nous
            </h2>
            <p className="text-xl text-gray-600">
              La preuve par l'exemple : des boutiques en ligne qui transforment réellement les visiteurs en clients
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
            {serviceData.portfolioItems.map((item, index) => (
              <a 
                key={index}
                href={item.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 h-80 block cursor-pointer"
              >
                {/* Image de fond */}
                <div className="absolute inset-0">
                  {item.image ? (
                    <img 
                      src={item.image} 
                      alt={`${item.name} - ${item.category}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        // Fallback vers une image placeholder en cas d'erreur
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = `https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=320&fit=crop&crop=center&auto=format&q=60`;
                      }}
                    />
                  ) : (
                    // Image placeholder par défaut
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <div className="text-white text-center">
                        <ShoppingCart className="w-16 h-16 mx-auto mb-3 opacity-50" />
                        <div className="text-lg font-semibold opacity-75">{item.category}</div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Overlay sombre au hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Contenu au survol */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1 text-sm font-medium mb-3 inline-block">
                    {item.category}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{item.name}</h3>
                  <div className="inline-flex items-center gap-2 text-white/90 group-hover:text-white transition-colors">
                    Visiter le site
                    <ExternalLink className="w-4 h-4" />
                  </div>
                </div>
                
                {/* Badge "En ligne" */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-green-500 text-white text-xs px-3 py-1 rounded-full font-bold">
                    ✓ En ligne
                  </div>
                </div>

                {/* Overlay subtil permanent pour améliorer la lisibilité */}
                <div className="absolute inset-0 bg-black/10"></div>
              </a>
            ))}
          </div>

          <div className="text-center">
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Résultats concrets de nos clients
              </h3>
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">+200%</div>
                  <div className="text-gray-700">Ventes en moyenne</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
                  <div className="text-gray-700">Commandes automatiques</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">+15</div>
                  <div className="text-gray-700">Pays de livraison</div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Pourquoi nous choisir */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <Container>
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Pourquoi les marques africaines nous font-elles confiance ?
            </h2>
            <p className="text-xl text-gray-600">
              Parce que nous ne sommes pas juste des développeurs. Nous sommes des créateurs de marques.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {serviceData.whyChooseUs.map((reason, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all group">
                <div className="flex items-start gap-6">
                  <div className="text-blue-600 group-hover:text-blue-700 transition-colors">
                    {reason.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                      {reason.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {reason.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Témoignages */}
      <section className="py-20 bg-white">
        <Container>
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Ce que disent nos marques clients
            </h2>
            <p className="text-xl text-gray-600">
              Des témoignages authentiques de marques qui ont transformé leur business
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {serviceData.testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all group">
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                
                <div className="relative mb-6">
                  <Quote className="absolute -top-2 -left-2 w-8 h-8 text-blue-200" />
                  <p className="text-gray-700 italic leading-relaxed pl-6">
                    "{testimonial.content}"
                  </p>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{testimonial.name}</div>
                    <div className="text-blue-600 font-medium">{testimonial.brand}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-50">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
                Questions fréquentes
              </h2>
              <p className="text-xl text-gray-600">
                Tout ce que vous devez savoir avant de franchir le pas
              </p>
            </div>
            
            <div className="space-y-6">
              {serviceData.faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-all">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative overflow-hidden">
        {/* Effets visuels */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-400 rounded-full blur-3xl"></div>
        </div>

        <Container className="relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight">
              Prêt à faire décoller votre marque ?
            </h2>
            
            <p className="text-xl md:text-2xl text-white/90 mb-12 leading-relaxed max-w-4xl mx-auto">
              Rejoignez les dizaines de marques africaines qui ont choisi TEKKI Studio 
              pour <strong>transformer leur vision en empire digital</strong>. 
              ChatSeller inclus gratuitement.
            </p>
            
            <div className="flex flex-col lg:flex-row items-center justify-center gap-8 mb-16">
              <button
                onClick={() => openModal('shopify')}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-black px-10 py-5 rounded-2xl font-bold text-xl transition-all transform hover:scale-105 shadow-2xl flex items-center gap-3"
              >
                <Smartphone className="w-6 h-6" />
                Commencer avec Shopify
                <ArrowRight className="w-6 h-6" />
              </button>
              
              <button
                onClick={() => openModal('wordpress')}
                className="bg-white/10 backdrop-blur-sm border-2 border-white/30 hover:bg-white/20 text-white px-10 py-5 rounded-2xl font-bold text-xl transition-all flex items-center gap-3"
              >
                <Laptop className="w-6 h-6" />
                Commencer avec WordPress
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-4xl mx-auto">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <Shield className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <h3 className="font-bold text-white mb-2">Livraison garantie</h3>
                  <p className="text-white/80 text-sm">Recevez votre site en 7 jours ouvrés</p>
                </div>
                <div className="text-center">
                  <Bot className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                  <h3 className="font-bold text-white mb-2">ChatSeller inclus</h3>
                  <p className="text-white/80 text-sm">Vendeur IA gratuit avec chaque site</p>
                </div>
                <div className="text-center">
                  <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                  <h3 className="font-bold text-white mb-2">Expertise prouvée</h3>
                  <p className="text-white/80 text-sm">+50 marques accompagnées avec succès</p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Modal d'inscription complet */}
      <EcommerceModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedPlatform={selectedPlatform}
        serviceData={{
          title: serviceData.title,
          subtitle: serviceData.subtitle,
          price: {
            shopify: serviceData.shopifyPrice,
            wordpress: serviceData.wordpressPrice
          },
          deliveryTime: serviceData.deliveryTime,
          portfolioItems: serviceData.portfolioItems,
          features: []
        }}
      />
    </main>
  );
}