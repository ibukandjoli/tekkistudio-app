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
  CardTitle,
  CardFooter,
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
import {
  DollarSign,
  TrendingUp,
  Users,
  Eye,
  Calendar,
  Clock,
  ArrowUp,
  ArrowDown,
  GraduationCap,
  Banknote,
  Loader2,
  RefreshCw,
  Download,
  Activity,
  Globe,
  MousePointer,
  Share2,
  MapPin,
  Monitor,
  Smartphone,
  Tablet,
  Search,
  Link2,
  ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner';

// ─── Interfaces ───────────────────────────────────────────────────────────────

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

  // Trafic (données legacy analytics)
  dailyVisits: Record<string, number>;
  totalVisits: number;
  sources: Record<string, number>;

  // Business
  businessPerformance: Array<{
    id: string;
    name: string;
    price: number;
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

interface TrafficData {
  overview: {
    totalVisits: number;
    uniqueVisitors: number;
    pageViews: number;
    avgSessionDuration: number;
    bounceRate: number;
  };
  dailyVisits: Record<string, {
    visits: number;
    uniqueVisitors: number;
    pageViews: number;
  }>;
  sources: Array<{
    source: string;
    visits: number;
    percentage: number;
  }>;
  topPages: Array<{
    path: string;
    title: string;
    views: number;
    avgTimeOnPage: number;
  }>;
  devices: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  countries: Array<{
    country: string;
    visits: number;
    percentage: number;
  }>;
  referrers: Array<{
    url: string;
    visits: number;
    percentage: number;
  }>;
}

// ─── Utilitaires ──────────────────────────────────────────────────────────────

const formatPrice = (amount: number) =>
  amount.toLocaleString('fr-FR') + ' FCFA';

const formatNumber = (num: number) => num.toLocaleString('fr-FR');

const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
const daysOfWeek = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

// ─── Génération de données trafic simulées ────────────────────────────────────

const generateSimulatedTrafficData = (period: string): TrafficData => {
  let days = 30;
  switch (period) {
    case '7d': days = 7; break;
    case '30d': days = 30; break;
    case '90d': days = 90; break;
    case 'year': days = 365; break;
  }

  const factor = Math.sqrt(days / 30);
  const dailyVisits: Record<string, { visits: number; uniqueVisitors: number; pageViews: number }> = {};
  const today = new Date();

  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - (days - i - 1));
    const dateKey = date.toISOString().split('T')[0];

    const recencyFactor = 1 + (i / days) * 0.5;
    const baseVisits = Math.round(100 * factor * recencyFactor);
    const weekdayFactor = date.getDay() === 0 || date.getDay() === 6 ? 0.7 : 1;

    const visits = Math.round(baseVisits * weekdayFactor * (0.8 + Math.random() * 0.4));
    const uniqueVisitors = Math.round(visits * (0.6 + Math.random() * 0.2));
    const pageViews = Math.round(visits * (2 + Math.random() * 1.5));

    dailyVisits[dateKey] = { visits, uniqueVisitors, pageViews };
  }

  const totalVisits = Object.values(dailyVisits).reduce((sum, day) => sum + day.visits, 0);
  const totalUniqueVisitors = Math.round(totalVisits * 0.7);
  const totalPageViews = Object.values(dailyVisits).reduce((sum, day) => sum + day.pageViews, 0);

  const sources = [
    { source: "Direct", visits: Math.round(totalVisits * 0.35), percentage: 35 },
    { source: "Organic Search", visits: Math.round(totalVisits * 0.25), percentage: 25 },
    { source: "Social Media", visits: Math.round(totalVisits * 0.20), percentage: 20 },
    { source: "Referral", visits: Math.round(totalVisits * 0.15), percentage: 15 },
    { source: "Email", visits: Math.round(totalVisits * 0.05), percentage: 5 }
  ];

  const topPages = [
    { path: "/", title: "Accueil - TEKKI Studio", views: Math.round(totalPageViews * 0.3), avgTimeOnPage: 75 },
    { path: "/businesses", title: "Business en vente - TEKKI Studio", views: Math.round(totalPageViews * 0.2), avgTimeOnPage: 120 },
    { path: "/formations", title: "Nos formations - TEKKI Studio", views: Math.round(totalPageViews * 0.15), avgTimeOnPage: 105 },
    { path: "/marques", title: "Nos marques - TEKKI Studio", views: Math.round(totalPageViews * 0.1), avgTimeOnPage: 90 },
    { path: "/about", title: "À propos - TEKKI Studio", views: Math.round(totalPageViews * 0.08), avgTimeOnPage: 60 },
    { path: "/contact", title: "Contact - TEKKI Studio", views: Math.round(totalPageViews * 0.07), avgTimeOnPage: 45 },
    { path: "/blog/ecommerce-senegal", title: "E-commerce au Sénégal - TEKKI Studio", views: Math.round(totalPageViews * 0.06), avgTimeOnPage: 180 },
    { path: "/blog/marques-locales", title: "Créer des marques locales - TEKKI Studio", views: Math.round(totalPageViews * 0.04), avgTimeOnPage: 150 }
  ];

  const devices = {
    mobile: Math.round(totalVisits * (0.55 + Math.random() * 0.1)),
    desktop: Math.round(totalVisits * (0.35 + Math.random() * 0.1)),
    tablet: 0
  };
  devices.tablet = Math.max(0, totalVisits - devices.mobile - devices.desktop);

  const countries = [
    { country: "Sénégal", visits: Math.round(totalVisits * 0.65), percentage: 65 },
    { country: "Côte d'Ivoire", visits: Math.round(totalVisits * 0.12), percentage: 12 },
    { country: "Mali", visits: Math.round(totalVisits * 0.08), percentage: 8 },
    { country: "France", visits: Math.round(totalVisits * 0.06), percentage: 6 },
    { country: "Maroc", visits: Math.round(totalVisits * 0.04), percentage: 4 },
    { country: "Autres", visits: Math.round(totalVisits * 0.05), percentage: 5 }
  ];

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
      avgSessionDuration: Math.round(120 + Math.random() * 60),
      bounceRate: Math.round(50 + Math.random() * 20)
    },
    dailyVisits,
    sources,
    topPages,
    devices,
    countries,
    referrers
  };
};

