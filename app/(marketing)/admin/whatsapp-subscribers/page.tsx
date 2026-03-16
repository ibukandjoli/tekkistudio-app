// app/admin/whatsapp-subscribers/page.tsx
'use client';

import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '@/app/lib/supabase';
import { withAdminAuth } from '@/app/lib/withAdminAuth';
import { formatRelativeDate } from '@/app/lib/utils/date-utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
import {
  Search,
  RefreshCw,
  Download,
  CheckCircle,
  XCircle,
  Loader2,
  ArrowUpDown,
  AlertCircle,
  Send,
  UploadCloud,
  Smartphone,
  FileSpreadsheet,
} from 'lucide-react';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { Badge } from '@/app/components/ui/badge';
import { WhatsAppIcon } from '@/app/components/icons/WhatsAppIcon';
import { toast } from 'sonner';

// ─── Types ────────────────────────────────────────────────────────────────────

interface WhatsAppSubscriber {
  id: string;
  phone: string;
  country: string;
  status: 'active' | 'inactive' | 'blocked';
  subscribed_at: string;
  last_message_sent?: string;
  name?: string;
  email?: string;
  created_at?: string;
  updated_at?: string;
}

type StatusType = 'active' | 'inactive' | 'blocked';
type SortField = 'subscribed_at' | 'phone' | 'country' | 'status' | 'last_message_sent';
type SortDirection = 'asc' | 'desc';

interface ParsedContact {
  name: string;
  phone: string;
  email: string;
  country: string;
}

// ─── StatusBadge ──────────────────────────────────────────────────────────────

const StatusBadge = ({ status }: { status: string }) => {
  const statusConfig: Record<StatusType, { label: string; className: string }> = {
    active: { label: 'Actif', className: 'bg-green-100 text-green-800 hover:bg-green-200' },
    inactive: { label: 'Inactif', className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' },
    blocked: { label: 'Bloqué', className: 'bg-red-100 text-red-800 hover:bg-red-200' }
  };

  const config = statusConfig[status as StatusType] || {
    label: status,
    className: 'bg-gray-100 text-gray-800 hover:bg-gray-200'
  };

  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
};

// ─── CSV Parser ───────────────────────────────────────────────────────────────

/**
 * Simple client-side CSV parser (no external library).
 * Handles comma and semicolon delimiters.
 * Maps columns case-insensitively:
 *   nom/name → name
 *   téléphone/telephone/phone/whatsapp → phone
 *   email → email
 *   pays/country → country
 */
function parseCSV(raw: string): ParsedContact[] {
  const lines = raw.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length < 2) return [];

  // Detect delimiter (semicolon or comma)
  const firstLine = lines[0];
  const delimiter = (firstLine.match(/;/g) || []).length >= (firstLine.match(/,/g) || []).length ? ';' : ',';

  // Parse a single CSV line respecting quoted fields
  const parseLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        inQuotes = !inQuotes;
      } else if (ch === delimiter && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += ch;
      }
    }
    result.push(current.trim());
    return result;
  };

  const headers = parseLine(lines[0]).map(h => h.toLowerCase().replace(/[^a-z]/g, ''));

  // Map header index
  const colIndex = (names: string[]): number =>
    headers.findIndex(h => names.some(n => h.includes(n)));

  const nameIdx = colIndex(['nom', 'name']);
  const phoneIdx = colIndex(['tlphone', 'telephone', 'phone', 'whatsapp', 'mobile', 'tel']);
  const emailIdx = colIndex(['email', 'mail', 'courriel']);
  const countryIdx = colIndex(['pays', 'country', 'countri']);

  const contacts: ParsedContact[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = parseLine(lines[i]);
    const phone = phoneIdx >= 0 ? (cols[phoneIdx] || '').trim() : '';
    if (!phone) continue; // Phone is required

    contacts.push({
      name: nameIdx >= 0 ? (cols[nameIdx] || '').trim() : '',
      phone,
      email: emailIdx >= 0 ? (cols[emailIdx] || '').trim() : '',
      country: countryIdx >= 0 ? (cols[countryIdx] || '').trim() : 'SN',
    });
  }

  return contacts;
}

