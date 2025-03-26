// app/components/home/AvailableBusinesses.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { TrendingUp, Users, DollarSign, CheckCircle2 } from 'lucide-react';
import { getAvailableBusinesses } from '../../lib/db';
import type { Business } from '../../types/database';
import { formatPrice } from '../../lib/utils/price-utils';

const AvailableBusinesses = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // Fonction pour calculer le prix d'entrée (40% du prix total)
  const calculateEntryPrice = (price: number) => {
    return Math.round(price * 0.4);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-96">Chargement...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600">{error}</div>;
  }
  
  return (
    <section className="py-20 bg-[#f8fafc]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#0f4c81] mb-4">
            Business E-commerce Disponibles
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez nos business clé en main, prêts à être lancés et à générer des revenus.
            Chaque business inclut tout ce dont vous avez besoin pour réussir.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {businesses.map((business) => (
            <div key={business.id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
              <div className="aspect-video relative">
                <img 
                  src={business.images[0].src} 
                  alt={business.images[0].alt}
                  className="object-cover w-full h-full"
                />
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                <span className={`px-3 py-1 rounded-full text-sm text-white font-medium ${
                        business.status === 'available' 
                          ? 'bg-green-500' 
                          : 'bg-gray-500'
                      }`}>
                        {business.status === 'available' ? 'En vente' : 'Vendu'}
                      </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-2xl font-bold text-[#0f4c81] mb-2">
                  {business.name}
                </h3>
                <p className="text-gray-600 mb-4">
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

                <div className="space-y-2 mb-6">
                  {business.includes.slice(0, 4).map((item, index) => (
                    <div key={index} className="flex items-center text-gray-600">
                      <CheckCircle2 className="w-5 h-5 text-[#ff7f50] mr-2" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <Link 
                  href={`/business/${business.slug}`}
                  className="w-full bg-[#ff7f50] text-white py-3 rounded-lg hover:bg-[#ff6b3d] transition-colors flex items-center justify-center"
                >
                  Je suis intéressé(e)
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-8">
            Tous nos business sont livrés avec un accompagnement offert de 2 mois pour maximiser vos chances de succès.
          </p>
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="p-4 bg-gray-50 rounded-lg">
              <TrendingUp className="w-6 h-6 text-[#ff7f50] mx-auto mb-2" />
              <p className="font-medium">Formation incluse</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <Users className="w-6 h-6 text-[#ff7f50] mx-auto mb-2" />
              <p className="font-medium">Support pendant 2 mois</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <DollarSign className="w-6 h-6 text-[#ff7f50] mx-auto mb-2" />
              <p className="font-medium">Paiement en plusieurs fois</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AvailableBusinesses;