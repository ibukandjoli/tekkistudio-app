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

  // Fonction pour obtenir la marge brute du business
  const getGrossMargin = () => {
    // Vérifier si la marge brute est définie dans les détails du produit
    if (business?.product_details?.margin) {
      return business.product_details.margin;
    }
    
    // Si le business existe mais pas de marge définie, utiliser une valeur par défaut selon le type
    if (business) {
      return business.type === 'digital' ? '65%' : '40%';
    }
    
    // Valeur par défaut si aucune information n'est disponible
    return '50%';
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
        <div className="mx-auto px-2 md:px-8 w-full"> {/* Container personnalisé avec marges réduites sur mobile */}
          <div className="py-3">
            <Link href="/business" className="flex items-center text-tekki-blue hover:text-tekki-orange">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Retour aux business en vente
            </Link>
          </div>
        </div>
      </div>

      {/* En-tête du business */}
      <div className="mx-auto px-3 md:px-8 w-full py-8"> {/* Container personnalisé avec marges réduites sur mobile */}
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
            
            {/* Métriques clés - Simplifiées */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div>
                <p className="text-sm text-gray-500">Prix du business</p>
                <p className="text-2xl font-bold text-tekki-blue">
                  {formatPrice(business.price)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Revenu mensuel possible</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatPrice(business.monthly_potential)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Bénéfice sur les ventes</p>
                <p className="text-xl font-semibold text-tekki-orange">{getGrossMargin()}</p>
              </div>
            </div>
            
            {/* Séparateur avant la description */}
            <div className="border-t border-gray-200 my-6"></div>
            
            {/* Description */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">À propos de ce business</h2>
              <FormattedText text={business.description || ""} className="text-gray-600" />
            </div>
            
            {/* Séparateur avant les principaux avantages */}
            <div className="border-t border-gray-200 my-6"></div>
            
            {/* Principaux avantages */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Pourquoi choisir ce business?</h2>
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
                      <span>Marché en pleine croissance avec un fort potentiel de revenus</span>
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
      </div>

      {/* Options d'acquisition - Section simplifiée */}
      <section className="py-12 bg-blue-50 mb-4">
        <div className="mx-auto px-3 md:px-8 w-full"> {/* Container personnalisé avec marges réduites sur mobile */}
          <h2 className="text-2xl font-bold text-tekki-blue mb-6 text-center">Comment acheter ce business</h2>
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
              
              <h3 className="text-2xl font-bold text-tekki-blue mb-4">Achat immédiat</h3>
              
              <div className="mb-4">
                <div className="text-3xl font-bold text-tekki-blue mb-1">{formatPrice(business.price)}</div>
                {business.original_price > business.price && (
                  <div className="text-gray-500 line-through">{formatPrice(business.original_price)}</div>
                )}
              </div>
              
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Vous devenez propriétaire immédiatement</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Vous pouvez payer en 2 ou 3 mensualités</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>{business.standard_support_months || 2} mois d'accompagnement offerts</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Tous les éléments livrés immédiatement</span>
                </li>
              </ul>
              
              <button
                onClick={() => {
                  setSelectedAcquisitionOption('standard');
                  setIsModalOpen(true);
                }}
                className="w-full bg-tekki-blue text-white py-3 rounded-lg hover:bg-tekki-blue/90 transition-colors"
              >
                Acheter avec cette option
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
                
                <h3 className="text-2xl font-bold text-tekki-orange mb-4">Achat progressif</h3>
                
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
                    <span>Vous démarrez en payant seulement {business.entry_price_percentage || 40}% du prix</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Vous payez {business.monthly_payment_percentage || 10}% par mois + {business.monthly_payment_fixed_amount || 5000}F de frais pendant {business.monthly_payment_duration || 6} mois</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{business.progressive_support_months || 2} mois d'accompagnement offerts</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>Devenez progressivement propriétaire de votre business</span>
                  </li>
                </ul>
                
                <button
                  onClick={() => {
                    setSelectedAcquisitionOption('progressive');
                    setIsModalOpen(true);
                  }}
                  className="w-full bg-tekki-orange text-white py-3 rounded-lg hover:bg-tekki-orange/90 transition-colors"
                >
                  Acheter avec cette option
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Section accordéon pour les détails du business - Utiliser des termes simplifiés */}
      <section className="py-12">
        <div className="mx-auto px-3 md:px-8 w-full"> {/* Container personnalisé avec marges réduites sur mobile */}
          <h2 className="text-2xl font-bold text-tekki-blue mb-6 text-center">Tout ce que vous devez savoir sur ce business</h2>
          <div className="max-w-5xl mx-auto">
            <BusinessAccordion 
              business={business} 
              businessType={businessType}
            />
          </div>
        </div>
      </section>

      {/* Ce qui est inclus et cartes d'information - section simplifiée */}
      <div className="bg-gray-50 py-10">
        <div className="mx-auto px-3 md:px-8 w-full"> {/* Container personnalisé avec marges réduites sur mobile */}
          <div className="grid md:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {/* Ce qui est inclus */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
              <h3 className="text-xl font-semibold mb-4">Ce que vous recevez</h3>
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
                      <span className="text-gray-700">Site web complet prêt à l'emploi</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-tekki-blue mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Logo et design professionnel</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-tekki-blue mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Guide détaillé pas à pas</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-tekki-blue mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Accès à tous les comptes</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-tekki-blue mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{businessType === 'physical' ? 'Liste de fournisseurs vérifiés' : 'Tous les outils techniques'}</span>
                    </li>
                    {businessType === 'physical' ? (
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-tekki-blue mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Guide de gestion des livraisons</span>
                      </li>
                    ) : (
                      <li className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-tekki-blue mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Hébergement inclus pour {business.standard_support_months || 2} mois</span>
                      </li>
                    )}
                  </>
                )}
              </ul>
            </div>
            
            {/* Aspects Financiers - Simplifiés */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
              <h3 className="text-xl font-semibold mb-4">Aspect financier</h3>
              <ul className="space-y-3">
                {business.financials ? (
                  <>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-tekki-orange mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium">Montant pour démarrer :</span>
                        <span className="text-gray-700"> {business.financials.setupCost || 'Inclus dans le prix d\'achat'}</span>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-tekki-orange mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium">Dépenses mensuelles :</span>
                        <span className="text-gray-700"> {business.financials.monthlyExpenses || 'Varient selon votre activité'}</span>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-tekki-orange mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium">Rentabilité attendue:</span> 
                        <span className="text-gray-700"> Après environ {business.financials.breakevenPoint || '4 mois'}</span>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-tekki-orange mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium">Retour sur investissement :</span>
                        <span className="text-gray-700"> En {business.financials.roi || `${business.roi_min || 12} à ${business.roi_max || 6} mois`}</span>
                      </div>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-tekki-orange mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium">Coût de démarrage:</span>
                        <span className="text-gray-700"> Déjà inclus dans le prix d'achat</span>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-tekki-orange mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium">Dépenses mensuelles:</span>
                        <span className="text-gray-700"> Environ {formatPrice(business.monthly_potential * 0.3)} à {formatPrice(business.monthly_potential * 0.4)}</span>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-tekki-orange mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium">Ce que vous gardez:</span>
                        <span className="text-gray-700"> {businessType === 'digital' ? '30-45%' : '25-35%'} des revenus</span>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-tekki-orange mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium">Remboursement de l'achat:</span>
                        <span className="text-gray-700"> En {business.roi_estimation_months || 6} à {business.roi_estimation_months + 6 || 12} mois</span>
                      </div>
                    </li>
                  </>
                )}
              </ul>
            </div>
            
            {/* Questions fréquentes - simplifiées */}
            <div className="bg-gray-50 rounded-lg shadow-sm p-6 border border-gray-100">
              <h3 className="text-xl font-semibold mb-4">Questions courantes</h3>
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
                  // Questions par défaut simplifiées
                  <>
                    <div>
                      <h4 className="font-medium mb-1">Combien de temps pour commencer?</h4>
                      <p className="text-sm text-gray-600">
                        Vous pouvez commencer en {business.setup_time || '3 semaines'} après votre achat.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Combien d'heures par semaine faut-il?</h4>
                      <p className="text-sm text-gray-600">
                        {businessType === 'ecommerce' || businessType === 'physical' ? 
                          'Ce business demande environ 15-20h par semaine pour bien le gérer.' : 
                          'Ce business demande environ 10-15h par semaine pour bien le gérer.'}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Faut-il des connaissances spéciales?</h4>
                      <p className="text-sm text-gray-600">
                        {business.skill_level_required 
                          ? `Niveau ${business.skill_level_required}. ${business.skill_level_required === 'débutant' ? 'Aucune connaissance spéciale n\'est nécessaire.' : 'Une formation complète est incluse avec l\'achat.'}`
                          : 'Non, aucune connaissance spéciale n\'est nécessaire. Nous vous montrons tout ce qu\'il faut savoir.'}
                      </p>
                    </div>
                  </>
                )}
                
                {/* Lien vers toutes les FAQ */}
                <div className="mt-6">
                  <Link href="https://wa.me/221781362728" className="text-tekki-blue hover:text-tekki-orange text-sm flex items-center">
                    J'ai d'autres questions
                    <ArrowLeft className="h-4 w-4 ml-1 rotate-180" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA final - simplifié */}
      <section className="py-12 bg-gray-100 text-gray-800">
        <div className="mx-auto px-3 md:px-8 w-full"> {/* Container personnalisé avec marges réduites sur mobile */}
          <div className="text-center max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Prêt(e) à commencer votre aventure?</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">Ce business clé en main est votre chance de démarrer facilement avec notre aide et notre expérience.</p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <button 
                className="bg-tekki-blue text-white px-6 py-4 rounded-lg text-lg font-bold hover:bg-tekki-blue/90 transition-colors flex-1 max-w-xs mx-auto"
                onClick={() => {
                  setSelectedAcquisitionOption('standard');
                  setIsModalOpen(true);
                }}
              >
                Acheter maintenant
              </button>
              {business.progressive_option_enabled !== false && (
                <button 
                  className="bg-tekki-orange text-white px-6 py-4 rounded-lg text-lg font-bold hover:bg-tekki-orange/90 transition-colors flex-1 max-w-xs mx-auto flex items-center justify-center gap-2"
                  onClick={() => {
                    setSelectedAcquisitionOption('progressive');
                    setIsModalOpen(true);
                  }}
                >
                  Acheter progressivement
                  <span className="bg-white text-tekki-orange text-xs px-2 py-0.5 rounded-full">NOUVEAU</span>
                </button>
              )}
            </div>
          </div>
        </div>
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