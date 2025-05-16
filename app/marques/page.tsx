// app/marques/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { TrendingUp, Star, Users, Loader2, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { getBrands } from '../lib/db';
import type { Brand } from '../types/database';
import Container from '@/app/components/ui/Container';
import { cn } from '@/app/lib/utils';

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
        <Loader2 className="h-8 w-8 animate-spin text-tekki-coral" />
      </div>
    );
  }

  if (error) {
    return (
      <Container className="py-20 text-center">
        <p className="text-red-600">{error}</p>
      </Container>
    );
  }

  // Calculer les métriques globales
  const totalSales = brands.reduce((sum, brand) => sum + parseInt(brand.metrics.sales.replace(/[^0-9]/g, '') || '0'), 0);
  const averageRating = brands.reduce((sum, brand) => sum + parseFloat(brand.metrics.rating.split('/')[0]), 0) / brands.length;
  const totalCustomers = brands.reduce((sum, brand) => sum + parseInt(brand.metrics.customers.replace(/[^0-9]/g, '') || '0'), 0);

  return (
    <main>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-tekki-blue to-tekki-coral relative pt-28 pb-20">
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-12 h-full">
            {[...Array(48)].map((_, i) => (
              <div key={i} className="border border-white/20" />
            ))}
          </div>
        </div>

        <Container className="relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Nos Marques de Produits
            </h1>
            <p className="text-xl opacity-90">
              Découvrez les marques que nous avons créées et développées avec succès
            </p>
          </div>
        </Container>
      </section>

      {/* Métriques Globales */}
      <section className="py-12 bg-white">
        <Container>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-xl p-8 text-center shadow-sm hover:shadow-md transition-all">
              <TrendingUp className="w-10 h-10 text-tekki-coral mx-auto mb-4" />
              <div className="text-3xl font-bold text-tekki-blue mb-2">+{totalSales.toLocaleString()}</div>
              <div className="text-gray-600">Ventes totales</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-8 text-center shadow-sm hover:shadow-md transition-all">
              <Star className="w-10 h-10 text-tekki-coral mx-auto mb-4" />
              <div className="text-3xl font-bold text-tekki-blue mb-2">{averageRating.toFixed(1)}/5</div>
              <div className="text-gray-600">Note moyenne</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-8 text-center shadow-sm hover:shadow-md transition-all">
              <Users className="w-10 h-10 text-tekki-coral mx-auto mb-4" />
              <div className="text-3xl font-bold text-tekki-blue mb-2">+{totalCustomers.toLocaleString()}</div>
              <div className="text-gray-600">Clients satisfaits</div>
            </div>
          </div>
        </Container>
      </section>

      {/* Liste des Marques */}
      <section className="py-16 bg-gray-50">
        <Container>
          <div className="space-y-8">
            {brands.map((brand) => (
              <div 
                key={brand.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all overflow-hidden border border-gray-100"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-2/5 lg:w-1/3 relative">
                    <div className="aspect-[4/3] relative">
                      <Image 
                        src={brand.images.main}
                        alt={brand.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                  </div>
                  
                  <div className="md:w-3/5 lg:w-2/3 p-6 md:p-8">
                    <div className="mb-4">
                      <span className="bg-tekki-coral text-white px-3 py-1 rounded-full text-sm font-medium">
                        {brand.category}
                      </span>
                    </div>
                    
                    <h2 className="text-2xl font-bold text-tekki-blue mb-3">
                      {brand.name}
                    </h2>
                    
                    <p className="text-gray-600 mb-6">
                      {brand.short_description}
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="text-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="text-tekki-coral font-bold">{brand.metrics.sales}</div>
                        <div className="text-sm text-gray-600">Ventes</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="text-tekki-coral font-bold">{brand.metrics.revenue}</div>
                        <div className="text-sm text-gray-600">Revenus</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="text-tekki-coral font-bold">{brand.metrics.growth}</div>
                        <div className="text-sm text-gray-600">Croissance</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="text-tekki-coral font-bold">{brand.metrics.rating}</div>
                        <div className="text-sm text-gray-600">Satisfaction</div>
                      </div>
                    </div>

                    <Link 
                      href={`/marques/${brand.slug}`}
                      className="inline-flex items-center text-white bg-tekki-blue hover:bg-tekki-blue/90 px-6 py-3 rounded-lg transition-colors"
                    >
                      Voir l'étude de cas
                      <ExternalLink className="ml-2 w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-tekki-blue to-tekki-coral text-white">
        <Container className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Prêt à lancer votre business?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Nous avons le business clé en main qui correspond à vos objectifs et votre style de vie.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="/business" 
              className="bg-white text-tekki-blue hover:bg-white/90 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Découvrir tous nos business
            </Link>
            <Link 
              href="https://wa.me/221781362728" 
              className="bg-white/10 border border-white/20 text-white hover:bg-white/20 px-6 py-3 rounded-lg font-medium transition-colors"
              target="_blank"
            >
              Prendre rendez-vous
            </Link>
          </div>
        </Container>
      </section>
    </main>
  );
};

export default BrandsPage;