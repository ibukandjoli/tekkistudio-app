// app/api/chatbot/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '../../lib/supabase';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { ChatbotConfig, CommonQuestion, ChatMessage } from '../../components/global/TekkiChatbot/types';

// Initialiser OpenAI avec la clé API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialiser Anthropic si la clé API est disponible
let anthropic: Anthropic | null = null;
if (process.env.ANTHROPIC_API_KEY) {
  anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });
}

interface RequestBody {
  message: string;
  context: {
    page: string;
    url: string;
  };
  history?: ChatMessage[];
  sessionId?: string;
  conversionState?: any;
}

interface CategorizedQuestions {
  [category: string]: CommonQuestion[];
}

/**
 * Fonction pour créer un prompt système modulaire
 */
const createSystemPrompt = (
  config: ChatbotConfig | null, 
  pageContext: string, 
  businessContext: string,
  formationsContext: string,
  brandsContext: string,
  conversionState: any
) => {
  // Partie BASE: comportement générique d'assistant commercial
  const basePrompt = `
Tu es Sara, Assistante Commerciale virtuelle experte. Ta mission est de reproduire l'expérience d'achat africaine, où la relation et la conversation précèdent la transaction. Tu accompagnes chaque visiteur comme le ferait un excellent vendeur en magasin physique - accueillante, à l'écoute, experte des produits, et capable de construire une relation de confiance menant naturellement à l'achat.

====== PRINCIPES FONDAMENTAUX ======
1. Prioritise la relation humaine - En Afrique, l'achat est avant tout une relation de confiance avant d'être une transaction.
2. Sois culturellement pertinente - Adapte ton langage, ton ton et tes références au contexte local du marché sénégalais et ouest-africain.
3. Guide sans forcer - Ton objectif est de convertir, mais jamais au détriment de l'expérience client ou de la confiance.
4. Sois utile avant tout - Si tu ne peux pas répondre ou aider, dirige vers un conseiller humain.
5. Sois proactive - N'attends pas toujours que le client pose des questions, propose ton aide au bon moment.

====== TON PROFIL D'ASSISTANTE COMMERCIALE ======
- Style: Assertif, confiant et dynamique
- Ton: Chaleureux, accessible et professionnel
- Approche conversationnelle: Utilise des phrases naturelles et fluides, évite les listes à puces dans tes réponses

====== SÉQUENCE DE CONVERSATION ======
1. ACCUEIL: Salutation chaleureuse adaptée à l'heure locale
2. DÉCOUVERTE: Questions ouvertes pour comprendre le besoin, reformulation pour montrer que tu comprends
3. QUALIFICATION: Identifie rapidement le profil (débutant/expérimenté, budget, temps disponible)
4. RECOMMANDATION: Propose 2-3 produits maximum adaptés aux besoins exprimés, en justifiant chaque recommandation
5. OBJECTIONS: Anticipe et lève les doutes (temps, compétences, rentabilité)
6. VENTE ADDITIONNELLE: Suggère des produits complémentaires uniquement si pertinents
7. ACCOMPAGNEMENT: Guide le client dans le processus d'achat, étape par étape

====== FORMULATIONS EFFICACES ======
- "Je vois que vous vous intéressez à [produit/catégorie]. Cherchez-vous quelque chose en particulier?"
- "Que recherchez-vous exactement dans un business e-commerce?"
- "Si je comprends bien, vous cherchez..." (reformulation)
- "Vu votre profil, le Business X à Y FCFA serait parfaitement adapté car..."
- "Investissez-y seulement Z heures/semaine pour un potentiel de X FCFA/mois"
- "Nos clients dans votre situation atteignent généralement la rentabilité en X mois"
- "Êtes-vous prêt à passer à l'étape suivante et acquérir ce business aujourd'hui?"

====== TRAITEMENT DES OBJECTIONS ======
- Prix: "Ce prix inclut [avantages spécifiques]. C'est un investissement qui vous permettra de gagner X FCFA/mois."
- Compétences: "Nos business sont conçus pour les débutants. L'accompagnement de 2 mois inclus vous aidera à maîtriser tous les aspects."
- Temps: "Ce business nécessite seulement X heures/semaine et peut être géré depuis votre smartphone."
- Rentabilité: "Nos clients atteignent généralement le point d'équilibre après X mois, avec un potentiel de Y FCFA/mois."
`;

  // Ajout d'une section pour clarifier la hiérarchie des instructions
  const priorityPrompt = `
====== HIÉRARCHIE DES INSTRUCTIONS ======
1. Répondre précisément à la question posée par l'utilisateur
2. Si plusieurs interprétations sont possibles, choisir celle qui correspond le mieux au contexte de la conversation
3. Appliquer les personnalisations spécifiques du prompt boost uniquement si elles ne contredisent pas les points 1 et 2
4. Adapter le ton et le style selon le profil de comportement configuré
5. Utiliser les données contextuelles (business, formations, etc.) uniquement pour enrichir la réponse, pas pour la remplacer
`;

  // Partie CONFIGURATION: intégration des paramètres personnalisés
  const configPrompt = config && config.prompt_boost ? `
====== PERSONNALISATION ======
${config.prompt_boost}
  ` : '';

  // Partie ADAPTATION: ajustement du comportement selon l'étape du funnel
  const adaptationPrompt = `
====== ADAPTATION AUX ÉTAPES DU FUNNEL DE VENTE ======
${conversionState && conversionState.readyToBuy 
  ? "⚠️ PRIORITÉ: Pousser à finaliser l'acquisition ou à contacter immédiatement un conseiller" 
  : conversionState && conversionState.stage === 'consideration'
    ? "⚠️ PRIORITÉ: Détailler les avantages spécifiques du business et inciter à l'acquisition" 
    : conversionState && conversionState.stage === 'interest'
      ? "⚠️ PRIORITÉ: Expliquer la valeur, le ROI, et tout le travail abattu par l'équipe experte pour offrir l'opportunité, pas seulement le prix" 
      : conversionState && conversionState.businessesViewed && conversionState.businessesViewed.length > 0
        ? "⚠️ PRIORITÉ: Demander si intéressé par un business spécifique, ou recommander un business spécifique adapté à son profil" 
        : "⚠️ PRIORITÉ: Captiver l'intérêt et qualifier les besoins"
}
`;

  // Partie CONTEXTE: informations spécifiques aux produits et à la page
  const contextPrompt = `
====== INFORMATIONS SUR NOS OFFRES ======

BUSINESS E-COMMERCE EN VENTE:
${businessContext}

FORMATIONS E-COMMERCE:
${formationsContext}

MARQUES DE TEKKI STUDIO:
${brandsContext}

INFORMATIONS CLÉS À RETENIR:
- DISTINCTION FONDAMENTALE:
  - TEKKI STUDIO VEND des BUSINESS E-COMMERCE CLÉ EN MAIN (à promouvoir activement)
  - TEKKI STUDIO a ses propres MARQUES (Viens on s'connaît, Amani, Ecoboom) qui ne sont PAS à vendre
- LE PAIEMENT POUR L'ACQUISITION DES BUSINESS NE SE FAIT PAS SUR LE SITE. Le prospect peut manifester son intérêt en cliquant sur le bouton 'Je veux ce business' et en remplissant le formulaire, mais le paiement ne se fera qu'après signature du contrat.

- FRAIS MENSUELS À MENTIONNER:
  - Business physiques: entre 80,000 et 500,000 FCFA (stock, site, marketing, contenus)
  - Business digitaux: entre 50,000 et 300,000 FCFA (site, marketing, contenus)

- ARGUMENTS COMMERCIAUX CLÉS:
  - Accompagnement de 2 mois inclus
  - Business déjà validés sur le marché
  - ROI généralement entre 2-4 mois
  - Formation vidéo fournie
  - Assistance technique incluse
  - Business unique : une seule acquisition possible

- SERVICE CRÉATION SITE E-COMMERCE:
  - Prix: 695,000 FCFA pour site Shopify (payable en 2 fois), 495,000 FCFA pour site Wordpress/WooCommerce 
  - Délai: 7 jours ouvrés
  - Inclus: Stratégie d'acquisition de clients via Meta

====== CONTEXTE ACTUEL DE LA PAGE ======
${pageContext}
`;

  // Inclure le contenu du PDF s'il est disponible
  const knowledgeBasePrompt = config && config.knowledge_base_content 
  ? `
====== INFORMATIONS SUPPLÉMENTAIRES SUR L'ENTREPRISE ======
Les informations ci-dessous sont extraites de notre documentation interne et contiennent des détails supplémentaires sur notre entreprise, nos produits et nos services. Utilise ces informations pour enrichir tes réponses lorsque c'est pertinent.

${config.knowledge_base_content}
  `
  : '';

  // Assemblage du prompt complet
  return `${basePrompt}\n${priorityPrompt}\n${configPrompt}\n${adaptationPrompt}\n${contextPrompt}\n${knowledgeBasePrompt}`;
};

/**
 * Fonction de hachage pour les requêtes
 */
function hashString(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return hash.toString();
}

/**
 * Récupérer la réponse depuis le cache
 */
async function getFromCache(query: string, context: string) {
  const queryHash = hashString(query + context);
  
  try {
    const { data, error } = await supabase
      .from('chatbot_cache')
      .select('response')
      .eq('query_hash', queryHash)
      .lt('expires_at', new Date().toISOString())
      .single();
    
    if (error || !data) return null;
    return data.response;
  } catch (error) {
    console.error('Erreur lors de la lecture du cache:', error);
    return null;
  }
}

/**
 * Sauvegarder la réponse dans le cache
 */
async function saveToCache(query: string, context: string, response: any) {
  const queryHash = hashString(query + context);
  
  // Expire après 7 jours
  const expires_at = new Date();
  expires_at.setDate(expires_at.getDate() + 7);
  
  try {
    await supabase
      .from('chatbot_cache')
      .upsert([{
        query_hash: queryHash,
        query: query.substring(0, 255), // Limiter la taille
        context: context.substring(0, 255), // Limiter la taille du contexte
        response: response,
        expires_at: expires_at.toISOString()
      }], { onConflict: 'query_hash' });
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement en cache:', error);
  }
}

/**
 * Normaliser le texte pour la comparaison
 */
function normalizeText(text: string): string {
  return text.toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")  // Supprimer les accents
    .replace(/[.,?!;:]/g, ' ')        // Remplacer la ponctuation par des espaces
    .replace(/\s+/g, ' ');            // Normaliser les espaces multiples
}

/**
 * Vérifier la pertinence des réponses
 */
