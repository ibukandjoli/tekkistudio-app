-- Migration: diagnostic_leads — ajout des champs offer_intent + nouvelles étapes du flow
-- Regroupe deux migrations en attente :
--   1. offer_intent (déjà envoyé au webhook Make depuis quelques jours, jamais ajouté à la table)
--   2. Les champs des nouvelles étapes du prompt /diagnostic (localisation, cible, canal de
--      vente détaillé, mode de paiement, CA, audit réseaux sociaux)
-- À exécuter dans le SQL Editor Supabase.

-- offer_intent = 'diagnostic' | 'sprint' | 'fabrique' (offre cliquée sur la homepage)
-- existing_site_platform = Shopify | TEKKIShop | autre prestataire | outil IA (Lovable, etc.) | vide si pas de site
-- social_content_gaps = analyse IA : absence de CTA clair, fréquence trop faible,
--   absence de collab UGC, etc. — déduit de viral_content_description + posting_frequency

ALTER TABLE public.diagnostic_leads
  ADD COLUMN IF NOT EXISTS offer_intent             TEXT,
  ADD COLUMN IF NOT EXISTS location                 TEXT,
  ADD COLUMN IF NOT EXISTS target_customer           TEXT,
  ADD COLUMN IF NOT EXISTS sales_channel             TEXT,
  ADD COLUMN IF NOT EXISTS existing_site_platform    TEXT,
  ADD COLUMN IF NOT EXISTS payment_method            TEXT,
  ADD COLUMN IF NOT EXISTS monthly_revenue_range     TEXT,
  ADD COLUMN IF NOT EXISTS social_followers_count    TEXT,
  ADD COLUMN IF NOT EXISTS posting_frequency         TEXT,
  ADD COLUMN IF NOT EXISTS viral_content_description TEXT,
  ADD COLUMN IF NOT EXISTS social_content_gaps       TEXT;

-- Index utile si vous filtrez un jour les leads par offre visée dans l'admin
CREATE INDEX IF NOT EXISTS idx_diagnostic_leads_offer_intent ON public.diagnostic_leads (offer_intent);
