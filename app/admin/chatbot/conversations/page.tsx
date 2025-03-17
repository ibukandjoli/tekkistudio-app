// app/admin/chatbot/conversations/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
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
import { Calendar, Filter, Search, BarChart, MessageSquare, UserCheck, AlertTriangle } from 'lucide-react';
import { supabase } from '@/app/lib/supabase';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { withAdminAuth } from '@/app/lib/withAdminAuth';
import { Input } from '@/app/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';

interface Conversation {
  id: number;
  user_message: string;
  assistant_response: string;
  page: string;
  url: string;
  needs_human: boolean;
  created_at: string;
}

interface Stat {
  label: string;
  value: number;
  icon: React.ReactNode;
  change?: number;
}

function ChatbotConversationsPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [timeRange, setTimeRange] = useState('7days');
  const [stats, setStats] = useState<Stat[]>([]);
  const [topQuestions, setTopQuestions] = useState<{question: string, count: number}[]>([]);

  useEffect(() => {
    fetchConversations();
  }, [filter, timeRange]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      
      // Préparer la requête de base
      let query = supabase
        .from('chat_conversations')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Ajouter les filtres
      if (filter === 'needs_human') {
        query = query.eq('needs_human', true);
      }
      
      // Ajouter les filtres de date
      const now = new Date();
      let startDate: Date;
      
      switch (timeRange) {
        case '24hours':
          startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case '7days':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30days':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(0); // Toutes les dates
      }
      
      query = query.gte('created_at', startDate.toISOString());
      
      // Exécuter la requête
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Calculer les statistiques
      const totalConversations = data.length;
      const needsHumanCount = data.filter(conv => conv.needs_human).length;
      const uniquePagesCount = new Set(data.map(conv => conv.page)).size;
      
      // Calculer le % de change (fictif pour l'instant)
      const changePercentage = 12; // À remplacer par un calcul réel
      
      // Définir les statistiques
      setStats([
        {
          label: 'Total conversations',
          value: totalConversations,
          icon: <MessageSquare className="h-5 w-5 text-[#0f4c81]" />,
          change: changePercentage
        },
        {
          label: 'Besoin d\'assistance',
          value: needsHumanCount,
          icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
          change: needsHumanCount > 0 ? (needsHumanCount / totalConversations) * 100 : 0
        },
        {
          label: 'Pages visitées',
          value: uniquePagesCount,
          icon: <BarChart className="h-5 w-5 text-[#ff7f50]" />,
        },
      ]);
      
      // Calculer les questions les plus fréquentes
      const questions: Record<string, number> = {};
      data.forEach(conv => {
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
        .slice(0, 5)
        .map(([question, count]) => ({ question, count }));
      
      setTopQuestions(sortedQuestions);
      
      // Filtrer les conversations si une recherche est active
      let filteredData = data;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredData = data.filter(
          conv => 
            conv.user_message.toLowerCase().includes(query) || 
            conv.assistant_response.toLowerCase().includes(query)
        );
      }
      
      setConversations(filteredData);
    } catch (error) {
      console.error('Erreur lors du chargement des conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchConversations();
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
        
        <Button className="bg-[#ff7f50]" onClick={() => fetchConversations()}>
          Actualiser les données
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
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
      <div className="flex flex-col md:flex-row gap-4">
        <Card className="w-full">
          <CardContent className="pt-6 flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher dans les conversations..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
            </div>
            
            <div className="flex gap-2">
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filtrer par" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les conversations</SelectItem>
                  <SelectItem value="needs_human">Besoin d'assistance</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[180px]">
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
        </Card>
      </div>

      {/* Contenu principal */}
      <Tabs defaultValue="conversations">
        <TabsList className="mb-4">
          <TabsTrigger value="conversations">Conversations</TabsTrigger>
          <TabsTrigger value="analytics">Analyses</TabsTrigger>
        </TabsList>
        
        <TabsContent value="conversations">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Page</TableHead>
                    <TableHead>Message utilisateur</TableHead>
                    <TableHead>Réponse</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <div className="flex justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0f4c81]"></div>
                        </div>
                        <p className="mt-2 text-sm text-gray-500">Chargement des conversations...</p>
                      </TableCell>
                    </TableRow>
                  ) : conversations.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                        Aucune conversation trouvée pour les critères sélectionnés
                      </TableCell>
                    </TableRow>
                  ) : (
                    conversations.map((conv) => (
                      <TableRow key={conv.id}>
                        <TableCell className="whitespace-nowrap">
                          <div className="text-sm">{new Date(conv.created_at).toLocaleDateString()}</div>
                          <div className="text-xs text-gray-500">{formatRelativeDate(conv.created_at)}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm font-medium">{conv.page || 'Page inconnue'}</div>
                          <div className="text-xs text-gray-500">{conv.url || 'URL inconnue'}</div>
                        </TableCell>
                        <TableCell className="max-w-[200px]">
                          <div className="truncate" title={conv.user_message}>
                            {conv.user_message}
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[300px]">
                          <div className="truncate" title={conv.assistant_response}>
                            {conv.assistant_response}
                          </div>
                        </TableCell>
                        <TableCell>
                          {conv.needs_human ? (
                            <div className="flex items-center">
                              <span className="flex h-2 w-2 rounded-full bg-amber-500 mr-2"></span>
                              <span className="text-amber-600 text-sm">Assistance requise</span>
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                              <span className="text-green-600 text-sm">Automatique</span>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Questions les plus fréquentes</CardTitle>
              </CardHeader>
              <CardContent>
                {topQuestions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Pas assez de données pour cette analyse
                  </div>
                ) : (
                  <div className="space-y-4">
                    {topQuestions.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-medium truncate" title={item.question}>
                            {item.question}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold rounded-full bg-[#0f4c81]/10 px-2 py-1 text-[#0f4c81]">
                            {item.count} fois
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Répartition par page</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0f4c81]"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {Object.entries(
                      conversations.reduce((acc, conv) => {
                        const page = conv.page || 'Inconnu';
                        acc[page] = (acc[page] || 0) + 1;
                        return acc;
                      }, {} as Record<string, number>)
                    )
                      .sort((a, b) => b[1] - a[1])
                      .map(([page, count], index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="font-medium">{page}</span>
                            <span>{count} conversations</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-[#0f4c81] h-2 rounded-full"
                              style={{
                                width: `${(count / conversations.length) * 100}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default withAdminAuth(ChatbotConversationsPage);