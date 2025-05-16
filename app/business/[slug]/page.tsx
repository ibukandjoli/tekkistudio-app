// app/business/[slug]/page.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, CheckCircle2, Users, Star, Clock, TrendingUp, Award, DollarSign } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { supabase } from '@/app/lib/supabase';
import BusinessGallery from '@/app/components/business/BusinessGallery';
import InterestModal from '@/app/components/business/InterestModal';
import { formatPrice } from '@/app/lib/utils/price-utils';
import Container from '@/app/components/ui/Container';
import ImageLightbox from '@/app/components/business/ImageLightbox';
import BusinessAccordion from '@/app/components/business/BusinessAccordion';
import FormattedText from '@/app/components/ui/FormattedText';
import useCountryStore from '@/app/hooks/useCountryStore';

export default function BusinessPage() {
  const params = useParams();
  const currentSlug = params.slug as string;
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [business, setBusiness] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeVisitors, setActiveVisitors] = useState<number>(0);
  
  // États pour la lightbox
  const [showLightbox, setShowLightbox] = useState<boolean>(false);
  const [lightboxIndex, setLightboxIndex] = useState<number>(0);
  
  // Définir l'option d'acquisition par défaut
  const [selectedAcquisitionOption, setSelectedAcquisitionOption] = useState<'standard' | 'progressive'>('standard');

  // Fonction pour calculer le prix d'entrée à partir des données du business
  const calculateEntryPrice = (price: number) => {
    if (!business) return Math.round(price * 0.4);
    const entryPercentage = business.entry_price_percentage || 40;
    return Math.round(price * entryPercentage / 100);
  };

  // Fonction pour calculer le montant des mensualités
  const calculateMonthlyPayment = (price: number) => {
    if (!business) return Math.round(price * 0.1) + 5000;
    const monthlyPercentage = business.monthly_payment_percentage || 10;
    const fixedAmount = business.monthly_payment_fixed_amount || 5000;
    return Math.round(price * monthlyPercentage / 100) + fixedAmount;
  };

  useEffect(() => {
    async function fetchBusiness() {
      try {
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
        
        setBusiness(data);
        
        // Définir l'option d'acquisition par défaut
        if (data) {
          setSelectedAcquisitionOption(
            data.progressive_option_enabled !== false ? 'progressive' : 'standard'
          );
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

  // Simuler un intérêt croissant
  useEffect(() => {
    if (business) {
      setActiveVisitors(business.active_viewers_count || Math.floor(Math.random() * 10) + 8);
    }
    
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setActiveVisitors(prev => {
          const change = Math.floor(Math.random() * 3) - 1;
          return Math.max(5, Math.min(20, prev + change));
        });
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, [business]);

  // Afficher un état de chargement
  if (loading) {
    return (
      <Container maxWidth="full" className="py-20 flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-tekki-orange"></div>
      </Container>
    );
  }

  // Si le business n'existe pas, afficher une page d'erreur
  if (error || !business) {
    return (
      <Container maxWidth="full" className="py-20 min-h-screen">
        <h1 className="text-2xl font-bold text-tekki-blue mb-4">
          {error || "Business non trouvé"}
        </h1>
        <Link href="/business" className="text-tekki-orange hover:underline">
          Retour aux business en vente
        </Link>
      </Container>
    );
  }

  // Définir les types pour business.status et business.type
  type BusinessStatus = 'available' | 'reserved' | 'sold';
  type BusinessType = 'ecommerce' | 'digital' | 'physical';

  // Assurez-vous que business.status est une valeur valide
  const businessStatus: BusinessStatus = 
    (business.status === 'available' || business.status === 'reserved' || business.status === 'sold') 
      ? business.status 
      : 'available';

  // Assurez-vous que business.type est une valeur valide
  const businessType: BusinessType = 
    (business.type === 'ecommerce' || business.type === 'digital' || business.type === 'physical') 
      ? business.type 
      : 'digital';

  const typeColor = {
    ecommerce: 'bg-tekki-blue/10 text-tekki-blue',
    digital: 'bg-tekki-orange/10 text-tekki-orange',
    physical: 'bg-green-100 text-green-700'
  };

  const typeText = {
    ecommerce: 'E-Commerce',
    digital: 'Digital',
    physical: 'Physique'
  };

  const statusColor = {
    available: 'bg-green-100 text-green-800',
    reserved: 'bg-amber-100 text-amber-800',
    sold: 'bg-red-100 text-red-800'
  };

  const statusText = {
    available: 'Disponible',
    reserved: 'Réservé',
    sold: 'Vendu'
  };

  const categoryMap = {
    'fashion': 'Mode',
    'beauty': 'Beauté',
    'sport': 'Sport',
    'home': 'Maison',
    'tech': 'Technologie',
    'food': 'Alimentation',
    'saas': 'SaaS',
    'marketplace': 'Marketplace',
    'app': 'Application',
    'content': 'Contenu'
  };

  // Vérifier si la catégorie existe dans categoryMap, sinon utiliser la catégorie directement
  const getCategory = (category: string): string => {
    if (!category) return "Autre";
    return (category in categoryMap) 
      ? categoryMap[category as keyof typeof categoryMap] 
      : category;
  };
  
  return (
    <main className="pt-20"> {/* Ajout d'espace entre le header et le contenu */}
      {/* Navigation */}
      <div className="bg-gray-20 border-b mb-6">
        <Container maxWidth="full">
          <div className="py-3">
            <Link href="/business" className="flex items-center text-tekki-blue hover:text-tekki-orange">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Retour aux business en vente
            </Link>
          </div>
        </Container>
      </div>

      {/* En-tête du business */}
      <Container maxWidth="full" className="py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Galerie d'images (côté gauche) */}
          <div className="lg:w-1/2">
            <BusinessGallery 
              images={business.images} 
              onImageClick={(index) => {
                setLightboxIndex(index);
                setShowLightbox(true);
              }}
            />
          </div>
          
          {/* Informations principales (côté droit) */}
          <div className="lg:w-1/2">
            {/* Indicateur de visiteurs actifs */}
            <div className="mb-4 flex items-center">
              <Users className="h-4 w-4 text-tekki-orange mr-2" />
              <span className="text-sm text-gray-600">{activeVisitors} personnes consultent ce business</span>
            </div>
            
            {/* Badges de statut, type, catégorie */}
            <div className="flex flex-wrap gap-2 mb-5">
              <span className={`${statusColor[businessStatus]} px-3 py-1 rounded-full font-semibold text-sm`}>
                {statusText[businessStatus]}
              </span>
              <span className={`${typeColor[businessType]} px-3 py-1 rounded-full font-semibold text-sm`}>
                {typeText[businessType]}
              </span>
              <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full font-semibold text-sm">
                {getCategory(business.category)}
              </span>
            </div>
            
            {/* Nom et pitch */}
            <h1 className="text-4xl font-bold text-black mb-4">{business.name}</h1>
            <p className="text-lg text-gray-500 mb-8">{business.pitch || business.shortDescription}</p>
            
            {/* Métriques clés */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div>
                <p className="text-sm text-gray-500">Prix d'acquisition</p>
                <p className="text-2xl font-bold text-tekki-blue">
                  {formatPrice(business.price)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Potentiel mensuel</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatPrice(business.monthly_potential)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Mise en place</p>
                <p className="text-xl font-semibold">{business.setup_time || '3 semaines'}</p>
              </div>
            </div>
            
            {/* Séparateur avant la description */}
            <div className="border-t border-gray-200 my-6"></div>
            
            {/* Description */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">A Propos de ce business</h2>
              <FormattedText text={business.description || ""} className="text-gray-600" />
            </div>
            
            {/* Séparateur avant les principaux avantages */}
            <div className="border-t border-gray-200 my-6"></div>
            
            {/* Principaux avantages */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Principaux avantages</h2>
              <ul className="space-y-2">
                {(business.benefits || []).length > 0 ? (
                  business.benefits.map((benefit: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))
                ) : (
                  // Fallback pour les avantages par défaut si aucun n'est défini
                  <>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Business prêt à l'emploi, aucun développement technique requis</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Accompagnement personnalisé pour garantir votre réussite</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Marché en pleine croissance avec un fort potentiel de rentabilité</span>
                    </li>
                  </>
                )}
              </ul>
            </div>
            
            {/* CTA - Bouton */}
            <div className="mt-6">
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full bg-tekki-orange hover:bg-tekki-orange/90 text-white py-3 px-4 rounded-lg font-semibold text-center"
              >
                Je veux acheter ce business
              </button>
              <p className="text-center text-sm mt-2 text-gray-500">
              Aucun paiement n'est requis sur le site
              </p>
            </div>
          </div>
        </div>
      </Container>

      {/* Options d'acquisition */}
      <section className="py-12 bg-blue-50 mb-4">
        <Container maxWidth="full">
          <h2 className="text-2xl font-bold text-tekki-blue mb-6 text-center">Options d'acquisition</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Option standard */}
            <div className={`bg-white rounded-xl shadow p-6 border-2 transition-all ${
              selectedAcquisitionOption === 'standard' ? 'border-tekki-blue transform scale-105' : 'border-transparent'
            } relative`}>
              {selectedAcquisitionOption === 'standard' && (
                <div className="absolute -right-3 -top-3 w-10 h-10 bg-tekki-blue rounded-full flex items-center justify-center shadow">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
              )}
              
              <h3 className="text-2xl font-bold text-tekki-blue mb-4">Acquisition Complète</h3>
              
              <div className="mb-4">
                <div className="text-3xl font-bold text-tekki-blue mb-1">{formatPrice(business.price)}</div>
                {business.original_price > business.price && (
                  <div className="text-gray-500 line-through">{formatPrice(business.original_price)}</div>
                )}
              </div>
              
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Transfert immédiat de propriété</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Paiement en 1 à 3 fois après signature du contrat d'acquisition</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>{business.standard_support_months || 2} mois d'accompagnement inclus</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Tous les éléments du business livrés immédiatement</span>
                </li>
              </ul>
              
              <button
                onClick={() => {
                  setSelectedAcquisitionOption('standard');
                  setIsModalOpen(true);
                }}
                className="w-full bg-tekki-blue text-white py-3 rounded-lg hover:bg-tekki-blue/90 transition-colors"
              >
                Acquérir avec cette option
              </button>
            </div>
            
            {/* Option progressive - Affichée uniquement si l'option progressive est activée */}
            {business.progressive_option_enabled !== false && (
              <div className={`bg-white rounded-xl shadow p-6 border-2 transition-all ${
                selectedAcquisitionOption === 'progressive' ? 'border-tekki-orange transform scale-105' : 'border-transparent'
              } relative overflow-hidden`}>
                {/* Badge "NOUVEAU" */}
                <div className="absolute -right-[60px] top-[30px] bg-tekki-orange text-white px-16 py-1 transform rotate-45 z-10">
                  NOUVEAU
                </div>
                
                {selectedAcquisitionOption === 'progressive' && (
                  <div className="absolute -right-3 -top-3 w-10 h-10 bg-tekki-orange rounded-full flex items-center justify-center shadow">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                )}
                
                <h3 className="text-2xl font-bold text-tekki-orange mb-4">Acquisition Progressive</h3>
                
                <div className="mb-4">
                  <div className="text-3xl font-bold text-black/80 mb-1">
                    À partir de {formatPrice(calculateEntryPrice(business.price))}
                  </div>
                  <div className="text-gray-700">
                    + {formatPrice(calculateMonthlyPayment(business.price))} / mois pendant {business.monthly_payment_duration || 6} mois
                  </div>
                </div>
                
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Démarrage avec seulement {business.entry_price_percentage || 40}% du prix</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Versements mensuels de {business.monthly_payment_percentage || 10}% + {business.monthly_payment_fixed_amount || 5000}F pendant {business.monthly_payment_duration || 6} mois</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{business.progressive_support_months || 3} mois d'accompagnement inclus</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Transférez votre business en douceur</span>
                  </li>
                </ul>
                
                <button
                  onClick={() => {
                    setSelectedAcquisitionOption('progressive');
                    setIsModalOpen(true);
                  }}
                  className="w-full bg-tekki-orange text-white py-3 rounded-lg hover:bg-tekki-orange/90 transition-colors"
                >
                  Acquérir avec cette option
                </button>
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* Section accordéon pour les détails du business */}
      <section className="py-12">
        <Container maxWidth="full">
          <h2 className="text-2xl font-bold text-tekki-blue mb-6 text-center">Détails du business</h2>
          <div className="max-w-5xl mx-auto">
            <BusinessAccordion 
              business={business} 
              businessType={businessType}
            />
          </div>
        </Container>
      </section>

      {/* Ce qui est inclus et cartes d'information - section complète */}
      <div className="bg-gray-50 py-10">
        <Container maxWidth="full">
          <div className="grid md:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {/* Ce qui est inclus */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
              <h3 className="text-xl font-semibold mb-4">Ce qui est inclus</h3>
              <ul className="space-y-3">
                {(business.includes || []).length > 0 ? (
                  business.includes.map((item: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-tekki-blue mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))
                ) : (
                  // Valeurs par défaut si non définies
                  <>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-tekki-blue mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Site web complet avec toutes les fonctionnalités</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-tekki-blue mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Logo et identité visuelle</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-tekki-blue mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Documentation et guides d'utilisation</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-tekki-blue mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Accès à tous les comptes administrateurs</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-tekki-blue mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{businessType === 'physical' ? 'Liste de fournisseurs validés' : 'Frameworks et outils techniques'}</span>
                    </li>
                    {businessType === 'physical' ? (
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-tekki-blue mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Processus logistique éprouvé</span>
                      </li>
                    ) : (
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-tekki-blue mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Hébergement inclus {business.standard_support_months || 2} mois</span>
                      </li>
                    )}
                  </>
                )}
              </ul>
            </div>
            
            {/* Aspects Financiers - remplace Support inclus */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
              <h3 className="text-xl font-semibold mb-4">Aspects Financiers</h3>
              <ul className="space-y-3">
                {business.financials ? (
                  <>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-tekki-orange mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium">Investissement initial:</span>
                        <span className="text-gray-700"> {business.financials.setupCost || 'Inclus dans le prix d\'acquisition'}</span>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-tekki-orange mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium">Charges mensuelles:</span>
                        <span className="text-gray-700"> {business.financials.monthlyExpenses || 'Variables selon l\'activité'}</span>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-tekki-orange mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium">Point mort:</span> 
                        <span className="text-gray-700"> {business.financials.breakevenPoint || 'Environ 4 mois'}</span>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-tekki-orange mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium">Retour sur investissement:</span>
                        <span className="text-gray-700"> {business.financials.roi || `Entre ${business.roi_min || 12} et ${business.roi_max || 18} mois`}</span>
                      </div>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-tekki-orange mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium">Investissement initial:</span>
                        <span className="text-gray-700"> Inclus dans le prix d'acquisition</span>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-tekki-orange mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium">Charges mensuelles:</span>
                        <span className="text-gray-700"> Environ {formatPrice(business.monthly_potential * 0.3)} à {formatPrice(business.monthly_potential * 0.4)}</span>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-tekki-orange mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium">Rentabilité estimée:</span>
                        <span className="text-gray-700"> {businessType === 'digital' ? '30-45%' : '25-35%'} du chiffre d'affaires</span>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-tekki-orange mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium">Retour sur investissement:</span>
                        <span className="text-gray-700"> Environ {business.roi_estimation_months || 6} à {business.roi_estimation_months + 6 || 12} mois</span>
                      </div>
                    </li>
                  </>
                )}
              </ul>
            </div>
            
            {/* Questions fréquentes - mise à jour avec plus d'informations */}
            <div className="bg-gray-50 rounded-lg shadow-sm p-6 border border-gray-100">
              <h3 className="text-xl font-semibold mb-4">Questions fréquentes</h3>
              <div className="space-y-4">
                {business.common_questions && business.common_questions.length > 0 ? (
                  // Utiliser les questions personnalisées si disponibles
                  business.common_questions.slice(0, 3).map((faq: any, index: number) => (
                    <div key={index}>
                      <h4 className="font-medium mb-1">{faq.question}</h4>
                      <p className="text-sm text-gray-600">{faq.answer}</p>
                    </div>
                  ))
                ) : (
                  // Questions par défaut
                  <>
                    <div>
                      <h4 className="font-medium mb-1">Combien de temps avant de pouvoir démarrer?</h4>
                      <p className="text-sm text-gray-600">
                        Une fois l'acquisition finalisée, vous pourrez démarrer en {business.setup_time || '3 semaines'} en moyenne.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">De combien de temps ai-je besoin pour gérer ce business?</h4>
                      <p className="text-sm text-gray-600">
                        {businessType === 'ecommerce' || businessType === 'physical' ? 
                          'Ce business e-commerce nécessite en moyenne 15-20h par semaine pour une gestion optimale.' : 
                          'Ce business digital nécessite en moyenne 10-15h par semaine pour une gestion optimale.'}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Quel niveau d'expertise est requis?</h4>
                      <p className="text-sm text-gray-600">
                        {business.skill_level_required 
                          ? `Niveau ${business.skill_level_required}. ${business.skill_level_required === 'débutant' ? 'Aucune expertise technique particulière n\'est requise.' : 'Une formation complète est incluse avec l\'acquisition.'}`
                          : 'Aucune expertise technique particulière n\'est requise. Notre accompagnement vous permet de prendre en main le business facilement.'}
                      </p>
                    </div>
                  </>
                )}
                
                {/* Lien vers toutes les FAQ */}
                <div className="mt-6">
                  <Link href="/#faq" className="text-tekki-blue hover:text-tekki-orange text-sm flex items-center">
                    Voir toutes les FAQ
                    <ArrowLeft className="h-4 w-4 ml-1 rotate-180" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* CTA final */}
      <section className="py-12 bg-gray-100 text-gray-800">
        <Container maxWidth="full">
          <div className="text-center max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Prêt(e) à lancer ce business ?</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">Ne laissez pas passer cette opportunité unique de démarrer avec un business en ligne clé en main et un accompagnement expert.</p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <button 
                className="bg-tekki-blue text-white px-6 py-4 rounded-lg text-lg font-bold hover:bg-tekki-blue/90 transition-colors flex-1 max-w-xs mx-auto"
                onClick={() => {
                  setSelectedAcquisitionOption('standard');
                  setIsModalOpen(true);
                }}
              >
                Acquisition complète
              </button>
              {business.progressive_option_enabled !== false && (
                <button 
                  className="bg-tekki-orange text-white px-6 py-4 rounded-lg text-lg font-bold hover:bg-tekki-orange/90 transition-colors flex-1 max-w-xs mx-auto flex items-center justify-center gap-2"
                  onClick={() => {
                    setSelectedAcquisitionOption('progressive');
                    setIsModalOpen(true);
                  }}
                >
                  Acquisition progressive
                  <span className="bg-white text-tekki-orange text-xs px-2 py-0.5 rounded-full">NOUVEAU</span>
                </button>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* Modal d'intérêt */}
      <InterestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        businessName={business.name}
        businessPrice={selectedAcquisitionOption === 'progressive' 
          ? `À partir de ${formatPrice(calculateEntryPrice(business.price))}` 
          : formatPrice(business.price)}
        businessId={business.id}
      />
      {/* Lightbox pour les images */}
      {showLightbox && business.images && (
        <ImageLightbox
          images={business.images}
          initialIndex={lightboxIndex}
          onClose={() => setShowLightbox(false)}
        />
      )}
    </main>
  );
}