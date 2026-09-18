-- Hotfix : is_admin() déclarée en LANGUAGE sql pouvait être "inlinée" par le
-- planificateur Postgres dans la requête appelante, annulant la frontière
-- SECURITY DEFINER. Résultat : la policy SELECT de admin_users se retrouvait
-- à référencer admin_users dans son propre plan de requête ->
-- "infinite recursion detected in policy for relation admin_users" (42P17),
-- constaté en testant la reconnexion à /admin après le batch 1.
--
-- LANGUAGE plpgsql n'est jamais inliné par le planificateur : la frontière
-- SECURITY DEFINER est donc préservée et la récursion disparaît.
-- CREATE OR REPLACE ne casse rien : les policies existantes qui appellent
-- is_admin(auth.uid()) n'ont pas besoin d'être recréées.

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
