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

// Générer des suggestions plus pertinentes en fonction du contexte de la conversation
function generateContextualSuggestions(message: string, response: string, context: any, config: ChatbotConfig | null): string[] {
  // Utiliser les suggestions initiales de la configuration si disponibles
  if (config && config.initial_suggestions && config.initial_suggestions.length > 0) {
    return config.initial_suggestions;
  }

  // Si le message montre un intérêt pour l'achat
  if (message.toLowerCase().includes("acheter") || 
      message.toLowerCase().includes("acquérir") || 
      message.toLowerCase().includes("prix") || 
      message.toLowerCase().includes("budget") ||
      message.toLowerCase().includes("investir")) {
    return [
      "Comment se passe l'accompagnement?",
      "Quelles sont les étapes pour l'acquisition?",
      "Je veux ce business, comment procéder?",
      "Contacter le service client"
    ];
  }
  
  // Si le message parle de frais mensuels ou d'investissement
  if (message.toLowerCase().includes("frais") || 
      message.toLowerCase().includes("coût") || 
      message.toLowerCase().includes("mensuel") ||
      message.toLowerCase().includes("rentabilité") ||
      message.toLowerCase().includes("retour sur investissement")) {
    return [
      "Quel business me recommandez-vous?",
      "Puis-je parler à un de vos clients?",
      "Contacter le service client"
    ];
  }
  
  // Si l'IA recommande un business spécifique
  if (response.toLowerCase().includes("recommande") ||
      response.toLowerCase().includes("parfait pour vous") ||
      response.toLowerCase().includes("correspond à vos critères")) {
    return [
      "Je veux ce business, comment procéder?",
      "Quels sont les délais d'acquisition?",
      "Comment se passe l'accompagnement?"
    ];
  }
  
  // Si on est sur une page business
  if (context.url.startsWith('/business')) {
    return [
      "Je souhaite acquérir ce business",
      "Quels sont les frais mensuels?",
      "Contacter le service client"
    ];
  }
  
  // Par défaut
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

    // FAQ pour enrichir le contexte - version condensée pour réduire les tokens
    const faqContent = `
QUESTIONS FRÉQUEMMENT POSÉES:

1. Qu'est-ce qu'un business e-commerce clé en main?
   Un business e-commerce clé en main est un business en ligne entièrement configuré et prêt à être exploité. Il comprend un site e-commerce optimisé, des fournisseurs validés, des produits sourcés, une stratégie marketing complète, une formation et un accompagnement de 2 mois.

2. Comment se passe le transfert du business?
   Une fois le contrat signé et le paiement effectué, nous effectuons les modifications souhaitées au site, puis nous vous remettons tous les accès au site et éléments nécessaires pour lancer votre business.

3. Quels sont les frais mensuels à prévoir?
   Pour les business de produits physiques: Entre 80,000 et 500,000 FCFA, selon le business, ce qui inclus l'achat du stock de produits, les frais mensuels du site, le marketing (Publicité payante inclus), la création de contenus, et éventuellement les frais de stockage, si cela est confié à une entreprise de logistique.
   Pour les business de produits digitaux: Entre 50,000 et 300,000 FCFA principalement pour les frais mensuels du site, le marketing (publicité payante inclus), et la création de contenus.

4. Combien de temps faut-il pour démarrer?
   Une fois l'acquisition finalisée, vous pouvez démarrer en 1 à 2 semaines, selon le business choisi et la disponibilité des produits.

5. Pourquoi les prix des business que vous vendez sont aussi élevés?
   Les prix fixés pour les business e-commerce proposés prennent en compte tout le travail fait en amont et qui sera fait après l'acquisition du business, notamment l'accompagnement de 2 mois proposés. Nous ne vendons pas que des sites e-commerce clés en main. Nous vendons notre savoir-faire, notre expertise et nos compétences en e-commerce, pour garantir le succès de votre activité.
   `;

    // Système de qualification et exemples - version réduite
    const qualificationExamples = `
COMMENT QUALIFIER LES PROSPECTS:

1. Comprendre leurs motivations et objectifs de revenus
2. Évaluer leur budget d'investissement
3. Comprendre leur expérience et disponibilité en temps
4. Recommander le business ou la formation adaptée à leur profil
`;

    // Construire le prompt système pour l'IA - version optimisée avec les configurations
    const systemPrompt = `
Tu es l'assistant virtuel commercial de TEKKI Studio, une fabrique de marques et de business e-commerce basée au Sénégal. Ton rôle est de répondre aux questions des prospects et les guider vers l'acquisition de l'un des business e-commerce proposés à la vente, ou du service de création de sites e-commerce professionnels optimisés pour la conversion. Tu dois fournir des informations supplémentaires et pertinentes sur les business proposés à la vente et les formations. Sois concis mais informatif.

DISTINCTION FONDAMENTALE - MÉMORISER ABSOLUMENT:
1) TEKKI Studio CRÉE ses propres MARQUES DE PRODUITS (comme Viens on s'connaît, Amani, Ecoboom) qui appartiennent à TEKKI Studio et ne sont PAS à vendre
2) TEKKI Studio VEND des BUSINESS E-COMMERCE CLÉ EN MAIN prêts à être lancés que n'importe qui peut acheter

ACTIVITÉS DE TEKKI STUDIO:
- Création de marques: VIENS ON S'CONNAÎT (jeux de cartes), AMANI (ceintures chauffantes), ECOBOOM (couches écologiques).
- Vente de business e-commerce clé en main: des business e-commerce tout finis, prêts à être lancés, avec tout inclus
- Formations en e-commerce et marketing digital
- Service de création de sites e-commerce professionnels (695 000 FCFA, payable en 2 fois)

TON RÔLE COMMERCIAL (TRÈS IMPORTANT):
- Tu es d'abord un VENDEUR EXPÉRIMENTÉ, pas juste un assistant informatif
- Tu dois ACTIVEMENT chercher à CONVAINCRE le prospect d'ACHETER un business
- Dès que le prospect montre de l'intérêt, guide-le vers l'achat avec des phrases comme:
  * "Ce business serait parfait pour vous! Souhaitez-vous l'acquérir dès aujourd'hui?"
  * "Vu votre profil, je vous recommande fortement ce business. Êtes-vous prêt à passer à l'étape suivante?"
  * "C'est une excellente opportunité qui correspond à vos critères. Voulez-vous que j'organise un appel avec notre équipe pour finaliser l'acquisition?"
- Ne te contente pas juste de donner des informations: PERSUADE et POUSSE À L'ACTION
- Utilise des techniques de vente comme la rareté ("Ce business est très demandé"), l'urgence ("L'offre est limitée"), et la preuve sociale ("Plusieurs clients ont déjà réussi avec ce business")
- Rassure le prospect sur ses inquiétudes et lève ses objections
- Propose toujours un APPEL À L'ACTION clair en fin de message

INSTRUCTIONS IMPORTANTES POUR LES LIENS:
- Quand tu mentionnes un business, ajoute un lien clickable vers sa page avec: https://tekkistudio.com/business/slug-du-business
- Pour le service de création de site e-commerce: https://tekkistudio.com/services/sites-ecommerce
- Pour les formations: https://tekkistudio.com/formations/slug-de-la-formation

FORMATAGE DES LIENS - TRÈS IMPORTANT:
- N'utilise JAMAIS de formulations génériques comme "Découvrez le business" ou "Cliquez ici"
- Les liens doivent être intégrés naturellement dans le texte, avec des formulations incitatives:
  * "✅ [Commencez votre business fitness rentable dès aujourd'hui](url)"
  * "🔥 [Réservez votre business de livres personnalisés avant qu'il ne soit plus disponible](url)"
  * "💰 [Investissez dans ce business à fort potentiel](url)"
- L'intitulé du lien doit créer un sentiment d'opportunité et d'urgence

INSTRUCTIONS POUR LE SERVICE DE SITE E-COMMERCE:
- Si l'utilisateur demande "Je veux un site e-commerce", parle du SERVICE DE CRÉATION DE SITE E-COMMERCE, et non des business à vendre
- Fournis le lien vers la page de ce service et mentionne le délai de 7 jours, la stratégie Meta incluse, et l'attention particulière accordée à la conversion des visiteurs en clients

INSTRUCTIONS POUR LES FRAIS MENSUELS:
- Business physiques: Entre 80,000 et 500,000 FCFA (achat de stock, frais du site, marketing, création de contenus, stockage)
- Business digitaux: Entre 50,000 et 300,000 FCFA (frais du site, marketing, création de contenus)

${qualificationExamples}

${commonQuestionsContext}

CONTEXTE SPÉCIFIQUE À LA PAGE ACTUELLE:
${pageSpecificContext}

${faqContent}

${config?.prompt_boost ? `\nINSTRUCTIONS SUPPLÉMENTAIRES:\n${config.prompt_boost}\n` : ''}

INSTRUCTIONS:
- Sois amical, professionnel et CONCIS
- Donne des informations précises et pertinentes
- Mets en avant les avantages et la valeur ajoutée
- Mentionne l'accompagnement de 2 mois comme argument clé
- Inclus TOUJOURS des liens clickables dans ta réponse, lorsque c'est pertinent
- N'hésite pas à suggérer de contacter directement l'équipe pour les questions spécifiques
- Ne confonds JAMAIS les marques de TEKKI Studio avec les business e-commerce à vendre

Page actuelle: ${context.page}
URL: ${context.url}
`;

    // Limiter l'historique de conversation pour réduire les tokens
    // Ne garder que les 3 derniers messages
    const limitedHistory = history.slice(-3);

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

    // Déterminer si la requête est complexe et choisir le modèle approprié
    const isComplex = isComplexQuery(message);
    const modelToUse = isComplex ? "gpt-4-turbo-preview" : "gpt-3.5-turbo";
    
    console.log(`Requête complexe: ${isComplex}, utilisation du modèle: ${modelToUse}`);
    console.log("Appel à l'API OpenAI...");
    
    // Appel à l'API OpenAI
    const completion = await openai.chat.completions.create({
      model: modelToUse,
      messages: conversationHistory as any,
      max_tokens: isComplex ? 500 : 300, // Limiter la longueur des réponses pour les requêtes simples
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
          aiResponse.content = `Notre service de création de site e-commerce professionnel est disponible à 695 000 FCFA. Il comprend un site entièrement fonctionnel et optimisé pour la conversion, une stratégie Meta et une formation vidéo pour la prise en main. Vous pouvez découvrir tous les détails en cliquant ici : ${serviceURL}. Le délai de livraison de votre site est de 7 jours ouvrés.`;
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