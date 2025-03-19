// app/api/chatbot/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '../../lib/supabase';
import OpenAI from 'openai';

// Initialiser OpenAI avec la clé API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Types pour la requête et les messages
interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface RequestBody {
  message: string;
  context: {
    page: string;
    url: string;
  };
  history?: ChatMessage[];
}

interface Brand {
  id: string;
  name: string;
  category?: string;
  short_description?: string;
  slug?: string;
  // Autres propriétés
}

interface Formation {
  id: string;
  title: string;
  price?: string | number;
  category?: string;
  description?: string;
  slug?: string;
  // Autres propriétés
}

interface Business {
  id: string;
  name: string;
  slug: string;
  category?: string;
  type?: 'physical' | 'digital';
  status?: string;
  price: number;
  original_price?: number;
  monthly_potential?: number;
  pitch?: string;
  description?: string;
  images: Array<{src: string, alt: string}>;
  market_analysis: any;
  product_details: any;
  marketing_strategy: any;
  financials: any;
  includes: string[];
  target_audience?: string;
  skill_level_required?: string;
  time_required_weekly?: number;
  roi_estimation_months?: number;
  success_stories?: string[];
  common_questions?: any;
  benefits?: string[];
  // Autres propriétés
}

interface ChatbotConfig {
  id: string;
  initial_suggestions: string[];
  welcome_message: string;
  human_trigger_phrases: string[];
  prompt_boost: string;
  created_at: string;
  updated_at: string;
}

interface CommonQuestion {
  id: string;
  question: string;
  answer: string;
  category: string;
  is_active: boolean;
  created_at: string;
}

interface ConversionState {
  hasShownInterest: boolean;
  hasAskedAboutPrice: boolean;
  hasConsideredSpecificBusiness: boolean;
  readyToBuy: boolean;
  recommendedBusiness: string | null;
}

// Fonctions de cache pour réduire les appels à l'API OpenAI
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
      
    console.log('Réponse sauvegardée en cache');
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

// Fonction pour déterminer si une question est complexe (conservée pour rétrocompatibilité)
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

// Analyser l'état de conversion à partir de l'historique
function analyzeConversionState(history: ChatMessage[]): ConversionState {
  const state: ConversionState = {
    hasShownInterest: false,
    hasAskedAboutPrice: false,
    hasConsideredSpecificBusiness: false,
    readyToBuy: false,
    recommendedBusiness: null
  };
  
  for (const msg of history) {
    const content = msg.content.toLowerCase();
    
    // Détecter l'intérêt
    if (content.includes("intéressé") || content.includes("plus d'info")) {
      state.hasShownInterest = true;
    }
    
    // Détecter les questions de prix
    if (content.includes("prix") || content.includes("coût") || content.includes("tarif")) {
      state.hasAskedAboutPrice = true;
    }
    
    // Détecter l'intérêt pour un business spécifique
    if (content.includes("business") && (content.includes("specific") || content.includes("particulier"))) {
      state.hasConsideredSpecificBusiness = true;
    }
    
    // Détecter l'intention d'achat
    if (content.includes("acheter") || content.includes("acquérir")) {
      state.readyToBuy = true;
    }
    
    // Extraire le business recommandé (si mentionné par l'assistant)
    if (msg.role === 'assistant' && 
        (content.includes("recommande") || content.includes("parfait pour vous"))) {
      // Essayer d'extraire le nom du business
      const businessMatch = content.match(/business\s+([a-z0-9&\s-]+)/i);
      if (businessMatch && businessMatch[1]) {
        state.recommendedBusiness = businessMatch[1].trim();
      }
    }
  }
  
  return state;
}

