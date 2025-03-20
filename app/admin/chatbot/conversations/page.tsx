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
import { Calendar, Filter, Search, BarChart, MessageSquare, UserCheck, AlertTriangle, Download, RefreshCw, ChevronLeft, ChevronRight, Eye, X, Database } from 'lucide-react';
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
  DialogTrigger,
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
  const [timeRange, setTimeRange] = useState('7days');
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
  const conversationsPerPage = 15;

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
    fetchConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Effet pour les changements de filtres
  useEffect(() => {
    console.log("Changement des paramètres:", { filter, timeRange, currentPage });
    if (connectionStatus !== 'unknown') {
      fetchConversations();
    }
  }, [filter, timeRange, currentPage, connectionStatus]);

  // Fonction pour tester la connexion à Supabase
  const testSupabaseConnection = async () => {
    try {
      console.log("Test de connexion à Supabase...");
      const { data, error } = await supabase
        .from('chat_conversations')
        .select('id')
        .limit(1);
      
      console.log("Résultat du test:", { data, error });
      
      if (error) {
        console.error("Erreur lors du test de connexion:", error);
        toast.error("Erreur de connexion à Supabase");
        setConnectionStatus('error');
      } else {
        console.log("Connexion réussie");
        setConnectionStatus('connected');
        
        if (data && data.length > 0) {
          console.log("Données trouvées dans chat_conversations");
          toast.success("Connexion à Supabase établie avec succès");
        } else {
          console.log("Aucune donnée dans chat_conversations");
          toast.info("Connexion réussie, mais aucune conversation trouvée");
        }
      }
    } catch (error) {
      console.error("Exception lors du test de connexion:", error);
      toast.error("Exception lors de la connexion à Supabase");
      setConnectionStatus('error');
    }
  };

  // Fonction pour récupérer les conversations avec pagination
  const fetchConversations = async () => {
    try {
      setLoading(true);
      
      console.log("Tentative de récupération des conversations...");
      
      // Obtenir la date de début en fonction du filtre de temps
      const startDate = dateRanges[timeRange as keyof typeof dateRanges];
      console.log("Date de début pour le filtre:", startDate.toISOString());
      
      // Compter le nombre total de conversations pour la pagination
      let countQuery = supabase
        .from('chat_conversations')
        .select('id', { count: 'exact' });
      
      // Appliquer les filtres
      if (filter === 'needs_human') {
        countQuery = countQuery.eq('needs_human', true);
      }
      
      countQuery = countQuery.gte('created_at', startDate.toISOString());
      
      if (searchQuery) {
        countQuery = countQuery.or(`user_message.ilike.%${searchQuery}%,assistant_response.ilike.%${searchQuery}%`);
      }
      
      console.log("Exécution de la requête de comptage...");
      const { count, error: countError } = await countQuery;
      
      console.log("Résultat du comptage:", { count, error: countError });
      
      if (countError) {
        console.error("Erreur lors du comptage:", countError);
        throw countError;
      }
      
      setTotalConversations(count || 0);
      setTotalPages(Math.ceil((count || 0) / conversationsPerPage));
      
      // Récupérer les conversations avec pagination
      let query = supabase
        .from('chat_conversations')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Appliquer les filtres
      if (filter === 'needs_human') {
        query = query.eq('needs_human', true);
      }
      
      query = query.gte('created_at', startDate.toISOString());
      
      if (searchQuery) {
        query = query.or(`user_message.ilike.%${searchQuery}%,assistant_response.ilike.%${searchQuery}%`);
      }
      
      // Appliquer la pagination
      const from = (currentPage - 1) * conversationsPerPage;
      const to = from + conversationsPerPage - 1;
      query = query.range(from, to);
      
      console.log("Exécution de la requête principale...");
      const { data, error } = await query;
      
      console.log("Résultat de la requête principale:", { 
        dataLength: data?.length, 
        error,
        firstItem: data && data.length > 0 ? {
          id: data[0].id,
          user_message: data[0].user_message ? data[0].user_message.substring(0, 50) + '...' : null,
          created_at: data[0].created_at
        } : null 
      });
      
      if (error) {
        console.error("Erreur lors de la récupération des conversations:", error);
        throw error;
      }
      
      // Si aucune donnée n'est trouvée, vérifier si la table existe
      if (!data || data.length === 0) {
        console.log("Aucune conversation trouvée, vérification de la structure de la table...");
        
        // Vérifier la structure de la table
        const { data: tableInfo, error: tableError } = await supabase
          .from('chat_conversations')
          .select('id')
          .limit(1);
        
        if (tableError) {
          console.error("Erreur lors de la vérification de la table:", tableError);
          if (tableError.message.includes("does not exist")) {
            toast.error("La table 'chat_conversations' n'existe pas");
          }
        } else {
          console.log("La table existe mais ne contient pas de données correspondant aux filtres");
        }
      }
      
      setConversations(data || []);
      
      // Lancer les analyses une fois les données chargées
      if (data && data.length > 0) {
        analyzeConversations(data);
      } else {
        // Réinitialiser les statistiques si aucune donnée
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
      console.error('Erreur détaillée lors du chargement des conversations:', error);
      toast.error('Erreur lors du chargement des données. Vérifiez la console pour plus de détails.');
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour analyser les conversations et calculer les statistiques
  const analyzeConversations = async (conversationsData: Conversation[]) => {
    try {
      console.log("Début de l'analyse des conversations...");
      console.log("Nombre de conversations à analyser:", conversationsData.length);
      
      // Récupérer toutes les conversations pour les statistiques (sans pagination)
      const startDate = dateRanges[timeRange as keyof typeof dateRanges];
      
      let statsQuery = supabase
        .from('chat_conversations')
        .select('*')
        .gte('created_at', startDate.toISOString());
      
      if (filter === 'needs_human') {
        statsQuery = statsQuery.eq('needs_human', true);
      }
      
      console.log("Récupération des données pour les statistiques...");
      const { data: allConversations, error } = await statsQuery;
      
      if (error) {
        console.error("Erreur lors de la récupération des données pour les statistiques:", error);
        throw error;
      }
      
      console.log("Nombre total de conversations pour les statistiques:", allConversations?.length || 0);
      
      if (!allConversations || allConversations.length === 0) {
        console.log("Aucune conversation à analyser, initialisation des stats à zéro");
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
        return;
      }
      
      // Calculer les statistiques générales
      const convCount = allConversations.length;
      const humanNeedCount = allConversations.filter(conv => conv.needs_human).length;
      const uniquePagesCount = new Set(allConversations.map(conv => conv.page)).size;
      
      // Calculer les changements par rapport à la période précédente (simulation)
      const changePercentage = 5; // À remplacer par un calcul réel comparant avec la période précédente
      
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
      allConversations.forEach(conv => {
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
      
      // Trier et prendre les 5 plus fréquentes
      const sortedQuestions = Object.entries(questions)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([question, count]) => ({ question, count }));
      
      setTopQuestions(sortedQuestions);
      
      // Calculer la distribution par page
      const pageCount: Record<string, number> = {};
      allConversations.forEach(conv => {
        const page = conv.page || 'Inconnue';
        pageCount[page] = (pageCount[page] || 0) + 1;
      });
      
      const pageDistribution = Object.entries(pageCount)
        .map(([page, count]) => ({
          page,
          count,
          percentage: (count / allConversations.length) * 100
        }))
        .sort((a, b) => b.count - a.count);
      
      setPageDistribution(pageDistribution);
      
      console.log("Analyse des conversations terminée avec succès");
      
    } catch (error) {
      console.error('Erreur lors de l\'analyse des conversations:', error);
      toast.error("Erreur lors de l'analyse des conversations");
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
      console.log("Export CSV en cours...");
      
      // Récupérer toutes les conversations pour l'export
      const startDate = dateRanges[timeRange as keyof typeof dateRanges];
      
      let exportQuery = supabase
        .from('chat_conversations')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (filter === 'needs_human') {
        exportQuery = exportQuery.eq('needs_human', true);
      }
      
      exportQuery = exportQuery.gte('created_at', startDate.toISOString());
      
      if (searchQuery) {
        exportQuery = exportQuery.or(`user_message.ilike.%${searchQuery}%,assistant_response.ilike.%${searchQuery}%`);
      }
      
      console.log("Exécution de la requête d'export...");
      const { data, error } = await exportQuery;
      
      if (error) {
        console.error("Erreur lors de l'export:", error);
        throw error;
      }
      
      if (!data || data.length === 0) {
        console.log("Aucune donnée à exporter");
        toast.warning('Aucune donnée à exporter');
        return;
      }
      
      console.log(`${data.length} conversations à exporter`);
      
      // Formater les données pour le CSV
      const headers = ['ID', 'Date', 'Page', 'URL', 'Message utilisateur', 'Réponse assistant', 'Besoin humain', 'Session ID', 'Étape funnel'];
      
      const csvRows = [
        headers.join(','),
        ...data.map(conv => {
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
      
      console.log("Export CSV terminé avec succès");
      toast.success('Export CSV réussi');
      
    } catch (error) {
      console.error('Erreur lors de l\'export CSV:', error);
      toast.error('Erreur lors de l\'export');
    } finally {
      setExportLoading(false);
    }
  };

  // Créer une conversation de test
  const createTestConversation = async () => {
    try {
      console.log("Création d'une conversation de test...");
      
      const testConversation = {
        user_message: "Test de la fonctionnalité de conversations",
        assistant_response: "Ceci est une réponse de test pour vérifier l'affichage des conversations",
        page: "Page de test",
        url: "/test",
        needs_human: false,
        session_id: "test-session",
        funnel_stage: "awareness",
        created_at: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('chat_conversations')
        .insert([testConversation])
        .select();
      
      if (error) {
        console.error("Erreur lors de la création de la conversation de test:", error);
        toast.error("Erreur lors de la création de la conversation de test");
        return;
      }
      
      console.log("Conversation de test créée avec succès:", data);
      toast.success("Conversation de test créée avec succès");
      
      // Rafraîchir les données
      fetchConversations();
      
    } catch (error) {
      console.error("Exception lors de la création de la conversation de test:", error);
      toast.error("Exception lors de la création de la conversation de test");
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
            onClick={createTestConversation} 
            className="flex items-center gap-2"
          >
            <MessageSquare className="h-4 w-4" />
            Créer test
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
            <CardHeader className="bg-gray-50 pb-4">
              <CardTitle>Historique des conversations</CardTitle>
              <CardDescription>
                Liste des interactions entre le chatbot et les visiteurs
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="w-[160px]">Date</TableHead>
                    <TableHead className="w-[180px]">Page</TableHead>
                    <TableHead>Message utilisateur</TableHead>
                    <TableHead>Réponse</TableHead>
                    <TableHead className="w-[150px]">Statut</TableHead>
                    <TableHead className="w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12">
                        <div className="flex flex-col items-center justify-center space-y-3">
                          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0f4c81]"></div>
                          <p className="text-sm text-gray-500">Chargement des conversations...</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : conversations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12 text-gray-500">
                        <div className="flex flex-col items-center justify-center space-y-2">
                          <MessageSquare className="h-10 w-10 text-gray-300" />
                          <p>Aucune conversation trouvée pour les critères sélectionnés</p>
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
                {topQuestions.length === 0 ? (
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
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0f4c81]"></div>
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