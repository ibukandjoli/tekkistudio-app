-- 1. businesses : anon_read_businesses est une ancienne policy zombie (même
-- famille que celles trouvées sur admin_users et ramadan_promo_leads) qui
-- expose toutes les fiches business, y compris non publiées, à n'importe qui.
-- Urgence : on la supprime indépendamment de ce qui sera décidé sur l'avenir
-- de la table (voir état des lieux d'usage séparé).
DROP POLICY IF EXISTS "anon_read_businesses" ON public.businesses;

-- 2. chatbot_common_questions : remplacer la lecture publique non filtrée par
-- une lecture filtrée sur is_active = true.
DROP POLICY IF EXISTS "chatbot_common_questions_public_select" ON public.chatbot_common_questions;

CREATE POLICY "chatbot_common_questions_public_select_active"
  ON public.chatbot_common_questions FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Vérification : businesses ne doit plus avoir anon_read_businesses ;
-- chatbot_common_questions ne doit avoir qu'une lecture publique filtrée
-- (_public_select_active) en plus de la policy d'écriture admin.
SELECT tablename, policyname, cmd, roles, qual, with_check
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('businesses', 'chatbot_common_questions')
ORDER BY tablename, cmd;