// ─── Composant principal ──────────────────────────────────────────────────────

function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [trafficLoading, setTrafficLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('30d');

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

  const [trafficData, setTrafficData] = useState<TrafficData>({
    overview: { totalVisits: 0, uniqueVisitors: 0, pageViews: 0, avgSessionDuration: 0, bounceRate: 0 },
    dailyVisits: {},
    sources: [],
    topPages: [],
    devices: { desktop: 0, mobile: 0, tablet: 0 },
    countries: [],
    referrers: []
  });

  useEffect(() => {
    fetchAnalyticsData();
    fetchTrafficData();
  }, [timeRange]);

  // ─── Fetch analytics (Supabase) ─────────────────────────────────────────────

  const fetchAnalyticsData = async () => {
    setLoading(true);
    setError(null);

    try {
      const now = new Date();
      let startDate = new Date();

      switch (timeRange) {
        case '7d': startDate.setDate(now.getDate() - 7); break;
        case '30d': startDate.setDate(now.getDate() - 30); break;
        case '90d': startDate.setDate(now.getDate() - 90); break;
        case 'year': startDate.setFullYear(now.getFullYear() - 1); break;
      }

      const { data: interests, error: interestsError } = await supabase
        .from('business_interests')
        .select('id, business_id, status, payment_option, created_at')
        .gte('created_at', startDate.toISOString());

      if (interestsError) throw interestsError;

      const { data: businesses, error: businessesError } = await supabase
        .from('businesses')
        .select('id, name, price, category');

      if (businessesError) throw businessesError;

      const businessMap: Record<string, { name: string; price: number; category: string }> = {};
      businesses.forEach(b => {
        businessMap[b.id] = { name: b.name, price: b.price, category: b.category };
      });

      let totalRevenue = 0;
      let pendingRevenue = 0;
      const monthlyRevenue: Record<string, number> = {};

      const totalLeads = interests.length;
      const totalSold = interests.filter(i => i.status === 'sold').length;
      const totalNegotiating = interests.filter(i => i.status === 'negotiating').length;

      const businessPerformanceMap: Record<string, {
        id: string; name: string; price: number; sales: number; visits: number; leads: number;
      }> = {};
      const categoryPerformanceMap: Record<string, { sales: number; leads: number }> = {};
      const dailyVisits: Record<string, number> = {};

      for (let i = 0; i < 12; i++) {
        const month = new Date(now.getFullYear(), i, 1).toISOString().substring(0, 7);
        monthlyRevenue[month] = 0;
      }

      for (let i = 0; i < 30; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateKey = date.toISOString().substring(0, 10);
        dailyVisits[dateKey] = Math.floor(Math.random() * 100) + 50;
      }

      interests.forEach(interest => {
        if (interest.business_id && businessMap[interest.business_id]) {
          const price = businessMap[interest.business_id].price;
          const businessName = businessMap[interest.business_id].name;
          const category = businessMap[interest.business_id].category;

          if (interest.status === 'sold') {
            const salePrice = interest.payment_option === 'full' ? price * 0.95 : price;
            totalRevenue += salePrice;
            const month = interest.created_at.substring(0, 7);
            monthlyRevenue[month] = (monthlyRevenue[month] || 0) + salePrice;

            if (!businessPerformanceMap[interest.business_id]) {
              businessPerformanceMap[interest.business_id] = {
                id: interest.business_id,
                name: businessName,
                price,
                sales: 0,
                visits: Math.floor(Math.random() * 200) + 100,
                leads: 0
              };
            }
            businessPerformanceMap[interest.business_id].sales += salePrice;

            if (!categoryPerformanceMap[category]) {
              categoryPerformanceMap[category] = { sales: 0, leads: 0 };
            }
            categoryPerformanceMap[category].sales += salePrice;
          }

          if (interest.status === 'negotiating') {
            pendingRevenue += price;
          }

          if (businessPerformanceMap[interest.business_id]) {
            businessPerformanceMap[interest.business_id].leads++;
          } else {
            businessPerformanceMap[interest.business_id] = {
              id: interest.business_id,
              name: businessName,
              price,
              sales: 0,
              visits: Math.floor(Math.random() * 200) + 100,
              leads: 1
            };
          }

          if (categoryPerformanceMap[category]) {
            categoryPerformanceMap[category].leads++;
          } else {
            categoryPerformanceMap[category] = { sales: 0, leads: 1 };
          }
        }
      });

      const businessPerformance = Object.values(businessPerformanceMap).map(bp => ({
        ...bp,
        conversionRate: bp.leads > 0 ? (bp.sales / (bp.price || 1)) / bp.leads * 100 : 0
      })).sort((a, b) => b.sales - a.sales);

      const categoryPerformance = Object.entries(categoryPerformanceMap).map(([category, d]) => ({
        category, ...d
      })).sort((a, b) => b.sales - a.sales);

      const sources = {
        'Direct': 35,
        'Social Media': 25,
        'Organic Search': 20,
        'Referral': 15,
        'Email': 5
      };

      const totalVisits = Object.values(dailyVisits).reduce((sum, v) => sum + v, 0);
      const conversionRate = totalVisits > 0 ? (totalLeads / totalVisits) * 100 : 0;

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

  // ─── Fetch traffic (simulated) ──────────────────────────────────────────────

  const fetchTrafficData = async () => {
    setTrafficLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      setTrafficData(generateSimulatedTrafficData(timeRange));
    } catch (err) {
      console.error('Erreur lors du chargement des données de trafic:', err);
    } finally {
      setTrafficLoading(false);
    }
  };

  // ─── Helpers de graphiques ──────────────────────────────────────────────────

  const getVisitChartData = () =>
    Object.entries(data.dailyVisits)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-14)
      .map(([date, count]) => {
        const d = new Date(date);
        return { date: `${d.getDate()}/${d.getMonth() + 1}`, day: daysOfWeek[d.getDay()], visits: count as number };
      });

  const getRevenueChartData = () =>
    Object.entries(data.monthlyRevenue)
      .map(([month, revenue]) => ({
        month: months[parseInt(month.split('-')[1]) - 1],
        revenue
      }))
      .slice(-6);

  const getDailyTrafficData = () =>
    Object.entries(trafficData.dailyVisits)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, d]) => ({
        date,
        visits: d.visits,
        uniqueVisitors: d.uniqueVisitors,
        pageViews: d.pageViews,
        displayDate: new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })
      }));

  // Indicateur de tendance
  const getTrend = (positive?: boolean) => {
    const isPositive = positive !== undefined ? positive : Math.random() > 0.3;
    const percentage = Math.floor(Math.random() * 20) + 5;
    return (
      <span className={`flex items-center text-xs font-medium ${isPositive ? 'text-green-600' : 'text-red-500'}`}>
        {isPositive ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
        <span>{percentage}% {isPositive ? 'de hausse' : 'de baisse'}</span>
      </span>
    );
  };

  // ─── CSV downloads ───────────────────────────────────────────────────────────

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
      case 'traffic-daily':
        csvContent = 'Date,Visites,Visiteurs uniques,Pages vues\n';
        csvContent += Object.entries(trafficData.dailyVisits)
          .sort((a, b) => a[0].localeCompare(b[0]))
          .map(([date, d]) => `${date},${d.visits},${d.uniqueVisitors},${d.pageViews}`)
          .join('\n');
        filename = `trafic_quotidien_${new Date().toISOString().split('T')[0]}.csv`;
        break;
      case 'traffic-pages':
        csvContent = 'URL,Titre,Vues,Temps moyen (s)\n';
        csvContent += trafficData.topPages
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

  // ─── Loading / Error states ──────────────────────────────────────────────────

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
        <Button onClick={fetchAnalyticsData} className="flex items-center bg-[#0f4c81]">
          <RefreshCw className="h-4 w-4 mr-2" />
          Réessayer
        </Button>
      </div>
    );
  }

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Header */}
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
            onClick={() => { fetchAnalyticsData(); fetchTrafficData(); }}
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
          <TabsTrigger value="leads">Leads & Conversions</TabsTrigger>
          <TabsTrigger value="traffic">Trafic & Audience</TabsTrigger>
        </TabsList>

        {/* ══════════════════════════════════════════════════════════════════════
            TAB 1 — Vue d'ensemble
        ══════════════════════════════════════════════════════════════════════ */}
        <TabsContent value="overview" className="space-y-6">
          {/* KPIs principaux */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-white border-l-4 border-l-green-500">
              <CardHeader className="pb-1">
                <CardTitle className="text-sm font-semibold">Chiffre d'affaires total</CardTitle>
                <CardDescription className="text-xs">Revenus réalisés sur la période</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatPrice(data.totalRevenue)}</div>
                {getTrend(true)}
              </CardContent>
            </Card>

            <Card className="bg-white border-l-4 border-l-blue-500">
              <CardHeader className="pb-1">
                <CardTitle className="text-sm font-semibold">Leads générés</CardTitle>
                <CardDescription className="text-xs">Contacts qualifiés reçus</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.totalLeads}</div>
                {getTrend(true)}
              </CardContent>
            </Card>

            <Card className="bg-white border-l-4 border-l-purple-500">
              <CardHeader className="pb-1">
                <CardTitle className="text-sm font-semibold">Taux de conversion</CardTitle>
                <CardDescription className="text-xs">% de visites transformées en leads</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.conversionRate.toFixed(1)}%</div>
                {getTrend(data.conversionRate > 2)}
              </CardContent>
            </Card>

            <Card className="bg-white border-l-4 border-l-blue-400">
              <CardHeader className="pb-1">
                <CardTitle className="text-sm font-semibold">Visites totales</CardTitle>
                <CardDescription className="text-xs">Pages vues sur le site</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatNumber(trafficData.overview.totalVisits)}</div>
                {getTrend(true)}
              </CardContent>
            </Card>
          </div>

          {/* Graphiques */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Revenus mensuels */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Évolution des revenus</CardTitle>
                <CardDescription>6 derniers mois</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px] w-full relative">
                  <div className="absolute inset-0 flex items-end justify-around px-4">
                    {getRevenueChartData().map((item, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div
                          className="w-10 bg-gradient-to-t from-[#0f4c81] to-[#3b82f6] rounded-t"
                          style={{
                            height: `${Math.max((item.revenue / Math.max(...getRevenueChartData().map(d => d.revenue), 1)) * 180, 10)}px`
                          }}
                        />
                        <div className="text-xs mt-2 text-gray-600">{item.month}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trafic quotidien */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Trafic quotidien</CardTitle>
                <CardDescription>14 derniers jours</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px] w-full relative">
                  <div className="absolute inset-0">
                    <svg className="w-full h-full" viewBox="0 0 300 200" preserveAspectRatio="none">
                      <path
                        d={`M 10 ${200 - (getVisitChartData()[0]?.visits / 150) * 180} ${
                          getVisitChartData().map((d, i) => {
                            const x = 10 + (i * (280 / Math.max(getVisitChartData().length - 1, 1)));
                            const y = 200 - (d.visits / 150) * 180;
                            return `L ${x} ${y}`;
                          }).join(' ')
                        }`}
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="2"
                      />
                      {getVisitChartData().map((d, i) => {
                        const x = 10 + (i * (280 / Math.max(getVisitChartData().length - 1, 1)));
                        const y = 200 - (d.visits / 150) * 180;
                        return <circle key={i} cx={x} cy={y} r="3" fill="#3b82f6" />;
                      })}
                    </svg>
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
                <Button variant="outline" size="sm" onClick={() => downloadCSV('business')} className="text-xs">
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
                      <th className="text-left py-2 px-2 text-sm">Business</th>
                      <th className="text-right py-2 px-2 text-sm">Ventes</th>
                      <th className="text-right py-2 px-2 text-sm">Leads</th>
                      <th className="text-right py-2 px-2 text-sm">Taux conv.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.businessPerformance.slice(0, 5).map((business, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="py-2 px-2">{business.name}</td>
                        <td className="text-right py-2 px-2">{formatPrice(business.sales)}</td>
                        <td className="text-right py-2 px-2">{business.leads}</td>
                        <td className="text-right py-2 px-2">
                          <span className={business.conversionRate > 10 ? 'text-green-600 font-medium' : 'text-amber-600'}>
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
        </TabsContent>

        {/* ══════════════════════════════════════════════════════════════════════
            TAB 2 — Revenus
        ══════════════════════════════════════════════════════════════════════ */}
        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="md:col-span-3 bg-gradient-to-r from-[#0f4c81] to-[#3b82f6] text-white">
              <CardHeader>
                <CardTitle className="text-xl">Revenus totaux</CardTitle>
                <CardDescription className="text-blue-100">
                  Période : {timeRange === '7d' ? '7 derniers jours' : timeRange === '30d' ? '30 derniers jours' : timeRange === '90d' ? '3 derniers mois' : '12 derniers mois'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">{formatPrice(data.totalRevenue)}</div>
                {getTrend(true)}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-1">
                <CardTitle className="text-sm font-semibold">Ventes conclues</CardTitle>
                <CardDescription className="text-xs">Nombre de business vendus</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.totalSold}</div>
                <div className="text-xs text-gray-500">sur {data.totalLeads} leads</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-1">
                <CardTitle className="text-sm font-semibold">En négociation</CardTitle>
                <CardDescription className="text-xs">Prospects encore en cours</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.totalNegotiating}</div>
                <div className="text-xs text-gray-500">
                  Potentiel : {formatPrice(data.pendingRevenue)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-1">
                <CardTitle className="text-sm font-semibold">Taux de conversion</CardTitle>
                <CardDescription className="text-xs">Leads transformés en ventes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {data.totalLeads > 0 ? (data.totalSold / data.totalLeads * 100).toFixed(1) : '0'}%
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Graphique revenus mensuels */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-lg">Évolution des revenus</CardTitle>
                  <CardDescription>Analyse mensuelle</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => downloadCSV('revenue')}>
                  <Download className="h-4 w-4 mr-2" />
                  Exporter CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] w-full relative">
                <div className="absolute inset-0 flex items-end justify-around px-4">
                  {getRevenueChartData().map((item, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div className="text-xs text-gray-500 mb-2">{formatPrice(item.revenue)}</div>
                      <div
                        className="w-16 bg-gradient-to-t from-[#0f4c81] to-[#3b82f6] rounded-t"
                        style={{
                          height: `${Math.max((item.revenue / Math.max(...getRevenueChartData().map(d => d.revenue), 1)) * 250, 10)}px`
                        }}
                      />
                      <div className="text-sm mt-2 font-medium">{item.month}</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Revenus par catégorie */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Revenus par catégorie</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.categoryPerformance.map((category, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{category.category}</span>
                        <span>{formatPrice(category.sales)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-[#0f4c81] h-2 rounded-full"
                          style={{ width: `${data.totalRevenue > 0 ? (category.sales / data.totalRevenue) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Indicateurs clés revenus */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Indicateurs clés</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center">
                  <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                    <DollarSign className="h-7 w-7 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Valeur moyenne par vente</div>
                    <div className="text-xl font-bold">
                      {data.totalSold > 0 ? formatPrice(data.totalRevenue / data.totalSold) : 'N/A'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mr-4">
                    <Activity className="h-7 w-7 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Progression vs période précédente</div>
                    <div className="text-xl font-bold text-green-600">+18.5%</div>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                    <Clock className="h-7 w-7 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Temps moyen de conversion</div>
                    <div className="text-xl font-bold">14 jours</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ══════════════════════════════════════════════════════════════════════
            TAB 3 — Leads & Conversions
        ══════════════════════════════════════════════════════════════════════ */}
        <TabsContent value="leads" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-1">
                <CardTitle className="text-sm font-semibold">Total business</CardTitle>
                <CardDescription className="text-xs">En vente actuellement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.businessPerformance.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-1">
                <CardTitle className="text-sm font-semibold">Ventes totales</CardTitle>
                <CardDescription className="text-xs">Business finalisés</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.totalSold}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-1">
                <CardTitle className="text-sm font-semibold">CA moyen par business</CardTitle>
                <CardDescription className="text-xs">Revenu moyen généré</CardDescription>
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
              <CardHeader className="pb-1">
                <CardTitle className="text-sm font-semibold">Taux de conversion moyen</CardTitle>
                <CardDescription className="text-xs">Leads → ventes par business</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(data.businessPerformance.reduce((sum, b) => sum + (b.leads > 0 ? b.sales / b.leads : 0), 0) /
                    (data.businessPerformance.length || 1)).toFixed(1)}%
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance des business */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Performance des business</CardTitle>
                <Button variant="outline" size="sm" onClick={() => downloadCSV('business')}>
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
                      <th className="text-left py-3 px-4 text-sm">Business</th>
                      <th className="text-right py-3 px-4 text-sm">Ventes</th>
                      <th className="text-right py-3 px-4 text-sm">Leads</th>
                      <th className="text-right py-3 px-4 text-sm">Visites</th>
                      <th className="text-right py-3 px-4 text-sm">Taux conv.</th>
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
                          <span className={business.conversionRate > 10 ? 'text-green-600' : 'text-amber-600'}>
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
                <div className="space-y-5">
                  {data.categoryPerformance.map((category, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{category.category}</span>
                        <span>{formatPrice(category.sales)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-[#0f4c81] h-2 rounded-full"
                          style={{ width: `${data.totalRevenue > 0 ? (category.sales / data.totalRevenue) * 100 : 0}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-500 flex justify-between">
                        <span>{category.leads} leads</span>
                        <span>Conv. : {category.leads > 0 ? ((category.sales / category.leads) * 100).toFixed(1) : 0}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Insights */}
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
                          Les catégories <strong>{data.categoryPerformance[0]?.category}</strong> et <strong>{data.categoryPerformance[1]?.category}</strong> représentent{' '}
                          {Math.round(((data.categoryPerformance[0]?.sales || 0) + (data.categoryPerformance[1]?.sales || 0)) / (data.totalRevenue || 1) * 100)}% du CA total.
                        </span>
                      ) : <span>Données insuffisantes</span>}
                    </div>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="text-sm text-green-700 font-medium mb-1">Meilleur taux de conversion</div>
                    <div className="text-sm">
                      {data.businessPerformance.length > 0 ? (
                        <span>
                          <strong>{[...data.businessPerformance].sort((a, b) => b.conversionRate - a.conversionRate)[0]?.name}</strong> avec{' '}
                          {[...data.businessPerformance].sort((a, b) => b.conversionRate - a.conversionRate)[0]?.conversionRate.toFixed(1)}% de conversion.
                        </span>
                      ) : <span>Données insuffisantes</span>}
                    </div>
                  </div>

                  <div className="p-4 bg-amber-50 rounded-lg">
                    <div className="text-sm text-amber-700 font-medium mb-1">Opportunités d'amélioration</div>
                    <div className="text-sm">
                      {data.businessPerformance.filter(b => b.leads > 5 && b.conversionRate < 5).length > 0 ? (
                        <span>
                          <strong>{data.businessPerformance.filter(b => b.leads > 5 && b.conversionRate < 5).map(b => b.name).join(', ')}</strong>{' '}
                          ont un taux de conversion faible malgré un bon nombre de leads.
                        </span>
                      ) : <span>Aucun business ne présente de problème notable de conversion.</span>}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ══════════════════════════════════════════════════════════════════════
            TAB 4 — Trafic & Audience
        ══════════════════════════════════════════════════════════════════════ */}
        <TabsContent value="traffic" className="space-y-6">
          {trafficLoading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <Loader2 className="h-10 w-10 animate-spin text-[#0f4c81] mb-4" />
              <p className="text-gray-500">Chargement des données de trafic...</p>
            </div>
          ) : (
            <>
              {/* KPIs trafic */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <Card className="bg-white border-l-4 border-l-blue-500">
                  <CardHeader className="pb-1">
                    <CardTitle className="text-sm font-semibold">Visites totales</CardTitle>
                    <CardDescription className="text-xs">Nombre de sessions sur le site</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatNumber(trafficData.overview.totalVisits)}</div>
                    {getTrend(true)}
                  </CardContent>
                </Card>

                <Card className="bg-white border-l-4 border-l-purple-500">
                  <CardHeader className="pb-1">
                    <CardTitle className="text-sm font-semibold">Visiteurs uniques</CardTitle>
                    <CardDescription className="text-xs">Personnes distinctes qui ont visité</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatNumber(trafficData.overview.uniqueVisitors)}</div>
                    {getTrend(true)}
                  </CardContent>
                </Card>

                <Card className="bg-white border-l-4 border-l-green-500">
                  <CardHeader className="pb-1">
                    <CardTitle className="text-sm font-semibold">Pages vues</CardTitle>
                    <CardDescription className="text-xs">Total des pages consultées</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatNumber(trafficData.overview.pageViews)}</div>
                    {getTrend(true)}
                  </CardContent>
                </Card>

                <Card className="bg-white border-l-4 border-l-amber-500">
                  <CardHeader className="pb-1">
                    <CardTitle className="text-sm font-semibold">Durée moy. de visite</CardTitle>
                    <CardDescription className="text-xs">Temps passé par session</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatDuration(trafficData.overview.avgSessionDuration)}</div>
                    {getTrend(true)}
                  </CardContent>
                </Card>

                <Card className="bg-white border-l-4 border-l-red-400">
                  <CardHeader className="pb-1">
                    <CardTitle className="text-sm font-semibold">Taux de rebond</CardTitle>
                    <CardDescription className="text-xs">Visiteurs qui repartent sans cliquer</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{trafficData.overview.bounceRate}%</div>
                    <div className={`flex items-center text-xs font-medium ${trafficData.overview.bounceRate > 60 ? 'text-red-500' : 'text-green-600'}`}>
                      {trafficData.overview.bounceRate > 60
                        ? <><ArrowUp className="h-3 w-3 mr-1" /><span>Trop élevé</span></>
                        : <><ArrowDown className="h-3 w-3 mr-1" /><span>Correct</span></>
                      }
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Graphique visites quotidiennes */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-lg">Évolution des visites</CardTitle>
                      <CardDescription>Trafic quotidien sur la période</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => downloadCSV('traffic-daily')}>
                      <Download className="h-4 w-4 mr-2" />
                      Exporter CSV
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full relative">
                    <div className="absolute inset-0">
                      <svg className="w-full h-full" viewBox="0 0 600 250" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="trafficGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        {(() => {
                          const dailyData = getDailyTrafficData();
                          if (dailyData.length < 2) return null;
                          const maxVisits = Math.max(...dailyData.map(d => d.visits)) * 1.1;
                          const displayCount = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 30;
                          const step = Math.max(1, Math.floor(dailyData.length / displayCount));
                          const filtered = dailyData.filter((_, i) => i % step === 0 || i === dailyData.length - 1);

                          const points = filtered.map((d, i) => [
                            20 + (i * (560 / Math.max(filtered.length - 1, 1))),
                            240 - (d.visits / maxVisits) * 210
                          ]);

                          const linePath = `M ${points[0][0]} ${points[0][1]} ${points.slice(1).map(([x, y]) => `L ${x} ${y}`).join(' ')}`;
                          const areaPath = `${linePath} L ${points[points.length - 1][0]} 240 L ${points[0][0]} 240 Z`;

                          return (
                            <>
                              <path d={areaPath} fill="url(#trafficGradient)" />
                              <path d={linePath} fill="none" stroke="#3b82f6" strokeWidth="2" />
                              {points.map(([x, y], i) => (
                                <circle key={i} cx={x} cy={y} r="3" fill="#3b82f6" />
                              ))}
                              <line x1="20" y1="240" x2="580" y2="240" stroke="#e5e7eb" strokeWidth="1" />
                            </>
                          );
                        })()}
                      </svg>
                      <div className="absolute bottom-0 left-0 right-0 flex justify-between px-4 pb-2">
                        {(() => {
                          const dailyData = getDailyTrafficData();
                          const count = timeRange === '7d' ? 7 : 8;
                          const step = Math.max(1, Math.floor(dailyData.length / count));
                          return dailyData.filter((_, i) => i % step === 0 || i === dailyData.length - 1).map((d, i) => (
                            <div key={i} className="text-xs text-gray-500">{d.displayDate}</div>
                          ));
                        })()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Sources et appareils */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Sources de trafic */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">D'où viennent vos visiteurs ?</CardTitle>
                    <CardDescription>Sources de trafic sur la période</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {trafficData.sources.map((source, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{source.source}</span>
                            <span className="text-sm">{formatNumber(source.visits)} <span className="text-gray-400">({source.percentage}%)</span></span>
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
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Appareils */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Appareils utilisés</CardTitle>
                    <CardDescription>Répartition mobile / desktop / tablette</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <Smartphone className="h-7 w-7 mx-auto text-blue-600 mb-2" />
                        <div className="text-2xl font-bold text-blue-700">
                          {Math.round((trafficData.devices.mobile / Math.max(trafficData.overview.totalVisits, 1)) * 100)}%
                        </div>
                        <div className="text-xs text-gray-500 mt-1">Mobile</div>
                        <div className="text-xs text-blue-600">{formatNumber(trafficData.devices.mobile)} visites</div>
                      </div>

                      <div className="p-4 bg-green-50 rounded-lg">
                        <Monitor className="h-7 w-7 mx-auto text-green-600 mb-2" />
                        <div className="text-2xl font-bold text-green-700">
                          {Math.round((trafficData.devices.desktop / Math.max(trafficData.overview.totalVisits, 1)) * 100)}%
                        </div>
                        <div className="text-xs text-gray-500 mt-1">Desktop</div>
                        <div className="text-xs text-green-600">{formatNumber(trafficData.devices.desktop)} visites</div>
                      </div>

                      <div className="p-4 bg-purple-50 rounded-lg">
                        <Tablet className="h-7 w-7 mx-auto text-purple-600 mb-2" />
                        <div className="text-2xl font-bold text-purple-700">
                          {Math.round((trafficData.devices.tablet / Math.max(trafficData.overview.totalVisits, 1)) * 100)}%
                        </div>
                        <div className="text-xs text-gray-500 mt-1">Tablette</div>
                        <div className="text-xs text-purple-600">{formatNumber(trafficData.devices.tablet)} visites</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Pages populaires */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-lg">Pages les plus visitées</CardTitle>
                      <CardDescription>Contenu qui attire le plus vos visiteurs</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => downloadCSV('traffic-pages')}>
                      <Download className="h-4 w-4 mr-2" />
                      Exporter CSV
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Page</TableHead>
                        <TableHead className="text-right">Vues</TableHead>
                        <TableHead className="text-right">% du total</TableHead>
                        <TableHead className="text-right">Temps moyen</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {trafficData.topPages.map((page, index) => {
                        const pct = Math.round((page.views / Math.max(trafficData.overview.pageViews, 1)) * 100);
                        return (
                          <TableRow key={index} className="hover:bg-gray-50">
                            <TableCell>
                              <div className="font-medium">{page.path}</div>
                              <div className="text-xs text-gray-500 truncate max-w-xs">{page.title}</div>
                            </TableCell>
                            <TableCell className="text-right font-medium">{formatNumber(page.views)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <span>{pct}%</span>
                                <div className="h-1.5 bg-blue-500 rounded-full" style={{ width: `${Math.min(pct * 2, 80)}px` }} />
                              </div>
                            </TableCell>
                            <TableCell className="text-right">{formatDuration(page.avgTimeOnPage)}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter className="border-t px-6 py-3">
                  <p className="text-xs text-gray-400">Les temps moyens excluent les visites avec rebond immédiat.</p>
                </CardFooter>
              </Card>

              {/* Géographie et référents */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Géographie */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Répartition géographique</CardTitle>
                    <CardDescription>Pays d'origine de vos visiteurs</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {trafficData.countries.map((country, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                              <span className="font-medium">{country.country}</span>
                            </div>
                            <span className="text-sm">{formatNumber(country.visits)} <span className="text-gray-400">({country.percentage}%)</span></span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full ${
                                index === 0 ? 'bg-blue-500' :
                                index === 1 ? 'bg-green-500' :
                                index === 2 ? 'bg-purple-500' :
                                index === 3 ? 'bg-amber-500' :
                                'bg-gray-400'
                              }`}
                              style={{ width: `${country.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-5 pt-4 border-t bg-blue-50 rounded-lg p-4 text-center">
                      <p className="text-blue-700 text-sm font-medium">
                        {trafficData.countries[0]?.percentage}% de votre audience est basée au {trafficData.countries[0]?.country}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Référents + technologie */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Sites référents</CardTitle>
                    <CardDescription>Plateformes qui vous envoient du trafic</CardDescription>
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
                        {trafficData.referrers.map((referrer, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <div className="flex items-center">
                                <Link2 className="h-4 w-4 mr-2 text-gray-400" />
                                <span>{referrer.url}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">{formatNumber(referrer.visits)}</TableCell>
                            <TableCell className="text-right font-medium">{referrer.percentage}%</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    <div className="mt-5 pt-4 border-t space-y-3">
                      <h3 className="text-sm font-medium">Comparaison vs période précédente</h3>
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
                          <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
                          <span className="text-sm text-red-500">-3%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Comportement */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Comportement des visiteurs</CardTitle>
                  <CardDescription>Comment vos visiteurs interagissent avec le site</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold">Fidélité</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Nouveaux visiteurs</span>
                          <span className="font-medium text-sm">65%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '65%' }} />
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Visiteurs récurrents</span>
                          <span className="font-medium text-sm">35%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '35%' }} />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold">Engagement</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-blue-50 rounded-lg text-center">
                          <div className="text-lg font-bold text-blue-700">{formatDuration(trafficData.overview.avgSessionDuration)}</div>
                          <div className="text-xs text-gray-500">Durée moy.</div>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg text-center">
                          <div className="text-lg font-bold text-green-700">
                            {(trafficData.overview.pageViews / Math.max(trafficData.overview.totalVisits, 1)).toFixed(1)}
                          </div>
                          <div className="text-xs text-gray-500">Pages/visite</div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold">Systèmes d'exploitation</h3>
                      <div className="space-y-2">
                        {[['Android', '42%'], ['iOS', '35%'], ['Windows', '18%'], ['macOS', '5%']].map(([os, pct]) => (
                          <div key={os} className="flex justify-between">
                            <span className="text-sm">{os}</span>
                            <span className="font-medium text-sm">{pct}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default withAdminAuth(AnalyticsPage);
