// app/admin/enrollments/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabase';
import { withAdminAuth } from '@/app/lib/withAdminAuth';
import { formatRelativeDate } from '@/app/lib/utils/date-utils';
import Link from 'next/link';
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
  Calendar,
  BookOpen,
  Loader2,
  ArrowUpDown,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock
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
import { Badge } from '@/app/components/ui/badge';

// Types
interface Enrollment {
  id: string;
  formation_id: string;
  session_date: string;
  full_name: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  payment_option: string;
  payment_status: 'pending' | 'paid' | 'partial' | 'cancelled';
  amount_paid: number;
  created_at: string;
  formation_title?: string;
  formation_price?: number;
}

interface Formation {
  id: string;
  title: string;
  price: string;
  price_amount: number;
}

type PaymentStatusType = 'pending' | 'paid' | 'partial' | 'cancelled';
type SortField = 'created_at' | 'full_name' | 'payment_status' | 'session_date';
type SortDirection = 'asc' | 'desc';

const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig: Record<PaymentStatusType, { label: string, className: string }> = {
    pending: { 
      label: 'En attente', 
      className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
    },
    paid: { 
      label: 'Payé', 
      className: 'bg-green-100 text-green-800 hover:bg-green-200' 
    },
    partial: { 
      label: 'Partiellement payé', 
      className: 'bg-blue-100 text-blue-800 hover:bg-blue-200' 
    },
    cancelled: { 
      label: 'Annulé', 
      className: 'bg-red-100 text-red-800 hover:bg-red-200' 
    }
  };

  const config = statusConfig[status as PaymentStatusType] || {
    label: status,
    className: 'bg-gray-100 text-gray-800 hover:bg-gray-200'
  };

  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
};

