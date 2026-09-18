-- Script consolidé : formations, businesses, les 4 tables chatbot orphelines,
-- et le doublon sur brands. Regroupe drop_formations.sql, rls_policies_batch2.sql,
-- drop_chatbot_tables.sql et le nettoyage brands/job_openings en un seul envoi.
--
-- job_openings est déjà propre (job_openings_admin_write + job_openings_public_select
-- uniquement) — rien à faire dessus.

-- ============================================================
-- 1. formations — retiré (tout est sur TEKKI Classes désormais)
-- ============================================================
-- formation_enrollments.formation_id référence probablement formations.id en FK.
-- Table vide (0 ligne) au moment de l'audit : CASCADE ne supprime aucune donnée,
-- retire juste la contrainte FK si elle existe. formation_enrollments n'est PAS
-- supprimée (garde l'historique des vraies inscriptions passées).
DROP TABLE IF EXISTS public.formations CASCADE;

-- ============================================================
-- 2. businesses — offre business clé en main retirée, admin encore actif dessus
-- ============================================================
DROP POLICY IF EXISTS "anon_read_businesses" ON public.businesses;
DROP POLICY IF EXISTS "businesses_public_select_available" ON public.businesses;
DROP POLICY IF EXISTS "businesses_admin_select_all" ON public.businesses;
DROP POLICY IF EXISTS "businesses_admin_write" ON public.businesses;

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
-- 3. chatbot_config, chatbot_common_questions, chatbot_cache,
--    chat_conversion_funnel — orphelines depuis le retrait complet du widget
--    TekkiChatbot (composant + routes API + pages admin), zéro référence
--    restante dans le code.
-- ============================================================
DROP TABLE IF EXISTS public.chatbot_config CASCADE;
DROP TABLE IF EXISTS public.chatbot_common_questions CASCADE;
DROP TABLE IF EXISTS public.chatbot_cache CASCADE;
DROP TABLE IF EXISTS public.chat_conversion_funnel CASCADE;

-- ============================================================
-- 4. brands — doublon exact de brands_public_select
-- ============================================================
DROP POLICY IF EXISTS "anon_read_brands" ON public.brands;

-- ============================================================
-- Vérification finale
-- ============================================================
-- businesses : doit avoir exactement 3 policies (public_select_available,
-- admin_select_all, admin_write), plus aucune trace de anon_read_businesses.
-- brands : doit avoir exactement 2 policies (brands_admin_write,
-- brands_public_select), plus aucune trace de anon_read_brands.
SELECT tablename, policyname, cmd, roles, qual, with_check
FROM pg_policies
WHERE schemaname = 'public' AND tablename IN ('businesses', 'brands')
ORDER BY tablename, cmd;

-- formations, chatbot_config, chatbot_common_questions, chatbot_cache et
-- chat_conversion_funnel ne doivent plus apparaître ici.
SELECT tablename
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
    'formations', 'chatbot_config', 'chatbot_common_questions',
    'chatbot_cache', 'chat_conversion_funnel'
  );
