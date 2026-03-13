# PROJECT CONTEXT

## Qu'est-ce que TEKKI Studio ?
TEKKI Studio est une agence digitale e-commerce spécialisée dans la création, l'optimisation et la croissance des marques (particulièrement les marques de beauté et cosmétique africaines). 

## La Plateforme Actuelle
La plateforme web actuelle (développée en Next.js App Router) sert de vitrine et d'outil d'acquisition pour l'agence. Elle met en avant :
- Les **services** et l'**expertise** de l'agence.
- Les **cas clients** et les **marques** accompagnées.
- Les **formules** d'accompagnement.
- Un **espace d'administration** et des fonctionnalités métier (ex: e-commerce interne, génération de liens de paiement Stripe, suivi de conversion, chatbot IA).

## Le Nouveau Besoin : FastBrief (Landing Page Conversationnelle)
L'objectif actuel est d'intégrer une expérience de **Page de Qualification Interactive** inspirée de "FastBrief". 
Au lieu d'une landing page statique, l'utilisateur (ciblé via des publicités Meta) arrive sur une interface de chat plein écran, mobile-first, propulsée par l'API d'Anthropic (Claude 4.6) avec option de réponse vocale (Web Speech API).
Le but de ce chatbot est de qualifier le lead de manière conversationnelle en abordant ses "douleurs" (ex: temps passé à gérer le support client sur WhatsApp/Instagram) pour lui proposer une solution sur-mesure incluant une "Vendeuse IA".

## Les Utilisateurs Cibles de cette fonctionnalité
- **Fondatrices de marques de beauté africaines**.
- Utilisatrices majoritairement sur **Mobile** (trafic issu d'Instagram/Facebook Ads).
- Personnes manquant de temps, qui gèrent beaucoup de ventes manuellement via la messagerie instantanée.

## L'Objectif Commercial
Collecter des informations qualifiées (nom de marque, trafic, temps perdu) de manière asynchrone, via extraction IA en arrière-plan formatée en JSON strict (douleur résumée et téléphone normalisé) puis envoyées vers un Webhook CRM externe (Make.com). Les experts TEKKI Studio recontactent alors le prospect avec un pipeline de devis adapté.
