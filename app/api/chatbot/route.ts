// app/api/chatbot/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '../../lib/supabase';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

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

// Types pour la requête et les messages
interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
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

interface ChatbotConfig {
  id: string;
  initial_suggestions: string[];
  welcome_message: string;
  human_trigger_phrases: string[];
  prompt_boost: string;
  ai_model?: string;
  behavior_profile?: string;
  created_at: string;
  updated_at: string;
}

// Fonction pour créer un prompt système modulaire
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
• Style: Assertif, confiant et dynamique
• Ton: Chaleureux, accessible et professionnel
• Approche conversationnelle: Utilise des phrases naturelles et fluides, évite les listes à puces dans tes réponses

====== SÉQUENCE DE CONVERSATION ======
1. ACCUEIL: Salutation chaleureuse adaptée à l'heure locale
2. DÉCOUVERTE: Questions ouvertes pour comprendre le besoin, reformulation pour montrer que tu comprends
3. QUALIFICATION: Identifie rapidement le profil (débutant/expérimenté, budget, temps disponible)
4. RECOMMANDATION: Propose 2-3 produits maximum adaptés aux besoins exprimés, en justifiant chaque recommandation
5. OBJECTIONS: Anticipe et lève les doutes (temps, compétences, rentabilité)
6. VENTE ADDITIONNELLE: Suggère des produits complémentaires uniquement si pertinents
7. ACCOMPAGNEMENT: Guide le client dans le processus d'achat, étape par étape

====== FORMULATIONS EFFICACES ======
• "Je vois que vous vous intéressez à [produit/catégorie]. Cherchez-vous quelque chose en particulier?"
• "Que recherchez-vous exactement dans un business e-commerce?"
• "Si je comprends bien, vous cherchez..." (reformulation)
• "Vu votre profil, le Business X à Y FCFA serait parfaitement adapté car..."
• "Investissez-y seulement Z heures/semaine pour un potentiel de X FCFA/mois"
• "Nos clients dans votre situation atteignent généralement la rentabilité en X mois"
• "Êtes-vous prêt à passer à l'étape suivante et acquérir ce business aujourd'hui?"

