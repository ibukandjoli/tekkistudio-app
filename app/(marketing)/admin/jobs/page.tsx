// app/admin/jobs/page.tsx
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
import { 
  Plus, 
  MoreVertical, 
  Pencil, 
  Trash2, 
  Eye, 
  Search,
  ArrowUpDown,
  AlertCircle,
  Loader2,
  Filter,
  RefreshCw,
  ToggleLeft,
  ToggleRight,
  Star,
  StarOff
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
import { Badge } from '@/app/components/ui/badge';
import { getJobOpenings, deleteJobOpening, toggleJobOpeningActive, toggleJobOpeningFeatured } from '@/app/lib/db/jobs';
import type { JobOpening, JobOpeningFilters } from '@/app/types/database';
import { formatRelativeDate } from '@/app/lib/utils/date-utils';

function JobsAdminPage() {
  const [jobs, setJobs] = useState<JobOpening[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<JobOpening | null>(null);
  const [updating, setUpdating] = useState(false);
  
  // Filtres
  const [filters, setFilters] = useState<JobOpeningFilters>({});
  const [showInactive, setShowInactive] = useState(false);
  
  // Tri
  const [sortField, setSortField] = useState<keyof JobOpening>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  useEffect(() => {
    fetchJobs();
  }, []);
  
  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const jobsData = await getJobOpenings();
      setJobs(jobsData);
      
    } catch (err) {
      console.error('Erreur lors du chargement des offres d\'emploi:', err);
      setError('Erreur lors du chargement des offres d\'emploi. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = (job: JobOpening) => {
    setJobToDelete(job);
    setDeleteDialogOpen(true);
  };
  
  const confirmDelete = async () => {
    if (!jobToDelete) return;
    
    try {
      setLoading(true);
      
      await deleteJobOpening(jobToDelete.id);
      
      // Mettre à jour la liste des emplois
      setJobs(jobs.filter(job => job.id !== jobToDelete.id));
      
      setDeleteDialogOpen(false);
      setJobToDelete(null);
      
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      setError('Erreur lors de la suppression. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleToggleActive = async (job: JobOpening) => {
    try {
      setUpdating(true);
      
      const updatedJob = await toggleJobOpeningActive(job.id, !job.is_active);
      
      // Mettre à jour la liste des emplois
      setJobs(jobs.map(j => j.id === job.id ? updatedJob : j));
      
    } catch (err) {
      console.error('Erreur lors du basculement de l\'état:', err);
      setError('Erreur lors du basculement de l\'état. Veuillez réessayer.');
    } finally {
      setUpdating(false);
    }
  };
  
  const handleToggleFeatured = async (job: JobOpening) => {
    try {
      setUpdating(true);
      
      const updatedJob = await toggleJobOpeningFeatured(job.id, !job.is_featured);
      
      // Mettre à jour la liste des emplois
      setJobs(jobs.map(j => j.id === job.id ? updatedJob : j));
      
    } catch (err) {
      console.error('Erreur lors du basculement de l\'état en vedette:', err);
      setError('Erreur lors du basculement de l\'état en vedette. Veuillez réessayer.');
    } finally {
      setUpdating(false);
    }
  };
  
  const handleSort = (field: keyof JobOpening) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  const filteredJobs = jobs.filter(job => {
    // Filtre par recherche
    if (searchTerm && !job.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !job.department.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Filtre par état actif/inactif
    if (!showInactive && !job.is_active) {
      return false;
    }
    
    return true;
  });
  
  // Trier les emplois
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    const valueA = a[sortField];
    const valueB = b[sortField];
    
    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return sortDirection === 'asc' 
        ? valueA.localeCompare(valueB) 
        : valueB.localeCompare(valueA);
    }
    
    if (typeof valueA === 'boolean' && typeof valueB === 'boolean') {
      return sortDirection === 'asc' 
        ? (valueA === valueB ? 0 : valueA ? 1 : -1)
        : (valueA === valueB ? 0 : valueA ? -1 : 1);
    }
    
    // Pour les dates
    if (sortField === 'created_at' || sortField === 'updated_at') {
      const dateA = new Date(a[sortField] as string).getTime();
      const dateB = new Date(b[sortField] as string).getTime();
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    }
    
    // Pour les champs normaux
    return sortDirection === 'asc' 
      ? (valueA < valueB ? -1 : 1)
      : (valueA < valueB ? 1 : -1);
  });
  
  if (loading && jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Loader2 className="h-12 w-12 animate-spin text-tekki-coral mb-4" />
        <p className="text-gray-500">Chargement des offres d'emploi...</p>
      </div>
    );
  }
  
  if (error && jobs.length === 0) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-1" />
          <div>
            <h3 className="font-medium text-red-800">Erreur</h3>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
        <Button onClick={fetchJobs} className="flex items-center">
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
          <h2 className="text-3xl font-bold text-tekki-blue">Offres d'emploi</h2>
          <p className="text-gray-500">Gérez les offres d'emploi de TEKKI Studio</p>
        </div>
        <Link href="/admin/jobs/add">
          <Button className="bg-tekki-coral hover:bg-tekki-coral/90">
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle offre
          </Button>
        </Link>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="flex-grow relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <Search className="h-4 w-4 text-gray-500" />
        </div>
        <Input
            placeholder="Rechercher par titre ou département..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md pl-10"
        />
       
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline"
            size="sm"
            onClick={() => setShowInactive(!showInactive)}
            className={`flex items-center ${showInactive ? 'bg-gray-100' : ''}`}
          >
            {showInactive ? (
              <ToggleRight className="h-4 w-4 mr-2 text-tekki-blue" />
            ) : (
              <ToggleLeft className="h-4 w-4 mr-2 text-gray-500" />
            )}
            Afficher inactifs
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchJobs}
            className="flex items-center"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
        </div>
      </div>

      {/* Tableau des offres d'emploi */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">
                <div 
                  className="flex items-center cursor-pointer"
                  onClick={() => handleSort('title')}
                >
                  Poste
                  {sortField === 'title' && (
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead>
                <div 
                  className="flex items-center cursor-pointer"
                  onClick={() => handleSort('department')}
                >
                  Département
                  {sortField === 'department' && (
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead>
                <div 
                  className="flex items-center cursor-pointer"
                  onClick={() => handleSort('location')}
                >
                  Localisation
                  {sortField === 'location' && (
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead>
                <div 
                  className="flex items-center cursor-pointer"
                  onClick={() => handleSort('created_at')}
                >
                  Publié le
                  {sortField === 'created_at' && (
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead>État</TableHead>
              <TableHead>En vedette</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedJobs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  {searchTerm ? (
                    <>
                      <p className="text-gray-500">Aucun résultat pour "{searchTerm}"</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSearchTerm('')}
                        className="mt-2"
                      >
                        Réinitialiser la recherche
                      </Button>
                    </>
                  ) : (
                    <p className="text-gray-500">
                      Aucune offre d'emploi trouvée. Créez votre première offre avec le bouton "Nouvelle offre".
                    </p>
                  )}
                </TableCell>
              </TableRow>
            ) : (
              sortedJobs.map((job) => (
                <TableRow key={job.id} className={!job.is_active ? 'bg-gray-50' : ''}>
                  <TableCell className="font-medium">
                    <Link 
                      href={`/admin/jobs/${job.id}/edit`}
                      className="hover:text-tekki-coral"
                    >
                      {job.title}
                    </Link>
                  </TableCell>
                  <TableCell>{job.department}</TableCell>
                  <TableCell>{job.location}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {new Date(job.created_at).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatRelativeDate(job.created_at)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <button 
                      onClick={() => handleToggleActive(job)}
                      disabled={updating}
                      className="focus:outline-none"
                    >
                      <Badge 
                        variant={job.is_active ? 'jobActive' : 'jobInactive'}
                        className="cursor-pointer"
                      >
                        {job.is_active ? 'Actif' : 'Inactif'}
                      </Badge>
                    </button>
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => handleToggleFeatured(job)}
                      disabled={updating}
                      className="focus:outline-none text-yellow-500 hover:text-yellow-600"
                    >
                      {job.is_featured ? (
                        <Star className="h-5 w-5 fill-yellow-500" />
                      ) : (
                        <StarOff className="h-5 w-5" />
                      )}
                    </button>
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
                          <Link href={`/careers/${job.slug}`} target="_blank">
                            <Eye className="h-4 w-4 mr-2" />
                            <span>Voir</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/jobs/${job.id}/edit`}>
                            <Pencil className="h-4 w-4 mr-2" />
                            <span>Modifier</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(job)}
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
              Cette action ne peut pas être annulée. Cela supprimera définitivement l'offre d'emploi
              {jobToDelete && ` "${jobToDelete.title}"`}.
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

export default withAdminAuth(JobsAdminPage);