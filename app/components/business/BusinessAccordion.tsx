// app/components/business/BusinessAccordion.tsx
'use client';

import React, { useState } from 'react';
import { TrendingUp, Star, Award, DollarSign, CheckCircle2 } from 'lucide-react';
import { formatPrice } from '@/app/lib/utils/price-utils';
import useCountryStore from '@/app/hooks/useCountryStore';

interface BusinessAccordionProps {
  business: any;
  businessType: 'ecommerce' | 'digital' | 'physical';
}

const BusinessAccordion: React.FC<BusinessAccordionProps> = ({ business, businessType }) => {
  const [selectedTab, setSelectedTab] = useState<string>('analyse');
  const { currentCountry } = useCountryStore();
  
  // Fonction pour vérifier si un objet contient des données valides
  const hasContent = (obj: any) => {
    if (!obj) return false;
    return Object.values(obj).some(value => value && value !== "");
  };

  return (
    <div className="w-full">
      {/* Navigation par onglets - Simplifiée */}
      <div className="border-b border-gray-200 mb-6 overflow-x-auto">
        <nav className="flex whitespace-nowrap -mb-px">
          <button 
            onClick={() => setSelectedTab('analyse')}
            className={`py-4 px-6 font-medium text-sm border-b-2 mr-8 ${
              selectedTab === 'analyse' 
                ? 'border-tekki-blue text-tekki-blue' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Le marché
          </button>
          <button 
            onClick={() => setSelectedTab('produits')}
            className={`py-4 px-6 font-medium text-sm border-b-2 mr-8 ${
              selectedTab === 'produits' 
                ? 'border-tekki-blue text-tekki-blue' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Ce que vous vendez
          </button>
          <button 
            onClick={() => setSelectedTab('marketing')}
            className={`py-4 px-6 font-medium text-sm border-b-2 mr-8 ${
              selectedTab === 'marketing' 
                ? 'border-tekki-blue text-tekki-blue' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Comment attirer des clients
          </button>
          <button 
            onClick={() => setSelectedTab('financiers')}
            className={`py-4 px-6 font-medium text-sm border-b-2 ${
              selectedTab === 'financiers' 
                ? 'border-tekki-blue text-tekki-blue' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Comment gagner de l'argent
          </button>
        </nav>
      </div>

      {/* Contenu des onglets */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        {/* Analyse du marché - Simplifiée */}
        {selectedTab === 'analyse' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-tekki-blue mb-6">Le marché et ses clients</h2>
            
            {hasContent(business.market_analysis) ? (
              <div className="grid md:grid-cols-2 gap-8">
                {business.market_analysis.size && (
                  <div>
                    <h3 className="font-semibold mb-2">Taille du marché</h3>
                    <p className="text-gray-600">{business.market_analysis.size}</p>
                  </div>
                )}
                
                {business.market_analysis.growth && (
                  <div>
                    <h3 className="font-semibold mb-2">Potentiel de croissance</h3>
                    <p className="text-gray-600">{business.market_analysis.growth}</p>
                  </div>
                )}
                
                {business.market_analysis.competition && (
                  <div>
                    <h3 className="font-semibold mb-2">Concurrence locale</h3>
                    <p className="text-gray-600">{business.market_analysis.competition}</p>
                  </div>
                )}
                
                {business.market_analysis.opportunity && (
                  <div>
                    <h3 className="font-semibold mb-2">Pourquoi ça marche</h3>
                    <p className="text-gray-600">{business.market_analysis.opportunity}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold mb-2">Taille du marché</h3>
                  <p className="text-gray-600">
                    {businessType === 'digital' 
                      ? "Ce type de business attire de plus en plus de clients chaque année (+15%). Des millions de personnes cherchent ce genre de produits dans le monde entier."
                      : "Ce type de boutique en ligne attire de plus en plus d'acheteurs chaque année (+10%). Des centaines de milliers de personnes cherchent ces produits en Afrique francophone."}
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Face à la concurrence</h3>
                  <p className="text-gray-600">
                    {businessType === 'digital'
                      ? "Il n'y a pas beaucoup d'entreprises qui font la même chose (seulement 3 à 5). Votre offre sera différente et meilleure."
                      : "Il y a quelques boutiques similaires (5 à 10), mais votre boutique se distingue par sa qualité et son approche unique."}
                  </p>
                </div>
              </div>
            )}
            
            {/* Audience cible - si disponible */}
            {business.target_audience && (
              <div className="mt-8 bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg text-tekki-blue mb-4">Qui peut acheter ce business</h3>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-full md:w-1/3 flex justify-center">
                    <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
                  <div className="w-full md:w-2/3">
                    <p className="text-gray-700 mb-4">{business.target_audience}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Produit / Service - Simplifiée */}
        {selectedTab === 'produits' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-tekki-blue mb-6">Ce que vous vendez</h2>
            
            {hasContent(business.product_details) ? (
              <div className="grid md:grid-cols-2 gap-8">
                {business.product_details.type && (
                  <div>
                    <h3 className="font-semibold mb-2">Type de produits</h3>
                    <p className="text-gray-600">{business.product_details.type}</p>
                  </div>
                )}
                
                {business.product_details.margin && (
                  <div>
                    <h3 className="font-semibold mb-2">Bénéfice sur les ventes</h3>
                    <p className="text-gray-600">{business.product_details.margin}</p>
                  </div>
                )}
                
                {business.product_details.suppliers && (
                  <div>
                    <h3 className="font-semibold mb-2">Vos fournisseurs</h3>
                    <p className="text-gray-600">{business.product_details.suppliers}</p>
                  </div>
                )}
                
                {business.product_details.logistics && (
                  <div>
                    <h3 className="font-semibold mb-2">Livraison aux clients</h3>
                    <p className="text-gray-600">{business.product_details.logistics}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold mb-2">Description détaillée</h3>
                  <p className="text-gray-600">
                    {businessType === 'digital'
                      ? "Ce produit digital est facile à utiliser et offre des fonctions avancées que les clients adorent. Il répond parfaitement aux besoins des utilisateurs."
                      : "Cette boutique propose des produits choisis avec soin pour leur qualité. Chaque produit est testé avant d'être mis en vente."}
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Pourquoi vos clients l'achèteront</h3>
                  <p className="text-gray-600">
                    {businessType === 'digital'
                      ? "L'avantage principal est que tout est prêt à l'emploi sans connaissances techniques nécessaires. Notre formation vous aide à démarrer rapidement."
                      : "L'avantage principal est que votre marque est déjà connue et reconnue. Tous les processus sont déjà optimisés pour être rentables."}
                  </p>
                </div>
              </div>
            )}
            
            {/* Note supplémentaire sur le produit */}
            <div className="mt-8 bg-blue-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg text-tekki-blue mb-4">
                {businessType === 'physical' ? 'Liste des produits' : 'Guides et tutoriels'}
              </h3>
              <p className="text-gray-700 mb-4">
                {businessType === 'physical' 
                  ? "La liste complète des produits, avec les coordonnées des fournisseurs et toutes les informations sur les bénéfices, vous sera remise après l'achat."
                  : "Tous les guides d'utilisation, tutoriels et accès aux outils vous seront remis après l'achat."}
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span>
                    {businessType === 'physical'
                      ? "Fiches détaillées pour chaque produit"
                      : "Guide complet étape par étape"}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span>
                    {businessType === 'physical'
                      ? "Analyse du bénéfice pour chaque produit"
                      : "Guide pour gérer et améliorer votre business"}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span>
                    {businessType === 'physical'
                      ? "Comment négocier avec les fournisseurs"
                      : "Comment faire grandir votre business"}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Marketing - Simplifié */}
        {selectedTab === 'marketing' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-tekki-blue mb-6">Comment attirer des clients</h2>
            
            {hasContent(business.marketing_strategy) ? (
              <div className="grid md:grid-cols-2 gap-8">
                {business.marketing_strategy.channels && (
                  <div>
                    <h3 className="font-semibold mb-2">Où trouver vos clients</h3>
                    <p className="text-gray-600">
                      {Array.isArray(business.marketing_strategy.channels) 
                        ? business.marketing_strategy.channels.join(', ') 
                        : business.marketing_strategy.channels}
                    </p>
                  </div>
                )}
                
                {business.marketing_strategy.targetAudience && (
                  <div>
                    <h3 className="font-semibold mb-2">Qui sont vos clients</h3>
                    <p className="text-gray-600">{business.marketing_strategy.targetAudience}</p>
                  </div>
                )}
                
                {business.marketing_strategy.acquisitionCost && (
                  <div>
                    <h3 className="font-semibold mb-2">Coût pour attirer un client</h3>
                    <p className="text-gray-600">
                      {typeof business.marketing_strategy.acquisitionCost === 'number'
                        ? formatPrice(business.marketing_strategy.acquisitionCost)
                        : business.marketing_strategy.acquisitionCost}
                    </p>
                  </div>
                )}
                
                {business.marketing_strategy.conversionRate && (
                  <div>
                    <h3 className="font-semibold mb-2">Taux de visiteurs convertis</h3>
                    <p className="text-gray-600">{business.marketing_strategy.conversionRate}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold mb-2">Comment attirer l'attention</h3>
                  <p className="text-gray-600">
                    {businessType === 'digital'
                      ? "Pour attirer des clients, vous utiliserez des articles de blog, le référencement Google et des partenariats. Vous pourrez aussi faire des publicités ciblées sur Google et les réseaux sociaux."
                      : "Pour attirer des clients, vous utiliserez des influenceurs, des publicités sur les réseaux sociaux et le référencement Google. Des partenariats avec des influenceurs sont déjà en place."}
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Où vous vendrez</h3>
                  <p className="text-gray-600">
                    {businessType === 'digital'
                      ? "Vous vendrez principalement via votre site web et des plateformes spécialisées. Un système pour encourager les recommandations est aussi en place."
                      : "Vous vendrez exclusivement via votre site de vente en ligne, qui est déjà optimisé pour convertir les visiteurs en clients."}
                  </p>
                </div>
              </div>
            )}
            
            {/* Calendrier marketing */}
            <div className="mt-8 bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg text-tekki-blue mb-4">Votre plan pour les 3 premiers mois</h3>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">1</span>
                    <h4 className="font-medium">1er mois: Mise en route</h4>
                  </div>
                  <p className="text-gray-600 text-sm pl-10">
                    {businessType === 'digital'
                      ? "Installation des outils pour suivre les résultats, lancement des premières publicités, création de contenu pour attirer les clients."
                      : "Lancement des publicités sur Facebook et Instagram, création de contenu pour les réseaux sociaux, optimisation du site pour vendre plus."}
                  </p>
                </div>
                
                <div className="bg-white p-4 rounded border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold">2</span>
                    <h4 className="font-medium">2ème mois: Amélioration</h4>
                  </div>
                  <p className="text-gray-600 text-sm pl-10">
                    Analyse des premiers résultats, amélioration des publicités, tests pour voir ce qui fonctionne le mieux, optimisation du parcours d'achat.
                  </p>
                </div>
                
                <div className="bg-white p-4 rounded border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold">3</span>
                    <h4 className="font-medium">3ème mois: Expansion</h4>
                  </div>
                  <p className="text-gray-600 text-sm pl-10">
                    Augmentation du budget pour les publicités qui marchent bien, création de nouvelles campagnes, collaboration avec des influenceurs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Financier - Simplifié */}
        {selectedTab === 'financiers' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-tekki-blue mb-6">Comment gagner de l'argent</h2>
            
            {hasContent(business.financials) ? (
              <div className="grid md:grid-cols-2 gap-8">
                {business.financials.setupCost && (
                  <div>
                    <h3 className="font-semibold mb-2">Autres dépenses, après acquisition</h3>
                    <p className="text-gray-600">
                      {typeof business.financials.setupCost === 'number'
                        ? formatPrice(business.financials.setupCost)
                        : business.financials.setupCost}
                    </p>
                  </div>
                )}
                
                {business.financials.monthlyExpenses && (
                  <div>
                    <h3 className="font-semibold mb-2">Dépenses mensuelles estimées</h3>
                    <p className="text-gray-600">
                      {typeof business.financials.monthlyExpenses === 'number'
                        ? formatPrice(business.financials.monthlyExpenses)
                        : business.financials.monthlyExpenses}
                    </p>
                  </div>
                )}
                
                {business.financials.breakevenPoint && (
                  <div>
                    <h3 className="font-semibold mb-2">Temps estimé avant de récupérer votre investissement</h3>
                    <p className="text-gray-600">{business.financials.breakevenPoint}</p>
                  </div>
                )}
                
                {business.financials.roi && (
                  <div>
                    <h3 className="font-semibold mb-2">Temps estimé avant vos premiers bénéfices</h3>
                    <p className="text-gray-600">{business.financials.roi}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold mb-2">Comment vous gagnez de l'argent</h3>
                  <p className="text-gray-600">
                    {businessType === 'digital'
                      ? "Ce business génère de l'argent chaque mois grâce aux abonnements. Cette méthode vous assure des revenus stables et prévisibles."
                      : "Ce business génère de l'argent en vendant des produits avec un bénéfice de 50-60% par vente. En moyenne, chaque client dépense environ " + formatPrice(45000) + "."}
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Ce que vous pouvez gagner</h3>
                  <p className="text-gray-600">
                    D'après nos estimations, ce business peut vous rapporter {formatPrice(business.monthly_potential || 750000)} 
                    par mois après {business.roi_estimation_months ? `${business.roi_estimation_months} mois` : '6 mois'}, avec un bénéfice net de {business.net_margin || '30-40'}%.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Quand vous récupérez votre investissement</h3>
                  <p className="text-gray-600">
                    Si vous suivez bien nos conseils, vous devriez récupérer votre investissement en {business.roi_min || 4} à {business.roi_max || 6} mois. 
                    Notre accompagnement est là pour vous aider à atteindre cet objectif.
                  </p>
                </div>
              </div>
            )}
            
            {/* Ventilation des coûts - Simplifiée */}
            {business.monthly_costs_breakdown && (
              <div className="mt-8 bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg text-tekki-blue mb-4">Répartition de vos dépenses mensuelles</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span>Site web et outils</span>
                    </div>
                    <span className="font-semibold">{business.monthly_costs_breakdown.hosting || 15}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${business.monthly_costs_breakdown.hosting || 15}%` }}></div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span>Publicité</span>
                    </div>
                    <span className="font-semibold">{business.monthly_costs_breakdown.marketing || 40}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: `${business.monthly_costs_breakdown.marketing || 40}%` }}></div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <span>Achat de produits</span>
                    </div>
                    <span className="font-semibold">{business.monthly_costs_breakdown.stock || 35}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${business.monthly_costs_breakdown.stock || 35}%` }}></div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <span>Autres dépenses</span>
                    </div>
                    <span className="font-semibold">{business.monthly_costs_breakdown.other || 10}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{ width: `${business.monthly_costs_breakdown.other || 10}%` }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessAccordion;