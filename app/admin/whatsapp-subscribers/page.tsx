// app/admin/whatsapp-subscribers/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabase';
import { withAdminAuth } from '@/app/lib/withAdminAuth';
import { formatRelativeDate } from '@/app/lib/utils/date-utils';
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
  RefreshCw,
  Download,
  CheckCircle,
  XCircle,
  Loader2,
  ArrowUpDown,
  AlertCircle,
  Send,
  UploadCloud,
  Smartphone
} from 'lucide-react';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { Badge } from '@/app/components/ui/badge';
import { WhatsAppIcon } from '@/app/components/icons/WhatsAppIcon';
import { toast } from 'sonner';

// Types
interface WhatsAppSubscriber {
  id: string;
  phone: string;
  country: string;
  status: 'active' | 'inactive' | 'blocked';
  subscribed_at: string;
  last_message_sent?: string;
}

type StatusType = 'active' | 'inactive' | 'blocked';
type SortField = 'subscribed_at' | 'phone' | 'country' | 'status' | 'last_message_sent';
type SortDirection = 'asc' | 'desc';

const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig: Record<StatusType, { label: string, className: string }> = {
    active: { 
      label: 'Actif', 
      className: 'bg-green-100 text-green-800 hover:bg-green-200' 
    },
    inactive: { 
      label: 'Inactif', 
      className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
    },
    blocked: { 
      label: 'Bloqué', 
      className: 'bg-red-100 text-red-800 hover:bg-red-200' 
    }
  };

  const config = statusConfig[status as StatusType] || {
    label: status,
    className: 'bg-gray-100 text-gray-800 hover:bg-gray-200'
  };

  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
};

