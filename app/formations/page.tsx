// app/formations/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  ShoppingBag, 
  Monitor, 
  TrendingUp, 
  BarChart, 
  Users, 
  Calendar, 
  Clock, 
  Star, 
  Loader2, 
  ArrowRight, 
  ExternalLink 
} from 'lucide-react';
import { getFormations } from '../lib/db/formations';
import type { Formation } from '../types/database';
import Container from '@/app/components/ui/Container';
import { Badge } from '@/app/components/ui/badge';

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
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchFormations = async () => {
      try {
        const data = await getFormations();
        setFormations(data);
        
        // Extraire les catégories uniques
        if (data.length > 0) {
          const uniqueCategories = [...new Set(data.map(formation => formation.category))];
          if (uniqueCategories.length > 0) {
            setActiveCategory(uniqueCategories[0]);
          }
        }
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

  // Extraire toutes les catégories uniques
  const categories = [...new Set(formations.map(formation => formation.category))];

  // Filtrer les formations par catégorie active
  const filteredFormations = activeCategory 
    ? formations.filter(formation => formation.category === activeCategory)
    : formations;

  return (
    <main className="pb-0">
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
              Nos Formations E-commerce
            </h1>
            <p className="text-xl opacity-90">
              Des formations pratiques et complètes pour réussir dans l'e-commerce
            </p>
          </div>
        </Container>
      </section>

      {/* Introduction */}
      <section className="py-16 bg-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-lg text-gray-600">
              Que vous soyez débutant ou expert, nos formations vous aideront à développer les compétences nécessaires pour réussir dans l'e-commerce. Dispensées par des experts du domaine, elles combinent théorie et pratique pour une application immédiate.
            </p>
          </div>
        </Container>
      </section>

      {/* Filtres par catégorie */}
      {categories.length > 1 && (
        <section className="pb-8 pt-4 bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
          <Container>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === category 
                      ? 'bg-tekki-coral text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
              {activeCategory && (
                <button
                  className="px-4 py-2 rounded-full text-sm font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                  onClick={() => setActiveCategory(null)}
                >
                  Tout voir
                </button>
              )}
            </div>
          </Container>
        </section>
      )}

      {/* Liste des Formations */}
      <section className="py-16 bg-gray-50">
        <Container>
          <div className="grid md:grid-cols-2 gap-8">
            {filteredFormations.map((formation) => (
              <div 
                key={formation.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all overflow-hidden border border-gray-100"
              >
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-tekki-coral/10 flex items-center justify-center text-tekki-coral">
                        {iconMap[formation.icon] || <ShoppingBag className="w-8 h-8" />}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-tekki-blue">
                          {formation.title}
                        </h3>
                        <Badge variant="digital" className="mt-1">
                          {formation.category}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-tekki-blue font-bold">
                        {formation.price}
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-6">
                    {formation.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-5 h-5 text-tekki-coral" />
                      <span>{formation.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-5 h-5 text-tekki-coral" />
                      <span>{formation.sessions}</span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="font-medium text-tekki-blue mb-2">Ce que vous apprendrez :</div>
                    <ul className="space-y-2">
                      {(formation.benefits && Array.isArray(formation.benefits) ? formation.benefits : []).slice(0, 4).map((benefit, index) => (
                        <li key={index} className="flex items-start">
                          <Star className="w-4 h-4 text-tekki-coral mt-1 mr-2 flex-shrink-0" />
                          <span className="text-gray-600">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    href={`/formations/${formation.slug}`}
                    className="block w-full bg-tekki-blue text-white text-center py-3 rounded-lg hover:bg-tekki-blue/90 transition-colors flex items-center justify-center"
                  >
                    En savoir plus
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Pourquoi choisir nos formations */}
      <section className="py-16 bg-white">
        <Container>
          <h2 className="text-3xl font-bold text-tekki-blue text-center mb-12">
            Pourquoi choisir nos formations
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-tekki-coral/10 rounded-full flex items-center justify-center text-tekki-coral mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-tekki-blue mb-3">
                Formateurs expérimentés
              </h3>
              <p className="text-gray-600">
                Nos formateurs sont des professionnels actifs dans l'e-commerce, avec une expérience concrète et des résultats prouvés.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-tekki-coral/10 rounded-full flex items-center justify-center text-tekki-coral mb-4">
                <Monitor className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-tekki-blue mb-3">
                Formation pratique
              </h3>
              <p className="text-gray-600">
                Focus sur l'application immédiate des connaissances avec des exercices pratiques et des études de cas réels.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-tekki-coral/10 rounded-full flex items-center justify-center text-tekki-coral mb-4">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-tekki-blue mb-3">
                Suivi personnalisé
              </h3>
              <p className="text-gray-600">
                Accompagnement post-formation pour vous aider à mettre en œuvre les stratégies apprises et maximiser vos résultats.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Call-to-Action */}
      <section className="py-16 bg-gradient-to-r from-tekki-blue to-tekki-coral text-white">
        <Container className="text-center">
          <h2 className="text-3xl font-bold mb-6">
            Prêt à développer vos compétences ?
          </h2>
          <p className="text-xl opacity-90 max-w-3xl mx-auto mb-8">
            Nos experts sont là pour vous accompagner dans votre réussite e-commerce.
          </p>
          <Link
            href="https://wa.me/221781362728?text=Bonjour ! j'aimerais en savoir plus sur vos formations e-commerce."
            className="inline-flex items-center justify-center bg-white text-tekki-blue hover:bg-white/90 px-8 py-4 rounded-lg font-medium text-lg transition-colors"
            target="_blank"
          >
            Contactez-nous
            <ExternalLink className="ml-2 h-5 w-5" />
          </Link>
        </Container>
      </section>
    </main>
  );
};

export default FormationsPage;