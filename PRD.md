# PRD (Product Requirements Document) - FastBrief TEKKI Studio

## 1. Objectif du Produit
Créer une application web single-page (intégrée au projet Next.js existant de TEKKI Studio) agissant comme une Landing Page de qualification sous forme de chat conversationnel, pilotée par l'IA (Anthropic Claude).

## 2. Spécifications UI/UX
- **Mobile-First Absolu** : L'interface doit être conçue pour mobile en priorité, ressemblant à une application de messagerie native et premium (iMessage / WhatsApp épuré).
- **Design System** : Utilisation des couleurs et de la typographie de TEKKI Studio (Tailwind CSS).
- **Structure de la page** :
  - **Header fixe** : Logo centré + sous-titre "Assistant Stratégique" ou "Diagnostic Beauté".
  - **Zone de Chat** : Prend ~80% de l'écran, scrollable, avec les bulles de messages fluides (IA à gauche, Utilisateur à droite).
  - **Zone de Saisie (Input)** : Fixée en bas + bouton d'envoi.
  - **Mention "Easter Egg"** : Texte cliquable très discret sous l'input : *"Propulsé par FastBrief"*, ouvrant vers un lien externe.

## 3. Fonctionnalités Essentielles
- **Onboarding Automatique** : Au chargement, l'IA envoie instantanément le premier message (sans action de l'utilisateur).
- **Indicateur de Frappe** : Animation "... " pendant le temps de réponse de l'API Anthropic.
- **Gestion d'Erreur API** : Message de graceful fallback en cas d'échec API ("Un instant, je rassemble mes notes...").
- **Collecte de Leads** : À la fin du flow, l'historique complet (et les données extraites comme Email/WhatsApp) doit être formaté en JSON et envoyé vers le système de TEKKI Studio (via Webhook, email, ou base de données Supabase existante).

## 4. Comportement de l'IA (System Prompt)
L'agent IA suit un **Flow** strict en 6 étapes, défini par le System Prompt :
1. **Accueil** : Demande du nom de la marque et spécialité.
2. **Traction** : Évaluation du volume de commandes.
3. **La Douleur** : Question sur le temps passé sur WhatsApp/DM.
4. **L'Inception** : Présentation du concept de "Vendeuse IA".
5. **Collecte des leads** : Demande de l'Email et du numéro WhatsApp.
6. **Conclusion** : Remerciements et clôture.

**Règles de l'IA** :
- Une seule question à la fois.
- Pas de gros blocs de texte (conversationnel).
- Vouvoiement, empathie, professionnalisme.
- Pas de promesse de prix exact.
