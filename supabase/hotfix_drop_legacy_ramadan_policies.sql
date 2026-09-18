-- ramadan_promo_leads portait aussi 2 anciennes policies jamais supprimées,
-- restées invisibles tant que la RLS de la table était désactivée — même
-- schéma que admin_users (hotfix_drop_legacy_admin_users_policies.sql) :
--   - "Admins can do anything" (ALL) teste admin_users.id au lieu de
--     admin_users.user_id : logique d'autorisation différente et incorrecte,
--     à remplacer entièrement par is_admin(auth.uid()).
--   - "Allow anonymous insertions" (INSERT, anon+authenticated, WITH CHECK true) :
--     permettait à n'importe qui muni de la clé anon d'insérer directement dans
--     la table. Plus nécessaire depuis que finalize/route.ts passe par
--     service_role (qui bypass la RLS de toute façon).
--
-- On garde uniquement ramadan_promo_leads_admin_select et _admin_update.

DROP POLICY IF EXISTS "Admins can do anything" ON public.ramadan_promo_leads;
DROP POLICY IF EXISTS "Allow anonymous insertions" ON public.ramadan_promo_leads;

-- Vérification : ne doit plus renvoyer que 2 lignes (select + update),
-- toutes les deux avec is_admin(auth.uid()) dans using_expression.
SELECT
  policyname AS policy_name,
  cmd AS command,
  roles,
  qual AS using_expression,
  with_check AS with_check_expression
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'ramadan_promo_leads';
