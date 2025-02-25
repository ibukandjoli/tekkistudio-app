// app/admin/dashboard/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { 
  Users, 
  GraduationCap, 
  TrendingUp, 
  ShoppingBag, 
  Phone, 
  Mail, 
  Calendar 
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
// Import Button de shadcn
import { Button } from '../../components/ui/button';

interface DashboardStats {
  totalInterests: number;
  totalEnrollments: number;
  conversionRate: number;
  totalUsers: number;
  recentInterests: number;
  recentEnrollments: number;
}

interface BusinessInterest {
  id: string;
  business_id: string | null;
  full_name: string;
  email: string;
  phone: string;
  created_at: string;
  status: 'new' | 'contacted' | 'negotiating' | 'sold' | 'cancelled';
  business_name?: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalInterests: 0,
    totalEnrollments: 0,
    conversionRate: 0,
    totalUsers: 0,
    recentInterests: 0,
    recentEnrollments: 0
  });
  const [recentLeads, setRecentLeads] = useState<BusinessInterest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      console.log("Dashboard - Chargement des données...");
      
      // 1. Récupération du nombre total d'intérêts pour les business
      const interestsResponse = await supabase
        .from('business_interests')
        .select('id', { count: 'exact' });
      
      // 2. Récupération du nombre total d'inscriptions aux formations
      const enrollmentsResponse = await supabase
        .from('formation_enrollments')
        .select('id', { count: 'exact' });
      
      // 3. Récupération des intérêts récents (30 derniers jours)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const recentInterestsResponse = await supabase
        .from('business_interests')
        .select('id', { count: 'exact' })
        .gte('created_at', thirtyDaysAgo.toISOString());
      
      // 4. Récupération des inscriptions récentes (30 derniers jours)
      const recentEnrollmentsResponse = await supabase
        .from('formation_enrollments')
        .select('id', { count: 'exact' })
        .gte('created_at', thirtyDaysAgo.toISOString());
      
      // 5. Récupération des leads récents
      const { data: leadsData, error: leadsError } = await supabase
        .from('business_interests')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (leadsError) {
        console.error('Erreur lors de la récupération des leads:', leadsError);
        return;
      }

      // Debug log
      console.log("Leads récupérés:", leadsData);
      
      // Créer un mapping pour les business (si disponible)
      const businessMap: Record<string, string> = {};

      // Ne récupérer les business que si des business_id ne sont pas null
      const businessIds = leadsData
        ?.filter(lead => lead.business_id !== null)
        .map(lead => lead.business_id) || [];

      if (businessIds.length > 0) {
        const { data: businessesData } = await supabase
          .from('businesses')
          .select('id, name')
          .in('id', businessIds);
          
        if (businessesData) {
          businessesData.forEach(business => {
            businessMap[business.id] = business.name;
          });
        }
      }
      
      // Calcul des statistiques
      const totalInterests = interestsResponse.count || 0;
      const totalEnrollments = enrollmentsResponse.count || 0;
      const recentInterests = recentInterestsResponse.count || 0;
      const recentEnrollments = recentEnrollmentsResponse.count || 0;
      
      // Calcul du taux de conversion (leads récents / total des leads)
      const totalVisits = 1500; // Valeur fictive - à remplacer par des données réelles de Google Analytics
      const totalLeads = totalInterests + totalEnrollments;
      const conversionRate = totalVisits > 0 ? (totalLeads / totalVisits) * 100 : 0;
      
      // Préparation des leads pour l'affichage
      const formattedLeads = leadsData?.map(lead => ({
        id: lead.id,
        business_id: lead.business_id,
        full_name: lead.full_name,
        email: lead.email,
        phone: lead.phone,
        created_at: lead.created_at,
        status: lead.status || 'new',  // Valeur par défaut si null
        business_name: lead.business_id ? (businessMap[lead.business_id] || 'Business inconnu') : 'Non spécifié'
      })) || [];
      
      setStats({
        totalInterests,
        totalEnrollments,
        conversionRate: parseFloat(conversionRate.toFixed(1)),
        totalUsers: totalInterests + totalEnrollments,
        recentInterests,
        recentEnrollments
      });
      
      setRecentLeads(formattedLeads);
      console.log("Dashboard - Données chargées avec succès");
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  // Couleur du badge selon le statut du lead
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'negotiating': return 'bg-purple-100 text-purple-800';
      case 'sold': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Traduction du statut
  const translateStatus = (status: string) => {
    switch (status) {
      case 'new': return 'Nouveau';
      case 'contacted': return 'Contacté';
      case 'negotiating': return 'En négociation';
      case 'sold': return 'Vendu';
      case 'cancelled': return 'Annulé';
      default: return status;
    }
  };

  // Formatage de la date relative
  const formatRelativeDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return "Aujourd'hui";
    } else if (diffDays === 1) {
      return "Hier";
    } else if (diffDays < 7) {
      return `Il y a ${diffDays} jours`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `Il y a ${weeks} semaine${weeks > 1 ? 's' : ''}`;
    } else {
      const months = Math.floor(diffDays / 30);
      return `Il y a ${months} mois`;
    }
  };

  // Mise à jour du statut d'un lead
  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('business_interests')
        .update({ status: newStatus })
        .eq('id', leadId);
      
      if (error) throw error;
      
      // Mettre à jour le state local
      setRecentLeads(prevLeads =>
        prevLeads.map(lead =>
          lead.id === leadId ? { ...lead, status: newStatus as any } : lead
        )
      );
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
    }
  };

  // Afficher un loader pendant le chargement des données
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-96">
        <div className="animate-spin h-10 w-10 border-4 border-[#ff7f50] border-t-transparent rounded-full mb-4"></div>
        <p className="text-gray-600">Chargement des données du tableau de bord...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-[#0f4c81]">Tableau de bord</h2>
        <p className="text-gray-500">Vue d'ensemble de l'activité</p>
      </div>

      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Intérêts Business</CardTitle>
            <ShoppingBag className="h-4 w-4 text-[#ff7f50]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalInterests}</div>
            <p className="text-xs text-gray-500">
              +{stats.recentInterests} ces 30 derniers jours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inscriptions Formations</CardTitle>
            <GraduationCap className="h-4 w-4 text-[#ff7f50]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEnrollments}</div>
            <p className="text-xs text-gray-500">
              +{stats.recentEnrollments} ces 30 derniers jours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de Conversion</CardTitle>
            <TrendingUp className="h-4 w-4 text-[#ff7f50]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.conversionRate}%</div>
            <p className="text-xs text-gray-500">
              Visites converties en leads
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Utilisateurs</CardTitle>
            <Users className="h-4 w-4 text-[#ff7f50]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-gray-500">
              Leads et inscrits combinés
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Leads récents */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-[#0f4c81]">Leads récents pour les business</h3>
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Business</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentLeads.length > 0 ? (
                recentLeads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        {new Date(lead.created_at).toLocaleDateString('fr-FR')}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatRelativeDate(lead.created_at)}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{lead.business_name}</TableCell>
                    <TableCell>{lead.full_name}</TableCell>
                    <TableCell>
                      <div className="flex flex-col text-sm">
                        <div className="flex items-center">
                          <Mail className="h-3 w-3 mr-1 text-gray-400" />
                          <a href={`mailto:${lead.email}`} className="hover:text-[#0f4c81]">
                            {lead.email}
                          </a>
                        </div>
                        <div className="flex items-center mt-1">
                          <Phone className="h-3 w-3 mr-1 text-gray-400" />
                          <a href={`tel:${lead.phone}`} className="hover:text-[#0f4c81]">
                            {lead.phone}
                          </a>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                        {translateStatus(lead.status)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {lead.status === 'new' && (
                        <Button
                          onClick={() => updateLeadStatus(lead.id, 'contacted')}
                          size="sm"
                          className="bg-[#0f4c81] text-white hover:bg-[#0d3c67] mr-1"
                        >
                          Marquer contacté
                        </Button>
                      )}
                      {lead.status === 'contacted' && (
                        <Button
                          onClick={() => updateLeadStatus(lead.id, 'negotiating')}
                          size="sm" 
                          className="bg-purple-600 text-white hover:bg-purple-700 mr-1"
                        >
                          En négociation
                        </Button>
                      )}
                      {lead.status === 'negotiating' && (
                        <Button
                          onClick={() => updateLeadStatus(lead.id, 'sold')}
                          size="sm"
                          className="bg-green-600 text-white hover:bg-green-700 mr-1"
                        >
                          Marquer vendu
                        </Button>
                      )}
                      <Button
                        onClick={() => window.location.href = `/admin/leads/${lead.id}`}
                        size="sm"
                        variant="outline"
                        >
                        Détails
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                    Aucun lead récent
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}