====== TRAITEMENT DES OBJECTIONS ======
• Prix: "Ce prix inclut [avantages spécifiques]. C'est un investissement qui vous permettra de gagner X FCFA/mois."
• Compétences: "Nos business sont conçus pour les débutants. L'accompagnement de 2 mois inclus vous aidera à maîtriser tous les aspects."
• Temps: "Ce business nécessite seulement X heures/semaine et peut être géré depuis votre smartphone."
• Rentabilité: "Nos clients atteignent généralement le point d'équilibre après X mois, avec un potentiel de Y FCFA/mois."
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
  : conversionState && conversionState.hasConsideredSpecificBusiness 
    ? "⚠️ PRIORITÉ: Détailler les avantages spécifiques du business et inciter à l'acquisition" 
    : conversionState && conversionState.hasAskedAboutPrice 
      ? "⚠️ PRIORITÉ: Expliquer la valeur, le ROI, et tout le travail abattu par l'équipe experte pour offrir l'opportunité, pas seulement le prix" 
      : conversionState && conversionState.hasShownInterest 
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
• DISTINCTION FONDAMENTALE:
  - TEKKI STUDIO VEND des BUSINESS E-COMMERCE CLÉ EN MAIN (à promouvoir activement)
  - TEKKI STUDIO a ses propres MARQUES (Viens on s'connaît, Amani, Ecoboom) qui ne sont PAS à vendre

• FRAIS MENSUELS À MENTIONNER:
  - Business physiques: entre 80,000 et 500,000 FCFA (stock, site, marketing, contenus)
  - Business digitaux: entre 50,000 et 300,000 FCFA (site, marketing, contenus)

• ARGUMENTS COMMERCIAUX CLÉS:
  - Accompagnement de 2 mois inclus
  - Business déjà validés sur le marché
  - ROI généralement entre 2-4 mois
  - Formation vidéo fournie
  - Assistance technique incluse
  - Business unique : une seule acquisition possible

• SERVICE CRÉATION SITE E-COMMERCE:
  - Prix: 695,000 FCFA pour site Shopify (payable en 2 fois), 495,000 FCFA pour site Wordpress/WooCommerce 
  - Délai: 7 jours ouvrés
  - Inclus: Stratégie d'acquisition de clients via Meta

====== CONTEXTE ACTUEL DE LA PAGE ======
${pageContext}
`;

  // Assemblage du prompt complet
  return `${basePrompt}\n${configPrompt}\n${adaptationPrompt}\n${contextPrompt}`;
};

// Fonctions de cache pour réduire les appels à l'API 
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

// Fonction simple de hachage pour les requêtes
function hashString(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return hash.toString();
}

// Fonction pour déterminer si une question est commerciale
function isCommercialQuery(query: string) {
  const commercialPatterns = [
    // Mots liés à l'achat
    /acheter|achat|acquérir|acquisition|prix|tarif|coût|cout|payer|investir/i,
    // Questions sur la rentabilité
    /rentab|profit|revenu|bénéfice|benefice|retour|roi|investissement/i,
    // Questions sur le fonctionnement
    /comment ça (marche|fonctionne)|comment[- ]faire|fonctionnement/i,
    // Questions sur le support
    /support|aide|assist|accompagnement|formation/i,
    // Questions de comparaison
    /différence|meilleur|comparer|versus|vs|ou bien/i,
    // Expressions d'intérêt
    /je veux|je souhaite|je cherche|intéressé|interesse/i,
    // Qualifications
    /débutant|experience|temps|compétence|competence/i,
    // Objections
    /difficile|complexe|risque|problème|probleme|inqui[eè]t/i
  ];
  
  return commercialPatterns.some(pattern => pattern.test(query));
}

// Fonction pour déterminer si une question est complexe 
function isComplexQuery(query: string) {
  const complexPatterns = [
    /compare|comparer|différence/i,
    /expliqu|détaill|développ/i,
    /retour sur investissement|roi|break even/i,
    /personnalis/i,
    /spécifi|précis/i,
    /marché|concurrence/i,
    /pourquoi|comment|quand/i,
    /recommend|conseil|suggère/i
  ];
  
  return complexPatterns.some(pattern => pattern.test(query));
}

// Fonction pour vérifier si le message concerne une question fréquente
async function matchCommonQuestion(query: string): Promise<any | null> {
  try {
    // Récupérer toutes les questions fréquentes actives
    const { data: questions, error } = await supabase
      .from('chatbot_common_questions')
      .select('*')
      .eq('is_active', true);

    if (error || !questions || questions.length === 0) {
      return null;
    }

    // Normaliser la requête de l'utilisateur pour la recherche
    const normalizedQuery = query.toLowerCase().trim().replace(/[.,?!;:]/g, '');
    
    // Vérifier si la requête correspond à une question fréquente
    // 1. D'abord rechercher une correspondance exacte
    const exactMatch = questions.find(q => 
      q.question.toLowerCase().trim().replace(/[.,?!;:]/g, '') === normalizedQuery
    );
    
    if (exactMatch) return exactMatch;
    
    // 2. Ensuite, rechercher une correspondance partielle
    // On considère une correspondance si 80% des mots de la question fréquente se trouvent dans la requête
    const queryWords = normalizedQuery.split(/\s+/);
    
    for (const question of questions) {
      const questionWords = question.question.toLowerCase().trim().replace(/[.,?!;:]/g, '').split(/\s+/);
      
      // Si la question est trop courte (moins de 3 mots), on exige une correspondance exacte
      if (questionWords.length < 3) continue;
      
      // Calculer combien de mots de la question fréquente apparaissent dans la requête
      const matchingWords = questionWords.filter((word: string) => 
        queryWords.includes(word) && word.length > 3 // On ignore les mots courts comme "le", "la", "de"
      );
      
      const matchRatio = matchingWords.length / questionWords.length;
      
      // Si plus de 70% des mots significatifs correspondent, on considère que c'est une correspondance
      if (matchRatio >= 0.7) {
        return question;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Erreur lors de la recherche de questions fréquentes:', error);
    return null;
  }
}

// Fonction auxiliaire pour récupérer les données avec gestion d'erreur améliorée
async function fetchDataSafely<T>(
  tableName: string, 
  select: string = '*', 
  orderBy?: { column: string, ascending: boolean },
  limit?: number, 
  filters?: any
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

// Récupérer la configuration du chatbot
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

// Fonction pour formater les business pour le contexte
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

// Fonction pour formater les marques pour le contexte
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

// Fonction pour formater les formations pour le contexte
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

// Amélioration de la fonction pour générer des suggestions contextuelles
function generateContextualSuggestions(message: string, response: string, context: any, config: ChatbotConfig | null): string[] {
  // Détecter l'étape du funnel de vente
  const isAwarenessStage = message.toLowerCase().includes("quoi") || message.toLowerCase().includes("c'est quoi") || message.length < 20;
  const isInterestStage = message.toLowerCase().includes("comment") || message.toLowerCase().includes("plus d'infos");
  const isConsiderationStage = message.toLowerCase().includes("prix") || message.toLowerCase().includes("combien") || message.toLowerCase().includes("frais");
  const isDecisionStage = message.toLowerCase().includes("acheter") || message.toLowerCase().includes("acquérir") || message.toLowerCase().includes("intéressé");
  
  // Suggestions basées sur l'étape du funnel
  if (isDecisionStage) {
    return [
      "Comment procéder pour l'acquisition?",
      "Quels sont les délais de mise en place?",
      "Contacter un conseiller"
    ];
  }
  
  if (isConsiderationStage) {
    return [
      "Quel business me recommandez-vous?",
      "Comment se passe l'accompagnement?",
      "Je souhaite acquérir ce business"
    ];
  }
  
  if (isInterestStage) {
    return [
      "Quels sont les business les plus rentables?",
      "Quel est le budget nécessaire?",
      "Combien de temps faut-il y consacrer?"
    ];
  }
  
  if (isAwarenessStage) {
    return [
      "Quels sont les avantages d'un business clé en main?",
      "Montrez-moi des exemples de business",
      "Comment fonctionnent vos business?"
    ];
  }
  
  // Si nous sommes sur une page business spécifique
  if (context.url && context.url.startsWith('/business/') && !context.url.endsWith('/business')) {
    return [
      "Je souhaite acquérir ce business",
      "Quels sont les frais mensuels?",
      "Contacter un conseiller"
    ];
  }
  
  // Utiliser les suggestions initiales de la configuration si disponibles
  if (config && config.initial_suggestions && config.initial_suggestions.length > 0) {
    return config.initial_suggestions;
  }
  
  // Suggestions par défaut
  return [
    "Quel business me recommandez-vous?",
    "Je veux en savoir plus sur vos formations",
    "Contacter un conseiller"
  ];
}

// Fonction qui détermine quel modèle d'IA utiliser
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

// Fonction pour enregistrer une conversation dans Supabase
async function saveConversation(
  userMessage: string, 
  assistantResponse: string, 
  context: {page: string, url: string}, 
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
      const categorySuggestions = await createCategorySuggestions(matchedQuestion.category);
      
      const response = {
        content: matchedQuestion.answer,
        suggestions: categorySuggestions,
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

    // Utiliser nos fonctions pour formater les contextes
    const businessesContextString = createBusinessContext(businessesData);
    const brandsContextString = createBrandsContext(brandsData);
    const formationsContextString = createFormationsContext(formationsData);

    // Service de création de site e-commerce
    const ecommerceServiceContext = {
      title: "Site E-commerce Professionnel",
      subtitle: "Site E-commerce Professionnel + Stratégie Meta",
      price: 695000,
      deliveryTime: "7 jours ouvrés",
      features: [
        "Site e-commerce adapté à tous les écrans",
        "Design moderne, intuitif et professionnel",
        "Intégration de formulaire de commande",
        "Gestion de stock et de commandes",
        "Tableau de bord simplifié pour tout gérer",
        "Référencement naturel sur Google",
        "Formation à l'utilisation du site"
      ],
      marketingStrategy: [
        "Analyse de votre audience cible",
        "Création de 2 publicités Facebook/Instagram",
        "Configuration du Pixel Meta sur votre site",
        "Stratégie de ciblage détaillée",
        "Recommandations de budget publicitaire",
        "Suivi des performances pendant 15 jours"
      ],
      url: "https://tekkistudio.com/services/sites-ecommerce"
    };

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
${JSON.stringify(ecommerceServiceContext, null, 2)}
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
                description: "List of 2-3 follow-up question suggestions"
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
      // Appel à l'API IA avec notre nouvelle fonction
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
          message.toLowerCase().includes("conception de site")) && 
          !context.url.startsWith('/business/')) {
        const serviceURL = "https://tekkistudio.com/services/sites-ecommerce";
        if (!aiResponse.content.includes(serviceURL)) {
          // La réponse ne contient pas le bon lien, on ajoute une suggestion spécifique
          aiResponse.suggestions = [
            "Quels sont les délais de livraison?",
            "Que comprend exactement ce service?",
            "Voir la page du service"
          ];
          
          // Assurons-nous que la réponse parle bien du service et non des business
          if (!aiResponse.content.includes("695 000 FCFA")) {
            aiResponse.content = `Notre service de création de site e-commerce professionnel est disponible à 695 000 FCFA. Il comprend un site entièrement fonctionnel et optimisé pour la conversion, une stratégie Meta et une formation vidéo pour la prise en main. Vous pouvez découvrir tous les détails en cliquant ici : [Créez votre site e-commerce professionnel](${serviceURL}). Le délai de livraison de votre site est de 7 jours ouvrés.`;
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

// Fonction auxiliaire pour créer des suggestions basées sur la catégorie
async function createCategorySuggestions(category: string): Promise<string[]> {
  try {
    // Récupérer d'autres questions de la même catégorie
    const { data: relatedQuestions, error } = await supabase
      .from('chatbot_common_questions')
      .select('question')
      .eq('category', category)
      .eq('is_active', true)
      .limit(3);
    
    if (error || !relatedQuestions || relatedQuestions.length === 0) {
      // Utiliser des suggestions par défaut si aucune question liée n'est trouvée
      return [
        "Quel business me recommandez-vous?",
        "Je veux en savoir plus sur vos formations",
        "Contacter un conseiller"
      ];
    }
    
    // Extraire les questions comme suggestions
    let suggestions = relatedQuestions.map(q => q.question);
    
    // Toujours ajouter l'option de contacter le service client
    if (!suggestions.includes("Contacter un conseiller")) {
      suggestions.push("Contacter un conseiller");
    }
    
    return suggestions;
  } catch (error) {
    console.error('Erreur lors de la création des suggestions par catégorie:', error);
    return ["Contacter un conseiller"];
  }
}