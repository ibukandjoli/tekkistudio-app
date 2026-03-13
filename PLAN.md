# PLAN DE DÉVELOPPEMENT - FastBrief

Ce fichier définit les étapes d'intégration de la nouvelle fonctionnalité de Chat "FastBrief" au sein de la plateforme TEKKI Studio.

## Phase 1 : Initialisation & Structure UI
- [ ] 1. Créer la route `/diagnostic-beaute` (ou `/fastbrief` selon le choix final).
- [ ] 2. Créer un `layout.tsx` propre à cette route pour s'assurer qu'elle agit comme une SPA (Single Page Application) sans la navigation globale de l'agence, avec un `h-screen` strict pour mobile.
- [ ] 3. Créer le Head de la page (Logo + titre "Assistant Stratégique").
- [ ] 4. Mettre en place l'architecture du `ChatContainer` (MessageList, MessageBubble, ChatInput).
- [ ] 5. Intégrer l'Easter Egg "Propulsé par FastBrief" sous le composant Input.

## Phase 2 : Logique d'État & Animations
- [ ] 1. Mettre en place la variable d'état globale des messages (`useState` ou `useReducer` pour gérer `{ role, content }`).
- [ ] 2. Créer l'animation de l'indicateur de frappe (Typing Indicator) "...".
- [ ] 3. Gérer l'auto-scroll du viewport de discussion vers le bas à chaque nouveau message.
- [ ] 4. Mettre en place le message initial "Onboarding" déclenché par un `useEffect` sans action utilisateur.

## Phase 3 : Back-end & Intégration IA
- [ ] 1. Implémenter la Route API `app/api/assistant/route.ts` pour jouer le rôle de proxy vers Anthropic.
- [ ] 2. Configurer le Payload de l'API avec le `system_prompt` défini dans `tekki-fastbrief.md`.
- [ ] 3. Connecter le front-end à cette API (envoi du message, attente du stream/réponse, mise à jour state).
- [ ] 4. Implémenter la gestion d'erreur (Message "Un instant, je rassemble mes notes...").

## Phase 4 : Rétention Complète (Collecte Lead)
- [ ] 1. Mettre en place une logique pour vérifier si la conversation a atteint l'étape 6 (ou repérer l'email et le numéro dans les réponses textuelles).
- [ ] 2. Créer la route d'exportation `/api/assistant/save-lead`.
- [ ] 3. Sauvegarder l'historique de la session (JSON) + Métadonnées de l'utilisateur (Email extraite) dans la base Supabase ou déclenchement du Webhook vers CRM.

## Phase 5 : QA & Finitions
- [ ] 1. Tester la fluidité UI sur écrans mobiles (Safari iOS, Chrome Android).
- [ ] 2. S'assurer de la vitesse de l'API.
- [ ] 3. Vérifier les edge-cases de conversation (si l'utilisateur s'éloigne du sujet).
