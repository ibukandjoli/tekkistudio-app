// app/components/business/InterestModal.tsx
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

interface InterestModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessName: string;
  businessPrice: string;
  businessId: string | number; // Accepte les deux types
}

const InterestModal = ({ isOpen, onClose, businessName, businessPrice, businessId }: InterestModalProps) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    country: '',
    city: '',
    paymentOption: 'full',
    investmentReadiness: '',
    experience: '',
    timeline: 'immediate',
    questions: '',
    isWhatsApp: false,
    subscribeToUpdates: false
  });

  const paymentOptions = [
    {
      id: 'full',
      label: 'Paiement intégral',
      description: 'Recevez une réduction de 5% supplémentaire'
    },
    {
      id: 'two',
      label: 'Paiement en 2 fois',
      description: '60% à la commande, 40% à la livraison'
    },
    {
      id: 'three',
      label: 'Paiement en 3 fois',
      description: '40% à la commande, 30% à la livraison, 30% après 30 jours'
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
    // Exemple basique - à adapter selon vos besoins spécifiques
    const phoneRegex = /^(\+[0-9]{1,3})?[0-9]{9,15}$/;
    return phoneRegex.test(phone.replace(/[\s-]/g, ''));
  };

  // Fonction pour gérer la fermeture avec délai
  const handleDelayedClose = () => {
    // Réinitialiser les états du formulaire
    setSuccess(false);
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      country: '',
      city: '',
      paymentOption: 'full',
      investmentReadiness: '',
      experience: '',
      timeline: 'immediate',
      questions: '',
      isWhatsApp: false,
      subscribeToUpdates: false
    });
    onClose();
  };

  // Fonction pour gérer l'inscription à la liste WhatsApp
  const handleWhatsAppSubscription = async () => {
    if (!formData.subscribeToUpdates) return true;
    
    try {
      console.log("Tentative d'inscription à la liste WhatsApp:", formData.phone);
      
      // Formater le numéro de téléphone (supprimer espaces, tirets, etc.)
      const formattedPhone = formData.phone.replace(/[\s-]/g, '');
      
      // Vérifier d'abord si ce numéro existe déjà
      const { data: existingSubscriber } = await supabase
        .from('whatsapp_subscribers')
        .select('id, status')
        .eq('phone', formattedPhone)
        .maybeSingle();
      
      if (existingSubscriber) {
        console.log("Abonné WhatsApp existant:", existingSubscriber);
        
        // Si l'abonné existe mais a un statut inactif, le réactiver
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
        // Créer un nouvel abonné
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
      
      console.log("Inscription/MAJ à la liste WhatsApp réussie");
      return true;
    } catch (error) {
      console.error("Erreur globale d'inscription WhatsApp:", error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      console.log("Business ID reçu:", businessId, "type:", typeof businessId);
      
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
        // Toujours inclure business_id sans vérification
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
        subscribe_to_updates: formData.subscribeToUpdates
      };
      
      console.log("Données à insérer:", interestData);
      
      const { data, error } = await supabase
        .from('business_interests')
        .insert([interestData]);
  
      if (error) {
        console.error("Erreur Supabase:", error);
        throw error;
      }
      
      console.log("Données enregistrées avec succès:", data);
      
      // Enregistrer également dans activity_logs
      try {
        await supabase
          .from('activity_logs')
          .insert([
            {
              action: 'create',
              entity_type: 'business_interest',
              entity_id: null, // On ne connaît pas l'ID généré à ce stade
              details: { 
                businessName,
                businessId: String(businessId),
                email: formData.email,
                fullName: formData.fullName
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
          duration: 5000 // Afficher plus longtemps (5 secondes)
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
      // Ne pas mettre à false si on est en succès, car on veut montrer le loader 
      // pendant le délai avant fermeture
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

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto my-4">
        {success ? (
          // Écran de succès
          <div className="py-10 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-[#0f4c81] mb-2">Demande envoyée avec succès !</h2>
            <p className="text-gray-600 mb-6">
              Notre équipe vous contactera sous 24h pour discuter des prochaines étapes.
            </p>
            <p className="text-sm text-gray-500">Fermeture automatique dans quelques secondes...</p>
          </div>
        ) : (
          // Formulaire normal
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-[#0f4c81]">
                Acquérir {businessName}
              </DialogTitle>
              <DialogDescription asChild>
                <div>
                  <span className="text-[#ff7f50] font-semibold">Prix : {businessPrice}</span>
                  <p className="mt-2">
                    Remplissez ce formulaire pour manifester votre intérêt. Notre équipe vous contactera dans les 24h pour discuter des prochaines étapes.
                  </p>
                </div>
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6 mt-4">
              {/* Informations personnelles */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#0f4c81]">Informations personnelles</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="fullName">
                      Nom complet*
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
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
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff7f50]"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="phone">
                      Téléphone* 
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff7f50]"
                      required
                    />
                  </div>

                  <div className="flex items-center">
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
                  
                  <div>
                    <label className="block text-sm font-medium mb-1" htmlFor="country">
                      Pays*
                    </label>
                    <input
                      type="text"
                      id="country"
                      value={formData.country}
                      onChange={(e) => setFormData({...formData, country: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff7f50]"
                      required
                    />
                  </div>
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
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff7f50]"
                    required
                  />
                </div>
              </div>

              {/* Mode de paiement */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#0f4c81]">Mode de paiement préféré</h3>
                
                <div className="space-y-3">
                  {paymentOptions.map(option => (
                    <label 
                      key={option.id}
                      className="flex items-start p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                    >
                      <input
                        type="radio"
                        name="paymentOption"
                        value={option.id}
                        checked={formData.paymentOption === option.id}
                        onChange={(e) => setFormData({...formData, paymentOption: e.target.value})}
                        className="mt-1"
                      />
                      <div className="ml-3">
                        <div className="font-medium">{option.label}</div>
                        <div className="text-sm text-gray-500">{option.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Questions qualifiantes */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[#0f4c81]">Quelques questions</h3>
                
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="investmentReadiness">
                    Avez-vous le budget nécessaire pour cet investissement ?*
                  </label>
                  <select
                    id="investmentReadiness"
                    value={formData.investmentReadiness}
                    onChange={(e) => setFormData({...formData, investmentReadiness: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff7f50]"
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
                    Avez-vous une expérience en e-commerce ?
                  </label>
                  <select
                    id="experience"
                    value={formData.experience}
                    onChange={(e) => setFormData({...formData, experience: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff7f50]"
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
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff7f50]"
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
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff7f50] h-24"
                    placeholder="Vos questions ou commentaires éventuels..."
                  />
                </div>
              </div>

              <div className="flex items-center mt-2">
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

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-[#ff7f50] text-white py-3 rounded-lg hover:bg-[#ff6b3d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Envoi en cours...
                    </>
                  ) : 'Envoyer ma demande'}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading || success}
                  className="flex-1 border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Annuler
                </button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default InterestModal;