// Fonction pour vérifier si le message de l'utilisateur correspond à une question fréquente
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
  console.log(`Tentative de récupération des données depuis la table: ${tableName}`);
  
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
    
    console.log(`Données récupérées avec succès depuis ${tableName}, nombre d'éléments: ${data?.length || 0}`);
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
function createBusinessContext(businesses: Business[]) {
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
function createBrandsContext(brands: Brand[]) {
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
function createFormationsContext(formations: Formation[]) {
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
      "Contacter le service client"
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
  if (context.url.startsWith('/business/') && !context.url.endsWith('/business')) {
    return [
      "Je souhaite acquérir ce business",
      "Quels sont les frais mensuels?",
      "Contacter le service client"
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
    "Contacter le service client"
  ];
}

// Fonction pour créer le contexte des questions fréquentes
async function createCommonQuestionsContext(): Promise<string> {
  try {
    const { data: questions, error } = await supabase
      .from('chatbot_common_questions')
      .select('*')
      .eq('is_active', true);
    
    if (error || !questions || questions.length === 0) {
      return "";
    }
    
    // Regrouper les questions par catégorie
    const categorizedQuestions: Record<string, CommonQuestion[]> = {};
    
    questions.forEach(question => {
      if (!categorizedQuestions[question.category]) {
        categorizedQuestions[question.category] = [];
      }
      categorizedQuestions[question.category].push(question);
    });
    
    // Formater les questions par catégorie
    let context = "QUESTIONS FRÉQUEMMENT POSÉES PAR CATÉGORIE:\n\n";
    
    Object.entries(categorizedQuestions).forEach(([category, categoryQuestions]) => {
      context += `CATÉGORIE: ${category.toUpperCase()}\n`;
      
      categoryQuestions.forEach((q, index) => {
        context += `Q${index + 1}: ${q.question}\nR${index + 1}: ${q.answer}\n\n`;
      });
      
      context += '\n';
    });
    
    return context;
  } catch (error) {
    console.error('Erreur lors de la récupération des questions fréquentes:', error);
    return "";
  }
}

// Fonction pour générer des suggestions basées sur la catégorie d'une question fréquente
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
        "Contacter le service client"
      ];
    }
    
    // Extraire les questions comme suggestions
    let suggestions = relatedQuestions.map(q => q.question);
    
    // Toujours ajouter l'option de contacter le service client
    if (!suggestions.includes("Contacter le service client")) {
      suggestions.push("Contacter le service client");
    }
    
    return suggestions;
  } catch (error) {
    console.error('Erreur lors de la création des suggestions par catégorie:', error);
    return ["Contacter le service client"];
  }
}

// Fonction pour enregistrer une conversation dans Supabase
async function saveConversation(
  userMessage: string, 
  assistantResponse: string, 
  context: {page: string, url: string}, 
  needsHuman: boolean
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
        created_at: new Date().toISOString()
      }]);
      
    if (error) {
      console.warn('Erreur lors de l\'enregistrement de la conversation:', error);
    } else {
      console.log("Conversation enregistrée avec succès");
    }
  } catch (error) {
    console.warn('Exception lors de l\'enregistrement de la conversation:', error);
  }
}

