// app/formations/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Monitor, TrendingUp, BarChart, Users, Calendar, Clock, Star, Loader2 } from 'lucide-react';
import { getFormations } from '../lib/db/formations';
import type { Formation } from '../types/database';

// Map des icônes par nom
const iconMap: Record<string, React.ReactNode> = {
  ShoppingBag: <ShoppingBag className="w-8 h-8" />,
  Monitor: <Monitor className="w-8 h-8" />,
  TrendingUp: <TrendingUp className="w-8 h-8" />,
  BarChart: <BarChart className="w-8 h-8" />,
  Users: <Users className="w-8 h-8" />
};

const FormationsPage = () => {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFormations = async () => {
      try {
        const data = await getFormations();
        setFormations(data);
      } catch (err) {
        console.error('Erreur lors du chargement des formations:', err);
        setError('Une erreur est survenue lors du chargement des formations.');
      } finally {
        setLoading(false);
      }
    };

    fetchFormations();
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

  return (
    <main>
      {/* Hero Section */}
      <section className="bg-[#0f4c81] relative min-h-[400px] flex items-center">
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
              Nos Formations E-commerce
            </h1>
            <p className="text-xl opacity-90">
              Des formations pratiques et complètes pour réussir dans l'e-commerce
            </p>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-lg text-gray-600">
              Que vous soyez débutant ou expert, nos formations vous aideront à développer les compétences nécessaires pour réussir dans l'e-commerce. Dispensées par des experts du domaine, elles combinent théorie et pratique pour une application immédiate.
            </p>
          </div>
        </div>
      </section>

      {/* Liste des Formations */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {formations.map((formation) => (
              <div 
                key={formation.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-[#ff7f50] bg-opacity-10 flex items-center justify-center text-[#ff7f50]">
                        {iconMap[formation.icon] || <ShoppingBag className="w-8 h-8" />}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-[#0f4c81]">
                          {formation.title}
                        </h3>
                        <span className="text-[#ff7f50] text-sm">
                          {formation.category}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[#0f4c81] font-bold">
                        {formation.price}
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-6">
                    {formation.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-5 h-5 text-[#ff7f50]" />
                      <span>{formation.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-5 h-5 text-[#ff7f50]" />
                      <span>{formation.sessions}</span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="font-medium text-[#0f4c81] mb-2">Ce que vous apprendrez :</div>
                    <ul className="space-y-2">
                      {(formation.benefits && Array.isArray(formation.benefits) ? formation.benefits : []).slice(0, 4).map((benefit, index) => (
                        <li key={index} className="flex items-center gap-2 text-gray-600">
                          <Star className="w-4 h-4 text-[#ff7f50]" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    href={`/formations/${formation.slug}`}
                    className="block w-full bg-[#ff7f50] text-white text-center py-3 rounded-lg hover:bg-[#ff6b3d] transition-colors"
                  >
                    En savoir plus
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call-to-Action */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-[#0f4c81] mb-6">
              Prêt à développer vos compétences ?
            </h2>
            <p className="text-gray-600 mb-8">
              Nos experts sont là pour vous accompagner dans votre réussite e-commerce.
            </p>
            <Link
              href="https://wa.me/221781362728?text=Bonjour ! j'aimerais que '"
              className="inline-block bg-[#ff7f50] text-white px-8 py-4 rounded-lg hover:bg-[#ff6b3d] transition-colors"
            >
              Contactez-nous
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default FormationsPage;