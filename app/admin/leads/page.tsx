// app/admin/leads/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabase';
import { withAdminAuth } from '@/app/lib/withAdminAuth';
import { formatRelativeDate } from '@/app/lib/utils/date-utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
import {
  Search,
  Filter,
  RefreshCw,
  Download,
  Mail,
  Phone,
  Calendar,
  User,
  Loader2,
  ArrowUpDown,
  AlertCircle,
  Plus,
  CheckCircle,
  X
} from 'lucide-react';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/app/components/ui/tooltip';
import { Badge } from '@/app/components/ui/badge';

// Types
interface BusinessInterest {
  id: string;
  business_id: string | null;
  full_name: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  status: 'new' | 'contacted' | 'negotiating' | 'sold' | 'cancelled';
  created_at: string;
  updated_at: string;
  is_whatsapp: boolean;
  payment_option: string;
  investment_readiness: string;
  business_name?: string;
}

interface Business {
  id: string;
  name: string;
}

type StatusType = 'new' | 'contacted' | 'negotiating' | 'sold' | 'cancelled';
type SortField = 'created_at' | 'full_name' | 'country' | 'status' | 'updated_at';
type SortDirection = 'asc' | 'desc';

const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig: Record<StatusType, { label: string, className: string, icon: React.ReactNode }> = {
    new: { 
      label: 'Nouveau', 
      className: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
      icon: <Plus className="h-3 w-3 mr-1" />
    },
    contacted: { 
      label: 'Contacté', 
      className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
      icon: <Mail className="h-3 w-3 mr-1" />
    },
    negotiating: { 
      label: 'En négociation', 
      className: 'bg-purple-100 text-purple-800 hover:bg-purple-200',
      icon: <Phone className="h-3 w-3 mr-1" />
    },
    sold: { 
      label: 'Vendu', 
      className: 'bg-green-100 text-green-800 hover:bg-green-200',
      icon: <CheckCircle className="h-3 w-3 mr-1" />
    },
    cancelled: { 
      label: 'Annulé', 
      className: 'bg-red-100 text-red-800 hover:bg-red-200',
      icon: <X className="h-3 w-3 mr-1" />
    }
  };

  const config = statusConfig[status as StatusType] || {
    label: status,
    className: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
    icon: null
  };

  return (
    <Badge variant="outline" className={config.className}>
      {config.icon}
      {config.label}
    </Badge>
  );
};

