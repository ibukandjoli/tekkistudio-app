// app/admin/formula-leads/[id]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Globe,
  CheckCircle,
  XCircle,
  Loader2,
  Edit,
  MessageSquare,
  AlertCircle,
  Clock,
  Calendar,
  DollarSign,
  Target,
  Info,
  FileText,
  TrendingUp,
  Building,
  Activity,
  ExternalLink,
} from 'lucide-react';
import { supabase } from '@/app/lib/supabase';
import { formatRelativeDate } from '@/app/lib/utils/date-utils';
import { toast } from 'sonner';
import { withAdminAuth } from '@/app/lib/withAdminAuth';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import { Label } from '@/app/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { Textarea } from '@/app/components/ui/textarea';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/app/components/ui/breadcrumb';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/app/components/ui/tabs';

interface FormulaLead {
  id: string;
  created_at: string;
  full_name: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  brand_name: string;
  brand_description: string;
  existing_website: string | null;
  monthly_revenue: string;
  formula_type: 'audit-depart' | 'demarrage' | 'croissance' | 'expansion';
  budget_range: string;
  desired_timeline: string;
  specific_needs: string | null;
  status: 'new' | 'contacted' | 'quote_sent' | 'negotiating' | 'won' | 'lost';
  notes: string | null;
  lead_source: string;
}

