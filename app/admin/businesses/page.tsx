// app/admin/businesses/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { withAdminAuth } from '../../lib/withAdminAuth';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { 
  Plus, 
  MoreVertical, 
  Pencil, 
  Trash2, 
  Eye, 
  Search,
  Filter,
  ArrowUpDown,
  AlertCircle,
  Loader2,
  DollarSign,
  Tag,
  Clock,
  CalendarDays
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
} from "../../components/ui/alert-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip";
import { Badge } from "../../components/ui/badge";
import { supabase } from '../../lib/supabase';
import type { Business } from '../../types/database';
import { formatPrice } from '../../lib/utils/price-utils';

function BusinessesPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'reserved' | 'sold'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'physical' | 'digital'>('all');
  const [sortBy, setSortBy] = useState<{ field: keyof Business; direction: 'asc' | 'desc' }>({
    field: 'created_at',
    direction: 'desc'
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [businessToDelete, setBusinessToDelete] = useState<Business | null>(null);
  const [statsCounts, setStatsCounts] = useState({
    total: 0,
    available: 0,
    reserved: 0,
    sold: 0,
    digital: 0,
    physical: 0
  });

  useEffect(() => {
    fetchBusinesses();
  }, [statusFilter, typeFilter, sortBy]);

  const fetchBusinesses = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('businesses')
        .select('*');

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }
      
      if (typeFilter !== 'all') {
        query = query.eq('type', typeFilter);
      }

      const { data, error } = await query
        .order(sortBy.field, { ascending: sortBy.direction === 'asc' });

      if (error) throw error;
      
      // Mettre à jour les stats
      if (data) {
        setBusinesses(data);
        
        // Calculer les statistiques
        const counts = {
          total: data.length,
          available: data.filter(b => b.status === 'available').length,
          reserved: data.filter(b => b.status === 'reserved').length,
          sold: data.filter(b => b.status === 'sold').length,
          digital: data.filter(b => b.type === 'digital').length,
          physical: data.filter(b => b.type === 'physical').length
        };
        
        setStatsCounts(counts);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des business:', error);
      setError('Erreur lors du chargement des données. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (business: Business) => {
    setBusinessToDelete(business);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!businessToDelete) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('businesses')
        .delete()
        .eq('id', businessToDelete.id);

      if (error) throw error;
      
      setBusinesses(businesses.filter(b => b.id !== businessToDelete.id));
      setDeleteDialogOpen(false);
      setBusinessToDelete(null);
      
      // Mettre à jour les stats après suppression
      fetchBusinesses();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      setError('Erreur lors de la suppression. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field: keyof Business) => {
    setSortBy(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getStatusBadgeClass = (status: string) => {
    switch(status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'reserved':
        return 'bg-amber-100 text-amber-800';
      case 'sold':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStatusText = (status: string) => {
    switch(status) {
      case 'available':
        return 'Disponible';
      case 'reserved':
        return 'Réservé';
      case 'sold':
        return 'Vendu';
      default:
        return status;
    }
  };

  const getTypeBadgeClass = (type: string) => {
    return type === 'digital' 
      ? 'bg-tekki-orange/10 text-tekki-orange' 
      : 'bg-tekki-blue/10 text-tekki-blue';
  };

  const getTypeText = (type: string) => {
    return type === 'digital' ? 'Digital' : 'Physique';
  };

  const filteredBusinesses = businesses.filter(business => 
    (business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    business.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    business.slug.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <p className="text-lg text-red-600">{error}</p>
        <Button 
          onClick={fetchBusinesses} 
          variant="outline" 
          className="mt-4"
        >
          Réessayer
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-tekki-blue">Business en vente</h2>
          <p className="text-gray-500">Gérez vos business disponibles à la vente</p>
        </div>
        <Link href="/admin/businesses/new/edit">
          <Button className="bg-tekki-orange hover:bg-tekki-orange/90">
            <Plus className="w-4 h-4 mr-2" />
            Nouveau Business
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Business</CardTitle>
            <Tag className="h-4 w-4 text-tekki-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsCounts.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Disponibles</CardTitle>
            <Clock className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsCounts.available}</div>
            <p className="text-xs text-gray-500 mt-1">
              {statsCounts.reserved > 0 && `${statsCounts.reserved} réservé(s)`}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Type Digital</CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-tekki-orange">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
              <line x1="8" y1="21" x2="16" y2="21"></line>
              <line x1="12" y1="17" x2="12" y2="21"></line>
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsCounts.digital}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Type Physique</CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-tekki-blue">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
              <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsCounts.physical}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres et recherche */}
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1">
          <Label htmlFor="search" className="text-sm font-medium">
            Rechercher
          </Label>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              id="search"
              placeholder="Rechercher par nom, catégorie ou slug..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        <div className="w-full md:w-48">
          <Label htmlFor="status_filter" className="text-sm font-medium">
            Statut
          </Label>
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as any)}
          >
            <SelectTrigger id="status_filter">
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="available">Disponible</SelectItem>
              <SelectItem value="reserved">Réservé</SelectItem>
              <SelectItem value="sold">Vendu</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-full md:w-48">
          <Label htmlFor="type_filter" className="text-sm font-medium">
            Type
          </Label>
          <Select
            value={typeFilter}
            onValueChange={(value) => setTypeFilter(value as any)}
          >
            <SelectTrigger id="type_filter">
              <SelectValue placeholder="Filtrer par type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              <SelectItem value="digital">Digital</SelectItem>
              <SelectItem value="physical">Physique</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-tekki-orange" />
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('name')}>
                    <div className="flex items-center">
                      Nom
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('category')}>
                    <div className="flex items-center">
                      Catégorie
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('type')}>
                    <div className="flex items-center">
                      Type
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('price')}>
                    <div className="flex items-center">
                      Prix
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('status')}>
                    <div className="flex items-center">
                      Statut
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('created_at')}>
                    <div className="flex items-center">
                      Créé le
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBusinesses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      Aucun business trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBusinesses.map((business) => (
                    <TableRow key={business.id}>
                      <TableCell className="font-medium">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="max-w-[200px] truncate">
                                {business.name}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{business.name}</p>
                              <p className="text-xs text-gray-500">Slug: {business.slug}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell>{business.category}</TableCell>
                      <TableCell>
                        <Badge className={getTypeBadgeClass(business.type)}>
                          {getTypeText(business.type)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 text-gray-500 mr-1" />
                          {formatPrice(business.price)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeClass(business.status)}>
                          {getStatusText(business.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <CalendarDays className="h-4 w-4 text-gray-500 mr-1" />
                          {new Date(business.created_at).toLocaleDateString('fr-FR')}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => window.open(`/business/${business.slug}`, '_blank')}
                              className="cursor-pointer"
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Voir
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => window.location.href = `/admin/businesses/${business.id}/edit`}
                              className="cursor-pointer"
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(business)}
                              className="cursor-pointer text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Cela supprimera définitivement le business
              {businessToDelete && ` "${businessToDelete.name}"`} et toutes les données associées.
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

export default withAdminAuth(BusinessesPage);