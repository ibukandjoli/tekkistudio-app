// app/marques/[slug]/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { getBrandBySlug } from '../../lib/db';
import type { Brand } from '../../types/database';

const BrandDetailPage = () => {
  const params = useParams();
  const currentSlug = params.slug as string;
  
  const [brand, setBrand] = useState<Brand | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const data = await getBrandBySlug(currentSlug);
        setBrand(data);
      } catch (err) {
        console.error('Erreur lors du chargement de la marque:', err);
        setError('Une erreur est survenue lors du chargement de la marque.');
      } finally {
        setLoading(false);
      }
    };

    fetchBrand();
  }, [currentSlug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-[#ff7f50]" />
      </div>
    );
  }

  if (error || !brand) {
    return (
      <div className="container mx-auto px-4 py-20">
        <h1 className="text-2xl font-bold text-[#0f4c81]">
          {error || 'Marque non trouvée'}
        </h1>
        <Link href="/marques" className="text-[#ff7f50] hover:underline">
          Retour aux marques
        </Link>
      </div>
    );
  }

  return (
    <main className="pb-20">
      {/* Hero Section */}
      <section className="bg-[#0f4c81] relative min-h-[400px] flex items-center">
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-12 h-full">
            {[...Array(48)].map((_, i) => (
              <div key={i} className="border border-white/20" />
            ))}
          </div>
        </div>

        <div className="container mx-auto px-4 pt-32 pb-20 relative z-10">
          <Link 
            href="/marques" 
            className="inline-flex items-center text-white/80 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour aux marques
          </Link>
          
          <div className="max-w-4xl">
            <div className="mb-6">
              <span className="bg-[#ff7f50] text-white px-4 py-2 rounded-full text-sm font-medium">
                {brand.category}
              </span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              {brand.name}
            </h1>
            <p className="text-xl text-white/90 max-w-3xl">
              {brand.description}
            </p>
          </div>
        </div>
      </section>

      {/* Métriques */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-gray-50 rounded-xl p-6 text-center">
              <div className="text-2xl font-bold text-[#0f4c81]">{brand.metrics.sales}</div>
              <div className="text-gray-600 text-sm">Ventes</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 text-center">
              <div className="text-2xl font-bold text-[#0f4c81]">{brand.metrics.revenue}</div>
              <div className="text-gray-600 text-sm">Revenus</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 text-center">
              <div className="text-2xl font-bold text-[#0f4c81]">{brand.metrics.growth}</div>
              <div className="text-gray-600 text-sm">Croissance</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 text-center">
              <div className="text-2xl font-bold text-[#0f4c81]">{brand.metrics.rating}</div>
              <div className="text-gray-600 text-sm">Note clients</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 text-center">
              <div className="text-2xl font-bold text-[#0f4c81]">{brand.metrics.customers}</div>
              <div className="text-gray-600 text-sm">Clients</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 text-center">
              <div className="text-2xl font-bold text-[#0f4c81]">{brand.metrics.countries}</div>
              <div className="text-gray-600 text-sm">Pays</div>
            </div>
          </div>
        </div>
      </section>

      {/* Galerie d'images */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-4">
            {brand.images.gallery.map((image, index) => (
              <div key={index} className="rounded-xl overflow-hidden shadow-lg">
                <img 
                  src={image}
                  alt={`${brand.name} - Image ${index + 1}`}
                  className="w-full h-64 object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Challenge et Solution */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-[#0f4c81] mb-4">Le Challenge</h2>
              <p className="text-gray-600">{brand.challenge}</p>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#0f4c81] mb-4">Notre Solution</h2>
              <p className="text-gray-600">{brand.solution}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-[#0f4c81] mb-8">Évolution de la marque</h2>
          <div className="max-w-3xl mx-auto">
            {brand.timeline.map((event, index) => (
              <div key={index} className="flex gap-4 mb-8">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 bg-[#ff7f50] rounded-full" />
                  {index < brand.timeline.length - 1 && (
                    <div className="w-0.5 h-full bg-gray-200" />
                  )}
                </div>
                <div>
                  <div className="text-sm text-[#ff7f50] font-medium">
                    {event.date}
                  </div>
                  <div className="font-medium text-[#0f4c81]">
                    {event.title}
                  </div>
                  <div className="text-gray-600">
                    {event.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Produits */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-[#0f4c81] mb-8">Produits</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {brand.products.map((product, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-[#0f4c81] mb-2">
                  {product.name}
                </h3>
                <p className="text-gray-600 mb-4">
                  {product.description}
                </p>
                <div className="text-[#ff7f50] font-bold">
                  {product.price}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-[#0f4c81] mb-8">Ce qu'en disent nos clients</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {brand.testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#ff7f50] flex items-center justify-center text-white font-bold text-xl">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <div className="font-bold text-[#0f4c81]">{testimonial.name}</div>
                    <div className="text-[#ff7f50] text-sm">{testimonial.role}</div>
                    <p className="mt-4 text-gray-600 italic">"{testimonial.text}"</p>
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

export default BrandDetailPage;