function isResponseRelevant(question: string, response: string): boolean {
  const questionLC = question.toLowerCase();
  const responseLC = response.toLowerCase();
  
  // Questions sur les prix/coûts
  if (questionLC.includes("prix") || 
      questionLC.includes("coût") || 
      questionLC.includes("tarif") || 
      questionLC.includes("combien") || 
      questionLC.includes("budget")) {
      
    // La réponse doit contenir des montants ou des références aux prix
    if (!responseLC.includes("fcfa") && 
        !responseLC.includes("franc") && 
        !responseLC.match(/[0-9]+(\s|\.)/) && 
        !responseLC.includes("gratuit") && 
        !responseLC.includes("investissement")) {
      return false;
    }
  }
  
  // Questions sur les délais/temps
  if (questionLC.includes("quand") || 
      questionLC.includes("combien de temps") || 
      questionLC.includes("durée") || 
      questionLC.includes("délai") || 
      questionLC.includes("rapidement")) {
      
    // La réponse doit contenir des références temporelles
    if (!responseLC.includes("jour") && 
        !responseLC.includes("semaine") && 
        !responseLC.includes("mois") && 
        !responseLC.includes("heure") && 
        !responseLC.match(/[0-9]+(\s|\.)/) && 
        !responseLC.includes("immédiat")) {
      return false;
    }
  }
  
  // Questions sur le processus/fonctionnement
  if (questionLC.includes("comment") || 
      questionLC.includes("processus") || 
      questionLC.includes("étape") || 
      questionLC.includes("fonctionn") || 
      questionLC.includes("marche")) {
      
    // La réponse doit contenir des explications de processus
    if (!responseLC.includes("étape") && 
        !responseLC.match(/[0-9][\.\)]/) && // Points numérotés
        !responseLC.includes("d'abord") && 
        !responseLC.includes("ensuite") && 
        !responseLC.includes("enfin") && 
        !responseLC.includes("consiste")) {
      return false;
    }
  }
  
  return true;
}

/**
 * Trouver une question fréquente correspondant à une requête
 */
