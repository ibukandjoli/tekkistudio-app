// app/business/[slug]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, DollarSign, Users, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import BusinessGallery from '../../components/business/BusinessGallery';
import InterestModal from '../../components/business/InterestModal';
import { formatPrice } from '@/app/lib/utils/price-utils';
import type { Business } from '@/app/types/database';

export default function BusinessPage() {
  const params = useParams();
  const currentSlug = params.slug as string;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        setBusiness(data);
      } catch (err) {
        console.error('Erreur lors du chargement du business:', err);
        setError("Une erreur est survenue lors du chargement des données");
      } finally {
        setLoading(false);
      }
    }

    fetchBusiness();
  }, [currentSlug]);

  // Afficher un état de chargement
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ff7f50]"></div>
      </div>
    );
  }

  // Si le business n'existe pas, afficher une page d'erreur
  if (error || !business) {
    return (
      <div className="container mx-auto px-4 py-20">
        <h1 className="text-2xl font-bold text-[#0f4c81] mb-4">
          {error || "Business non trouvé"}
        </h1>
        <Link href="/business" className="text-[#ff7f50] hover:underline">
          Retour aux business disponibles
        </Link>
      </div>
    );
  }

  return (
    <main className="pt-20">
      {/* Navigation */}
      <div className="bg-gray-50 border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/business" className="flex items-center text-[#0f4c81] hover:text-[#ff7f50]">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour aux business disponibles
          </Link>
        </div>
      </div>

      {/* En-tête du business */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="lg:w-2/3">
              <div className="flex gap-2 mb-4">
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
              <p className="text-gray-600 mb-8">{business.description}</p>
              
              <BusinessGallery images={business.images} />
            </div>
            
            <div className="lg:w-1/3">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
                <div className="text-center mb-6">
                  <div className="text-gray-400 line-through mb-1">{formatPrice(business.original_price)}</div>
                  <div className="text-2xl font-bold text-[#0f4c81] mb-2">{formatPrice(business.price)}</div>
                  <div className="text-gray-600">Potentiel mensuel: {formatPrice(business.monthly_potential)}</div>
                </div>
                <button 
                  className="w-full bg-[#ff7f50] text-white py-4 rounded-lg hover:bg-[#ff6b3d] transition-colors mb-4"
                  onClick={() => setIsModalOpen(true)}
                >
                  Je veux acquérir ce business
                </button>
                <div className="text-center text-sm text-gray-500">
                  Paiement en plusieurs fois possible
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contenu détaillé */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Analyse du marché */}
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-[#0f4c81] mb-6">Analyse du marché</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Taille du marché</h3>
                  <p className="text-gray-600">{business.market_analysis.size}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Croissance</h3>
                  <p className="text-gray-600">{business.market_analysis.growth}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Concurrence</h3>
                  <p className="text-gray-600">{business.market_analysis.competition}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Opportunité</h3>
                  <p className="text-gray-600">{business.market_analysis.opportunity}</p>
                </div>
              </div>
            </div>

            {/* Détails produits */}
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-[#0f4c81] mb-6">Détails produits</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Type de produits</h3>
                  <p className="text-gray-600">{business.product_details.type}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Marge brute</h3>
                  <p className="text-gray-600">{business.product_details.margin}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Fournisseurs</h3>
                  <p className="text-gray-600">{business.product_details.suppliers}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Logistique</h3>
                  <p className="text-gray-600">{business.product_details.logistics}</p>
                </div>
              </div>
            </div>

            {/* Stratégie marketing */}
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-[#0f4c81] mb-6">Stratégie marketing</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Canaux de vente</h3>
                  <p className="text-gray-600">{business.marketing_strategy.channels.join(', ')}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Cible</h3>
                  <p className="text-gray-600">{business.marketing_strategy.targetAudience}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Coût d'acquisition client</h3>
                  <p className="text-gray-600">{business.marketing_strategy.acquisitionCost}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Taux de conversion</h3>
                  <p className="text-gray-600">{business.marketing_strategy.conversionRate}</p>
                </div>
              </div>
            </div>

            {/* Aspects financiers */}
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-[#0f4c81] mb-6">Aspects financiers</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Investissement initial</h3>
                  <p className="text-gray-600">{business.financials.setupCost}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Charges mensuelles</h3>
                  <p className="text-gray-600">{business.financials.monthlyExpenses}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Point mort</h3>
                  <p className="text-gray-600">{business.financials.breakevenPoint}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Retour sur investissement</h3>
                  <p className="text-gray-600">{business.financials.roi}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ce qui est inclus */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-[#0f4c81] mb-6 text-center">Ce qui est inclus</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {business.includes.map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#ff7f50] shrink-0 mt-1" />
                <span className="text-gray-600">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <InterestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        businessName={business.name}
        businessPrice={formatPrice(business.price)}
        businessId={business.id}
      />
    </main>
  );
}