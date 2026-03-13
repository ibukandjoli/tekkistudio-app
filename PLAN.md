# PLAN DE DÉVELOPPEMENT - FastBrief

Ce fichier définit les étapes d'intégration de la nouvelle fonctionnalité de Chat "FastBrief" au sein de la plateforme TEKKI Studio.

## Phase 1 : Initialisation & Structure UI
- [x] 1. Créer la route `/diagnostic-beaute` (ou `/fastbrief` selon le choix final).
- [x] 2. Créer un `layout.tsx` propre à cette route pour s'assurer qu'elle agit comme une SPA (Single Page Application) sans la navigation globale de l'agence, avec un `h-screen` strict pour mobile.
- [x] 3. Créer le Head de la page (Logo + titre "Assistant Stratégique").
- [x] 4. Mettre en place l'architecture du `ChatContainer` (MessageList, MessageBubble, ChatInput avec bouton Micro Voice Speech API).
- [x] 5. Intégrer l'Easter Egg "Propulsé par FastBrief" sous le composant Input (redirection `fastbrief.site`).

## Phase 2 : Logique d'État & Animations
- [x] 1. Mettre en place la variable d'état globale des messages (`useState` ou `useReducer` pour gérer `{ role, content }`).
- [x] 2. Créer l'animation de l'indicateur de frappe (Typing Indicator) "...".
- [x] 3. Gérer l'auto-scroll du viewport de discussion vers le bas à chaque nouveau message.
- [x] 4. Mettre en place le message initial "Onboarding" déclenché par un `useEffect` sans action utilisateur.

## Phase 3 : Back-end & Intégration IA
- [x] 1. Implémenter la Route API `app/api/assistant/route.ts` pour jouer le rôle de proxy vers Anthropic (Claude 4.6).
- [x] 2. Configurer le Payload de l'API avec le `system_prompt` défini dans `tekki-fastbrief.md`.
- [x] 3. Connecter le front-end à cette API (envoi du message texte ou vocal, attente du stream/réponse, mise à jour state).
- [x] 4. Implémenter la gestion d'erreur (Message "Un instant, je rassemble mes notes...").

## Phase 4 : Rétention Complète (Collecte Lead)
- [x] 1. Mettre en place une logique pour vérifier si la conversation a atteint l'étape 6 (détection de mots-clés).
- [x] 2. Créer la route d'exportation `/api/assistant/save-lead`.
- [x] 3. Sauvegarder l'historique de la session, envoyer une requête LLM asynchrone pour extraire (JSON propre) les variables (Email, WhatsApp formaté inter, durée, résumé douleur).
- [x] 4. Déclenchement automatique du requêtage POST asynchrone vers le Webhook Make et gel de l'UI (`disabled`) avec "Dossier transmis en toute sécurité ✅".

## Phase 5 : QA & Finitions
- [x] 1. Tester la fluidité UI sur écrans mobiles (Safari iOS, Chrome Android).
- [x] 2. S'assurer de la vitesse de l'API avec le dernier modèle.
- [x] 3. Vérifier la gestion gracieuse des payloads via Post/Fetch.
