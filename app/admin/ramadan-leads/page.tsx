// app/admin/ramadan-leads/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/app/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/app/components/ui/card";
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Filter, 
  Search, 
  RefreshCcw,
  Download,
  PhoneCall,
  Mail,
  Calendar
} from 'lucide-react';
import { supabase } from '@/app/lib/supabase';
import { Button } from '@/app/components/ui/button';
import { toast } from 'sonner';

// Types
interface RamadanLead {
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
  notes: string;
}

interface FallbackLead {
  id: string;
  created_at: string;
  formation_id: string;
  full_name: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  payment_status: string;
  amount_paid: number;
  metadata: {
    businessName: string;
    businessDescription: string;
    existingWebsite: string;
    howDidYouHear: string;
    promoType: string;
    transactionId: string;
  };
}

// Convertir un lead du fallback en format standard
const convertFallbackLead = (fallbackLead: FallbackLead): RamadanLead => {
  return {
    id: fallbackLead.id,
    created_at: fallbackLead.created_at,
    full_name: fallbackLead.full_name,
    email: fallbackLead.email,
    phone: fallbackLead.phone,
    country: fallbackLead.country,
    city: fallbackLead.city,
    business_name: fallbackLead.metadata?.businessName || '',
    business_description: fallbackLead.metadata?.businessDescription || '',
    existing_website: fallbackLead.metadata?.existingWebsite || '',
    lead_source: fallbackLead.metadata?.howDidYouHear || '',
    payment_status: fallbackLead.payment_status,
    amount_paid: fallbackLead.amount_paid,
    total_amount: fallbackLead.amount_paid * 2, // Estimation basée sur 50%
    transaction_id: fallbackLead.metadata?.transactionId || '',
    status: 'new',
    notes: ''
  };
};

