-- Batch 2 — verrouillage businesses (offre business clé en main retirée, admin
-- encore actif dessus) + lecture filtrée de chatbot_common_questions.
-- Toutes les policies sont recréées via DROP IF EXISTS + CREATE pour garantir un
-- état final connu, indépendamment de ce qui a pu être appliqué partiellement
-- auparavant (plusieurs tables de ce batch ont déjà montré des policies zombies
-- inattendues lors de cet audit).

-- ============================================================
-- businesses
-- ============================================================
DROP POLICY IF EXISTS "anon_read_businesses" ON public.businesses;
DROP POLICY IF EXISTS "businesses_public_select_available" ON public.businesses;
DROP POLICY IF EXISTS "businesses_admin_select_all" ON public.businesses;
DROP POLICY IF EXISTS "businesses_admin_write" ON public.businesses;

CREATE POLICY "businesses_public_select_available"
  ON public.businesses FOR SELECT
  TO anon, authenticated
  USING (status = 'available');
-- Lecture publique limitée à ce qui reste nécessaire (le widget chatbot y accède
-- encore, en attendant la décision sur son retrait complet).

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
-- chatbot_common_questions
-- ============================================================
DROP POLICY IF EXISTS "chatbot_common_questions_public_select" ON public.chatbot_common_questions;
DROP POLICY IF EXISTS "chatbot_common_questions_public_select_active" ON public.chatbot_common_questions;
DROP POLICY IF EXISTS "chatbot_common_questions_admin_write" ON public.chatbot_common_questions;

CREATE POLICY "chatbot_common_questions_public_select_active"
  ON public.chatbot_common_questions FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "chatbot_common_questions_admin_write"
  ON public.chatbot_common_questions FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- Vérification finale
SELECT tablename, policyname, cmd, roles, qual, with_check
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('businesses', 'chatbot_common_questions')
ORDER BY tablename, cmd;
