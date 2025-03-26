// app/admin/analytics/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/app/lib/supabase';
import { withAdminAuth } from '@/app/lib/withAdminAuth';
import {
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle
} from '@/app/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Button } from '@/app/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import {
  DollarSign, 
  TrendingUp, 
  Users, 
  Eye, 
  Calendar, 
  PieChart, 
  BarChart, 
  LineChart,
  Clock,
  ArrowUp,
  ArrowDown,
  ShoppingBag,
  GraduationCap,
  Banknote,
  Loader2,
  RefreshCw,
  Download,
  Activity
} from 'lucide-react';

interface AnalyticsData {
  // Revenus
  totalRevenue: number;
  pendingRevenue: number;
  monthlyRevenue: Record<string, number>;
  
  // Conversions
  totalLeads: number;
  totalSold: number;
  totalNegotiating: number;
  conversionRate: number;
  
  // Trafic
  dailyVisits: Record<string, number>;
  totalVisits: number;
  sources: Record<string, number>;
  
  // Business
  businessPerformance: Array<{
    id: string;
    name: string;
    price: number; // Ajout de la propriété price
    sales: number;
    visits: number;
    leads: number;
    conversionRate: number;
  }>;
  
  categoryPerformance: Array<{
    category: string;
    sales: number;
    leads: number;
  }>;
}

// Fonction utilitaire pour formater les prix en FCFA
const formatPrice = (amount: number) => {
  return amount.toLocaleString('fr-FR') + ' FCFA';
};

// Formatage de date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(date);
};

// Jours de la semaine en français
const daysOfWeek = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

// Mois en français
const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];

