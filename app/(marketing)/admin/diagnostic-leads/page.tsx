'use client';

import { useState, useEffect, useCallback } from 'react';
import { withAdminAuth } from '@/app/lib/withAdminAuth';
import Link from 'next/link';
import {
  Search, Filter, ChevronLeft, ChevronRight,
  Flame, Clock, Mail, Phone, ExternalLink, RefreshCw,
} from 'lucide-react';

type Lead = {
  id: string;
  source: string;
  brand_name: string | null;
  niche: string | null;
  contact_email: string | null;
  contact_whatsapp: string | null;
  traction_level: string | null;
  pain_point_hours: string | null;
  pain_point_summary: string | null;
  session_duration_seconds: number;
  status: string;
  notes: string | null;
  created_at: string;
};

const STATUS_LABELS: Record<string, { label: string; classes: string }> = {
  nouveau:        { label: 'Nouveau',        classes: 'bg-blue-50 text-blue-700 border-blue-200' },
  contacté:       { label: 'Contacté',       classes: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  'en_négociation': { label: 'En négociation', classes: 'bg-purple-50 text-purple-700 border-purple-200' },
  converti:       { label: 'Converti',       classes: 'bg-green-50 text-green-700 border-green-200' },
  perdu:          { label: 'Perdu',          classes: 'bg-gray-50 text-gray-500 border-gray-200' },
};

const SOURCE_LABELS: Record<string, string> = {
  'diagnostic-beaute': 'Beauté',
  diagnostic: 'Généraliste',
};

function formatDuration(seconds: number) {
  if (!seconds) return '–';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

function DiagnosticLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page), limit: '20',
      status: statusFilter, source: sourceFilter,
      ...(search ? { search } : {}),
    });
    const res = await fetch(`/api/admin/diagnostic-leads?${params}`);
    const json = await res.json();
    setLeads(json.data || []);
    setTotal(json.count || 0);
    setTotalPages(json.totalPages || 1);
    setLoading(false);
  }, [page, search, statusFilter, sourceFilter]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const updateStatus = async (id: string, status: string) => {
    await fetch('/api/admin/diagnostic-leads', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
  };

  const nouveaux = leads.filter(l => l.status === 'nouveau').length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Diagnostics IA</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {total} lead{total > 1 ? 's' : ''} collecté{total > 1 ? 's' : ''} via le diagnostic
            {nouveaux > 0 && (
              <span className="ml-2 inline-flex items-center gap-1 text-blue-600 font-medium">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                {nouveaux} nouveau{nouveaux > 1 ? 'x' : ''}
              </span>
            )}
          </p>
        </div>
        <button onClick={fetchLeads} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors">
          <RefreshCw className="w-4 h-4" /> Actualiser
        </button>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Rechercher marque, email, WhatsApp…"
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-tekki-orange"
          />
        </div>
        <select value={sourceFilter} onChange={e => { setSourceFilter(e.target.value); setPage(1); }}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-tekki-orange text-gray-700">
          <option value="all">Toutes les sources</option>
          <option value="diagnostic-beaute">Diagnostic Beauté</option>
          <option value="diagnostic">Diagnostic Généraliste</option>
        </select>
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-tekki-orange text-gray-700">
          <option value="all">Tous les statuts</option>
          {Object.entries(STATUS_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48 text-gray-400 text-sm">Chargement…</div>
        ) : leads.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-gray-400 text-sm gap-2">
            <Flame className="w-8 h-8 opacity-30" />
            Aucun lead trouvé
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Marque</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Contact</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Douleur</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Durée</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Source</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Statut</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Date</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {leads.map(lead => {
                  const s = STATUS_LABELS[lead.status] || STATUS_LABELS.nouveau;
                  return (
                    <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900 text-sm">{lead.brand_name || <span className="text-gray-400 italic">Inconnu</span>}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{lead.niche || '–'}</p>
                      </td>
                      <td className="px-4 py-3 space-y-1">
                        {lead.contact_email && (
                          <a href={`mailto:${lead.contact_email}`} className="flex items-center gap-1.5 text-xs text-blue-600 hover:underline">
                            <Mail className="w-3 h-3" /> {lead.contact_email}
                          </a>
                        )}
                        {lead.contact_whatsapp && (
                          <a href={`https://wa.me/${lead.contact_whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer"
                            className="flex items-center gap-1.5 text-xs text-green-600 hover:underline">
                            <Phone className="w-3 h-3" /> {lead.contact_whatsapp}
                          </a>
                        )}
                      </td>
                      <td className="px-4 py-3 max-w-xs">
                        {lead.pain_point_summary ? (
                          <p className="text-xs text-gray-600 line-clamp-2">{lead.pain_point_summary}</p>
                        ) : <span className="text-xs text-gray-300">–</span>}
                        {lead.pain_point_hours && (
                          <span className="inline-flex items-center gap-1 mt-1 text-xs text-orange-500">
                            <Clock className="w-3 h-3" /> {lead.pain_point_hours}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                        {formatDuration(lead.session_duration_seconds)}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                          {SOURCE_LABELS[lead.source] || lead.source}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <select value={lead.status} onChange={e => updateStatus(lead.id, e.target.value)}
                          className={`text-xs border rounded-full px-2.5 py-1 font-medium focus:outline-none cursor-pointer ${s.classes}`}>
                          {Object.entries(STATUS_LABELS).map(([k, v]) => (
                            <option key={k} value={k}>{v.label}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                        {formatDate(lead.created_at)}
                      </td>
                      <td className="px-4 py-3">
                        <Link href={`/admin/diagnostic-leads/${lead.id}`}
                          className="inline-flex items-center gap-1 text-xs text-tekki-orange hover:underline font-medium whitespace-nowrap">
                          Voir <ExternalLink className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">Page {page} sur {totalPages}</p>
          <div className="flex gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default withAdminAuth(DiagnosticLeadsPage);
