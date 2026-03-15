'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { AlertCircle, Filter, Search, RefreshCw, Calendar, Mail, Phone, Globe, Cpu, Cloud, ShoppingCart } from 'lucide-react';
import { supabase } from '@/app/lib/supabase';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Input } from '@/app/components/ui/input';
import { toast } from 'sonner';
import { withAdminAuth } from '@/app/lib/withAdminAuth';

interface SiteProjectRequest {
  id: string;
  created_at: string;
  full_name: string;
  email: string;
  whatsapp: string;
  project_type: 'ecommerce' | 'vitrine' | 'webapp' | 'saas';
  company_name: string | null;
  budget_range: string | null;
  deadline: string | null;
  status: 'new' | 'contacted' | 'in_progress' | 'completed' | 'cancelled';
  notes: string;
}

const PROJECT_TYPE_LABELS: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  ecommerce: { label: 'E-commerce',    color: 'bg-green-100 text-green-800',  icon: <ShoppingCart className="w-3 h-3" /> },
  vitrine:   { label: 'Site vitrine',  color: 'bg-blue-100 text-blue-800',    icon: <Globe className="w-3 h-3" /> },
  webapp:    { label: 'App web',       color: 'bg-purple-100 text-purple-800', icon: <Cpu className="w-3 h-3" /> },
  saas:      { label: 'SaaS',          color: 'bg-orange-100 text-orange-800', icon: <Cloud className="w-3 h-3" /> },
};

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  new:         { label: 'Nouveau',    color: 'bg-blue-100 text-blue-800' },
  contacted:   { label: 'Contacté',  color: 'bg-yellow-100 text-yellow-800' },
  in_progress: { label: 'En cours',  color: 'bg-purple-100 text-purple-800' },
  completed:   { label: 'Terminé',   color: 'bg-green-100 text-green-800' },
  cancelled:   { label: 'Annulé',    color: 'bg-red-100 text-red-800' },
};

const STATUS_NEXT: Record<string, SiteProjectRequest['status']> = {
  new: 'contacted',
  contacted: 'in_progress',
  in_progress: 'completed',
};

function SiteProjectsPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<SiteProjectRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => { fetchRequests(); }, []);

  const fetchRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('site_project_requests')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setRequests(data || []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: SiteProjectRequest['status']) => {
    try {
      const { error } = await supabase
        .from('site_project_requests')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
      setRequests(r => r.map(req => req.id === id ? { ...req, status } : req));
      toast.success(`Statut mis à jour : ${STATUS_LABELS[status].label}`);
    } catch (e: any) {
      toast.error(`Erreur : ${e.message}`);
    }
  };

  const filtered = requests.filter(r => {
    const q = search.toLowerCase();
    const matchSearch = !q || r.full_name?.toLowerCase().includes(q) || r.email?.toLowerCase().includes(q)
      || r.company_name?.toLowerCase().includes(q) || r.whatsapp?.includes(q);
    const matchType = typeFilter === 'all' || r.project_type === typeFilter;
    const matchStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  const formatDate = (d: string) => new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
  }).format(new Date(d));

  const stats = {
    total: requests.length,
    new: requests.filter(r => r.status === 'new').length,
    in_progress: requests.filter(r => r.status === 'in_progress').length,
    completed: requests.filter(r => r.status === 'completed').length,
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-[#0f4c81]">Projets Web</h2>
        <p className="text-gray-500">Formulaires de demande de création de site ou d'application</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: stats.total, color: 'text-gray-800' },
          { label: 'Nouveaux', value: stats.new, color: 'text-blue-600' },
          { label: 'En cours', value: stats.in_progress, color: 'text-purple-600' },
          { label: 'Terminés', value: stats.completed, color: 'text-green-600' },
        ].map(s => (
          <Card key={s.label}>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-500">{s.label}</CardTitle></CardHeader>
            <CardContent><p className={`text-2xl font-bold ${s.color}`}>{s.value}</p></CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-grow">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <div className="flex gap-3">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="border rounded-lg px-3 py-2 text-sm">
                <option value="all">Tous les types</option>
                <option value="ecommerce">E-commerce</option>
                <option value="vitrine">Site vitrine</option>
                <option value="webapp">App web</option>
                <option value="saas">SaaS</option>
              </select>
            </div>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border rounded-lg px-3 py-2 text-sm">
              <option value="all">Tous les statuts</option>
              <option value="new">Nouveaux</option>
              <option value="contacted">Contactés</option>
              <option value="in_progress">En cours</option>
              <option value="completed">Terminés</option>
              <option value="cancelled">Annulés</option>
            </select>
          </div>
        </div>
        <Button variant="outline" onClick={fetchRequests} className="flex items-center">
          <RefreshCw className="h-4 w-4 mr-2" /> Actualiser
        </Button>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0f4c81]" />
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">
              <AlertCircle className="h-10 w-10 mx-auto mb-2" /><p>{error}</p>
              <Button onClick={fetchRequests} className="mt-4">Réessayer</Button>
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center py-8 text-gray-500">Aucune demande trouvée.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Structure</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(req => {
                    const typeInfo = PROJECT_TYPE_LABELS[req.project_type];
                    const statusInfo = STATUS_LABELS[req.status] || STATUS_LABELS.new;
                    const nextStatus = STATUS_NEXT[req.status];
                    return (
                      <TableRow key={req.id} className="cursor-pointer hover:bg-gray-50" onClick={() => router.push(`/admin/site-projects/${req.id}`)}>
                        <TableCell onClick={e => e.stopPropagation()}>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Calendar className="h-3 w-3" />{formatDate(req.created_at)}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{req.full_name}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${typeInfo?.color}`}>
                            {typeInfo?.icon}{typeInfo?.label}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">{req.company_name || '—'}</TableCell>
                        <TableCell onClick={e => e.stopPropagation()}>
                          <div className="flex flex-col gap-1 text-xs">
                            <a href={`mailto:${req.email}`} className="flex items-center gap-1 text-blue-600 hover:underline">
                              <Mail className="h-3 w-3" />{req.email}
                            </a>
                            <a href={`https://wa.me/${req.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-green-600 hover:underline">
                              <Phone className="h-3 w-3" />{req.whatsapp}
                            </a>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600 max-w-32 truncate">{req.budget_range || '—'}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>{statusInfo.label}</span>
                        </TableCell>
                        <TableCell className="text-right" onClick={e => e.stopPropagation()}>
                          <div className="flex justify-end gap-2">
                            {nextStatus && (
                              <Button size="sm" variant="outline" onClick={() => updateStatus(req.id, nextStatus)}
                                className="text-xs">
                                → {STATUS_LABELS[nextStatus].label}
                              </Button>
                            )}
                            <Button size="sm" variant="outline" onClick={() => router.push(`/admin/site-projects/${req.id}`)}>
                              Voir
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default withAdminAuth(SiteProjectsPage);
