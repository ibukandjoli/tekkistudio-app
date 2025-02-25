// app/components/home/BrandShowcase.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Star, TrendingUp, Users, Loader2 } from 'lucide-react';
import { supabase } from '@/app/lib/supabase';
import Link from 'next/link';
import type { Brand } from '@/app/types/database';

const BrandShowcase = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        // Récupérer les marques depuis Supabase avec une limite de 3
        const { data, error } = await supabase
          .from('brands')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(3);

        if (error) throw error;
        
        setBrands(data || []);
      } catch (err) {
        console.error('Erreur lors du chargement des marques:', err);
        setError('Une erreur est survenue lors du chargement des marques');
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 flex justify-center items-center" style={{ minHeight: '400px' }}>
          <Loader2 className="h-10 w-10 animate-spin text-[#ff7f50]" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </section>
    );
  }

  // Si aucune marque n'est trouvée, afficher un message
  if (brands.length === 0) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-[#0f4c81] mb-4">
            Nos Marques de Produits
          </h2>
          <p className="text-gray-600">Aucune marque disponible pour le moment.</p>
        </div>
      </section>
    );
  }

  // Calculer les métriques globales pour la section de statistiques
  const totalSales = brands.reduce((sum, brand) => sum + parseInt(brand.metrics.sales.replace(/[^0-9]/g, '') || '0'), 0);
  const brandCount = brands.length;
  const totalCustomers = brands.reduce((sum, brand) => sum + parseInt(brand.metrics.customers.replace(/[^0-9]/g, '') || '0'), 0);

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#0f4c81] mb-4">
            Nos Marques de Produits
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez les marques que nous avons créées et développées avec succès.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {brands.map((brand) => (
            <Link 
              key={brand.id}
              href={`/marques/${brand.slug}`}
              className="bg-white rounded-xl shadow-lg overflow-hidden transform transition hover:scale-105"
            >
              <div className="aspect-video relative bg-gray-100 w-full">
                <img 
                  src={brand.images.main}
                  alt={`Logo de ${brand.name}`}
                  className="w-full h-full object-cover" 
                />
              </div>

              <div className="p-6">
                <h3 className="text-lg font-bold text-[#0f4c81] mb-2">{brand.name}</h3>
                <p className="text-gray-600 mb-6">
                  {brand.short_description}
                </p>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-[#ff7f50] font-bold mb-1">
                      {brand.metrics.sales}
                    </div>
                    <div className="text-sm text-gray-500">
                      Ventes
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-[#ff7f50] font-bold mb-1">
                      {brand.metrics.rating}
                    </div>
                    <div className="text-sm text-gray-500">
                      Note
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-[#ff7f50] font-bold mb-1">
                      {brand.metrics.growth}
                    </div>
                    <div className="text-sm text-gray-500">
                      Croissance
                    </div>
                  </div>
                </div>

                {/* Extraire quelques points clés de la description complète */}
                <div className="space-y-2">
                  {[
                    `Plus de ${brand.metrics.sales} ventes`,
                    `${brand.metrics.rating} de satisfaction client`,
                    `${brand.metrics.growth} de croissance`,
                    `${brand.metrics.customers} clients satisfaits`
                  ].map((highlight, i) => (
                    <div key={i} className="flex items-center text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#ff7f50] mr-2" />
                      {highlight}
                    </div>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16 bg-white p-8 rounded-xl shadow-lg max-w-3xl mx-auto text-center">
          <div className="text-lg font-bold text-[#0f4c81] mb-2">
            Première fabrique de marques d'Afrique de l'Ouest
          </div>
          <p className="text-gray-600 mb-8">
            {brandCount} marques créées, {brands.length > 0 ? totalSales.toLocaleString() : '0'} ventes réalisées et près de {totalCustomers.toLocaleString()} clients uniques atteints.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-4 bg-[#F2F2F2] rounded-lg">
              <TrendingUp className="w-6 h-6 text-[#ff7f50] mx-auto mb-2" />
              <p className="font-medium">Croissance rapide</p>
            </div>
            <div className="p-4 bg-[#F2F2F2] rounded-lg">
              <Star className="w-6 h-6 text-[#ff7f50] mx-auto mb-2" />
              <p className="font-medium">Qualité premium</p>
            </div>
            <div className="p-4 bg-[#F2F2F2] rounded-lg">
              <Users className="w-6 h-6 text-[#ff7f50] mx-auto mb-2" />
              <p className="font-medium">Support continu</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandShowcase;