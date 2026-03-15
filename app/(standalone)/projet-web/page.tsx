'use client';

import { useState, createContext, useContext } from 'react';
import { ArrowRight, ArrowLeft, Check, ShoppingCart, Globe, Cpu, Cloud, Sun, Moon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// ─── Theme ───────────────────────────────────────────────────────────────────

type ThemeStyles = {
  bg: string; label: string; hint: string; input: string;
  chipInactive: string; chipActive: string;
  radioInactive: string; radioActive: string;
  radioCircle: string; radioCircleActive: string;
  navBorder: string; header: string; headerStep: string;
  errorBox: string; title: string; desc: string;
};

const LIGHT: ThemeStyles = {
  bg: 'bg-slate-50',
  label: 'text-tekki-blue',
  hint: 'text-gray-400',
  input: 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-tekki-orange focus:ring-1 focus:ring-tekki-orange/20',
  chipInactive: 'bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-800',
  chipActive: 'bg-orange-50 border-tekki-orange text-tekki-orange',
  radioInactive: 'bg-white border-gray-200 text-gray-700 hover:border-gray-300',
  radioActive: 'bg-orange-50 border-tekki-orange text-tekki-orange',
  radioCircle: 'border-gray-300',
  radioCircleActive: 'border-tekki-orange bg-tekki-orange',
  navBorder: 'border-gray-100',
  header: 'bg-white/90 backdrop-blur-md border-gray-200',
  headerStep: 'text-gray-400',
  errorBox: 'bg-red-50 border-red-200 text-red-600',
  title: 'text-tekki-blue',
  desc: 'text-gray-500',
};

const DARK: ThemeStyles = {
  bg: 'bg-tekki-blue',
  label: 'text-white',
  hint: 'text-white/50',
  input: 'bg-white/5 border-white/20 text-white placeholder-white/30 focus:border-tekki-orange/60',
  chipInactive: 'bg-white/5 border-white/20 text-white/70 hover:border-white/40 hover:text-white',
  chipActive: 'bg-tekki-orange/20 border-tekki-orange text-white',
  radioInactive: 'bg-white/5 border-white/20 text-white/70 hover:border-white/40',
  radioActive: 'bg-tekki-orange/20 border-tekki-orange text-white',
  radioCircle: 'border-white/40',
  radioCircleActive: 'border-tekki-orange bg-tekki-orange',
  navBorder: 'border-white/10',
  header: 'bg-tekki-blue/80 backdrop-blur-md border-white/10',
  headerStep: 'text-white/50',
  errorBox: 'bg-red-500/20 border-red-500/40 text-red-300',
  title: 'text-white',
  desc: 'text-white/60',
};

const ThemeCtx = createContext<{ isDark: boolean; t: ThemeStyles }>({ isDark: false, t: LIGHT });
const useTheme = () => useContext(ThemeCtx);

// ─── Types ───────────────────────────────────────────────────────────────────

type ProjectType = 'ecommerce' | 'vitrine' | 'webapp' | 'saas' | '';

interface FormData {
  project_type: ProjectType; email: string; whatsapp: string;
  full_name: string; location: string; company_name: string; legal_status: string; legal_status_other: string;
  description: string;
  product_types: string; catalog_size: string; payment_methods: string[]; delivery_zones: string[]; preferred_cms: string;
  sector: string[]; sector_other: string; target_audience: string[]; geographic_zone: string[]; desired_pages: string[];
  app_type: string[]; target_users: string; key_features: string; integrations: string;
  business_model: string[]; b2b_b2c: string; mvp_or_full: string;
  objectives: string[]; primary_action: string; existing_presence: string; existing_links: string;
  visual_style: string[]; color_preferences: string; reference_sites: string; styles_to_avoid: string;
  has_domain: string; domain_name: string; desired_features: string[]; multilingual: string; needs_cms: string; seo_priority: string;
  budget_range: string; deadline: string; deadline_reason: string; maintenance: string;
  competitors: string; differentiators: string; how_heard: string; additional_info: string;
}

const INITIAL: FormData = {
  project_type: '', email: '', whatsapp: '',
  full_name: '', location: '', company_name: '', legal_status: '', legal_status_other: '',
  description: '', product_types: '', catalog_size: '', payment_methods: [], delivery_zones: [], preferred_cms: '',
  sector: [], sector_other: '', target_audience: [], geographic_zone: [], desired_pages: [],
  app_type: [], target_users: '', key_features: '', integrations: '',
  business_model: [], b2b_b2c: '', mvp_or_full: '',
  objectives: [], primary_action: '', existing_presence: '', existing_links: '',
  visual_style: [], color_preferences: '', reference_sites: '', styles_to_avoid: '',
  has_domain: '', domain_name: '', desired_features: [], multilingual: '', needs_cms: '', seo_priority: '',
  budget_range: '', deadline: '', deadline_reason: '', maintenance: '',
  competitors: '', differentiators: '', how_heard: '', additional_info: '',
};

const TOTAL_STEPS = 8;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  const { t } = useTheme();
  return (
    <button type="button" onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-150 ${active ? t.chipActive : t.chipInactive}`}>
      {label}
    </button>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  const { t } = useTheme();
  return (
    <div className="space-y-2">
      <label className={`block text-sm font-medium ${t.label}`}>{label}</label>
      {children}
      {hint && <p className={`text-xs ${t.hint}`}>{hint}</p>}
    </div>
  );
}

function Radio({ value, current, onChange, children }: {
  value: string; current: string; onChange: (v: string) => void; children: React.ReactNode;
}) {
  const { t } = useTheme();
  const active = current === value;
  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all text-sm ${active ? t.radioActive : t.radioInactive}`}
      onClick={() => onChange(value)}>
      <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${active ? t.radioCircleActive : t.radioCircle}`} />
      {children}
    </div>
  );
}

function NavButtons({ onBack, onNext, onSubmit, step, submitting, canNext = true }: {
  onBack?: () => void; onNext?: () => void; onSubmit?: () => void;
  step: number; submitting?: boolean; canNext?: boolean;
}) {
  const { t } = useTheme();
  const isLast = step === TOTAL_STEPS - 1;
  return (
    <div className={`flex items-center justify-between pt-6 border-t ${t.navBorder}`}>
      <div>{onBack && (
        <button type="button" onClick={onBack} className={`flex items-center gap-2 text-sm transition-colors ${t.desc} hover:opacity-80`}>
          <ArrowLeft className="w-4 h-4" /> Retour
        </button>
      )}</div>
      <div>
        {isLast ? (
          <button type="button" onClick={onSubmit} disabled={submitting || !canNext}
            className="flex items-center gap-2 bg-tekki-orange text-white px-6 py-3 rounded-full font-medium text-sm hover:bg-tekki-orange/90 disabled:opacity-50 transition-all">
            {submitting ? 'Envoi en cours...' : 'Envoyer mon projet'}
            {!submitting && <Check className="w-4 h-4" />}
          </button>
        ) : (
          <button type="button" onClick={onNext} disabled={!canNext}
            className="flex items-center gap-2 bg-tekki-orange text-white px-6 py-3 rounded-full font-medium text-sm hover:bg-tekki-orange/90 disabled:opacity-50 transition-all">
            Continuer <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Steps ───────────────────────────────────────────────────────────────────

function Step0({ d, u, onNext }: { d: FormData; u: (k: string, v: any) => void; onNext: () => void }) {
  const { t } = useTheme();
  const types = [
    { key: 'ecommerce', label: 'Site E-commerce', desc: 'Boutique en ligne, catalogue produits, paiement', icon: <ShoppingCart className="w-6 h-6" /> },
    { key: 'vitrine',   label: 'Site Vitrine',    desc: 'Présentation institutionnelle, génération de leads', icon: <Globe className="w-6 h-6" /> },
    { key: 'webapp',    label: 'Application Web', desc: 'Plateforme, outil métier, marketplace', icon: <Cpu className="w-6 h-6" /> },
    { key: 'saas',      label: 'SaaS',            desc: 'Logiciel en ligne, abonnement, B2B/B2C', icon: <Cloud className="w-6 h-6" /> },
  ];
  const canNext = !!d.project_type && !!d.email.trim() && !!d.whatsapp.trim();
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className={`text-2xl font-bold ${t.title}`}>Quel type de projet souhaitez-vous réaliser ?</h2>
        <p className={`text-sm ${t.desc}`}>Sélectionnez le type qui correspond le mieux à votre besoin.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {types.map(tp => (
          <button key={tp.key} type="button" onClick={() => u('project_type', tp.key)}
            className={`flex items-start gap-4 p-4 rounded-2xl border text-left transition-all ${
              d.project_type === tp.key ? t.chipActive : t.chipInactive
            }`}>
            <div className={`p-2 rounded-xl flex-shrink-0 ${d.project_type === tp.key ? 'bg-tekki-orange/20 text-tekki-orange' : 'bg-gray-100 text-gray-500'}`}>
              {tp.icon}
            </div>
            <div>
              <p className={`font-semibold text-sm ${t.label}`}>{tp.label}</p>
              <p className={`text-xs mt-0.5 ${t.desc}`}>{tp.desc}</p>
            </div>
          </button>
        ))}
      </div>
      <div className="space-y-4 pt-2">
        <p className={`text-sm font-medium ${t.label}`}>Vos coordonnées pour vous recontacter :</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Adresse e-mail *">
            <input type="email" value={d.email} onChange={e => u('email', e.target.value)}
              placeholder="vous@exemple.com" className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all ${t.input}`} />
          </Field>
          <Field label="Numéro WhatsApp *" hint="Format international recommandé : +221 77 000 00 00">
            <input type="tel" value={d.whatsapp} onChange={e => u('whatsapp', e.target.value)}
              placeholder="+221 77 000 00 00" className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all ${t.input}`} />
          </Field>
        </div>
      </div>
      <NavButtons step={0} onNext={onNext} canNext={canNext} />
    </div>
  );
}

function Step1({ d, u, onNext, onBack }: { d: FormData; u: (k: string, v: any) => void; onNext: () => void; onBack: () => void }) {
  const { t } = useTheme();
  const statuts = ['SARL / SARLU', 'SA', 'Association / ONG', 'Fondation', 'Auto-entrepreneur', 'Pas encore créée', 'Autre'];
  const inputCls = `w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all ${t.input}`;
  return (
    <div className="space-y-6">
      <div>
        <h2 className={`text-2xl font-bold ${t.title}`}>Informations de contact</h2>
        <p className={`text-sm ${t.desc}`}>Pour savoir à qui nous nous adressons.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Votre nom complet *">
          <input value={d.full_name} onChange={e => u('full_name', e.target.value)} placeholder="Prénom Nom" className={inputCls} />
        </Field>
        <Field label="Pays / Ville *">
          <input value={d.location} onChange={e => u('location', e.target.value)} placeholder="ex. Dakar, Sénégal" className={inputCls} />
        </Field>
      </div>
      <Field label="Nom de votre structure ou projet">
        <input value={d.company_name} onChange={e => u('company_name', e.target.value)} placeholder="Nom légal ou commercial" className={inputCls} />
      </Field>
      <Field label="Statut juridique">
        <div className="flex flex-wrap gap-2">
          {statuts.map(s => (
            <Chip key={s} label={s} active={d.legal_status === s} onClick={() => u('legal_status', d.legal_status === s ? '' : s)} />
          ))}
        </div>
        {d.legal_status === 'Autre' && (
          <input value={d.legal_status_other} onChange={e => u('legal_status_other', e.target.value)}
            placeholder="Précisez..." className={`${inputCls} mt-2`} />
        )}
      </Field>
      <NavButtons step={1} onBack={onBack} onNext={onNext} canNext={!!d.full_name.trim() && !!d.location.trim()} />
    </div>
  );
}

function Step2Ecommerce({ d, u, tog, onNext, onBack }: any) {
  const { t } = useTheme();
  const inputCls = `w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all ${t.input}`;
  const payments = ['Mobile Money (Wave)', 'Orange Money', 'Carte bancaire', 'Virement', 'Paiement à la livraison', 'PayPal'];
  const delivery = ['Locale (une ville)', 'Nationale', 'Afrique de l\'Ouest', 'Internationale'];
  const cms = ['Shopify', 'WooCommerce (WordPress)', 'PrestaShop', 'Sur mesure', 'Je ne sais pas encore'];
  return (
    <div className="space-y-6">
      <div>
        <h2 className={`text-2xl font-bold ${t.title}`}>Votre projet e-commerce</h2>
        <p className={`text-sm ${t.desc}`}>Dites-nous en plus sur votre activité et vos besoins.</p>
      </div>
      <Field label="Décrivez votre activité *" hint="Que vendez-vous ? Qui sont vos clients ?">
        <textarea value={d.description} onChange={(e: any) => u('description', e.target.value)} rows={3}
          placeholder="Ex. Je vends des vêtements de mode africaine à destination des 25-40 ans en Afrique de l'Ouest..." className={inputCls} />
      </Field>
      <Field label="Types de produits">
        <input value={d.product_types} onChange={(e: any) => u('product_types', e.target.value)}
          placeholder="Ex. Vêtements, bijoux, cosmétiques, électronique..." className={inputCls} />
      </Field>
      <Field label="Volume catalogue estimé">
        <div className="flex flex-wrap gap-2">
          {['Moins de 50', '50 – 200', '200 – 500', 'Plus de 500', 'Je ne sais pas encore'].map(v => (
            <Chip key={v} label={v} active={d.catalog_size === v} onClick={() => u('catalog_size', d.catalog_size === v ? '' : v)} />
          ))}
        </div>
      </Field>
      <Field label="Modes de paiement souhaités">
        <div className="flex flex-wrap gap-2">
          {payments.map(p => <Chip key={p} label={p} active={d.payment_methods.includes(p)} onClick={() => tog('payment_methods', p)} />)}
        </div>
      </Field>
      <Field label="Zones de livraison">
        <div className="flex flex-wrap gap-2">
          {delivery.map(z => <Chip key={z} label={z} active={d.delivery_zones.includes(z)} onClick={() => tog('delivery_zones', z)} />)}
        </div>
      </Field>
      <Field label="Plateforme préférée">
        <div className="flex flex-wrap gap-2">
          {cms.map(c => <Chip key={c} label={c} active={d.preferred_cms === c} onClick={() => u('preferred_cms', d.preferred_cms === c ? '' : c)} />)}
        </div>
      </Field>
      <NavButtons step={2} onBack={onBack} onNext={onNext} canNext={!!d.description.trim()} />
    </div>
  );
}

function Step2Vitrine({ d, u, tog, onNext, onBack }: any) {
  const { t } = useTheme();
  const inputCls = `w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all ${t.input}`;
  const sectors = ['Technologie / Numérique', 'Conseil / Formation', 'Santé / Bien-être', 'Éducation', 'Finance / Investissement', 'Commerce / Distribution', 'Agriculture / Agroalimentaire', 'BTP / Immobilier', 'Culture / Médias', 'Développement / ONG', 'Autre'];
  const targets = ['Particuliers', 'Entreprises (B2B)', 'Institutions publiques', 'ONG / Associations', 'Jeunes / Étudiants', 'Diaspora', 'International'];
  const zones = ['Locale (une ville)', 'Nationale', 'Régionale (Afrique de l\'Ouest)', 'Internationale'];
  const pages = ['Accueil', 'À propos', 'Services / Activités', 'Équipe', 'Actualités / Blog', 'Partenaires', 'Galerie / Réalisations', 'Ressources', 'FAQ', 'Contact'];
  return (
    <div className="space-y-6">
      <div>
        <h2 className={`text-2xl font-bold ${t.title}`}>Votre structure & votre site</h2>
        <p className={`text-sm ${t.desc}`}>Aidez-nous à comprendre votre organisation et vos besoins.</p>
      </div>
      <Field label="Décrivez votre structure *" hint="Sa mission, sa raison d'être, ce qui la rend unique.">
        <textarea value={d.description} onChange={(e: any) => u('description', e.target.value)} rows={3}
          placeholder="Ex. Nous sommes une ONG qui accompagne les jeunes entrepreneurs de la sous-région..." className={inputCls} />
      </Field>
      <Field label="Secteur(s) d'activité">
        <div className="flex flex-wrap gap-2">
          {sectors.map(s => <Chip key={s} label={s} active={d.sector.includes(s)} onClick={() => tog('sector', s)} />)}
        </div>
        {d.sector.includes('Autre') && (
          <input value={d.sector_other} onChange={(e: any) => u('sector_other', e.target.value)} placeholder="Précisez..." className={`${inputCls} mt-2`} />
        )}
      </Field>
      <Field label="Clients / Bénéficiaires cibles">
        <div className="flex flex-wrap gap-2">
          {targets.map(ta => <Chip key={ta} label={ta} active={d.target_audience.includes(ta)} onClick={() => tog('target_audience', ta)} />)}
        </div>
      </Field>
      <Field label="Zone géographique d'intervention">
        <div className="flex flex-wrap gap-2">
          {zones.map(z => <Chip key={z} label={z} active={d.geographic_zone.includes(z)} onClick={() => tog('geographic_zone', z)} />)}
        </div>
      </Field>
      <Field label="Pages souhaitées sur le site">
        <div className="flex flex-wrap gap-2">
          {pages.map(p => <Chip key={p} label={p} active={d.desired_pages.includes(p)} onClick={() => tog('desired_pages', p)} />)}
        </div>
      </Field>
      <NavButtons step={2} onBack={onBack} onNext={onNext} canNext={!!d.description.trim()} />
    </div>
  );
}

function Step2Webapp({ d, u, tog, onNext, onBack }: any) {
  const { t } = useTheme();
  const inputCls = `w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all ${t.input}`;
  const types = ['Marketplace / Place de marché', 'Outil interne / Back-office', 'Plateforme communautaire', 'Réseau social / Forum', 'Tableau de bord / Dashboard', 'Application de réservation', 'Autre'];
  return (
    <div className="space-y-6">
      <div>
        <h2 className={`text-2xl font-bold ${t.title}`}>Votre application web</h2>
        <p className={`text-sm ${t.desc}`}>Décrivez votre projet et ses fonctionnalités clés.</p>
      </div>
      <Field label="Décrivez votre application *" hint="Que fait-elle ? Quel problème résout-elle ?">
        <textarea value={d.description} onChange={(e: any) => u('description', e.target.value)} rows={3}
          placeholder="Ex. Une plateforme qui met en relation des freelances africains avec des entreprises..." className={inputCls} />
      </Field>
      <Field label="Type d'application">
        <div className="flex flex-wrap gap-2">
          {types.map(tp => <Chip key={tp} label={tp} active={d.app_type.includes(tp)} onClick={() => tog('app_type', tp)} />)}
        </div>
      </Field>
      <Field label="Utilisateurs cibles">
        <input value={d.target_users} onChange={(e: any) => u('target_users', e.target.value)}
          placeholder="Ex. PME africaines, freelances, étudiants..." className={inputCls} />
      </Field>
      <Field label="Fonctionnalités clés" hint="Listez les 3-5 fonctions essentielles de l'application.">
        <textarea value={d.key_features} onChange={(e: any) => u('key_features', e.target.value)} rows={3}
          placeholder="Ex. Inscription, profil, messagerie, paiement, tableau de bord..." className={inputCls} />
      </Field>
      <Field label="Intégrations requises" hint="API, outils tiers, systèmes existants à connecter.">
        <input value={d.integrations} onChange={(e: any) => u('integrations', e.target.value)}
          placeholder="Ex. Mobile Money, Google Maps, système RH existant..." className={inputCls} />
      </Field>
      <NavButtons step={2} onBack={onBack} onNext={onNext} canNext={!!d.description.trim()} />
    </div>
  );
}

function Step2Saas({ d, u, tog, onNext, onBack }: any) {
  const { t } = useTheme();
  const inputCls = `w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all ${t.input}`;
  const models = ['Freemium (gratuit + premium)', 'Abonnement mensuel / annuel', 'Facturation à l\'usage', 'Licence unique', 'Autre'];
  return (
    <div className="space-y-6">
      <div>
        <h2 className={`text-2xl font-bold ${t.title}`}>Votre produit SaaS</h2>
        <p className={`text-sm ${t.desc}`}>Décrivez votre logiciel et son modèle économique.</p>
      </div>
      <Field label="Décrivez votre produit *" hint="Que fait-il ? Quel problème résout-il ?">
        <textarea value={d.description} onChange={(e: any) => u('description', e.target.value)} rows={3}
          placeholder="Ex. Un logiciel de gestion des stocks pour les PME de distribution en Afrique..." className={inputCls} />
      </Field>
      <Field label="Modèle économique">
        <div className="flex flex-wrap gap-2">
          {models.map(m => <Chip key={m} label={m} active={d.business_model.includes(m)} onClick={() => tog('business_model', m)} />)}
        </div>
      </Field>
      <Field label="Cible principale">
        <div className="flex flex-wrap gap-2">
          {['B2B (Entreprises)', 'B2C (Particuliers)', 'Les deux'].map(v => (
            <Chip key={v} label={v} active={d.b2b_b2c === v} onClick={() => u('b2b_b2c', d.b2b_b2c === v ? '' : v)} />
          ))}
        </div>
      </Field>
      <Field label="Fonctionnalités principales" hint="Les modules essentiels du produit.">
        <textarea value={d.key_features} onChange={(e: any) => u('key_features', e.target.value)} rows={3}
          placeholder="Ex. Gestion des stocks, facturation, rapports, multi-utilisateurs..." className={inputCls} />
      </Field>
      <Field label="Stade du projet">
        <div className="flex flex-wrap gap-2">
          {['MVP (version minimale)', 'Produit complet', 'Refonte d\'un outil existant', 'Je ne sais pas encore'].map(v => (
            <Chip key={v} label={v} active={d.mvp_or_full === v} onClick={() => u('mvp_or_full', d.mvp_or_full === v ? '' : v)} />
          ))}
        </div>
      </Field>
      <NavButtons step={2} onBack={onBack} onNext={onNext} canNext={!!d.description.trim()} />
    </div>
  );
}

function Step3({ d, u, tog, onNext, onBack }: any) {
  const { t } = useTheme();
  const inputCls = `w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all ${t.input}`;
  const isApp = d.project_type === 'webapp' || d.project_type === 'saas';

  const objectives = isApp
    ? ['Automatiser un processus métier', 'Connecter plusieurs types d\'acteurs', 'Centraliser et gérer des données', 'Digitaliser des opérations terrain', 'Créer un espace client / portail', 'Remplacer ou moderniser un outil existant', 'Monétiser un service en ligne', 'Gérer des équipes et des accès']
    : ['Présenter notre structure', 'Générer des contacts / leads', 'Attirer des partenaires', 'Asseoir la crédibilité', 'Vendre en ligne', 'Publier des actualités', 'Référencement SEO', 'Recrutement'];

  const actions = isApp
    ? ['S\'inscrire / créer un compte', 'Demander une démo', 'Souscrire un abonnement', 'Inviter des collaborateurs', 'Soumettre une demande', 'Utiliser une fonctionnalité clé']
    : ['Nous contacter', 'Demander un devis', 'Acheter un produit', 'S\'inscrire à une newsletter', 'Prendre rendez-vous', 'Télécharger un document', 'Faire un don'];

  const presences = ['Non, projet from scratch', 'Oui, un outil / processus à remplacer', 'Oui, une version existante à refondre', 'Oui, des outils à centraliser'];

  return (
    <div className="space-y-6">
      <div>
        <h2 className={`text-2xl font-bold ${t.title}`}>Objectifs du projet</h2>
        <p className={`text-sm ${t.desc}`}>Qu'attendez-vous de votre futur {isApp ? 'application' : 'site'} ?</p>
      </div>
      <Field label="Objectifs prioritaires">
        <div className="flex flex-wrap gap-2">
          {objectives.map(o => <Chip key={o} label={o} active={d.objectives.includes(o)} onClick={() => tog('objectives', o)} />)}
        </div>
      </Field>
      <Field label={isApp ? 'Action principale attendue de vos utilisateurs' : 'Action visiteur prioritaire'} hint={isApp ? 'Quelle est la première action d\'un nouvel utilisateur ?' : 'Que doit faire en premier un visiteur sur votre site ?'}>
        <div className="flex flex-col gap-2">
          {actions.map(a => <Radio key={a} value={a} current={d.primary_action} onChange={v => u('primary_action', v)}>{a}</Radio>)}
        </div>
      </Field>
      <Field label={isApp ? 'Existant à remplacer ou améliorer ?' : 'Présence en ligne actuelle'}>
        <div className="flex flex-col gap-2">
          {(isApp ? presences : ['Non, création from scratch', 'Oui, un site à refondre', 'Oui, des réseaux sociaux actifs']).map(p => (
            <Radio key={p} value={p} current={d.existing_presence} onChange={v => u('existing_presence', v)}>{p}</Radio>
          ))}
        </div>
      </Field>
      {d.existing_presence && d.existing_presence !== 'Non, projet from scratch' && d.existing_presence !== 'Non, création from scratch' && (
        <Field label={isApp ? 'Lien ou description de l\'outil existant' : 'Lien(s) vers votre présence actuelle'}>
          <input value={d.existing_links} onChange={(e: any) => u('existing_links', e.target.value)}
            placeholder={isApp ? 'URL ou description de l\'outil actuel...' : 'https://...'} className={inputCls} />
        </Field>
      )}
      <NavButtons step={3} onBack={onBack} onNext={onNext} canNext={true} />
    </div>
  );
}

function Step4({ d, u, tog, onNext, onBack }: any) {
  const { t } = useTheme();
  const inputCls = `w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all ${t.input}`;
  const styles = ['Professionnel / Corporate', 'Moderne / Tech', 'Chaud / Humain', 'Minimaliste / Épuré', 'Dynamique / Créatif', 'Institutionnel / Sérieux', 'Africain / Ancré localement', 'Luxe / Premium'];
  return (
    <div className="space-y-6">
      <div>
        <h2 className={`text-2xl font-bold ${t.title}`}>Design & identité visuelle</h2>
        <p className={`text-sm ${t.desc}`}>L'image que vous souhaitez projeter.</p>
      </div>
      <Field label="Ambiance visuelle souhaitée">
        <div className="flex flex-wrap gap-2">
          {styles.map(s => <Chip key={s} label={s} active={d.visual_style.includes(s)} onClick={() => tog('visual_style', s)} />)}
        </div>
      </Field>
      <Field label="Préférences de couleurs" hint="Codes HEX, noms de couleurs, ou palette existante.">
        <input value={d.color_preferences} onChange={(e: any) => u('color_preferences', e.target.value)}
          placeholder="Ex. Bleu nuit et or, palette neutre, couleurs de ma charte..." className={inputCls} />
      </Field>
      <Field label="Sites de référence" hint="2-3 sites que vous aimez et ce qui vous plaît en eux.">
        <textarea value={d.reference_sites} onChange={(e: any) => u('reference_sites', e.target.value)} rows={3}
          placeholder="Site 1 : URL — Ce qui me plaît : ...&#10;Site 2 : URL — Ce qui me plaît : ..." className={inputCls} />
      </Field>
      <Field label="Styles à éviter" hint="Couleurs, mises en page, tons que vous ne voulez pas.">
        <textarea value={d.styles_to_avoid} onChange={(e: any) => u('styles_to_avoid', e.target.value)} rows={2}
          placeholder="Décrivez ce que vous voulez absolument éviter..." className={inputCls} />
      </Field>
      <NavButtons step={4} onBack={onBack} onNext={onNext} canNext={true} />
    </div>
  );
}

function Step5({ d, u, tog, onNext, onBack }: any) {
  const { t } = useTheme();
  const inputCls = `w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all ${t.input}`;
  const isApp = d.project_type === 'webapp' || d.project_type === 'saas';

  const features = isApp
    ? ['Gestion des utilisateurs et des rôles', 'Tableau de bord / Analytics', 'Notifications (email / SMS / push)', 'Paiement en ligne', 'API / intégration d\'outils tiers', 'Messagerie interne', 'Gestion des commandes / tâches', 'Export / import de données', 'Accès multi-tenant', 'Application mobile compagnon']
    : ['Formulaire de contact', 'Prise de rendez-vous', 'Newsletter', 'Intégration réseaux sociaux', 'Espace membres', 'Galerie photos / vidéos', 'Téléchargement de documents', 'Carte / Google Maps', 'Chatbot', 'Paiement en ligne', 'Statistiques de visite'];

  return (
    <div className="space-y-6">
      <div>
        <h2 className={`text-2xl font-bold ${t.title}`}>Aspects techniques</h2>
        <p className={`text-sm ${t.desc}`}>{isApp ? 'Fonctionnalités, contraintes et environnement technique.' : 'Fonctionnalités, domaine et contraintes.'}</p>
      </div>
      <Field label="Avez-vous un nom de domaine ?">
        <div className="flex flex-col gap-2">
          {['Oui', 'Non, j\'ai besoin d\'aide pour en choisir un', 'Non, pas encore'].map(v => (
            <Radio key={v} value={v} current={d.has_domain} onChange={val => u('has_domain', val)}>{v}</Radio>
          ))}
        </div>
      </Field>
      {d.has_domain === 'Oui' && (
        <Field label="Votre nom de domaine">
          <input value={d.domain_name} onChange={(e: any) => u('domain_name', e.target.value)}
            placeholder="Ex. maplateforme.com" className={inputCls} />
        </Field>
      )}
      <Field label={isApp ? 'Fonctionnalités techniques souhaitées' : 'Fonctionnalités souhaitées'}>
        <div className="flex flex-wrap gap-2">
          {features.map(f => <Chip key={f} label={f} active={d.desired_features.includes(f)} onClick={() => tog('desired_features', f)} />)}
        </div>
      </Field>
      <Field label={isApp ? 'Application multilingue ?' : 'Site multilingue ?'}>
        <div className="flex flex-wrap gap-2">
          {['Français uniquement', 'Français + Anglais', 'Autre combinaison'].map(v => (
            <Chip key={v} label={v} active={d.multilingual === v} onClick={() => u('multilingual', d.multilingual === v ? '' : v)} />
          ))}
        </div>
      </Field>
      {isApp ? (
        <Field label="Souhaitez-vous pouvoir gérer les données vous-même ?" hint="Via un back-office ou tableau d'administration.">
          <div className="flex flex-col gap-2">
            {['Oui, avec un back-office complet', 'Oui, pour les opérations courantes', 'Non, TEKKI Studio s\'en charge'].map(v => (
              <Radio key={v} value={v} current={d.needs_cms} onChange={val => u('needs_cms', val)}>{v}</Radio>
            ))}
          </div>
        </Field>
      ) : (
        <>
          <Field label="Souhaitez-vous gérer le contenu vous-même (CMS) ?">
            <div className="flex flex-col gap-2">
              {['Oui, de manière autonome', 'Oui, avec une formation incluse', 'Non, TEKKI Studio s\'en charge'].map(v => (
                <Radio key={v} value={v} current={d.needs_cms} onChange={val => u('needs_cms', val)}>{v}</Radio>
              ))}
            </div>
          </Field>
          <Field label="SEO (référencement naturel) — priorité ?">
            <div className="flex flex-wrap gap-2">
              {['Oui, prioritaire', 'Oui, pas urgent', 'Je ne sais pas', 'Non'].map(v => (
                <Chip key={v} label={v} active={d.seo_priority === v} onClick={() => u('seo_priority', d.seo_priority === v ? '' : v)} />
              ))}
            </div>
          </Field>
        </>
      )}
      <NavButtons step={5} onBack={onBack} onNext={onNext} canNext={true} />
    </div>
  );
}

function Step6({ d, u, onNext, onBack }: any) {
  const { t } = useTheme();
  const inputCls = `w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all ${t.input}`;
  const budgets = ['Moins de 500 000 FCFA', '500 000 – 1 000 000 FCFA', '1 000 000 – 2 000 000 FCFA', 'Plus de 2 000 000 FCFA', 'À définir selon devis'];
  const deadlines = ['Dans 2 à 4 semaines (urgent)', 'Dans 1 à 2 mois', 'Dans 2 à 3 mois', 'Pas de délai précis'];
  const maintenances = ['Oui, contrat mensuel', 'Ponctuellement, au besoin', 'Non', 'À discuter'];
  return (
    <div className="space-y-6">
      <div>
        <h2 className={`text-2xl font-bold ${t.title}`}>Budget & calendrier</h2>
        <p className={`text-sm ${t.desc}`}>Vos contraintes financières et de délais.</p>
      </div>
      <Field label="Enveloppe budgétaire">
        <div className="flex flex-col gap-2">
          {budgets.map(v => <Radio key={v} value={v} current={d.budget_range} onChange={val => u('budget_range', val)}>{v}</Radio>)}
        </div>
      </Field>
      <Field label="Délai souhaité pour la mise en ligne">
        <div className="flex flex-col gap-2">
          {deadlines.map(v => <Radio key={v} value={v} current={d.deadline} onChange={val => u('deadline', val)}>{v}</Radio>)}
        </div>
      </Field>
      <Field label="Y a-t-il un événement ou une date butoir ?" hint="Optionnel">
        <input value={d.deadline_reason} onChange={(e: any) => u('deadline_reason', e.target.value)}
          placeholder="Ex. Lancement officiel prévu en juin, forum d'entreprises..." className={inputCls} />
      </Field>
      <Field label="Maintenance après la mise en ligne ?">
        <div className="flex flex-wrap gap-2">
          {maintenances.map(v => <Chip key={v} label={v} active={d.maintenance === v} onClick={() => u('maintenance', d.maintenance === v ? '' : v)} />)}
        </div>
      </Field>
      <NavButtons step={6} onBack={onBack} onNext={onNext} canNext={true} />
    </div>
  );
}

function Step7({ d, u, tog, onBack, onSubmit, submitting }: any) {
  const { t } = useTheme();
  const inputCls = `w-full border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all ${t.input}`;
  const sources = ['Recommandation / Bouche à oreille', 'Réseaux sociaux', 'Google / Recherche web', 'Événement / Conférence', 'Site de TEKKI Studio', 'Autre'];
  return (
    <div className="space-y-6">
      <div>
        <h2 className={`text-2xl font-bold ${t.title}`}>Pour finir…</h2>
        <p className={`text-sm ${t.desc}`}>Quelques informations pour affiner notre proposition.</p>
      </div>
      <Field label="Concurrents que vous connaissez" hint="Noms et URLs si disponibles.">
        <textarea value={d.competitors} onChange={(e: any) => u('competitors', e.target.value)} rows={2}
          placeholder="Concurrent 1 : ... — Site : ..." className={inputCls} />
      </Field>
      <Field label="Ce qui vous différencie" hint="Votre valeur ajoutée unique.">
        <textarea value={d.differentiators} onChange={(e: any) => u('differentiators', e.target.value)} rows={2}
          placeholder="Votre approche unique, expertise particulière..." className={inputCls} />
      </Field>
      <Field label="Comment avez-vous entendu parler de TEKKI Studio ?">
        <div className="flex flex-wrap gap-2">
          {sources.map(s => <Chip key={s} label={s} active={d.how_heard === s} onClick={() => u('how_heard', d.how_heard === s ? '' : s)} />)}
        </div>
      </Field>
      <Field label="Informations complémentaires" hint="Tout ce que vous souhaitez ajouter.">
        <textarea value={d.additional_info} onChange={(e: any) => u('additional_info', e.target.value)} rows={3}
          placeholder="Contraintes spécifiques, questions, précisions..." className={inputCls} />
      </Field>
      <NavButtons step={7} onBack={onBack} onSubmit={onSubmit} submitting={submitting} canNext={true} />
    </div>
  );
}

function SuccessScreen() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md space-y-6">
        <div className="w-20 h-20 rounded-full bg-orange-50 border-2 border-tekki-orange flex items-center justify-center mx-auto">
          <Check className="w-10 h-10 text-tekki-orange" />
        </div>
        <h1 className="text-3xl font-bold text-tekki-blue">Dossier transmis ✅</h1>
        <p className="text-gray-500">
          Merci ! Notre équipe a bien reçu votre demande et vous recontactera sous <strong className="text-tekki-blue">48h ouvrées</strong> sur WhatsApp ou par e-mail.
        </p>
        <Link href="/" className="inline-flex items-center gap-2 bg-tekki-orange text-white px-6 py-3 rounded-full font-medium text-sm hover:bg-tekki-orange/90 transition-all">
          Retour à l'accueil <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function ProjetWebPage() {
  const [isDark, setIsDark] = useState(false);
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormData>(INITIAL);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const t = isDark ? DARK : LIGHT;

  const u = (key: string, value: any) => setData(prev => ({ ...prev, [key]: value }));
  const tog = (key: string, value: string) => {
    setData(prev => {
      const arr: string[] = (prev as any)[key] || [];
      return { ...prev, [key]: arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value] };
    });
  };

  const next = () => { setError(''); setStep(s => s + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const back = () => { setError(''); setStep(s => s - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const submit = async () => {
    setSubmitting(true);
    setError('');
    try {
      const { full_name, email, whatsapp, project_type, company_name, budget_range, deadline, ...rest } = data;
      const res = await fetch('/api/site-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name, email, whatsapp, project_type, company_name, budget_range, deadline, responses: rest }),
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || 'Erreur');
      }
      setSubmitted(true);
    } catch (e: any) {
      setError(e.message || 'Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) return <SuccessScreen />;

  const progress = (step / (TOTAL_STEPS - 1)) * 100;
  const stepProps = { d: data, u, tog, onNext: next, onBack: back };

  return (
    <ThemeCtx.Provider value={{ isDark, t }}>
      <div className={`min-h-screen transition-colors duration-300 ${t.bg}`}>
        {/* Header */}
        <header className={`fixed top-0 left-0 right-0 z-10 border-b ${t.header}`}>
          <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/">
              <Image
                src={isDark ? '/images/tekkistudio/logo_white.svg' : '/images/tekkistudio/logo_blue.svg'}
                alt="TEKKI Studio" width={120} height={30} className="object-contain"
              />
            </Link>
            <div className="flex items-center gap-3">
              <span className={`text-xs ${t.headerStep}`}>Étape {step + 1} / {TOTAL_STEPS}</span>
              <button
                onClick={() => setIsDark(d => !d)}
                className={`p-2 rounded-full border transition-all ${isDark ? 'border-white/20 text-white/70 hover:bg-white/10' : 'border-gray-200 text-gray-500 hover:bg-gray-100'}`}
                title={isDark ? 'Passer au thème clair' : 'Passer au thème sombre'}
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div className={`h-0.5 ${isDark ? 'bg-white/10' : 'bg-gray-100'}`}>
            <div className="h-full bg-tekki-orange transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
          </div>
        </header>

        {/* Content */}
        <main className="pt-24 pb-16 px-4">
          <div className="max-w-2xl mx-auto">
            {error && (
              <div className={`mb-4 px-4 py-3 rounded-xl border text-sm ${t.errorBox}`}>{error}</div>
            )}
            {step === 0 && <Step0 d={data} u={u} onNext={next} />}
            {step === 1 && <Step1 {...stepProps} />}
            {step === 2 && data.project_type === 'ecommerce' && <Step2Ecommerce {...stepProps} />}
            {step === 2 && data.project_type === 'vitrine'   && <Step2Vitrine {...stepProps} />}
            {step === 2 && data.project_type === 'webapp'    && <Step2Webapp {...stepProps} />}
            {step === 2 && data.project_type === 'saas'      && <Step2Saas {...stepProps} />}
            {step === 3 && <Step3 {...stepProps} />}
            {step === 4 && <Step4 {...stepProps} />}
            {step === 5 && <Step5 {...stepProps} />}
            {step === 6 && <Step6 {...stepProps} />}
            {step === 7 && <Step7 {...stepProps} onSubmit={submit} submitting={submitting} />}
          </div>
        </main>
      </div>
    </ThemeCtx.Provider>
  );
}
