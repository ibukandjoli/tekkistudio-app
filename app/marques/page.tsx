// app/marques/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { TrendingUp, Star, Users, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { getBrands } from '../lib/db';
import type { Brand } from '../types/database';

const BrandsPage = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const data = await getBrands();
        setBrands(data);
      } catch (error) {
        console.error('Erreur lors du chargement des marques:', error);
        setError('Une erreur est survenue lors du chargement des marques.');
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-[#ff7f50]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  // Calculer les métriques globales
  const totalSales = brands.reduce((sum, brand) => sum + parseInt(brand.metrics.sales.replace(/[^0-9]/g, '') || '0'), 0);
  const averageRating = brands.reduce((sum, brand) => sum + parseFloat(brand.metrics.rating.split('/')[0]), 0) / brands.length;
  const totalCustomers = brands.reduce((sum, brand) => sum + parseInt(brand.metrics.customers.replace(/[^0-9]/g, '') || '0'), 0);

  return (
    <main>
      {/* Hero Section */}
      <section className="bg-[#0f4c81] relative min-h-[300px] flex items-center">
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-12 h-full">
            {[...Array(48)].map((_, i) => (
              <div key={i} className="border border-white/20" />
            ))}
          </div>
        </div>

        <div className="container mx-auto px-4 py-32 relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Nos Marques de Produits
            </h1>
            <p className="text-xl opacity-90">
              Découvrez les marques que nous avons créées et développées avec succès
            </p>
          </div>
        </div>
      </section>

      {/* Métriques Globales */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-xl p-8 text-center">
              <TrendingUp className="w-10 h-10 text-[#ff7f50] mx-auto mb-4" />
              <div className="text-3xl font-bold text-[#0f4c81] mb-2">+{totalSales.toLocaleString()}</div>
              <div className="text-gray-600">Ventes totales</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-8 text-center">
              <Star className="w-10 h-10 text-[#ff7f50] mx-auto mb-4" />
              <div className="text-3xl font-bold text-[#0f4c81] mb-2">{averageRating.toFixed(1)}/5</div>
              <div className="text-gray-600">Note moyenne</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-8 text-center">
              <Users className="w-10 h-10 text-[#ff7f50] mx-auto mb-4" />
              <div className="text-3xl font-bold text-[#0f4c81] mb-2">+{totalCustomers.toLocaleString()}</div>
              <div className="text-gray-600">Clients satisfaits</div>
            </div>
          </div>
        </div>
      </section>

      {/* Liste des Marques */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-1 gap-8">
            {brands.map((brand) => (
              <div 
                key={brand.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3">
                    <div className="aspect-[4/3] relative">
                      <img 
                        src={brand.images.main}
                        alt={brand.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </div>
                  
                  <div className="md:w-2/3 p-8">
                    <div className="mb-4">
                      <span className="bg-[#ff7f50] text-white px-3 py-1 rounded-full text-sm">
                        {brand.category}
                      </span>
                    </div>
                    
                    <h2 className="text-2xl font-bold text-[#0f4c81] mb-3">
                      {brand.name}
                    </h2>
                    
                    <p className="text-gray-600 mb-6">
                      {brand.short_description}
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-[#ff7f50] font-bold">{brand.metrics.sales}</div>
                        <div className="text-sm text-gray-600">Ventes</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-[#ff7f50] font-bold">{brand.metrics.revenue}</div>
                        <div className="text-sm text-gray-600">Revenus</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-[#ff7f50] font-bold">{brand.metrics.growth}</div>
                        <div className="text-sm text-gray-600">Croissance</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-[#ff7f50] font-bold">{brand.metrics.rating}</div>
                        <div className="text-sm text-gray-600">Satisfaction</div>
                      </div>
                    </div>

                    <Link 
                      href={`/marques/${brand.slug}`}
                      className="inline-flex items-center text-white bg-[#ff7f50] px-6 py-3 rounded-lg hover:bg-[#ff6b3d] transition-colors"
                    >
                      Voir l'étude de cas
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default BrandsPage;