export default function RamadanLeadsPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<RamadanLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Charger les leads
  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // D'abord essayer de lire depuis la table ramadan_promo_leads
      let { data: ramadanLeads, error: ramadanError } = await supabase
        .from('ramadan_promo_leads')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Si la table n'existe pas encore, utiliser formation_enrollments comme fallback
      if (ramadanError && ramadanError.code === '42P01') { // Code pour "relation does not exist"
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('formation_enrollments')
          .select('*')
          .eq('formation_id', 'promo-ramadan-2024')
          .order('created_at', { ascending: false });
          
        if (fallbackError) {
          throw fallbackError;
        }
        
        // Convertir les données du fallback au format attendu
        const convertedLeads = (fallbackData || []).map(convertFallbackLead);
        setLeads(convertedLeads);
      } else if (ramadanError) {
        throw ramadanError;
      } else {
        setLeads(ramadanLeads || []);
      }
    } catch (error: any) {
      console.error('Error fetching leads:', error);
      setError(error.message || 'Une erreur est survenue lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour mettre à jour le statut d'un lead
  const updateLeadStatus = async (leadId: string, newStatus: RamadanLead['status']) => {
    try {
      // D'abord essayer de mettre à jour dans la table principale
      const { error: updateError } = await supabase
        .from('ramadan_promo_leads')
        .update({ status: newStatus })
        .eq('id', leadId);
      
      if (updateError) {
        if (updateError.code === '42P01') { // Si la table n'existe pas
          // Mettre à jour les métadonnées dans la table fallback
          const { error: fallbackError } = await supabase
            .from('formation_enrollments')
            .update({
                metadata: {
                    status: newStatus
                  }
            })
            .eq('id', leadId);
          
          if (fallbackError) throw fallbackError;
        } else {
          throw updateError;
        }
      }
      
      // Mettre à jour l'interface utilisateur
      setLeads(leads.map(lead => 
        lead.id === leadId ? { ...lead, status: newStatus } : lead
      ));
      
      toast.success(`Statut mis à jour avec succès: ${newStatus}`);
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      toast.error(`Erreur: ${error.message || 'Impossible de mettre à jour le statut'}`);
    }
  };

  // Fonction pour naviguer vers la page de détail d'un lead
  const navigateToLeadDetail = (leadId: string) => {
    router.push(`/admin/ramadan-leads/${leadId}`);
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

  // Fonction pour exporter les leads en CSV
  const exportToCSV = () => {
    // Créer les en-têtes du CSV
    const headers = [
      'ID', 'Date', 'Nom', 'Email', 'Téléphone', 'Pays', 'Ville', 
      'Nom Business', 'Description', 'Site Web', 'Source', 
      'Statut Paiement', 'Montant Payé', 'Montant Total', 'Transaction ID', 'Statut', 'Notes'
    ];
    
    // Convertir les leads en lignes CSV
    const csvRows = leads.map(lead => [
      lead.id,
      formatDate(lead.created_at),
      lead.full_name,
      lead.email,
      lead.phone,
      lead.country,
      lead.city,
      lead.business_name,
      `"${lead.business_description.replace(/"/g, '""')}"`, // Échapper les guillemets
      lead.existing_website,
      lead.lead_source,
      lead.payment_status,
      lead.amount_paid,
      lead.total_amount,
      lead.transaction_id,
      lead.status,
      `"${(lead.notes || '').replace(/"/g, '""')}"`
    ]);
    
    // Assembler le contenu CSV
    const csvContent = [
      headers.join(','),
      ...csvRows.map(row => row.join(','))
    ].join('\n');
    
    // Créer et télécharger le fichier
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `ramadan-leads-${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtrer les leads en fonction de la recherche et du filtre de statut
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.business_name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Déterminer la couleur du badge en fonction du statut
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

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-[#0f4c81]">Prospects Sites E-commerce</h2>
        <p className="text-gray-500">Gestion des prospects pour Sites E-commerce clé en main</p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Prospects</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{leads.length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Nouveaux</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">
              {leads.filter(lead => lead.status === 'new').length}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">En cours</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-purple-600">
              {leads.filter(lead => lead.status === 'in_progress').length}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Terminés</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">
              {leads.filter(lead => lead.status === 'completed').length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Contrôles (recherche, filtres, export) */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between pb-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 w-full border rounded-lg"
            />
          </div>
          
          <div className="flex items-center">
            <Filter className="h-4 w-4 mr-2 text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border rounded-lg px-3 py-2"
            >
              <option value="all">Tous les statuts</option>
              <option value="new">Nouveaux</option>
              <option value="contacted">Contactés</option>
              <option value="in_progress">En cours</option>
              <option value="completed">Terminés</option>
              <option value="cancelled">Annulés</option>
            </select>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={fetchLeads} 
            className="flex items-center"
          >
            <RefreshCcw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
          
          <Button 
            onClick={exportToCSV} 
            className="flex items-center bg-green-600 hover:bg-green-700"
          >
            <Download className="h-4 w-4 mr-2" />
            Exporter CSV
          </Button>
        </div>
      </div>

      {/* Tableau des leads */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0f4c81]"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">
              <AlertCircle className="h-10 w-10 mx-auto mb-2" />
              <p>{error}</p>
              <Button onClick={fetchLeads} className="mt-4">
                Réessayer
              </Button>
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>Aucun prospect trouvé.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead>Business</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Paiement</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeads.map((lead) => (
                    <TableRow 
                      key={lead.id}
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => navigateToLeadDetail(lead.id)}
                    >
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                          <span>{formatDate(lead.created_at)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{lead.full_name}</TableCell>
                      <TableCell>{lead.business_name}</TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <div className="flex flex-col space-y-1">
                          <a href={`mailto:${lead.email}`} className="flex items-center text-blue-600 hover:underline">
                            <Mail className="h-3 w-3 mr-1" />
                            {lead.email}
                          </a>
                          <a href={`tel:${lead.phone}`} className="flex items-center text-blue-600 hover:underline">
                            <PhoneCall className="h-3 w-3 mr-1" />
                            {lead.phone}
                          </a>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span className={lead.payment_status.includes('partial') ? 'text-yellow-600' : 'text-green-600'}>
                            {lead.amount_paid.toLocaleString()} FCFA
                          </span>
                          <span className="text-gray-400 mx-1">/</span>
                          <span className="text-gray-600">{lead.total_amount.toLocaleString()} FCFA</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(lead.status)}`}>
                          {translateStatus(lead.status)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-end space-x-2">
                          {lead.status === 'new' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                updateLeadStatus(lead.id, 'contacted');
                              }}
                              className="text-blue-600 border-blue-200 hover:bg-blue-50"
                            >
                              Marquer contacté
                            </Button>
                          )}
                          {lead.status === 'contacted' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                updateLeadStatus(lead.id, 'in_progress');
                              }}
                              className="text-purple-600 border-purple-200 hover:bg-purple-50"
                            >
                              En cours
                            </Button>
                          )}
                          {lead.status === 'in_progress' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                updateLeadStatus(lead.id, 'completed');
                              }}
                              className="text-green-600 border-green-200 hover:bg-green-50"
                            >
                              Terminer
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigateToLeadDetail(lead.id);
                            }}
                          >
                            Détails
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}