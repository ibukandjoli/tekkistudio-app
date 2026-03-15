# TEKKI Studio - La Fabrique de Marques Africaines

TEKKI Studio est une plateforme Next.js d'acquisition et de gestion pour une agence e-commerce spécialisée dans les marques africaines ambitieuses.

## 🚀 Vision Actuelle (V2)

Le projet a pivoté vers un tunnel de conversion ultra-simplifié :
- **Homepage V2** : Une structure en 4 sections majeures (Hero, Empathy, Skin in the Game, Arsenal) complétée par une forte preuve sociale (Logos, Cas Études, Témoignages, FAQ).
- **Focalisation Diagnostic** : Tous les chemins d'acquisition mènent vers l'Agent IA de qualification situé sur `/diagnostic`.
- **Dark Premium Aesthetic** : Une identité visuelle unifiée (`#0a0f16`) pour asseoir l'autorité et le professionnalisme.

## 🛠 Stack Technique

- **Framework** : Next.js 14+ (App Router)
- **Styling** : Tailwind CSS + Vanilla CSS (globals)
- **Animations** : Framer Motion
- **IA** : Anthropic Claude API (Qualification de leads)
- **Backend** : Supabase (Auth/DB)
- **Tracking** : Meta Pixel (Conversion Leads)

## 📂 Organisation du Code

- `app/(marketing)/` : Pages vitrines et cas clients (thème sombre).
- `app/(chat)/diagnostic/` : Interface du chatbot de qualification généraliste.
- `app/components/home/v2/` : Nouveaux composants de la homepage pivotée.
- `app/api/diagnostic-assistant/` : Logique IA et extraction de leads vers Webhook Make.

## 🏁 Démarrage Rapide

1. **Installation** :
```bash
npm install
```

2. **Environnement** :
Configurez votre `.env.local` avec les clés Anthropic et Supabase.

3. **Lancement** :
```bash
npm run dev
```

## 📝 Documentation Interne

Pour plus de détails, consultez :
- `PROJECT_CONTEXT.md` : Vision et objectifs.
- `ARCHITECTURE.md` : Structure technique détaillée.
- `PRD.md` : Spécifications du produit de diagnostic.
- `bot-diagnostic-general.md` : Instructions et prompt système de l'IA.

