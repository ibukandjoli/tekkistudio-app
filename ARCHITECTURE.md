# ARCHITECTURE DU PROJET TEKKI Studio

## Stack Technique Globale
- **Framework** : Next.js 14+ (App Router).
- **Langages** : TypeScript / JavaScript.
- **Styling** : Tailwind CSS, Vanilla CSS (`globals.css`).
- **UI Components** : Lucide React, Framer Motion (animations).
- **Backend** : Supabase.
- **IA** : Anthropic SDK (Claude).
- **Tracking** : Meta Pixel (Lead Events).

## Structure du Dossier `app/`
- **`/ (Root)`** : Emploie les composants de `app/components/home/v2/`.
- **`/diagnostic`** : Interface de diagnostic généraliste (Anciennement `/diagnostic-beaute`).
- **`/cas-clients`** : Showcase des réalisations (Thème sombre).
- **`/admin`** : Dashboard de gestion.
- **`/api`** :
  - `/api/diagnostic-assistant/route.ts` : Streaming chat avec Claude.
  - `/api/diagnostic-assistant/save-lead/route.ts` : Extraction JSON et Webhook Make.

## Nouveaux Composants V2 (`app/components/home/v2/`)
Pour la refonte, une architecture modulaire a été adoptée :
1. **`HeroV2.tsx`** : Entrée fracassante, CTA unique.
2. **`LogosV2.tsx`** : Bandeau infini de réassurance.
3. **`EmpathySection.tsx`** : Identification aux problèmes clients.
4. **`CaseStudiesV2.tsx`** : Galerie de succès.
5. **`TestimonialsV2.tsx`** : Preuve sociale directe.
6. **`SkinInTheGameSection.tsx`** : Focus sur nos marques propres.
7. **`FAQV2.tsx`** : Levée d'objections.
8. **`ArsenalSection.tsx`** : Stack technique et CTA final.

## Flux de Données - Diagnostic
1. L'utilisateur interagit avec le `ChatContainer`.
2. L'API `diagnostic-assistant` gère l'intelligence conversationnelle.
3. En fin de flow, une extraction structurée est réalisée.
4. Les données (WhatsApp normalisé, nom brand, douleur) sont envoyées au Webhook Make.
5. Un événement standard `Lead` est envoyé au Meta Pixel via `window.fbq`.

