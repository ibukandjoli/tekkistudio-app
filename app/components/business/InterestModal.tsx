// app/components/business/InterestModal.tsx
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
import { X, CheckCircle, ChevronLeft, Phone, Mail, Map, CheckCircle2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import  useMediaQuery  from '../../hooks/useMediaQuery';

interface InterestModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessName: string;
  businessPrice: string;
  businessId: string | number;
  businessType?: 'digital' | 'physical' | 'ecommerce'; 
}

const InterestModal = ({ 
  isOpen, 
  onClose, 
  businessName, 
  businessPrice, 
  businessId,
  businessType = 'digital' 
}: InterestModalProps) => {
  // État pour suivre l'étape actuelle dans le formulaire multi-étapes
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Hook personnalisé pour détecter si l'affichage est sur mobile
  const isMobile = useMediaQuery('(max-width: 640px)');
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    country: '',
    city: '',
    paymentOption: businessType === 'digital' ? 'full' : 'progressive', // Option par défaut selon le type
    investmentReadiness: '',
    experience: '',
    timeline: 'immediate',
    questions: '',
    isWhatsApp: false,
    subscribeToUpdates: true // Activé par défaut pour augmenter les conversions
  });

  // Réinitialiser l'étape lors de l'ouverture
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
    }
  }, [isOpen]);

  const paymentOptions = [
    {
      id: 'full',
      label: 'Paiement intégral',
      description: 'Recevez une réduction de 5% supplémentaire',
      icon: '💰',
      recommended: businessType === 'digital'
    },
    {
      id: 'two',
      label: 'Paiement en 2 fois',
      description: '60% à la commande, 40% à la livraison',
      icon: '📅',
      recommended: false
    },
    {
      id: 'three',
      label: 'Paiement en 3 fois',
      description: '40% à la commande, 30% à la livraison, 30% après 30 jours',
      icon: '📊',
      recommended: false
    },
    {
      id: 'progressive',
      label: 'Acquisition progressive',
      description: '40% à la commande + versements mensuels pendant 6 mois',
      icon: '🚀',
      recommended: businessType === 'physical' || businessType === 'ecommerce'
    }
  ];

  const timelineOptions = [
    { id: 'immediate', label: 'Je souhaite démarrer immédiatement' },
    { id: '1month', label: 'Dans le mois à venir' },
    { id: '3months', label: 'Dans les 3 prochains mois' },
    { id: 'exploring', label: 'Je me renseigne simplement' }
  ];

  // Fonction de validation de numéro de téléphone
  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^(\+[0-9]{1,3})?[0-9]{9,15}$/;
    return phoneRegex.test(phone.replace(/[\s-]/g, ''));
  };

  // Fonction pour gérer la fermeture avec délai
  const handleDelayedClose = () => {
    setSuccess(false);
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      country: '',
      city: '',
      paymentOption: businessType === 'digital' ? 'full' : 'progressive',
      investmentReadiness: '',
      experience: '',
      timeline: 'immediate',
      questions: '',
      isWhatsApp: false,
      subscribeToUpdates: true
    });
    onClose();
  };

  // Fonction pour gérer l'inscription à la liste WhatsApp
  const handleWhatsAppSubscription = async () => {
    if (!formData.subscribeToUpdates) return true;
    
    try {
      const formattedPhone = formData.phone.replace(/[\s-]/g, '');
      
      const { data: existingSubscriber } = await supabase
        .from('whatsapp_subscribers')
        .select('id, status')
        .eq('phone', formattedPhone)
        .maybeSingle();
      
      if (existingSubscriber) {
        if (existingSubscriber.status !== 'active') {
          const { error: updateError } = await supabase
            .from('whatsapp_subscribers')
            .update({ 
              status: 'active',
              name: formData.fullName,
              email: formData.email,
              country: formData.country,
              updated_at: new Date().toISOString()
            })
            .eq('id', existingSubscriber.id);
          
          if (updateError) {
            console.error("Erreur lors de la mise à jour de l'abonné WhatsApp:", updateError);
            return false;
          }
        }
      } else {
        const { error: insertError } = await supabase
          .from('whatsapp_subscribers')
          .insert([{
            phone: formattedPhone,
            country: formData.country,
            name: formData.fullName,
            email: formData.email,
            status: 'active',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }]);
        
        if (insertError) {
          console.error("Erreur lors de l'insertion de l'abonné WhatsApp:", insertError);
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.error("Erreur globale d'inscription WhatsApp:", error);
      return false;
    }
  };

  // Validation à chaque étape
  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return formData.fullName && formData.email && formData.phone && validatePhoneNumber(formData.phone);
      case 2:
        return formData.country && formData.city && formData.paymentOption;
      case 3:
        return formData.investmentReadiness && formData.timeline;
      default:
        return true;
    }
  };

  // Avancer à l'étape suivante
  const goToNextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    } else {
      if (currentStep === 1 && !validatePhoneNumber(formData.phone)) {
        toast.error('Veuillez entrer un numéro de téléphone valide');
      } else {
        toast.error('Veuillez remplir tous les champs obligatoires');
      }
    }
  };

  // Retourner à l'étape précédente
  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      // Vérifier d'abord le numéro de téléphone
      if (!validatePhoneNumber(formData.phone)) {
        toast.error('Veuillez entrer un numéro de téléphone valide');
        setLoading(false);
        return;
      }

      // Gérer l'inscription WhatsApp en premier
      const whatsAppSuccess = await handleWhatsAppSubscription();
      
      if (!whatsAppSuccess) {
        console.warn("L'inscription WhatsApp a échoué mais nous continuons le processus principal");
      }

      // Créer l'entrée dans business_interests
      const interestData = {
        business_id: businessId,
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        country: formData.country,
        city: formData.city,
        payment_option: formData.paymentOption,
        investment_readiness: formData.investmentReadiness,
        experience: formData.experience || null,
        timeline: formData.timeline,
        questions: formData.questions || null,
        status: 'new',
        is_whatsapp: formData.isWhatsApp,
        subscribe_to_updates: formData.subscribeToUpdates,
        business_type: businessType
      };
      
      const { data, error } = await supabase
        .from('business_interests')
        .insert([interestData]);
  
      if (error) {
        console.error("Erreur Supabase:", error);
        throw error;
      }
      
      // Enregistrer également dans activity_logs
      try {
        await supabase
          .from('activity_logs')
          .insert([
            {
              action: 'create',
              entity_type: 'business_interest',
              entity_id: null,
              details: { 
                businessName,
                businessId: String(businessId),
                email: formData.email,
                fullName: formData.fullName,
                businessType
              }
            }
          ]);
      } catch (logError) {
        console.warn('Erreur lors de la création du log:', logError);
      }
  
      // Afficher le message de succès et marquer le formulaire comme réussi
      toast.success(
        'Demande envoyée avec succès !', 
        { 
          description: 'Notre équipe vous contactera sous 24h pour discuter des prochaines étapes.', 
          duration: 5000
        }
      );
      
      setSuccess(true);
      
      // Fermer la modale après un délai suffisant (3 secondes)
      setTimeout(() => {
        handleDelayedClose();
      }, 3000);
      
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      toast.error('Une erreur est survenue. Veuillez réessayer.');
      setLoading(false);
    } finally {
      if (!success) {
        setLoading(false);
      }
    }
  };

  // Empêcher la fermeture immédiate du modal si le formulaire est en cours de soumission ou vient d'être soumis
  const handleOpenChange = (open: boolean) => {
    if (!open && (loading || success)) {
      return; // Empêcher la fermeture
    }
    onClose();
  };

  // Gestion de l'apparence selon le type de business
  const getThemeColor = () => {
    switch (businessType) {
      case 'digital':
        return 'text-tekki-coral';
      case 'physical':
      case 'ecommerce':
        return 'text-tekki-blue';
      default:
        return 'text-tekki-blue';
    }
  };

  const getButtonColor = () => {
    switch (businessType) {
      case 'digital':
        return 'bg-tekki-coral hover:bg-tekki-coral/90';
      case 'physical':
      case 'ecommerce':
        return 'bg-tekki-blue hover:bg-tekki-blue/90';
      default:
        return 'bg-tekki-blue hover:bg-tekki-blue/90';
    }
  };

  // Rendu de l'étape actuelle
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className={`text-lg font-semibold ${getThemeColor()} flex items-center`}>
              <Mail className="mr-2 h-5 w-5" />
              Étape 1: Vos coordonnées
            </h3>
            
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="fullName">
                Nom complet*
              </label>
              <input
                type="text"
                id="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                className="w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-tekki-coral"
                required
                placeholder="Votre nom et prénom"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="email">
                Email*
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-tekki-coral"
                required
                placeholder="Votre adresse email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="phone">
                Téléphone* 
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-tekki-coral"
                  required
                  placeholder="+221 xx xxx xx xx"
                />
              </div>
            </div>

            <div className="flex items-center bg-gray-50 p-3 rounded-lg">
              <input
                type="checkbox"
                id="isWhatsApp"
                checked={formData.isWhatsApp}
                onChange={(e) => setFormData({...formData, isWhatsApp: e.target.checked})}
                className="mr-2"
              />
              <label htmlFor="isWhatsApp" className="text-sm text-gray-700">
                Ce numéro est joignable sur WhatsApp
              </label>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h3 className={`text-lg font-semibold ${getThemeColor()} flex items-center`}>
              <Map className="mr-2 h-5 w-5" />
              Étape 2: Localisation et paiement
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="country">
                  Pays*
                </label>
                <input
                  type="text"
                  id="country"
                  value={formData.country}
                  onChange={(e) => setFormData({...formData, country: e.target.value})}
                  className="w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-tekki-coral"
                  required
                  placeholder="Votre pays"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="city">
                  Ville*
                </label>
                <input
                  type="text"
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  className="w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-tekki-coral"
                  required
                  placeholder="Votre ville"
                />
              </div>
            </div>

            <div className="space-y-4 mt-4">
              <h4 className="font-medium">Mode de paiement préféré*</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {paymentOptions.map(option => (
                  <label 
                    key={option.id}
                    className={cn(
                      "flex items-start p-3 border rounded-lg cursor-pointer transition-all",
                      "hover:bg-gray-50 hover:border-gray-300",
                      formData.paymentOption === option.id ? (
                        businessType === 'digital' 
                          ? "border-tekki-coral bg-orange-50" 
                          : "border-tekki-blue bg-blue-50"
                      ) : "border-gray-200",
                      option.recommended ? "relative overflow-hidden" : ""
                    )}
                  >
                    {option.recommended && (
                      <div className={cn(
                        "absolute -right-10 top-5 px-10 py-1 transform rotate-45 text-xs text-white",
                        businessType === 'digital' ? "bg-tekki-coral" : "bg-tekki-blue"
                      )}>
                        RECOMMANDÉ
                      </div>
                    )}
                    
                    <input
                      type="radio"
                      name="paymentOption"
                      value={option.id}
                      checked={formData.paymentOption === option.id}
                      onChange={(e) => setFormData({...formData, paymentOption: e.target.value})}
                      className="mt-1"
                    />
                    <div className="ml-3">
                      <div className="font-medium flex items-center">
                        <span className="mr-2">{option.icon}</span>
                        {option.label}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">{option.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h3 className={`text-lg font-semibold ${getThemeColor()} flex items-center`}>
              <CheckCircle className="mr-2 h-5 w-5" />
              Étape 3: Derniers détails
            </h3>
            
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="investmentReadiness">
                Avez-vous le budget nécessaire pour cet investissement ?*
              </label>
              <select
                id="investmentReadiness"
                value={formData.investmentReadiness}
                onChange={(e) => setFormData({...formData, investmentReadiness: e.target.value})}
                className="w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-tekki-coral"
                required
              >
                <option value="">Sélectionnez une réponse</option>
                <option value="ready">Oui, je suis prêt à investir</option>
                <option value="partial">J'ai une partie du montant</option>
                <option value="preparing">Je prépare le budget</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="experience">
                Avez-vous une expérience en {businessType === 'digital' ? 'business digital' : 'e-commerce'} ?
              </label>
              <select
                id="experience"
                value={formData.experience}
                onChange={(e) => setFormData({...formData, experience: e.target.value})}
                className="w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-tekki-coral"
              >
                <option value="">Sélectionnez une réponse</option>
                <option value="none">Aucune expérience</option>
                <option value="beginner">Débutant</option>
                <option value="intermediate">Intermédiaire</option>
                <option value="expert">Expert</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="timeline">
                Quand souhaitez-vous démarrer ?*
              </label>
              <select
                id="timeline"
                value={formData.timeline}
                onChange={(e) => setFormData({...formData, timeline: e.target.value})}
                className="w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-tekki-coral"
                required
              >
                {timelineOptions.map(option => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="questions">
                Questions ou commentaires
              </label>
              <textarea
                id="questions"
                value={formData.questions}
                onChange={(e) => setFormData({...formData, questions: e.target.value})}
                className="w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-tekki-coral h-24"
                placeholder="Vos questions ou commentaires éventuels..."
              />
            </div>

            <div className="flex items-center py-2 px-3 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                id="subscribeToUpdates"
                checked={formData.subscribeToUpdates}
                onChange={(e) => setFormData({...formData, subscribeToUpdates: e.target.checked})}
                className="mr-2"
              />
              <label htmlFor="subscribeToUpdates" className="text-sm text-gray-700">
                Je souhaite être informé(e), via WhatsApp, de vos nouveaux business et formations
              </label>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Fenêtre modale avec adaptation selon si mobile ou desktop
  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={handleOpenChange}
    >
      <DialogContent 
        className={cn(
          "overflow-y-auto my-4 transition-all",
          isMobile 
            ? "w-full max-w-full h-[100dvh] p-0 rounded-none" 
            : "sm:max-w-[600px] max-h-[90vh]"
        )}
      >
        {success ? (
          // Écran de succès
          <div className="py-10 px-6 text-center h-full flex flex-col items-center justify-center">
            <div className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6",
              businessType === 'digital' ? "bg-orange-100" : "bg-blue-100"
            )}>
              <CheckCircle2 className={cn(
                "h-8 w-8",
                businessType === 'digital' ? "text-tekki-coral" : "text-tekki-blue"
              )} />
            </div>
            <h2 className={cn(
              "text-2xl font-bold mb-4",
              businessType === 'digital' ? "text-tekki-coral" : "text-tekki-blue"
            )}>
              Demande envoyée avec succès !
            </h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Notre équipe vous contactera sous 24h pour discuter des prochaines étapes concernant l'acquisition de <span className="font-semibold">{businessName}</span>.
            </p>
            <p className="text-sm text-gray-500">Fermeture automatique dans quelques secondes...</p>
          </div>
        ) : (
          // Formulaire multi-étapes
          <>
            {/* Header adaptatif */}
            <div className={cn(
              "sticky top-0 z-10",
              isMobile ? "bg-white border-b px-4 py-3" : ""
            )}>
              {isMobile && (
                <div className="flex items-center justify-between mb-2">
                  {currentStep > 1 ? (
                    <button 
                      onClick={goToPreviousStep} 
                      className="flex items-center text-gray-600"
                    >
                      <ChevronLeft className="h-5 w-5 mr-1" />
                      Retour
                    </button>
                  ) : (
                    <div></div>
                  )}
                  
                  <button 
                    onClick={onClose}
                    className="rounded-full p-1 hover:bg-gray-100"
                    aria-label="Fermer"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
              )}
              
              <DialogHeader className={isMobile ? "text-left" : ""}>
                <DialogTitle className={cn(
                  "text-xl font-bold flex items-center",
                  businessType === 'digital' ? "text-tekki-coral" : "text-tekki-blue"
                )}>
                  {businessType === 'digital' ? '🚀' : '🛍️'} Acquérir {businessName}
                </DialogTitle>
                <DialogDescription asChild>
                  <div className={isMobile ? "mt-1" : "mt-2"}>
                    <span className={cn(
                      "font-semibold",
                      businessType === 'digital' ? "text-tekki-coral" : "text-tekki-blue"
                    )}>
                      Prix : {businessPrice}
                    </span>
                    {!isMobile && (
                      <p className="mt-2 text-gray-600">
                        Remplissez ce formulaire pour manifester votre intérêt. Notre équipe vous contactera dans les 24h.
                      </p>
                    )}
                  </div>
                </DialogDescription>
              </DialogHeader>
              
              {/* Indicateur de progression */}
              <div className={cn("flex justify-between w-full", isMobile ? "mt-3" : "mt-6")}>
                {Array.from({ length: totalSteps }).map((_, index) => (
                  <div key={index} className="relative flex-1">
                    <div className={cn(
                      "h-1 rounded-full transition-all",
                      index < currentStep ? (
                        businessType === 'digital' ? "bg-tekki-coral" : "bg-tekki-blue"
                      ) : "bg-gray-200"
                    )}></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Corps du formulaire */}
            <div className={cn("mt-6", isMobile ? "px-4 pb-4" : "")}>
              {renderStep()}
            </div>

            {/* Actions de navigation entre étapes */}
            <div className={cn(
              "flex gap-4 mt-6",
              isMobile ? "p-4 border-t sticky bottom-0 bg-white" : ""
            )}>
              {!isMobile && currentStep > 1 && (
                <button
                  type="button"
                  onClick={goToPreviousStep}
                  className="flex-1 border border-gray-300 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Retour
                </button>
              )}
              
              <button
                type="button"
                onClick={goToNextStep}
                disabled={loading}
                className={cn(
                  "flex-1 text-white py-3 px-4 rounded-lg transition-colors flex justify-center items-center",
                  getButtonColor(),
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Envoi en cours...
                  </>
                ) : currentStep < totalSteps ? (
                  'Continuer'
                ) : (
                  'Envoyer ma demande'
                )}
              </button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default InterestModal;