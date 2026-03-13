// app/admin/applications/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { withAdminAuth } from '@/app/lib/withAdminAuth';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Badge } from '@/app/components/ui/badge';
import { 
  MoreVertical, 
  Eye, 
  Search,
  ArrowUpDown,
  AlertCircle,
  Loader2,
  RefreshCw,
  Mail,
  Phone,
  Trash2,
  Filter,
  Download,
  FileText,
  Calendar
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/app/components/ui/alert-dialog";
import { getJobApplications, deleteJobApplication, updateJobApplicationStatus } from '@/app/lib/db/jobs';
import type { JobApplication, JobApplicationFilters } from '@/app/types/database';
import { formatRelativeDate } from '@/app/lib/utils/date-utils';

function ApplicationsAdminPage() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [applicationToDelete, setApplicationToDelete] = useState<JobApplication | null>(null);
  const [updating, setUpdating] = useState(false);
  
  // Filtres
  const [filters, setFilters] = useState<JobApplicationFilters>({});
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Tri
  const [sortField, setSortField] = useState<keyof JobApplication>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Statistiques
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    reviewing: 0,
    interview: 0,
    hired: 0,
    rejected: 0
  });
  
  useEffect(() => {
    fetchApplications();
  }, []);
  
  useEffect(() => {
    // Mettre à jour les filtres lorsque le statut change
    if (statusFilter !== 'all') {
      setFilters(prev => ({ ...prev, status: statusFilter }));
    } else {
      // Supprimer le filtre de statut si "Tous" est sélectionné
      const { status, ...restFilters } = filters;
      setFilters(restFilters);
    }
  }, [statusFilter]);
  
  useEffect(() => {
    // Calculer les statistiques
    if (applications.length > 0) {
      const stats = {
        total: applications.length,
        new: applications.filter(app => app.status === 'new').length,
        reviewing: applications.filter(app => app.status === 'reviewing').length,
        interview: applications.filter(app => app.status === 'interview').length,
        hired: applications.filter(app => app.status === 'hired').length,
        rejected: applications.filter(app => app.status === 'rejected').length
      };
      setStats(stats);
    }
  }, [applications]);
  
  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const applicationsData = await getJobApplications(filters);
      setApplications(applicationsData);
      
    } catch (err) {
      console.error('Erreur lors du chargement des candidatures:', err);
      setError('Erreur lors du chargement des candidatures. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = (application: JobApplication) => {
    setApplicationToDelete(application);
    setDeleteDialogOpen(true);
  };
  
  const confirmDelete = async () => {
    if (!applicationToDelete) return;
    
    try {
      setLoading(true);
      
      await deleteJobApplication(applicationToDelete.id);
      
      // Mettre à jour la liste des candidatures
      setApplications(applications.filter(app => app.id !== applicationToDelete.id));
      
      setDeleteDialogOpen(false);
      setApplicationToDelete(null);
      
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      setError('Erreur lors de la suppression. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleStatusChange = async (applicationId: string, status: JobApplication['status']) => {
    try {
      setUpdating(true);
      
      await updateJobApplicationStatus(applicationId, status);
      
      // Mettre à jour la liste des candidatures
      setApplications(applications.map(app => 
        app.id === applicationId ? { ...app, status } : app
      ));
      
    } catch (err) {
      console.error('Erreur lors de la mise à jour du statut:', err);
      setError('Erreur lors de la mise à jour du statut. Veuillez réessayer.');
    } finally {
      setUpdating(false);
    }
  };
  
  const handleSort = (field: keyof JobApplication) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  const getStatusBadgeVariant = (status: JobApplication['status']) => {
    switch (status) {
      case 'new': return 'candidateNew';
      case 'reviewing': return 'candidateReviewing';
      case 'interview': return 'candidateInterview';
      case 'hired': return 'candidateHired';
      case 'rejected': return 'candidateRejected';
      default: return 'default';
    }
  };
  
  const getStatusDisplayName = (status: JobApplication['status']) => {
    switch (status) {
      case 'new': return 'Nouveau';
      case 'reviewing': return 'En revue';
      case 'interview': return 'Entretien';
      case 'hired': return 'Embauché';
      case 'rejected': return 'Refusé';
      default: return status;
    }
  };
  
  const filteredApplications = applications.filter(application => {
    // Filtre par recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        application.full_name.toLowerCase().includes(term) ||
        application.email.toLowerCase().includes(term) ||
        application.phone.includes(term) ||
        (application.job_title && application.job_title.toLowerCase().includes(term))
      );
    }
    
    return true;
  });
  
  // Trier les candidatures
  const sortedApplications = [...filteredApplications].sort((a, b) => {
    if (sortField === 'created_at') {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    }
    
    const valueA = a[sortField];
    const valueB = b[sortField];
    
    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return sortDirection === 'asc' 
        ? valueA.localeCompare(valueB) 
        : valueB.localeCompare(valueA);
    }
    
    return 0;
  });
  
  // Exporter les candidatures au format CSV
  const exportToCSV = () => {
    // Créer l'en-tête du CSV
    const headers = [
      'Nom', 'Email', 'Téléphone', 'Localisation', 
      'Poste', 'Statut', 'Date de candidature'
    ];
    
    // Créer les lignes de données
    const rows = sortedApplications.map(app => [
      app.full_name,
      app.email,
      app.phone,
      app.location,
      app.job_title || 'Candidature spontanée',
      getStatusDisplayName(app.status),
      new Date(app.created_at).toLocaleDateString('fr-FR')
    ]);
    
    // Ajouter l'en-tête
    rows.unshift(headers);
    
    // Convertir en CSV
    const csvContent = rows.map(row => row.map(cell => {
      // Échapper les caractères spéciaux et entourer de guillemets si contient une virgule
      if (cell.includes(',') || cell.includes('"') || cell.includes('\n')) {
        return `"${cell.replace(/"/g, '""')}"`;
      }
      return cell;
    }).join(',')).join('\n');
    
    // Créer un blob et télécharger
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `candidatures_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  if (loading && applications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Loader2 className="h-12 w-12 animate-spin text-tekki-coral mb-4" />
        <p className="text-gray-500">Chargement des candidatures...</p>
      </div>
    );
  }
  
  if (error && applications.length === 0) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-1" />
          <div>
            <h3 className="font-medium text-red-800">Erreur</h3>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
        <Button onClick={fetchApplications} className="flex items-center">
          <RefreshCw className="h-4 w-4 mr-2" />
          Réessayer
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-tekki-blue">Candidatures</h2>
          <p className="text-gray-500">Gérez les candidatures aux offres d'emploi</p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex items-center"
            onClick={fetchApplications}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
          
          <Button
            variant="outline"
            className="flex items-center"
            onClick={exportToCSV}
          >
            <Download className="h-4 w-4 mr-2" />
            Exporter CSV
          </Button>
        </div>
      </div>
      
      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-xl border shadow-sm">
          <div className="text-sm text-gray-500 mb-1">Total</div>
          <div className="text-2xl font-bold text-tekki-blue">{stats.total}</div>
        </div>
        
        <div className="bg-white p-4 rounded-xl border shadow-sm">
          <div className="text-sm text-gray-500 mb-1">Nouvelles</div>
          <div className="text-2xl font-bold text-blue-600">{stats.new}</div>
        </div>
        
        <div className="bg-white p-4 rounded-xl border shadow-sm">
          <div className="text-sm text-gray-500 mb-1">En revue</div>
          <div className="text-2xl font-bold text-yellow-600">{stats.reviewing}</div>
        </div>
        
        <div className="bg-white p-4 rounded-xl border shadow-sm">
          <div className="text-sm text-gray-500 mb-1">Entretien</div>
          <div className="text-2xl font-bold text-purple-600">{stats.interview}</div>
        </div>
        
        <div className="bg-white p-4 rounded-xl border shadow-sm">
          <div className="text-sm text-gray-500 mb-1">Embauchés</div>
          <div className="text-2xl font-bold text-green-600">{stats.hired}</div>
        </div>
        
        <div className="bg-white p-4 rounded-xl border shadow-sm">
          <div className="text-sm text-gray-500 mb-1">Refusés</div>
          <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
        </div>
      </div>
      
      {/* Filtres */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-grow">
          <Input
            placeholder="Rechercher par nom, email ou téléphone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>
        
        <div className="flex gap-2 items-center">
          <div className="flex items-center">
            <Filter className="h-4 w-4 text-gray-500 mr-2" />
            <span className="text-sm text-gray-500 mr-2">Statut:</span>
          </div>
          
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tous les statuts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="new">Nouveaux</SelectItem>
              <SelectItem value="reviewing">En revue</SelectItem>
              <SelectItem value="interview">Entretien</SelectItem>
              <SelectItem value="hired">Embauchés</SelectItem>
              <SelectItem value="rejected">Refusés</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Tableau des candidatures */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">
                <div 
                  className="flex items-center cursor-pointer"
                  onClick={() => handleSort('full_name')}
                >
                  Candidat
                  {sortField === 'full_name' && (
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>
                <div 
                  className="flex items-center cursor-pointer"
                  onClick={() => handleSort('job_title')}
                >
                  Poste
                  {sortField === 'job_title' && (
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead>
                <div 
                  className="flex items-center cursor-pointer"
                  onClick={() => handleSort('created_at')}
                >
                  Date
                  {sortField === 'created_at' && (
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedApplications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  {searchTerm || statusFilter !== 'all' ? (
                    <>
                      <p className="text-gray-500">Aucun résultat ne correspond à vos critères</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSearchTerm('');
                          setStatusFilter('all');
                        }}
                        className="mt-2"
                      >
                        Réinitialiser les filtres
                      </Button>
                    </>
                  ) : (
                    <p className="text-gray-500">
                      Aucune candidature n'a encore été reçue.
                    </p>
                  )}
                </TableCell>
              </TableRow>
            ) : (
              sortedApplications.map((application) => (
                <TableRow key={application.id} className="group">
                  <TableCell className="font-medium">
                    <Link 
                      href={`/admin/applications/${application.id}`}
                      className="hover:text-tekki-coral"
                    >
                      {application.full_name}
                    </Link>
                    <div className="text-xs text-gray-500">
                      {application.location}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm text-gray-600 mb-1">
                      <Mail className="h-4 w-4 mr-2 text-gray-400" />
                      <a href={`mailto:${application.email}`} className="hover:text-tekki-coral">
                        {application.email}
                      </a>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="h-4 w-4 mr-2 text-gray-400" />
                      <a href={`tel:${application.phone}`} className="hover:text-tekki-coral">
                        {application.phone}
                      </a>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="line-clamp-1">
                      {application.job_title || 'Candidature spontanée'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      <div>
                        <div className="text-sm">
                          {new Date(application.created_at).toLocaleDateString('fr-FR')}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatRelativeDate(application.created_at)}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={application.status}
                      onValueChange={(value) => handleStatusChange(application.id, value as JobApplication['status'])}
                      disabled={updating}
                    >
                      <SelectTrigger className="w-[130px]">
                        <SelectValue>
                          <div className="flex items-center">
                            <Badge variant={getStatusBadgeVariant(application.status)}>
                              {getStatusDisplayName(application.status)}
                            </Badge>
                          </div>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">
                          <Badge variant="candidateNew">Nouveau</Badge>
                        </SelectItem>
                        <SelectItem value="reviewing">
                          <Badge variant="candidateReviewing">En revue</Badge>
                        </SelectItem>
                        <SelectItem value="interview">
                          <Badge variant="candidateInterview">Entretien</Badge>
                        </SelectItem>
                        <SelectItem value="hired">
                          <Badge variant="candidateHired">Embauché</Badge>
                        </SelectItem>
                        <SelectItem value="rejected">
                          <Badge variant="candidateRejected">Refusé</Badge>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Menu</span>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/applications/${application.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            <span>Voir détails</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <a
                            href={`mailto:${application.email}`}
                            className="flex items-center"
                          >
                            <Mail className="h-4 w-4 mr-2" />
                            <span>Envoyer un email</span>
                          </a>
                        </DropdownMenuItem>
                        {application.resume_url && (
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/admin/resumes/${application.id}`}
                              className="flex items-center"
                            >
                              <FileText className="h-4 w-4 mr-2" />
                              <span>Voir le CV</span>
                            </Link>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => handleDelete(application)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          <span>Supprimer</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Dialog de confirmation de suppression */}
      <AlertDialog 
        open={deleteDialogOpen} 
        onOpenChange={setDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Cela supprimera définitivement la candidature
              {applicationToDelete && ` de ${applicationToDelete.full_name}`}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default withAdminAuth(ApplicationsAdminPage);