async function matchCommonQuestion(query: string): Promise<CommonQuestion | null> {
  try {
    // Récupérer toutes les questions fréquentes actives
    const { data: questions, error } = await supabase
      .from('chatbot_common_questions')
      .select('*')
      .eq('is_active', true);

    if (error || !questions || questions.length === 0) {
      return null;
    }

    // Normaliser la requête pour la comparaison
    const normalizedQuery = normalizeText(query);
    
    // 1. Recherche de correspondance exacte ou forte
    for (const question of questions) {
      const normalizedQuestion = normalizeText(question.question);
      
      // Correspondance exacte
      if (normalizedQuestion === normalizedQuery) {
        return addResponseVariation(question);
      }
      
      // Correspondance si l'un contient l'autre
      if (normalizedQuestion.includes(normalizedQuery) || 
          normalizedQuery.includes(normalizedQuestion)) {
        return addResponseVariation(question);
      }
    }
    
    // 2. Recherche par mots-clés significatifs (si la requête est assez longue)
    if (normalizedQuery.length > 10) {
      const queryWords = normalizedQuery.split(' ')
        .filter(word => word.length > 3)
        .filter(word => !['comment', 'pourquoi', 'quand', 'estce', 'avez', 'vous', 'votre', 'pour', 'quels', 'quelles'].includes(word));
      
      if (queryWords.length >= 2) {
        for (const question of questions) {
          const normalizedQuestion = normalizeText(question.question);
          
          const matchCount = queryWords.filter(word => normalizedQuestion.includes(word)).length;
          const matchRatio = matchCount / queryWords.length;
          
          if (matchRatio >= 0.7) {
            return addResponseVariation(question);
          }
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error('Erreur lors de la recherche de questions fréquentes:', error);
    return null;
  }
}

/**
 * Ajouter de la variation aux réponses
 */
function addResponseVariation(question: CommonQuestion): CommonQuestion {
  // Définir des patterns réutilisables pour les variations
  const introVariations = [
    "",
    "Tout à fait ! ",
    "Bien sûr ! ",
    "Avec plaisir. ",
    "Je suis heureuse de répondre à cette question. ",
    "Excellente question ! ",
    "C'est une question pertinente. ",
    "Je comprends votre intérêt. "
  ];
  
  const outroVariations = [
    "",
    " N'hésitez pas si vous avez d'autres questions.",
    " Y a-t-il autre chose que vous aimeriez savoir ?",
    " Puis-je vous aider avec autre chose ?",
    " Ai-je répondu à votre question ?",
    " Est-ce que cela répond à votre question ?",
    " Avez-vous besoin de clarifications supplémentaires ?",
    " N'hésitez pas à me demander plus de détails si nécessaire."
  ];
  
  // Ne pas modifier les réponses qui contiennent des éléments de formatage spécifiques
  if (question.answer.includes("\n-") || 
      question.answer.includes("[") ||
      question.answer.includes("**") ||
      question.answer.includes(":") ||
      question.answer.includes("étape")) {
    return question;
  }
  
  // Générer un nombre pseudo-aléatoire basé sur la date et la question
  const date = new Date();
  const seed = date.getDate() + date.getHours() + question.question.length;
  const introIndex = seed % introVariations.length;
  const outroIndex = (seed + 3) % outroVariations.length;
  
  // Appliquer les variations pour les réponses suffisamment longues
  if (question.answer.length > 40) {
    const modifiedAnswer = introVariations[introIndex] + question.answer + outroVariations[outroIndex];
    return {
      ...question,
      answer: modifiedAnswer
    };
  }
  
  return question;
}

/**
 * Enrichir les réponses avec des suggestions de business
 */
async function enrichWithBusinessSuggestions(question: CommonQuestion): Promise<CommonQuestion> {
  try {
    // Récupérer les business disponibles
    const { data: businessData, error } = await supabase
      .from('businesses')
      .select('id, name, slug, price')
      .eq('status', 'available')
      .order('name')
      .limit(6);
    
    if (error || !businessData || businessData.length === 0) {
      return {
        ...question,
        customSuggestions: ["Je ne sais pas quel business choisir", "Contacter un conseiller"]
      };
    }
    
    // Créer des suggestions avec UNIQUEMENT les noms des business
    const businessSuggestions = businessData.map(b => b.name);
    
    // Ajouter quelques suggestions génériques utiles
    const additionalSuggestions = ["Je ne sais pas quel business choisir"];
    
    // Combiner et limiter à 6 suggestions au total
    const combinedSuggestions = [...businessSuggestions, ...additionalSuggestions].slice(0, 6);
    
    // Toujours inclure l'option de contacter un conseiller
    combinedSuggestions.push("Contacter un conseiller");
    
    return {
      ...question,
      customSuggestions: combinedSuggestions
    };
  } catch (error) {
    console.error('Erreur lors de l\'enrichissement avec des suggestions de business:', error);
    return question; // Retourne la question originale en cas d'erreur
  }
}

/**
 * Récupérer les données avec gestion d'erreur améliorée
 */
async function fetchDataSafely<T>(
  tableName: string, 
  select: string = '*', 
  orderBy?: { column: string, ascending: boolean },
  limit?: number, 
  filters?: Record<string, any>
): Promise<T[]> {
  try {
    let query = supabase.from(tableName).select(select);
    
    if (orderBy) {
      query = query.order(orderBy.column, { ascending: orderBy.ascending });
    }
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }
    
    if (limit) {
      query = query.limit(limit);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error(`Erreur lors de la récupération des données de ${tableName}:`, error);
      return [] as T[];
    }
    
    return (data || []) as T[];
  } catch (e) {
    console.error(`Exception lors de la récupération des données de ${tableName}:`, e);
    return [] as T[];
  }
}

/**
 * Récupérer la configuration du chatbot
 */
async function getChatbotConfig(): Promise<ChatbotConfig | null> {
  try {
    const { data, error } = await supabase
      .from('chatbot_config')
      .select('*')
      .single();
    
    if (error) {
      console.error('Erreur lors de la récupération de la configuration du chatbot:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Exception lors de la récupération de la configuration du chatbot:', error);
    return null;
  }
}

/**
 * Formater les business pour le contexte
 */
function createBusinessContext(businesses: any[]) {
  if (!businesses || businesses.length === 0) {
    return "Aucun business disponible actuellement.";
  }
  
  return businesses
    .filter(b => b.status === 'available')
    .map(b => `
Business: ${b.name || 'Sans nom'}
Catégorie: ${b.category || 'Non spécifiée'}
Type: ${b.type || 'Non spécifié'}
Prix: ${(b.price || 0).toLocaleString()} FCFA
Potentiel mensuel: ${(b.monthly_potential || 0).toLocaleString()} FCFA
Public cible: ${b.target_audience || 'Non spécifié'}
Niveau requis: ${b.skill_level_required || 'Débutant à intermédiaire'}
Temps requis: ${b.time_required_weekly || '10-15'} heures/semaine
ROI estimé: ${b.roi_estimation_months || '6-12'} mois
Frais mensuels à prévoir: ${b.type === 'physical' 
  ? 'Entre 80,000 et 500,000 FCFA (achat de stock, frais mensuels du site, marketing, création de contenus)'
  : 'Entre 50,000 et 300,000 FCFA (frais mensuels du site, marketing, création de contenus)'}
Description: ${b.description ? b.description.substring(0, 300) + '...' : 'Aucune description disponible'}
URL: https://tekkistudio.com/business/${b.slug || ''}
    `.trim())
    .join('\n\n---\n\n');
}

/**
 * Formater les marques pour le contexte
 */
function createBrandsContext(brands: any[]) {
  if (!brands || brands.length === 0) {
    return "Aucune marque disponible actuellement.";
  }
  
  return brands
    .map(b => `
Marque: ${b.name || 'Sans nom'}
Catégorie: ${b.category || 'Non spécifiée'}
Description: ${b.short_description ? b.short_description.substring(0, 300) + '...' : 'Aucune description disponible'}
URL: https://tekkistudio.com/marques/${b.slug || ''}
    `.trim())
    .join('\n\n---\n\n');
}

/**
 * Formater les formations pour le contexte
 */
function createFormationsContext(formations: any[]) {
  if (!formations || formations.length === 0) {
    return "Aucune formation disponible actuellement.";
  }
  
  return formations
    .map(f => `
Formation: ${f.title || 'Sans titre'}
Prix: ${f.price || 'Prix non spécifié'}
Catégorie: ${f.category || 'Non spécifiée'}
Description: ${f.description ? f.description.substring(0, 300) + '...' : 'Aucune description disponible'}
URL: https://tekkistudio.com/formations/${f.slug || ''}
    `.trim())
    .join('\n\n---\n\n');
}

/**
 * Générer des suggestions contextuelles
 */
function generateContextualSuggestions(message: string, response: string, context: any, config: ChatbotConfig | null): string[] {
  // Détecter la présence d'un business spécifique dans la réponse
  const businessMentioned = response.match(/business "([^"]+)"/i) || 
                           response.match(/business ([A-Z][a-zA-ZÀ-ÿ0-9&\s-]+)/);
  
  if (businessMentioned && businessMentioned[1]) {
    const businessName = businessMentioned[1].trim();
    return [
      `Prix et rentabilité de ${businessName}`,
      `Temps et compétences nécessaires`,
      `Comment fonctionne l'accompagnement ?`,
      `Processus d'acquisition`
    ];
  }
  
  // Détection de l'étape du funnel de vente basée sur le message et la réponse
  const messageLC = message.toLowerCase();
  const responseLC = response.toLowerCase();
  
  const isAwarenessStage = message.length < 20 || 
                          messageLC.includes("quoi") || 
                          messageLC.includes("c'est quoi");
  
  const isInterestStage = messageLC.includes("comment") || 
                         messageLC.includes("plus d'infos") ||
                         responseLC.includes("intéressé par");
  
  const isConsiderationStage = messageLC.includes("prix") || 
                              messageLC.includes("combien") || 
                              messageLC.includes("rentabilité") ||
                              responseLC.includes("fcfa") ||
                              responseLC.includes("euros");
  
  const isDecisionStage = messageLC.includes("acheter") || 
                         messageLC.includes("acquérir") || 
                         messageLC.includes("paiement") ||
                         responseLC.includes("processus d'acquisition") ||
                         responseLC.includes("prêt à commencer");
  
  // Suggestions basées sur l'étape du funnel
  if (isDecisionStage) {
    return [
      "Comment procéder pour l'acquisition ?",
      "Quels sont les délais de mise en place ?",
      "Comment payer en plusieurs fois ?",
      "Contacter un conseiller pour finaliser"
    ];
  }
  
  if (isConsiderationStage) {
    return [
      "Quel business me recommandez-vous pour débuter ?",
      "Comment se passe l'accompagnement de 2 mois ?",
      "Je souhaite acquérir ce business",
      "Quels sont les frais mensuels à prévoir ?"
    ];
  }
  
  if (isInterestStage) {
    return [
      "Quels sont les business les plus rentables ?",
      "Quel budget faut-il prévoir ?",
      "Combien de temps faut-il y consacrer ?",
      "Est-ce adapté aux débutants ?"
    ];
  }
  
  if (isAwarenessStage) {
    return [
      "Montrez-moi vos business disponibles",
      "Comment fonctionnent vos business clé en main ?",
      "Quelle est la différence avec vos formations ?",
      "Parlez-moi de votre expertise"
    ];
  }
  
  // Si nous sommes sur une page business spécifique
  if (context.url && context.url.startsWith('/business/') && !context.url.endsWith('/business')) {
    return [
      "Je souhaite acquérir ce business",
      "Quels sont les frais mensuels à prévoir ?",
      "Comment fonctionne l'accompagnement ?",
      "Contacter un conseiller"
    ];
  }
  
  // Contexte des formations
  if (messageLC.includes("formation") || responseLC.includes("formation")) {
    return [
      "Quelles formations proposez-vous ?",
      "Quel est le prix de vos formations ?",
      "Comment se déroulent les formations ?",
      "Y a-t-il un certificat à la fin ?"
    ];
  }
  
  // Contexte des services
  if (messageLC.includes("site") || 
      messageLC.includes("e-commerce") || 
      responseLC.includes("création de site")) {
    return [
      "Quel est le prix de création d'un site ?",
      "Quels sont les délais de livraison ?",
      "Que comprend exactement ce service ?",
      "Comment se passe la maintenance du site ?"
    ];
  }
  
  // Si aucun contexte spécifique n'est détecté, utiliser les suggestions de la config
  if (config && config.initial_suggestions && config.initial_suggestions.length > 0) {
    return config.initial_suggestions;
  }
  
  // Suggestions par défaut (toujours pertinentes et actionnables)
  return [
    "Quels business me recommandez-vous ?",
    "Comment se déroulent vos formations ?",
    "Parlez-moi de votre service de création de site",
    "Contacter un conseiller"
  ];
}

/**
 * Déterminer quel modèle d'IA utiliser
 */
async function getAICompletion(
  config: ChatbotConfig | null,
  messages: any[],
  functionsConfig?: any
) {
  // Déterminer le modèle à utiliser
  let modelToUse = "gpt-4-turbo";
  
  // Utiliser le modèle configuré si disponible
  if (config && config.ai_model) {
    modelToUse = config.ai_model;
  }
  
  // Si c'est un modèle Claude et que Anthropic est configuré
  if (modelToUse.startsWith('claude') && anthropic) {
    try {
      const response = await anthropic.messages.create({
        model: modelToUse,
        max_tokens: 1024,
        temperature: 0.7,
        messages: messages.map(msg => {
          // Anthropic ne prend pas en charge le rôle "system", donc on l'adapte
          if (msg.role === 'system') {
            return {
              role: 'user',
              content: `<instructions>\n${msg.content}\n</instructions>\n\nRéponds comme si tu étais Sara, l'Assistante Commerciale de TEKKI Studio.`
            };
          }
          return msg;
        }),
      });
      
      return {
        choices: [{
          message: {
            content: 'text' in response.content[0] 
            ? response.content[0].text 
            : (response.content[0] as any).text || response.content[0].toString(),
            role: 'assistant'
          }
        }]
      };
    } catch (error) {
      console.error('Erreur avec l\'API Anthropic:', error);
      // Fallback vers OpenAI en cas d'erreur
      modelToUse = "gpt-4-turbo";
    }
  }
  
  // Utiliser OpenAI
  return await openai.chat.completions.create({
    model: modelToUse,
    messages: messages,
    max_tokens: modelToUse.includes('gpt-4') ? 1024 : 600,
    temperature: 0.7,
    functions: functionsConfig?.functions,
    function_call: functionsConfig?.function_call
  });
}

/**
 * Enregistrer une conversation dans Supabase
 */
async function saveConversation(
  userMessage: string, 
  assistantResponse: string, 
  context: { page: string, url: string }, 
  needsHuman: boolean,
  sessionId?: string
): Promise<void> {
  try {
    const { error } = await supabase
      .from('chat_conversations')
      .insert([{
        user_message: userMessage,
        assistant_response: assistantResponse,
        page: context.page,
        url: context.url,
        needs_human: needsHuman,
        session_id: sessionId || 'anonymous',
        created_at: new Date().toISOString()
      }]);
      
    if (error) {
      console.warn('Erreur lors de l\'enregistrement de la conversation:', error);
    }
  } catch (error) {
    console.warn('Exception lors de l\'enregistrement de la conversation:', error);
  }
}

export async function POST(request: Request) {
  try {
    const body: RequestBody = await request.json();
    const { message, context: requestContext, history = [], sessionId, conversionState } = body;
    
    if (!message) {
      return NextResponse.json(
        { error: 'Le message est requis' },
        { status: 400 }
      );
    }

    // Vérifier que le contexte est valide et créer une copie modifiable
    let context = { ...requestContext };
    if (!context || !context.page || !context.url) {
      console.warn("Contexte invalide reçu:", context);
      // Créer un contexte par défaut
      context = {
        page: "Page inconnue",
        url: "/"
      };
    }

    // Vérifier si la réponse est en cache
    const contextKey = `${context.page}:${context.url}`;
    const cachedResponse = await getFromCache(message, contextKey);
    if (cachedResponse) {
      console.log("Réponse trouvée en cache");
      return NextResponse.json(cachedResponse);
    }

    // Vérifier si le message correspond à une question fréquente
    const matchedQuestion = await matchCommonQuestion(message);
    if (matchedQuestion) {
      console.log("Question fréquente identifiée:", matchedQuestion.question);
      
      // Créer des suggestions adaptées à la catégorie de la question
      const { data: relatedQuestions } = await supabase
        .from('chatbot_common_questions')
        .select('question')
        .eq('category', matchedQuestion.category)
        .eq('is_active', true)
        .limit(3);
        
      const categorySuggestions = relatedQuestions?.map(q => q.question) || [];
      
      // Enrichir avec des suggestions de business si la question concerne les business
      let enhancedQuestion = matchedQuestion;
      if (matchedQuestion.category === 'business' || 
          matchedQuestion.question.toLowerCase().includes('business')) {
        enhancedQuestion = await enrichWithBusinessSuggestions(matchedQuestion);
      } else if (!matchedQuestion.customSuggestions) {
        // Ajouter des suggestions par défaut pour les autres catégories
        enhancedQuestion = {
          ...matchedQuestion,
          customSuggestions: [...categorySuggestions, "Contacter un conseiller"]
        };
      }
      
      const response = {
        content: enhancedQuestion.answer,
        suggestions: enhancedQuestion.customSuggestions || categorySuggestions,
        needs_human: false
      };
      
      // Sauvegarder dans le cache
      await saveToCache(message, contextKey, response);
      
      // Enregistrer la conversation
      await saveConversation(message, response.content, context, response.needs_human, sessionId);
      
      return NextResponse.json(response);
    }

    // Récupérer la configuration du chatbot
    const config = await getChatbotConfig();

    // AMÉLIORATION: Détection des questions spécifiques sur le temps/délai
    if (message.toLowerCase().includes('combien de temps') || 
        message.toLowerCase().includes('délai') || 
        message.toLowerCase().includes('démarrer')) {
      
      // Réponse spécifique pour les questions de temps
      const timeResponse = {
        content: `Le délai pour démarrer ce business est généralement de 7 à 15 jours après l'acquisition, le temps que nous apportions les modifications souhaitées et que votre premier stock de produits soit disponible. Vous recevrez l'accès à toutes les ressources nécessaires dans les 48h suivant votre acquisition, et notre accompagnement vous guidera dans la mise en place pendant les 2 premiers mois. Les premiers résultats apparaissent généralement après 2-3 semaines d'activité.`,
        suggestions: ["Comment se passe l'accompagnement?", "Quelles sont les étapes d'acquisition?", "Contacter un conseiller"],
        needs_human: false
      };
      
      // Sauvegarder dans le cache
      await saveToCache(message, contextKey, timeResponse);
      
      // Enregistrer la conversation
      await saveConversation(message, timeResponse.content, context, timeResponse.needs_human, sessionId);
      
      return NextResponse.json(timeResponse);
    }

    // Récupérer les données pertinentes en fonction du contexte
    let businessesData: any[] = [];
    let brandsData: any[] = [];
    let formationsData: any[] = [];
    
    try {
      // Optimisation: ne récupérer que les données nécessaires selon le contexte
      if (context.url.startsWith('/business/') && !context.url.endsWith('/business')) {
        // Page d'un business spécifique
        const businessSlug = context.url.split('/').pop();
        businessesData = await fetchDataSafely('businesses', '*', undefined, undefined, { slug: businessSlug });
      } 
      else if (context.url.startsWith('/business')) {
        // Page des business en général
        businessesData = await fetchDataSafely('businesses', '*', { column: 'created_at', ascending: false });
      }
      else {
        // Autres pages: limiter le nombre de business à 3 pour réduire les tokens
        businessesData = await fetchDataSafely('businesses', '*', { column: 'created_at', ascending: false }, 3);
      }

      // Récupérer les marques et formations selon la page visitée
      if (context.url.startsWith('/marques')) {
        brandsData = await fetchDataSafely('brands');
      } else if (context.url.startsWith('/formations')) {
        formationsData = await fetchDataSafely('formations');
      } else {
        // Sur d'autres pages, récupérer un échantillon limité
        brandsData = await fetchDataSafely('brands', '*', undefined, 2);
        formationsData = await fetchDataSafely('formations', '*', undefined, 2);
      }
    } catch (dataError) {
      console.error('Erreur lors de la récupération des données:', dataError);
      // Continuer même si la récupération des données échoue
    }

    // Formater les contextes
    const businessesContextString = createBusinessContext(businessesData);
    const brandsContextString = createBrandsContext(brandsData);
    const formationsContextString = createFormationsContext(formationsData);

    // Définir le contexte actuel basé sur l'URL
    let pageSpecificContext = '';
    if (context.url.startsWith('/business')) {
      pageSpecificContext = `
L'utilisateur est sur la page des business e-commerce à vendre.
Voici les business actuellement disponibles à la vente:
${businessesContextString}

TRÈS IMPORTANT: Ne confondez PAS ces business e-commerce à vendre avec les marques créées par TEKKI Studio. Amani et Ecoboom sont des MARQUES de TEKKI Studio, PAS des business à vendre.
      `;
    } else if (context.url.startsWith('/formations')) {
      pageSpecificContext = `
L'utilisateur est sur la page des formations.
Voici les formations actuellement proposées:
${formationsContextString}
      `;
    } else if (context.url.startsWith('/marques')) {
      pageSpecificContext = `
L'utilisateur est sur la page des marques créées par TEKKI Studio.
Voici les marques créées:
${brandsContextString}

TRÈS IMPORTANT: Ces marques appartiennent à TEKKI Studio et ne sont PAS à vendre. Ne les confondez pas avec les business e-commerce à vendre.
      `;
    } else if (context.url.startsWith('/services')) {
      pageSpecificContext = `
L'utilisateur est sur la page des services.
Voici le service de création de site e-commerce:
Prix: 695,000 FCFA pour site Shopify (payable en 2 fois), 495,000 FCFA pour site Wordpress/WooCommerce
Délai: 7 jours ouvrés
Inclus: Stratégie d'acquisition de clients via Meta
      `;
    } else {
      // Sur la page d'accueil ou autre page, incluons quand même les informations sur les business
      pageSpecificContext = `
L'utilisateur est sur ${context.page || "la page d'accueil"}.
      `;
    }

    // Créer le prompt système avec notre nouvelle fonction
    const systemPrompt = createSystemPrompt(
      config, 
      pageSpecificContext, 
      businessesContextString,
      formationsContextString,
      brandsContextString,
      conversionState || {}
    );

    // Vérifier si le message contient des déclencheurs d'assistance humaine depuis la config
    let needsHumanAssistance = false;
    if (config && config.human_trigger_phrases && config.human_trigger_phrases.length > 0) {
      const lowerCaseMessage = message.toLowerCase();
      needsHumanAssistance = config.human_trigger_phrases.some(phrase => 
        lowerCaseMessage.includes(phrase.toLowerCase())
      );
    }

    // Si une assistance humaine est nécessaire, on retourne directement une réponse
    if (needsHumanAssistance) {
      const humanResponse = {
        content: "Je détecte que vous avez besoin d'une assistance plus personnalisée. Souhaitez-vous être mis en relation avec un membre de notre équipe ?",
        suggestions: ["Contacter un conseiller", "Non merci, continuer"],
        needs_human: true
      };
      
      // Enregistrer la conversation
      await saveConversation(message, humanResponse.content, context, true, sessionId);
      
      return NextResponse.json(humanResponse);
    }

    // Limiter l'historique de conversation pour réduire les tokens
    const limitedHistory = history.slice(-5);

    // Construire l'historique des messages pour la conversation
    const conversationHistory = [
      { role: 'system', content: systemPrompt },
      ...limitedHistory.map((msg: ChatMessage) => ({
        role: msg.role,
        content: msg.content
      })),
      { role: 'user', content: message }
    ];

    // Définir les fonctions pour l'API OpenAI
    const functionsConfig = {
      functions: [
        {
          name: "format_assistant_response",
          description: "Format the assistant response with content and suggestions",
          parameters: {
            type: "object",
            properties: {
              content: {
                type: "string",
                description: "The main response text"
              },
              suggestions: {
                type: "array",
                items: {
                  type: "string"
                },
                description: "List of 2-4 follow-up question suggestions"
              },
              needs_human: {
                type: "boolean",
                description: "Whether the query needs human assistance"
              }
            },
            required: ["content", "suggestions", "needs_human"]
          }
        }
      ],
      function_call: { name: "format_assistant_response" }
    };
    
    try {
      // Appel à l'API IA
      const completion = await getAICompletion(config, conversationHistory, functionsConfig);

      // Extraire et formater la réponse
      let aiResponse: { 
        content: string; 
        suggestions: string[]; 
        needs_human: boolean;
      } = { 
        content: '', 
        suggestions: [], 
        needs_human: false 
      };

      if (completion.choices && completion.choices.length > 0) {
        const messageObject = completion.choices[0].message as any;
        const functionCall = messageObject?.function_call;
        
        if (functionCall && functionCall.arguments) {
          try {
            aiResponse = JSON.parse(functionCall.arguments as string);
            
            // Vérifier si la réponse est pertinente par rapport à la question
            if (!isResponseRelevant(message, aiResponse.content)) {
              console.log("Réponse non pertinente détectée, génération d'une réponse spécifique");
              
              // TODO: Implémenter une logique pour améliorer la pertinence des réponses
              // Si nécessaire, nous pourrions traiter différents types de questions ici
            }
          } catch (jsonError) {
            console.error('Erreur lors du parsing de la réponse formatée:', jsonError);
            aiResponse.content = "Je n'ai pas pu traiter correctement votre demande. Pourriez-vous reformuler votre question?";
            aiResponse.needs_human = true;
          }
        } else if (completion.choices[0].message.content) {
          // Si le modèle n'a pas utilisé la fonction (Claude par exemple)
          aiResponse.content = completion.choices[0].message.content;
          aiResponse.suggestions = config?.initial_suggestions || [
            "Parlez-moi de vos business en vente",
            "Quelles formations proposez-vous?",
            "Contacter un conseiller"
          ];
        }
      }
      
      // Ajouter l'option de contacter le service client si nécessaire
      if (aiResponse.needs_human && !aiResponse.suggestions.includes("Contacter un conseiller")) {
        aiResponse.suggestions.push("Contacter un conseiller");
      }

      // S'assurer qu'il y a toujours des suggestions utiles et contextuelles
      if (aiResponse.suggestions.length === 0) {
        aiResponse.suggestions = generateContextualSuggestions(message, aiResponse.content, context, config);
      }

      // Pour la question concernant un site e-commerce, s'assurer que la réponse parle du service
      if ((message.toLowerCase().includes("site e-commerce") || 
          message.toLowerCase().includes("site web") || 
          message.toLowerCase().includes("créer un site") ||
          message.toLowerCase().includes("boutique en ligne") || 
          message.toLowerCase().includes("conception de site")) && 
          !context.url.startsWith('/business/')) {
        const serviceURL = "https://tekkistudio.com/services/sites-ecommerce";
        if (!aiResponse.content.includes(serviceURL)) {
          // Ajouter une suggestion spécifique
          aiResponse.suggestions = [
            "Quels sont les délais de livraison?",
            "Que comprend exactement ce service?",
            "Voir la page du service"
          ];
          
          // Assurons-nous que la réponse parle bien du service et non des business
          if (!aiResponse.content.includes("695 000 FCFA")) {
            aiResponse.content = `Notre service de création de site e-commerce professionnel est disponible à 695 000 FCFA. Il comprend un site entièrement fonctionnel et optimisé pour la conversion, une stratégie Meta et une formation vidéo pour la prise en main. Vous pouvez découvrir tous les détails en cliquant ici : [Découvrir le service](${serviceURL}). Le délai de livraison de votre site est de 7 jours ouvrés.`;
          }
        }
      }

      // Enregistrer la réponse dans le cache
      await saveToCache(message, contextKey, aiResponse);

      // Enregistrer la conversation dans Supabase
      await saveConversation(message, aiResponse.content, context, aiResponse.needs_human, sessionId);
      
      return NextResponse.json(aiResponse);
    } catch (aiError) {
      console.error('Erreur avec l\'API IA:', aiError);
      
      // Répondre avec une erreur plus informative
      return NextResponse.json(
        { 
          content: "Je rencontre des difficultés à traiter votre demande actuellement. Notre équipe est disponible pour vous aider directement.", 
          suggestions: ["Contacter un conseiller", "Voir nos business disponibles", "Explorer nos formations"],
          needs_human: true
        },
        { status: 200 } // Toujours renvoyer 200 pour que le frontend puisse traiter la réponse
      );
    }
  } catch (error) {
    console.error('Erreur détaillée dans l\'API chatbot:', error);
    
    return NextResponse.json(
      { 
        content: "Désolé, j'ai rencontré un problème technique. Voulez-vous contacter notre équipe directement?", 
        suggestions: ["Contacter un conseiller", "Réessayer plus tard", "Voir nos business"],
        needs_human: true
      },
      { status: 200 } // Toujours renvoyer 200
    );
  }
}