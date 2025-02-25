// app/business/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Filter, Search } from 'lucide-react';
import { supabase } from '../lib/supabase';
import LoadingState from '../components/ui/loading-state';
import ErrorState from '../components/ui/error-state';
import type { Business } from '../types/database';
import { formatPrice } from '../lib/utils/price-utils';

interface Filters {
  status: 'all' | 'available' | 'sold';
  type: 'all' | 'physical' | 'digital';
  category: string;
  search: string;
}

export default function BusinessesPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({
    status: 'all',
    type: 'all',
    category: 'all',
    search: ''
  });

  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('businesses')
        .select('*')
        .order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) throw error;

      // Trier les business: disponibles d'abord, puis vendus
      const sortedData = [...(data || [])].sort((a, b) => {
        // Si les statuts sont différents, on trie par statut
        if (a.status !== b.status) {
          return a.status === 'available' ? -1 : 1;
        }
        // Si les statuts sont identiques, on garde l'ordre par date (plus récent d'abord)
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });

      setBusinesses(sortedData);
      
      // Extraire les catégories uniques
      const uniqueCategories = [...new Set(data?.map(b => b.category) || [])];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Erreur lors du chargement des business:', error);
      setError('Une erreur est survenue lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const filteredBusinesses = businesses.filter(business => {
    const matchStatus = filters.status === 'all' || business.status === filters.status;
    const matchType = filters.type === 'all' || business.type === filters.type;
    const matchCategory = filters.category === 'all' || business.category === filters.category;
    const matchSearch = !filters.search ||
      business.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      business.description.toLowerCase().includes(filters.search.toLowerCase()) ||
      business.pitch.toLowerCase().includes(filters.search.toLowerCase());

    return matchStatus && matchType && matchCategory && matchSearch;
  });

  // Regrouper les business filtrés par statut
  const availableBusinesses = filteredBusinesses.filter(b => b.status === 'available');
  const soldBusinesses = filteredBusinesses.filter(b => b.status === 'sold');

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} retry={fetchBusinesses} />;

  return (
    <main>
      {/* Hero Section avec fond bleu */}
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
              Business E-commerce à Vendre
            </h1>
            <p className="text-xl opacity-90">
              Découvrez nos business e-commerce clé en main, prêts à générer des revenus
            </p>
          </div>
        </div>
      </section>

      {/* Section de filtres et recherche */}
      <section className="py-8 bg-gray-50 border-b">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
              <div className="flex flex-wrap gap-4 items-center w-full md:w-auto">
                <div className="flex items-center gap-2 text-[#0f4c81]">
                  <Filter className="w-5 h-5" />
                  <span className="font-medium">Filtres :</span>
                </div>
                
                <div className="flex flex-wrap gap-3 flex-1">
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as any }))}
                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff7f50] bg-white"
                  >
                    <option value="all">Tous les statuts</option>
                    <option value="available">En vente</option>
                    <option value="sold">Vendus</option>
                  </select>

                  <select
                    value={filters.type}
                    onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value as any }))}
                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff7f50] bg-white"
                  >
                    <option value="all">Tous les types</option>
                    <option value="physical">Produits physiques</option>
                    <option value="digital">Produits digitaux</option>
                  </select>

                  <select
                    value={filters.category}
                    onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff7f50] bg-white"
                  >
                    <option value="all">Toutes les catégories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher un business..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#ff7f50] bg-white"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Liste des Business */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          {filteredBusinesses.length > 0 ? (
            <>
              {/* Business disponibles */}
              {availableBusinesses.length > 0 && (
                <>
                  <h2 className="text-2xl font-bold text-[#0f4c81] mb-8">
                    Business disponibles ({availableBusinesses.length})
                  </h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {availableBusinesses.map((business) => (
                      <BusinessCard key={business.id} business={business} />
                    ))}
                  </div>
                </>
              )}

              {/* Business vendus */}
              {soldBusinesses.length > 0 && (
                <>
                  <h2 className="text-2xl font-bold text-[#0f4c81] mb-8 mt-12">
                    Business déjà vendus ({soldBusinesses.length})
                  </h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 opacity-80">
                    {soldBusinesses.map((business) => (
                      <BusinessCard key={business.id} business={business} />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                Aucun business ne correspond à vos critères de recherche.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

// Composant de carte business extrait pour éviter la duplication de code
function BusinessCard({ business }: { business: Business }) {
  return (
    <div 
      className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 transition-transform hover:translate-y-[-4px]"
    >
      <div className="aspect-video relative">
        <img 
          src={business.images[0]?.src || '/placeholder-business.jpg'} 
          alt={business.images[0]?.alt || business.name}
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
          <span className="bg-[#ff7f50] text-white px-3 py-1 rounded-full text-sm font-medium">
            {business.category}
          </span>
        </div>

        {business.status === 'sold' && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
            <span className="text-white text-2xl font-bold">VENDU</span>
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-2xl font-bold text-[#0f4c81] mb-2">
          {business.name}
        </h3>
        <p className="text-gray-600 mb-6 line-clamp-2">
          {business.pitch}
        </p>

        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-600">Prix du Business</span>
            <div className="text-right">
              <span className="line-through text-gray-400 text-sm">
                {formatPrice(business.original_price)}
              </span>
              <span className="font-bold text-[#0f4c81] block">
                {formatPrice(business.price)}
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

        {business.status === 'available' ? (
          <Link 
            href={`/business/${business.slug}`}
            className="w-full bg-[#ff7f50] text-white py-3 rounded-lg hover:bg-[#ff6b3d] transition-all flex items-center justify-center group"
          >
            Voir les détails
            <ArrowRight className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        ) : (
          <button 
            className="w-full bg-gray-100 text-gray-600 py-3 rounded-lg cursor-not-allowed"
            disabled
          >
            Business vendu
          </button>
        )}
      </div>
    </div>
  );
}