const FormulaLeadDetailPage = () => {
  const params = useParams();
  const leadId = params.id as string;

  const [lead, setLead] = useState<FormulaLead | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isNotesDialogOpen, setIsNotesDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<FormulaLead['status']>('new');
  const [notes, setNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchLeadDetails();
  }, [leadId]);

  const fetchLeadDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('formula_leads')
        .select('*')
        .eq('id', leadId)
        .single();

      if (fetchError) throw fetchError;

      if (data) {
        setLead(data);
        setNewStatus(data.status);
        setNotes(data.notes || '');
      }
    } catch (err: any) {
      console.error('Erreur lors du chargement:', err);
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const updateLeadStatus = async (newStatusValue: FormulaLead['status']) => {
    if (!lead) return;

    setIsUpdating(true);

    try {
      const { error: updateError } = await supabase
        .from('formula_leads')
        .update({ status: newStatusValue })
        .eq('id', leadId);

      if (updateError) throw updateError;

      setLead({ ...lead, status: newStatusValue });
      setIsStatusDialogOpen(false);
      toast.success('Statut mis à jour avec succès');
    } catch (err: any) {
      console.error('Erreur:', err);
      toast.error('Impossible de mettre à jour le statut');
    } finally {
      setIsUpdating(false);
    }
  };

  const updateLeadNotes = async () => {
    if (!lead) return;

    setIsUpdating(true);

    try {
      const { error: updateError } = await supabase
        .from('formula_leads')
        .update({ notes: notes })
        .eq('id', leadId);

      if (updateError) throw updateError;

      setLead({ ...lead, notes: notes });
      setIsNotesDialogOpen(false);
      toast.success('Notes mises à jour avec succès');
    } catch (err: any) {
      console.error('Erreur:', err);
      toast.error('Impossible de mettre à jour les notes');
    } finally {
      setIsUpdating(false);
    }
  };

  const getFormulaLabel = (type: string) => {
    const labels: Record<string, string> = {
      'audit-depart': 'Audit de Départ',
      'demarrage': 'Démarrage',
      'croissance': 'Croissance',
      'expansion': 'Expansion',
    };
    return labels[type] || type;
  };

  const getFormulaColor = (type: string) => {
    const colors: Record<string, string> = {
      'audit-depart': 'bg-emerald-100 text-emerald-700 border-emerald-300',
      'demarrage': 'bg-blue-100 text-blue-700 border-blue-300',
      'croissance': 'bg-orange-100 text-orange-700 border-orange-300',
      'expansion': 'bg-purple-100 text-purple-700 border-purple-300',
    };
    return colors[type] || 'bg-gray-100 text-gray-700 border-gray-300';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'new': 'Nouveau',
      'contacted': 'Contacté',
      'quote_sent': 'Devis envoyé',
      'negotiating': 'Négociation',
      'won': 'Gagné',
      'lost': 'Perdu',
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'new': 'bg-blue-100 text-blue-700 border-blue-300',
      'contacted': 'bg-yellow-100 text-yellow-700 border-yellow-300',
      'quote_sent': 'bg-purple-100 text-purple-700 border-purple-300',
      'negotiating': 'bg-orange-100 text-orange-700 border-orange-300',
      'won': 'bg-green-100 text-green-700 border-green-300',
      'lost': 'bg-red-100 text-red-700 border-red-300',
    };
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-300';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <Info className="h-4 w-4" />;
      case 'contacted': return <Mail className="h-4 w-4" />;
      case 'quote_sent': return <FileText className="h-4 w-4" />;
      case 'negotiating': return <TrendingUp className="h-4 w-4" />;
      case 'won': return <CheckCircle className="h-4 w-4" />;
      case 'lost': return <XCircle className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const getNextStatus = (currentStatus: string): FormulaLead['status'] => {
    switch (currentStatus) {
      case 'new': return 'contacted';
      case 'contacted': return 'quote_sent';
      case 'quote_sent': return 'negotiating';
      case 'negotiating': return 'won';
      default: return 'new';
    }
  };

  const getNextStatusDescription = (currentStatus: string): string => {
    switch (currentStatus) {
      case 'new': return 'Marquer comme contacté';
      case 'contacted': return 'Marquer devis envoyé';
      case 'quote_sent': return 'Passer en négociation';
      case 'negotiating': return 'Marquer comme gagné';
      default: return 'Changer le statut';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-[#0f4c81] mb-4" />
        <p className="text-gray-600">Chargement des détails...</p>
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
            <p className="text-red-700">{error || "Ce prospect n'existe pas"}</p>
          </div>
        </div>
        <Link href="/admin/formula-leads" className="inline-flex items-center text-[#0f4c81] hover:text-[#ff7f50]">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour à la liste
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/formula-leads">Prospects Formules</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>{lead.full_name}</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6"
      >
        <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-[#0f4c81]">{lead.full_name}</h1>
              <Badge className={`flex items-center gap-1 border ${getStatusColor(lead.status)}`}>
                {getStatusIcon(lead.status)}
                {getStatusLabel(lead.status)}
              </Badge>
              <Badge className={`flex items-center gap-1 border ${getFormulaColor(lead.formula_type)}`}>
                {getFormulaLabel(lead.formula_type)}
              </Badge>
            </div>
            <p className="text-gray-500 mt-1 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Prospect depuis {formatRelativeDate(lead.created_at)}
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {lead.status !== 'won' && lead.status !== 'lost' && (
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
            <Link href={`mailto:${lead.email}`}>
              <Button className="bg-[#ff7f50] text-white hover:bg-[#ff7f50]/90">
                <Mail className="h-4 w-4 mr-2" />
                Email
              </Button>
            </Link>
            <Link href={`https://wa.me/${lead.phone.replace(/\s+/g, '')}`} target="_blank">
              <Button className="bg-green-500 text-white hover:bg-green-600">
                <Phone className="h-4 w-4 mr-2" />
                WhatsApp
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full md:w-auto grid-cols-3 h-auto">
          <TabsTrigger value="overview" className="py-2">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="project" className="py-2">Détails du projet</TabsTrigger>
          <TabsTrigger value="notes" className="py-2">Notes & Suivi</TabsTrigger>
        </TabsList>

        {/* Tab: Vue d'ensemble */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Colonne principale */}
            <div className="lg:col-span-2 space-y-6">
              {/* Informations du prospect */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-[#0f4c81] flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Informations du prospect
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Nom complet</h3>
                      <p className="text-lg font-medium">{lead.full_name}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Email</h3>
                      <a href={`mailto:${lead.email}`} className="text-[#0f4c81] hover:underline flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {lead.email}
                      </a>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Téléphone</h3>
                      <a href={`tel:${lead.phone}`} className="text-[#0f4c81] hover:underline flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {lead.phone}
                      </a>
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

              {/* Informations de la marque */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-[#0f4c81] flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Informations de la marque
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Nom de la marque</h3>
                    <p className="text-lg font-medium">{lead.brand_name}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
                    <div className="bg-gray-50 p-4 rounded-md">
                      {lead.brand_description}
                    </div>
                  </div>
                  {lead.existing_website && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Site web existant</h3>
                      <a
                        href={lead.existing_website.startsWith('http') ? lead.existing_website : `https://${lead.existing_website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#0f4c81] hover:underline flex items-center gap-1"
                      >
                        <Globe className="h-4 w-4" />
                        {lead.existing_website}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Chiffre d'affaires mensuel</h3>
                    <p className="font-medium">{lead.monthly_revenue}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Colonne latérale */}
            <div className="space-y-6">
              {/* Actions rapides */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-[#0f4c81]">Actions rapides</CardTitle>
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
                  {lead.status !== 'lost' && (
                    <Button
                      variant="outline"
                      className="w-full text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => updateLeadStatus('lost')}
                      disabled={isUpdating}
                    >
                      {isUpdating ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <XCircle className="h-4 w-4 mr-2" />
                      )}
                      Marquer comme perdu
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Formule sélectionnée */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-[#0f4c81]">Formule sélectionnée</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`p-4 rounded-lg border ${getFormulaColor(lead.formula_type)}`}>
                    <h3 className="font-bold text-lg mb-2">{getFormulaLabel(lead.formula_type)}</h3>
                    <p className="text-sm">
                      {lead.formula_type === 'audit-depart' && 'Audit complet pour identifier les opportunités de croissance.'}
                      {lead.formula_type === 'demarrage' && 'Création complète de votre présence e-commerce.'}
                      {lead.formula_type === 'croissance' && 'Stratégies avancées pour multiplier vos ventes.'}
                      {lead.formula_type === 'expansion' && 'Conquête de nouveaux marchés et scaling international.'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Tab: Détails du projet */}
        <TabsContent value="project" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Budget */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-[#0f4c81] flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Budget
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-gray-900">{lead.budget_range}</p>
              </CardContent>
            </Card>

            {/* Délai souhaité */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-[#0f4c81] flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Délai souhaité
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-gray-900">{lead.desired_timeline}</p>
              </CardContent>
            </Card>

            {/* Source */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-[#0f4c81] flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Source
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-medium">{lead.lead_source || 'Non spécifiée'}</p>
              </CardContent>
            </Card>

            {/* Besoins spécifiques */}
            {lead.specific_needs && (
              <Card className="md:col-span-2 lg:col-span-3">
                <CardHeader>
                  <CardTitle className="text-lg text-[#0f4c81]">Besoins spécifiques</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 p-4 rounded-md">
                    {lead.specific_needs}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Progression du statut */}
            <Card className="md:col-span-2 lg:col-span-3">
              <CardHeader>
                <CardTitle className="text-lg text-[#0f4c81] flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Progression du projet
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative mt-6 mb-8">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gray-200">
                    <div
                      className={`absolute top-0 left-0 h-full transition-all duration-500 ${
                        lead.status === 'new' ? 'w-0 bg-blue-500' :
                        lead.status === 'contacted' ? 'w-1/5 bg-yellow-500' :
                        lead.status === 'quote_sent' ? 'w-2/5 bg-purple-500' :
                        lead.status === 'negotiating' ? 'w-3/5 bg-orange-500' :
                        lead.status === 'won' ? 'w-full bg-green-500' :
                        'w-0 bg-red-500'
                      }`}
                    ></div>
                  </div>

                  <div className="flex justify-between mt-4">
                    <div className={`text-center ${['new', 'contacted', 'quote_sent', 'negotiating', 'won'].includes(lead.status) ? 'text-blue-600' : 'text-gray-400'}`}>
                      <div className={`w-6 h-6 rounded-full mx-auto mb-1 flex items-center justify-center ${['new', 'contacted', 'quote_sent', 'negotiating', 'won'].includes(lead.status) ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                        <Info className="h-3 w-3" />
                      </div>
                      <span className="text-xs">Nouveau</span>
                    </div>

                    <div className={`text-center ${['contacted', 'quote_sent', 'negotiating', 'won'].includes(lead.status) ? 'text-yellow-600' : 'text-gray-400'}`}>
                      <div className={`w-6 h-6 rounded-full mx-auto mb-1 flex items-center justify-center ${['contacted', 'quote_sent', 'negotiating', 'won'].includes(lead.status) ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-400'}`}>
                        <Mail className="h-3 w-3" />
                      </div>
                      <span className="text-xs">Contacté</span>
                    </div>

                    <div className={`text-center ${['quote_sent', 'negotiating', 'won'].includes(lead.status) ? 'text-purple-600' : 'text-gray-400'}`}>
                      <div className={`w-6 h-6 rounded-full mx-auto mb-1 flex items-center justify-center ${['quote_sent', 'negotiating', 'won'].includes(lead.status) ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-400'}`}>
                        <FileText className="h-3 w-3" />
                      </div>
                      <span className="text-xs">Devis</span>
                    </div>

                    <div className={`text-center ${['negotiating', 'won'].includes(lead.status) ? 'text-orange-600' : 'text-gray-400'}`}>
                      <div className={`w-6 h-6 rounded-full mx-auto mb-1 flex items-center justify-center ${['negotiating', 'won'].includes(lead.status) ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-400'}`}>
                        <TrendingUp className="h-3 w-3" />
                      </div>
                      <span className="text-xs">Négociation</span>
                    </div>

                    <div className={`text-center ${lead.status === 'won' ? 'text-green-600' : 'text-gray-400'}`}>
                      <div className={`w-6 h-6 rounded-full mx-auto mb-1 flex items-center justify-center ${lead.status === 'won' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                        <CheckCircle className="h-3 w-3" />
                      </div>
                      <span className="text-xs">Gagné</span>
                    </div>
                  </div>
                </div>

                {lead.status === 'lost' && (
                  <div className="bg-red-50 p-3 rounded-md text-red-800 text-sm flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-600" />
                    Ce prospect a été marqué comme perdu
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab: Notes & Suivi */}
        <TabsContent value="notes" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg text-[#0f4c81] flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Notes et commentaires
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsNotesDialogOpen(true)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </Button>
            </CardHeader>
            <CardContent>
              {lead.notes ? (
                <div className="bg-gray-50 p-4 rounded-md whitespace-pre-wrap">
                  {lead.notes}
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
        </TabsContent>
      </Tabs>

      {/* Dialog: Changer le statut */}
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
                onValueChange={(value) => setNewStatus(value as FormulaLead['status'])}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">Nouveau</SelectItem>
                  <SelectItem value="contacted">Contacté</SelectItem>
                  <SelectItem value="quote_sent">Devis envoyé</SelectItem>
                  <SelectItem value="negotiating">Négociation</SelectItem>
                  <SelectItem value="won">Gagné</SelectItem>
                  <SelectItem value="lost">Perdu</SelectItem>
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

      {/* Dialog: Modifier les notes */}
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
};

export default withAdminAuth(FormulaLeadDetailPage);
