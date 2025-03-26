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
  Calendar,
  DollarSign,
  Eye,
  BarChart2,
  ArrowUp,
  ArrowDown,
  Clock,
  PieChart,
  LineChart,
  ArrowRight
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Button } from '../../components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface DashboardStats {
  totalInterests: number;
  totalEnrollments: number;
  conversionRate: number;
  totalUsers: number;
  recentInterests: number;
  recentEnrollments: number;
  totalRevenue: number;
  pendingRevenue: number;
  totalVisits: number;
  averageConversionTime: number;
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
  payment_option: string;
}

// Données de tendance pour le graphique
const salesTrend = [
  { month: 'Jan', value: 450000 },
  { month: 'Fév', value: 520000 },
  { month: 'Mar', value: 610000 },
  { month: 'Avr', value: 580000 },
  { month: 'Mai', value: 730000 },
  { month: 'Juin', value: 850000 },
];

// Fonction utilitaire pour formater les prix en FCFA
const formatPrice = (amount: number) => {
  return amount.toLocaleString('fr-FR') + ' FCFA';
};

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalInterests: 0,
    totalEnrollments: 0,
    conversionRate: 0,
    totalUsers: 0,
    recentInterests: 0,
    recentEnrollments: 0,
    totalRevenue: 0,
    pendingRevenue: 0,
    totalVisits: 0,
    averageConversionTime: 0
  });
  const [recentLeads, setRecentLeads] = useState<BusinessInterest[]>([]);
  const [loading, setLoading] = useState(true);
  const [businessPerformance, setBusinessPerformance] = useState<{name: string, sales: number, conversion: number}[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // 1. Récupération du nombre total d'intérêts pour les business
      const interestsResponse = await supabase
        .from('business_interests')
        .select('id, status, payment_option, business_id', { count: 'exact' });
      
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
        .limit(6);
      
      if (leadsError) {
        console.error('Erreur lors de la récupération des leads:', leadsError);
        return;
      }
      
      // Créer un mapping pour les business
      const businessMap: Record<string, string> = {};
      const businessIds = leadsData
        ?.filter(lead => lead.business_id !== null)
        .map(lead => lead.business_id) || [];

      if (businessIds.length > 0) {
        const { data: businessesData } = await supabase
          .from('businesses')
          .select('id, name, price')
          .in('id', businessIds);
          
        if (businessesData) {
          businessesData.forEach(business => {
            businessMap[business.id] = business.name;
          });
          
          // Calculer les performances par business
          const performances = businessesData.map(business => {
            const totalLeads = interestsResponse.data?.filter(lead => lead.business_id === business.id).length || 0;
            const soldLeads = interestsResponse.data?.filter(lead => 
              lead.business_id === business.id && lead.status === 'sold'
            ).length || 0;
            
            return {
              name: business.name,
              sales: soldLeads * business.price,
              conversion: totalLeads > 0 ? (soldLeads / totalLeads) * 100 : 0
            };
          });
          
          setBusinessPerformance(performances.sort((a, b) => b.sales - a.sales).slice(0, 5));
        }
      }
      
      // Calculer le chiffre d'affaires total et à recevoir
      let totalRevenue = 0;
      let pendingRevenue = 0;
      
      // On compte les ventes effectuées (status === 'sold')
      const soldInterests = interestsResponse.data?.filter(interest => interest.status === 'sold') || [];
      // Et les ventes en cours de négociation
      const negotiatingInterests = interestsResponse.data?.filter(interest => interest.status === 'negotiating') || [];
      
      // Récupérer tous les business pour calculer le chiffre d'affaires
      const { data: allBusinesses } = await supabase
        .from('businesses')
        .select('id, price');
        
      if (allBusinesses) {
        const businessPrices: Record<string, number> = {};
        allBusinesses.forEach(business => {
          businessPrices[business.id] = business.price;
        });
        
        soldInterests.forEach(interest => {
          if (interest.business_id && businessPrices[interest.business_id]) {
            // Calculer le prix en fonction de l'option de paiement
            const price = businessPrices[interest.business_id];
            
            // On pourrait adapter en fonction du mode de paiement choisi
            if (interest.payment_option === 'full') {
              // -5% pour paiement intégral
              totalRevenue += price * 0.95;
            } else {
              totalRevenue += price;
            }
          }
        });
        
        negotiatingInterests.forEach(interest => {
          if (interest.business_id && businessPrices[interest.business_id]) {
            const price = businessPrices[interest.business_id];
            pendingRevenue += price;
          }
        });
      }
      
      // Calculer le temps moyen de conversion (en jours)
      // Supposons que nous avons des dates de mise à jour pour chaque changement de statut
      // Ici nous utilisons une valeur simulée de 14 jours
      const averageConversionTime = 14;
      
      // Visites totales (simulées pour l'exemple)
      const totalVisits = 5840;
      
      // Préparation des leads pour l'affichage
      const formattedLeads = leadsData?.map(lead => ({
        id: lead.id,
        business_id: lead.business_id,
        full_name: lead.full_name,
        email: lead.email,
        phone: lead.phone,
        created_at: lead.created_at,
        status: lead.status || 'new',
        payment_option: lead.payment_option,
        business_name: lead.business_id ? (businessMap[lead.business_id] || 'Business inconnu') : 'Non spécifié'
      })) || [];
      
      // Mise à jour des statistiques
      const totalInterests = interestsResponse.count || 0;
      const totalEnrollments = enrollmentsResponse.count || 0;
      const recentInterests = recentInterestsResponse.count || 0;
      const recentEnrollments = recentEnrollmentsResponse.count || 0;
      
      // Calcul du taux de conversion (leads / visites)
      const conversionRate = totalVisits > 0 ? ((totalInterests + totalEnrollments) / totalVisits) * 100 : 0;
      
      setStats({
        totalInterests,
        totalEnrollments,
        conversionRate: parseFloat(conversionRate.toFixed(1)),
        totalUsers: totalInterests + totalEnrollments,
        recentInterests,
        recentEnrollments,
        totalRevenue,
        pendingRevenue,
        totalVisits,
        averageConversionTime
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

      {/* Statistiques financières */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chiffre d'affaires total</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(stats.totalRevenue)}</div>
            <div className="flex items-center mt-1 text-xs text-green-600">
              <ArrowUp className="h-3 w-3 mr-1" />
              <span>+15% par rapport au mois dernier</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CA en négociation</CardTitle>
            <DollarSign className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(stats.pendingRevenue)}</div>
            <p className="text-xs text-gray-500">
              Potentiel à venir
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visites Totales</CardTitle>
            <Eye className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVisits.toLocaleString()}</div>
            <div className="flex items-center mt-1 text-xs text-blue-600">
              <ArrowUp className="h-3 w-3 mr-1" />
              <span>+8% par rapport au mois dernier</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taux de Conversion</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.conversionRate}%</div>
            <div className="flex items-center mt-1 text-xs text-gray-500">
              <Clock className="h-3 w-3 mr-1" />
              <span>Durée moyenne: {stats.averageConversionTime} jours</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphique de tendance */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Évolution des ventes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[220px] w-full relative">
              {/* Simulation d'un graphique en barres */}
              <div className="absolute inset-0 flex items-end justify-between px-4">
                {salesTrend.map((month, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div 
                      className="w-12 bg-gradient-to-t from-[#0f4c81] to-[#3b82f6] rounded-t" 
                      style={{ height: `${(month.value / 850000) * 160}px` }}
                    ></div>
                    <div className="text-xs mt-2 text-gray-600">{month.month}</div>
                  </div>
                ))}
              </div>
              
              {/* Lignes horizontales de référence */}
              <div className="absolute inset-0 flex flex-col justify-between px-4 pb-8">
                {[0, 1, 2, 3].map((_, index) => (
                  <div key={index} className="w-full h-px bg-gray-200"></div>
                ))}
              </div>
              
              {/* Informations sur les valeurs */}
              <div className="absolute top-0 right-4 flex flex-col items-end space-y-1">
                <div className="text-xs text-gray-500">Max: {formatPrice(850000)}</div>
                <div className="text-xs text-gray-500">Min: {formatPrice(450000)}</div>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Link href="/admin/analytics">
                <Button variant="outline" className="text-sm">
                  Voir tous les rapports
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top 5 Business</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {businessPerformance.map((business, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium mr-3">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{business.name}</div>
                    <div className="flex justify-between items-center">
                      <div className="w-full max-w-[180px] bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mr-2">
                        <div 
                          className="bg-[#ff7f50] h-2.5 rounded-full" 
                          style={{ width: `${(business.sales / businessPerformance[0].sales) * 100}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 whitespace-nowrap">{formatPrice(business.sales)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <Link href="/admin/businesses">
                <Button variant="outline" className="text-sm">
                  Gérer les business
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Statistiques secondaires */}
      <div className="grid gap-4 md:grid-cols-4">
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
            <CardTitle className="text-sm font-medium">Leads en négociation</CardTitle>
            <TrendingUp className="h-4 w-4 text-[#ff7f50]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {recentLeads.filter(lead => lead.status === 'negotiating').length}
            </div>
            <p className="text-xs text-gray-500">
              Sur {recentLeads.length} leads récents
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
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-[#0f4c81]">Leads récents pour les business</h3>
          <Link href="/admin/leads">
            <Button variant="outline" className="text-sm">
              Voir tous les leads
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Business</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentLeads.length > 0 ? (
                recentLeads.map((lead) => (
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
                    <TableCell className="font-medium">{lead.business_name}</TableCell>
                    <TableCell>{lead.full_name}</TableCell>
                    <TableCell>
                      <div className="flex flex-col text-sm">
                        <div className="flex items-center">
                          <Mail className="h-3 w-3 mr-1 text-gray-400" />
                          <a href={`mailto:${lead.email}`} className="hover:text-[#0f4c81]" onClick={(e) => e.stopPropagation()}>
                            {lead.email}
                          </a>
                        </div>
                        <div className="flex items-center mt-1">
                          <Phone className="h-3 w-3 mr-1 text-gray-400" />
                          <a href={`tel:${lead.phone}`} className="hover:text-[#0f4c81]" onClick={(e) => e.stopPropagation()}>
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