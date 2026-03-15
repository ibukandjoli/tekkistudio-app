# PRD (Product Requirements Document) - Diagnostic Stratégique TEKKI Studio

## 1. Objectif du Produit
Fournir une interface de qualification conversationnelle pilotée par l'IA pour transformer les visiteurs curieux en leads qualifiés. L'outil doit auditer la maturité e-commerce de n'importe quelle marque africaine et proposer un diagnostic immédiat.

## 2. Spécification de l'Infrastructure
- **Emplacement principal** : `/diagnostic`.
- **Intégration** : Tous les CTAs de la Homepage V2 et des pages Cas Clients pointent vers cette interface.
- **Design High-End** : Mode plein écran, mobile-first, esthétique sombre (`#0a0f16`) pour une immersion totale.

## 3. Fonctionnalités Clés
- **Conversationnel Fluide** : Utilisation de Claude (Anthropic) pour un dialogue naturel.
- **Qualification Multiniveau** : Extraction automatique du nom de marque, secteur, volume de ventes et points de friction.
- **Capture de Leads Sécurisée** : Extraction et normalisation des numéros WhatsApp et emails.
- **Reporting Externe** : Envoi instantané du payload au CRM via Webhook Make.
- **Tracking Meta** : Déclenchement automatique de l'événement `Lead` pour l'optimisation publicitaire.

## 4. Comportement de l'Agent IA
L'IA doit agir comme un consultant senior chez TEKKI Studio :
- **Empathie** : Comprendre les difficultés liées à la gestion manuelle (WhatsApp/Instagram).
- **Expertise** : Expliquer comment une infrastructure automatisée (Shopify + Vendeuse IA) résout ces problèmes.
- **Concision** : Poser une seule question à la fois pour maintenir l'engagement mobile.
- **Professionnalisme** : Vouvoiement et ton encourageant.

## 5. Mesure du Succès
- Taux de complétion du dialogue de diagnostic.
- Qualité des données extraites (JSON valide).
- Nombre de leads qualifiés transmis au CRM.
