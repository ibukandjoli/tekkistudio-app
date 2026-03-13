// app/admin/ecommerce-leads/[id]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/app/lib/supabase';
import { withAdminAuth } from '@/app/lib/withAdminAuth';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Globe, 
  CreditCard, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  Edit, 
  MessageSquare, 
  AlertCircle,
  ShoppingBag,
  Clock,
  Calendar,
  User,
  Activity,
  Info,
  FileText,
  ChevronRight,
  Smartphone,
  Laptop
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
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
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Textarea } from "@/app/components/ui/textarea";
import { toast } from 'sonner';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/app/components/ui/breadcrumb";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/components/ui/tooltip";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";

// Types
interface EcommerceLead {
  id: string;
  created_at: string;
  full_name: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  business_name: string;
  business_description: string;
  existing_website: string;
  lead_source: string;
  payment_status: string;
  amount_paid: number;
  total_amount: number;
  transaction_id: string;
  status: 'new' | 'contacted' | 'in_progress' | 'completed' | 'cancelled';
  platform: 'shopify' | 'wordpress';
  notes: string;
}

// Convertir d'anciens leads (rétrocompatibilité)
const adaptLegacyLead = (legacyLead: any): EcommerceLead => {
  return {
    ...legacyLead,
    platform: legacyLead.platform || 'shopify' // Valeur par défaut si la plateforme n'est pas spécifiée
  };
};

function EcommerceLeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const leadId = params.id as string;
  
  const [lead, setLead] = useState<EcommerceLead | null>(null);
  const [loading, setLoading] = useState(true);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isNotesDialogOpen, setIsNotesDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<EcommerceLead['status']>('new');
  const [notes, setNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchLeadDetails();
  }, [leadId]);

  const fetchLeadDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      // Essayer d'abord la nouvelle table
      let { data: leadData, error: leadError } = await supabase
        .from('ecommerce_leads')
        .select('*')
        .eq('id', leadId)
        .single();
      
      // Si pas trouvé, essayer l'ancienne table
      if (leadError) {
        const { data: legacyData, error: legacyError } = await supabase
          .from('ramadan_promo_leads')
          .select('*')
          .eq('id', leadId)
          .single();
          
        if (legacyError) {
          throw legacyError;
        }
        
        // Adapter les données de l'ancienne table
        leadData = adaptLegacyLead(legacyData);
      }

      if (leadData) {
        setLead(leadData);
        setNewStatus(leadData.status);
        setNotes(leadData.notes || '');
      }
    } catch (err: any) {
      console.error('Error fetching lead details:', err);
      setError(err.message || 'Une erreur est survenue lors du chargement des détails');
    } finally {
      setLoading(false);
    }
  };

  const updateLeadStatus = async (newStatusValue: EcommerceLead['status']) => {
    if (!lead) return;
    
    setIsUpdating(true);
    
    try {
      // Essayer d'abord de mettre à jour dans la nouvelle table
      const { error: updateError } = await supabase
        .from('ecommerce_leads')
        .update({ status: newStatusValue })
        .eq('id', leadId);
      
      if (updateError) {
        // Si erreur, essayer l'ancienne table
        const { error: legacyError } = await supabase
          .from('ramadan_promo_leads')
          .update({ status: newStatusValue })
          .eq('id', leadId);
        
        if (legacyError) throw legacyError;
      }
      
      // Enregistrer l'activité
      await supabase
        .from('activity_logs')
        .insert([
          {
            type: 'lead_status_update',
            description: `Statut du lead mis à jour pour ${lead.full_name}: ${lead.status} -> ${newStatusValue}`,
            metadata: { 
              leadId: lead.id,
              previousStatus: lead.status,
              newStatus: newStatusValue
            }
          }
        ]);
      
      // Mettre à jour l'état local
      setLead({
        ...lead,
        status: newStatusValue
      });
      
      // Fermer la modale et afficher un message de succès
      setIsStatusDialogOpen(false);
      toast.success('Statut mis à jour avec succès');
      
    } catch (err: any) {
      console.error('Erreur lors de la mise à jour du statut:', err);
      toast.error(`Erreur: ${err.message || 'Impossible de mettre à jour le statut'}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const updateLeadNotes = async () => {
    if (!lead) return;
    
    setIsUpdating(true);
    
    try {
      // Essayer d'abord la nouvelle table
      const { error: updateError } = await supabase
        .from('ecommerce_leads')
        .update({ notes: notes })
        .eq('id', leadId);
      
      if (updateError) {
        // Si erreur, essayer l'ancienne table
        const { error: legacyError } = await supabase
          .from('ramadan_promo_leads')
          .update({ notes: notes })
          .eq('id', leadId);
        
        if (legacyError) throw legacyError;
      }
      
      // Mettre à jour l'état local
      setLead({
        ...lead,
        notes: notes
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

  // Obtenir la classe CSS pour le badge de statut
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Obtenir l'icône pour le statut
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <Info className="h-4 w-4" />;
      case 'contacted': return <Mail className="h-4 w-4" />;
      case 'in_progress': return <Activity className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  // Obtenir la couleur correspondant à la plateforme 
  const getPlatformColor = (platform: string) => {
    return platform === 'shopify' ? 'text-green-600' : 'text-blue-600';
  };

  // Obtenir l'icône pour la plateforme
  const getPlatformIcon = (platform: string) => {
    return platform === 'shopify' ? 
      <Smartphone className="h-4 w-4" /> : 
      <Laptop className="h-4 w-4" />;
  };

  // Traduction des statuts en français
  const translateStatus = (status: string) => {
    switch (status) {
      case 'new': return 'Nouveau';
      case 'contacted': return 'Contacté';
      case 'in_progress': return 'En cours';
      case 'completed': return 'Terminé';
      case 'cancelled': return 'Annulé';
      default: return status;
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

  // Obtenir le statut suivant logique
  const getNextStatus = (currentStatus: string): EcommerceLead['status'] => {
    switch (currentStatus) {
      case 'new': return 'contacted';
      case 'contacted': return 'in_progress';
      case 'in_progress': return 'completed';
      default: return 'new';
    }
  };

  // Obtenir la description du statut suivant
  const getNextStatusDescription = (currentStatus: string): string => {
    switch (currentStatus) {
      case 'new': return 'Marquer comme contacté';
      case 'contacted': return 'Démarrer le projet';
      case 'in_progress': return 'Marquer comme terminé';
      default: return 'Changer le statut';
    }
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
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Loader2 className="h-12 w-12 animate-spin text-[#0f4c81] mb-4" />
        <p className="text-gray-600">Chargement des détails du prospect...</p>
      </div>
    );
  }

  if (error || !lead) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-1" />
          <div>
            <h3 className="font-medium text-red-800">Erreur</h3>
            <p className="text-red-700">{error || "Ce prospect n'existe pas ou a été supprimé"}</p>
          </div>
        </div>
        <Link 
          href="/admin/ecommerce-leads" 
          className="inline-flex items-center text-[#0f4c81] hover:text-[#ff7f50]"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour à la liste des prospects
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
              <BreadcrumbLink href="/admin/ecommerce-leads">Prospects E-commerce</BreadcrumbLink>
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
              <Badge className={`${lead.platform === 'shopify' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'} flex items-center gap-1`}>
                {getPlatformIcon(lead.platform)}
                {lead.platform === 'shopify' ? 'Shopify' : 'WordPress'}
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
            {lead.status !== 'completed' && lead.status !== 'cancelled' && (
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
          <TabsTrigger value="business" className="py-2">Détails business</TabsTrigger>
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
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Business</h3>
                      <p className="text-lg font-medium">{lead.business_name}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Plateforme choisie</h3>
                      <div className={`text-lg font-medium flex items-center gap-1 ${getPlatformColor(lead.platform)}`}>
                        {getPlatformIcon(lead.platform)}
                        {lead.platform === 'shopify' ? 'Shopify' : 'WordPress/WooCommerce'}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Paiement</h3>
                      <div className="flex items-center gap-1">
                        <span className={lead.payment_status?.includes('partial') ? 'text-yellow-600 font-medium' : 'text-green-600 font-medium'}>
                          {(lead.amount_paid || 0).toLocaleString()} FCFA
                        </span>
                        <span className="text-gray-400">/</span>
                        <span className="text-gray-600">
                          {(lead.total_amount || 0).toLocaleString()} FCFA
                        </span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Contact</h3>
                      <div className="flex flex-col">
                        <a href={`mailto:${lead.email}`} className="text-[#0f4c81] hover:underline flex items-center gap-1">
                          <Mail className="h-3 w-3" /> {lead.email}
                        </a>
                        <a href={`tel:${lead.phone}`} className="text-[#0f4c81] hover:underline flex items-center gap-1">
                          <Phone className="h-3 w-3" /> {lead.phone}
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
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Source</h3>
                      <p className="flex items-center gap-1">
                        {lead.lead_source || "Non spécifiée"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Description du business */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-[#0f4c81]">
                    Description du business
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 p-4 rounded-md">
                    {lead.business_description || "Aucune description fournie."}
                  </div>
                  
                  {lead.existing_website && (
                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Site web existant</h3>
                      <a 
                        href={lead.existing_website.startsWith('http') ? lead.existing_website : `https://${lead.existing_website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#0f4c81] hover:underline flex items-center gap-1"
                      >
                        <Globe className="h-4 w-4" />
                        {lead.existing_website}
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>
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
                    Modifier les notes
                  </Button>
                  
                  <div className="border-t my-2"></div>
                  
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
                  
                  {lead.status !== 'cancelled' && (
                    <Button 
                      variant="outline" 
                      className="w-full text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => updateLeadStatus('cancelled')}
                      disabled={isUpdating}
                    >
                      {isUpdating ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <XCircle className="h-4 w-4 mr-2" />
                      )}
                      Annuler le prospect
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Progression du paiement */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-[#0f4c81]">
                    Progression du paiement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progression</span>
                      <span className="font-medium">
                        {lead.total_amount > 0 
                          ? Math.round(((lead.amount_paid || 0) / (lead.total_amount || 1)) * 100)
                          : 0}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-[#0f4c81] h-2.5 rounded-full" 
                        style={{ 
                          width: lead.total_amount 
                            ? `${Math.min(100, Math.round(((lead.amount_paid || 0) / lead.total_amount) * 100))}%` 
                            : '0%'
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Montant payé</span>
                      <span className="font-medium">{(lead.amount_paid || 0).toLocaleString()} FCFA</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Montant total</span>
                      <span className="font-medium">{(lead.total_amount || 0).toLocaleString()} FCFA</span>
                    </div>
                    {lead.total_amount > lead.amount_paid && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Reste à payer</span>
                        <span className="font-medium">
                          {((lead.total_amount || 0) - (lead.amount_paid || 0)).toLocaleString()} FCFA
                        </span>
                      </div>
                    )}
                    {lead.transaction_id && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">ID Transaction</span>
                        <span className="font-mono text-xs">{lead.transaction_id}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Détails de la plateforme */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-[#0f4c81]">
                    Détails de la plateforme
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`p-4 rounded-lg ${
                    lead.platform === 'shopify' 
                      ? 'bg-green-50 border border-green-100' 
                      : 'bg-blue-50 border border-blue-100'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      {getPlatformIcon(lead.platform)}
                      <h3 className={`font-medium ${getPlatformColor(lead.platform)}`}>
                        {lead.platform === 'shopify' ? 'Shopify' : 'WordPress/WooCommerce'}
                      </h3>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">
                      {lead.platform === 'shopify' 
                        ? 'Solution tout-en-un avec interface facile à utiliser. Idéal pour les débutants avec un excellent support.'
                        : 'Solution plus personnalisable et économique, mais nécessitant plus de maintenance technique.'}
                    </p>
                    
                    <div className="text-sm">
                      <div className="flex items-center gap-1 mb-1">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        <span>{lead.platform === 'shopify' 
                          ? 'Gestion facile depuis smartphone'
                          : 'Personnalisation illimitée'}</span>
                      </div>
                      <div className="flex items-center gap-1 mb-1">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        <span>{lead.platform === 'shopify' 
                          ? 'Support technique 24/7'
                          : 'Pas d\'abonnement mensuel'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        <span>{lead.platform === 'shopify' 
                          ? 'Stabilité et sécurité'
                          : 'Contrôle total sur le site'}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Tab: Détails business */}
        <TabsContent value="business" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Informations de base */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg text-[#0f4c81]">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Informations du business
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Nom du business</h3>
                    <p className="font-medium text-lg">{lead.business_name}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Site web existant</h3>
                    {lead.existing_website ? (
                      <a 
                        href={lead.existing_website.startsWith('http') ? lead.existing_website : `https://${lead.existing_website}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[#0f4c81] hover:underline font-medium flex items-center gap-1"
                      >
                        <Globe className="h-4 w-4" />
                        {lead.existing_website}
                      </a>
                    ) : (
                      <p className="text-gray-600">Non</p>
                    )}
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Source de provenance</h3>
                    <p className="font-medium">{lead.lead_source || "Non spécifiée"}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Date d'inscription</h3>
                    <p className="font-medium">{formatDate(lead.created_at)}</p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Description du business</h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    {lead.business_description || "Aucune description fournie."}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Statut et progression */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-[#0f4c81]">
                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Statut du projet
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative mt-6 mb-8">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gray-200">
                    <div 
                      className={`absolute top-0 left-0 h-full transition-all duration-500 ${
                        lead.status === 'new' ? 'w-0 bg-blue-500' :
                        lead.status === 'contacted' ? 'w-1/4 bg-yellow-500' :
                        lead.status === 'in_progress' ? 'w-2/4 bg-purple-500' :
                        lead.status === 'completed' ? 'w-full bg-green-500' :
                        lead.status === 'cancelled' ? 'w-0 bg-red-500' : ''
                      }`}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between mt-4">
                    <div className={`text-center ${lead.status === 'new' || lead.status === 'contacted' || lead.status === 'in_progress' || lead.status === 'completed' ? 'text-blue-600' : 'text-gray-400'}`}>
                      <div className={`w-6 h-6 rounded-full mx-auto mb-1 flex items-center justify-center ${lead.status === 'new' || lead.status === 'contacted' || lead.status === 'in_progress' || lead.status === 'completed' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                        <Info className="h-3 w-3" />
                      </div>
                      <span className="text-xs">Nouveau</span>
                    </div>
                    
                    <div className={`text-center ${lead.status === 'contacted' || lead.status === 'in_progress' || lead.status === 'completed' ? 'text-yellow-600' : 'text-gray-400'}`}>
                      <div className={`w-6 h-6 rounded-full mx-auto mb-1 flex items-center justify-center ${lead.status === 'contacted' || lead.status === 'in_progress' || lead.status === 'completed' ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-400'}`}>
                        <Mail className="h-3 w-3" />
                      </div>
                      <span className="text-xs">Contacté</span>
                    </div>
                    
                    <div className={`text-center ${lead.status === 'in_progress' || lead.status === 'completed' ? 'text-purple-600' : 'text-gray-400'}`}>
                      <div className={`w-6 h-6 rounded-full mx-auto mb-1 flex items-center justify-center ${lead.status === 'in_progress' || lead.status === 'completed' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-400'}`}>
                        <Activity className="h-3 w-3" />
                      </div>
                      <span className="text-xs">En cours</span>
                    </div>
                    
                    <div className={`text-center ${lead.status === 'completed' ? 'text-green-600' : 'text-gray-400'}`}>
                      <div className={`w-6 h-6 rounded-full mx-auto mb-1 flex items-center justify-center ${lead.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                        <CheckCircle className="h-3 w-3" />
                      </div>
                      <span className="text-xs">Terminé</span>
                    </div>
                  </div>
                </div>
                
                {lead.status === 'cancelled' && (
                  <div className="bg-red-50 p-3 rounded-md text-red-800 text-sm mb-4 flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-600" />
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
                      onClick={() => updateLeadStatus('in_progress')}
                      disabled={isUpdating}
                    >
                      {isUpdating ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Activity className="mr-2 h-4 w-4" />
                      )}
                      Démarrer le projet
                    </Button>
                  )}
                  
                  {lead.status === 'in_progress' && (
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => updateLeadStatus('completed')}
                      disabled={isUpdating}
                    >
                      {isUpdating ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle className="mr-2 h-4 w-4" />
                      )}
                      Marquer comme terminé
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
          </div>
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
                Ajouter / Modifier
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
                  Liste de vérification
                </div>
              </CardTitle>
              <CardDescription>
                Utilisez cette liste pour suivre vos interactions avec le prospect
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    id="check1" 
                    className="h-5 w-5 rounded border-gray-300 text-[#0f4c81] focus:ring-[#0f4c81]" 
                    checked={lead.status !== 'new'}
                    readOnly
                  />
                  <label htmlFor="check1" className={lead.status !== 'new' ? 'line-through text-gray-500' : ''}>
                    Premier contact établi
                  </label>
                </div>
                
                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    id="check2" 
                    className="h-5 w-5 rounded border-gray-300 text-[#0f4c81] focus:ring-[#0f4c81]" 
                    checked={lead.status === 'in_progress' || lead.status === 'completed'}
                    readOnly
                  />
                  <label htmlFor="check2" className={lead.status === 'in_progress' || lead.status === 'completed' ? 'line-through text-gray-500' : ''}>
                    Projet démarré
                  </label>
                </div>
                
                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    id="check3" 
                    className="h-5 w-5 rounded border-gray-300 text-[#0f4c81] focus:ring-[#0f4c81]" 
                    checked={lead.status === 'completed'}
                    readOnly
                  />
                  <label htmlFor="check3" className={lead.status === 'completed' ? 'line-through text-gray-500' : ''}>
                    Projet terminé
                  </label>
                </div>
                
                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    id="check4" 
                    className="h-5 w-5 rounded border-gray-300 text-[#0f4c81] focus:ring-[#0f4c81]" 
                    checked={!!lead.notes}
                    readOnly
                  />
                  <label htmlFor="check4" className={!!lead.notes ? 'line-through text-gray-500' : ''}>
                    Notes ajoutées
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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
                onValueChange={(value) => setNewStatus(value as EcommerceLead['status'])}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">Nouveau</SelectItem>
                  <SelectItem value="contacted">Contacté</SelectItem>
                  <SelectItem value="in_progress">En cours</SelectItem>
                  <SelectItem value="completed">Terminé</SelectItem>
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
    </div>
  );
}

export default withAdminAuth(EcommerceLeadDetailPage);