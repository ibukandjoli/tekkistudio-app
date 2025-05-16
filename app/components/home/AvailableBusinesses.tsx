// app/components/home/AvailableBusinesses.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { getAvailableBusinesses } from '../../lib/db';
import type { Business } from '../../types/database';
import { formatPrice } from '../../lib/utils/price-utils';

const AvailableBusinesses = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const data = await getAvailableBusinesses();
        setBusinesses(data);
      } catch (error) {
        console.error('Erreur lors du chargement des business:', error);
        setError('Une erreur est survenue lors du chargement des données.');
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, []);

  // Calculer le prix d'entrée (40% du prix total)
  const calculateEntryPrice = (price: number) => {
    return Math.round(price * 0.4);
  };

  // Filtrer les business selon l'onglet actif
  const filteredBusinesses = activeTab === 'all' 
    ? businesses.slice(0, 6) // Limiter à 6 pour la page d'accueil
    : businesses.filter(business => business.type === activeTab).slice(0, 6);

  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0f4c81] mb-4">
              Nos Business Disponibles
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Un instant pendant que nous chargeons nos business disponibles...
            </p>
          </div>
          <div className="flex justify-center">
            <div className="w-12 h-12 rounded-full border-4 border-[#ff7f50] border-t-transparent animate-spin"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <div className="text-red-600">{error}</div>
        </div>
      </section>
    );
  }
  
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0f4c81] mb-4">
            Nos Business Disponibles
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choisissez parmi notre sélection de business prêts à générer des revenus dès le premier mois.
          </p>
        </div>
        
        {/* Onglets de filtrage */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-white rounded-full shadow-md p-1">
            <button 
              onClick={() => setActiveTab('all')}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-colors ${
                activeTab === 'all' 
                  ? 'bg-[#0f4c81] text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Tous les business
            </button>
            <button 
              onClick={() => setActiveTab('physical')}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-colors ${
                activeTab === 'physical' 
                  ? 'bg-[#0f4c81] text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              E-commerce
            </button>
            <button 
              onClick={() => setActiveTab('digital')}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-colors ${
                activeTab === 'digital' 
                  ? 'bg-[#0f4c81] text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Digitaux
            </button>
          </div>
        </div>
        
        {/* Grille des business */}
        {filteredBusinesses.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBusinesses.map((business) => (
              <div 
                key={business.id} 
                className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow"
              >
                <div className="aspect-video relative">
                  <img 
                    src={business.images[0]?.src || '/placeholder-business.jpg'} 
                    alt={business.images[0]?.alt || business.name}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-full text-xs text-white font-medium bg-green-500">
                      En vente
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs text-white font-medium ${
                      business.type === 'digital' ? 'bg-blue-500' : 'bg-[#ff7f50]'
                    }`}>
                      {business.type === 'digital' ? 'Digital' : 'E-commerce'}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#0f4c81] mb-2">
                    {business.name}
                  </h3>
                  <p className="text-gray-600 mb-4 h-12 overflow-hidden">
                    {business.pitch}
                  </p>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600">Prix de vente</span>
                      <div className="text-right">
                        <span className="line-through text-gray-400 text-sm">
                          {formatPrice(business.original_price)}
                        </span>
                        <span className="font-bold text-[#0f4c81] block">
                          À partir de {formatPrice(calculateEntryPrice(business.price))}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600">Potentiel mensuel</span>
                      <span className="font-bold text-[#ff7f50]">
                        {formatPrice(business.monthly_potential)}
                      </span>
                    </div>
                  </div>

                  <Link 
                    href={`/business/${business.slug}`}
                    className="w-full bg-[#ff7f50] text-white py-3 rounded-lg hover:bg-[#ff6b3d] transition-colors flex items-center justify-center font-medium"
                  >
                    Je suis intéressé(e)
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-600 mb-4">Aucun business disponible dans cette catégorie pour le moment.</p>
            <p className="text-[#0f4c81]">Nous travaillons constamment sur de nouveaux business. Revenez bientôt !</p>
          </div>
        )}
        
        {/* CTA pour voir plus */}
        <div className="mt-12 text-center">
          <Link 
            href="/business"
            className="inline-flex items-center bg-[#0f4c81] text-white px-8 py-4 rounded-lg hover:bg-[#0a3c67] transition-colors font-medium"
          >
            Voir tous les business
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AvailableBusinesses;