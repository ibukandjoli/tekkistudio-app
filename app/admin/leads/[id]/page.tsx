// app/admin/leads/[id]/page.tsx
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
  Loader2,
  Info,
  MessageSquare,
  Edit,
  FileText,
  Activity,
  Building,
  ShoppingBag,
  HelpCircle,
  DollarSign,
  Briefcase,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Textarea } from "@/app/components/ui/textarea";
import { Label } from "@/app/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/app/components/ui/breadcrumb";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";

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
  notes?: string;
}

interface Business {
  id: string;
  name: string;
  slug: string;
  price: number;
  status: 'available' | 'sold';
  description?: string;
  monthly_revenue?: number;
  monthly_profit?: number;
  category?: string;
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

const getStatusBadgeClass = (status: string): string => {
  const colorMap: Record<StatusType, string> = {
    new: 'bg-blue-100 text-blue-800',
    contacted: 'bg-yellow-100 text-yellow-800',
    negotiating: 'bg-purple-100 text-purple-800',
    sold: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  };
  return colorMap[status as StatusType] || 'bg-gray-100 text-gray-800';
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'new': return <Info className="h-4 w-4" />;
    case 'contacted': return <Mail className="h-4 w-4" />;
    case 'negotiating': return <Activity className="h-4 w-4" />;
    case 'sold': return <CheckCircle className="h-4 w-4" />;
    case 'cancelled': return <AlertCircle className="h-4 w-4" />;
    default: return <Info className="h-4 w-4" />;
  }
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
  const [activeTab, setActiveTab] = useState('overview');
  const [isNotesDialogOpen, setIsNotesDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [notes, setNotes] = useState<string>('');
  const [newStatus, setNewStatus] = useState<StatusType>('new');

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
      setNotes(leadData.notes || '');
      setNewStatus(leadData.status);

      // Si le lead a un business_id, récupérer les infos du business
      if (leadData.business_id) {
        const { data: businessData, error: businessError } = await supabase
          .from('businesses')
          .select('*')
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

  const updateLeadStatus = async (newStatusValue: StatusType) => {
    if (!lead) return;
    
    try {
      setIsUpdating(true);
      
      // Mettre à jour le statut du lead
      const { error: updateError } = await supabase
        .from('business_interests')
        .update({ 
          status: newStatusValue,
          updated_at: new Date().toISOString()
        })
        .eq('id', lead.id);

      if (updateError) throw updateError;

      // Si le statut est "sold" et qu'il y a un business associé, mettre à jour le statut du business
      if (newStatusValue === 'sold' && business) {
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
              newStatus: newStatusValue,
              updatedAt: new Date().toISOString()
            }
          }
        ]);

      // Mettre à jour l'état local
      setLead({
        ...lead,
        status: newStatusValue,
        updated_at: new Date().toISOString()
      });

      // Si le business existe et que le statut est "sold", mettre à jour l'état local
      if (newStatusValue === 'sold' && business) {
        setBusiness({
          ...business,
          status: 'sold'
        });
      }
      
      // Fermer le dialogue si ouvert
      setIsStatusDialogOpen(false);
      
      // Notification de succès
      toast.success(`Statut mis à jour avec succès: ${translateStatus(newStatusValue)}`);
    } catch (err) {
      console.error('Erreur lors de la mise à jour du statut:', err);
      toast.error('Une erreur est survenue lors de la mise à jour du statut');
    } finally {
      setIsUpdating(false);
    }
  };
  
  const updateLeadNotes = async () => {
    if (!lead) return;
    
    setIsUpdating(true);
    
    try {
      // Mettre à jour les notes du lead
      const { error: updateError } = await supabase
        .from('business_interests')
        .update({ 
          notes: notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', lead.id);
      
      if (updateError) throw updateError;
      
      // Mettre à jour l'état local
      setLead({
        ...lead,
        notes: notes,
        updated_at: new Date().toISOString()
      });
      
      // Fermer la modale et afficher un message de succès
      setIsNotesDialogOpen(false);
      toast.success('Notes mises à jour avec succès');
      
    } catch (err: any) {
      console.error('Erreur lors de la mise à jour des notes:', err);
      toast.error(`Erreur: ${err.message || 'Impossible de mettre à jour les notes'}`);
    } finally {
      setIsUpdating(false);
    }
  };

  // Obtenir le statut suivant logique
  const getNextStatus = (currentStatus: string): StatusType => {
    switch (currentStatus) {
      case 'new': return 'contacted';
      case 'contacted': return 'negotiating';
      case 'negotiating': return 'sold';
      default: return 'new';
    }
  };

  // Obtenir la description du statut suivant
  const getNextStatusDescription = (currentStatus: string): string => {
    switch (currentStatus) {
      case 'new': return 'Marquer comme contacté';
      case 'contacted': return 'Passer en négociation';
      case 'negotiating': return 'Marquer comme vendu';
      default: return 'Changer le statut';
    }
  };

  // Formater une date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Calculer le temps écoulé depuis la création en jours
  const getDaysSinceCreation = (dateString: string): number => {
    const created = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Obtenir la date relative (aujourd'hui, hier, etc.)
  const getRelativeDate = (dateString: string): string => {
    const days = getDaysSinceCreation(dateString);
    if (days === 0) return "Aujourd'hui";
    if (days === 1) return "Hier";
    return `Il y a ${days} jours`;
  };

  // Obtenir la classe CSS pour la priorité en fonction du temps écoulé
  const getPriorityClass = (dateString: string): string => {
    const days = getDaysSinceCreation(dateString);
    if (days >= 7) return "text-red-600";
    if (days >= 3) return "text-yellow-600";
    return "text-green-600";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-[#0f4c81]" />
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
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Fil d'Ariane */}
      <div className="mb-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/leads">Prospects Business</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>{lead.full_name}</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* En-tête avec résumé */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-[#0f4c81]">{lead.full_name}</h1>
              <Badge className={`${getStatusBadgeClass(lead.status)} flex items-center gap-1`}>
                {getStatusIcon(lead.status)}
                {translateStatus(lead.status)}
              </Badge>
            </div>
            <p className="text-gray-500 mt-1 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Prospect depuis le {formatDate(lead.created_at)}
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getPriorityClass(lead.created_at)}`}>
                {getRelativeDate(lead.created_at)}
              </span>
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {lead.status !== 'sold' && lead.status !== 'cancelled' && (
              <Button 
                className="bg-[#0f4c81] text-white hover:bg-[#0f4c81]/90"
                onClick={() => updateLeadStatus(getNextStatus(lead.status))}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <CheckCircle className="h-4 w-4 mr-2" />
                )}
                {getNextStatusDescription(lead.status)}
              </Button>
            )}
            <Link href={`mailto:${lead.email}`} passHref>
              <Button className="bg-[#ff7f50] text-white hover:bg-[#ff7f50]/90">
                <Mail className="h-4 w-4 mr-2" />
                Envoyer un email
              </Button>
            </Link>
            <Link href={`tel:${lead.phone}`} passHref>
              <Button variant="outline" className="border-[#0f4c81] text-[#0f4c81]">
                <Phone className="h-4 w-4 mr-2" />
                Appeler
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Onglets et contenu principal */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-3 h-auto">
          <TabsTrigger value="overview" className="py-2">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="business" className="py-2">Business concerné</TabsTrigger>
          <TabsTrigger value="notes" className="py-2">Notes & Suivi</TabsTrigger>
        </TabsList>

        {/* Tab: Vue d'ensemble */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Colonne principale */}
            <div className="lg:col-span-2 space-y-6">
              {/* Résumé rapide */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-[#0f4c81]">
                    Résumé du prospect
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Business intéressé</h3>
                      <p className="text-lg font-medium">
                        {business ? business.name : "Non spécifié"}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Budget</h3>
                      <p className="font-medium">
                        {translateInvestmentReadiness(lead.investment_readiness)}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Contact</h3>
                      <div className="flex flex-col">
                        <a href={`mailto:${lead.email}`} className="text-[#0f4c81] hover:underline flex items-center gap-1">
                          <Mail className="h-3 w-3" /> {lead.email}
                        </a>
                        <a href={`tel:${lead.phone}`} className="text-[#0f4c81] hover:underline flex items-center gap-1">
                          <Phone className="h-3 w-3" /> {lead.phone}
                          {lead.is_whatsapp && (
                            <span className="ml-1 text-xs bg-green-100 text-green-800 px-1 py-0.5 rounded">
                              WhatsApp
                            </span>
                          )}
                        </a>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Localisation</h3>
                      <p className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-gray-500" />
                        {lead.city}, {lead.country}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Informations business */}
              {business && (
                <Card>
                  <CardHeader className="flex flex-row items-start justify-between">
                    <div>
                      <CardTitle className="text-lg text-[#0f4c81]">
                        Business concerné
                      </CardTitle>
                      <CardDescription>
                        Détails sur le business auquel le prospect s'intéresse
                      </CardDescription>
                    </div>
                    <Link href={`/admin/businesses/${business.id}/edit`} passHref>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Voir le business
                      </Button>
                    </Link>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Nom</h3>
                        <p className="text-lg font-medium">{business.name}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Prix</h3>
                        <p className="text-lg font-medium text-green-700">{business.price.toLocaleString('fr-FR')} FCFA</p>
                      </div>
                      
                      {business.category && (
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-1">Catégorie</h3>
                          <p className="font-medium">{business.category}</p>
                        </div>
                      )}
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Statut</h3>
                        <Badge className={business.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {business.status === 'available' ? 'Disponible' : 'Vendu'}
                        </Badge>
                      </div>
                      
                      {business.monthly_revenue && (
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-1">CA mensuel</h3>
                          <p className="font-medium">{business.monthly_revenue.toLocaleString('fr-FR')} FCFA</p>
                        </div>
                      )}
                      
                      {business.monthly_profit && (
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 mb-1">Profit mensuel</h3>
                          <p className="font-medium">{business.monthly_profit.toLocaleString('fr-FR')} FCFA</p>
                        </div>
                      )}
                    </div>
                    
                    {business.description && (
                      <div className="mt-4">
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
                        <div className="bg-gray-50 p-3 rounded-md text-sm">
                          {business.description}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Questions et commentaires */}
              {lead.questions && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-[#0f4c81]">
                      Questions et commentaires
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 p-4 rounded-md">
                      {lead.questions.split('\n').map((line, index) => (
                        <p key={index} className="mb-2">{line}</p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Colonne latérale */}
            <div className="space-y-6">
              {/* Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-[#0f4c81]">
                    Actions rapides
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setIsStatusDialogOpen(true)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Changer le statut
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setIsNotesDialogOpen(true)}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    {lead.notes ? 'Modifier les notes' : 'Ajouter des notes'}
                  </Button>
                  
                  <div className="border-t my-2"></div>
                  
                  {lead.is_whatsapp && (
                    <Link href={`https://wa.me/${lead.phone.replace(/\s+/g, '')}`} target="_blank" passHref>
                      <Button 
                        className="w-full bg-green-500 text-white hover:bg-green-600"
                      >
                        <svg viewBox="0 0 24 24" width="16" height="16" className="mr-2">
                          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"></path>
                        </svg>
                        Contacter sur WhatsApp
                      </Button>
                    </Link>
                  )}
                  
                  {lead.status !== 'cancelled' && lead.status !== 'sold' && (
                    <Button 
                      variant="outline" 
                      className="w-full text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => updateLeadStatus('cancelled')}
                      disabled={isUpdating}
                    >
                      {isUpdating ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <AlertCircle className="h-4 w-4 mr-2" />
                      )}
                      Annuler le prospect
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Informations d'investissement */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-[#0f4c81]">
                    Informations d'investissement
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Option de paiement</h3>
                    <p className="font-medium">{translatePaymentOption(lead.payment_option)}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Budget disponible</h3>
                    <p className="font-medium">{translateInvestmentReadiness(lead.investment_readiness)}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Expérience</h3>
                    <p className="font-medium">{translateExperience(lead.experience)}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Calendrier</h3>
                    <p className="font-medium">{translateTimeline(lead.timeline)}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Tab: Business concerné */}
        <TabsContent value="business" className="space-y-6">
          {business ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Informations business */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg text-[#0f4c81]">
                    <div className="flex items-center gap-2">
                      <Building className="h-5 w-5" />
                      {business.name}
                    </div>
                  </CardTitle>
                  <CardDescription>
                    Détails complets du business
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Prix demandé</h3>
                      <p className="text-2xl font-bold text-green-700">{business.price.toLocaleString('fr-FR')} FCFA</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Statut actuel</h3>
                      <Badge className={business.status === 'available' ? 'bg-green-100 text-green-800 px-3 py-1' : 'bg-gray-100 text-gray-800 px-3 py-1'}>
                        {business.status === 'available' ? 'Disponible à la vente' : 'Vendu'}
                      </Badge>
                    </div>
                    
                    {business.category && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Catégorie</h3>
                        <Badge variant="outline" className="px-3 py-1">
                          {business.category}
                        </Badge>
                      </div>
                    )}
                    
                    {business.monthly_revenue && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">CA mensuel moyen</h3>
                        <p className="font-medium text-lg">{business.monthly_revenue.toLocaleString('fr-FR')} FCFA</p>
                      </div>
                    )}
                    
                    {business.monthly_profit && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Profit mensuel moyen</h3>
                        <p className="font-medium text-lg">{business.monthly_profit.toLocaleString('fr-FR')} FCFA</p>
                      </div>
                    )}
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">URL publique</h3>
                      <a 
                        href={`/business/${business.slug}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-[#0f4c81] hover:underline flex items-center gap-1"
                      >
                        <ExternalLink className="h-3 w-3" />
                        /business/{business.slug}
                      </a>
                    </div>
                  </div>
                  
                  {business.description && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Description du business</h3>
                      <div className="bg-gray-50 p-4 rounded-md">
                        {business.description.split('\n').map((line, index) => (
                          <p key={index} className="mb-2">{line}</p>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Actions business */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-[#0f4c81]">
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="h-5 w-5" />
                      Actions
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Link href={`/admin/businesses/${business.id}/edit`} passHref>
                      <Button className="w-full bg-[#0f4c81]">
                        <Edit className="h-4 w-4 mr-2" />
                        Modifier le business
                      </Button>
                    </Link>
                    
                    <Link href={`/business/${business.slug}`} target="_blank" passHref>
                      <Button variant="outline" className="w-full">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Voir la page publique
                      </Button>
                    </Link>
                    
                    {business.status === 'available' && lead.status !== 'sold' && (
                      <Button 
                        className="w-full bg-green-600 hover:bg-green-700"
                        onClick={() => updateLeadStatus('sold')}
                        disabled={isUpdating}
                      >
                        {isUpdating ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <DollarSign className="h-4 w-4 mr-2" />
                        )}
                        Marquer comme vendu
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {/* Informations d'investissement du prospect */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg text-[#0f4c81]">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5" />
                      Préférences d'investissement
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Option de paiement préférée</h3>
                      <p className="font-medium">{translatePaymentOption(lead.payment_option)}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Budget disponible</h3>
                      <p className="font-medium">{translateInvestmentReadiness(lead.investment_readiness)}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Expérience en e-commerce</h3>
                      <p className="font-medium">{translateExperience(lead.experience)}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Calendrier de démarrage</h3>
                      <p className="font-medium">{translateTimeline(lead.timeline)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200 shadow-sm">
              <ShoppingBag className="h-12 w-12 mx-auto text-gray-300 mb-3" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">Aucun business associé</h3>
              <p className="text-gray-500 max-w-md mx-auto mb-6">
                Ce prospect n'a pas encore été associé à un business spécifique. 
                Il s'agit peut-être d'une demande générale d'information.
              </p>
              <Button
                variant="outline"
                onClick={() => router.push('/admin/businesses')}
              >
                Voir les business disponibles
              </Button>
            </div>
          )}
        </TabsContent>

        {/* Tab: Notes & Suivi */}
        <TabsContent value="notes" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg text-[#0f4c81]">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Notes et commentaires
                </div>
              </CardTitle>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsNotesDialogOpen(true)}
              >
                <Edit className="h-4 w-4 mr-2" />
                {lead.notes ? 'Modifier' : 'Ajouter des notes'}
              </Button>
            </CardHeader>
            <CardContent>
              {lead.notes ? (
                <div className="bg-gray-50 p-4 rounded-md">
                  {lead.notes.split('\n').map((line, index) => (
                    <p key={index} className="mb-2">{line}</p>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500">Aucune note pour le moment</p>
                  <Button 
                    className="mt-4"
                    onClick={() => setIsNotesDialogOpen(true)}
                  >
                    Ajouter des notes
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-[#0f4c81]">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Progression du suivi
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative mt-4 mb-8">
                <div className="absolute top-0 left-0 w-full h-1 bg-gray-200">
                  <div 
                    className={`absolute top-0 left-0 h-full transition-all duration-500 ${
                      lead.status === 'new' ? 'w-0 bg-blue-500' :
                      lead.status === 'contacted' ? 'w-1/4 bg-yellow-500' :
                      lead.status === 'negotiating' ? 'w-2/4 bg-purple-500' :
                      lead.status === 'sold' ? 'w-full bg-green-500' :
                      lead.status === 'cancelled' ? 'w-0 bg-red-500' : ''
                    }`}
                  ></div>
                </div>
                
                <div className="flex justify-between mt-4">
                  <div className={`text-center ${lead.status === 'new' || lead.status === 'contacted' || lead.status === 'negotiating' || lead.status === 'sold' ? 'text-blue-600' : 'text-gray-400'}`}>
                    <div className={`w-6 h-6 rounded-full mx-auto mb-1 flex items-center justify-center ${lead.status === 'new' || lead.status === 'contacted' || lead.status === 'negotiating' || lead.status === 'sold' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                      <Info className="h-3 w-3" />
                    </div>
                    <span className="text-xs">Nouveau</span>
                  </div>
                  
                  <div className={`text-center ${lead.status === 'contacted' || lead.status === 'negotiating' || lead.status === 'sold' ? 'text-yellow-600' : 'text-gray-400'}`}>
                    <div className={`w-6 h-6 rounded-full mx-auto mb-1 flex items-center justify-center ${lead.status === 'contacted' || lead.status === 'negotiating' || lead.status === 'sold' ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-400'}`}>
                      <Mail className="h-3 w-3" />
                    </div>
                    <span className="text-xs">Contacté</span>
                  </div>
                  
                  <div className={`text-center ${lead.status === 'negotiating' || lead.status === 'sold' ? 'text-purple-600' : 'text-gray-400'}`}>
                    <div className={`w-6 h-6 rounded-full mx-auto mb-1 flex items-center justify-center ${lead.status === 'negotiating' || lead.status === 'sold' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-400'}`}>
                      <Activity className="h-3 w-3" />
                    </div>
                    <span className="text-xs">En négociation</span>
                  </div>
                  
                  <div className={`text-center ${lead.status === 'sold' ? 'text-green-600' : 'text-gray-400'}`}>
                    <div className={`w-6 h-6 rounded-full mx-auto mb-1 flex items-center justify-center ${lead.status === 'sold' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                      <CheckCircle className="h-3 w-3" />
                    </div>
                    <span className="text-xs">Vendu</span>
                  </div>
                </div>
              </div>
              
              {lead.status === 'cancelled' && (
                <div className="bg-red-50 p-3 rounded-md text-red-800 text-sm mb-4 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  Ce prospect a été annulé
                </div>
              )}
              
              <div className="space-y-3 mt-6">
                {lead.status === 'new' && (
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => updateLeadStatus('contacted')}
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Mail className="mr-2 h-4 w-4" />
                    )}
                    Marquer comme contacté
                  </Button>
                )}
                
                {lead.status === 'contacted' && (
                  <Button
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                    onClick={() => updateLeadStatus('negotiating')}
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Activity className="mr-2 h-4 w-4" />
                    )}
                    Passer en négociation
                  </Button>
                )}
                
                {lead.status === 'negotiating' && (
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => updateLeadStatus('sold')}
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle className="mr-2 h-4 w-4" />
                    )}
                    Marquer comme vendu
                  </Button>
                )}
                
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => setIsStatusDialogOpen(true)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Changer le statut manuellement
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-[#0f4c81]">
                <div className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" />
                  Questions et commentaires du prospect
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {lead.questions ? (
                <div className="bg-gray-50 p-4 rounded-md">
                  {lead.questions.split('\n').map((line, index) => (
                    <p key={index} className="mb-2">{line}</p>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 p-4 rounded-md text-gray-500 italic">
                  Aucune question ou commentaire spécifique.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialogue pour modifier les notes */}
      <Dialog open={isNotesDialogOpen} onOpenChange={setIsNotesDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Modifier les notes</DialogTitle>
            <DialogDescription>
              Ajoutez ou modifiez les notes concernant ce prospect.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ajoutez vos notes ici..."
                rows={6}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsNotesDialogOpen(false)}
              disabled={isUpdating}
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              onClick={updateLeadNotes}
              disabled={isUpdating}
              className="bg-[#0f4c81] hover:bg-[#0f4c81]/90"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Traitement...
                </>
              ) : 'Enregistrer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialogue pour changer le statut */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Mettre à jour le statut</DialogTitle>
            <DialogDescription>
              Changez le statut de ce prospect pour suivre sa progression.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select 
                value={newStatus} 
                onValueChange={(value) => setNewStatus(value as StatusType)}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">Nouveau</SelectItem>
                  <SelectItem value="contacted">Contacté</SelectItem>
                  <SelectItem value="negotiating">En négociation</SelectItem>
                  <SelectItem value="sold">Vendu</SelectItem>
                  <SelectItem value="cancelled">Annulé</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsStatusDialogOpen(false)}
              disabled={isUpdating}
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              onClick={() => updateLeadStatus(newStatus)}
              disabled={isUpdating}
              className="bg-[#0f4c81] hover:bg-[#0f4c81]/90"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Traitement...
                </>
              ) : 'Enregistrer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default withAdminAuth(LeadDetailPage);