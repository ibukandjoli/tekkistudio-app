# TEKKI Studio — Refonte Homepage
## Instructions complètes pour Claude Code

---

## Contexte du projet

TEKKI Studio est une "Fabrique de Marques Africaines" spécialisée dans l'accompagnement e-commerce. Son positionnement différenciant : avant d'accompagner des clients, TEKKI a créé et développé ses propres marques (VIENS ON S'CONNAÎT, AMANI), ce qui lui confère une crédibilité terrain que les agences classiques n'ont pas.

**Audience cible :** Fondateurs et fondatrices de marques africaines (mode, beauté, lifestyle, food), principalement au Sénégal et en Afrique de l'Ouest. Niveau de maturité digitale variable. Habitudes mobiles fortes. Sensibles aux preuves concrètes plus qu'aux discours théoriques.

**Objectif de la page :** Convertir un visiteur en prospect qualifié via un CTA unique : "Faire le diagnostic de ma marque" (formulaire ou outil de diagnostic).

**Ce qu'il faut éviter absolument :**
- Le thème dark actuel → passer à un thème clair, épuré, premium
- Le jargon technique ou marketing abstrait ("infrastructure", "machine de vente", "Data Flywheel", "moteur de croissance") → le remplacer par un langage concret, ancré dans le quotidien du fondateur africain
- Les grilles de prix publiques → les supprimer de la homepage
- La longueur excessive → maximum 7 sections

---

## Instruction Design — À lire en priorité

**Avant d'écrire la moindre ligne de code, Claude Code doit activer le skill frontend-design et s'y référer tout au long de l'implémentation.**

### Direction artistique à adopter

**Thème :** Clair, épuré, premium — dans la veine de grandes maisons éditoriales ou de marques de mode africaines contemporaines. Penser Vogue Africa, Amara Beauty, ou les sites de marques lifestyle haut de gamme du continent. Élégant sans être froid. Chaleureux sans être surchargé.

**Ce que ce site doit ressentir :** Confiance immédiate. Expertise terrain. Chaleur africaine sublimée. Professionnel mais humain.

**Palette de couleurs :**
- Fond dominant : blanc cassé ou crème très clair (`#FAFAF8` ou `#FAF8F5`) — jamais blanc pur
- Couleur principale de la marque : orange TEKKI (`#FF5C00` ou équivalent actuel, à récupérer depuis le code existant)
- Accent secondaire : un bleu nuit profond (`#0D1B2A`) pour les titres et éléments de poids
- Couleur de surface : gris très clair (`#F4F3F0`) pour les cards et sections alternées
- Interdiction formelle : aucun fond noir, aucun fond gris foncé, aucun thème sombre

**Typographie :**
- Titre display : une fonte serif élégante ou une sans-serif expressive à fort caractère (ex. Fraunces, Playfair Display, Cabinet Grotesk, Clash Display, ou autre choix distinctif — **jamais Inter, Roboto, ou Space Grotesk**)
- Corps de texte : une sans-serif lisible et moderne, bien spacée
- La typographie doit transmettre à la fois l'ambition et l'ancrage africain

**Mise en page :**
- Espaces généreux entre les sections (padding vertical : min 80px desktop, 60px mobile)
- Asymétrie maîtrisée sur certaines sections (texte à gauche + visuel débordant à droite, ou inversé)
- Grille à 12 colonnes, max-width 1200px, margins latérales confortables
- Les photos de marques (produits, modèles africaines) doivent respirer — ne pas les compresser

**Animations :**
- Révélation au scroll (fade-in + légère translation vers le haut) sur les sections principales
- Hover subtil sur les cards de réalisations (légère élévation ou zoom doux)
- Aucune animation tape-à-l'œil ou gimmick — épuré et intentionnel uniquement

**Responsivité :**
- Mobile-first dans l'implémentation
- Sur mobile : typographie réduite mais maintenant la hiérarchie, sections en colonne unique, images pleine largeur, CTA sticky en bas d'écran
- Sur tablet : grille 2 colonnes pour les cards
- Tester chaque section à 375px, 768px, et 1280px minimum

---

## Architecture de la page — 7 sections uniquement

---

### SECTION 1 — Hero (Accroche)

**Objectif :** Capter en 3 secondes. Qualifier immédiatement le visiteur. Déclencher le clic vers le diagnostic.

**Layout :** Centré ou légèrement asymétrique. Grande typographie. Une image de fond subtile (grain ou texture légère) ou une photo lifestyle d'une fondatrice africaine avec ses produits, en arrière-plan atténué ou sur la moitié droite.

**Copywriting :**

> Eyebrow (petit texte au-dessus du titre) :
> "La Fabrique de Marques Africaines"

> Titre principal (grande taille, impact maximal) :
> "Vos produits méritent mieux qu'un compte Instagram."

> Sous-titre (1-2 phrases max, concrètes) :
> "On vous aide à construire une vraie boutique en ligne, à vendre même quand vous dormez, et à arrêter de gérer vos commandes à la main sur WhatsApp."

> CTA principal (bouton orange, taille généreuse) :
> "Faire le diagnostic de ma marque →"

> Réassurance sous le bouton (petite ligne discrète) :
> "Gratuit · Sans engagement · Résultat en 24h"

**Notes techniques :**
- Le CTA pointe vers la page ou le formulaire de diagnostic existant
- Pas de CTA secondaire dans le hero — un seul point de sortie
- Inclure un badge ou un élément visuel "Shopify Partners" si présent dans le code actuel

---

### SECTION 2 — Bande de logos clients (Social Proof rapide)

**Objectif :** Ancrer la crédibilité immédiatement après le hero, sans ralentir le parcours.

**Layout :** Bande horizontale, fond légèrement différent (`#F4F3F0`), logos en niveaux de gris ou en couleur selon ce qui rend le mieux. Défilement automatique (scroll infini animé) si plus de 6 logos.

**Texte au-dessus :**
> "Elles nous ont fait confiance"

**Logos à inclure :** Récupérer tous les logos clients existants dans le code actuel (Amani, Abarings, Momo Le Bottier, BC No Filter, Ahovi Cosmetics, Viens On S'Connaît, etc.)

---

### SECTION 3 — "On connaît vos galères" (Pain Points)

**Objectif :** Créer une reconnaissance immédiate chez le fondateur. Lui montrer qu'on parle de sa réalité, pas de théorie.

**Layout :** Titre centré fort, puis 3 cards horizontales (desktop) ou empilées (mobile). Fond blanc ou crème. Cards avec bordure subtile ou légère ombre douce.

**Titre de section :**
> "On connaît vos galères."

**Sous-titre :**
> "Après avoir accompagné plus de 10 marques africaines, voilà ce qu'on entend le plus souvent."

**Les 3 cards — copywriting à utiliser :**

Card 1 — icône correspondante
> Titre : "WhatsApp n'est pas une boutique"
> Texte : "Vous répondez manuellement à chaque client, vous perdez des commandes parce que vous étiez occupé, et vous ne pouvez pas dormir tranquille. Vos ventes dépendent de vous seul."

Card 2 — icône correspondante
> Titre : "Votre site ne vend pas"
> Texte : "Vous avez un site, mais les visiteurs repartent sans acheter. Personne ne vous a expliqué pourquoi, ni comment y remédier."

Card 3 — icône correspondante
> Titre : "La visibilité ne paie pas les factures"
> Texte : "Vos posts ont des likes, vos stories ont des vues — mais les ventes ne suivent pas. Vous dépensez de l'énergie sans voir les résultats."

**Ligne de conclusion sous les 3 cards :**
> "Ces problèmes ont des solutions concrètes. C'est exactement pour ça qu'on existe."

---

### SECTION 4 — Réalisations (Preuve terrain)

**Objectif :** Montrer du concret. Des vraies marques africaines transformées. Des visuels qui font envie.

**Layout :** Titre à gauche, grille de 6 photos (3x2 desktop, 2x3 tablet, 1x6 mobile). Chaque card avec overlay au hover affichant le nom de la marque, la catégorie, et un indicateur de résultat (1 chiffre clé).

**Titre de section :**
> "Les marques qu'on a aidées à décoller."

**Sous-titre :**
> "Des vraies boutiques, de vraies ventes, de vraies fondatrices."

**Compteurs clés** (en ligne sous le titre, avant la grille) :
> "+10 marques accompagnées · +8 000 produits vendus · 3 marchés couverts"

**Réalisations à afficher** (récupérer les visuels existants) :
1. Momo Le Bottier — Maroquinerie
2. Abarings — Bijouterie
3. BC No Filter — Cosmétiques
4. Ahovi Cosmetics — Beauté
5. Amani — Santé & Bien-être
6. Viens On S'Connaît — Jeux & Divertissement

**CTA sous la grille :**
> Bouton outline (pas rempli) : "Voir toutes nos réalisations →"

---

### SECTION 5 — Différenciateur (Le Labo)

**Objectif :** Expliquer l'avantage TEKKI en termes simples et concrets. C'est la section la plus différenciante — elle doit être mémorable.

**Layout :** 2 colonnes desktop (texte gauche + 2 photos superposées/empilées droite). Mobile : colonne unique, photos avant ou après le texte. Fond légèrement coloré (`#FFF8F5` — très léger teinté orange) pour distinguer visuellement cette section.

**Eyebrow :**
> "Notre différence"

**Titre :**
> "On ne vous conseille pas depuis un bureau."

**Texte :**
> "Avant d'accompagner votre marque, on a lancé les nôtres. Viens On S'Connaît, Amani — ce sont nos propres créations, qu'on gère encore aujourd'hui. On connaît la réalité des stocks à gérer, des clients difficiles, des pics de commande à Noël, et des paiements Wave qui bloquent."
>
> "Chaque stratégie qu'on vous recommande, on l'a d'abord testée avec notre propre argent. C'est pour ça que ça marche."

**2 stats visuelles sous le texte :**
> "100% — testé sur nos propres marques"
> "+5 — marques créées en interne"

**Photos à utiliser :** Les photos lifestyle existantes de VIENS ON S'CONNAÎT et AMANI (produits + modèles)

---

### SECTION 6 — Ce qu'on fait concrètement (Services)

**Objectif :** Décrire les services en langage accessible, sans jargon. Remplacer "infrastructure" et "écosystème" par ce que ça veut dire en pratique.

**Layout :** Titre centré, puis 3 blocs en accordéon ou 3 cards verticales larges avec icône, titre et description. Fond blanc.

**Titre de section :**
> "Ce qu'on construit pour vous."

**Sous-titre :**
> "Pas de pack standard. On part de votre situation et on construit ce dont vous avez besoin."

**Les 3 services — copywriting :**

Service 1 — icône boutique
> Titre : "Une boutique qui vend vraiment"
> Texte : "On crée ou refond votre boutique en ligne sur Shopify, optimisée pour que vos visiteurs passent à l'achat. Mobile ultra-rapide, paiements locaux intégrés (Wave, Orange Money, cartes bancaires), et une expérience pensée pour vos clients africains."

Service 2 — icône robot/chat
> Titre : "Une assistante de vente qui ne dort jamais"
> Texte : "On configure une IA sur WhatsApp qui répond à vos clients, présente vos produits et enregistre les commandes — même à 2h du matin. Vous vous réveillez avec des ventes passées pendant la nuit."
> Badge orange : "Exclusif TEKKI"

Service 3 — icône croissance
> Titre : "Une stratégie pour attirer les bons clients"
> Texte : "On met en place vos publicités sur Meta et TikTok, vos emails automatiques, et votre tunnel de vente. Pas pour avoir des likes — pour convertir des inconnus en acheteurs réguliers."

---

### SECTION 7 — CTA Final

**Objectif :** Convertir les visiteurs qui ont scrollé jusqu'en bas. Dernier point de contact.

**Layout :** Section pleine largeur, fond orange TEKKI (`#FF5C00`), texte blanc. Design épuré et percutant. Une seule action possible.

**Titre (grande typographie, blanc) :**
> "Prêt à vendre plus, sans travailler plus ?"

**Sous-titre :**
> "On commence par un diagnostic gratuit de votre marque. 30 minutes pour identifier ce qui bloque vos ventes et ce qu'on peut faire pour vous."

**CTA (bouton blanc, texte orange) :**
> "Faire le diagnostic gratuitement →"

**Réassurance sous le bouton (texte blanc semi-transparent) :**
> "Sans engagement · Réponse sous 24h · 100% personnalisé"

---

### FOOTER

**Layout :** Fond bleu nuit (`#0D1B2A`), texte blanc. 3-4 colonnes desktop, empilé mobile.

**Colonne 1 :** Logo TEKKI Studio + tagline courte
> "La Fabrique de Marques Africaines."
> Icônes réseaux sociaux (Instagram, Facebook, LinkedIn, TikTok si présent)
> Badge Shopify Partners

**Colonne 2 :** Nos offres
> Liens vers les pages de formules (Audit, Démarrage, Croissance, Expansion)

**Colonne 3 :** À découvrir
> Nos marques (liens vers VIENS ON S'CONNAÎT et AMANI)
> Cas clients
> Blog / Labo si existant

**Colonne 4 :** Contact
> Email, téléphone, WhatsApp, adresse Dakar
> Bouton "Faire le diagnostic" (orange)

**Bas du footer :**
> "© 2026 TEKKI Studio. Tous droits réservés."
> Liens : Mentions légales · Politique de confidentialité · CGV

---

## Navbar

**Design :** Fond blanc, légère ombre au scroll. Logo à gauche. Navigation au centre. CTA à droite.

**Liens de navigation :**
> Le Labo TEKKI · Nos Offres · Cas Clients · À Propos

**CTA navbar (bouton orange, toujours visible) :**
> "Faire le diagnostic →"

**Mobile :** Menu hamburger. Drawer latéral ou menu déroulant. CTA "Faire le diagnostic" en bas du drawer, pleine largeur.

**Comportement au scroll :** La navbar devient sticky avec une ombre subtile dès que le visiteur scroll de plus de 50px.

---

## Sections à supprimer définitivement

Les sections suivantes ne doivent **pas** apparaître sur la homepage :

- La grille de tarifs/formules (Audit 245K, Démarrage 500K, Croissance 900K, Expansion 1,5M) → à déplacer sur une page dédiée `/nos-offres`
- La section méthode "3 piliers" → trop abstraite, à intégrer dans la page À Propos si besoin
- La section "Pourquoi choisir TEKKI Studio" avec les 6 arguments génériques → remplacée par la section Différenciateur (Section 5)
- La FAQ → à déplacer en bas de la page `/nos-offres` ou sur une page dédiée
- Les témoignages (si présents) → à intégrer dans les cards de réalisations (Section 4) sous forme de citation courte

---

## Corrections copywriting globales — Dictionnaire de traduction

Remplacer systématiquement dans tout le site :

| ❌ Terme à supprimer | ✅ Remplacement concret |
|---|---|
| "Infrastructure" | "système qui tourne tout seul" ou "boutique qui vend pour vous" |
| "Machine de vente" | "boutique qui vend même quand vous dormez" |
| "Data Flywheel" | (à supprimer) |
| "Écosystème TEKKI" | "ce qu'on met en place pour vous" |
| "Standardiser votre acquisition" | "attirer des clients régulièrement, sans se battre" |
| "Plafond de verre" | "le prochain palier" |
| "Scaler" | "vendre à plus grande échelle" ou "faire grandir votre marque" |
| "Moteur de croissance" | "ce qui fait grossir vos ventes" |
| "Tunnel de conversion" | "le chemin qui mène un inconnu à acheter" |
| "Mobile Money" (seul) | "Wave, Orange Money, carte bancaire" |
| "Fondatrices ambitieuses" | "fondateurs et fondatrices qui veulent aller plus loin" |
| "Casser votre plafond de verre" | "passer au niveau supérieur" |
| "Nous ne travaillons qu'avec..." | (trop élitiste) → "On sélectionne les marques..." |
| "Audit IA gratuit" | "diagnostic gratuit de ma marque" |

**Règle d'or pour tout le copywriting :** Si une fondatrice à Dakar ou Abidjan qui vend des sacs ou des cosmétiques ne comprend pas immédiatement ce que ça veut dire, reformuler. Tester chaque phrase avec la question : "Est-ce que ma cliente idéale parlerait comme ça ?"

---

## Checklist de validation avant livraison

### Design
- [ ] Aucun fond noir ou gris foncé visible sur la homepage
- [ ] La palette orange / crème / bleu nuit est cohérente sur toutes les sections
- [ ] Les photos de marques (AMANI, VOSC, Abarings...) s'affichent en haute qualité
- [ ] Chaque section a un espacement vertical généreux (min 80px desktop)
- [ ] Les cards et boutons ont des coins arrondis cohérents
- [ ] Aucune police générique (Inter, Roboto, Arial) — fonte display distinctive obligatoire

### Responsive
- [ ] Homepage testée à 375px (iPhone SE) : lisible, aucun élément coupé
- [ ] Homepage testée à 768px (iPad) : grille 2 colonnes fonctionnelle
- [ ] Homepage testée à 1280px (desktop standard) : mise en page aérée
- [ ] Images bien redimensionnées sans déformation sur mobile
- [ ] CTA "Faire le diagnostic" visible sans scroll sur mobile (sticky ou dans la navbar)

### Copywriting
- [ ] Aucun terme du dictionnaire "à supprimer" ne subsiste
- [ ] Le hero est compréhensible en 5 secondes par un non-initié
- [ ] Les 3 pain points (Section 3) résonnent avec la réalité du fondateur africain
- [ ] La section différenciateur (Section 5) mentionne explicitement VIENS ON S'CONNAÎT et AMANI
- [ ] Un seul CTA dominant sur toute la page : "Faire le diagnostic de ma marque"

### Performance
- [ ] Les images sont optimisées (format WebP si possible, lazy loading activé)
- [ ] Aucune animation ne bloque le rendu initial
- [ ] Le score Lighthouse Performance est > 80 sur mobile

---

## Notes finales pour Claude Code

1. **Récupérer tous les assets existants** (logos clients, photos produits, favicon, logo TEKKI) depuis le code actuel avant de les remplacer. Ne pas utiliser de placeholders dans la version finale.

2. **Le CTA "Faire le diagnostic"** doit pointer vers l'URL ou le composant de diagnostic existant dans le projet — identifier ce lien dans le code avant d'implémenter.

3. **Conserver la stack technique actuelle** (Next.js, Tailwind ou autre) — ne pas changer le framework, uniquement les composants visuels et le contenu.

4. **Ne pas modifier les pages internes** (pages de formules, cas clients, à propos) dans cette passe — uniquement la homepage (`/` ou `page.tsx` racine).

5. **Tester le rendu en local** avant de livrer, en particulier la section réalisations avec les vraies photos.
