// app/business/[slug]/page.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft,
  CheckCircle2,
  ArrowRight,
  Plus,
  Minus
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import BusinessGallery from '../../components/business/BusinessGallery';
import InterestModal from '../../components/business/InterestModal';
import { formatPrice } from '@/app/lib/utils/price-utils';
import type { Business } from '@/app/types/database';
import CurrencySelector from '@/app/components/common/CurrencySelector';

// Import des composants avec leurs types corrigés
import {
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
} from '../../components/business/BusinessComponents';

// Composant principal amélioré
export default function BusinessPage() {
  const params = useParams();
  const currentSlug = params.slug as string;
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSticky, setIsSticky] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<string>('analyse');
  const [selectedAcquisitionOption, setSelectedAcquisitionOption] = useState<'standard' | 'progressive'>('standard');
  const ctaRef = useRef<HTMLDivElement>(null);
  
  // Valeurs dynamiques ou valeurs par défaut
  const [activeVisitors, setActiveVisitors] = useState<number>(0);
  const [interestedCount, setInterestedCount] = useState<number>(0);
  const [showFAQDetails, setShowFAQDetails] = useState<{ [key: string]: boolean }>({});

  // Calculer le prix d'entrée (40% du prix total)
  const calculateEntryPrice = (price: number) => {
    return Math.round(price * 0.4);
  };

  // Calculer la mensualité (10% du prix total + 1000 FCFA)
  const calculateMonthlyPayment = (price: number) => {
    return Math.round(price * 0.1) + 5000;
  };

  // Simuler un intérêt croissant avec un timer
  useEffect(() => {
    // Si les valeurs sont fournies par la base de données, les utiliser
    // Sinon, utiliser des valeurs par défaut aléatoires
    if (business) {
      setActiveVisitors(business.active_viewers_count || Math.floor(Math.random() * 10) + 8);
      setInterestedCount(5); // Valeur par défaut
    }
    
    const interval = setInterval(() => {
      // 30% de chance de changer le nombre de visiteurs actifs
      if (Math.random() > 0.7) {
        setActiveVisitors(prev => {
          const change = Math.floor(Math.random() * 3) - 1; // -1, 0, ou 1
          return Math.max(5, Math.min(20, prev + change)); // Min 5, Max 20
        });
      }
    }, 30000); // Toutes les 30 secondes
    
    return () => clearInterval(interval);
  }, [business]);

  // Gestion du CTA sticky
  useEffect(() => {
    const handleScroll = () => {
      if (ctaRef.current) {
        const rect = ctaRef.current.getBoundingClientRect();
        setIsSticky(rect.top <= 0);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    async function fetchBusiness() {
      try {
        console.log("Récupération du business avec slug:", currentSlug);
        
        const { data, error } = await supabase
          .from('businesses')
          .select('*')
          .eq('slug', currentSlug)
          .single();

        if (error) {
          console.error("Erreur lors de la récupération du business:", error);
          setError("Ce business n'a pas été trouvé");
          return;
        }
        
        console.log("Business récupéré:", data);
        setBusiness(data as Business);
      } catch (err) {
        console.error('Erreur lors du chargement du business:', err);
        setError("Une erreur est survenue lors du chargement des données");
      } finally {
        setLoading(false);
      }
    }

    fetchBusiness();
  }, [currentSlug]);

  useEffect(() => {
    async function fetchBusiness() {
      try {
        console.log("Récupération du business avec slug:", currentSlug);
        
        const { data, error } = await supabase
          .from('businesses')
          .select('*')
          .eq('slug', currentSlug)
          .single();
  
        if (error) {
          console.error("Erreur lors de la récupération du business:", error);
          setError("Ce business n'a pas été trouvé");
          return;
        }
        
        console.log("Business récupéré:", data);
        setBusiness(data as Business);
        
        // Vérifier si un paramètre showInterest est présent dans l'URL (pour les redirections depuis le chat)
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('showInterest') === 'true') {
          // Ouvrir le modal d'acquisition automatiquement après un court délai
          setTimeout(() => {
            setIsModalOpen(true);
          }, 500);
        }
      } catch (err) {
        console.error('Erreur lors du chargement du business:', err);
        setError("Une erreur est survenue lors du chargement des données");
      } finally {
        setLoading(false);
      }
    }
  
    fetchBusiness();
  }, [currentSlug]);

  // Gérer l'affichage des détails de la FAQ
  const toggleFAQDetail = (id: string) => {
    setShowFAQDetails(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Afficher un état de chargement
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ff7f50]"></div>
      </div>
    );
  }

  // Si le business n'existe pas, afficher une page d'erreur
  if (error || !business) {
    return (
      <div className="container mx-auto px-4 py-20 min-h-screen">
        <h1 className="text-2xl font-bold text-[#0f4c81] mb-4">
          {error || "Business non trouvé"}
        </h1>
        <Link href="/business" className="text-[#ff7f50] hover:underline">
          Retour aux business en vente
        </Link>
      </div>
    );
  }

  // Les questions spécifiques au nouveau modèle d'acquisition
  const progressiveAcquisitionFAQs = [
    {
      id: 'progressive-how',
      question: "Comment fonctionne l'acquisition progressive ?",
      answer: "L'acquisition progressive vous permet de démarrer avec seulement 40% du prix total. Vous versez ensuite 10% + 5000 FCFA du prix total chaque mois pendant 6 mois. Vous pouvez gérer et développer le business dès l'apport initial, mais le transfert complet de propriété n'est effectué qu'après le dernier versement."
    },
    {
      id: 'progressive-use',
      question: "Puis-je utiliser le business pendant la période de paiement ?",
      answer: "Oui, dès votre apport initial de 40%, vous avez accès au business et pouvez commencer à le développer et à générer des revenus. Vous bénéficiez de notre accompagnement renforcé de 3 mois pour maximiser vos chances de succès."
    },
    {
      id: 'progressive-default',
      question: "Que se passe-t-il en cas de défaut de paiement ?",
      answer: "En cas de retard de paiement, vos accès au business sont temporairement suspendus. Si le retard n'est pas régularisé sous 30 jours, le business pourra être remis en vente. Les versements déjà effectués ne sont pas remboursables, conformément aux conditions générales d'acquisition."
    }
  ];

  return (
    <main className="pt-20">
      {/* Navigation */}
      <div className="bg-gray-50 border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/business" className="flex items-center text-[#0f4c81] hover:text-[#ff7f50]">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour aux business en vente
          </Link>
        </div>
      </div>

      {/* CTA sticky (apparaît lors du défilement) */}
      {isSticky && (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t z-50 py-3 transform transition-transform">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-[#0f4c81]">{business.name}</h3>
              <div className="text-[#ff7f50] font-bold">
                {selectedAcquisitionOption === 'progressive' 
                  ? `À partir de ${formatPrice(calculateEntryPrice(business.price))}` 
                  : formatPrice(business.price)
                }
              </div>
            </div>
            <button 
              className="bg-[#ff7f50] text-white px-6 py-3 rounded-lg hover:bg-[#ff6b3d] transition-colors"
              onClick={() => setIsModalOpen(true)}
            >
              Je le prends
            </button>
          </div>
        </div>
      )}

      {/* Sélecteur de devise */}
      <CurrencySelector />

      {/* En-tête du business */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="lg:w-2/3">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-[#ff7f50] text-white px-3 py-1 rounded-full text-sm">
                  {business.category}
                </span>
                <span className={`${
                  business.type === 'digital' ? 'bg-blue-500' : 'bg-green-500'
                } text-white px-3 py-1 rounded-full text-sm`}>
                  {business.type === 'digital' ? 'Digital' : 'Physique'}
                </span>
              </div>
              <h1 className="text-4xl font-bold text-[#0f4c81] mb-4">{business.name}</h1>
              <p className="text-xl text-gray-600 mb-6">{business.pitch}</p>
              
              {/* Affichage du carousel d'images dès le début */}
              <BusinessGallery images={business.images} className="mb-6" />
              
              <div className="text-gray-600 mb-8 mt-8">
                {business.description.split('\n\n').map((paragraph, i) => (
                  <p key={i} className="mb-4">{paragraph}</p>
                ))}
              </div>
              
              {/* Indicateurs clés */}
              <KeyMetrics business={business} />
            </div>
            
            <div className="lg:w-1/3" ref={ctaRef}>
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                {/* Informations de prix avant l'opportunité unique */}
                <PriceBanner 
                  price={business.price}
                  originalPrice={business.original_price}
                  monthlyPotential={business.monthly_potential}
                  onButtonClick={() => setIsModalOpen(true)}
                  entryPrice={calculateEntryPrice(business.price)}
                  showEntryPrice={true}
                />
                
                <ExclusiveOpportunityBanner interestedCount={interestedCount} />
                
                <SocialProof activeVisitors={activeVisitors} interestedCount={interestedCount} />
                
                <IncludedFeatures features={business.includes?.slice(0, 4)} />
                
                <Guarantee />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Options d'acquisition */}
      <section className="py-12 bg-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-[#0f4c81] mb-6 text-center">Options d'acquisition</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Option standard */}
            <div className={`bg-white rounded-xl shadow p-6 border-2 transition-all ${
              selectedAcquisitionOption === 'standard' ? 'border-[#0f4c81] transform scale-105' : 'border-transparent'
            }`}>
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-[#0f4c81]">Acquisition Complète</h3>
                <button 
                  onClick={() => setSelectedAcquisitionOption('standard')}
                  className={`rounded-full p-2 ${
                    selectedAcquisitionOption === 'standard' 
                    ? 'bg-[#0f4c81] text-white' 
                    : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {selectedAcquisitionOption === 'standard' ? <CheckCircle2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </button>
              </div>
              
              <div className="mb-4">
                <div className="text-3xl font-bold text-[#0f4c81]">{formatPrice(business.price)}</div>
                <div className="text-gray-500 line-through">{formatPrice(business.original_price)}</div>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Transfert immédiat de propriété</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Paiement en 1 à 3 fois</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span>2 mois d'accompagnement inclus</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Tous les éléments du business livrés immédiatement</span>
                </div>
              </div>
              
              <button
                onClick={() => {
                  setSelectedAcquisitionOption('standard');
                  setIsModalOpen(true);
                }}
                className="w-full bg-[#0f4c81] text-white py-3 rounded-lg hover:bg-[#0a3c67] transition-colors"
              >
                Acquérir avec cette option
              </button>
            </div>
            
            {/* Option progressive */}
            <div className={`bg-white rounded-xl shadow p-6 border-2 transition-all relative overflow-hidden ${
              selectedAcquisitionOption === 'progressive' ? 'border-[#ff7f50] transform scale-105' : 'border-transparent'
            }`}>
              <div className="absolute -right-10 top-5 bg-[#ff7f50] text-white px-10 py-1 transform rotate-45">
                NOUVEAU
              </div>
              
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-[#ff7f50]">Acquisition Progressive</h3>
                <button 
                  onClick={() => setSelectedAcquisitionOption('progressive')}
                  className={`rounded-full p-2 ${
                    selectedAcquisitionOption === 'progressive' 
                    ? 'bg-[#ff7f50] text-white' 
                    : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {selectedAcquisitionOption === 'progressive' ? <CheckCircle2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </button>
              </div>
              
              <div className="mb-4">
                <div className="text-3xl font-bold text-[#ff7f50]">
                  À partir de {formatPrice(calculateEntryPrice(business.price))}
                </div>
                <div className="text-gray-700">
                  + {formatPrice(calculateMonthlyPayment(business.price))} / mois pendant 6 mois
                </div>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Démarrez avec seulement 40% du prix</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Versements mensuels de 10% + 5000F (7€) pendant 6 mois</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span><strong>3 mois</strong> d'accompagnement inclus</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Transférez votre business en douceur</span>
                </div>
              </div>
              
              <button
                onClick={() => {
                  setSelectedAcquisitionOption('progressive');
                  setIsModalOpen(true);
                }}
                className="w-full bg-[#ff7f50] text-white py-3 rounded-lg hover:bg-[#ff6b3d] transition-colors"
              >
                Acquérir avec cette option
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Notre accompagnement */}
      <section className="py-12 bg-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-[#0f4c81] mb-6 text-center">Notre accompagnement complet</h2>
          <div className="max-w-4xl mx-auto">
            <AccompagnementTimeline />
          </div>
        </div>
      </section>

      {/* Onglets de contenu détaillé */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="border-b border-gray-200 mb-6 overflow-x-auto">
            <nav className="flex whitespace-nowrap -mb-px">
              <button 
                onClick={() => setSelectedTab('analyse')}
                className={`py-4 px-6 font-medium text-sm border-b-2 mr-8 ${
                  selectedTab === 'analyse' 
                    ? 'border-[#0f4c81] text-[#0f4c81]' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Analyse du marché
              </button>
              <button 
                onClick={() => setSelectedTab('produits')}
                className={`py-4 px-6 font-medium text-sm border-b-2 mr-8 ${
                  selectedTab === 'produits' 
                    ? 'border-[#0f4c81] text-[#0f4c81]' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Détails produits
              </button>
              <button 
                onClick={() => setSelectedTab('marketing')}
                className={`py-4 px-6 font-medium text-sm border-b-2 mr-8 ${
                  selectedTab === 'marketing' 
                    ? 'border-[#0f4c81] text-[#0f4c81]' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Stratégie marketing
              </button>
              <button 
                onClick={() => setSelectedTab('financiers')}
                className={`py-4 px-6 font-medium text-sm border-b-2 ${
                  selectedTab === 'financiers' 
                    ? 'border-[#0f4c81] text-[#0f4c81]' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Aspects financiers
              </button>
            </nav>
          </div>

          {/* Contenu des onglets */}
          <div className="bg-white rounded-xl p-8 shadow-sm">
            {selectedTab === 'analyse' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-[#0f4c81] mb-6">Analyse du marché</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-semibold mb-2">Taille du marché</h3>
                    <p className="text-gray-600">{business.market_analysis?.size || "Informations non disponibles"}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Croissance</h3>
                    <p className="text-gray-600">{business.market_analysis?.growth || "Informations non disponibles"}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Concurrence</h3>
                    <p className="text-gray-600">{business.market_analysis?.competition || "Informations non disponibles"}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Opportunité</h3>
                    <p className="text-gray-600">{business.market_analysis?.opportunity || "Informations non disponibles"}</p>
                  </div>
                </div>
                
                {/* Audience cible */}
                <div className="mt-8 bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-lg text-[#0f4c81] mb-4">Audience cible</h3>
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="w-full md:w-1/3 flex justify-center">
                      <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    </div>
                    <div className="w-full md:w-2/3">
                      <p className="text-gray-700 mb-4">{business.target_audience || "Informations non disponibles"}</p>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white p-3 rounded border border-gray-200">
                          <div className="text-sm font-medium text-gray-500">Âge moyen</div>
                          <div className="font-semibold">25-45 ans</div>
                        </div>
                        <div className="bg-white p-3 rounded border border-gray-200">
                          <div className="text-sm font-medium text-gray-500">Niveau socio-économique</div>
                          <div className="font-semibold">Moyen à élevé</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'produits' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-[#0f4c81] mb-6">Détails produits</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-semibold mb-2">Type de produits</h3>
                    <p className="text-gray-600">{business.product_details?.type || "Informations non disponibles"}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Marge brute</h3>
                    <p className="text-gray-600">{business.product_details?.margin || "Informations non disponibles"}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Fournisseurs</h3>
                    <p className="text-gray-600">{business.product_details?.suppliers || "Informations non disponibles"}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Logistique</h3>
                    <p className="text-gray-600">{business.product_details?.logistics || "Informations non disponibles"}</p>
                  </div>
                </div>
                
                {/* Note concernant les produits */}
                <div className="mt-8 bg-blue-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-lg text-[#0f4c81] mb-4">Catalogue produit</h3>
                  <p className="text-gray-700 mb-4">
                    Le catalogue complet des produits, comprenant les références exactes, les fournisseurs, et les marges détaillées, sera fourni après manifestation d'intérêt. Vous recevrez également un accès à notre dossier complet de sourcing, qui inclut :
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                      <span>Fiches produits détaillées avec spécifications techniques</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                      <span>Analyse de rentabilité par produit avec marges et coûts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                      <span>Guide de négociation avec les fournisseurs</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                      <span>Tendances du marché et recommandations de stock initial</span>
                    </li>
                  </ul>
                  <div className="mt-4 flex justify-center">
                    <button 
                      onClick={() => setIsModalOpen(true)}
                      className="bg-[#0f4c81] text-white px-6 py-2 rounded-lg hover:bg-[#0a3c67] transition-colors font-medium"
                    >
                      Obtenir le catalogue complet
                    </button>
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'marketing' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-[#0f4c81] mb-6">Stratégie marketing</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-semibold mb-2">Canaux de vente</h3>
                    <p className="text-gray-600">
                      {Array.isArray(business.marketing_strategy?.channels) 
                        ? business.marketing_strategy?.channels.join(', ') 
                        : business.marketing_strategy?.channels || "Informations non disponibles"}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Cible</h3>
                    <p className="text-gray-600">{business.marketing_strategy?.targetAudience || "Informations non disponibles"}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Coût d'acquisition client</h3>
                    <p className="text-gray-600">{business.marketing_strategy?.acquisitionCost || "Informations non disponibles"}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Taux de conversion</h3>
                    <p className="text-gray-600">{business.marketing_strategy?.conversionRate || "Informations non disponibles"}</p>
                  </div>
                </div>
                
                {/* Calendrier marketing */}
                <div className="mt-8 bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-lg text-[#0f4c81] mb-4">Calendrier marketing des 3 premiers mois</h3>
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded border border-gray-200">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">1</span>
                        <h4 className="font-medium">Mois 1: Lancement</h4>
                      </div>
                      <p className="text-gray-600 text-sm pl-10">
                        Lancement des campagnes Facebook et Instagram ciblées, création de contenu pour les réseaux sociaux, optimisation du site pour la conversion.
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

            {selectedTab === 'financiers' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-[#0f4c81] mb-6">Aspects financiers</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-semibold mb-2">Investissement initial</h3>
                    <p className="text-gray-600">{business.financials?.setupCost || "Informations non disponibles"}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Charges mensuelles</h3>
                    <p className="text-gray-600">{business.financials?.monthlyExpenses || "Informations non disponibles"}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Point mort</h3>
                    <p className="text-gray-600">{business.financials?.breakevenPoint || "Informations non disponibles"}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Retour sur investissement</h3>
                    <p className="text-gray-600">{business.financials?.roi || "Informations non disponibles"}</p>
                  </div>
                </div>
                
                {/* Ventilation des coûts */}
                <div className="mt-8 bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-lg text-[#0f4c81] mb-4">Ventilation des coûts mensuels estimés</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span>Hébergement et outils web</span>
                      </div>
                      <span className="font-semibold">15%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '15%' }}></div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span>Marketing et publicité</span>
                      </div>
                      <span className="font-semibold">40%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '40%' }}></div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <span>Stock de produits</span>
                      </div>
                      <span className="font-semibold">35%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '35%' }}></div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <span>Autres frais divers</span>
                      </div>
                      <span className="font-semibold">10%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: '10%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Avantages clés */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-[#0f4c81] mb-6 text-center">Principaux avantages</h2>
          <KeyBenefits benefits={business.benefits} />
        </div>
      </section>

      {/* Ce qui est inclus */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-[#0f4c81] mb-6 text-center">Ce qui est inclus</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {business.includes && business.includes.map((item, index) => (
              <div key={index} className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#ff7f50] shrink-0 mt-1" />
                  <span className="text-gray-700">{item}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-[#0f4c81] mb-6 text-center">Questions fréquentes</h2>
          <div className="max-w-3xl mx-auto">
            {/* FAQ d'origine */}
            <div className="space-y-4 mb-8">
              <FAQSection questions={business.common_questions} />
            </div>
            
            {/* FAQ spécifique à l'acquisition progressive */}
            <div className="mt-8 border-t pt-8">
              <h3 className="text-lg font-bold text-[#ff7f50] mb-4">
                Questions sur l'acquisition progressive
              </h3>
              <div className="space-y-4">
                {progressiveAcquisitionFAQs.map((faq) => (
                  <div 
                    key={faq.id} 
                    className="border rounded-lg overflow-hidden"
                  >
                    <button
                      className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none"
                      onClick={() => toggleFAQDetail(faq.id)}
                    >
                      <span className="font-medium">{faq.question}</span>
                      <span>
                        {showFAQDetails[faq.id] ? (
                          <Minus className="h-5 w-5 text-gray-500" />
                        ) : (
                          <Plus className="h-5 w-5 text-gray-500" />
                        )}
                      </span>
                    </button>
                    {showFAQDetails[faq.id] && (
                      <div className="px-6 pb-4">
                        <p className="text-gray-600">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-12 bg-[#0f3c81] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Prêt(e) à lancer ce business ?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Ne laissez pas passer cette opportunité unique de démarrer avec un business en ligne clé en main et un accompagnement expert.</p>
          <div className="flex flex-col md:flex-row gap-4 justify-center max-w-lg mx-auto">
            <button 
              className="bg-[#ff7f50] text-white px-6 py-4 rounded-lg text-lg font-bold hover:bg-[#ff6b3d] transition-colors flex-1"
              onClick={() => {
                setSelectedAcquisitionOption('standard');
                setIsModalOpen(true);
              }}
            >
              Acquisition complète
            </button>
            <button 
              className="bg-white text-[#0f3c81] px-6 py-4 rounded-lg text-lg font-bold hover:bg-gray-100 transition-colors flex-1 flex items-center justify-center gap-2"
              onClick={() => {
                setSelectedAcquisitionOption('progressive');
                setIsModalOpen(true);
              }}
            >
              Acquisition progressive
              <span className="bg-[#ff7f50] text-white text-xs px-2 py-0.5 rounded-full">NOUVEAU</span>
            </button>
          </div>
        </div>
      </section>

      <InterestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        businessName={business.name}
        businessPrice={selectedAcquisitionOption === 'progressive' 
          ? `À partir de ${formatPrice(calculateEntryPrice(business.price))}` 
          : formatPrice(business.price)}
        businessId={business.id}
      />
    </main>
  );
}