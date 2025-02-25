'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/app/lib/supabase';
import { withAdminAuth } from '@/app/lib/withAdminAuth';
import {
  ArrowLeft,
  Calendar,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Clock,
  FileQuestion,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { formatRelativeDate } from '@/app/lib/utils/date-utils';

// Types
interface BusinessInterest {
  id: string;
  business_id: string | null;
  full_name: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  payment_option: string;
  investment_readiness: string;
  experience: string | null;
  timeline: string;
  questions: string | null;
  status: 'new' | 'contacted' | 'negotiating' | 'sold' | 'cancelled';
  created_at: string;
  updated_at: string;
  is_whatsapp: boolean;
}

interface Business {
  id: string;
  name: string;
  slug: string;
  price: number;
  status: 'available' | 'sold';
}

type StatusType = 'new' | 'contacted' | 'negotiating' | 'sold' | 'cancelled';
type PaymentOptionType = 'full' | 'two' | 'three';
type ReadinessType = 'ready' | 'partial' | 'preparing';
type ExperienceType = 'none' | 'beginner' | 'intermediate' | 'expert';
type TimelineType = 'immediate' | '1month' | '3months' | 'exploring';

const translateStatus = (status: string): string => {
  const statusMap: Record<StatusType, string> = {
    new: 'Nouveau',
    contacted: 'Contacté',
    negotiating: 'En négociation',
    sold: 'Vendu',
    cancelled: 'Annulé'
  };
  return statusMap[status as StatusType] || status;
};

const translatePaymentOption = (option: string): string => {
  const optionMap: Record<PaymentOptionType, string> = {
    full: 'Paiement intégral (remise 5%)',
    two: 'Paiement en 2 fois (60%/40%)',
    three: 'Paiement en 3 fois (40%/30%/30%)'
  };
  return optionMap[option as PaymentOptionType] || option;
};

const translateInvestmentReadiness = (readiness: string): string => {
  const readinessMap: Record<ReadinessType, string> = {
    ready: 'Prêt à investir',
    partial: 'Budget partiel disponible',
    preparing: 'En préparation du budget'
  };
  return readinessMap[readiness as ReadinessType] || readiness;
};

const translateExperience = (experience: string | null): string => {
  if (!experience) return 'Non précisé';
  
  const experienceMap: Record<ExperienceType, string> = {
    none: 'Aucune expérience',
    beginner: 'Débutant',
    intermediate: 'Intermédiaire',
    expert: 'Expert'
  };
  return experienceMap[experience as ExperienceType] || experience;
};

const translateTimeline = (timeline: string): string => {
  const timelineMap: Record<TimelineType, string> = {
    immediate: 'Souhaite démarrer immédiatement',
    '1month': 'Dans le mois à venir',
    '3months': 'Dans les 3 prochains mois',
    exploring: 'Se renseigne simplement'
  };
  return timelineMap[timeline as TimelineType] || timeline;
};

const getStatusColor = (status: string): string => {
  const colorMap: Record<StatusType, string> = {
    new: 'bg-blue-100 text-blue-800 border-blue-200',
    contacted: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    negotiating: 'bg-purple-100 text-purple-800 border-purple-200',
    sold: 'bg-green-100 text-green-800 border-green-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200'
  };
  return colorMap[status as StatusType] || 'bg-gray-100 text-gray-800 border-gray-200';
};

function LeadDetailPage() {
  const router = useRouter();
  const params = useParams();
  const leadId = params.id as string;
  
  const [lead, setLead] = useState<BusinessInterest | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchLeadDetails();
  }, [leadId]);

  const fetchLeadDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      // Récupérer les détails du lead
      const { data: leadData, error: leadError } = await supabase
        .from('business_interests')
        .select('*')
        .eq('id', leadId)
        .single();

      if (leadError) throw leadError;
      setLead(leadData);

      // Si le lead a un business_id, récupérer les infos du business
      if (leadData.business_id) {
        const { data: businessData, error: businessError } = await supabase
          .from('businesses')
          .select('id, name, slug, price, status')
          .eq('id', leadData.business_id)
          .single();

        if (businessError) {
          console.error("Erreur lors de la récupération du business:", businessError);
        } else {
          setBusiness(businessData);
        }
      }
    } catch (err) {
      console.error('Erreur lors du chargement des détails:', err);
      setError('Une erreur est survenue lors du chargement des détails du prospect');
    } finally {
      setLoading(false);
    }
  };

  const updateLeadStatus = async (newStatus: StatusType) => {
    if (!lead) return;
    
    try {
      setIsUpdating(true);
      
      // Mettre à jour le statut du lead
      const { error: updateError } = await supabase
        .from('business_interests')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', lead.id);

      if (updateError) throw updateError;

      // Si le statut est "sold" et qu'il y a un business associé, mettre à jour le statut du business
      if (newStatus === 'sold' && business) {
        const { error: businessUpdateError } = await supabase
          .from('businesses')
          .update({ status: 'sold' })
          .eq('id', business.id);

        if (businessUpdateError) {
          console.error("Erreur lors de la mise à jour du statut du business:", businessUpdateError);
        }
      }

      // Ajouter une entrée dans les activity_logs
      await supabase
        .from('activity_logs')
        .insert([
          {
            action: 'update',
            entity_type: 'business_interest',
            entity_id: lead.id,
            details: { 
              previousStatus: lead.status,
              newStatus,
              updatedAt: new Date().toISOString()
            }
          }
        ]);

      // Mettre à jour l'état local
      setLead({
        ...lead,
        status: newStatus,
        updated_at: new Date().toISOString()
      });

      // Si le business existe et que le statut est "sold", mettre à jour l'état local
      if (newStatus === 'sold' && business) {
        setBusiness({
          ...business,
          status: 'sold'
        });
      }
    } catch (err) {
      console.error('Erreur lors de la mise à jour du statut:', err);
      alert('Une erreur est survenue lors de la mise à jour du statut');
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-[#ff7f50]" />
      </div>
    );
  }

  if (error || !lead) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-6">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-red-700">{error || "Ce prospect n'existe pas ou a été supprimé"}</p>
          </div>
        </div>
        <Link 
          href="/admin/dashboard" 
          className="inline-flex items-center text-[#0f4c81] hover:text-[#ff7f50]"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour au tableau de bord
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Fil d'Ariane et navigation */}
      <div className="mb-8">
        <Link 
          href="/admin/dashboard" 
          className="inline-flex items-center text-[#0f4c81] hover:text-[#ff7f50]"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour au tableau de bord
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Colonne principale */}
        <div className="lg:col-span-2 space-y-6">
          {/* En-tête */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-[#0f4c81]">{lead.full_name}</h1>
                <p className="text-gray-500 mt-1">
                  Prospect depuis le {new Date(lead.created_at).toLocaleDateString('fr-FR')}
                  {' '}({formatRelativeDate(lead.created_at)})
                </p>
              </div>

              <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(lead.status)}`}>
                {translateStatus(lead.status)}
              </div>
            </div>
          </div>

          {/* Informations du business */}
          {business && (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold text-[#0f4c81] mb-4 border-b pb-2">
                Business concerné
              </h2>
              
              <div className="flex items-start">
                <div className="flex-grow">
                  <h3 className="font-medium text-lg">{business.name}</h3>
                  <div className="mt-2 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Prix</p>
                      <p className="font-medium">{business.price.toLocaleString('fr-FR')} FCFA</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Statut</p>
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        business.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {business.status === 'available' ? 'Disponible' : 'Vendu'}
                      </span>
                    </div>
                  </div>
                </div>
                <Link
                  href={`/admin/businesses/${business.id}/edit`}
                  className="bg-[#0f4c81] text-white px-3 py-1 rounded text-sm hover:bg-opacity-90 transition-colors"
                >
                  Voir le business
                </Link>
              </div>
            </div>
          )}

          {/* Informations sur l'investissement */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-[#0f4c81] mb-4 border-b pb-2">
              Informations sur l'investissement
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-gray-500 text-sm">Option de paiement préférée</p>
                <p className="font-medium">{translatePaymentOption(lead.payment_option)}</p>
              </div>
              
              <div>
                <p className="text-gray-500 text-sm">Budget disponible</p>
                <p className="font-medium">{translateInvestmentReadiness(lead.investment_readiness)}</p>
              </div>
              
              <div>
                <p className="text-gray-500 text-sm">Expérience en e-commerce</p>
                <p className="font-medium">{translateExperience(lead.experience)}</p>
              </div>
              
              <div>
                <p className="text-gray-500 text-sm">Calendrier de démarrage</p>
                <p className="font-medium">{translateTimeline(lead.timeline)}</p>
              </div>
            </div>
            
            {lead.questions && (
              <div className="mt-6 pt-4 border-t border-gray-100">
                <p className="text-gray-500 text-sm mb-2">Questions ou commentaires</p>
                <div className="bg-gray-50 p-4 rounded-md text-gray-700">
                  {lead.questions}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Colonne latérale */}
        <div className="space-y-6">
          {/* Actions */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="font-semibold text-[#0f4c81] mb-4">Actions</h2>
            
            <div className="space-y-3">
              {lead.status === 'new' && (
                <button
                  onClick={() => updateLeadStatus('contacted')}
                  disabled={isUpdating}
                  className="w-full bg-[#0f4c81] text-white py-2 rounded hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdating ? 'Mise à jour...' : 'Marquer comme contacté'}
                </button>
              )}
              
              {lead.status === 'contacted' && (
                <button
                  onClick={() => updateLeadStatus('negotiating')}
                  disabled={isUpdating}
                  className="w-full bg-purple-600 text-white py-2 rounded hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdating ? 'Mise à jour...' : 'Marquer en négociation'}
                </button>
              )}
              
              {lead.status === 'negotiating' && (
                <button
                  onClick={() => updateLeadStatus('sold')}
                  disabled={isUpdating}
                  className="w-full bg-green-600 text-white py-2 rounded hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdating ? 'Mise à jour...' : 'Marquer comme vendu'}
                </button>
              )}
              
              {lead.status !== 'cancelled' && lead.status !== 'sold' && (
                <button
                  onClick={() => updateLeadStatus('cancelled')}
                  disabled={isUpdating}
                  className="w-full bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdating ? 'Mise à jour...' : 'Annuler la demande'}
                </button>
              )}
              
              {/* Boutons de contact */}
              <div className="pt-4 border-t mt-4">
                <a
                  href={`mailto:${lead.email}`}
                  className="w-full bg-[#ff7f50] text-white py-2 rounded hover:bg-opacity-90 transition-colors flex justify-center items-center"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Envoyer un email
                </a>
                
                <a
                  href={`tel:${lead.phone}`}
                  className="w-full mt-2 border border-[#0f4c81] text-[#0f4c81] py-2 rounded hover:bg-gray-50 transition-colors flex justify-center items-center"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Appeler
                </a>
                
                {lead.is_whatsapp && (
                  <a
                    href={`https://wa.me/${lead.phone.replace(/\s+/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full mt-2 bg-green-500 text-white py-2 rounded hover:bg-opacity-90 transition-colors flex justify-center items-center"
                  >
                    <span className="mr-2">WhatsApp</span>
                    Contacter
                  </a>
                )}
              </div>
            </div>
          </div>
          
          {/* Informations de contact */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="font-semibold text-[#0f4c81] mb-4">Informations de contact</h2>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <Mail className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <a href={`mailto:${lead.email}`} className="text-[#0f4c81] hover:underline">
                    {lead.email}
                  </a>
                </div>
              </div>
              
              <div className="flex items-start">
                <Phone className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Téléphone</p>
                  <a href={`tel:${lead.phone}`} className="text-[#0f4c81] hover:underline">
                    {lead.phone}
                  </a>
                  {lead.is_whatsapp && (
                    <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                      WhatsApp
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Localisation</p>
                  <p>{lead.city}, {lead.country}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAdminAuth(LeadDetailPage);