// ─── Page Component ───────────────────────────────────────────────────────────

function WhatsAppSubscribersPage() {
  // États principaux
  const [subscribers, setSubscribers] = useState<WhatsAppSubscriber[]>([]);
  const [filteredSubscribers, setFilteredSubscribers] = useState<WhatsAppSubscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [countryFilter, setCountryFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all');

  // Tri
  const [sortField, setSortField] = useState<SortField>('subscribed_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Statistiques
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    blocked: 0,
    todayNew: 0,
    weekNew: 0
  });

  // Envoi message groupé
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Import numéros (texte brut)
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [importNumbers, setImportNumbers] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  // Import CSV
  const [isCsvDialogOpen, setIsCsvDialogOpen] = useState(false);
  const [csvParsedContacts, setCsvParsedContacts] = useState<ParsedContact[]>([]);
  const [csvFileName, setCsvFileName] = useState('');
  const [isCsvImporting, setIsCsvImporting] = useState(false);
  const csvInputRef = useRef<HTMLInputElement>(null);

  // ─── Effects ────────────────────────────────────────────────────────────────

  useEffect(() => { fetchSubscribers(); }, []);

  useEffect(() => {
    if (subscribers.length > 0) applyFilters();
  }, [subscribers, searchTerm, statusFilter, countryFilter, timeFilter, sortField, sortDirection]);

  useEffect(() => {
    if (subscribers.length > 0) calculateStats();
  }, [subscribers]);

  // ─── Data fetching ──────────────────────────────────────────────────────────

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      setError(null);
      setRefreshing(true);

      const { data: subscribersData, error: subscribersError } = await supabase
        .from('whatsapp_subscribers')
        .select('*')
        .order('subscribed_at', { ascending: false });

      if (subscribersError) throw subscribersError;

      if (!subscribersData || subscribersData.length === 0) {
        setSubscribers([]);
        return;
      }

      setSubscribers(subscribersData);
    } catch (err: any) {
      setError(`Une erreur est survenue lors du chargement des abonnés: ${err.message || err}`);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ─── Filters & sort ─────────────────────────────────────────────────────────

  const applyFilters = () => {
    let filtered = [...subscribers];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(sub =>
        sub.phone.toLowerCase().includes(term) ||
        sub.country.toLowerCase().includes(term) ||
        (sub.name || '').toLowerCase().includes(term)
      );
    }

    if (statusFilter !== 'all') filtered = filtered.filter(sub => sub.status === statusFilter);
    if (countryFilter !== 'all') filtered = filtered.filter(sub => sub.country === countryFilter);

    if (timeFilter !== 'all') {
      const now = new Date();
      let startDate = new Date();
      switch (timeFilter) {
        case 'today': startDate.setHours(0, 0, 0, 0); break;
        case 'week': startDate.setDate(now.getDate() - 7); break;
        case 'month': startDate.setMonth(now.getMonth() - 1); break;
        case 'quarter': startDate.setMonth(now.getMonth() - 3); break;
      }
      filtered = filtered.filter(sub => {
        const d = new Date(sub.subscribed_at);
        return d >= startDate && d <= now;
      });
    }

    filtered.sort((a, b) => {
      const valA = sortField === 'subscribed_at' || sortField === 'last_message_sent'
        ? new Date(a[sortField] || '1970-01-01').getTime()
        : a[sortField];
      const valB = sortField === 'subscribed_at' || sortField === 'last_message_sent'
        ? new Date(b[sortField] || '1970-01-01').getTime()
        : b[sortField];

      const order = sortDirection === 'asc' ? 1 : -1;
      if (valA < valB) return -1 * order;
      if (valA > valB) return 1 * order;
      return 0;
    });

    setFilteredSubscribers(filtered);
  };

  const calculateStats = () => {
    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    const oneWeekAgo = new Date(now);
    oneWeekAgo.setDate(now.getDate() - 7);

    setStats({
      total: subscribers.length,
      active: subscribers.filter(s => s.status === 'active').length,
      inactive: subscribers.filter(s => s.status === 'inactive').length,
      blocked: subscribers.filter(s => s.status === 'blocked').length,
      todayNew: subscribers.filter(s => new Date(s.subscribed_at) >= today).length,
      weekNew: subscribers.filter(s => new Date(s.subscribed_at) >= oneWeekAgo).length,
    });
  };

  // ─── Handlers ───────────────────────────────────────────────────────────────

  const handleSort = (field: SortField) => {
    setSortDirection(sortField === field ? (sortDirection === 'asc' ? 'desc' : 'asc') : 'desc');
    setSortField(field);
  };

  const handleRefresh = () => fetchSubscribers();

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setCountryFilter('all');
    setTimeFilter('all');
  };

  const handleStatusChange = async (subscriberId: string, newStatus: StatusType) => {
    try {
      const { error } = await supabase
        .from('whatsapp_subscribers')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', subscriberId);

      if (error) throw error;

      setSubscribers(prev =>
        prev.map(sub => sub.id === subscriberId
          ? { ...sub, status: newStatus, updated_at: new Date().toISOString() }
          : sub
        )
      );
      toast.success('Statut modifié avec succès');
    } catch (err) {
      toast.error('Erreur lors de la modification du statut');
    }
  };

  const handleDeleteSubscriber = async (subscriberId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet abonné ?')) return;

    try {
      const { error } = await supabase
        .from('whatsapp_subscribers')
        .delete()
        .eq('id', subscriberId);

      if (error) throw error;

      setSubscribers(prev => prev.filter(sub => sub.id !== subscriberId));
      toast.success('Abonné supprimé avec succès');
    } catch (err) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleSendBroadcastMessage = async () => {
    if (!broadcastMessage.trim()) {
      toast.error('Veuillez saisir un message');
      return;
    }
    setIsSending(true);
    try {
      const selected = filteredSubscribers.filter(sub => sub.status === 'active');
      const now = new Date().toISOString();

      const { error } = await supabase
        .from('whatsapp_subscribers')
        .update({ last_message_sent: now, updated_at: now })
        .in('id', selected.map(sub => sub.id))
        .eq('status', 'active');

      if (error) throw error;

      setSubscribers(prev =>
        prev.map(sub =>
          selected.some(s => s.id === sub.id)
            ? { ...sub, last_message_sent: now, updated_at: now }
            : sub
        )
      );

      toast.success(`Message envoyé à ${selected.length} abonnés`);
      setBroadcastMessage('');
      setIsMessageDialogOpen(false);
    } catch (err) {
      toast.error("Erreur lors de l'envoi du message");
    } finally {
      setIsSending(false);
    }
  };

  const handleImportNumbers = async () => {
    if (!importNumbers.trim()) {
      toast.error('Veuillez saisir des numéros');
      return;
    }
    setIsImporting(true);
    try {
      const numbers = importNumbers.split('\n').map(l => l.trim()).filter(l => l.length > 8);

      if (numbers.length === 0) {
        toast.error('Aucun numéro valide trouvé');
        return;
      }

      const { data: existing, error: checkError } = await supabase
        .from('whatsapp_subscribers')
        .select('phone')
        .in('phone', numbers);

      if (checkError) throw checkError;

      const existingPhones = new Set(existing?.map(sub => sub.phone));
      const newNumbers = numbers.filter(phone => !existingPhones.has(phone));

      if (newNumbers.length === 0) {
        toast.warning('Tous les numéros existent déjà dans la base de données');
        return;
      }

      const now = new Date().toISOString();
      const newSubscribers = newNumbers.map(phone => ({
        phone,
        country: 'SN',
        status: 'active',
        subscribed_at: now,
        name: '',
        email: '',
        created_at: now,
        updated_at: now
      }));

      const { data: insertedData, error: insertError } = await supabase
        .from('whatsapp_subscribers')
        .insert(newSubscribers)
        .select();

      if (insertError) throw insertError;

      setSubscribers(prev => [...prev, ...(insertedData || [])]);
      toast.success(`${newNumbers.length} nouveaux abonnés ajoutés avec succès`);
      setImportNumbers('');
      setIsImportDialogOpen(false);
    } catch (err) {
      toast.error("Erreur lors de l'import des numéros");
    } finally {
      setIsImporting(false);
    }
  };

  // ─── CSV Import handlers ─────────────────────────────────────────────────────

  const handleCsvFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCsvFileName(file.name);
    setCsvParsedContacts([]);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const parsed = parseCSV(text);
      setCsvParsedContacts(parsed);
    };
    reader.readAsText(file, 'UTF-8');
  };

  const handleCsvImport = async () => {
    if (csvParsedContacts.length === 0) {
      toast.error('Aucun contact à importer');
      return;
    }
    setIsCsvImporting(true);
    try {
      const phones = csvParsedContacts.map(c => c.phone);

      // Check existing phones
      const { data: existing, error: checkError } = await supabase
        .from('whatsapp_subscribers')
        .select('phone')
        .in('phone', phones);

      if (checkError) throw checkError;

      const existingPhones = new Set(existing?.map(sub => sub.phone));
      const newContacts = csvParsedContacts.filter(c => !existingPhones.has(c.phone));
      const skipped = csvParsedContacts.length - newContacts.length;

      if (newContacts.length === 0) {
        toast.warning(`0 contact importé — ${skipped} doublon(s) ignoré(s)`);
        return;
      }

      const now = new Date().toISOString();
      const toInsert = newContacts.map(c => ({
        phone: c.phone,
        name: c.name,
        email: c.email,
        country: c.country || 'SN',
        status: 'active',
        subscribed_at: now,
        created_at: now,
        updated_at: now
      }));

      const { data: insertedData, error: insertError } = await supabase
        .from('whatsapp_subscribers')
        .insert(toInsert)
        .select();

      if (insertError) throw insertError;

      setSubscribers(prev => [...prev, ...(insertedData || [])]);
      toast.success(`${newContacts.length} contact(s) importé(s), ${skipped} ignoré(s) (doublons)`);
      setCsvParsedContacts([]);
      setCsvFileName('');
      if (csvInputRef.current) csvInputRef.current.value = '';
      setIsCsvDialogOpen(false);
    } catch (err: any) {
      toast.error(`Erreur lors de l'import CSV: ${err.message || err}`);
    } finally {
      setIsCsvImporting(false);
    }
  };

  const closeCsvDialog = () => {
    setCsvParsedContacts([]);
    setCsvFileName('');
    if (csvInputRef.current) csvInputRef.current.value = '';
    setIsCsvDialogOpen(false);
  };

  // ─── Export CSV ──────────────────────────────────────────────────────────────

  const exportToCsv = () => {
    const headers = ['ID', 'Téléphone', 'Pays', 'Statut', "Date d'inscription", 'Dernier message envoyé', 'Nom', 'Email'];
    const csvData = filteredSubscribers.map(sub => [
      sub.id,
      sub.phone,
      sub.country,
      sub.status,
      new Date(sub.subscribed_at).toLocaleDateString('fr-FR'),
      sub.last_message_sent ? new Date(sub.last_message_sent).toLocaleDateString('fr-FR') : '-',
      sub.name || '-',
      sub.email || '-'
    ]);

    csvData.unshift(headers);
    const csvContent = csvData.map(row =>
      row.map(cell => typeof cell === 'string' && cell.includes(',') ? `"${cell}"` : cell).join(',')
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `abonnes_whatsapp_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const uniqueCountries = [...new Set(subscribers.map(sub => sub.country))].sort();

  // ─── Loading / Error ─────────────────────────────────────────────────────────

  if (loading && !refreshing) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Loader2 className="h-12 w-12 animate-spin text-[#ff7f50] mb-4" />
        <p className="text-gray-500">Chargement des abonnés WhatsApp...</p>
      </div>
    );
  }

  if (error && !refreshing) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-1" />
          <div>
            <h3 className="font-medium text-red-800">Erreur</h3>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
        <Button onClick={handleRefresh} className="flex items-center">
          <RefreshCw className="h-4 w-4 mr-2" />
          Réessayer
        </Button>
      </div>
    );
  }

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#0f4c81]">Abonnés WhatsApp</h1>
          <p className="text-gray-500">Gestion des abonnés à la liste de diffusion WhatsApp</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            onClick={() => setIsMessageDialogOpen(true)}
            variant="default"
            size="sm"
            className="flex items-center bg-[#25D366] hover:bg-[#128C7E]"
          >
            <Send className="h-4 w-4 mr-2" />
            Envoyer un message
          </Button>

          <Button
            onClick={() => setIsCsvDialogOpen(true)}
            variant="outline"
            size="sm"
            className="flex items-center"
          >
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Importer CSV
          </Button>

          <Button
            onClick={() => setIsImportDialogOpen(true)}
            variant="outline"
            size="sm"
            className="flex items-center"
          >
            <UploadCloud className="h-4 w-4 mr-2" />
            Importer
          </Button>

          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            className="flex items-center"
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>

          <Button
            onClick={exportToCsv}
            variant="outline"
            size="sm"
            className="flex items-center"
          >
            <Download className="h-4 w-4 mr-2" />
            Exporter CSV
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total des abonnés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-gray-500">{stats.weekNew} nouveaux cette semaine</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Abonnés actifs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
            <p className="text-xs text-gray-500">
              Taux d'activité : {stats.total > 0 ? ((stats.active / stats.total) * 100).toFixed(1) : 0}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Abonnés inactifs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inactive}</div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Inactifs : {stats.inactive}</span>
              <span>Bloqués : {stats.blocked}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Nouveaux aujourd'hui</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayNew}</div>
            <p className="text-xs text-gray-500">
              {stats.todayNew > 0 ? '+' : ''}{stats.todayNew} depuis minuit
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 bg-white p-4 rounded-lg border shadow-sm">
        <div className="lg:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher par téléphone, nom, pays..."
              className="pl-10"
            />
          </div>
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger><SelectValue placeholder="Tous les statuts" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="active">Actifs</SelectItem>
            <SelectItem value="inactive">Inactifs</SelectItem>
            <SelectItem value="blocked">Bloqués</SelectItem>
          </SelectContent>
        </Select>

        <Select value={countryFilter} onValueChange={setCountryFilter}>
          <SelectTrigger><SelectValue placeholder="Tous les pays" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les pays</SelectItem>
            {uniqueCountries.map(country => (
              <SelectItem key={country} value={country}>{country}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={timeFilter} onValueChange={setTimeFilter}>
          <SelectTrigger><SelectValue placeholder="Toute période" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toute période</SelectItem>
            <SelectItem value="today">Aujourd'hui</SelectItem>
            <SelectItem value="week">Cette semaine</SelectItem>
            <SelectItem value="month">Ce mois-ci</SelectItem>
            <SelectItem value="quarter">Ce trimestre</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table des abonnés */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer" onClick={() => handleSort('subscribed_at')}>
                  <div className="flex items-center">
                    Date d'inscription
                    {sortField === 'subscribed_at' && <ArrowUpDown className="ml-2 h-4 w-4" />}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('phone')}>
                  <div className="flex items-center">
                    Téléphone
                    {sortField === 'phone' && <ArrowUpDown className="ml-2 h-4 w-4" />}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('country')}>
                  <div className="flex items-center">
                    Pays
                    {sortField === 'country' && <ArrowUpDown className="ml-2 h-4 w-4" />}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('status')}>
                  <div className="flex items-center">
                    Statut
                    {sortField === 'status' && <ArrowUpDown className="ml-2 h-4 w-4" />}
                  </div>
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('last_message_sent')}>
                  <div className="flex items-center">
                    Dernier message
                    {sortField === 'last_message_sent' && <ArrowUpDown className="ml-2 h-4 w-4" />}
                  </div>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubscribers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    Aucun résultat trouvé.
                    {(searchTerm || statusFilter !== 'all' || countryFilter !== 'all' || timeFilter !== 'all') && (
                      <div className="mt-2">
                        <Button onClick={resetFilters} variant="outline" size="sm">
                          Réinitialiser les filtres
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                filteredSubscribers.map((subscriber) => (
                  <TableRow key={subscriber.id} className="hover:bg-gray-50">
                    <TableCell className="whitespace-nowrap">
                      {new Date(subscriber.subscribed_at).toLocaleDateString('fr-FR')}
                      <div className="text-xs text-gray-500">
                        {formatRelativeDate(subscriber.subscribed_at)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Smartphone className="h-4 w-4 mr-2 text-gray-400" />
                        <a
                          href={`https://wa.me/${subscriber.phone.replace(/\s+/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {subscriber.phone}
                        </a>
                      </div>
                    </TableCell>
                    <TableCell>{subscriber.country}</TableCell>
                    <TableCell><StatusBadge status={subscriber.status} /></TableCell>
                    <TableCell>
                      {subscriber.last_message_sent ? (
                        <>
                          {new Date(subscriber.last_message_sent).toLocaleDateString('fr-FR')}
                          <div className="text-xs text-gray-500">
                            {formatRelativeDate(subscriber.last_message_sent)}
                          </div>
                        </>
                      ) : (
                        <span className="text-gray-400 text-sm">Jamais</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <a
                          href={`https://wa.me/${subscriber.phone.replace(/\s+/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-[#25D366] text-white hover:bg-opacity-90"
                        >
                          <WhatsAppIcon className="h-4 w-4" />
                        </a>

                        <Select
                          value={subscriber.status}
                          onValueChange={(value) => handleStatusChange(subscriber.id, value as StatusType)}
                        >
                          <SelectTrigger className="h-8 w-28">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Actif</SelectItem>
                            <SelectItem value="inactive">Inactif</SelectItem>
                            <SelectItem value="blocked">Bloqué</SelectItem>
                          </SelectContent>
                        </Select>

                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteSubscriber(subscriber.id)}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <div className="p-4 border-t flex justify-between items-center">
          <p className="text-sm text-gray-500">
            Affichage de {filteredSubscribers.length} sur {subscribers.length} abonnés
          </p>
          <Button
            onClick={resetFilters}
            variant="ghost"
            size="sm"
            className="hidden lg:flex items-center"
            disabled={!(searchTerm || statusFilter !== 'all' || countryFilter !== 'all' || timeFilter !== 'all')}
          >
            Réinitialiser les filtres
          </Button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          Dialog — Envoyer un message
      ═══════════════════════════════════════════════════════════════════════ */}
      <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Envoyer un message aux abonnés</DialogTitle>
            <DialogDescription>
              Le message sera envoyé à {filteredSubscribers.filter(sub => sub.status === 'active').length} abonnés actifs.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                placeholder="Saisissez votre message..."
                className="h-40"
              />
              <p className="text-xs text-gray-500">
                Ce message sera envoyé à tous les abonnés actifs filtrés.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsMessageDialogOpen(false)} disabled={isSending}>
              Annuler
            </Button>
            <Button
              type="submit"
              onClick={handleSendBroadcastMessage}
              disabled={isSending || !broadcastMessage.trim()}
              className="bg-[#25D366] hover:bg-[#128C7E]"
            >
              {isSending ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Envoi en cours...</>
              ) : (
                <><Send className="mr-2 h-4 w-4" />Envoyer</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ═══════════════════════════════════════════════════════════════════════
          Dialog — Import numéros (texte brut)
      ═══════════════════════════════════════════════════════════════════════ */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Importer des numéros</DialogTitle>
            <DialogDescription>
              Un numéro par ligne, format international de préférence (+221XXXXXXXX).
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="numbers">Numéros de téléphone</Label>
              <Textarea
                id="numbers"
                value={importNumbers}
                onChange={(e) => setImportNumbers(e.target.value)}
                placeholder={`+221781234567\n+221771234567\n+221701234567`}
                className="h-40 font-mono"
              />
              <p className="text-xs text-gray-500">Les numéros déjà existants seront ignorés.</p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsImportDialogOpen(false)} disabled={isImporting}>
              Annuler
            </Button>
            <Button
              type="submit"
              onClick={handleImportNumbers}
              disabled={isImporting || !importNumbers.trim()}
            >
              {isImporting ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Importation en cours...</>
              ) : (
                <><UploadCloud className="mr-2 h-4 w-4" />Importer</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ═══════════════════════════════════════════════════════════════════════
          Dialog — Import CSV
      ═══════════════════════════════════════════════════════════════════════ */}
      <Dialog open={isCsvDialogOpen} onOpenChange={closeCsvDialog}>
        <DialogContent className="sm:max-w-[620px]">
          <DialogHeader>
            <DialogTitle>Importer via CSV</DialogTitle>
            <DialogDescription>
              Importez une liste de contacts depuis un fichier CSV.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-2">
            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
              <p className="font-semibold mb-1">Format attendu :</p>
              <p className="font-mono text-xs bg-white border rounded p-2 text-gray-700">
                nom, téléphone, email, pays
              </p>
              <ul className="mt-2 space-y-1 text-xs">
                <li>L'ordre des colonnes n'a pas d'importance</li>
                <li>Séparateurs acceptés : virgule (,) ou point-virgule (;)</li>
                <li>Noms de colonnes reconnus : <em>nom / name</em>, <em>téléphone / telephone / phone / whatsapp</em>, <em>email</em>, <em>pays / country</em></li>
                <li>La colonne <strong>téléphone</strong> est obligatoire</li>
              </ul>
            </div>

            {/* Input fichier */}
            <div className="space-y-2">
              <Label htmlFor="csvFile">Fichier CSV</Label>
              <input
                ref={csvInputRef}
                id="csvFile"
                type="file"
                accept=".csv"
                onChange={handleCsvFileChange}
                className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-[#0f4c81] file:text-white hover:file:bg-[#0f4c81]/90 cursor-pointer border border-gray-200 rounded-md p-1"
              />
              {csvFileName && (
                <p className="text-xs text-gray-500">Fichier sélectionné : <strong>{csvFileName}</strong></p>
              )}
            </div>

            {/* Aperçu */}
            {csvParsedContacts.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">
                  <span className="text-[#0f4c81] font-bold">{csvParsedContacts.length}</span> contact(s) trouvé(s) dans le fichier
                </p>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left py-2 px-3 font-medium text-gray-600">Nom</th>
                        <th className="text-left py-2 px-3 font-medium text-gray-600">Téléphone</th>
                        <th className="text-left py-2 px-3 font-medium text-gray-600">Email</th>
                        <th className="text-left py-2 px-3 font-medium text-gray-600">Pays</th>
                      </tr>
                    </thead>
                    <tbody>
                      {csvParsedContacts.slice(0, 5).map((c, i) => (
                        <tr key={i} className="border-t">
                          <td className="py-2 px-3 text-gray-700">{c.name || <span className="text-gray-400">—</span>}</td>
                          <td className="py-2 px-3 font-mono text-gray-700">{c.phone}</td>
                          <td className="py-2 px-3 text-gray-700">{c.email || <span className="text-gray-400">—</span>}</td>
                          <td className="py-2 px-3 text-gray-700">{c.country || 'SN'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {csvParsedContacts.length > 5 && (
                    <div className="py-2 px-3 bg-gray-50 border-t text-xs text-gray-500">
                      … et {csvParsedContacts.length - 5} autre(s) contact(s)
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  Les contacts dont le numéro existe déjà seront ignorés (doublons).
                </p>
              </div>
            )}

            {csvFileName && csvParsedContacts.length === 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
                Aucun contact valide trouvé. Vérifiez que votre fichier contient bien une colonne <strong>téléphone</strong>.
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeCsvDialog} disabled={isCsvImporting}>
              Annuler
            </Button>
            <Button
              onClick={handleCsvImport}
              disabled={isCsvImporting || csvParsedContacts.length === 0}
              className="bg-[#0f4c81] hover:bg-[#0f4c81]/90"
            >
              {isCsvImporting ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Importation...</>
              ) : (
                <><FileSpreadsheet className="mr-2 h-4 w-4" />Importer {csvParsedContacts.length > 0 ? `(${csvParsedContacts.length})` : ''}</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default withAdminAuth(WhatsAppSubscribersPage);
