-- ramadan_promo_leads — à exécuter APRÈS déploiement du code qui bascule
-- finalize/route.ts et ramadan-leads/route.ts vers un client service_role.
-- Testé en local le 2026-09-17 : insertion réelle (chemin pay_now), lecture par id,
-- mise à jour de statut et nettoyage de la ligne de test confirmés fonctionnels
-- avec le client service_role, sans toucher la clé anon.

ALTER TABLE public.ramadan_promo_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ramadan_promo_leads_admin_select"
  ON public.ramadan_promo_leads FOR SELECT
  TO authenticated
  USING (public.is_admin(auth.uid()));

CREATE POLICY "ramadan_promo_leads_admin_update"
  ON public.ramadan_promo_leads FOR UPDATE
  TO authenticated
  USING (public.is_admin(auth.uid()));
-- Pas de policy INSERT anon : la création passe désormais par service_role
-- (app/api/ramadan-promo/finalize/route.ts).
