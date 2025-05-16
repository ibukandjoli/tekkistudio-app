// app/marques/[slug]/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Loader2, ExternalLink } from 'lucide-react';
import { getBrandBySlug } from '../../lib/db';
import type { Brand } from '../../types/database';
import Container from '@/app/components/ui/Container';

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
        <Loader2 className="h-8 w-8 animate-spin text-tekki-coral" />
      </div>
    );
  }

  if (error || !brand) {
    return (
      <Container className="py-20">
        <h1 className="text-2xl font-bold text-tekki-blue">
          {error || 'Marque non trouvée'}
        </h1>
        <Link href="/marques" className="text-tekki-coral hover:underline">
          Retour aux marques
        </Link>
      </Container>
    );
  }

  return (
    <main className="pb-16">
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
          <Link 
            href="/marques" 
            className="inline-flex items-center text-white/80 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour aux marques
          </Link>
          
          <div className="max-w-4xl">
            <div className="mb-6">
              <span className="bg-tekki-coral text-white px-4 py-2 rounded-full text-sm font-medium">
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
        </Container>
      </section>

      {/* Métriques */}
      <section className="py-12 bg-white">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-gray-50 rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-all">
              <div className="text-2xl font-bold text-tekki-blue">{brand.metrics.sales}</div>
              <div className="text-gray-600 text-sm">Ventes</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-all">
              <div className="text-2xl font-bold text-tekki-blue">{brand.metrics.revenue}</div>
              <div className="text-gray-600 text-sm">Revenus</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-all">
              <div className="text-2xl font-bold text-tekki-blue">{brand.metrics.growth}</div>
              <div className="text-gray-600 text-sm">Croissance</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-all">
              <div className="text-2xl font-bold text-tekki-blue">{brand.metrics.rating}</div>
              <div className="text-gray-600 text-sm">Note clients</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-all">
              <div className="text-2xl font-bold text-tekki-blue">{brand.metrics.customers}</div>
              <div className="text-gray-600 text-sm">Clients</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-all">
              <div className="text-2xl font-bold text-tekki-blue">{brand.metrics.countries}</div>
              <div className="text-gray-600 text-sm">Pays</div>
            </div>
          </div>
        </Container>
      </section>

      {/* Galerie d'images */}
      <section className="py-12 bg-gray-50">
        <Container>
          <h2 className="text-2xl font-bold text-tekki-blue mb-8">Galerie</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {brand.images.gallery.map((image, index) => (
              <div key={index} className="rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all group">
                <div className="relative h-64">
                  <Image 
                    src={image}
                    alt={`${brand.name} - Image ${index + 1}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Challenge et Solution */}
      <section className="py-12 bg-white">
        <Container>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-md transition-all">
              <h2 className="text-2xl font-bold text-tekki-blue mb-4">Le Challenge</h2>
              <p className="text-gray-600">{brand.challenge}</p>
            </div>
            <div className="bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-md transition-all">
              <h2 className="text-2xl font-bold text-tekki-blue mb-4">Notre Solution</h2>
              <p className="text-gray-600">{brand.solution}</p>
            </div>
          </div>
        </Container>
      </section>

      {/* Timeline */}
      <section className="py-12 bg-gray-50">
        <Container>
          <h2 className="text-2xl font-bold text-tekki-blue mb-8">Évolution de la marque</h2>
          <div className="max-w-3xl mx-auto">
            {brand.timeline.map((event, index) => (
              <div key={index} className="flex gap-4 mb-8 group">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 bg-tekki-coral rounded-full group-hover:scale-125 transition-all" />
                  {index < brand.timeline.length - 1 && (
                    <div className="w-0.5 h-full bg-gray-200 group-hover:bg-tekki-coral/20 transition-colors" />
                  )}
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all w-full">
                  <div className="text-sm text-tekki-coral font-medium">
                    {event.date}
                  </div>
                  <div className="font-medium text-tekki-blue text-lg">
                    {event.title}
                  </div>
                  <div className="text-gray-600 mt-2">
                    {event.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Produits */}
      <section className="py-12 bg-white">
        <Container>
          <h2 className="text-2xl font-bold text-tekki-blue mb-8">Produits Phares</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {brand.products.map((product, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all border border-gray-100 hover:border-tekki-coral/20">
                <h3 className="text-xl font-bold text-tekki-blue mb-2">
                  {product.name}
                </h3>
                <p className="text-gray-600 mb-4">
                  {product.description}
                </p>
                <div className="text-tekki-coral font-bold">
                  {product.price}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Témoignages */}
      <section className="py-12 bg-gray-50">
        <Container>
          <h2 className="text-2xl font-bold text-tekki-blue mb-8">Ce qu'en disent nos clients</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {brand.testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-tekki-coral flex items-center justify-center text-white font-bold text-xl">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <div className="font-bold text-tekki-blue">{testimonial.name}</div>
                    <div className="text-tekki-coral text-sm">{testimonial.role}</div>
                    <p className="mt-4 text-gray-600 italic">"{testimonial.text}"</p>
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
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Vous souhaitez lancer une marque similaire?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Nous pouvons vous aider à créer votre propre marque ou à acquérir un business e-commerce clé en main.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="/business" 
              className="bg-white text-tekki-blue hover:bg-white/90 px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
            >
              Découvrir nos business
              <ExternalLink className="ml-2 w-4 h-4" />
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

export default BrandDetailPage;