export async function POST(request: Request) {
  try {
    console.log("Traitement d'une nouvelle requête chatbot");
    const body: RequestBody = await request.json();
    const { message, context, history = [] } = body;
    
    if (!message) {
      return NextResponse.json(
        { error: 'Le message est requis' },
        { status: 400 }
      );
    }

    console.log("Message reçu:", message);
    console.log("Contexte:", context);

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
      await saveConversation(message, response.content, context, response.needs_human);
      
      return NextResponse.json(response);
    }

    // Récupérer la configuration du chatbot
    const config = await getChatbotConfig();
    console.log("Configuration du chatbot récupérée:", config ? "Oui" : "Non");

    // Récupérer les données pertinentes en fonction du contexte
    let businessesData: Business[] = [];
    let brandsData: Brand[] = [];
    let formationsData: Formation[] = [];
    
    // Optimisation: ne récupérer que les données nécessaires selon le contexte
    if (context.url.startsWith('/business/') && !context.url.endsWith('/business')) {
      // Page d'un business spécifique
      const businessSlug = context.url.split('/').pop();
      businessesData = await fetchDataSafely<Business>('businesses', '*', undefined, undefined, { slug: businessSlug });
    } 
    else if (context.url.startsWith('/business')) {
      // Page des business en général
      businessesData = await fetchDataSafely<Business>('businesses', '*', { column: 'created_at', ascending: false });
    }
    else {
      // Autres pages: limiter le nombre de business à 3 pour réduire les tokens
      businessesData = await fetchDataSafely<Business>('businesses', '*', { column: 'created_at', ascending: false }, 3);
    }

    // Récupérer les marques et formations selon la page visitée
    if (context.url.startsWith('/marques')) {
      brandsData = await fetchDataSafely<Brand>('brands');
    } else if (context.url.startsWith('/formations')) {
      formationsData = await fetchDataSafely<Formation>('formations');
    } else {
      // Sur d'autres pages, récupérer un échantillon limité
      brandsData = await fetchDataSafely<Brand>('brands', '*', undefined, 2);
      formationsData = await fetchDataSafely<Formation>('formations', '*', undefined, 2);
    }

    console.log(`${businessesData.length} business récupérés`);
    console.log(`${brandsData.length} marques récupérées`);
    console.log(`${formationsData.length} formations récupérées`);

    // Utiliser nos fonctions pour formater les contextes
    const businessesContextString = createBusinessContext(businessesData);
    const brandsContextString = createBrandsContext(brandsData);
    const formationsContextString = createFormationsContext(formationsData);
    const commonQuestionsContext = await createCommonQuestionsContext();

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
Voici les business actuellement disponibles à la vente:
${businessesContextString}

TRÈS IMPORTANT: Ne confondez PAS ces business e-commerce à vendre avec les marques créées par TEKKI Studio. Amani et Ecoboom sont des MARQUES de TEKKI Studio, PAS des business à vendre.
      `;
    }

    // Analyser l'état de conversion du visiteur
    const conversionState = analyzeConversionState([...history, { role: 'user', content: message }]);
    console.log("État de conversion:", conversionState);

    // Utiliser le prompt système optimisé
    const systemPrompt = `
Tu es Sara, Assistante Commerciale experte chez TEKKI Studio, entreprise spécialisée dans la vente de business e-commerce clé en main au Sénégal. Ton OBJECTIF PRINCIPAL est de CONVERTIR les visiteurs en ACHETEURS.

====== TON PROFIL DE VENDEUSE ÉLITE ======
• Style: Assertif, confiant et dynamique
• Ton: Chaleureux, accessible mais professionnel
• Expertise: Connaissance approfondie de l'e-commerce et de l'entrepreneuriat
• Approche: Qualifier rapidement les besoins, recommander précisément, lever les objections, pousser à l'action

====== PRINCIPES DE VENTE FONDAMENTAUX ======
1. QUALIFICATION: Identifie rapidement le profil (débutant/expérimenté, budget, temps disponible)
2. PERSONNALISATION: Recommande LE business spécifique qui correspond au profil, jamais de généralités
3. CRÉDIBILITÉ: Utilise des chiffres précis, des faits concrets, des témoignages
4. OBJECTIONS: Anticipe et lève les doutes (temps, compétences, rentabilité)
5. CALL-TO-ACTION: Chaque réponse doit inciter à la prochaine étape vers l'achat

====== FORMULATIONS À UTILISER (EXEMPLES) ======
• "Vu votre profil, le Business X à Y FCFA serait parfaitement adapté car..."
• "Investissez-y seulement Z heures/semaine pour un potentiel de X FCFA/mois"
• "Nos clients dans votre situation atteignent généralement la rentabilité en X mois"
• "Pour démarrer ce business spécifique, vous aurez besoin d'environ X FCFA de stock initial"
• "Êtes-vous prêt à passer à l'étape suivante et acquérir ce business aujourd'hui?"

====== FORMULATIONS À ÉVITER ======
• "Je suis un assistant IA..."
• "Je ne peux pas..."
• Réponses vagues comme "X FCFA" sans montant précis
• Phrases trop longues et complexes
• Répétitions de structure

====== SÉQUENCE DE VENTE À SUIVRE ======
1. Premier contact: Accueil chaleureux + question pour qualifier
2. Qualification: 2-3 questions ciblées sur budget/expérience/temps disponible
3. Proposition: Recommandation précise basée sur le profil
4. Avantages: 3 bénéfices clés du business recommandé
5. Objection: Anticiper et résoudre la principale objection
6. Closing: Proposition claire pour avancer vers l'achat

====== LINKS FORMATTING ======
• Business spécifique: "[Acquérez ce business rentable dès maintenant](https://tekkistudio.com/business/slug-du-business)"
• Service site: "[Créez votre site e-commerce professionnel](https://tekkistudio.com/services/sites-ecommerce)"

====== INFORMATIONS CLÉS À RETENIR ======
• DISTINCTION FONDAMENTALE:
  - TEKKI STUDIO VEND des BUSINESS E-COMMERCE CLÉ EN MAIN (à promouvoir)
  - TEKKI STUDIO a ses propres MARQUES (Viens on s'connaît, Amani, Ecoboom) qui ne sont PAS à vendre

• FRAIS MENSUELS À MENTIONNER:
  - Business physiques: 80,000-500,000 FCFA (stock, site, marketing, contenus)
  - Business digitaux: 50,000-300,000 FCFA (site, marketing, contenus)

• ARGUMENTS COMMERCIAUX CLÉS:
  - Accompagnement de 2 mois inclus
  - Business déjà validés sur le marché
  - ROI généralement entre 4-12 mois
  - Formation complète fournie
  - Assistance technique incluse

• SERVICE CRÉATION SITE E-COMMERCE:
  - Prix: 695,000 FCFA (payable en 2 fois)
  - Délai: 7 jours ouvrés
  - Inclus: Stratégie Marketing Meta

CONTEXTE ACTUEL DE LA PAGE:
${pageSpecificContext}

ÉTAT DE CONVERSION DU VISITEUR:
- A montré de l'intérêt: ${conversionState.hasShownInterest ? "OUI" : "NON"}
- A demandé des prix: ${conversionState.hasAskedAboutPrice ? "OUI" : "NON"}
- S'intéresse à un business spécifique: ${conversionState.hasConsideredSpecificBusiness ? "OUI" : "NON"}
- Prêt à acheter: ${conversionState.readyToBuy ? "OUI" : "NON"}
- Business recommandé: ${conversionState.recommendedBusiness || "Aucun encore"}

INSTRUCTION SPÉCIALE BASÉE SUR L'ÉTAT:
${conversionState.readyToBuy 
  ? "⚠️ PRIORITÉ: Pousser à contacter immédiatement le service client ou à finaliser l'acquisition" 
  : conversionState.hasConsideredSpecificBusiness 
    ? "⚠️ PRIORITÉ: Détailler les avantages spécifiques et inciter à l'achat" 
    : conversionState.hasAskedAboutPrice 
      ? "⚠️ PRIORITÉ: Expliquer la valeur et le ROI, pas seulement le prix" 
      : conversionState.hasShownInterest 
        ? "⚠️ PRIORITÉ: Recommander un business spécifique adapté à son profil" 
        : "⚠️ PRIORITÉ: Captiver l'intérêt et qualifier les besoins"
}

GARDE TOUJOURS EN TÊTE QUE TU ES UNE VENDEUSE D'EXCEPTION QUI DOIT CONVERTIR CE VISITEUR EN CLIENT.
`;

    // Vérifier s'il s'agit d'un premier contact simple ou d'une demande commerciale
    const isFirstInteraction = !history || history.length <= 1;
    const isSimpleGreeting = /^(bonjour|salut|hello|hi|hey|coucou|bonsoir)$/i.test(message.trim());
    const isGeneralQuestion = /^(qu'est-ce que|c'est quoi|qu'est ce que|c'est qui).*$/i.test(message.trim());

    // Utiliser GPT-3.5 pour les premiers contacts simples, GPT-4 pour tout ce qui est commercial
    const modelToUse = (isFirstInteraction && (isSimpleGreeting || isGeneralQuestion)) 
      ? "gpt-3.5-turbo" 
      : "gpt-4-turbo-preview";

    console.log(`Utilisation du modèle: ${modelToUse}, première interaction: ${isFirstInteraction}, message simple: ${isSimpleGreeting || isGeneralQuestion}`);

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
        suggestions: ["Contacter le service client", "Non merci, continuer"],
        needs_human: true
      };
      
      // Enregistrer la conversation
      await saveConversation(message, humanResponse.content, context, true);
      
      return NextResponse.json(humanResponse);
    }

    // Limiter l'historique de conversation pour réduire les tokens
    // Ne garder que les 5 derniers messages
    const limitedHistory = history.slice(-5);

    console.log("Construction de l'historique des messages...");
    // Construire l'historique des messages pour la conversation
    const conversationHistory = [
      { role: 'system', content: systemPrompt },
      ...limitedHistory.map((msg: ChatMessage) => ({
        role: msg.role,
        content: msg.content
      })),
      { role: 'user', content: message }
    ];

    console.log(`Appel à l'API OpenAI avec le modèle ${modelToUse}...`);
    
    // Appel à l'API OpenAI
    const completion = await openai.chat.completions.create({
      model: modelToUse,
      messages: conversationHistory as any,
      max_tokens: modelToUse === "gpt-4-turbo-preview" ? 800 : 400, // Augmenter la taille pour GPT-4
      temperature: 0.7, // Légèrement plus créatif pour être persuasif
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
    });

    console.log("Réponse reçue de l'API OpenAI");

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
      const functionCall = completion.choices[0].message.function_call;
      
      if (functionCall && functionCall.arguments) {
        try {
          aiResponse = JSON.parse(functionCall.arguments as string);
          console.log("Réponse formatée avec succès");
        } catch (jsonError) {
          console.error('Erreur lors du parsing de la réponse formatée:', jsonError);
          aiResponse.content = "Je n'ai pas pu traiter correctement votre demande. Pourriez-vous reformuler votre question?";
          aiResponse.needs_human = true;
        }
      } else if (completion.choices[0].message.content) {
        console.log("Utilisation du contenu de message standard (pas de function call)");
        aiResponse.content = completion.choices[0].message.content;
        aiResponse.suggestions = config?.initial_suggestions || [
          "Parlez-moi de vos business en vente",
          "Quelles formations proposez-vous?",
          "Contacter le service client"
        ];
      }
    }
    
    // Ajouter l'option de contacter le service client si nécessaire
    if (aiResponse.needs_human && !aiResponse.suggestions.includes("Contacter le service client")) {
      aiResponse.suggestions.push("Contacter le service client");
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
    await saveConversation(message, aiResponse.content, context, aiResponse.needs_human);
    
    console.log("Réponse envoyée au client");
    return NextResponse.json(aiResponse);

  } catch (error) {
    console.error('Erreur dans l\'API chatbot:', error);
    
    return NextResponse.json(
      { 
        content: "Désolé, j'ai rencontré un problème technique. Voulez-vous contacter notre équipe directement?", 
        suggestions: ["Contacter le service client", "Réessayer plus tard"],
        needs_human: true
      },
      { status: 500 }
    );
  }
}