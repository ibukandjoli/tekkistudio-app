// app/admin/formula-leads/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  FileText,
  TrendingUp,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Download,
  RefreshCw,
  Eye,
  Mail,
  Phone,
  Calendar,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/app/lib/supabase';
import { formatRelativeDate } from '@/app/lib/utils/date-utils';
import { toast } from 'sonner';
import { withAdminAuth } from '@/app/lib/withAdminAuth';

interface FormulaLead {
  id: string;
  created_at: string;
  full_name: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  brand_name: string;
  brand_description: string;
  existing_website: string | null;
  monthly_revenue: string;
  formula_type: 'audit-depart' | 'demarrage' | 'croissance' | 'expansion';
  budget_range: string;
  desired_timeline: string;
  specific_needs: string | null;
  status: 'new' | 'contacted' | 'quote_sent' | 'negotiating' | 'won' | 'lost';
  notes: string | null;
  lead_source: string;
}

const FormulaLeadsPage = () => {
  const [leads, setLeads] = useState<FormulaLead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<FormulaLead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterFormula, setFilterFormula] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPeriod, setFilterPeriod] = useState('all');

  // Statistiques
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    quoteSent: 0,
    negotiating: 0,
    won: 0,
  });

  useEffect(() => {
    fetchLeads();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [leads, searchTerm, filterFormula, filterStatus, filterPeriod]);

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('formula_leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setLeads(data || []);
      calculateStats(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des prospects:', error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = (data: FormulaLead[]) => {
    setStats({
      total: data.length,
      new: data.filter(l => l.status === 'new').length,
      quoteSent: data.filter(l => l.status === 'quote_sent').length,
      negotiating: data.filter(l => l.status === 'negotiating').length,
      won: data.filter(l => l.status === 'won').length,
    });
  };

  const applyFilters = () => {
    let filtered = [...leads];

    // Recherche
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(lead =>
        lead.full_name.toLowerCase().includes(search) ||
        lead.email.toLowerCase().includes(search) ||
        lead.phone.includes(search) ||
        lead.brand_name.toLowerCase().includes(search)
      );
    }

    // Filtre par formule
    if (filterFormula !== 'all') {
      filtered = filtered.filter(lead => lead.formula_type === filterFormula);
    }

    // Filtre par statut
    if (filterStatus !== 'all') {
      filtered = filtered.filter(lead => lead.status === filterStatus);
    }

    // Filtre par période
    if (filterPeriod !== 'all') {
      const now = new Date();
      filtered = filtered.filter(lead => {
        const createdDate = new Date(lead.created_at);
        const diffTime = Math.abs(now.getTime() - createdDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        switch (filterPeriod) {
          case 'today':
            return diffDays === 0;
          case 'week':
            return diffDays <= 7;
          case 'month':
            return diffDays <= 30;
          case 'quarter':
            return diffDays <= 90;
          default:
            return true;
        }
      });
    }

    setFilteredLeads(filtered);
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Nom', 'Email', 'Téléphone', 'Pays', 'Ville', 'Marque', 'Formule', 'Budget', 'Délai', 'Statut'];
    const rows = filteredLeads.map(lead => [
      new Date(lead.created_at).toLocaleDateString('fr-FR'),
      lead.full_name,
      lead.email,
      lead.phone,
      lead.country,
      lead.city,
      lead.brand_name,
      getFormulaLabel(lead.formula_type),
      lead.budget_range,
      lead.desired_timeline,
      getStatusLabel(lead.status),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `formula-leads-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Export CSV réussi');
  };

  const getFormulaLabel = (type: string) => {
    const labels: Record<string, string> = {
      'audit-depart': 'Audit de Départ',
      'demarrage': 'Démarrage',
      'croissance': 'Croissance',
      'expansion': 'Expansion',
    };
    return labels[type] || type;
  };

  const getFormulaColor = (type: string) => {
    const colors: Record<string, string> = {
      'audit-depart': 'bg-emerald-100 text-emerald-700 border-emerald-300',
      'demarrage': 'bg-blue-100 text-blue-700 border-blue-300',
      'croissance': 'bg-orange-100 text-orange-700 border-orange-300',
      'expansion': 'bg-purple-100 text-purple-700 border-purple-300',
    };
    return colors[type] || 'bg-gray-100 text-gray-700 border-gray-300';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'new': 'Nouveau',
      'contacted': 'Contacté',
      'quote_sent': 'Devis envoyé',
      'negotiating': 'Négociation',
      'won': 'Gagné',
      'lost': 'Perdu',
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'new': 'bg-blue-100 text-blue-700 border-blue-300',
      'contacted': 'bg-yellow-100 text-yellow-700 border-yellow-300',
      'quote_sent': 'bg-purple-100 text-purple-700 border-purple-300',
      'negotiating': 'bg-orange-100 text-orange-700 border-orange-300',
      'won': 'bg-green-100 text-green-700 border-green-300',
      'lost': 'bg-red-100 text-red-700 border-red-300',
    };
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-300';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Prospects Formules</h1>
        <p className="text-gray-600">
          Gestion des demandes de devis pour les formules d'accompagnement
        </p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Total</span>
            <Users className="w-5 h-5 text-gray-400" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Nouveaux</span>
            <FileText className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-blue-600">{stats.new}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Devis envoyés</span>
            <Mail className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-3xl font-bold text-purple-600">{stats.quoteSent}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Négociation</span>
            <TrendingUp className="w-5 h-5 text-orange-500" />
          </div>
          <p className="text-3xl font-bold text-orange-600">{stats.negotiating}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Gagnés</span>
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-green-600">{stats.won}</p>
        </motion.div>
      </div>

      {/* Filtres et actions */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Recherche */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par nom, email, téléphone, marque..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f4c81] focus:border-transparent"
              />
            </div>
          </div>

          {/* Filtre formule */}
          <select
            value={filterFormula}
            onChange={(e) => setFilterFormula(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f4c81] focus:border-transparent"
          >
            <option value="all">Toutes les formules</option>
            <option value="audit-depart">Audit de Départ</option>
            <option value="demarrage">Démarrage</option>
            <option value="croissance">Croissance</option>
            <option value="expansion">Expansion</option>
          </select>

          {/* Filtre statut */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f4c81] focus:border-transparent"
          >
            <option value="all">Tous les statuts</option>
            <option value="new">Nouveau</option>
            <option value="contacted">Contacté</option>
            <option value="quote_sent">Devis envoyé</option>
            <option value="negotiating">Négociation</option>
            <option value="won">Gagné</option>
            <option value="lost">Perdu</option>
          </select>

          {/* Filtre période */}
          <select
            value={filterPeriod}
            onChange={(e) => setFilterPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f4c81] focus:border-transparent"
          >
            <option value="all">Toutes les périodes</option>
            <option value="today">Aujourd'hui</option>
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
            <option value="quarter">Ce trimestre</option>
          </select>

          {/* Bouton actualiser */}
          <button
            onClick={fetchLeads}
            disabled={isLoading}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          {/* Bouton export */}
          <button
            onClick={exportToCSV}
            className="px-4 py-2 bg-[#0f4c81] text-white rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center"
          >
            <Download className="w-5 h-5 mr-2" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>

        {/* Résultats */}
        <div className="mt-4 text-sm text-gray-600">
          {filteredLeads.length} résultat{filteredLeads.length > 1 ? 's' : ''} sur {leads.length} prospect{leads.length > 1 ? 's' : ''}
        </div>
      </div>

      {/* Tableau */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-[#0f4c81] animate-spin" />
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="text-center py-20">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Aucun prospect trouvé
            </h3>
            <p className="text-gray-600">
              {searchTerm || filterFormula !== 'all' || filterStatus !== 'all' || filterPeriod !== 'all'
                ? 'Essayez de modifier vos filtres'
                : 'Les nouveaux prospects apparaîtront ici'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prospect
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Marque
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Formule
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Budget
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLeads.map((lead) => (
                  <motion.tr
                    key={lead.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => window.location.href = `/admin/formula-leads/${lead.id}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        {formatRelativeDate(lead.created_at)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{lead.full_name}</div>
                      <div className="text-sm text-gray-500">{lead.city}, {lead.country}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{lead.brand_name}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {lead.brand_description.substring(0, 50)}...
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getFormulaColor(lead.formula_type)}`}>
                        {getFormulaLabel(lead.formula_type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center text-gray-600 mb-1">
                        <Mail className="w-3 h-3 mr-1" />
                        {lead.email}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Phone className="w-3 h-3 mr-1" />
                        {lead.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {lead.budget_range}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(lead.status)}`}>
                        {getStatusLabel(lead.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Link
                        href={`/admin/formula-leads/${lead.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center px-3 py-1.5 bg-[#0f4c81] text-white rounded-lg hover:opacity-90 transition-opacity"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Voir
                      </Link>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default withAdminAuth(FormulaLeadsPage);
