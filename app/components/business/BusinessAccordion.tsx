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
      {/* Navigation par onglets */}
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
            Analyse du marché
          </button>
          <button 
            onClick={() => setSelectedTab('produits')}
            className={`py-4 px-6 font-medium text-sm border-b-2 mr-8 ${
              selectedTab === 'produits' 
                ? 'border-tekki-blue text-tekki-blue' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Produit / Service
          </button>
          <button 
            onClick={() => setSelectedTab('marketing')}
            className={`py-4 px-6 font-medium text-sm border-b-2 mr-8 ${
              selectedTab === 'marketing' 
                ? 'border-tekki-blue text-tekki-blue' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Stratégie marketing
          </button>
          <button 
            onClick={() => setSelectedTab('financiers')}
            className={`py-4 px-6 font-medium text-sm border-b-2 ${
              selectedTab === 'financiers' 
                ? 'border-tekki-blue text-tekki-blue' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Financier
          </button>
        </nav>
      </div>

      {/* Contenu des onglets */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        {/* Analyse du marché */}
        {selectedTab === 'analyse' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-tekki-blue mb-6">Analyse du marché</h2>
            
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
                    <h3 className="font-semibold mb-2">Croissance</h3>
                    <p className="text-gray-600">{business.market_analysis.growth}</p>
                  </div>
                )}
                
                {business.market_analysis.competition && (
                  <div>
                    <h3 className="font-semibold mb-2">Concurrence</h3>
                    <p className="text-gray-600">{business.market_analysis.competition}</p>
                  </div>
                )}
                
                {business.market_analysis.opportunity && (
                  <div>
                    <h3 className="font-semibold mb-2">Opportunité</h3>
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
                      ? "Le marché des solutions digitales connaît une croissance annuelle de 15%. Notre étude révèle que le segment ciblé par ce business représente un marché de plus de 50 millions de clients potentiels à l'échelle mondiale."
                      : "Le marché du e-commerce connaît une croissance annuelle de 10%. Notre étude révèle que la niche ciblée par ce business représente un marché de plus de 200 000 clients potentiels en Afrique francophone."}
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Concurrence</h3>
                  <p className="text-gray-600">
                    {businessType === 'digital'
                      ? "L'analyse concurrentielle montre un marché encore peu saturé, avec 3-5 concurrents principaux. Aucun ne propose exactement la même offre, ce qui laisse un espace significatif pour ce business."
                      : "L'analyse concurrentielle montre une concurrence modérée, avec 5-10 acteurs principaux. Ce business se différencie par sa qualité supérieure et son positionnement unique."}
                  </p>
                </div>
              </div>
            )}
            
            {/* Audience cible - si disponible */}
            {business.target_audience && (
              <div className="mt-8 bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg text-tekki-blue mb-4">Audience cible</h3>
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

        {/* Produit / Service */}
        {selectedTab === 'produits' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-tekki-blue mb-6">Produit / Service</h2>
            
            {hasContent(business.product_details) ? (
              <div className="grid md:grid-cols-2 gap-8">
                {business.product_details.type && (
                  <div>
                    <h3 className="font-semibold mb-2">Type de produits/services</h3>
                    <p className="text-gray-600">{business.product_details.type}</p>
                  </div>
                )}
                
                {business.product_details.margin && (
                  <div>
                    <h3 className="font-semibold mb-2">Marge brute</h3>
                    <p className="text-gray-600">{business.product_details.margin}</p>
                  </div>
                )}
                
                {business.product_details.suppliers && (
                  <div>
                    <h3 className="font-semibold mb-2">Fournisseurs</h3>
                    <p className="text-gray-600">{business.product_details.suppliers}</p>
                  </div>
                )}
                
                {business.product_details.logistics && (
                  <div>
                    <h3 className="font-semibold mb-2">Logistique</h3>
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
                      ? "Cette solution digitale offre une interface intuitive et des fonctionnalités avancées qui la distinguent de la concurrence. Elle répond parfaitement aux besoins des utilisateurs cibles."
                      : "Ce business e-commerce propose des produits soigneusement sélectionnés pour leur qualité et leur attrait. Chaque produit est testé et validé avant d'être intégré au catalogue."}
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Avantages concurrentiels</h3>
                  <p className="text-gray-600">
                    {businessType === 'digital'
                      ? "Le principal avantage de ce business est sa solution clé en main qui ne nécessite aucune expertise technique. L'accompagnement inclus permet une prise en main rapide et efficace."
                      : "Le principal avantage de ce business est son positionnement unique et sa marque déjà établie. Les processus marketing et logistiques sont déjà optimisés pour une rentabilité maximale."}
                  </p>
                </div>
              </div>
            )}
            
            {/* Note supplémentaire sur le produit */}
            <div className="mt-8 bg-blue-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg text-tekki-blue mb-4">
                {businessType === 'physical' ? 'Catalogue produit' : 'Documentation technique'}
              </h3>
              <p className="text-gray-700 mb-4">
                {businessType === 'physical' 
                  ? "Le catalogue complet des produits, comprenant les références exactes, les fournisseurs, et les marges détaillées, sera fourni après acquisition."
                  : "La documentation technique complète, comprenant les accès aux outils, les guides d'utilisation et les manuels techniques, sera fournie après acquisition."}
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span>
                    {businessType === 'physical'
                      ? "Fiches produits détaillées avec spécifications techniques"
                      : "Documentation détaillée du système et de l'architecture"}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span>
                    {businessType === 'physical'
                      ? "Analyse de rentabilité par produit avec marges et coûts"
                      : "Guide d'administration et de maintenance complet"}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span>
                    {businessType === 'physical'
                      ? "Guide de négociation avec les fournisseurs"
                      : "Guides d'optimisation et de mise à l'échelle"}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Marketing */}
        {selectedTab === 'marketing' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-tekki-blue mb-6">Stratégie marketing</h2>
            
            {hasContent(business.marketing_strategy) ? (
              <div className="grid md:grid-cols-2 gap-8">
                {business.marketing_strategy.channels && (
                  <div>
                    <h3 className="font-semibold mb-2">Canaux de vente</h3>
                    <p className="text-gray-600">
                      {Array.isArray(business.marketing_strategy.channels) 
                        ? business.marketing_strategy.channels.join(', ') 
                        : business.marketing_strategy.channels}
                    </p>
                  </div>
                )}
                
                {business.marketing_strategy.targetAudience && (
                  <div>
                    <h3 className="font-semibold mb-2">Cible</h3>
                    <p className="text-gray-600">{business.marketing_strategy.targetAudience}</p>
                  </div>
                )}
                
                {business.marketing_strategy.acquisitionCost && (
                  <div>
                    <h3 className="font-semibold mb-2">Coût d'acquisition client</h3>
                    <p className="text-gray-600">
                      {typeof business.marketing_strategy.acquisitionCost === 'number'
                        ? formatPrice(business.marketing_strategy.acquisitionCost)
                        : business.marketing_strategy.acquisitionCost}
                    </p>
                  </div>
                )}
                
                {business.marketing_strategy.conversionRate && (
                  <div>
                    <h3 className="font-semibold mb-2">Taux de conversion</h3>
                    <p className="text-gray-600">{business.marketing_strategy.conversionRate}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold mb-2">Stratégie d'acquisition</h3>
                  <p className="text-gray-600">
                    {businessType === 'digital'
                      ? "La stratégie d'acquisition repose principalement sur le marketing de contenu, le SEO et les partenariats stratégiques. Des campagnes publicitaires ciblées sur Google et les réseaux sociaux sont également prévues."
                      : "La stratégie d'acquisition repose sur un mix de marketing d'influence, de publicités ciblées sur les réseaux sociaux et de SEO. Des partenariats avec des micro-influenceurs sont déjà en place."}
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Canaux de distribution</h3>
                  <p className="text-gray-600">
                    {businessType === 'digital'
                      ? "Le produit est distribué principalement via le site web et des places de marché spécialisées. Un système d'affiliation est également en place pour stimuler les ventes."
                      : "Les produits sont vendus exclusivement via le site e-commerce propriétaire, optimisé pour la conversion et l'expérience utilisateur."}
                  </p>
                </div>
              </div>
            )}
            
            {/* Calendrier marketing */}
            <div className="mt-8 bg-gray-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg text-tekki-blue mb-4">Calendrier marketing des 3 premiers mois</h3>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">1</span>
                    <h4 className="font-medium">Mois 1: Lancement</h4>
                  </div>
                  <p className="text-gray-600 text-sm pl-10">
                    {businessType === 'digital'
                      ? "Configuration des outils d'analyse, mise en place des premières campagnes marketing, création de contenu pour le blog et les réseaux sociaux."
                      : "Lancement des campagnes Facebook et Instagram ciblées, création de contenu pour les réseaux sociaux, optimisation du site pour la conversion."}
                  </p>
                </div>
                
                <div className="bg-white p-4 rounded border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold">2</span>
                    <h4 className="font-medium">Mois 2: Optimisation</h4>
                  </div>
                  <p className="text-gray-600 text-sm pl-10">
                    Analyse des performances, ajustement des audiences, tests A/B sur les annonces, optimisation du tunnel de conversion.
                  </p>
                </div>
                
                <div className="bg-white p-4 rounded border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold">3</span>
                    <h4 className="font-medium">Mois 3: Scaling</h4>
                  </div>
                  <p className="text-gray-600 text-sm pl-10">
                    Augmentation du budget publicitaire sur les campagnes performantes, développement de nouvelles campagnes, marketing d'influence.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Financier */}
        {selectedTab === 'financiers' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-tekki-blue mb-6">Aspects financiers</h2>
            
            {hasContent(business.financials) ? (
              <div className="grid md:grid-cols-2 gap-8">
                {business.financials.setupCost && (
                  <div>
                    <h3 className="font-semibold mb-2">Investissement initial</h3>
                    <p className="text-gray-600">
                      {typeof business.financials.setupCost === 'number'
                        ? formatPrice(business.financials.setupCost)
                        : business.financials.setupCost}
                    </p>
                  </div>
                )}
                
                {business.financials.monthlyExpenses && (
                  <div>
                    <h3 className="font-semibold mb-2">Charges mensuelles</h3>
                    <p className="text-gray-600">
                      {typeof business.financials.monthlyExpenses === 'number'
                        ? formatPrice(business.financials.monthlyExpenses)
                        : business.financials.monthlyExpenses}
                    </p>
                  </div>
                )}
                
                {business.financials.breakevenPoint && (
                  <div>
                    <h3 className="font-semibold mb-2">Point mort</h3>
                    <p className="text-gray-600">{business.financials.breakevenPoint}</p>
                  </div>
                )}
                
                {business.financials.roi && (
                  <div>
                    <h3 className="font-semibold mb-2">Retour sur investissement</h3>
                    <p className="text-gray-600">{business.financials.roi}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold mb-2">Modèle de revenus</h3>
                  <p className="text-gray-600">
                    {businessType === 'digital'
                      ? "Ce business génère des revenus récurrents grâce à un modèle d'abonnement mensuel ou annuel. Cette structure assure une prévisibilité des revenus et une croissance stable."
                      : "Ce business génère des revenus via la vente directe de produits avec une marge moyenne de 50-60%. Le panier moyen actuel est d'environ " + formatPrice(45000) + "."}
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Projections financières</h3>
                  <p className="text-gray-600">
                    Selon nos projections, ce business peut générer un chiffre d'affaires mensuel de {formatPrice(business.monthly_potential || 750000)} 
                    après {business.roi_estimation_months ? `${business.roi_estimation_months} mois` : '6 mois'} d'exploitation, avec une marge nette de {business.net_margin || '30-40'}%.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Retour sur investissement</h3>
                  <p className="text-gray-600">
                    Avec une exploitation optimale, le retour sur investissement est estimé entre {business.roi_min || 12} et {business.roi_max || 18} mois. 
                    Notre accompagnement est conçu pour vous aider à atteindre ces objectifs.
                  </p>
                </div>
              </div>
            )}
            
            {/* Ventilation des coûts */}
            {business.monthly_costs_breakdown && (
              <div className="mt-8 bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg text-tekki-blue mb-4">Ventilation des coûts mensuels estimés</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span>Hébergement et outils web</span>
                    </div>
                    <span className="font-semibold">{business.monthly_costs_breakdown.hosting || 15}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${business.monthly_costs_breakdown.hosting || 15}%` }}></div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span>Marketing et publicité</span>
                    </div>
                    <span className="font-semibold">{business.monthly_costs_breakdown.marketing || 40}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: `${business.monthly_costs_breakdown.marketing || 40}%` }}></div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <span>Stock de produits</span>
                    </div>
                    <span className="font-semibold">{business.monthly_costs_breakdown.stock || 35}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${business.monthly_costs_breakdown.stock || 35}%` }}></div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <span>Autres frais divers</span>
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