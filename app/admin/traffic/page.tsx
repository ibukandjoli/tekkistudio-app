// app/admin/traffic/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { withAdminAuth } from '@/app/lib/withAdminAuth';
import { supabase } from '@/app/lib/supabase';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/app/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/app/components/ui/tabs';
import { Button } from '@/app/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import {
  Globe,
  TrendingUp,
  Users,
  MousePointer,
  Share2,
  Clock,
  MapPin,
  Monitor,
  Smartphone,
  Tablet,
  RefreshCw,
  Download,
  ArrowUp,
  ArrowDown,
  Loader2,
  Search,
  Link2,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';

// Données simulées pour le trafic
interface TrafficData {
  // Vue d'ensemble
  overview: {
    totalVisits: number;
    uniqueVisitors: number;
    pageViews: number;
    avgSessionDuration: number; // en secondes
    bounceRate: number; // en pourcentage
  };
  
  // Par jour
  dailyVisits: Record<string, {
    visits: number;
    uniqueVisitors: number;
    pageViews: number;
  }>;
  
  // Sources de trafic
  sources: Array<{
    source: string;
    visits: number;
    percentage: number;
  }>;
  
  // Pages les plus visitées
  topPages: Array<{
    path: string;
    title: string;
    views: number;
    avgTimeOnPage: number; // en secondes
  }>;
  
  // Appareils
  devices: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  
  // Géographie
  countries: Array<{
    country: string;
    visits: number;
    percentage: number;
  }>;
  
  // Référents
  referrers: Array<{
    url: string;
    visits: number;
    percentage: number;
  }>;
}

function TrafficPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('30d'); // 7d, 30d, 90d, year
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<TrafficData>({
    overview: {
      totalVisits: 0,
      uniqueVisitors: 0,
      pageViews: 0,
      avgSessionDuration: 0,
      bounceRate: 0
    },
    dailyVisits: {},
    sources: [],
    topPages: [],
    devices: {
      desktop: 0,
      mobile: 0,
      tablet: 0
    },
    countries: [],
    referrers: []
  });
  
  useEffect(() => {
    fetchTrafficData();
  }, [timeRange]);
  
  const fetchTrafficData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Délai simulé pour l'effet de chargement
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Simuler des données de trafic
      // Dans un environnement réel, celles-ci viendraient d'une API d'analytics
      const simulatedData: TrafficData = generateSimulatedData(timeRange);
      
      setData(simulatedData);
    } catch (err) {
      console.error('Erreur lors du chargement des données de trafic:', err);
      setError('Une erreur est survenue lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };
  
  // Génération de données simulées
  const generateSimulatedData = (period: string): TrafficData => {
    // Déterminer le nombre de jours en fonction de la période
    let days = 30;
    switch (period) {
      case '7d': days = 7; break;
      case '30d': days = 30; break;
      case '90d': days = 90; break;
      case 'year': days = 365; break;
    }
    
    // Facteur de multiplication pour simuler différentes périodes
    const factor = Math.sqrt(days / 30);
    
    // Générer les visites quotidiennes
    const dailyVisits: Record<string, { visits: number; uniqueVisitors: number; pageViews: number }> = {};
    const today = new Date();
    
    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - (days - i - 1));
      const dateKey = date.toISOString().split('T')[0];
      
      // Valeur de base plus variations aléatoires (plus élevée pour les jours récents)
      const recencyFactor = 1 + (i / days) * 0.5; // Les jours récents ont plus de trafic
      const baseVisits = Math.round(100 * factor * recencyFactor);
      const weekdayFactor = date.getDay() === 0 || date.getDay() === 6 ? 0.7 : 1; // Weekend a moins de trafic
      
      const visits = Math.round(baseVisits * weekdayFactor * (0.8 + Math.random() * 0.4));
      const uniqueVisitors = Math.round(visits * (0.6 + Math.random() * 0.2));
      const pageViews = Math.round(visits * (2 + Math.random() * 1.5));
      
      dailyVisits[dateKey] = { visits, uniqueVisitors, pageViews };
    }
    
    // Calculer les totaux
    const totalVisits = Object.values(dailyVisits).reduce((sum, day) => sum + day.visits, 0);
    const totalUniqueVisitors = Math.round(totalVisits * 0.7);
    const totalPageViews = Object.values(dailyVisits).reduce((sum, day) => sum + day.pageViews, 0);
    
    // Simuler les sources de trafic
    const sources = [
      { source: "Direct", visits: Math.round(totalVisits * 0.35), percentage: 35 },
      { source: "Organic Search", visits: Math.round(totalVisits * 0.25), percentage: 25 },
      { source: "Social Media", visits: Math.round(totalVisits * 0.20), percentage: 20 },
      { source: "Referral", visits: Math.round(totalVisits * 0.15), percentage: 15 },
      { source: "Email", visits: Math.round(totalVisits * 0.05), percentage: 5 }
    ];
    
    // Simuler les pages les plus visitées
    const topPages = [
      { 
        path: "/", 
        title: "Accueil - TEKKI Studio", 
        views: Math.round(totalPageViews * 0.3), 
        avgTimeOnPage: 75 
      },
      { 
        path: "/businesses", 
        title: "Business en vente - TEKKI Studio", 
        views: Math.round(totalPageViews * 0.2), 
        avgTimeOnPage: 120 
      },
      { 
        path: "/formations", 
        title: "Nos formations - TEKKI Studio", 
        views: Math.round(totalPageViews * 0.15), 
        avgTimeOnPage: 105 
      },
      { 
        path: "/marques", 
        title: "Nos marques - TEKKI Studio", 
        views: Math.round(totalPageViews * 0.1), 
        avgTimeOnPage: 90 
      },
      { 
        path: "/about", 
        title: "À propos - TEKKI Studio", 
        views: Math.round(totalPageViews * 0.08), 
        avgTimeOnPage: 60 
      },
      { 
        path: "/contact", 
        title: "Contact - TEKKI Studio", 
        views: Math.round(totalPageViews * 0.07), 
        avgTimeOnPage: 45 
      },
      { 
        path: "/blog/ecommerce-senegal", 
        title: "E-commerce au Sénégal - TEKKI Studio", 
        views: Math.round(totalPageViews * 0.06), 
        avgTimeOnPage: 180 
      },
      { 
        path: "/blog/marques-locales", 
        title: "Créer des marques locales - TEKKI Studio", 
        views: Math.round(totalPageViews * 0.04), 
        avgTimeOnPage: 150 
      }
    ];
    
    // Simuler la répartition des appareils
    const devices = {
      mobile: Math.round(totalVisits * (0.55 + Math.random() * 0.1)),
      desktop: Math.round(totalVisits * (0.35 + Math.random() * 0.1)),
      tablet: 0 // Calculé par différence pour assurer que le total est correct
    };
    devices.tablet = totalVisits - devices.mobile - devices.desktop;
    
    // Simuler la répartition géographique
    const countries = [
      { country: "Sénégal", visits: Math.round(totalVisits * 0.65), percentage: 65 },
      { country: "Côte d'Ivoire", visits: Math.round(totalVisits * 0.12), percentage: 12 },
      { country: "Mali", visits: Math.round(totalVisits * 0.08), percentage: 8 },
      { country: "France", visits: Math.round(totalVisits * 0.06), percentage: 6 },
      { country: "Maroc", visits: Math.round(totalVisits * 0.04), percentage: 4 },
      { country: "Autres", visits: Math.round(totalVisits * 0.05), percentage: 5 }
    ];
    
    // Simuler les référents
    const referrers = [
      { url: "facebook.com", visits: Math.round(totalVisits * 0.12), percentage: 12 },
      { url: "instagram.com", visits: Math.round(totalVisits * 0.08), percentage: 8 },
      { url: "linkedin.com", visits: Math.round(totalVisits * 0.05), percentage: 5 },
      { url: "google.com", visits: Math.round(totalVisits * 0.03), percentage: 3 },
      { url: "youtube.com", visits: Math.round(totalVisits * 0.02), percentage: 2 }
    ];
    
    return {
      overview: {
        totalVisits,
        uniqueVisitors: totalUniqueVisitors,
        pageViews: totalPageViews,
        avgSessionDuration: Math.round(120 + Math.random() * 60), // 2-3 minutes
        bounceRate: Math.round(50 + Math.random() * 20) // 50-70%
      },
      dailyVisits,
      sources,
      topPages,
      devices,
      countries,
      referrers
    };
  };
  
  // Formater la durée en mm:ss
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  // Formater les nombres
  const formatNumber = (num: number) => {
    return num.toLocaleString('fr-FR');
  };
  
  // Obtenir les données pour le graphique des visites quotidiennes
  const getDailyVisitsData = () => {
    return Object.entries(data.dailyVisits)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, data]) => ({
        date,
        visits: data.visits,
        uniqueVisitors: data.uniqueVisitors,
        pageViews: data.pageViews,
        // Formater la date pour l'affichage
        displayDate: new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })
      }));
  };
  
  // Calculer la tendance par rapport à la période précédente
  const calculateTrend = (value: number, percentage: number = 15) => {
    // Simuler une tendance (+ ou - un pourcentage aléatoire)
    const isPositive = Math.random() > 0.3; // 70% de chance d'être positif
    const trendPercentage = Math.floor(Math.random() * percentage) + 1;
    
    return (
      <div className={`flex items-center text-xs ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
        <span>{trendPercentage}% {isPositive ? 'hausse' : 'baisse'}</span>
      </div>
    );
  };
  
  // Télécharger les données en CSV
  const downloadCSV = (dataType: string) => {
    let csvContent = '';
    let filename = '';
    
    switch (dataType) {
      case 'daily':
        csvContent = 'Date,Visites,Visiteurs uniques,Pages vues\n';
        csvContent += Object.entries(data.dailyVisits)
          .sort((a, b) => a[0].localeCompare(b[0]))
          .map(([date, day]) => `${date},${day.visits},${day.uniqueVisitors},${day.pageViews}`)
          .join('\n');
        filename = `visites_quotidiennes_${new Date().toISOString().split('T')[0]}.csv`;
        break;
      case 'sources':
        csvContent = 'Source,Visites,Pourcentage\n';
        csvContent += data.sources
          .map(s => `${s.source},${s.visits},${s.percentage}%`)
          .join('\n');
        filename = `sources_trafic_${new Date().toISOString().split('T')[0]}.csv`;
        break;
      case 'pages':
        csvContent = 'URL,Titre,Vues,Temps moyen (secondes)\n';
        csvContent += data.topPages
          .map(p => `${p.path},${p.title},${p.views},${p.avgTimeOnPage}`)
          .join('\n');
        filename = `pages_populaires_${new Date().toISOString().split('T')[0]}.csv`;
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
        <Loader2 className="h-12 w-12 animate-spin text-[#0f4c81] mb-4" />
        <p className="text-gray-500">Chargement des données de trafic...</p>
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
          onClick={fetchTrafficData} 
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
          <h1 className="text-3xl font-bold text-[#0f4c81]">Trafic Web</h1>
          <p className="text-gray-500">Analyse du trafic sur le site TEKKI Studio</p>
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
            onClick={fetchTrafficData}
            title="Actualiser les données"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="pages">Pages</TabsTrigger>
          <TabsTrigger value="sources">Sources</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
        </TabsList>
        
        {/* Vue d'ensemble */}
        <TabsContent value="overview" className="space-y-6">
          {/* KPIs principaux */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card className="bg-white border-l-4 border-l-blue-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Visites totales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(data.overview.totalVisits)}</div>
                {calculateTrend(data.overview.totalVisits)}
              </CardContent>
            </Card>
            
            <Card className="bg-white border-l-4 border-l-purple-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Visiteurs uniques</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(data.overview.uniqueVisitors)}</div>
                {calculateTrend(data.overview.uniqueVisitors)}
              </CardContent>
            </Card>
            
            <Card className="bg-white border-l-4 border-l-green-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Pages vues</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(data.overview.pageViews)}</div>
                {calculateTrend(data.overview.pageViews)}
              </CardContent>
            </Card>
            
            <Card className="bg-white border-l-4 border-l-amber-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Durée moy. session</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatDuration(data.overview.avgSessionDuration)}</div>
                {calculateTrend(data.overview.avgSessionDuration, 10)}
              </CardContent>
            </Card>
            
            <Card className="bg-white border-l-4 border-l-red-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Taux de rebond</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.overview.bounceRate}%</div>
                <div className={`flex items-center text-xs ${data.overview.bounceRate > 60 ? 'text-red-600' : 'text-yellow-600'}`}>
                  {data.overview.bounceRate > 55 ? (
                    <ArrowUp className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDown className="h-3 w-3 mr-1" />
                  )}
                  <span>{Math.floor(Math.random() * 10) + 1}% {data.overview.bounceRate > 55 ? 'hausse' : 'baisse'}</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Graphique des visites quotidiennes */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-lg">Évolution des visites</CardTitle>
                  <CardDescription>Trafic quotidien</CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => downloadCSV('daily')}
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
                    {/* Définition du dégradé */}
                    <defs>
                      <linearGradient id="visitsGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    
                    {/* Données filtrées pour l'affichage */}
                    {(() => {
                      const dailyData = getDailyVisitsData();
                      const maxVisits = Math.max(...dailyData.map(d => d.visits)) * 1.1;
                      
                      // Déterminer combien de points afficher en fonction de la période
                      const displayCount = timeRange === '7d' ? 7 : 
                                           timeRange === '30d' ? 30 : 
                                           timeRange === '90d' ? 30 : 15;
                      
                      // Filtrer les données pour n'afficher que quelques points
                      const step = Math.max(1, Math.floor(dailyData.length / displayCount));
                      const filteredData = dailyData.filter((_, i) => i % step === 0 || i === dailyData.length - 1);
                      
                      // Points pour la courbe des visites
                      const pointsVisits = filteredData.map((d, i) => {
                        const x = 20 + (i * (560 / (filteredData.length - 1)));
                        const y = 300 - (d.visits / maxVisits) * 250;
                        return [x, y];
                      });
                      
                      // Points pour la courbe des visiteurs uniques
                      const pointsUnique = filteredData.map((d, i) => {
                        const x = 20 + (i * (560 / (filteredData.length - 1)));
                        const y = 300 - (d.uniqueVisitors / maxVisits) * 250;
                        return [x, y];
                      });
                      
                      // Créer le chemin des visites
                      const visitsPath = `M ${pointsVisits[0][0]} ${pointsVisits[0][1]} ${
                        pointsVisits.slice(1).map(([x, y]) => `L ${x} ${y}`).join(' ')
                      }`;
                      
                      // Créer le chemin des visiteurs uniques
                      const uniquePath = `M ${pointsUnique[0][0]} ${pointsUnique[0][1]} ${
                        pointsUnique.slice(1).map(([x, y]) => `L ${x} ${y}`).join(' ')
                      }`;
                      
                      // Créer la zone ombrée
                      const areaPath = `${visitsPath} L ${pointsVisits[pointsVisits.length-1][0]} 300 L ${pointsVisits[0][0]} 300 Z`;
                      
                      return (
                        <>
                          {/* Zone ombrée sous la courbe des visites */}
                          <path 
                            d={areaPath}
                            fill="url(#visitsGradient)"
                          />
                          
                          {/* Ligne des visites */}
                          <path 
                            d={visitsPath}
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="2"
                          />
                          
                          {/* Ligne des visiteurs uniques */}
                          <path 
                            d={uniquePath}
                            fill="none"
                            stroke="#8b5cf6"
                            strokeWidth="2"
                            strokeDasharray="4,4"
                          />
                          
                          {/* Points sur la courbe des visites */}
                          {filteredData.map((d, i) => {
                            const [x, y] = pointsVisits[i];
                            return (
                              <g key={`visit-${i}`}>
                                <circle 
                                  cx={x}
                                  cy={y}
                                  r="4"
                                  fill="#3b82f6"
                                />
                                {filteredData.length <= 15 && (
                                  <text 
                                    x={x} 
                                    y={y - 15} 
                                    fontSize="10" 
                                    fill="#666" 
                                    textAnchor="middle"
                                  >
                                    {d.visits}
                                  </text>
                                )}
                              </g>
                            );
                          })}
                          
                          {/* Axe horizontal */}
                          <line x1="20" y1="300" x2="580" y2="300" stroke="#e5e7eb" strokeWidth="1" />
                          
                          {/* Légende */}
                          <g transform="translate(480, 20)">
                            <circle cx="5" cy="5" r="4" fill="#3b82f6" />
                            <text x="15" y="9" fontSize="10" fill="#666">Visites</text>
                            
                            <circle cx="5" cy="25" r="4" fill="#8b5cf6" />
                            <text x="15" y="29" fontSize="10" fill="#666">Visiteurs uniques</text>
                          </g>
                        </>
                      );
                    })()}
                  </svg>
                  
                  {/* Étiquettes des jours */}
                  <div className="absolute bottom-0 left-0 right-0 flex justify-between px-4 pb-4">
                    {(() => {
                      const dailyData = getDailyVisitsData();
                      const displayCount = timeRange === '7d' ? 7 : 
                                           timeRange === '30d' ? 10 : 
                                           timeRange === '90d' ? 10 : 12;
                      
                      // Filtrer les données pour n'afficher que quelques dates
                      const step = Math.max(1, Math.floor(dailyData.length / displayCount));
                      const filteredData = dailyData.filter((_, i) => i % step === 0 || i === dailyData.length - 1);
                      
                      return filteredData.map((d, i) => (
                        <div key={i} className="flex flex-col items-center">
                          <div className="text-xs text-gray-500">{d.displayDate}</div>
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Répartition sources et appareils */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sources de trafic */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Sources de trafic</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.sources.map((source, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium">{source.source}</span>
                        <span>{formatNumber(source.visits)} ({source.percentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            index === 0 ? 'bg-blue-500' :
                            index === 1 ? 'bg-green-500' :
                            index === 2 ? 'bg-purple-500' :
                            index === 3 ? 'bg-amber-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${source.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Appareils et géographie */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Appareils et géographie</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Appareils */}
                <div>
                  <h3 className="text-sm font-medium mb-3">Répartition par appareil</h3>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <Smartphone className="h-6 w-6 mx-auto text-blue-600 mb-1" />
                      <div className="text-lg font-bold">{Math.round((data.devices.mobile / data.overview.totalVisits) * 100)}%</div>
                      <div className="text-xs text-gray-500">Mobile</div>
                    </div>
                    
                    <div className="p-3 bg-green-50 rounded-lg">
                      <Monitor className="h-6 w-6 mx-auto text-green-600 mb-1" />
                      <div className="text-lg font-bold">{Math.round((data.devices.desktop / data.overview.totalVisits) * 100)}%</div>
                      <div className="text-xs text-gray-500">Desktop</div>
                    </div>
                    
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <Tablet className="h-6 w-6 mx-auto text-purple-600 mb-1" />
                      <div className="text-lg font-bold">{Math.round((data.devices.tablet / data.overview.totalVisits) * 100)}%</div>
                      <div className="text-xs text-gray-500">Tablette</div>
                    </div>
                  </div>
                </div>
                
                {/* Géographie */}
                <div>
                  <h3 className="text-sm font-medium mb-3">Top pays</h3>
                  <div className="space-y-2">
                    {data.countries.slice(0, 5).map((country, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                          <span>{country.country}</span>
                        </div>
                        <span className="text-sm font-medium">{country.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Pages */}
        <TabsContent value="pages" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-lg">Pages les plus visitées</CardTitle>
                  <CardDescription>Pages avec le plus de vues sur la période</CardDescription>
                </div>
                <div className="flex gap-3">
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                    <Input placeholder="Rechercher une page..." className="pl-10" />
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => downloadCSV('pages')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Exporter CSV
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[450px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Page</TableHead>
                      <TableHead className="text-right">Vues</TableHead>
                      <TableHead className="text-right">% du total</TableHead>
                      <TableHead className="text-right">Temps moyen</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.topPages.map((page, index) => {
                      const pageViewPercentage = Math.round((page.views / data.overview.pageViews) * 100);
                      
                      return (
                        <TableRow key={index} className="hover:bg-gray-50">
                          <TableCell>
                            <div>
                              <div className="font-medium">{page.path}</div>
                              <div className="text-sm text-gray-500 truncate max-w-md">{page.title}</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatNumber(page.views)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end">
                              <div className="mr-2">{pageViewPercentage}%</div>
                              <div 
                                className="h-2 bg-blue-500 rounded-full" 
                                style={{ width: `${Math.min(pageViewPercentage * 2, 100)}px` }}
                              ></div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            {formatDuration(page.avgTimeOnPage)}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              title="Voir dans l'analyeur"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <p className="text-sm text-gray-500">
                Les temps moyens incluent uniquement les visites sans rebond.
              </p>
            </CardFooter>
          </Card>
          
          {/* Métriques d'engagement */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Pages/Session</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(data.overview.pageViews / data.overview.totalVisits).toFixed(1)}
                </div>
                {calculateTrend(data.overview.pageViews / data.overview.totalVisits, 8)}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Taux de sortie moyen</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(35 + Math.random() * 10)}%
                </div>
                {calculateTrend(35, 5)}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Pages avec conversion</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(data.topPages.length * 0.3)}
                </div>
                <div className="text-xs text-gray-500">
                  Sur {data.topPages.length} pages analysées
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Sources */}
        <TabsContent value="sources" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="md:col-span-3 bg-gradient-to-r from-[#0f4c81] to-[#3b82f6] text-white">
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <Share2 className="mr-2 h-5 w-5" />
                  Sources de trafic
                </CardTitle>
                <CardDescription className="text-white text-opacity-80">
                  Analyse des sources de trafic pour la période
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-8">
                  <div>
                    <div className="text-4xl font-bold">{formatNumber(data.overview.totalVisits)}</div>
                    <p className="text-white text-opacity-80 mt-1">Visites totales</p>
                  </div>
                  
                  <div className="flex-1 grid grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{data.sources[0].percentage}%</div>
                      <p className="text-white text-opacity-80 text-sm">Direct</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{data.sources[1].percentage}%</div>
                      <p className="text-white text-opacity-80 text-sm">Recherche</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{data.sources[2].percentage}%</div>
                      <p className="text-white text-opacity-80 text-sm">Réseaux sociaux</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{data.sources[3].percentage + data.sources[4].percentage}%</div>
                      <p className="text-white text-opacity-80 text-sm">Autres</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Répartition par source */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Répartition détaillée</CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => downloadCSV('sources')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Exporter CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[350px] w-full">
                  {/* Graphique en donuts */}
                  <svg className="w-full h-full" viewBox="0 0 400 350">
                    {/* Définir un donuts avec des couleurs différentes */}
                    <defs>
                      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.1"/>
                      </filter>
                    </defs>
                    
                    {/* Calculer les segments du donuts */}
                    {(() => {
                      const centerX = 200;
                      const centerY = 160;
                      const radius = 120;
                      const innerRadius = 70;
                      
                      let startAngle = 0;
                      
                      const colors = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444'];
                      
                      // Convertir les pourcentages en angles
                      return data.sources.map((source, i) => {
                        const angle = (source.percentage / 100) * 2 * Math.PI;
                        const endAngle = startAngle + angle;
                        
                        // Calculer les points pour l'arc externe
                        const x1 = centerX + radius * Math.cos(startAngle);
                        const y1 = centerY + radius * Math.sin(startAngle);
                        const x2 = centerX + radius * Math.cos(endAngle);
                        const y2 = centerY + radius * Math.sin(endAngle);
                        
                        // Calculer les points pour l'arc interne
                        const x3 = centerX + innerRadius * Math.cos(endAngle);
                        const y3 = centerY + innerRadius * Math.sin(endAngle);
                        const x4 = centerX + innerRadius * Math.cos(startAngle);
                        const y4 = centerY + innerRadius * Math.sin(startAngle);
                        
                        // Créer le chemin pour le segment
                        const path = `M ${x1} ${y1} A ${radius} ${radius} 0 ${angle > Math.PI ? 1 : 0} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${angle > Math.PI ? 1 : 0} 0 ${x4} ${y4} Z`;
                        
                        // Calculer le point pour l'étiquette (au milieu de l'arc)
                        const labelAngle = startAngle + angle / 2;
                        const labelRadius = radius + 20;
                        const labelX = centerX + labelRadius * Math.cos(labelAngle);
                        const labelY = centerY + labelRadius * Math.sin(labelAngle);
                        
                        // Calculer le point pour la ligne
                        const lineStartRadius = radius + 5;
                        const lineStartX = centerX + lineStartRadius * Math.cos(labelAngle);
                        const lineStartY = centerY + lineStartRadius * Math.sin(labelAngle);
                        
                        const result = (
                          <g key={i}>
                            <path 
                              d={path} 
                              fill={colors[i % colors.length]} 
                              filter="url(#shadow)"
                              opacity={0.9}
                            />
                            
                            {/* Ligne vers l'étiquette */}
                            <line 
                              x1={lineStartX} 
                              y1={lineStartY} 
                              x2={labelX - (labelX > centerX ? 20 : -20)} 
                              y2={labelY}
                              stroke="#666"
                              strokeWidth="1"
                              strokeDasharray="2,2"
                            />
                            
                            {/* Text de pourcentage au centre du segment */}
                            <text 
                              x={centerX + (radius + innerRadius) / 2 * Math.cos(labelAngle) * 0.7} 
                              y={centerY + (radius + innerRadius) / 2 * Math.sin(labelAngle) * 0.7} 
                              textAnchor="middle" 
                              fill="white"
                              fontWeight="bold"
                              fontSize="12"
                              dominantBaseline="middle"
                            >
                              {source.percentage}%
                            </text>
                            
                            {/* Étiquette */}
                            <text 
                              x={labelX > centerX ? labelX - 15 : labelX + 15} 
                              y={labelY}
                              textAnchor={labelX > centerX ? "end" : "start"}
                              fontSize="12"
                              fill="#666"
                              dominantBaseline="middle"
                            >
                              {source.source}
                            </text>
                          </g>
                        );
                        
                        // Mettre à jour l'angle de départ pour le prochain segment
                        startAngle = endAngle;
                        
                        return result;
                      });
                    })()}
                    
                    {/* Ajouter une légende en bas */}
                    <g transform="translate(0, 320)">
                      <text x="200" y="0" textAnchor="middle" fontSize="12" fill="#666">
                        Basé sur {formatNumber(data.overview.totalVisits)} visites
                      </text>
                    </g>
                  </svg>
                </div>
              </CardContent>
            </Card>
            
            {/* Référents */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Top référents</CardTitle>
                <CardDescription>
                  Sites qui dirigent le plus de trafic vers vous
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Site</TableHead>
                      <TableHead className="text-right">Visites</TableHead>
                      <TableHead className="text-right">%</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.referrers.map((referrer, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div className="flex items-center">
                            <Link2 className="h-4 w-4 mr-2 text-gray-400" />
                            <span>{referrer.url}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {formatNumber(referrer.visits)}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {referrer.percentage}%
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-4">
                        <Button variant="link" size="sm" className="text-[#0f4c81]">
                          Voir tous les référents
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                
                <div className="mt-6 pt-4 border-t">
                  <h3 className="text-sm font-medium mb-3">Comparaison avec la période précédente</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Badge className="bg-blue-100 text-blue-800 mr-2">Direct</Badge>
                        <ArrowUp className="h-3 w-3 text-green-600 mr-1" />
                        <span className="text-sm text-green-600">+12%</span>
                      </div>
                      <div className="flex items-center">
                        <Badge className="bg-green-100 text-green-800 mr-2">Search</Badge>
                        <ArrowUp className="h-3 w-3 text-green-600 mr-1" />
                        <span className="text-sm text-green-600">+8%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Badge className="bg-purple-100 text-purple-800 mr-2">Social</Badge>
                        <ArrowUp className="h-3 w-3 text-green-600 mr-1" />
                        <span className="text-sm text-green-600">+15%</span>
                      </div>
                      <div className="flex items-center">
                        <Badge className="bg-amber-100 text-amber-800 mr-2">Referral</Badge>
                        <ArrowDown className="h-3 w-3 text-red-600 mr-1" />
                        <span className="text-sm text-red-600">-3%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Recommandations */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recommandations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-blue-800 mb-2">Optimisation SEO</h3>
                  <p className="text-sm text-blue-600">
                    Votre trafic organique représente {data.sources[1].percentage}% des visites. Continuez à améliorer votre SEO pour augmenter cette source de trafic.
                  </p>
                </div>
                
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h3 className="font-medium text-purple-800 mb-2">Réseaux sociaux</h3>
                  <p className="text-sm text-purple-600">
                    Les réseaux sociaux génèrent {data.sources[2].percentage}% du trafic. Intensifiez votre présence sur Instagram qui convertit le mieux.
                  </p>
                </div>
                
                <div className="p-4 bg-amber-50 rounded-lg">
                  <h3 className="font-medium text-amber-800 mb-2">Référencement</h3>
                  <p className="text-sm text-amber-600">
                    Développez des partenariats avec d'autres sites pour augmenter vos référents externes et diversifier vos sources.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Audience */}
        <TabsContent value="audience" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Visiteurs uniques</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(data.overview.uniqueVisitors)}</div>
                {calculateTrend(data.overview.uniqueVisitors)}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(data.overview.totalVisits)}</div>
                {calculateTrend(data.overview.totalVisits)}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Sessions par utilisateur</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(data.overview.totalVisits / data.overview.uniqueVisitors).toFixed(2)}
                </div>
                {calculateTrend(data.overview.totalVisits / data.overview.uniqueVisitors, 8)}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Nouveaux utilisateurs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatNumber(Math.round(data.overview.uniqueVisitors * 0.65))}
                </div>
                <div className="text-xs text-gray-500">
                  {Math.round(65)}% du total
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Géographie et appareils */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Géographie */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Répartition géographique</CardTitle>
                <CardDescription>
                  Pays d'origine des visiteurs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.countries.map((country, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                          <span className="font-medium">{country.country}</span>
                        </div>
                        <span>{formatNumber(country.visits)} ({country.percentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            index === 0 ? 'bg-blue-500' :
                            index === 1 ? 'bg-green-500' :
                            index === 2 ? 'bg-purple-500' :
                            index === 3 ? 'bg-amber-500' :
                            index === 4 ? 'bg-red-500' :
                            'bg-gray-500'
                          }`}
                          style={{ width: `${country.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Carte simplifiée */}
                <div className="mt-6 pt-4 border-t">
                  <h3 className="text-sm font-medium mb-4">Répartition sur la carte</h3>
                  <div className="h-40 bg-blue-50 rounded-lg flex items-center justify-center">
                    <p className="text-blue-700 text-center">
                      {data.countries[0].percentage}% de votre audience est basée au {data.countries[0].country}<br />
                      <span className="text-sm">Cliquez pour voir la carte détaillée</span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Appareils et navigateurs */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Appareils et technologie</CardTitle>
                <CardDescription>
                  Répartition par dispositif, OS et navigateur
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Appareils */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium mb-3">Type d'appareil</h3>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <Smartphone className="h-6 w-6 mx-auto text-blue-600 mb-1" />
                      <div className="text-lg font-bold">{Math.round((data.devices.mobile / data.overview.totalVisits) * 100)}%</div>
                      <div className="text-xs text-gray-500">{formatNumber(data.devices.mobile)} visites</div>
                    </div>
                    
                    <div className="p-3 bg-green-50 rounded-lg">
                      <Monitor className="h-6 w-6 mx-auto text-green-600 mb-1" />
                      <div className="text-lg font-bold">{Math.round((data.devices.desktop / data.overview.totalVisits) * 100)}%</div>
                      <div className="text-xs text-gray-500">{formatNumber(data.devices.desktop)} visites</div>
                    </div>
                    
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <Tablet className="h-6 w-6 mx-auto text-purple-600 mb-1" />
                      <div className="text-lg font-bold">{Math.round((data.devices.tablet / data.overview.totalVisits) * 100)}%</div>
                      <div className="text-xs text-gray-500">{formatNumber(data.devices.tablet)} visites</div>
                    </div>
                  </div>
                </div>
                
                {/* OS et Navigateurs */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium mb-3">Systèmes d'exploitation</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Android</span>
                        <span className="font-medium">42%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>iOS</span>
                        <span className="font-medium">35%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Windows</span>
                        <span className="font-medium">18%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>macOS</span>
                        <span className="font-medium">5%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-3">Navigateurs</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Chrome</span>
                        <span className="font-medium">55%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Safari</span>
                        <span className="font-medium">25%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Firefox</span>
                        <span className="font-medium">12%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Autres</span>
                        <span className="font-medium">8%</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t">
                  <h3 className="text-sm font-medium mb-3">Vitesse de chargement</h3>
                  <div className="flex justify-between">
                    <div>
                      <span className="text-2xl font-bold">2.4s</span>
                      <p className="text-xs text-gray-500">Temps moyen</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-green-600">Bon</span>
                      <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Comportement */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Comportement des utilisateurs</CardTitle>
              <CardDescription>
                Analyse du comportement et de l'engagement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Fidélité</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Nouveaux visiteurs</span>
                      <span className="font-medium">65%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Visiteurs récurrents</span>
                      <span className="font-medium">35%</span>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <h4 className="text-xs font-medium text-gray-500 mb-2">Répartition des sessions récurrentes</h4>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>2-5 sessions</span>
                        <span>68%</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>6-10 sessions</span>
                        <span>22%</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>11+ sessions</span>
                        <span>10%</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Engagement</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-blue-50 rounded-lg text-center">
                      <div className="text-lg font-bold">{formatDuration(data.overview.avgSessionDuration)}</div>
                      <div className="text-xs text-gray-500">Durée moyenne</div>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg text-center">
                      <div className="text-lg font-bold">
                        {(data.overview.pageViews / data.overview.totalVisits).toFixed(1)}
                      </div>
                      <div className="text-xs text-gray-500">Pages/Session</div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Interaction</h3>
                  <div className="space-y-4">
                    <div className="p-3 rounded-lg border border-gray-200">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Taux de clics</span>
                        <span className="text-sm font-medium">4.2%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '42%' }}></div>
                      </div>
                    </div>
                    
                    <div className="p-3 rounded-lg border border-gray-200">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Taux de conversion</span>
                        <span className="text-sm font-medium">1.8%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '18%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default withAdminAuth(TrafficPage);