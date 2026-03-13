# ARCHITECTURE DU PROJET TEKKI Studio

## Stack Technique Globale
- **Framework** : Next.js 14+ (App Router).
- **Langage** : TypeScript.
- **Styling** : Tailwind CSS, `globals.css` pour les variables CSS.
- **UI Components** : Radix UI, Lucide React (icônes), Framer Motion (animations).
- **State Management** : React Context, Zustand (si applicable pour états globaux), ou React Hooks natifs.
- **Base de données & Auth** : Supabase (`@supabase/auth-helpers-nextjs`, `@supabase/supabase-js`).
- **Paiements** : Stripe SDK.
- **Médias** : Cloudinary.
- **IA** : `@anthropic-ai/sdk` (Claude 4.6), Web Speech API (pour la reconnaissance vocale native et gratuite).

## Structure du Dossier `app/`
Le répertoire principal `app/` est structuré par routes et domaines fonctionnels :
- **`/ (Root)`** : Landing page principale agence (Hero, Realisations, etc.).
- **Pages Publiques** : `/services`, `/expertise`, `/formations`, `/cas-clients`, `/equipe`, `/nos-formules`, `/marques`, `/cgv`, `/mentions-legales`.
- **Acquisition** : `/acquisition-options`, `/comparatif-acquisition`, `/ramadan-promo`.
- **Espace Administratif** : `/admin` (Protégé par `withAdminAuth`).
- **Composants Partagés** : `/components/` (Home, UI commune, Forms, etc.).
- **Logique Globale** : `/lib/` (clients API pour Supabase, Cloudinary, utils), `/hooks/`, `/contexts/`.
- **Routage API (`/api`)** :
  - `/api/ecommerce`, `/api/transactions`, `/api/create-payment-link` (liens Stripe).
  - `/api/assistant` et `/api/assistant/save-lead` (Logique IA FastBrief, extraction LLM et Webhook).
  - `/api/track-conversion`.

## Intégration de la fonctionnalité "FastBrief"
Pour l'application "FastBrief", la nouvelle architecture impliquera :
1. **Route Frontend** : Une page dédiée (ex: `/fastbrief` ou `/diagnostic-beaute`) avec un `layout.tsx` spécifique (pour omettre le header/footer de l'agence principale et forcer l'affichage plein écran mobile).
2. **Route API** : Une Edge Function ou route `app/api/fastbrief/route.ts` pour communiquer de manière sécurisée avec l'API Anthropic (sans exposer la clé client-side).
3. **Persistance/Webhook** : Enregistrement et structuration du lead via un appel LLM (`/api/assistant/save-lead`), nettoyage des numéros WhatsApp, et envoi vers un Webhook externe (ex: Make/Integromat) avec verrouillage de l'UI.
