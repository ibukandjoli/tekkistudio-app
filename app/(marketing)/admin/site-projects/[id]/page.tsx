'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { ArrowLeft, Mail, Phone, Calendar, Globe, Cpu, Cloud, ShoppingCart, Edit2, Check, Printer } from 'lucide-react';
import { supabase } from '@/app/lib/supabase';
import { toast } from 'sonner';
import { withAdminAuth } from '@/app/lib/withAdminAuth';

const PROJECT_TYPE_LABELS: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  ecommerce: { label: 'E-commerce',   color: 'bg-green-100 text-green-800',   icon: <ShoppingCart className="w-4 h-4" /> },
  vitrine:   { label: 'Site vitrine', color: 'bg-blue-100 text-blue-800',     icon: <Globe className="w-4 h-4" /> },
  webapp:    { label: 'App web',      color: 'bg-purple-100 text-purple-800', icon: <Cpu className="w-4 h-4" /> },
  saas:      { label: 'SaaS',         color: 'bg-orange-100 text-orange-800', icon: <Cloud className="w-4 h-4" /> },
};

const STATUS_OPTIONS = [
  { value: 'new',         label: 'Nouveau',   color: 'bg-blue-100 text-blue-800' },
  { value: 'contacted',   label: 'Contacté',  color: 'bg-yellow-100 text-yellow-800' },
  { value: 'in_progress', label: 'En cours',  color: 'bg-purple-100 text-purple-800' },
  { value: 'completed',   label: 'Terminé',   color: 'bg-green-100 text-green-800' },
  { value: 'cancelled',   label: 'Annulé',    color: 'bg-red-100 text-red-800' },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="pb-3"><CardTitle className="text-base font-semibold text-[#0f4c81]">{title}</CardTitle></CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function Row({ label, value }: { label: string; value?: string | string[] | null }) {
  if (!value || (Array.isArray(value) && value.length === 0)) return null;
  return (
    <div className="flex flex-col sm:flex-row gap-1 py-2 border-b border-gray-100 last:border-0">
      <dt className="text-sm font-medium text-gray-500 sm:w-56 flex-shrink-0">{label}</dt>
      <dd className="text-sm text-gray-800">
        {Array.isArray(value) ? (
          <div className="flex flex-wrap gap-1">
            {value.map((v, i) => (
              <span key={i} className="px-2 py-0.5 bg-gray-100 rounded-full text-xs">{v}</span>
            ))}
          </div>
        ) : (
          <span className="whitespace-pre-line">{value}</span>
        )}
      </dd>
    </div>
  );
}

function SiteProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [request, setRequest] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingStatus, setEditingStatus] = useState(false);
  const [editingNotes, setEditingNotes] = useState(false);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchRequest = async () => {
      const { data, error } = await supabase.from('site_project_requests').select('*').eq('id', id).single();
      if (error || !data) { router.push('/admin/site-projects'); return; }
      setRequest(data);
      setNotes(data.notes || '');
      setLoading(false);
    };
    fetchRequest();
  }, [id, router]);

  const updateStatus = async (status: string) => {
    setSaving(true);
    const { error } = await supabase.from('site_project_requests').update({ status, updated_at: new Date().toISOString() }).eq('id', id);
    if (error) { toast.error('Erreur lors de la mise à jour'); } else {
      setRequest((r: any) => ({ ...r, status }));
      toast.success('Statut mis à jour');
    }
    setSaving(false);
    setEditingStatus(false);
  };

  const saveNotes = async () => {
    setSaving(true);
    const { error } = await supabase.from('site_project_requests').update({ notes, updated_at: new Date().toISOString() }).eq('id', id);
    if (error) { toast.error('Erreur'); } else { setRequest((r: any) => ({ ...r, notes })); toast.success('Notes sauvegardées'); }
    setSaving(false);
    setEditingNotes(false);
  };

  if (loading) {
    return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0f4c81]" /></div>;
  }
  if (!request) return null;

  const r = request.responses || {};
  const typeInfo = PROJECT_TYPE_LABELS[request.project_type] || PROJECT_TYPE_LABELS.vitrine;
  const statusInfo = STATUS_OPTIONS.find(s => s.value === request.status) || STATUS_OPTIONS[0];

  const formatDate = (d: string) => new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  }).format(new Date(d));

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Print styles */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .print-zone, .print-zone * { visibility: visible; }
          .print-zone { position: absolute; inset: 0; padding: 24px; }
          .no-print { display: none !important; }
          .print-header { border-bottom: 2px solid #0f4c81; padding-bottom: 16px; margin-bottom: 24px; }
          @page { margin: 20mm; }
        }
      `}</style>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <button onClick={() => router.push('/admin/site-projects')} className="mt-1 text-gray-400 hover:text-[#0f4c81] transition-colors no-print">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-[#0f4c81]">{request.full_name}</h2>
            <div className="flex items-center gap-3 mt-1 flex-wrap">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${typeInfo.color}`}>
                {typeInfo.icon}{typeInfo.label}
              </span>
              <span className="text-gray-400 text-xs flex items-center gap-1">
                <Calendar className="w-3 h-3" />{formatDate(request.created_at)}
              </span>
            </div>
          </div>
        </div>

        {/* Status + Print */}
        <div className="flex flex-col items-end gap-2">
          {editingStatus ? (
            <div className="flex flex-col gap-1 bg-white shadow-lg rounded-xl border p-3 z-10 no-print">
              {STATUS_OPTIONS.map(opt => (
                <button key={opt.value} onClick={() => updateStatus(opt.value)} disabled={saving}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium text-left hover:opacity-80 ${opt.color} ${request.status === opt.value ? 'ring-2 ring-offset-1 ring-gray-400' : ''}`}>
                  {opt.label}
                </button>
              ))}
              <button onClick={() => setEditingStatus(false)} className="text-xs text-gray-400 mt-1 text-center">Annuler</button>
            </div>
          ) : (
            <button onClick={() => setEditingStatus(true)}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${statusInfo.color} hover:opacity-80 transition-opacity no-print`}>
              {statusInfo.label} <Edit2 className="w-3 h-3" />
            </button>
          )}
          <button
            onClick={handlePrint}
            className="no-print inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          >
            <Printer className="w-3 h-3" /> Exporter PDF
          </button>
        </div>
      </div>

      {/* ── Contenu exportable en PDF ── */}
      <div className="print-zone space-y-6">

      {/* Print header (visible only in print) */}
      <div className="print-header hidden print:block">
        <div className="text-xl font-bold text-[#0f4c81]">TEKKI Studio — Demande de projet web</div>
        <div className="text-sm text-gray-500 mt-1">
          {request.full_name} · {typeInfo.label} · {formatDate(request.created_at)}
        </div>
      </div>

      {/* Contact card */}
      <Section title="Contact">
        <dl className="divide-y divide-gray-100">
          <Row label="Nom complet" value={request.full_name} />
          <Row label="Structure / Projet" value={request.company_name} />
          <Row label="Localisation" value={r.location} />
          <div className="flex flex-col sm:flex-row gap-1 py-2 border-b border-gray-100">
            <dt className="text-sm font-medium text-gray-500 sm:w-56 flex-shrink-0">E-mail</dt>
            <dd><a href={`mailto:${request.email}`} className="text-sm text-blue-600 hover:underline flex items-center gap-1"><Mail className="w-3 h-3" />{request.email}</a></dd>
          </div>
          <div className="flex flex-col sm:flex-row gap-1 py-2 border-b border-gray-100">
            <dt className="text-sm font-medium text-gray-500 sm:w-56 flex-shrink-0">WhatsApp</dt>
            <dd><a href={`https://wa.me/${request.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="text-sm text-green-600 hover:underline flex items-center gap-1"><Phone className="w-3 h-3" />{request.whatsapp}</a></dd>
          </div>
          <Row label="Statut juridique" value={r.legal_status !== 'Autre' ? r.legal_status : r.legal_status_other} />
        </dl>
      </Section>

      {/* Description du projet */}
      <Section title="Description du projet">
        <dl className="divide-y divide-gray-100">
          <Row label="Description" value={r.description} />
          {/* E-commerce */}
          {request.project_type === 'ecommerce' && <>
            <Row label="Types de produits" value={r.product_types} />
            <Row label="Volume catalogue" value={r.catalog_size} />
            <Row label="Modes de paiement" value={r.payment_methods} />
            <Row label="Zones de livraison" value={r.delivery_zones} />
            <Row label="Plateforme préférée" value={r.preferred_cms} />
          </>}
          {/* Vitrine */}
          {request.project_type === 'vitrine' && <>
            <Row label="Secteur(s)" value={r.sector} />
            <Row label="Cibles" value={r.target_audience} />
            <Row label="Zone géographique" value={r.geographic_zone} />
            <Row label="Pages souhaitées" value={r.desired_pages} />
          </>}
          {/* Webapp */}
          {request.project_type === 'webapp' && <>
            <Row label="Type d'application" value={r.app_type} />
            <Row label="Utilisateurs cibles" value={r.target_users} />
            <Row label="Fonctionnalités clés" value={r.key_features} />
            <Row label="Intégrations" value={r.integrations} />
          </>}
          {/* SaaS */}
          {request.project_type === 'saas' && <>
            <Row label="Modèle économique" value={r.business_model} />
            <Row label="Cible" value={r.b2b_b2c} />
            <Row label="Fonctionnalités" value={r.key_features} />
            <Row label="Stade du projet" value={r.mvp_or_full} />
          </>}
        </dl>
      </Section>

      {/* Objectifs */}
      <Section title="Objectifs">
        <dl className="divide-y divide-gray-100">
          <Row label="Objectifs" value={r.objectives} />
          <Row label="Action prioritaire" value={r.primary_action} />
          <Row label="Présence actuelle" value={r.existing_presence} />
          <Row label="Liens existants" value={r.existing_links} />
        </dl>
      </Section>

      {/* Design */}
      <Section title="Design & identité">
        <dl className="divide-y divide-gray-100">
          <Row label="Style visuel" value={r.visual_style} />
          <Row label="Couleurs" value={r.color_preferences} />
          <Row label="Sites de référence" value={r.reference_sites} />
          <Row label="À éviter" value={r.styles_to_avoid} />
        </dl>
      </Section>

      {/* Technique */}
      <Section title="Aspects techniques">
        <dl className="divide-y divide-gray-100">
          <Row label="Nom de domaine" value={r.has_domain === 'Oui' ? `Oui — ${r.domain_name || ''}` : r.has_domain} />
          <Row label="Fonctionnalités" value={r.desired_features} />
          <Row label="Multilingue" value={r.multilingual} />
          <Row label="CMS / Autonomie" value={r.needs_cms} />
          <Row label="SEO" value={r.seo_priority} />
        </dl>
      </Section>

      {/* Budget */}
      <Section title="Budget & calendrier">
        <dl className="divide-y divide-gray-100">
          <Row label="Budget" value={request.budget_range} />
          <Row label="Délai" value={request.deadline} />
          <Row label="Raison du délai" value={r.deadline_reason} />
          <Row label="Maintenance" value={r.maintenance} />
        </dl>
      </Section>

      {/* Closing */}
      <Section title="Concurrence & source">
        <dl className="divide-y divide-gray-100">
          <Row label="Concurrents" value={r.competitors} />
          <Row label="Différenciateurs" value={r.differentiators} />
          <Row label="Source" value={r.how_heard} />
          <Row label="Infos complémentaires" value={r.additional_info} />
        </dl>
      </Section>

      {/* Notes internes */}
      <Section title="Notes internes">
        {editingNotes ? (
          <div className="space-y-3">
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={4}
              className="w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f4c81]/30"
              placeholder="Notes internes sur ce prospect..."
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={saveNotes} disabled={saving} className="flex items-center gap-1 bg-[#0f4c81]">
                <Check className="w-3 h-3" /> Sauvegarder
              </Button>
              <Button size="sm" variant="outline" onClick={() => { setEditingNotes(false); setNotes(request.notes || ''); }}>Annuler</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-gray-600 whitespace-pre-line min-h-12">{request.notes || 'Aucune note pour l\'instant.'}</p>
            <Button size="sm" variant="outline" onClick={() => setEditingNotes(true)} className="flex items-center gap-1 no-print">
              <Edit2 className="w-3 h-3" /> Modifier les notes
            </Button>
          </div>
        )}
      </Section>

      </div>{/* end print-zone */}
    </div>
  );
}

export default withAdminAuth(SiteProjectDetailPage);