function WhatsAppSubscribersPage() {
  // États
  const [subscribers, setSubscribers] = useState<WhatsAppSubscriber[]>([]);
  const [filteredSubscribers, setFilteredSubscribers] = useState<WhatsAppSubscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  
  // Filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [countryFilter, setCountryFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all');
  
  // Tri
  const [sortField, setSortField] = useState<SortField>('subscribed_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  
  // Statistiques
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    blocked: 0,
    todayNew: 0,
    weekNew: 0
  });

  // États pour l'envoi de message groupé
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  
  // États pour l'import de numéros
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [importNumbers, setImportNumbers] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  // Récupérer les données
  useEffect(() => {
    fetchSubscribers();
  }, []);

  // Filtrer les données
  useEffect(() => {
    if (subscribers.length > 0) {
      applyFilters();
    }
  }, [subscribers, searchTerm, statusFilter, countryFilter, timeFilter, sortField, sortDirection]);

  // Calculer les statistiques
  useEffect(() => {
    if (subscribers.length > 0) {
      calculateStats();
    }
  }, [subscribers]);

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      setError(null);
      setRefreshing(true);

      // Récupérer tous les abonnés WhatsApp
      const { data: subscribersData, error: subscribersError } = await supabase
        .from('whatsapp_subscribers')
        .select('*')
        .order('subscribed_at', { ascending: false });

      if (subscribersError) {
        console.error('Erreur lors de la récupération des abonnés:', subscribersError);
        throw subscribersError;
      }

      // Vérifier si nous avons des données
      if (!subscribersData || subscribersData.length === 0) {
        console.log('Aucun abonné trouvé');
        setSubscribers([]);
        return;
      }

      console.log(`${subscribersData.length} abonnés récupérés`);
      setSubscribers(subscribersData);

    } catch (err: any) {
      console.error('Erreur lors du chargement des abonnés:', err);
      setError(`Une erreur est survenue lors du chargement des abonnés: ${err.message || err}`);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...subscribers];

    // Filtre par recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(subscriber => 
        subscriber.phone.toLowerCase().includes(term) || 
        subscriber.country.toLowerCase().includes(term)
      );
    }

    // Filtre par statut
    if (statusFilter !== 'all') {
      filtered = filtered.filter(subscriber => subscriber.status === statusFilter);
    }

    // Filtre par pays
    if (countryFilter !== 'all') {
      filtered = filtered.filter(subscriber => subscriber.country === countryFilter);
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
      
      filtered = filtered.filter(subscriber => {
        const subscribedDate = new Date(subscriber.subscribed_at);
        return subscribedDate >= startDate && subscribedDate <= now;
      });
    }

    // Tri
    filtered.sort((a, b) => {
      let valueA = sortField === 'subscribed_at' || sortField === 'last_message_sent' 
        ? new Date(a[sortField] || '1970-01-01').getTime() 
        : a[sortField];
        
      let valueB = sortField === 'subscribed_at' || sortField === 'last_message_sent' 
        ? new Date(b[sortField] || '1970-01-01').getTime() 
        : b[sortField];
        
      const order = sortDirection === 'asc' ? 1 : -1;
      
      if (valueA < valueB) return -1 * order;
      if (valueA > valueB) return 1 * order;
      return 0;
    });

    setFilteredSubscribers(filtered);
  };

  const calculateStats = () => {
    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    
    const oneWeekAgo = new Date(now);
    oneWeekAgo.setDate(now.getDate() - 7);

    const activeSubscribers = subscribers.filter(subscriber => subscriber.status === 'active').length;
    const inactiveSubscribers = subscribers.filter(subscriber => subscriber.status === 'inactive').length;
    const blockedSubscribers = subscribers.filter(subscriber => subscriber.status === 'blocked').length;
    
    const todayNewSubscribers = subscribers.filter(subscriber => {
      const subscribedDate = new Date(subscriber.subscribed_at);
      return subscribedDate >= today && subscribedDate <= now;
    }).length;
    
    const weekNewSubscribers = subscribers.filter(subscriber => {
      const subscribedDate = new Date(subscriber.subscribed_at);
      return subscribedDate >= oneWeekAgo && subscribedDate <= now;
    }).length;

    setStats({
      total: subscribers.length,
      active: activeSubscribers,
      inactive: inactiveSubscribers,
      blocked: blockedSubscribers,
      todayNew: todayNewSubscribers,
      weekNew: weekNewSubscribers
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
    fetchSubscribers();
  };

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setCountryFilter('all');
    setTimeFilter('all');
  };

  const handleStatusChange = async (subscriberId: string, newStatus: StatusType) => {
    try {
      const { error } = await supabase
        .from('whatsapp_subscribers')
        .update({ status: newStatus })
        .eq('id', subscriberId);

      if (error) throw error;

      // Mettre à jour l'état local
      setSubscribers(prevSubscribers => 
        prevSubscribers.map(sub => 
          sub.id === subscriberId ? { ...sub, status: newStatus } : sub
        )
      );

      toast.success(`Statut modifié avec succès`);
    } catch (err) {
      console.error('Erreur lors de la modification du statut:', err);
      toast.error('Erreur lors de la modification du statut');
    }
  };

  const handleDeleteSubscriber = async (subscriberId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet abonné ?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('whatsapp_subscribers')
        .delete()
        .eq('id', subscriberId);

      if (error) throw error;

      // Mettre à jour l'état local
      setSubscribers(prevSubscribers => 
        prevSubscribers.filter(sub => sub.id !== subscriberId)
      );

      toast.success(`Abonné supprimé avec succès`);
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleSendBroadcastMessage = async () => {
    if (!broadcastMessage.trim()) {
      toast.error('Veuillez saisir un message');
      return;
    }

    setIsSending(true);

    try {
      // Simuler l'envoi (à remplacer par l'intégration réelle avec l'API WhatsApp Business)
      const selectedSubscribers = filteredSubscribers.filter(sub => sub.status === 'active');
      
      // Dans un scénario réel, vous utiliseriez l'API WhatsApp Business ici
      // Pour l'instant, nous allons simplement mettre à jour la date du dernier message
      const now = new Date().toISOString();
      
      // Mettre à jour la date du dernier message pour tous les abonnés filtrés et actifs
      const { error } = await supabase
        .from('whatsapp_subscribers')
        .update({ last_message_sent: now })
        .in('id', selectedSubscribers.map(sub => sub.id))
        .eq('status', 'active');

      if (error) throw error;

      // Mettre à jour l'état local
      setSubscribers(prevSubscribers => 
        prevSubscribers.map(sub => 
          selectedSubscribers.some(selected => selected.id === sub.id) 
            ? { ...sub, last_message_sent: now } 
            : sub
        )
      );

      toast.success(`Message envoyé avec succès à ${selectedSubscribers.length} abonnés`);
      setBroadcastMessage('');
      setIsMessageDialogOpen(false);
    } catch (err) {
      console.error('Erreur lors de l\'envoi du message:', err);
      toast.error('Erreur lors de l\'envoi du message');
    } finally {
      setIsSending(false);
    }
  };

  const handleImportNumbers = async () => {
    if (!importNumbers.trim()) {
      toast.error('Veuillez saisir des numéros');
      return;
    }

    setIsImporting(true);

    try {
      // Traiter les numéros importés
      const numbers = importNumbers
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 8);

      if (numbers.length === 0) {
        toast.error('Aucun numéro valide trouvé');
        return;
      }

      // Vérifier les doublons avec la base de données
      const { data: existingSubscribers, error: checkError } = await supabase
        .from('whatsapp_subscribers')
        .select('phone')
        .in('phone', numbers);

      if (checkError) throw checkError;

      // Filtrer les numéros déjà existants
      const existingPhones = new Set(existingSubscribers?.map(sub => sub.phone));
      const newNumbers = numbers.filter(phone => !existingPhones.has(phone));

      if (newNumbers.length === 0) {
        toast.warning('Tous les numéros existent déjà dans la base de données');
        return;
      }

      // Préparer les données pour l'insertion
      const now = new Date().toISOString();
      const newSubscribers = newNumbers.map(phone => ({
        phone,
        country: 'SN', // Par défaut, à améliorer avec une détection basée sur l'indicatif
        status: 'active',
        subscribed_at: now
      }));

      // Insérer les nouveaux abonnés
      const { data: insertedData, error: insertError } = await supabase
        .from('whatsapp_subscribers')
        .insert(newSubscribers)
        .select();

      if (insertError) throw insertError;

      // Mettre à jour l'état local
      setSubscribers(prev => [...prev, ...(insertedData || [])]);

      toast.success(`${newNumbers.length} nouveaux abonnés ajoutés avec succès`);
      setImportNumbers('');
      setIsImportDialogOpen(false);
    } catch (err) {
      console.error('Erreur lors de l\'import des numéros:', err);
      toast.error('Erreur lors de l\'import des numéros');
    } finally {
      setIsImporting(false);
    }
  };

  const exportToCsv = () => {
    const headers = ['ID', 'Téléphone', 'Pays', 'Statut', 'Date d\'inscription', 'Dernier message envoyé'];
    
    const csvData = filteredSubscribers.map(subscriber => [
      subscriber.id,
      subscriber.phone,
      subscriber.country,
      subscriber.status,
      new Date(subscriber.subscribed_at).toLocaleDateString('fr-FR'),
      subscriber.last_message_sent ? new Date(subscriber.last_message_sent).toLocaleDateString('fr-FR') : '-'
    ]);
    
    // Ajouter les en-têtes au début
    csvData.unshift(headers);
    
    // Convertir en texte CSV
    const csvContent = csvData.map(row => row.map(cell => 
      typeof cell === 'string' && cell.includes(',') 
        ? `"${cell}"` 
        : cell
    ).join(',')).join('\n');
    
    // Créer un blob et un lien de téléchargement
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `abonnes_whatsapp_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    
    link.click();
    
    // Nettoyer
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Extraction des pays uniques pour le filtre
  const uniqueCountries = [...new Set(subscribers.map(sub => sub.country))].sort();

  // En cas de chargement
  if (loading && !refreshing) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Loader2 className="h-12 w-12 animate-spin text-[#ff7f50] mb-4" />
        <p className="text-gray-500">Chargement des abonnés WhatsApp...</p>
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
          <h1 className="text-2xl font-bold text-[#0f4c81]">Abonnés WhatsApp</h1>
          <p className="text-gray-500">Gestion des abonnés à la liste de diffusion WhatsApp</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => setIsMessageDialogOpen(true)} 
            variant="default" 
            size="sm" 
            className="flex items-center bg-[#25D366] hover:bg-[#128C7E]"
          >
            <Send className="h-4 w-4 mr-2" />
            Envoyer un message
          </Button>
          
          <Button 
            onClick={() => setIsImportDialogOpen(true)} 
            variant="outline" 
            size="sm" 
            className="flex items-center"
          >
            <UploadCloud className="h-4 w-4 mr-2" />
            Importer
          </Button>
          
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total des abonnés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-gray-500">
              {stats.weekNew} nouveaux cette semaine
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Abonnés actifs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
            <p className="text-xs text-gray-500">
              Taux d'activité: {stats.total > 0 ? ((stats.active / stats.total) * 100).toFixed(1) : 0}%
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Abonnés inactifs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inactive}</div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Inactifs: {stats.inactive}</span>
              <span>Bloqués: {stats.blocked}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Nouveaux aujourd'hui</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayNew}</div>
            <p className="text-xs text-gray-500">
              {stats.todayNew > 0 ? '+' : ''}{stats.todayNew} depuis minuit
            </p>
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
              placeholder="Rechercher par téléphone, pays..."
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
              <SelectItem value="active">Actifs</SelectItem>
              <SelectItem value="inactive">Inactifs</SelectItem>
              <SelectItem value="blocked">Bloqués</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Filtre par pays */}
        <div>
          <Select value={countryFilter} onValueChange={setCountryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Tous les pays" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les pays</SelectItem>
              {uniqueCountries.map(country => (
                <SelectItem key={country} value={country}>{country}</SelectItem>
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

      {/* Liste des abonnés */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('subscribed_at')}
                >
                  <div className="flex items-center">
                    Date d'inscription
                    {sortField === 'subscribed_at' && (
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('phone')}
                >
                  <div className="flex items-center">
                    Téléphone
                    {sortField === 'phone' && (
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('country')}
                >
                  <div className="flex items-center">
                    Pays
                    {sortField === 'country' && (
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
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
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('last_message_sent')}
                >
                  <div className="flex items-center">
                    Dernier message
                    {sortField === 'last_message_sent' && (
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubscribers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    Aucun résultat trouvé.
                    {(searchTerm || statusFilter !== 'all' || countryFilter !== 'all' || timeFilter !== 'all') && (
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
                filteredSubscribers.map((subscriber) => (
                  <TableRow 
                    key={subscriber.id} 
                    className="hover:bg-gray-50"
                  >
                    <TableCell className="whitespace-nowrap">
                      {new Date(subscriber.subscribed_at).toLocaleDateString('fr-FR')}
                      <div className="text-xs text-gray-500">
                        {formatRelativeDate(subscriber.subscribed_at)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Smartphone className="h-4 w-4 mr-2 text-gray-400" />
                        <a 
                          href={`https://wa.me/${subscriber.phone.replace(/\s+/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer" 
                          className="text-blue-600 hover:underline"
                        >
                          {subscriber.phone}
                        </a>
                      </div>
                    </TableCell>
                    <TableCell>
                      {subscriber.country}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={subscriber.status} />
                    </TableCell>
                    <TableCell>
                      {subscriber.last_message_sent ? (
                        <>
                          {new Date(subscriber.last_message_sent).toLocaleDateString('fr-FR')}
                          <div className="text-xs text-gray-500">
                            {formatRelativeDate(subscriber.last_message_sent)}
                          </div>
                        </>
                      ) : (
                        <span className="text-gray-400 text-sm">Jamais</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <a 
                          href={`https://wa.me/${subscriber.phone.replace(/\s+/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-[#25D366] text-white hover:bg-opacity-90"
                        >
                          <WhatsAppIcon className="h-4 w-4" />
                        </a>
                        
                        <Select 
                          value={subscriber.status} 
                          onValueChange={(value) => handleStatusChange(subscriber.id, value as StatusType)}
                        >
                          <SelectTrigger className="h-8 w-28">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Actif</SelectItem>
                            <SelectItem value="inactive">Inactif</SelectItem>
                            <SelectItem value="blocked">Bloqué</SelectItem>
                          </SelectContent>
                        </Select>

                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteSubscriber(subscriber.id)}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
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
              Affichage de {filteredSubscribers.length} sur {subscribers.length} abonnés
            </p>
            <div className="flex items-center gap-2">
              <Button 
                onClick={resetFilters} 
                variant="ghost" 
                size="sm"
                className="hidden lg:flex items-center"
                disabled={!(searchTerm || statusFilter !== 'all' || countryFilter !== 'all' || timeFilter !== 'all')}
              >
                Réinitialiser les filtres
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Dialogue d'envoi de message */}
      <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Envoyer un message aux abonnés</DialogTitle>
            <DialogDescription>
              Le message sera envoyé à {filteredSubscribers.filter(sub => sub.status === 'active').length} abonnés actifs.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                placeholder="Saisissez votre message..."
                className="h-40"
              />
              <p className="text-xs text-gray-500">
                Ce message sera envoyé à tous les abonnés actifs filtrés.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsMessageDialogOpen(false)}
              disabled={isSending}
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              onClick={handleSendBroadcastMessage}
              disabled={isSending || !broadcastMessage.trim()}
              className="bg-[#25D366] hover:bg-[#128C7E]"
            >
              {isSending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Envoyer
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialogue d'import de numéros */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Importer des numéros</DialogTitle>
            <DialogDescription>
              Un numéro par ligne, format international de préférence (+221XXXXXXXX).
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="numbers">Numéros de téléphone</Label>
              <Textarea
                id="numbers"
                value={importNumbers}
                onChange={(e) => setImportNumbers(e.target.value)}
                placeholder="+221781234567
+221771234567
+221701234567"
                className="h-40 font-mono"
              />
              <p className="text-xs text-gray-500">
                Les numéros déjà existants seront ignorés.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsImportDialogOpen(false)}
              disabled={isImporting}
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              onClick={handleImportNumbers}
              disabled={isImporting || !importNumbers.trim()}
            >
              {isImporting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Importation en cours...
                </>
              ) : (
                <>
                  <UploadCloud className="mr-2 h-4 w-4" />
                  Importer
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default withAdminAuth(WhatsAppSubscribersPage);