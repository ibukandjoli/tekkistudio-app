-- Table: diagnostic_leads
-- Stocke toutes les conversations du diagnostic IA (beauté + généraliste)
-- À exécuter dans Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.diagnostic_leads (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source                   TEXT NOT NULL DEFAULT 'diagnostic-beaute',
  -- source = 'diagnostic-beaute' (fastbrief) ou 'diagnostic' (généraliste)

  -- Infos extraites par l'IA
  brand_name               TEXT,
  niche                    TEXT,
  contact_email            TEXT,
  contact_whatsapp         TEXT,
  traction_level           TEXT,
  pain_point_hours         TEXT,
  pain_point_summary       TEXT,

  -- Transcript complet (tableau de messages {role, content})
  full_transcript          JSONB,
  session_duration_seconds INTEGER DEFAULT 0,

  -- Gestion interne
  status                   TEXT NOT NULL DEFAULT 'nouveau',
  -- statuts : nouveau | contacté | en_négociation | converti | perdu
  notes                    TEXT,

  created_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at               TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index pour les filtres courants
CREATE INDEX IF NOT EXISTS idx_diagnostic_leads_source     ON public.diagnostic_leads (source);
CREATE INDEX IF NOT EXISTS idx_diagnostic_leads_status     ON public.diagnostic_leads (status);
CREATE INDEX IF NOT EXISTS idx_diagnostic_leads_created_at ON public.diagnostic_leads (created_at DESC);

-- Trigger updated_at
CREATE OR REPLACE FUNCTION public.update_diagnostic_leads_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_diagnostic_leads_updated_at
  BEFORE UPDATE ON public.diagnostic_leads
  FOR EACH ROW
  EXECUTE FUNCTION public.update_diagnostic_leads_updated_at();

-- RLS : lecture/écriture publique pour l'insertion (depuis l'API)
ALTER TABLE public.diagnostic_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "insert_diagnostic_leads"
  ON public.diagnostic_leads FOR INSERT
  WITH CHECK (true);

CREATE POLICY "select_diagnostic_leads"
  ON public.diagnostic_leads FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "update_diagnostic_leads"
  ON public.diagnostic_leads FOR UPDATE
  USING (auth.role() = 'authenticated');
