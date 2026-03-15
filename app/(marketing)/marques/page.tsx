// app/marques/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { TrendingUp, Star, Users, Loader2, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { getBrands } from '@/app/lib/db';
import type { Brand } from '@/app/types/database';
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
        <Loader2 className="h-8 w-8 animate-spin text-tekki-orange" />
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
      <section className="bg-tekki-blue relative pt-28 pb-20 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full pointer-events-none" />
        <Container className="relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Nos Marques de Produits
            </h1>
            <p className="text-xl text-white/70">
              Découvrez les marques que nous avons créées et développées avec succès
            </p>
          </div>
        </Container>
      </section>

      {/* Métriques Globales */}
      <section className="py-12 bg-white">
        <Container>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-tekki-cream rounded-xl p-8 text-center border border-tekki-blue/8 hover:shadow-md transition-all">
              <TrendingUp className="w-10 h-10 text-tekki-orange mx-auto mb-4" />
              <div className="text-3xl font-bold text-tekki-blue mb-2">+{totalSales.toLocaleString()}</div>
              <div className="text-gray-600">Ventes totales</div>
            </div>
            <div className="bg-tekki-cream rounded-xl p-8 text-center border border-tekki-blue/8 hover:shadow-md transition-all">
              <Star className="w-10 h-10 text-tekki-orange mx-auto mb-4" />
              <div className="text-3xl font-bold text-tekki-blue mb-2">{averageRating.toFixed(1)}/5</div>
              <div className="text-gray-600">Note moyenne</div>
            </div>
            <div className="bg-tekki-cream rounded-xl p-8 text-center border border-tekki-blue/8 hover:shadow-md transition-all">
              <Users className="w-10 h-10 text-tekki-orange mx-auto mb-4" />
              <div className="text-3xl font-bold text-tekki-blue mb-2">+{totalCustomers.toLocaleString()}</div>
              <div className="text-gray-600">Clients satisfaits</div>
            </div>
          </div>
        </Container>
      </section>

      {/* Liste des Marques */}
      <section className="py-16 bg-tekki-cream">
        <Container>
          <div className="space-y-8">
            {brands.map((brand) => (
              <div 
                key={brand.id}
                className="bg-white rounded-xl hover:shadow-md transition-all overflow-hidden border border-tekki-blue/8"
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
                      <span className="bg-tekki-orange text-white px-3 py-1 rounded-full text-sm font-medium">
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
                      <div className="text-center p-3 bg-tekki-cream rounded-lg hover:bg-tekki-blue/5 transition-colors">
                        <div className="text-tekki-orange font-bold">{brand.metrics.sales}</div>
                        <div className="text-sm text-gray-600">Ventes</div>
                      </div>
                      <div className="text-center p-3 bg-tekki-cream rounded-lg hover:bg-tekki-blue/5 transition-colors">
                        <div className="text-tekki-orange font-bold">{brand.metrics.revenue}</div>
                        <div className="text-sm text-gray-600">Revenus</div>
                      </div>
                      <div className="text-center p-3 bg-tekki-cream rounded-lg hover:bg-tekki-blue/5 transition-colors">
                        <div className="text-tekki-orange font-bold">{brand.metrics.growth}</div>
                        <div className="text-sm text-gray-600">Croissance</div>
                      </div>
                      <div className="text-center p-3 bg-tekki-cream rounded-lg hover:bg-tekki-blue/5 transition-colors">
                        <div className="text-tekki-orange font-bold">{brand.metrics.rating}</div>
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
      <section className="py-16 bg-tekki-blue relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-white/5 rounded-full pointer-events-none" />
        <Container className="text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Prêt à lancer votre business?</h2>
          <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
            Nous avons le business clé en main qui correspond à vos objectifs et votre style de vie.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/business"
              className="bg-tekki-orange hover:bg-tekki-orange/90 text-white px-8 py-4 rounded-full font-bold transition-colors"
            >
              Découvrir tous nos business
            </Link>
            <Link
              href="https://wa.me/221781362728"
              className="border border-white/30 hover:border-white/50 text-white px-8 py-4 rounded-full font-medium transition-colors"
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