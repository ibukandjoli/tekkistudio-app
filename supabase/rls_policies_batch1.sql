-- RLS batch 1 — 13 tables sans dépendance bloquante identifiée
-- (ramadan_promo_leads est traitée séparément, voir rls_ramadan_promo_leads.sql,
--  une fois le code des routes basculé vers service_role et testé)
-- À exécuter dans le SQL Editor Supabase.

-- ============================================================
-- 0. Fonction utilitaire — évite la récursion infinie sur admin_users
-- ============================================================
-- LANGUAGE plpgsql (pas sql) : une fonction SQL simple peut être "inlinée" par le
-- planificateur Postgres dans la requête appelante, ce qui annule la frontière
-- SECURITY DEFINER et fait réapparaître la policy de admin_users dans son propre
-- plan de requête -> "infinite recursion detected in policy for relation
-- admin_users" (42P17). plpgsql n'est jamais inliné, donc jamais recréé.
CREATE OR REPLACE FUNCTION public.is_admin(check_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users WHERE user_id = check_user_id
  );
END;
$$;

-- ============================================================
-- 1. admin_users — critique
-- ============================================================
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_users_select_admins_only"
  ON public.admin_users FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "admin_users_insert_admins_only"
  ON public.admin_users FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "admin_users_update_admins_only"
  ON public.admin_users FOR UPDATE
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "admin_users_delete_admins_only"
  ON public.admin_users FOR DELETE
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- ============================================================
-- 2. leads_campagne_beaute — orpheline, verrouillage total
-- (suppression ou conservation à trancher après export/relecture)
-- ============================================================
ALTER TABLE public.leads_campagne_beaute ENABLE ROW LEVEL SECURITY;

CREATE POLICY "leads_campagne_beaute_admin_select"
  ON public.leads_campagne_beaute FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));
-- Aucune policy INSERT/UPDATE/DELETE : deny-all par défaut (rien n'en a besoin).

-- ============================================================
-- 3. ecommerce_leads
-- ============================================================
ALTER TABLE public.ecommerce_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ecommerce_leads_admin_select"
  ON public.ecommerce_leads FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "ecommerce_leads_admin_update"
  ON public.ecommerce_leads FOR UPDATE
  TO authenticated
  USING (public.is_admin(auth.uid()));
-- Pas de policy INSERT anon : la création passe déjà par service_role (api/ecommerce/create-lead).

-- ============================================================
-- 4. job_applications
-- ============================================================
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "job_applications_public_insert"
  ON public.job_applications FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
-- Le formulaire public (careers/spontaneous) insère directement avec la clé anon.

CREATE POLICY "job_applications_admin_select"
  ON public.job_applications FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "job_applications_admin_update"
  ON public.job_applications FOR UPDATE
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- ============================================================
-- 5. chatbot_config
-- ============================================================
ALTER TABLE public.chatbot_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "chatbot_config_public_select"
  ON public.chatbot_config FOR SELECT
  TO anon, authenticated
  USING (true);
-- Lecture publique nécessaire : le widget (ChatService.ts) et la route /api/chatbot en dépendent.

CREATE POLICY "chatbot_config_admin_write"
  ON public.chatbot_config FOR UPDATE
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "chatbot_config_admin_insert"
  ON public.chatbot_config FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin(auth.uid()));

-- ============================================================
-- 6. chat_conversion_funnel
-- ============================================================
ALTER TABLE public.chat_conversion_funnel ENABLE ROW LEVEL SECURITY;

CREATE POLICY "chat_conversion_funnel_public_insert"
  ON public.chat_conversion_funnel FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
-- Tracking anonyme du widget, légitime.

CREATE POLICY "chat_conversion_funnel_admin_select"
  ON public.chat_conversion_funnel FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- ============================================================
-- 7. businesses
-- ============================================================
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "businesses_public_select_available"
  ON public.businesses FOR SELECT
  TO anon, authenticated
  USING (status = 'available');

CREATE POLICY "businesses_admin_select_all"
  ON public.businesses FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "businesses_admin_write"
  ON public.businesses FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- ============================================================
-- 8. brands
-- ============================================================
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;

CREATE POLICY "brands_public_select"
  ON public.brands FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "brands_admin_write"
  ON public.brands FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- ============================================================
-- 9. formations
-- ============================================================
ALTER TABLE public.formations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "formations_public_select"
  ON public.formations FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "formations_admin_write"
  ON public.formations FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- ============================================================
-- 10. job_openings
-- ============================================================
ALTER TABLE public.job_openings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "job_openings_public_select"
  ON public.job_openings FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "job_openings_admin_write"
  ON public.job_openings FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- ============================================================
-- 11. chatbot_common_questions
-- ============================================================
ALTER TABLE public.chatbot_common_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "chatbot_common_questions_public_select"
  ON public.chatbot_common_questions FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "chatbot_common_questions_admin_write"
  ON public.chatbot_common_questions FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- ============================================================
-- 12. chatbot_cache — faible risque, lecture/écriture publiques nécessaires
-- ============================================================
ALTER TABLE public.chatbot_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "chatbot_cache_public_select"
  ON public.chatbot_cache FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "chatbot_cache_public_upsert"
  ON public.chatbot_cache FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "chatbot_cache_public_update"
  ON public.chatbot_cache FOR UPDATE
  TO anon, authenticated
  USING (true);
-- Nécessaire pour l'upsert() utilisé par api/chatbot/route.ts.
