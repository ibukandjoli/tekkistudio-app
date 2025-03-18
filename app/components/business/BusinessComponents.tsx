// app/components/business/BusinessComponents.tsx
import React, { useState } from 'react';
import { 
  DollarSign, 
  Clock, 
  Award, 
  ThumbsUp, 
  Star, 
  Users, 
  TrendingUp, 
  BarChart, 
  Calendar, 
  Shield,
  CheckCircle2,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { 
  ROICalculatorProps, 
  KeyBenefitsProps, 
  FAQSectionProps, 
  KeyMetricsProps,
  SocialProofProps,
  ExclusiveOpportunityBannerProps,
  GuaranteeProps,
  AccompagnementTimelineProps
} from '@/app/types/database';
import { formatPrice, formatDiscount, calculateROI } from '@/app/lib/utils/price-utils';
import PriceFormatter from '../common/PriceFormatter';

// Composant pour l'opportunité exclusive - Redesign
const ExclusiveOpportunityBanner: React.FC<ExclusiveOpportunityBannerProps> = ({ interestedCount = 4 }) => (
  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-800 mb-4">
    <div className="flex items-center mb-2">
      <Star className="w-5 h-5 mr-2 text-blue-500 flex-shrink-0" />
      <span className="font-semibold">Opportunité unique : une seule acquisition possible</span>
    </div>
    <div className="flex items-center">
      <Users className="w-5 h-5 mr-2 text-blue-500 flex-shrink-0" />
      <span>
        Déjà <span className="font-bold">{interestedCount} prospects</span> intéressés
      </span>
    </div>
  </div>
);

// Composant pour l'intérêt social - Redesign
const SocialProof: React.FC<SocialProofProps> = ({ activeVisitors = 0, interestedCount = 0 }) => (
  <div className="bg-gray-50 rounded-lg p-4 mb-6">
    <div className="flex items-center mb-2">
      <Users className="w-5 h-5 text-[#0f4c81] mr-2 flex-shrink-0" />
      <span className="text-gray-700">
        <span className="font-bold text-[#0f4c81]">{activeVisitors} personnes</span> ont consulté ce business aujourd'hui
      </span>
    </div>
  </div>
);

// Composant pour la projection du ROI simplifié
const ROICalculator: React.FC<ROICalculatorProps> = ({ monthlyPotential, price, roiMonths }) => {
  // Calcul des valeurs clés
  const monthsToBreakEven = calculateROI(price, monthlyPotential);
  const annualRevenue = monthlyPotential * 12;
  
  return (
    <div className="bg-blue-50 rounded-lg p-6 mb-6">
      <h3 className="font-bold text-[#0f4c81] mb-4">Projection de revenus sur 12 mois</h3>
      
      {/* Graphique simplifié */}
      <div className="relative h-64 w-full bg-white rounded-lg p-4 mb-4">
        {/* Axe horizontal */}
        <div className="absolute bottom-8 left-0 right-0 h-px bg-gray-300"></div>
        
        {/* Axe vertical */}
        <div className="absolute left-16 bottom-8 top-4 w-px bg-gray-300"></div>
        
        {/* Ligne de projection */}
        <svg className="absolute inset-0 h-[calc(100%-2rem)] w-[calc(100%-4rem)] bottom-8 left-16" preserveAspectRatio="none">
          <line 
            x1="0" 
            y1="100%" 
            x2="100%" 
            y2="0" 
            stroke="#3b82f6" 
            strokeWidth="3"
            strokeDasharray="5,5" 
          />
        </svg>
        
        {/* Seuil de rentabilité */}
        <div 
          className="absolute left-16 right-0 border-t-2 border-dashed border-red-400 z-10"
          style={{ 
            bottom: `${8 + (1 - monthsToBreakEven/12) * (100 - 12)}%`, 
            display: monthsToBreakEven <= 12 ? 'block' : 'none' 
          }}
        >
          <div className="absolute -top-6 right-0 bg-red-100 text-red-800 px-2 py-1 rounded text-xs">
            Seuil de rentabilité ({monthsToBreakEven} mois)
          </div>
        </div>
        
        {/* Point de départ */}
        <div className="absolute bottom-8 left-16 w-3 h-3 bg-blue-500 rounded-full transform -translate-x-1.5 -translate-y-1.5"></div>
        
        {/* Point d'arrivée (12 mois) */}
        <div className="absolute top-4 right-0 w-3 h-3 bg-blue-500 rounded-full transform -translate-x-1.5 -translate-y-1.5">
          <div className="absolute -top-6 right-0 bg-white px-2 py-1 rounded border border-gray-200 text-xs whitespace-nowrap">
            <PriceFormatter amount={annualRevenue} />
          </div>
        </div>
        
        {/* Légende axe X */}
        <div className="absolute bottom-0 left-16 text-xs text-gray-500">Mois 1</div>
        <div className="absolute bottom-0 right-0 text-xs text-gray-500">Mois 12</div>
        
        {/* Légende axe Y */}
        <div className="absolute top-4 left-0 text-xs text-gray-500">
          <PriceFormatter amount={annualRevenue} />
        </div>
        <div className="absolute bottom-8 left-0 text-xs text-gray-500">0</div>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center text-sm gap-4">
        <div>
          <div className="font-medium mb-1">Investissement</div>
          <div className="text-xl font-bold text-[#0f4c81]">
            <PriceFormatter amount={price} />
          </div>
        </div>
        <div>
          <div className="font-medium mb-1">Revenus mensuels</div>
          <div className="text-xl font-bold text-green-600">
            <PriceFormatter amount={monthlyPotential} />
          </div>
        </div>
        <div>
          <div className="font-medium mb-1">Retour sur investissement</div>
          <div className="text-xl font-bold text-[#ff7f50]">{monthsToBreakEven} mois</div>
        </div>
      </div>
    </div>
  );
};

// Composant pour les avantages clés
const KeyBenefits: React.FC<KeyBenefitsProps> = ({ benefits }) => (
  <div className="grid md:grid-cols-3 gap-4 mb-8">
    {(benefits && benefits.length > 0) ? benefits.map((benefit, index) => (
      <div key={index} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex items-center mb-2">
          <ThumbsUp className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
          <h3 className="font-semibold text-[#0f4c81]">{benefit}</h3>
        </div>
      </div>
    )) : (
      <>
        <div className="bg-blue-50 p-6 rounded-lg">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
            <Clock className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-bold text-lg mb-2">Démarrage rapide</h3>
          <p className="text-gray-600">Lancez votre business en quelques jours, sans perdre de temps en développement.</p>
        </div>
        
        <div className="bg-green-50 p-6 rounded-lg">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <Users className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="font-bold text-lg mb-2">Accompagnement expert</h3>
          <p className="text-gray-600">Notre équipe vous guide pendant 2 mois pour assurer votre succès et votre autonomie.</p>
        </div>
        
        <div className="bg-purple-50 p-6 rounded-lg">
          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
            <TrendingUp className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="font-bold text-lg mb-2">Potentiel de croissance</h3>
          <p className="text-gray-600">Un business évolutif avec de solides perspectives de développement à long terme.</p>
        </div>
      </>
    )}
  </div>
);

// Composant pour la foire aux questions
const FAQSection: React.FC<FAQSectionProps> = ({ questions }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Si aucune question n'est fournie, utiliser des questions par défaut
  const defaultQuestions = [
    {
      question: "Combien de temps faut-il pour démarrer ce business ?",
      answer: "Une fois l'acquisition finalisée, vous pouvez démarrer en 1 à 2 semaines en fonction de votre disponibilité et du temps nécessaire pour commander le stock initial (pour les produits physiques)."
    },
    {
      question: "Comment se déroule l'accompagnement de 2 mois ?",
      answer: "Notre accompagnement consiste en un support continu pour vous aider à maîtriser tous les aspects de votre nouveau business, résoudre les eventuels problèmes, et générer vos premières ventes."
    },
    {
      question: "Quelles sont les compétences requises pour gérer ce business ?",
      answer: "Ce business est conçu pour être accessible aux débutants et intermédiaires. Des compétences de base en informatique et une volonté d'apprendre sont suffisantes. La formation vidéo que vous recevez après acquisition du business couvre tous les aspects techniques et opérationnels."
    }
  ];

  const faqItems = questions && Array.isArray(questions) && questions.length > 0 
    ? questions 
    : defaultQuestions;

  return (
    <div className="space-y-4 mb-8">
      <h3 className="text-xl font-bold text-[#0f4c81] mb-4">Questions fréquentes</h3>
      {faqItems.map((q, index) => (
        <div key={index} className="border rounded-lg overflow-hidden">
          <button 
            className="flex justify-between items-center w-full p-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors"
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
          >
            <span className="font-medium">{q.question}</span>
            <span>{openIndex === index ? '-' : '+'}</span>
          </button>
          {openIndex === index && (
            <div className="p-4 bg-white">
              <p className="text-gray-700">{q.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// Composant pour les statistiques importantes
const KeyMetrics: React.FC<KeyMetricsProps> = ({ business }) => {
  // Extraction des valeurs avec fallback
  const timeRequired = business.time_required_weekly || 10; // Valeur par défaut
  const roiEstimation = business.roi_estimation_months || 6; // Valeur par défaut
  const skillLevel = business.skill_level_required || 'Débutant'; // Valeur par défaut
  const margin = business.product_details?.margin || '60%';
  
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 text-center">
        <DollarSign className="w-8 h-8 mx-auto mb-2 text-green-500" />
        <div className="text-sm text-gray-500">Marge brute</div>
        <div className="text-xl font-bold text-[#0f4c81]">{margin}</div>
      </div>
      
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 text-center">
        <Clock className="w-8 h-8 mx-auto mb-2 text-blue-500" />
        <div className="text-sm text-gray-500">Temps requis</div>
        <div className="text-xl font-bold text-[#0f4c81]">{timeRequired}h/sem</div>
      </div>
      
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 text-center">
        <BarChart className="w-8 h-8 mx-auto mb-2 text-[#ff7f50]" />
        <div className="text-sm text-gray-500">ROI estimé</div>
        <div className="text-xl font-bold text-[#0f4c81]">{roiEstimation} mois</div>
      </div>
      
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 text-center">
        <Award className="w-8 h-8 mx-auto mb-2 text-purple-500" />
        <div className="text-sm text-gray-500">Niveau requis</div>
        <div className="text-xl font-bold text-[#0f4c81]">{skillLevel}</div>
      </div>
    </div>
  );
};

// Composant de garantie
const Guarantee: React.FC<GuaranteeProps> = () => (
  <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm flex items-start gap-4 mb-6 mt-6">
    <Shield className="w-10 h-10 text-green-500 flex-shrink-0" />
    <div>
      <h3 className="font-bold text-lg text-[#0f4c81] mb-2">Notre garantie d'accompagnement</h3>
      <p className="text-gray-600 mb-2">
        Nous nous engageons à vous accompagner pendant 2 mois complets pour assurer votre succès. 
        Si vous n'êtes pas satisfait.e de notre accompagnement, nous prolongerons gratuitement la période pour un mois supplémentaire.
      </p>
      <div className="text-sm font-medium text-[#ff7f50]">* Voir conditions dans le contrat</div>
    </div>
  </div>
);

// Composant pour la barre de progression d'accompagnement
const AccompagnementTimeline: React.FC<AccompagnementTimelineProps> = () => (
  <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-6">
    <h3 className="text-xl font-bold text-[#0f4c81] mb-4">Notre accompagnement de 2 mois</h3>
    
    <div className="relative pb-12">
      {/* Ligne verticale */}
      <div className="absolute top-0 left-6 bottom-0 w-0.5 bg-gray-200"></div>
      
      {/* Phase 1 */}
      <div className="relative flex items-start mb-6">
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#0f4c81] flex items-center justify-center z-10">
          <span className="text-white font-bold">1</span>
        </div>
        <div className="ml-4 pt-2">
          <h4 className="font-bold text-[#0f4c81]">Semaines 1-2: Lancement</h4>
          <p className="mt-1 text-gray-600">Prise en main du site, négociation avec les fournisseurs, si applicable, préparation du stock initial, lancement des activités</p>
        </div>
      </div>
      
      {/* Phase 2 */}
      <div className="relative flex items-start mb-6">
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#0f4c81] flex items-center justify-center z-10">
          <span className="text-white font-bold">2</span>
        </div>
        <div className="ml-4 pt-2">
          <h4 className="font-bold text-[#0f4c81]">Semaines 3-4: Marketing initial</h4>
          <p className="mt-1 text-gray-600">Lancement des premières campagnes publicitaires, optimisation du site pour la conversion, gestion des éventuels problèmes</p>
        </div>
      </div>
      
      {/* Phase 3 */}
      <div className="relative flex items-start mb-6">
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#0f4c81] flex items-center justify-center z-10">
          <span className="text-white font-bold">3</span>
        </div>
        <div className="ml-4 pt-2">
          <h4 className="font-bold text-[#0f4c81]">Semaines 5-6: Scaling</h4>
          <p className="mt-1 text-gray-600">Analyse des performances, ajustement des campagnes, optimisation des marges</p>
        </div>
      </div>
      
      {/* Phase 4 */}
      <div className="relative flex items-start">
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#0f4c81] flex items-center justify-center z-10">
          <span className="text-white font-bold">4</span>
        </div>
        <div className="ml-4 pt-2">
          <h4 className="font-bold text-[#0f4c81]">Semaines 7-8: Autonomisation</h4>
          <p className="mt-1 text-gray-600">Support pour la gestion autonome, planification à long terme, stratégies d'expansion</p>
        </div>
      </div>
    </div>
  </div>
);

// Composant de bannière de prix
const PriceBanner: React.FC<{
  price: number;
  originalPrice: number;
  monthlyPotential: number;
  onButtonClick: () => void;
}> = ({ price, originalPrice, monthlyPotential, onButtonClick }) => {
  const discount = originalPrice - price;
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      {discount > 0 && (
        <div className="text-center mb-3">
          <div className="inline-block bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-bold">
            Économisez <PriceFormatter amount={discount} />
          </div>
        </div>
      )}
      
      <div className="text-center mb-4">
        {originalPrice > price && (
          <div className="text-gray-400 line-through mb-1">
            <PriceFormatter amount={originalPrice} />
          </div>
        )}
        <div className="text-3xl font-bold text-[#0f4c81] mb-2">
          <PriceFormatter amount={price} />
        </div>
        <div className="text-gray-600 bg-blue-50 p-2 rounded-lg inline-block">
          Potentiel mensuel: <span className="font-bold"><PriceFormatter amount={monthlyPotential} /></span>
        </div>
      </div>
      
      <button 
        onClick={onButtonClick}
        className="w-full bg-[#ff7f50] text-white py-4 rounded-lg hover:bg-[#ff6b3d] transition-colors mb-4 font-bold text-lg flex items-center justify-center"
      >
        <span>Je veux ce business</span>
        <ArrowRight className="w-5 h-5 ml-2" />
      </button>
      
      <div className="text-center text-sm text-gray-500 mb-6">
        Paiement en plusieurs fois possible
      </div>
    </div>
  );
};

// Composant pour les avantages inclus
const IncludedFeatures: React.FC<{ features?: string[] }> = ({ features }) => {
  const defaultFeatures = [
    "Site e-commerce prêt à être lancé",
    "Stratégie marketing complète",
    "Accompagnement de 2 mois inclus",
    "Formation à la gestion du business"
  ];
  
  const displayFeatures = features && features.length > 0 ? features : defaultFeatures;
  
  return (
    <div className="space-y-3">
      {displayFeatures.map((feature, index) => (
        <div key={index} className="flex items-start gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
          <span className="text-gray-700">{feature}</span>
        </div>
      ))}
    </div>
  );
};

// Composant pour le disclaimer des projections
const ProjectionDisclaimer: React.FC = () => (
  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3 mb-6">
    <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-1" />
    <div>
      <p className="text-sm text-yellow-800">
        <span className="font-bold">Remarque importante:</span> Ces projections sont basées sur nos études de marché et analyses sectorielles. Les résultats réels peuvent varier en fonction de multiples facteurs, dont votre investissement en temps, en marketing et les conditions du marché.
      </p>
    </div>
  </div>
);

export {
  ROICalculator,
  KeyBenefits,
  FAQSection,
  SocialProof,
  ExclusiveOpportunityBanner,
  KeyMetrics,
  Guarantee,
  AccompagnementTimeline,
  PriceBanner,
  IncludedFeatures,
  ProjectionDisclaimer
};