function LeadsPage() {
  const router = useRouter();
  // États
  const [leads, setLeads] = useState<BusinessInterest[]>([]);
  const [businesses, setBusinesses] = useState<Record<string, string>>({});
  const [filteredLeads, setFilteredLeads] = useState<BusinessInterest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  
  // Filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [businessFilter, setBusinessFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all');
  
  // Tri
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  
  // Statistiques
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    contacted: 0,
    negotiating: 0,
    sold: 0,
    cancelled: 0,
    todayNew: 0,
    weekNew: 0
  });

  // Récupérer les données
  useEffect(() => {
    fetchLeads();
  }, []);

  // Filtrer les données
  useEffect(() => {
    if (leads.length > 0) {
      applyFilters();
    }
  }, [leads, searchTerm, statusFilter, businessFilter, timeFilter, sortField, sortDirection]);

  // Calculer les statistiques
  useEffect(() => {
    if (leads.length > 0) {
      calculateStats();
    }
  }, [leads]);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      setError(null);
      setRefreshing(true);

      // Récupérer tous les leads
      const { data: leadsData, error: leadsError } = await supabase
        .from('business_interests')
        .select('*')
        .order('created_at', { ascending: false });

      if (leadsError) throw leadsError;

      // Récupérer tous les businesses pour avoir les noms
      const { data: businessesData, error: businessesError } = await supabase
        .from('businesses')
        .select('id, name');

      if (businessesError) {
        console.error('Erreur lors de la récupération des business:', businessesError);
      } else {
        // Créer un dictionnaire business_id -> name
        const businessMap: Record<string, string> = {};
        businessesData.forEach(business => {
          businessMap[business.id] = business.name;
        });
        setBusinesses(businessMap);

        // Ajouter le nom du business à chaque lead
        const enrichedLeads = leadsData.map(lead => ({
          ...lead,
          business_name: lead.business_id ? businessMap[lead.business_id] || 'Inconnu' : 'Non spécifié'
        }));

        setLeads(enrichedLeads);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des leads:', err);
      setError('Une erreur est survenue lors du chargement des leads');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...leads];

    // Filtre par recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(lead => 
        lead.full_name.toLowerCase().includes(term) || 
        lead.email.toLowerCase().includes(term) || 
        lead.phone.includes(term) ||
        lead.city.toLowerCase().includes(term) ||
        lead.country.toLowerCase().includes(term) ||
        (lead.business_name && lead.business_name.toLowerCase().includes(term))
      );
    }

    // Filtre par statut
    if (statusFilter !== 'all') {
      filtered = filtered.filter(lead => lead.status === statusFilter);
    }

    // Filtre par business
    if (businessFilter !== 'all') {
      filtered = filtered.filter(lead => lead.business_id === businessFilter);
    }

    // Filtre par période
    if (timeFilter !== 'all') {
      const now = new Date();
      let startDate = new Date();
      
      switch (timeFilter) {
        case 'today':
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          break;
        case 'quarter':
          startDate.setMonth(now.getMonth() - 3);
          break;
      }
      
      filtered = filtered.filter(lead => {
        const leadDate = new Date(lead.created_at);
        return leadDate >= startDate && leadDate <= now;
      });
    }

    // Tri
    filtered.sort((a, b) => {
      let valueA = sortField === 'created_at' || sortField === 'updated_at' 
        ? new Date(a[sortField]).getTime() 
        : a[sortField];
        
      let valueB = sortField === 'created_at' || sortField === 'updated_at' 
        ? new Date(b[sortField]).getTime() 
        : b[sortField];
        
      const order = sortDirection === 'asc' ? 1 : -1;
      
      if (valueA < valueB) return -1 * order;
      if (valueA > valueB) return 1 * order;
      return 0;
    });

    setFilteredLeads(filtered);
  };

  const calculateStats = () => {
    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    
    const oneWeekAgo = new Date(now);
    oneWeekAgo.setDate(now.getDate() - 7);

    const newLeads = leads.filter(lead => lead.status === 'new').length;
    const contactedLeads = leads.filter(lead => lead.status === 'contacted').length;
    const negotiatingLeads = leads.filter(lead => lead.status === 'negotiating').length;
    const soldLeads = leads.filter(lead => lead.status === 'sold').length;
    const cancelledLeads = leads.filter(lead => lead.status === 'cancelled').length;
    
    const todayNewLeads = leads.filter(lead => {
      const leadDate = new Date(lead.created_at);
      return leadDate >= today && leadDate <= now;
    }).length;
    
    const weekNewLeads = leads.filter(lead => {
      const leadDate = new Date(lead.created_at);
      return leadDate >= oneWeekAgo && leadDate <= now;
    }).length;

    setStats({
      total: leads.length,
      new: newLeads,
      contacted: contactedLeads,
      negotiating: negotiatingLeads,
      sold: soldLeads,
      cancelled: cancelledLeads,
      todayNew: todayNewLeads,
      weekNew: weekNewLeads
    });
  };

  const handleSort = (field: SortField) => {
    setSortDirection(
      sortField === field 
        ? (sortDirection === 'asc' ? 'desc' : 'asc') 
        : 'desc'
    );
    setSortField(field);
  };

  const handleRefresh = () => {
    fetchLeads();
  };

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setBusinessFilter('all');
    setTimeFilter('all');
  };

  const exportToCsv = () => {
    // Format des colonnes: nom,email,téléphone,pays,ville,business,statut,date
    const headers = ['Nom', 'Email', 'Téléphone', 'Pays', 'Ville', 'Business', 'Statut', 'Date de création'];
    
    const csvData = filteredLeads.map(lead => [
      lead.full_name,
      lead.email,
      lead.phone,
      lead.country,
      lead.city,
      lead.business_name || 'Non spécifié',
      lead.status,
      new Date(lead.created_at).toLocaleDateString('fr-FR')
    ]);
    
    // Ajouter les en-têtes au début
    csvData.unshift(headers);
    
    // Convertir en texte CSV
    const csvContent = csvData.map(row => row.map(cell => 
      // Gérer les cellules qui contiennent des virgules
      typeof cell === 'string' && cell.includes(',') 
        ? `"${cell}"` 
        : cell
    ).join(',')).join('\n');
    
    // Créer un blob et un lien de téléchargement
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `leads_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    
    link.click();
    
    // Nettoyer
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Extraction des business uniques pour le filtre
  const uniqueBusinesses = leads.reduce((acc: Record<string, string>, lead) => {
    if (lead.business_id && lead.business_name) {
      acc[lead.business_id] = lead.business_name;
    }
    return acc;
  }, {});

  // En cas de chargement
  if (loading && !refreshing) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Loader2 className="h-12 w-12 animate-spin text-[#ff7f50] mb-4" />
        <p className="text-gray-500">Chargement des leads...</p>
      </div>
    );
  }

  // En cas d'erreur
  if (error && !refreshing) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-1" />
          <div>
            <h3 className="font-medium text-red-800">Erreur</h3>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
        <Button onClick={handleRefresh} className="flex items-center">
          <RefreshCw className="h-4 w-4 mr-2" />
          Réessayer
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#0f4c81]">Prospects</h1>
          <p className="text-gray-500">Gestion et suivi des demandes d'intérêt pour les business</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            onClick={handleRefresh} 
            variant="outline" 
            size="sm" 
            className="flex items-center"
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
          
          <Button 
            onClick={exportToCsv} 
            variant="outline" 
            size="sm" 
            className="flex items-center"
          >
            <Download className="h-4 w-4 mr-2" />
            Exporter CSV
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total des prospects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total}</div>
            <p className="text-xs opacity-80">
              {stats.weekNew} nouveaux cette semaine
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Nouveaux</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.new}</div>
            <div className="w-full bg-gray-200 h-1.5 mt-2 rounded-full">
              <div className="h-1.5 bg-blue-600 rounded-full" style={{ width: `${(stats.new / stats.total) * 100}%` }}></div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Contactés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.contacted}</div>
            <div className="w-full bg-gray-200 h-1.5 mt-2 rounded-full">
              <div className="h-1.5 bg-yellow-500 rounded-full" style={{ width: `${(stats.contacted / stats.total) * 100}%` }}></div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">En négociation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.negotiating}</div>
            <div className="w-full bg-gray-200 h-1.5 mt-2 rounded-full">
              <div className="h-1.5 bg-purple-500 rounded-full" style={{ width: `${(stats.negotiating / stats.total) * 100}%` }}></div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Conclus</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.sold}</div>
            <div className="w-full bg-gray-200 h-1.5 mt-2 rounded-full">
              <div className="h-1.5 bg-green-500 rounded-full" style={{ width: `${(stats.sold / stats.total) * 100}%` }}></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 bg-white p-4 rounded-lg border shadow-sm">
        {/* Recherche */}
        <div className="lg:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher par nom, email, pays..."
              className="pl-10"
            />
          </div>
        </div>
        
        {/* Filtre par statut */}
        <div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Tous les statuts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="new">Nouveaux</SelectItem>
              <SelectItem value="contacted">Contactés</SelectItem>
              <SelectItem value="negotiating">En négociation</SelectItem>
              <SelectItem value="sold">Vendus</SelectItem>
              <SelectItem value="cancelled">Annulés</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Filtre par business */}
        <div>
          <Select value={businessFilter} onValueChange={setBusinessFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Tous les business" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les business</SelectItem>
              {Object.entries(uniqueBusinesses).map(([id, name]) => (
                <SelectItem key={id} value={id}>{name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Filtre par période */}
        <div>
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Toute période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toute période</SelectItem>
              <SelectItem value="today">Aujourd'hui</SelectItem>
              <SelectItem value="week">Cette semaine</SelectItem>
              <SelectItem value="month">Ce mois-ci</SelectItem>
              <SelectItem value="quarter">Ce trimestre</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Bouton de réinitialisation des filtres */}
        <div className="flex justify-end items-center lg:hidden">
          <Button 
            onClick={resetFilters} 
            variant="outline" 
            size="sm"
          >
            Réinitialiser les filtres
          </Button>
        </div>
      </div>

      {/* Liste des leads */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('created_at')}
                >
                  <div className="flex items-center">
                    Date
                    {sortField === 'created_at' && (
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('full_name')}
                >
                  <div className="flex items-center">
                    Prospect
                    {sortField === 'full_name' && (
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead>Business</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center">
                    Statut
                    {sortField === 'status' && (
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    Aucun résultat trouvé.
                    {(searchTerm || statusFilter !== 'all' || businessFilter !== 'all' || timeFilter !== 'all') && (
                      <div className="mt-2">
                        <Button 
                          onClick={resetFilters} 
                          variant="outline" 
                          size="sm"
                        >
                          Réinitialiser les filtres
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                filteredLeads.map((lead) => (
                  <TableRow 
                    key={lead.id} 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => router.push(`/admin/leads/${lead.id}`)}
                  >
                    <TableCell className="whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        {new Date(lead.created_at).toLocaleDateString('fr-FR')}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatRelativeDate(lead.created_at)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{lead.full_name}</div>
                      <div className="text-xs text-gray-500">
                        {lead.city}, {lead.country}
                      </div>
                    </TableCell>
                    <TableCell>
                      {lead.business_name || 'Non spécifié'}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <a 
                          href={`mailto:${lead.email}`} 
                          className="text-blue-600 hover:underline flex items-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Mail className="h-3 w-3 mr-1" />
                          {lead.email}
                        </a>
                        <a 
                          href={`tel:${lead.phone}`} 
                          className="text-blue-600 hover:underline flex items-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Phone className="h-3 w-3 mr-1" />
                          {lead.phone}
                          {lead.is_whatsapp && (
                            <span className="ml-1 text-xs bg-green-100 text-green-800 px-1 py-0.5 rounded">
                              WA
                            </span>
                          )}
                        </a>
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={lead.status} />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="h-8 w-8"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.location.href = `mailto:${lead.email}`;
                                }}
                              >
                                <Mail className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Envoyer un email</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="h-8 w-8"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.location.href = `tel:${lead.phone}`;
                                }}
                              >
                                <Phone className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Appeler</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        {lead.is_whatsapp && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(`https://wa.me/${lead.phone.replace(/\s+/g, '')}`, '_blank');
                                  }}
                                >
                                  <svg viewBox="0 0 24 24" className="h-4 w-4 text-green-600">
                                    <path fill="currentColor" d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.2.3-.767.966-.94 1.164-.173.199-.347.223-.647.075-.3-.15-1.269-.468-2.416-1.483-.893-.795-1.484-1.77-1.66-2.07-.174-.3-.018-.465.13-.614.136-.135.301-.345.451-.52.151-.174.2-.3.3-.498.099-.2.05-.374-.025-.524-.075-.15-.672-1.62-.922-2.22-.24-.584-.485-.49-.672-.49-.172-.008-.371-.01-.571-.01-.2 0-.523.074-.797.359-.273.297-1.045 1.019-1.045 2.487 0 1.469 1.069 2.889 1.22 3.089.149.197 2.105 3.215 5.1 4.499.714.306 1.27.489 1.704.625.714.227 1.365.195 1.88.118.574-.077 1.768-.719 2.016-1.413.247-.694.247-1.289.173-1.413-.074-.124-.272-.198-.571-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.999-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                  </svg>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Contacter sur WhatsApp</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <div className="p-4 border-t">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              Affichage de {filteredLeads.length} sur {leads.length} prospects
            </p>
            <div className="flex items-center gap-2">
              <Button 
                onClick={resetFilters} 
                variant="ghost" 
                size="sm"
                className="hidden lg:flex items-center"
                disabled={!(searchTerm || statusFilter !== 'all' || businessFilter !== 'all' || timeFilter !== 'all')}
              >
                Réinitialiser les filtres
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAdminAuth(LeadsPage);