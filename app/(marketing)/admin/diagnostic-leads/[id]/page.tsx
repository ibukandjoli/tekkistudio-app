'use client';

import { useState, useEffect } from 'react';
import { withAdminAuth } from '@/app/components/admin/withAdminAuth';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Mail, Phone, Flame, Clock, User,
  MessageSquare, CheckCheck, Save, Printer,
} from 'lucide-react';

type Message = { role: 'user' | 'assistant'; content: string };

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
  full_transcript: Message[] | null;
  session_duration_seconds: number;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

const STATUS_OPTIONS = [
  { value: 'nouveau',          label: 'Nouveau',          classes: 'bg-blue-50 text-blue-700 border-blue-200' },
  { value: 'contacté',         label: 'Contacté',         classes: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  { value: 'en_négociation',   label: 'En négociation',   classes: 'bg-purple-50 text-purple-700 border-purple-200' },
  { value: 'converti',         label: 'Converti',         classes: 'bg-green-50 text-green-700 border-green-200' },
  { value: 'perdu',            label: 'Perdu',            classes: 'bg-gray-50 text-gray-500 border-gray-200' },
];

const SOURCE_LABELS: Record<string, string> = {
  'diagnostic-beaute': 'Diagnostic Beauté',
  diagnostic: 'Diagnostic Généraliste',
};

function formatDuration(s: number) {
  if (!s) return '–';
  const m = Math.floor(s / 60);
  return m > 0 ? `${m} min ${s % 60}s` : `${s}s`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', {
    weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function DiagnosticLeadDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/diagnostic-leads/${id}`)
      .then(r => r.json())
      .then(data => {
        setLead(data);
        setStatus(data.status || 'nouveau');
        setNotes(data.notes || '');
        setLoading(false);
      });
  }, [id]);

  const save = async () => {
    setSaving(true);
    await fetch('/api/admin/diagnostic-leads', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status, notes }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-gray-400 text-sm">Chargement…</div>
  );
  if (!lead) return (
    <div className="p-6 text-sm text-red-500">Lead introuvable.</div>
  );

  const currentStatus = STATUS_OPTIONS.find(s => s.value === status) || STATUS_OPTIONS[0];

  return (
    <>
      {/* Print-only styles */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-zone { padding: 0 !important; }
          body { font-size: 12px; }
        }
      `}</style>

      <div className="p-6 max-w-4xl mx-auto space-y-6 print-zone">
        {/* Nav */}
        <div className="flex items-center justify-between no-print">
          <Link href="/admin/diagnostic-leads"
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Retour aux diagnostics
          </Link>
          <button onClick={() => window.print()}
            className="flex items-center gap-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors">
            <Printer className="w-4 h-4" /> Imprimer / PDF
          </button>
        </div>

        {/* En-tête */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {lead.brand_name || <span className="text-gray-400 italic">Marque inconnue</span>}
              </h1>
              <div className="flex items-center gap-3 mt-1 flex-wrap">
                <span className="text-sm text-gray-500">{lead.niche || '–'}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                  {SOURCE_LABELS[lead.source] || lead.source}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1">{formatDate(lead.created_at)}</p>
            </div>
            <span className={`text-sm font-medium px-3 py-1.5 rounded-full border ${currentStatus.classes}`}>
              {currentStatus.label}
            </span>
          </div>
        </div>

        {/* Grille infos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Contact */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Contact</h2>
            <div className="space-y-3">
              {lead.contact_email && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Email</p>
                    <a href={`mailto:${lead.contact_email}`} className="text-sm text-blue-600 hover:underline">
                      {lead.contact_email}
                    </a>
                  </div>
                </div>
              )}
              {lead.contact_whatsapp && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 text-green-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">WhatsApp</p>
                    <a href={`https://wa.me/${lead.contact_whatsapp.replace(/\D/g, '')}`}
                      target="_blank" rel="noreferrer" className="text-sm text-green-600 hover:underline">
                      {lead.contact_whatsapp}
                    </a>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4 text-gray-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Durée de la conversation</p>
                  <p className="text-sm text-gray-700">{formatDuration(lead.session_duration_seconds)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contexte business */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Contexte business</h2>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Traction actuelle</p>
                <p className="text-sm text-gray-700">{lead.traction_level || '–'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Temps perdu / jour</p>
                <p className="text-sm text-orange-600 font-medium">{lead.pain_point_hours || '–'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Douleur identifiée */}
        {lead.pain_point_summary && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-5 h-5 text-tekki-orange" />
              <h2 className="text-sm font-semibold text-gray-900">La douleur identifiée par l'IA</h2>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">{lead.pain_point_summary}</p>
          </div>
        )}

        {/* Transcript */}
        {lead.full_transcript && lead.full_transcript.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-gray-400" />
              <h2 className="text-sm font-semibold text-gray-900">Conversation complète</h2>
              <span className="text-xs text-gray-400 ml-auto">{lead.full_transcript.length} messages</span>
            </div>
            <div className="p-5 space-y-4 max-h-[600px] overflow-y-auto">
              {lead.full_transcript.map((msg, i) => (
                <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold
                    ${msg.role === 'assistant' ? 'bg-tekki-orange' : 'bg-tekki-blue'}`}>
                    {msg.role === 'assistant' ? 'IA' : <User className="w-3.5 h-3.5" />}
                  </div>
                  <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap
                    ${msg.role === 'assistant'
                      ? 'bg-gray-100 text-gray-800 rounded-tl-none'
                      : 'bg-tekki-blue text-white rounded-tr-none'
                    }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Gestion interne */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4 no-print">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Gestion interne</h2>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Statut du lead</label>
            <select value={status} onChange={e => setStatus(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-tekki-orange text-gray-700 bg-white">
              {STATUS_OPTIONS.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Notes internes</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={4}
              placeholder="Observations, actions menées, prochaine étape…"
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-tekki-orange text-gray-700 resize-none" />
          </div>
          <button onClick={save} disabled={saving}
            className="flex items-center gap-2 bg-tekki-orange text-white text-sm px-5 py-2.5 rounded-lg hover:bg-tekki-orange/90 disabled:opacity-60 transition-all font-medium">
            {saved
              ? <><CheckCheck className="w-4 h-4" /> Enregistré</>
              : <><Save className="w-4 h-4" /> {saving ? 'Enregistrement…' : 'Enregistrer'}</>
            }
          </button>
        </div>
      </div>
    </>
  );
}

export default withAdminAuth(DiagnosticLeadDetailPage);