function EnrollmentsPage() {
  // États
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [formations, setFormations] = useState<Record<string, Formation>>({});
  const [filteredEnrollments, setFilteredEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  
  // Filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [formationFilter, setFormationFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all');
  
  // Tri
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  
  // Statistiques
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    paid: 0,
    partial: 0,
    cancelled: 0,
    todayNew: 0,
    weekNew: 0,
    totalRevenue: 0
  });

  // Récupérer les données
  useEffect(() => {
    fetchEnrollments();
  }, []);

  // Filtrer les données
  useEffect(() => {
    if (enrollments.length > 0) {
      applyFilters();
    }
  }, [enrollments, searchTerm, statusFilter, formationFilter, timeFilter, sortField, sortDirection]);

  // Calculer les statistiques
  useEffect(() => {
    if (enrollments.length > 0) {
      calculateStats();
    }
  }, [enrollments]);

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      setError(null);
      setRefreshing(true);

      // Récupérer toutes les formations pour les données de référence
      const { data: formationsData, error: formationsError } = await supabase
        .from('formations')
        .select('id, title, price, price_amount');

      if (formationsError) {
        console.error('Erreur lors de la récupération des formations:', formationsError);
        throw formationsError;
      }

      // Créer un dictionnaire des formations
      const formationsDict: Record<string, Formation> = {};
      formationsData.forEach((formation: Formation) => {
        formationsDict[formation.id] = formation;
      });
      setFormations(formationsDict);

      // Récupérer tous les inscriptions
      const { data: enrollmentsData, error: enrollmentsError } = await supabase
        .from('formation_enrollments')
        .select('*')
        .order('created_at', { ascending: false });

      if (enrollmentsError) {
        console.error('Erreur lors de la récupération des inscriptions:', enrollmentsError);
        throw enrollmentsError;
      }

      // Vérifier si nous avons bien des données
      if (!enrollmentsData || enrollmentsData.length === 0) {
        console.log('Aucune inscription trouvée dans la base de données');
        setEnrollments([]);
        return;
      }

      console.log(`${enrollmentsData.length} inscriptions récupérées`);

      // Enrichir les données des inscriptions avec les informations de formation
      const enrichedEnrollments = enrollmentsData.map((enrollment: Enrollment) => ({
        ...enrollment,
        formation_title: formationsDict[enrollment.formation_id]?.title || 'Formation inconnue',
        formation_price: formationsDict[enrollment.formation_id]?.price_amount || 0
      }));

      setEnrollments(enrichedEnrollments);
    } catch (err: any) {
      console.error('Erreur lors du chargement des inscriptions:', err);
      setError(`Une erreur est survenue lors du chargement des inscriptions: ${err.message || err}`);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...enrollments];

    // Filtre par recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(enrollment => 
        enrollment.full_name.toLowerCase().includes(term) || 
        enrollment.email.toLowerCase().includes(term) || 
        enrollment.phone.includes(term) ||
        enrollment.city.toLowerCase().includes(term) ||
        enrollment.country.toLowerCase().includes(term) ||
        (enrollment.formation_title && enrollment.formation_title.toLowerCase().includes(term))
      );
    }

    // Filtre par statut
    if (statusFilter !== 'all') {
      filtered = filtered.filter(enrollment => enrollment.payment_status === statusFilter);
    }

    // Filtre par formation
    if (formationFilter !== 'all') {
      filtered = filtered.filter(enrollment => enrollment.formation_id === formationFilter);
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
      
      filtered = filtered.filter(enrollment => {
        const enrollmentDate = new Date(enrollment.created_at);
        return enrollmentDate >= startDate && enrollmentDate <= now;
      });
    }

    // Tri
    filtered.sort((a, b) => {
      let valueA = sortField === 'created_at' || sortField === 'session_date' 
        ? new Date(a[sortField]).getTime() 
        : a[sortField];
        
      let valueB = sortField === 'created_at' || sortField === 'session_date' 
        ? new Date(b[sortField]).getTime() 
        : b[sortField];
        
      const order = sortDirection === 'asc' ? 1 : -1;
      
      if (valueA < valueB) return -1 * order;
      if (valueA > valueB) return 1 * order;
      return 0;
    });

    setFilteredEnrollments(filtered);
  };

  const calculateStats = () => {
    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    
    const oneWeekAgo = new Date(now);
    oneWeekAgo.setDate(now.getDate() - 7);

    const pendingEnrollments = enrollments.filter(enrollment => enrollment.payment_status === 'pending').length;
    const paidEnrollments = enrollments.filter(enrollment => enrollment.payment_status === 'paid').length;
    const partialEnrollments = enrollments.filter(enrollment => enrollment.payment_status === 'partial').length;
    const cancelledEnrollments = enrollments.filter(enrollment => enrollment.payment_status === 'cancelled').length;
    
    const todayNewEnrollments = enrollments.filter(enrollment => {
      const enrollmentDate = new Date(enrollment.created_at);
      return enrollmentDate >= today && enrollmentDate <= now;
    }).length;
    
    const weekNewEnrollments = enrollments.filter(enrollment => {
      const enrollmentDate = new Date(enrollment.created_at);
      return enrollmentDate >= oneWeekAgo && enrollmentDate <= now;
    }).length;

    // Calculer le revenu total
    const totalRevenue = enrollments
      .filter(enrollment => enrollment.payment_status === 'paid' || enrollment.payment_status === 'partial')
      .reduce((sum, enrollment) => sum + enrollment.amount_paid, 0);

    setStats({
      total: enrollments.length,
      pending: pendingEnrollments,
      paid: paidEnrollments,
      partial: partialEnrollments,
      cancelled: cancelledEnrollments,
      todayNew: todayNewEnrollments,
      weekNew: weekNewEnrollments,
      totalRevenue
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
    fetchEnrollments();
  };

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setFormationFilter('all');
    setTimeFilter('all');
  };

  const exportToCsv = () => {
    // Format des colonnes: nom,email,téléphone,pays,ville,formation,statut,date
    const headers = ['Nom', 'Email', 'Téléphone', 'Pays', 'Ville', 'Formation', 'Session', 'Option de paiement', 'Statut', 'Montant payé', 'Date d\'inscription'];
    
    const csvData = filteredEnrollments.map(enrollment => [
      enrollment.full_name,
      enrollment.email,
      enrollment.phone,
      enrollment.country,
      enrollment.city,
      enrollment.formation_title || 'Non spécifié',
      enrollment.session_date,
      enrollment.payment_option,
      enrollment.payment_status,
      enrollment.amount_paid.toString(),
      new Date(enrollment.created_at).toLocaleDateString('fr-FR')
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
    link.setAttribute('download', `inscriptions_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    
    link.click();
    
    // Nettoyer
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // En cas de chargement
  if (loading && !refreshing) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Loader2 className="h-12 w-12 animate-spin text-[#ff7f50] mb-4" />
        <p className="text-gray-500">Chargement des inscriptions...</p>
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
          <h1 className="text-2xl font-bold text-[#0f4c81]">Inscriptions aux formations</h1>
          <p className="text-gray-500">Gestion et suivi des inscriptions aux formations</p>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total des inscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-gray-500">
              {stats.weekNew} nouvelles cette semaine
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Statut des paiements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.paid + stats.partial}</div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>{stats.paid} payés</span>
              <span>{stats.partial} partiels</span>
              <span>{stats.pending} en attente</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Revenus générés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRevenue.toLocaleString('fr-FR')} FCFA</div>
            <p className="text-xs text-gray-500">
              Taux de paiement: {stats.total > 0 ? (((stats.paid + stats.partial) / stats.total) * 100).toFixed(1) : 0}%
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Inscriptions aujourd'hui</CardTitle>
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
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="paid">Payé</SelectItem>
              <SelectItem value="partial">Partiellement payé</SelectItem>
              <SelectItem value="cancelled">Annulé</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Filtre par formation */}
        <div>
          <Select value={formationFilter} onValueChange={setFormationFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Toutes les formations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les formations</SelectItem>
              {Object.entries(formations).map(([id, formation]) => (
                <SelectItem key={id} value={id}>{formation.title}</SelectItem>
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

      {/* Liste des inscriptions */}
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
                    Participant
                    {sortField === 'full_name' && (
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead>Formation</TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('session_date')}
                >
                  <div className="flex items-center">
                    Session
                    {sortField === 'session_date' && (
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('payment_status')}
                >
                  <div className="flex items-center">
                    Statut
                    {sortField === 'payment_status' && (
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEnrollments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    Aucun résultat trouvé.
                    {(searchTerm || statusFilter !== 'all' || formationFilter !== 'all' || timeFilter !== 'all') && (
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
                filteredEnrollments.map((enrollment) => (
                  <TableRow 
                    key={enrollment.id} 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => window.location.href = `/admin/enrollments/${enrollment.id}`}
                  >
                    <TableCell className="whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        {new Date(enrollment.created_at).toLocaleDateString('fr-FR')}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatRelativeDate(enrollment.created_at)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{enrollment.full_name}</div>
                      <div className="text-xs text-gray-500">
                        {enrollment.city}, {enrollment.country}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <BookOpen className="h-4 w-4 mr-2 text-gray-400" />
                        {enrollment.formation_title || 'Formation inconnue'}
                      </div>
                      <div className="text-xs text-gray-500">
                        Option: {enrollment.payment_option === 'full' ? 'Paiement intégral' : 'Paiement en 2 fois'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-gray-400" />
                        {enrollment.session_date}
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={enrollment.payment_status} />
                      {enrollment.amount_paid > 0 && (
                        <div className="text-xs text-gray-500 mt-1">
                          {enrollment.amount_paid.toLocaleString('fr-FR')} FCFA payés
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.location.href = `/admin/enrollments/${enrollment.id}`;
                        }}
                      >
                        Voir détails
                      </Button>
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
              Affichage de {filteredEnrollments.length} sur {enrollments.length} inscriptions
            </p>
            <div className="flex items-center gap-2">
              <Button 
                onClick={resetFilters} 
                variant="ghost" 
                size="sm"
                className="hidden lg:flex items-center"
                disabled={!(searchTerm || statusFilter !== 'all' || formationFilter !== 'all' || timeFilter !== 'all')}
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

export default withAdminAuth(EnrollmentsPage);