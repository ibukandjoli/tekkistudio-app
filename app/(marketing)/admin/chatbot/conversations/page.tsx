// app/admin/chatbot/conversations/page.tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/app/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
import { Button } from '@/app/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Calendar, Filter, Search, BarChart, MessageSquare, UserCheck, AlertTriangle, Download, RefreshCw, ChevronLeft, ChevronRight, Eye, X, Database, LayoutDashboard, Trash2, ArrowDownUp } from 'lucide-react';
import { supabase } from '@/app/lib/supabase';
import { formatDistanceToNow, format, subDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { withAdminAuth } from '@/app/lib/withAdminAuth';
import { Input } from '@/app/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/app/components/ui/tooltip';
import { Badge } from '@/app/components/ui/badge';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/app/components/ui/pagination";
import { Label } from "@/app/components/ui/label";
import { Skeleton } from "@/app/components/ui/skeleton";

interface Conversation {
  id: number;
  user_message: string;
  assistant_response: string;
  page: string;
  url: string;
  needs_human: boolean;
  created_at: string;
  session_id?: string;
  funnel_stage?: string;
}

interface Stat {
  label: string;
  value: number;
  icon: React.ReactNode;
  change?: number;
  color?: string;
}

interface TopQuestion {
  question: string;
  count: number;
}

function ChatbotConversationsPage() {
  // États principaux
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [timeRange, setTimeRange] = useState('all');
  const [stats, setStats] = useState<Stat[]>([]);
  const [topQuestions, setTopQuestions] = useState<TopQuestion[]>([]);
  const [pageDistribution, setPageDistribution] = useState<{page: string, count: number, percentage: number}[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'unknown' | 'connected' | 'error'>('unknown');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalConversations, setTotalConversations] = useState(0);
  const [conversationsPerPage, setConversationsPerPage] = useState(20);
  
  // Tris
  const [sortField, setSortField] = useState<'created_at' | 'page' | 'needs_human'>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Dates pour le filtre
  const now = new Date();
  const dateRanges = {
    '24hours': subDays(now, 1),
    '7days': subDays(now, 7),
    '30days': subDays(now, 30),
    'all': new Date(0)
  };

  // Calcul des statistiques et compteurs
  const needsHumanCount = useMemo(() => 
    conversations.filter(conv => conv.needs_human).length, 
    [conversations]
  );

  const needsHumanPercentage = useMemo(() => 
    conversations.length > 0 ? (needsHumanCount / conversations.length) * 100 : 0,
    [needsHumanCount, conversations]
  );

  // Initialisation du composant
  useEffect(() => {
    console.log("Initialisation du composant ChatbotConversations");
    testSupabaseConnection();
  }, []);

  // Effet pour les changements de filtres et connection
  useEffect(() => {
    console.log("État de connexion ou paramètres modifiés:", { connectionStatus, filter, timeRange, currentPage, conversationsPerPage });
    if (connectionStatus === 'connected') {
      fetchConversations();
    }
  }, [filter, timeRange, currentPage, connectionStatus, conversationsPerPage, sortField, sortDirection]);

  // Vérifier l'authentification
  useEffect(() => {
    const checkAuth = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (!data.session) {
        console.warn("Session d'authentification non trouvée");
        toast.warning("Vous n'êtes pas authentifié, redirection vers la page de connexion...");
      } else {
        console.log("Authentifié en tant que:", data.session.user.email);
      }
    };
    
    checkAuth();
  }, []);

  // Fonction pour tester la connexion à Supabase
  const testSupabaseConnection = async () => {
    try {
      console.log("Test de connexion à Supabase...");
      
      // Vérifier l'état d'authentification
      const { data: authData, error: authError } = await supabase.auth.getSession();
      
      console.log("État d'authentification:", 
        authData?.session ? `Authentifié en tant que ${authData.session.user.email}` : "Non authentifié");
      
      if (!authData?.session) {
        console.error("Utilisateur non authentifié!");
        toast.error("Vous n'êtes pas authentifié. Reconnectez-vous.");
        setConnectionStatus('error');
        return;
      }
      
      // Tester la connexion à l'API
      const response = await fetch('/api/admin/conversations?limit=1');
      if (!response.ok) {
        console.error("Erreur API:", response.status, response.statusText);
        toast.error(`Erreur de connexion à l'API: ${response.status} ${response.statusText}`);
        setConnectionStatus('error');
        return;
      }
      
      const data = await response.json();
      console.log("Connexion API réussie:", data);
      
      toast.success("Connexion établie avec succès");
      setConnectionStatus('connected');
    } catch (error) {
      console.error("Exception:", error);
      toast.error("Erreur de connexion");
      setConnectionStatus('error');
    }
  };

  // Fonction pour récupérer les conversations avec pagination via l'API
  const fetchConversations = async () => {
    try {
      setLoading(true);
      console.log("Récupération des conversations via API...");
      
      // Construire les paramètres
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: conversationsPerPage.toString(),
        filter: filter,
        timeRange: timeRange
      });
      
      if (searchQuery) {
        params.append('search', searchQuery);
      }
      
      // Appeler l'API
      const response = await fetch(`/api/admin/conversations?${params}`);
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      console.log("Données reçues via API:", {
        count: result.count, 
        dataLength: result.data?.length || 0,
        totalPages: result.totalPages
      });
      
      // Mise à jour des états
      setConversations(result.data || []);
      setTotalConversations(result.count || 0);
      setTotalPages(result.totalPages || 1);
      
      if (result.data && result.data.length > 0) {
        analyzeConversations(result.data);
        toast.success(`${result.data.length} conversations récupérées`);
      } else {
        toast.info("Aucune conversation trouvée - Essayez de modifier les filtres");
        // Réinitialiser les statistiques à zéro
        setStats([
          {
            label: 'Total conversations',
            value: 0,
            icon: <MessageSquare className="h-5 w-5" />,
            color: '#0f4c81'
          },
          {
            label: "Besoin d'assistance",
            value: 0,
            icon: <AlertTriangle className="h-5 w-5" />,
            color: '#ff7f50'
          },
          {
            label: 'Pages visitées',
            value: 0,
            icon: <BarChart className="h-5 w-5" />,
            color: '#10b981'
          },
        ]);
        setTopQuestions([]);
        setPageDistribution([]);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération:', error);
      toast.error(`Erreur: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Fonction pour l'analyse des données de conversations
  const analyzeConversations = async (conversationsData: Conversation[]) => {
    try {
      console.log("Analyse de", conversationsData.length, "conversations");
      
      // Calculer les statistiques générales
      const convCount = totalConversations;
      const humanNeedCount = conversationsData.filter(conv => conv.needs_human).length;
      const uniquePages = new Set(conversationsData.map(conv => conv.page));
      const uniquePagesCount = uniquePages.size;
      
      // Estimation du changement (simulé pour l'instant)
      const changePercentage = 5; 
      
      // Mettre à jour les statistiques
      setStats([
        {
          label: 'Total conversations',
          value: convCount,
          icon: <MessageSquare className="h-5 w-5" />,
          change: changePercentage,
          color: '#0f4c81'
        },
        {
          label: "Besoin d'assistance",
          value: humanNeedCount,
          icon: <AlertTriangle className="h-5 w-5" />,
          change: humanNeedCount > 0 ? (humanNeedCount / convCount) * 100 : 0,
          color: '#ff7f50'
        },
        {
          label: 'Pages visitées',
          value: uniquePagesCount,
          icon: <BarChart className="h-5 w-5" />,
          color: '#10b981'
        },
      ]);
      
      // Calculer les questions les plus fréquentes
      const questions: Record<string, number> = {};
      conversationsData.forEach(conv => {
        if (!conv.user_message) return;
        
        // Simplification de la question pour regroupement
        const simplifiedQ = conv.user_message
          .toLowerCase()
          .replace(/[^\w\s]/g, '')
          .trim();
        
        if (simplifiedQ.length > 5) { // Ignorer les messages trop courts
          questions[simplifiedQ] = (questions[simplifiedQ] || 0) + 1;
        }
      });
      
      // Trier et prendre les plus fréquentes
      const sortedQuestions = Object.entries(questions)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([question, count]) => ({ question, count }));
      
      setTopQuestions(sortedQuestions);
      
      // Calculer la distribution par page
      const pageCount: Record<string, number> = {};
      conversationsData.forEach(conv => {
        const page = conv.page || 'Inconnue';
        pageCount[page] = (pageCount[page] || 0) + 1;
      });
      
      const pageDistribution = Object.entries(pageCount)
        .map(([page, count]) => ({
          page,
          count,
          percentage: (count / conversationsData.length) * 100
        }))
        .sort((a, b) => b.count - a.count);
      
      setPageDistribution(pageDistribution);
      
      console.log("Analyse terminée:", {
        totalConv: convCount,
        humanNeedCount,
        uniquePages: uniquePagesCount,
        topQuestions: sortedQuestions.length,
        pageDistribution: pageDistribution.length
      });
      
    } catch (error) {
      console.error('Erreur lors de l\'analyse des conversations:', error);
      toast.error("Erreur d'analyse des données");
    }
  };

  // Créer une conversation de test via API
  const createTestConversation = async () => {
    try {
      toast.info("Création d'une conversation de test...");
      
      const testData = {
        user_message: "Test de la fonctionnalité de conversations",
        assistant_response: "Ceci est une réponse de test pour vérifier l'affichage des conversations",
        page: "Page de test",
        url: "/test",
        needs_human: false,
        created_at: new Date().toISOString()
      };
      
      const response = await fetch('/api/admin/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data: testData })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur API');
      }
      
      const result = await response.json();
      console.log("Conversation créée:", result);
      
      toast.success("Conversation de test créée avec succès");
      fetchConversations();
    } catch (error) {
      console.error("Erreur:", error);
      toast.error(`Erreur: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  // Diagnostic avancé pour débogage
  const diagnoseDatabaseAccess = async () => {
    try {
      toast.info("Diagnostic en cours...");
      
      // 1. Test de connexion général
      const { data: authData } = await supabase.auth.getSession();
      console.log("État d'authentification:", authData?.session ? "Connecté" : "Non connecté");
      
      // 2. Vérifier si on peut accéder à une autre table publique
      const { data: businessData, error: businessError } = await supabase
        .from('businesses')
        .select('id')
        .limit(1);
      
      console.log("Test accès businesses:", {
        success: !businessError,
        data: businessData,
        error: businessError
      });
      
      // 3. Vérifier l'accès brut à chat_conversations
      const { data: rawData, error: rawError } = await supabase
        .from('chat_conversations')
        .select('*')
        .limit(5);
      
      console.log("Test accès brut chat_conversations:", {
        success: !rawError,
        count: rawData?.length || 0,
        error: rawError
      });
      
      // 4. Obtenir la liste des tables
      const { data: tables, error: tablesError } = await supabase
        .rpc('get_tables');
      
      console.log("Tables disponibles:", {
        success: !tablesError,
        data: tables,
        error: tablesError
      });
      
      toast.success("Diagnostic terminé - Vérifiez la console");
    } catch (error) {
      console.error("Erreur diagnostic:", error);
      toast.error("Erreur pendant le diagnostic");
    }
  };

  // Gestionnaires d'événements
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Recherche avec la requête:", searchQuery);
    setCurrentPage(1); // Réinitialiser à la première page lors d'une recherche
    fetchConversations();
  };

  const clearSearch = () => {
    console.log("Effacement de la recherche");
    setSearchQuery('');
    setCurrentPage(1);
    fetchConversations();
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // Recherche automatique si le champ est vide
    if (e.target.value === '') {
      setTimeout(() => {
        fetchConversations();
      }, 300);
    }
  };

  const handleFilterChange = (value: string) => {
    console.log("Changement de filtre:", value);
    setFilter(value);
    setCurrentPage(1); // Réinitialiser à la première page lors d'un changement de filtre
  };

  const handleTimeRangeChange = (value: string) => {
    console.log("Changement de période:", value);
    setTimeRange(value);
    setCurrentPage(1); // Réinitialiser à la première page lors d'un changement de période
  };

  const viewConversation = (conversation: Conversation) => {
    console.log("Affichage de la conversation:", conversation.id);
    setSelectedConversation(conversation);
    setIsDialogOpen(true);
  };

  // Exporter les données au format CSV
  const exportToCSV = async () => {
    try {
      setExportLoading(true);
      toast.info("Préparation de l'export CSV...");
      
      // Construire les paramètres
      const params = new URLSearchParams({
        limit: '1000', // Limite plus élevée pour l'export
        filter: filter,
        timeRange: timeRange
      });
      
      if (searchQuery) {
        params.append('search', searchQuery);
      }
      
      // Appeler l'API pour obtenir les données à exporter
      const response = await fetch(`/api/admin/conversations?${params}`);
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      const data = result.data || [];
      
      if (data.length === 0) {
        toast.warning('Aucune donnée à exporter');
        return;
      }
      
      console.log(`${data.length} conversations à exporter`);
      
      // Formater les données pour le CSV
      const headers = ['ID', 'Date', 'Page', 'URL', 'Message utilisateur', 'Réponse assistant', 'Besoin humain', 'Session ID', 'Étape funnel'];
      
      const csvRows = [
        headers.join(','),
        ...data.map((conv: Conversation) => {
          const date = new Date(conv.created_at).toLocaleDateString();
          // Échapper les virgules et les guillemets dans les champs de texte
          const escapeCsvField = (field: string | null | undefined) => {
            if (field === null || field === undefined) return '""';
            return `"${String(field).replace(/"/g, '""')}"`;
          };
          
          return [
            conv.id,
            date,
            escapeCsvField(conv.page || ''),
            escapeCsvField(conv.url || ''),
            escapeCsvField(conv.user_message || ''),
            escapeCsvField(conv.assistant_response || ''),
            conv.needs_human ? 'Oui' : 'Non',
            escapeCsvField(conv.session_id || ''),
            escapeCsvField(conv.funnel_stage || '')
          ].join(',');
        })
      ].join('\n');
      
      // Créer et télécharger le fichier CSV
      const blob = new Blob([csvRows], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `conversations-chatbot-${format(new Date(), 'yyyy-MM-dd')}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Export CSV réussi');
      
    } catch (error) {
      console.error('Erreur lors de l\'export CSV:', error);
      toast.error('Erreur lors de l\'export');
    } finally {
      setExportLoading(false);
    }
  };
  
  // Gérer le tri des données
  const handleSort = (field: 'created_at' | 'page' | 'needs_human') => {
    if (field === sortField) {
      // Inverser la direction du tri
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Nouveau champ de tri
      setSortField(field);
      setSortDirection('desc'); // Par défaut, tri descendant
    }
  };

  // Fonction pour formater la date relative
  const formatRelativeDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { 
        addSuffix: true,
        locale: fr
      });
    } catch (error) {
      return 'Date inconnue';
    }
  };

  // Pagination - aller à la page précédente
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Pagination - aller à la page suivante
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Générer les liens de pagination
  const getPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    // Première page
    if (startPage > 1) {
      items.push(
        <PaginationItem key="first">
          <PaginationLink onClick={() => setCurrentPage(1)}>1</PaginationLink>
        </PaginationItem>
      );
      
      if (startPage > 2) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <span className="px-4">...</span>
          </PaginationItem>
        );
      }
    }
    
    // Pages intermédiaires
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink 
            onClick={() => setCurrentPage(i)}
            isActive={i === currentPage}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    // Dernière page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <span className="px-4">...</span>
          </PaginationItem>
        );
      }
      
      items.push(
        <PaginationItem key="last">
          <PaginationLink onClick={() => setCurrentPage(totalPages)}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return items;
  };

  // Fonction pour obtenir une couleur en fonction d'un texte
  const getColorFromText = (text: string): string => {
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = text.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const hue = Math.abs(hash % 360);
    return `hsl(${hue}, 70%, 50%)`;
  };

  // Rendu des squelettes de chargement
  const renderSkeletons = () => {
    return Array(5).fill(0).map((_, i) => (
      <TableRow key={`skeleton-${i}`}>
        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
        <TableCell><Skeleton className="h-5 w-32" /></TableCell>
        <TableCell><Skeleton className="h-5 w-full" /></TableCell>
        <TableCell><Skeleton className="h-5 w-full" /></TableCell>
        <TableCell><Skeleton className="h-6 w-28" /></TableCell>
        <TableCell><Skeleton className="h-8 w-8 rounded-full" /></TableCell>
      </TableRow>
    ));
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-[#0f4c81]">
            Analyses des conversations
          </h2>
          <p className="text-gray-500">
            Suivez et analysez les conversations du chatbot avec les visiteurs
          </p>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <Button 
            variant={connectionStatus === 'connected' ? 'outline' : 'destructive'} 
            onClick={testSupabaseConnection} 
            className="flex items-center gap-2"
          >
            <Database className="h-4 w-4" />
            {connectionStatus === 'unknown' 
              ? 'Vérifier la connexion' 
              : connectionStatus === 'connected' 
                ? 'Connexion OK' 
                : 'Problème de connexion'}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={exportToCSV} 
            disabled={exportLoading || loading || conversations.length === 0}
            className="flex items-center gap-2"
          >
            {exportLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            Exporter CSV
          </Button>
          
          <Button 
            className="bg-[#ff7f50] flex items-center gap-2" 
            onClick={() => fetchConversations()}
            disabled={loading}
          >
            {loading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Actualiser
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <div style={{ color: stat.color || '#0f4c81' }}>
                {stat.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              {stat.change !== undefined && (
                <p className="text-xs text-gray-500">
                  {stat.change >= 0 ? '+' : ''}{stat.change.toFixed(1)}% par rapport à la période précédente
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filtres et recherche */}
      <Card className="overflow-hidden">
        <CardHeader className="bg-gray-50 pb-0">
          <CardTitle className="text-lg">Recherche et filtres</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher dans les conversations..."
                className="pl-10 pr-10"
                value={searchQuery}
                onChange={handleSearchInputChange}
              />
              {searchQuery && (
                <button 
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </form>
          </div>
          
          <div className="flex gap-2 flex-col sm:flex-row">
            <Select value={filter} onValueChange={handleFilterChange}>
              <SelectTrigger className="w-[180px] bg-white">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filtrer par" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les conversations</SelectItem>
                <SelectItem value="needs_human">Besoin d'assistance</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={timeRange} onValueChange={handleTimeRangeChange}>
              <SelectTrigger className="w-[180px] bg-white">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24hours">Dernières 24h</SelectItem>
                <SelectItem value="7days">7 derniers jours</SelectItem>
                <SelectItem value="30days">30 derniers jours</SelectItem>
                <SelectItem value="all">Tout l'historique</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter className="bg-gray-50 border-t">
          <div className="w-full flex justify-between items-center text-sm text-gray-500">
            <span>{totalConversations} conversations trouvées</span>
            {filter === 'needs_human' && (
              <span>
                {needsHumanCount} conversations nécessitant une assistance ({needsHumanPercentage.toFixed(1)}%)
              </span>
            )}
          </div>
        </CardFooter>
      </Card>

      {/* Contenu principal */}
      <Tabs defaultValue="conversations">
        <TabsList className="mb-4">
          <TabsTrigger value="conversations">Conversations</TabsTrigger>
          <TabsTrigger value="analytics">Analyses</TabsTrigger>
        </TabsList>
        
        <TabsContent value="conversations">
          <Card>
            <CardHeader className="bg-gray-50 pb-4 flex flex-row items-start justify-between">
              <div>
                <CardTitle>Historique des conversations</CardTitle>
                <CardDescription>
                  Liste des interactions entre le chatbot et les visiteurs
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="perPage" className="text-sm">Afficher:</Label>
                <Select 
                  value={conversationsPerPage.toString()} 
                  onValueChange={(value) => {
                    setConversationsPerPage(parseInt(value));
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger id="perPage" className="w-[80px] h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead 
                      className="w-[160px] cursor-pointer" 
                      onClick={() => handleSort('created_at')}
                    >
                      <div className="flex items-center">
                        Date
                        {sortField === 'created_at' && (
                          <ArrowDownUp className={`ml-1 h-3 w-3 ${sortDirection === 'asc' ? 'transform rotate-180' : ''}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="w-[180px] cursor-pointer"
                      onClick={() => handleSort('page')}
                    >
                      <div className="flex items-center">
                        Page
                        {sortField === 'page' && (
                          <ArrowDownUp className={`ml-1 h-3 w-3 ${sortDirection === 'asc' ? 'transform rotate-180' : ''}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>Message utilisateur</TableHead>
                    <TableHead>Réponse</TableHead>
                    <TableHead 
                      className="w-[150px] cursor-pointer"
                      onClick={() => handleSort('needs_human')}
                    >
                      <div className="flex items-center">
                        Statut
                        {sortField === 'needs_human' && (
                          <ArrowDownUp className={`ml-1 h-3 w-3 ${sortDirection === 'asc' ? 'transform rotate-180' : ''}`} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    renderSkeletons()
                  ) : conversations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12 text-gray-500">
                        <div className="flex flex-col items-center justify-center space-y-2">
                          <MessageSquare className="h-10 w-10 text-gray-300" />
                          <p>Aucune conversation trouvée pour les critères sélectionnés</p>
                          <div className="text-xs text-gray-400 mt-2">
                            Essayez d'élargir vos filtres ou de sélectionner "Tout l'historique"
                          </div>
                          {searchQuery && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={clearSearch}
                              className="mt-2"
                            >
                              Effacer la recherche
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    conversations.map((conv) => (
                      <TableRow key={conv.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => viewConversation(conv)}>
                        <TableCell className="whitespace-nowrap font-medium">
                          <div className="text-sm">{new Date(conv.created_at).toLocaleDateString()}</div>
                          <div className="text-xs text-gray-500">{formatRelativeDate(conv.created_at)}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm font-medium">{conv.page || 'Page inconnue'}</div>
                          <div className="text-xs text-gray-500 truncate max-w-[200px]" title={conv.url || 'URL inconnue'}>
                            {conv.url || 'URL inconnue'}
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[250px]">
                          <div className="truncate" title={conv.user_message}>
                            {conv.user_message}
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[250px]">
                          <div className="truncate" title={conv.assistant_response}>
                            {conv.assistant_response}
                          </div>
                        </TableCell>
                        <TableCell>
                          {conv.needs_human ? (
                            <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">
                              <div className="flex items-center gap-1">
                                <span className="flex h-2 w-2 rounded-full bg-amber-500"></span>
                                <span>Assistance requise</span>
                              </div>
                            </Badge>
                          ) : (
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                              <div className="flex items-center gap-1">
                                <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
                                <span>Automatique</span>
                              </div>
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    viewConversation(conv);
                                  }}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Voir les détails</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
            
            {/* Pagination */}
            {!loading && conversations.length > 0 && (
              <CardFooter className="flex justify-between items-center border-t py-4 bg-gray-50">
                <div className="text-sm text-gray-500">
                  Affichage {(currentPage - 1) * conversationsPerPage + 1} à {Math.min(currentPage * conversationsPerPage, totalConversations)} sur {totalConversations} conversations
                </div>
                
                <Pagination>
                <PaginationContent>
                    <PaginationItem>
                    {currentPage === 1 ? (
                        <span className="opacity-50 cursor-not-allowed px-2">
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Précédent
                        </span>
                    ) : (
                        <PaginationPrevious onClick={goToPreviousPage} />
                    )}
                    </PaginationItem>
                    
                    {getPaginationItems()}
                    
                    <PaginationItem>
                    {currentPage === totalPages ? (
                        <span className="opacity-50 cursor-not-allowed px-2">
                        Suivant
                        <ChevronRight className="h-4 w-4 ml-2" />
                        </span>
                    ) : (
                        <PaginationNext onClick={goToNextPage} />
                    )}
                    </PaginationItem>
                </PaginationContent>
                </Pagination>
              </CardFooter>
            )}
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top questions */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-gray-50">
                <CardTitle>Questions les plus fréquentes</CardTitle>
                <CardDescription>
                  Les sujets les plus abordés par les visiteurs
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {loading ? (
                  <div className="space-y-3">
                    {Array(5).fill(0).map((_, i) => (
                      <Skeleton key={i} className="h-8 w-full" />
                    ))}
                  </div>
                ) : topQuestions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Pas assez de données pour cette analyse
                  </div>
                ) : (
                  <div className="space-y-4">
                    {topQuestions.map((item, index) => (
                      <div key={index} className="flex items-center justify-between pb-2 border-b last:border-0">
                        <div className="flex-1 mr-4">
                          <div className="font-medium truncate" title={item.question}>
                            {item.question}
                          </div>
                        </div>
                        <div>
                          <Badge className="bg-[#0f4c81]/10 text-[#0f4c81] hover:bg-[#0f4c81]/20">
                            {item.count} fois
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Pages distribution */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-gray-50">
                <CardTitle>Répartition par page</CardTitle>
                <CardDescription>
                  Analyse des pages où le chatbot est le plus utilisé
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {loading ? (
                  <div className="space-y-4">
                    {Array(4).fill(0).map((_, i) => (
                      <div key={i} className="space-y-2">
                        <Skeleton className="h-6 w-1/2" />
                        <Skeleton className="h-3 w-full" />
                      </div>
                    ))}
                  </div>
                ) : pageDistribution.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Pas assez de données pour cette analyse
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pageDistribution.map((page, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: getColorFromText(page.page) }}
                            ></div>
                            <span className="font-medium">{page.page}</span>
                          </div>
                          <span className="text-sm text-gray-500">{page.count} conv.</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="h-2 rounded-full"
                              style={{
                                width: `${page.percentage}%`,
                                backgroundColor: getColorFromText(page.page)
                              }}
                            ></div>
                          </div>
                          <span className="text-xs font-medium w-12 text-right">
                            {page.percentage.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Statistics by time */}
            <Card className="md:col-span-2 overflow-hidden">
              <CardHeader className="bg-gray-50">
                <CardTitle>Répartition assistance humaine vs automatique</CardTitle>
                <CardDescription>
                  Analyse des conversations nécessitant une intervention humaine
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {loading ? (
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <Skeleton className="w-48 h-48 rounded-full" />
                    <div className="flex-1 space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <Skeleton className="h-36 w-full" />
                        <Skeleton className="h-36 w-full" />
                      </div>
                      <Skeleton className="h-24 w-full" />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    {/* Donut chart */}
                    <div className="w-48 h-48 relative">
                      <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center">
                        <div 
                          className="absolute inset-0 rounded-full overflow-hidden"
                          style={{
                            background: `conic-gradient(#ff7f50 0% ${needsHumanPercentage}%, #10b981 ${needsHumanPercentage}% 100%)`
                          }}
                        ></div>
                        <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-xl font-bold">{needsHumanPercentage.toFixed(1)}%</div>
                            <div className="text-xs text-gray-500">humain</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Legend and stats */}
                    <div className="flex-1 space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2 p-4 rounded-lg bg-green-50">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#10b981]"></div>
                            <span className="font-medium">Réponses automatiques</span>
                          </div>
                          <div className="text-2xl font-bold">
                            {conversations.length - needsHumanCount}
                          </div>
                          <div className="text-sm text-gray-500">
                            {(100 - needsHumanPercentage).toFixed(1)}% des conversations
                          </div>
                        </div>
                        
                        <div className="space-y-2 p-4 rounded-lg bg-amber-50">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#ff7f50]"></div>
                            <span className="font-medium">Assistance humaine</span>
                          </div>
                          <div className="text-2xl font-bold">
                            {needsHumanCount}
                          </div>
                          <div className="text-sm text-gray-500">
                            {needsHumanPercentage.toFixed(1)}% des conversations
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                        <h4 className="font-medium text-blue-800 mb-1">Analyse de performance</h4>
                        <p className="text-sm text-blue-700">
                          {needsHumanPercentage < 20 ? (
                            <>
                              Excellente performance ! Seulement {needsHumanPercentage.toFixed(1)}% des conversations nécessitent une assistance humaine, ce qui indique que le chatbot répond efficacement à la plupart des demandes.
                            </>
                          ) : needsHumanPercentage < 40 ? (
                            <>
                              Bonne performance. {needsHumanPercentage.toFixed(1)}% des conversations nécessitent une assistance humaine. Vous pourriez améliorer ce taux en ajoutant plus de questions fréquentes.
                            </>
                          ) : (
                            <>
                              Performance à améliorer. {needsHumanPercentage.toFixed(1)}% des conversations nécessitent une assistance humaine. Examinez les messages des utilisateurs pour identifier les thèmes récurrents et ajoutez des questions fréquentes correspondantes.
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Dialog pour afficher les détails d'une conversation */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Détails de la conversation</DialogTitle>
            <DialogDescription>
              {selectedConversation && (
                <div className="flex items-center gap-2 mt-1">
                  <span>
                    {new Date(selectedConversation.created_at).toLocaleDateString()} à {new Date(selectedConversation.created_at).toLocaleTimeString()} sur 
                  </span>
                  <Badge variant="outline">
                    {selectedConversation.page || "Page inconnue"}
                  </Badge>
                  {selectedConversation.needs_human && (
                    <Badge className="bg-amber-100 text-amber-800">
                      Assistance humaine
                    </Badge>
                  )}
                </div>
              )}
            </DialogDescription>
            </DialogHeader>
            
            {selectedConversation && (
              <div className="space-y-6 mt-4">
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-700 flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-gray-500" />
                    Message de l'utilisateur
                  </h3>
                  <div className="p-4 bg-gray-50 rounded-lg border">
                    <p className="whitespace-pre-wrap">{selectedConversation.user_message}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-700 flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-[#0f4c81]" />
                    Réponse du chatbot
                  </h3>
                  <div className="p-4 bg-[#0f4c81]/5 rounded-lg border">
                    <p className="whitespace-pre-wrap">{selectedConversation.assistant_response}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-700">Informations complémentaires</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50 rounded border">
                      <div className="text-sm font-medium mb-1">URL</div>
                      <div className="text-sm text-gray-600 break-all">
                        {selectedConversation.url || "Non disponible"}
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded border">
                      <div className="text-sm font-medium mb-1">ID Conversation</div>
                      <div className="text-sm text-gray-600">
                        {selectedConversation.id}
                      </div>
                    </div>
                  </div>
                  {(selectedConversation.session_id || selectedConversation.funnel_stage) && (
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      {selectedConversation.session_id && (
                        <div className="p-3 bg-gray-50 rounded border">
                          <div className="text-sm font-medium mb-1">Session ID</div>
                          <div className="text-sm text-gray-600 break-all">
                            {selectedConversation.session_id}
                          </div>
                        </div>
                      )}
                      {selectedConversation.funnel_stage && (
                        <div className="p-3 bg-gray-50 rounded border">
                          <div className="text-sm font-medium mb-1">Étape du funnel</div>
                          <div className="text-sm text-gray-600">
                            <Badge className="bg-blue-100 text-blue-800">
                              {selectedConversation.funnel_stage}
                            </Badge>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Fermer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
    </div>
  );
}

export default withAdminAuth(ChatbotConversationsPage);