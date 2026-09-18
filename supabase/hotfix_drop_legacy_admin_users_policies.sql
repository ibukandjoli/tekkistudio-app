-- Hotfix 2 : admin_users portait 5 anciennes policies jamais supprimées d'un
-- essai précédent, restées invisibles tant que la RLS de la table était
-- désactivée (badge "Unrestricted"). Dès que ENABLE ROW LEVEL SECURITY a été
-- exécuté (hotfix 1), les 9 policies (5 anciennes + 4 nouvelles) sont devenues
-- actives simultanément :
--   - les 4 anciennes en self-reference direct (sans fonction SECURITY DEFINER)
--     causaient la récursion infinie (42P17), même après correction de is_admin().
--   - la 5e, "Permettre toutes les opérations aux admins" (ALL, USING (true),
--     rôle public), donnait un accès total lecture/écriture/suppression à
--     n'importe qui — probablement la cause de la lecture anonyme constatée
--     dès le tout premier audit, indépendamment du hotfix 1.
--
-- On supprime les 5 anciennes, on garde uniquement les 4 policies créées dans
-- rls_policies_batch1.sql (admin_users_select_admins_only, _insert_admins_only,
-- _update_admins_only, _delete_admins_only).

DROP POLICY IF EXISTS "Insertion restreinte aux super_admins" ON public.admin_users;
DROP POLICY IF EXISTS "Lecture restreinte aux admins" ON public.admin_users;
DROP POLICY IF EXISTS "Modification restreinte aux super_admins" ON public.admin_users;
DROP POLICY IF EXISTS "Permettre toutes les opérations aux admins" ON public.admin_users;
DROP POLICY IF EXISTS "Suppression restreinte aux super_admins" ON public.admin_users;

-- Vérification : ne doit plus renvoyer que 4 lignes, toutes avec is_admin(auth.uid())
-- dans using_expression.
SELECT
  policyname AS policy_name,
  cmd AS command,
  roles,
  qual AS using_expression,
  with_check AS with_check_expression
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'admin_users';