function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('30d'); // 7d, 30d, 90d, year
  const [data, setData] = useState<AnalyticsData>({
    totalRevenue: 0,
    pendingRevenue: 0,
    monthlyRevenue: {},
    totalLeads: 0,
    totalSold: 0,
    totalNegotiating: 0,
    conversionRate: 0,
    dailyVisits: {},
    totalVisits: 0,
    sources: {},
    businessPerformance: [],
    categoryPerformance: []
  });

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Définir la plage de dates en fonction du filtre sélectionné
      const now = new Date();
      let startDate = new Date();
      
      switch (timeRange) {
        case '7d':
          startDate.setDate(now.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(now.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(now.getDate() - 90);
          break;
        case 'year':
          startDate.setFullYear(now.getFullYear() - 1);
          break;
      }

      // 1. Récupérer les business interests pour le chiffre d'affaires
      const { data: interests, error: interestsError } = await supabase
        .from('business_interests')
        .select('id, business_id, status, payment_option, created_at')
        .gte('created_at', startDate.toISOString());
        
      if (interestsError) throw interestsError;
      
      // 2. Récupérer les business pour les prix
      const { data: businesses, error: businessesError } = await supabase
        .from('businesses')
        .select('id, name, price, category');
        
      if (businessesError) throw businessesError;
      
      // Créer un mapping des business
      const businessMap: Record<string, { name: string, price: number, category: string }> = {};
      businesses.forEach(business => {
        businessMap[business.id] = {
          name: business.name,
          price: business.price,
          category: business.category
        };
      });
      
      // 3. Calculer les statistiques
      
      // Revenus
      let totalRevenue = 0;
      let pendingRevenue = 0;
      const monthlyRevenue: Record<string, number> = {};
      
      // Métriques de conversion
      const totalLeads = interests.length;
      const totalSold = interests.filter(i => i.status === 'sold').length;
      const totalNegotiating = interests.filter(i => i.status === 'negotiating').length;
      
      // Performances par business
      const businessPerformanceMap: Record<string, {
        id: string;
        name: string;
        price: number; // Ajout de la propriété price
        sales: number;
        visits: number;
        leads: number;
      }> = {};
      
      // Performances par catégorie
      const categoryPerformanceMap: Record<string, {
        sales: number;
        leads: number;
      }> = {};
      
      // Visites par jour (données simulées)
      const dailyVisits: Record<string, number> = {};
      
      // Initialiser les données mensuelles
      for (let i = 0; i < 12; i++) {
        const month = new Date(now.getFullYear(), i, 1).toISOString().substring(0, 7);
        monthlyRevenue[month] = 0;
      }
      
      // Initialiser les visites quotidiennes
      for (let i = 0; i < 30; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateKey = date.toISOString().substring(0, 10);
        dailyVisits[dateKey] = Math.floor(Math.random() * 100) + 50; // Données simulées
      }
      
      // Traiter les intérêts
      interests.forEach(interest => {
        if (interest.business_id && businessMap[interest.business_id]) {
          const price = businessMap[interest.business_id].price;
          const businessName = businessMap[interest.business_id].name;
          const category = businessMap[interest.business_id].category;
          
          // Ajouter au chiffre d'affaires total si vendu
          if (interest.status === 'sold') {
            const salePrice = interest.payment_option === 'full' ? price * 0.95 : price;
            totalRevenue += salePrice;
            
            // Ajouter aux revenus mensuels
            const month = interest.created_at.substring(0, 7);
            monthlyRevenue[month] = (monthlyRevenue[month] || 0) + salePrice;
            
            // Ajouter aux performances du business
            if (!businessPerformanceMap[interest.business_id]) {
              businessPerformanceMap[interest.business_id] = {
                id: interest.business_id,
                name: businessName,
                price: price, // Ajouter le prix ici
                sales: 0,
                visits: Math.floor(Math.random() * 200) + 100, // Simulé
                leads: 0
              };
            }
            businessPerformanceMap[interest.business_id].sales += salePrice;
            
            // Ajouter aux performances de la catégorie
            if (!categoryPerformanceMap[category]) {
              categoryPerformanceMap[category] = {
                sales: 0,
                leads: 0
              };
            }
            categoryPerformanceMap[category].sales += salePrice;
          }
          
          // Ajouter au chiffre d'affaires en cours si en négociation
          if (interest.status === 'negotiating') {
            pendingRevenue += price;
          }
          
          // Mettre à jour les leads pour les performances
          if (businessPerformanceMap[interest.business_id]) {
            businessPerformanceMap[interest.business_id].leads++;
          } else {
            businessPerformanceMap[interest.business_id] = {
              id: interest.business_id,
              name: businessName,
              price: price, // Ajouter le prix ici
              sales: 0,
              visits: Math.floor(Math.random() * 200) + 100, // Simulé
              leads: 1
            };
          }
          
          // Mettre à jour les leads par catégorie
          if (categoryPerformanceMap[category]) {
            categoryPerformanceMap[category].leads++;
          } else {
            categoryPerformanceMap[category] = {
              sales: 0,
              leads: 1
            };
          }
        }
      });
      
      // Convertir les maps en tableaux pour les performances
      const businessPerformance = Object.values(businessPerformanceMap).map(bp => ({
        ...bp,
        conversionRate: bp.leads > 0 ? (bp.sales / (bp.price || 1)) / bp.leads * 100 : 0
      })).sort((a, b) => b.sales - a.sales);
      
      const categoryPerformance = Object.entries(categoryPerformanceMap).map(([category, data]) => ({
        category,
        ...data
      })).sort((a, b) => b.sales - a.sales);
      
      // Calculer les sources de trafic (simulées)
      const sources = {
        'Direct': 35,
        'Social Media': 25,
        'Organic Search': 20,
        'Referral': 15,
        'Email': 5
      };
      
      // Calculer le taux de conversion global
      const totalVisits = Object.values(dailyVisits).reduce((sum, visits) => sum + visits, 0);
      const conversionRate = totalVisits > 0 ? (totalLeads / totalVisits) * 100 : 0;
      
      // Mettre à jour l'état avec les données calculées
      setData({
        totalRevenue,
        pendingRevenue,
        monthlyRevenue,
        totalLeads,
        totalSold,
        totalNegotiating,
        conversionRate,
        dailyVisits,
        totalVisits,
        sources,
        businessPerformance,
        categoryPerformance
      });
      
    } catch (err) {
      console.error('Erreur lors du chargement des données analytics:', err);
      setError('Une erreur est survenue lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  // Créer des données de graphique à partir des visites quotidiennes
  const getVisitChartData = () => {
    return Object.entries(data.dailyVisits)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-14) // Derniers 14 jours
      .map(([date, count]) => {
        const d = new Date(date);
        return {
          date: `${d.getDate()}/${d.getMonth() + 1}`,
          day: daysOfWeek[d.getDay()],
          visits: count
        };
      });
  };

  // Créer des données de graphique pour les revenus mensuels
  const getRevenueChartData = () => {
    return Object.entries(data.monthlyRevenue)
      .map(([month, revenue]) => ({
        month: months[parseInt(month.split('-')[1]) - 1],
        revenue
      }))
      .slice(-6); // 6 derniers mois
  };

  // Indicateur de tendance (simulé)
  const getTrend = (value: number) => {
    // Simuler une tendance (positive ou négative)
    const isPositive = Math.random() > 0.3; // 70% de chance d'être positif
    const percentage = Math.floor(Math.random() * 20) + 5; // Entre 5% et 25%
    
    return (
      <span className={`flex items-center text-xs ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
        <span>{percentage}% {isPositive ? 'hausse' : 'baisse'}</span>
      </span>
    );
  };

  // Télécharger les données en CSV
  const downloadCSV = (dataType: string) => {
    let csvContent = '';
    let filename = '';
    
    switch (dataType) {
      case 'revenue':
        csvContent = 'Mois,Revenu (FCFA)\n';
        csvContent += Object.entries(data.monthlyRevenue)
          .map(([month, revenue]) => `${month},${revenue}`)
          .join('\n');
        filename = `revenus_mensuels_${new Date().toISOString().split('T')[0]}.csv`;
        break;
      case 'visits':
        csvContent = 'Date,Visites\n';
        csvContent += Object.entries(data.dailyVisits)
          .sort((a, b) => a[0].localeCompare(b[0]))
          .map(([date, visits]) => `${date},${visits}`)
          .join('\n');
        filename = `visites_quotidiennes_${new Date().toISOString().split('T')[0]}.csv`;
        break;
      case 'business':
        csvContent = 'Business,Ventes (FCFA),Leads,Visites,Taux de conversion (%)\n';
        csvContent += data.businessPerformance
          .map(b => `${b.name},${b.sales},${b.leads},${b.visits},${b.conversionRate.toFixed(2)}`)
          .join('\n');
        filename = `performance_business_${new Date().toISOString().split('T')[0]}.csv`;
        break;
      default:
        return;
    }
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    
    link.click();
    
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Loader2 className="h-12 w-12 animate-spin text-[#ff7f50] mb-4" />
        <p className="text-gray-500">Chargement des données analytiques...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 max-w-lg">
          <p className="text-red-700">{error}</p>
        </div>
        <Button 
          onClick={fetchAnalyticsData} 
          className="flex items-center bg-[#0f4c81]"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Réessayer
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#0f4c81]">Analytics</h1>
          <p className="text-gray-500">Statistiques et analyses de performance</p>
        </div>
        
        <div className="flex gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 derniers jours</SelectItem>
              <SelectItem value="30d">30 derniers jours</SelectItem>
              <SelectItem value="90d">3 derniers mois</SelectItem>
              <SelectItem value="year">12 derniers mois</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            size="icon"
            onClick={fetchAnalyticsData}
            title="Actualiser les données"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="revenue">Revenus</TabsTrigger>
          <TabsTrigger value="traffic">Trafic</TabsTrigger>
          <TabsTrigger value="business">Business</TabsTrigger>
        </TabsList>
        
        {/* Vue d'ensemble */}
        <TabsContent value="overview" className="space-y-6">
          {/* KPIs principaux */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-white border-l-4 border-l-green-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Chiffre d'affaires total</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatPrice(data.totalRevenue)}</div>
                {getTrend(data.totalRevenue)}
              </CardContent>
            </Card>
            
            <Card className="bg-white border-l-4 border-l-blue-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Leads générés</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.totalLeads}</div>
                {getTrend(data.totalLeads)}
              </CardContent>
            </Card>
            
            <Card className="bg-white border-l-4 border-l-purple-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Taux de conversion</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.conversionRate.toFixed(1)}%</div>
                {getTrend(data.conversionRate)}
              </CardContent>
            </Card>
            
            <Card className="bg-white border-l-4 border-l-yellow-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">CA Potentiel</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatPrice(data.pendingRevenue)}</div>
                <p className="text-xs text-gray-500">En négociation</p>
              </CardContent>
            </Card>
          </div>
          
          {/* Graphiques - Vue d'ensemble */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Revenus mensuels */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Évolution des revenus</CardTitle>
                <CardDescription>6 derniers mois</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px] w-full relative">
                  {/* Graphique en barres simulé */}
                  <div className="absolute inset-0 flex items-end justify-around px-4">
                    {getRevenueChartData().map((item, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div 
                          className="w-10 bg-gradient-to-t from-[#0f4c81] to-[#3b82f6] rounded-t" 
                          style={{ 
                            height: `${Math.max((item.revenue / Math.max(...getRevenueChartData().map(d => d.revenue))) * 180, 10)}px` 
                          }}
                        ></div>
                        <div className="text-xs mt-2 text-gray-600">{item.month}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Visites quotidiennes */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Trafic quotidien</CardTitle>
                <CardDescription>14 derniers jours</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px] w-full relative">
                  {/* Graphique en ligne simulé */}
                  <div className="absolute inset-0">
                    <svg className="w-full h-full" viewBox="0 0 300 200" preserveAspectRatio="none">
                      {/* Ligne de tendance */}
                      <path 
                        d={`M 10 ${200 - (getVisitChartData()[0]?.visits / 150) * 180} ${
                          getVisitChartData().map((d, i) => {
                            const x = 10 + (i * (280 / (getVisitChartData().length - 1)));
                            const y = 200 - (d.visits / 150) * 180;
                            return `L ${x} ${y}`;
                          }).join(' ')
                        }`}
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="2"
                      />
                      
                      {/* Points */}
                      {getVisitChartData().map((d, i) => {
                        const x = 10 + (i * (280 / (getVisitChartData().length - 1)));
                        const y = 200 - (d.visits / 150) * 180;
                        return (
                          <circle 
                            key={i}
                            cx={x}
                            cy={y}
                            r="3"
                            fill="#3b82f6"
                          />
                        );
                      })}
                    </svg>
                    
                    {/* Étiquettes */}
                    <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2 text-xs text-gray-500">
                      {getVisitChartData().filter((_, i) => i % 3 === 0).map((d, i) => (
                        <div key={i}>{d.day}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Top Business */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Top Business</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => downloadCSV('business')}
                  className="text-xs"
                >
                  <Download className="h-3 w-3 mr-1" />
                  Exporter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-2">Business</th>
                      <th className="text-right py-2 px-2">Ventes</th>
                      <th className="text-right py-2 px-2">Leads</th>
                      <th className="text-right py-2 px-2">Taux conv.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.businessPerformance.slice(0, 5).map((business, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-2">{business.name}</td>
                        <td className="text-right py-2 px-2">{formatPrice(business.sales)}</td>
                        <td className="text-right py-2 px-2">{business.leads}</td>
                        <td className="text-right py-2 px-2">{business.conversionRate.toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Revenus */}
        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="md:col-span-3 bg-gradient-to-r from-[#0f4c81] to-[#3b82f6] text-white">
              <CardHeader>
                <CardTitle className="text-xl">Revenus totaux</CardTitle>
                <CardDescription className="text-white text-opacity-80">
                  Période: {timeRange === '7d' ? '7 derniers jours' : 
                  timeRange === '30d' ? '30 derniers jours' : 
                  timeRange === '90d' ? '3 derniers mois' : '12 derniers mois'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{formatPrice(data.totalRevenue)}</div>
                <p className="text-white text-opacity-80 mt-2">
                  {getTrend(data.totalRevenue)}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Ventes conclues</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.totalSold}</div>
                <div className="text-xs text-gray-500">sur {data.totalLeads} leads</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">En négociation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.totalNegotiating}</div>
                <div className="text-xs text-gray-500">
                  Potentiel: {formatPrice(data.pendingRevenue)}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Taux de conversion</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{(data.totalSold / data.totalLeads * 100).toFixed(1)}%</div>
                <div className="text-xs text-gray-500">
                  Lead à vente
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-lg">Évolution des revenus</CardTitle>
                  <CardDescription>Analyse mensuelle</CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => downloadCSV('revenue')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exporter CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] w-full relative">
                {/* Graphique en barres avec valeurs */}
                <div className="absolute inset-0 flex items-end justify-around px-4">
                  {getRevenueChartData().map((item, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div className="text-xs text-gray-500 mb-2">
                        {formatPrice(item.revenue)}
                      </div>
                      <div 
                        className="w-16 bg-gradient-to-t from-[#0f4c81] to-[#3b82f6] rounded-t" 
                        style={{ 
                          height: `${Math.max((item.revenue / Math.max(...getRevenueChartData().map(d => d.revenue))) * 250, 10)}px` 
                        }}
                      ></div>
                      <div className="text-sm mt-2 font-medium">{item.month}</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Répartition par catégorie */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Revenus par catégorie</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.categoryPerformance.map((category, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium">{category.category}</span>
                        <span>{formatPrice(category.sales)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-[#0f4c81] h-2 rounded-full" 
                          style={{ 
                            width: `${(category.sales / data.totalRevenue) * 100}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Indicateurs clés de revenus */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Indicateurs clés</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center">
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                    <DollarSign className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Valeur moyenne par vente</div>
                    <div className="text-xl font-bold">
                      {data.totalSold > 0 
                        ? formatPrice(data.totalRevenue / data.totalSold) 
                        : 'N/A'}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mr-4">
                    <Activity className="h-8 w-8 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Progression vs période précédente</div>
                    <div className="text-xl font-bold text-green-600">
                      +18.5%
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                    <Clock className="h-8 w-8 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Temps moyen de conversion</div>
                    <div className="text-xl font-bold">
                      {14} jours
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Trafic */}
        <TabsContent value="traffic" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="md:col-span-3 bg-gradient-to-r from-[#1e40af] to-[#3b82f6] text-white">
              <CardHeader>
                <CardTitle className="text-xl">Trafic total</CardTitle>
                <CardDescription className="text-white text-opacity-80">
                  Données pour la période sélectionnée
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{data.totalVisits.toLocaleString()} visites</div>
                {getTrend(data.totalVisits)}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Taux de conversion</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.conversionRate.toFixed(1)}%</div>
                <div className="text-xs text-gray-500">Visites en leads</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Leads générés</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.totalLeads}</div>
                <div className="text-xs text-gray-500">
                  {(data.totalLeads / (timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365)).toFixed(1)} par jour
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Valeur par visite</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {data.totalVisits > 0 
                    ? formatPrice(data.totalRevenue / data.totalVisits) 
                    : 'N/A'}
                </div>
                <div className="text-xs text-gray-500">
                  En moyenne
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-lg">Évolution du trafic</CardTitle>
                  <CardDescription>Visites quotidiennes</CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => downloadCSV('visits')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exporter CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] w-full relative">
                {/* Graphique en ligne avec zone ombrée */}
                <div className="absolute inset-0">
                  <svg className="w-full h-full" viewBox="0 0 600 300" preserveAspectRatio="none">
                    {/* Zone ombrée */}
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    
                    <path 
                      d={`M 20 ${300 - (getVisitChartData()[0]?.visits / 150) * 250} ${
                        getVisitChartData().map((d, i) => {
                          const x = 20 + (i * (560 / (getVisitChartData().length - 1)));
                          const y = 300 - (d.visits / 150) * 250;
                          return `L ${x} ${y}`;
                        }).join(' ')
                      } L ${20 + ((getVisitChartData().length - 1) * (560 / (getVisitChartData().length - 1)))} 300 L 20 300 Z`}
                      fill="url(#gradient)"
                    />
                    
                    {/* Ligne */}
                    <path 
                      d={`M 20 ${300 - (getVisitChartData()[0]?.visits / 150) * 250} ${
                        getVisitChartData().map((d, i) => {
                          const x = 20 + (i * (560 / (getVisitChartData().length - 1)));
                          const y = 300 - (d.visits / 150) * 250;
                          return `L ${x} ${y}`;
                        }).join(' ')
                      }`}
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="2"
                    />
                    
                    {/* Points */}
                    {getVisitChartData().map((d, i) => {
                      const x = 20 + (i * (560 / (getVisitChartData().length - 1)));
                      const y = 300 - (d.visits / 150) * 250;
                      return (
                        <g key={i}>
                          <circle 
                            cx={x}
                            cy={y}
                            r="4"
                            fill="#3b82f6"
                          />
                          <text 
                            x={x} 
                            y={y - 15} 
                            fontSize="10" 
                            fill="#666" 
                            textAnchor="middle"
                          >
                            {d.visits}
                          </text>
                        </g>
                      );
                    })}
                    
                    {/* Axe horizontal */}
                    <line x1="20" y1="300" x2="580" y2="300" stroke="#e5e7eb" strokeWidth="1" />
                  </svg>
                  
                  {/* Étiquettes des jours */}
                  <div className="absolute bottom-0 left-0 right-0 flex justify-between px-4 pb-4">
                    {getVisitChartData().filter((_, i) => i % 2 === 0).map((d, i) => (
                      <div key={i} className="flex flex-col items-center">
                        <div className="text-xs font-medium">{d.day}</div>
                        <div className="text-xs text-gray-500">{d.date}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sources de trafic */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Sources de trafic</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(data.sources).map(([source, percentage], index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium">{source}</span>
                        <span>{percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            index === 0 ? 'bg-blue-500' :
                            index === 1 ? 'bg-green-500' :
                            index === 2 ? 'bg-yellow-500' :
                            index === 3 ? 'bg-purple-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Indicateurs de trafic */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Indicateurs clés</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="text-sm text-blue-600 font-medium">Visiteurs par jour</div>
                    <div className="text-2xl font-bold">
                      {Math.round(data.totalVisits / (
                        timeRange === '7d' ? 7 : 
                        timeRange === '30d' ? 30 : 
                        timeRange === '90d' ? 90 : 365
                      ))}
                    </div>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="text-sm text-green-600 font-medium">Leads par jour</div>
                    <div className="text-2xl font-bold">
                      {(data.totalLeads / (
                        timeRange === '7d' ? 7 : 
                        timeRange === '30d' ? 30 : 
                        timeRange === '90d' ? 90 : 365
                      )).toFixed(1)}
                    </div>
                  </div>
                  
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <div className="text-sm text-yellow-600 font-medium">Coût par lead</div>
                    <div className="text-2xl font-bold">
                      {formatPrice(2500)}
                    </div>
                  </div>
                  
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="text-sm text-purple-600 font-medium">Coût par acquisition</div>
                    <div className="text-2xl font-bold">
                      {formatPrice(25000)}
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium mb-2">Répartition géographique</div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Sénégal</span>
                      <span className="font-medium">65%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Côte d'Ivoire</span>
                      <span className="font-medium">15%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Mali</span>
                      <span className="font-medium">8%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Autres</span>
                      <span className="font-medium">12%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Business */}
        <TabsContent value="business" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Total Business</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.businessPerformance.length}</div>
                <div className="text-xs text-gray-500">En vente actuellement</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Ventes totales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.totalSold}</div>
                <div className="text-xs text-gray-500">Business vendus</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">CA moyen par business</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {data.businessPerformance.length > 0 
                    ? formatPrice(data.totalRevenue / data.businessPerformance.length) 
                    : 'N/A'}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Taux de conversion moyen</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(data.businessPerformance.reduce((sum, b) => sum + (b.leads > 0 ? b.sales / b.leads : 0), 0) / 
                    (data.businessPerformance.length || 1)).toFixed(1)}%
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Performance des business</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => downloadCSV('business')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exporter CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Business</th>
                      <th className="text-right py-3 px-4">Ventes</th>
                      <th className="text-right py-3 px-4">Leads</th>
                      <th className="text-right py-3 px-4">Visites</th>
                      <th className="text-right py-3 px-4">Taux de conv.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.businessPerformance.map((business, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{business.name}</td>
                        <td className="text-right py-3 px-4">{formatPrice(business.sales)}</td>
                        <td className="text-right py-3 px-4">{business.leads}</td>
                        <td className="text-right py-3 px-4">{business.visits}</td>
                        <td className="text-right py-3 px-4 font-medium">
                          <span className={business.conversionRate > 10 ? 'text-green-600' : 'text-yellow-600'}>
                            {business.conversionRate.toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Performance par catégorie */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Performance par catégorie</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {data.categoryPerformance.map((category, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{category.category}</span>
                        <span className="text-right">{formatPrice(category.sales)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-[#0f4c81] h-2 rounded-full" 
                          style={{ width: `${(category.sales / data.totalRevenue) * 100}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 flex justify-between">
                        <span>{category.leads} leads</span>
                        <span>
                          Taux de conv.: {category.leads > 0 ? ((category.sales / category.leads) * 100).toFixed(1) : 0}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Tendances du business */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tendances et insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="text-sm text-blue-700 font-medium mb-1">Top catégories performantes</div>
                    <div className="text-sm">
                      {data.categoryPerformance.length > 0 ? (
                        <span>
                          Les catégories <strong>{data.categoryPerformance[0]?.category}</strong> et <strong>{data.categoryPerformance[1]?.category}</strong> représentent {
                            Math.round((data.categoryPerformance[0]?.sales + (data.categoryPerformance[1]?.sales || 0)) / data.totalRevenue * 100)
                          }% du CA total.
                        </span>
                      ) : (
                        <span>Données insuffisantes</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="text-sm text-green-700 font-medium mb-1">Meilleur taux de conversion</div>
                    <div className="text-sm">
                      {data.businessPerformance.length > 0 ? (
                        <span>
                          <strong>{data.businessPerformance.sort((a, b) => b.conversionRate - a.conversionRate)[0]?.name}</strong> avec {
                            data.businessPerformance.sort((a, b) => b.conversionRate - a.conversionRate)[0]?.conversionRate.toFixed(1)
                          }% de conversion.
                        </span>
                      ) : (
                        <span>Données insuffisantes</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <div className="text-sm text-yellow-700 font-medium mb-1">Opportunités d'amélioration</div>
                    <div className="text-sm">
                      {data.businessPerformance
                        .filter(b => b.leads > 5 && b.conversionRate < 5)
                        .length > 0 ? (
                        <span>
                          <strong>
                            {data.businessPerformance
                              .filter(b => b.leads > 5 && b.conversionRate < 5)
                              .map(b => b.name)
                              .join(', ')
                            }
                          </strong> ont un taux de conversion faible malgré un bon nombre de leads.
                        </span>
                      ) : (
                        <span>Aucun business ne présente de problème notable de conversion.</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="text-sm text-purple-700 font-medium mb-1">Recommandations</div>
                    <div className="text-sm">
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Optimiser les pages des business à faible conversion</li>
                        <li>Créer plus de business dans les catégories performantes</li>
                        <li>Revoir la stratégie de prix pour maximiser le ROI</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default withAdminAuth(AnalyticsPage);