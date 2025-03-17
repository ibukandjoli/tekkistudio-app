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

    // Construire le prompt système pour l'IA - version optimisée
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

TON RÔLE COMMERCIAL:
- Comprendre les besoins des prospects
- Qualifier le prospect (situation, budget, disponibilité, expérience)
- Recommander le business ou la formation adapté
- Répondre aux objections avec des arguments persuasifs
- Convaincre le prospect d'acquérir le business ou de s'inscrire à la formation
- Fournir des liens clickables vers les pages pertinentes

INSTRUCTIONS IMPORTANTES POUR LES LIENS:
- Quand tu mentionnes un business, ajoute un lien clickable vers sa page avec: https://tekkistudio.com/business/slug-du-business
- Pour le service de création de site e-commerce: https://tekkistudio.com/services/sites-ecommerce
- Pour les formations: https://tekkistudio.com/formations/slug-de-la-formation

INSTRUCTIONS POUR LE SERVICE DE SITE E-COMMERCE:
- Si l'utilisateur demande "Je veux un site e-commerce", parle du SERVICE DE CRÉATION DE SITE E-COMMERCE, et non des business à vendre
- Fournis le lien vers la page de ce service et mentionne le délai de 7 jours, la stratégie Meta incluse, et l'attention particulière accordée à la conversion des visiteurs en clients

INSTRUCTIONS POUR LES FRAIS MENSUELS:
- Business physiques: Entre 80,000 et 500,000 FCFA (achat de stock, frais du site, marketing, création de contenus, stockage)
- Business digitaux: Entre 50,000 et 300,000 FCFA (frais du site, marketing, création de contenus)

${qualificationExamples}

CONTEXTE SPÉCIFIQUE À LA PAGE ACTUELLE:
${pageSpecificContext}

${faqContent}

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
        aiResponse.suggestions = [
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

    // S'assurer qu'il y a toujours des suggestions utiles
    if (aiResponse.suggestions.length === 0) {
      if (context.url.startsWith('/business')) {
        aiResponse.suggestions = [
          "Quel business me recommandez-vous?",
          "Comment se passe l'accompagnement?",
          "Contacter le service client"
        ];
      } else if (context.url.startsWith('/formations')) {
        aiResponse.suggestions = [
          "Quelle formation me conviendrait?",
          "Comment se déroulent les formations?",
          "Contacter le service client"
        ];
      } else {
        aiResponse.suggestions = [
          "Parlez-moi de vos business en vente",
          "Quelles formations proposez-vous?",
          "Contacter le service client"
        ];
      }
    }

    // Pour la question "Je veux un site e-commerce clé en main", s'assurer que la réponse parle du service
    if (message.toLowerCase().includes("site e-commerce clé en main") && !context.url.startsWith('/business/')) {
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
    try {
      console.log("Enregistrement de la conversation dans Supabase...");
      const { data, error } = await supabase
        .from('chat_conversations')
        .insert([{
          user_message: message,
          assistant_response: aiResponse.content,
          page: context.page,
          url: context.url,
          needs_human: aiResponse.needs_human,
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