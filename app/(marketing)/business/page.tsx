// app/business/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Filter, Search, CheckCircle, ArrowUpDown } from 'lucide-react';
import { supabase } from '@/app/lib/supabase';
import { cn } from '@/app/lib/utils';
import { formatPrice } from '@/app/lib/utils/price-utils';
import Container from '@/app/components/ui/Container';

// Types
interface Business {
  id: string;
  name: string;
  slug: string;
  description: string;
  pitch: string;
  price: number;
  original_price: number;
  monthly_potential: number;
  status: 'available' | 'reserved' | 'sold';
  type: 'physical' | 'digital';
  category: string;
  images: { src: string; alt: string }[];
  setup_time?: string;
  created_at: string;
  progressive_option_enabled?: boolean;
  entry_price_percentage?: number;
}

interface Filters {
  status: 'all' | 'available' | 'reserved' | 'sold';
  type: 'all' | 'physical' | 'digital';
  category: string;
  priceRange: 'all' | 'low' | 'medium' | 'high';
  sortBy: 'newest' | 'price-asc' | 'price-desc' | 'potential-desc';
  search: string;
}

// Mapping de catégories pour l'affichage
const categoryMap: Record<string, string> = {
  'fashion': 'Mode',
  'beauty': 'Beauté',
  'sport': 'Sport',
  'home': 'Maison',
  'tech': 'Technologie',
  'food': 'Alimentation',
  'saas': 'SaaS',
  'marketplace': 'Place de marché',
  'app': 'Application',
  'content': 'Contenu',
};

export default function BusinessesPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'physical' | 'digital'>('all');
  
  // États pour les filtres
  const [filters, setFilters] = useState<Filters>({
    status: 'all', // Modifié de 'available' à 'all' pour montrer tous les business par défaut
    type: 'all',
    category: 'all',
    priceRange: 'all',
    sortBy: 'newest',
    search: ''
  });
  
  const [categories, setCategories] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchBusinesses();
  }, []);

  // Mise à jour du filtre de type lorsque l'onglet change
  useEffect(() => {
    if (activeTab !== 'all') {
      setFilters(prev => ({ ...prev, type: activeTab }));
    } else {
      setFilters(prev => ({ ...prev, type: 'all' }));
    }
  }, [activeTab]);

  const fetchBusinesses = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Extraire les catégories uniques
      const uniqueCategories = [...new Set((data || []).map(b => b.category))].filter(Boolean);
      setCategories(uniqueCategories);
      
      setBusinesses(data || []);
    } catch (err) {
      console.error('Erreur lors du chargement des business:', err);
      setError('Une erreur est survenue lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  // Calcul du prix d'entrée pour l'acquisition progressive
  const calculateEntryPrice = (business: Business) => {
    const entryPercentage = business.entry_price_percentage || 40;
    return Math.round(business.price * entryPercentage / 100);
  };

  // Filtre et tri des business
  const filteredBusinesses = businesses.filter(business => {
    // Filtrer par statut
    if (filters.status !== 'all' && business.status !== filters.status) return false;
    
    // Filtrer par type (physique / digital)
    if (filters.type !== 'all' && business.type !== filters.type) return false;
    
    // Filtrer par catégorie
    if (filters.category !== 'all' && business.category !== filters.category) return false;
    
    // Filtrer par gamme de prix
    if (filters.priceRange !== 'all') {
      if (filters.priceRange === 'low' && business.price > 500000) return false;
      if (filters.priceRange === 'medium' && (business.price <= 500000 || business.price > 1000000)) return false;
      if (filters.priceRange === 'high' && business.price <= 1000000) return false;
    }
    
    // Filtrer par recherche textuelle
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const matchName = business.name.toLowerCase().includes(searchTerm);
      const matchDescription = business.description?.toLowerCase().includes(searchTerm);
      const matchPitch = business.pitch?.toLowerCase().includes(searchTerm);
      const matchCategory = categoryMap[business.category]?.toLowerCase().includes(searchTerm);
      
      if (!(matchName || matchDescription || matchPitch || matchCategory)) return false;
    }
    
    return true;
  }).sort((a, b) => {
    // D'abord afficher les business disponibles avant les vendus
    if (a.status !== b.status) {
      return a.status === 'available' ? -1 : 1;
    }
    
    // Ensuite trier selon le critère sélectionné
    switch (filters.sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'potential-desc':
        return b.monthly_potential - a.monthly_potential;
      case 'newest':
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  // Grouper par type pour l'affichage par onglets
  const physicalBusinesses = filteredBusinesses.filter(b => b.type === 'physical');
  const digitalBusinesses = filteredBusinesses.filter(b => b.type === 'digital');
  
  // Détermine quels business afficher en fonction de l'onglet actif
  const displayedBusinesses = activeTab === 'all' 
    ? filteredBusinesses 
    : activeTab === 'physical' 
      ? physicalBusinesses 
      : digitalBusinesses;

  return (
    <main>
      {/* Hero Section avec fond dégradé */}
      <section className="bg-gradient-to-r from-tekki-blue to-tekki-orange relative min-h-[300px] flex items-center">
        <div className="absolute inset-0 bg-grid-white/10 bg-grid opacity-10"></div>
        <Container className="px-4 md:px-6 lg:px-8"> 
          {/* Ajout de classes pour augmenter le padding supérieur sur mobile */}
          <div className="pt-24 pb-16 md:py-24 relative z-10">
            <div className="max-w-3xl mx-auto text-center text-white">
              <h1 className="text-3xl md:text-5xl font-bold mb-6">
                Business Clé en Main
              </h1>
              <p className="text-lg md:text-xl opacity-90">
                Acquérez un business prêt à générer des revenus sans partir de zéro
              </p>
              
              {/* Badges de succès */}
              <div className="flex flex-wrap justify-center gap-2 mt-8">
                <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                  +{displayedBusinesses.length} business créés
                </span>
                <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                  Accompagnement inclus
                </span>
                <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                  Démarrez en moins d'un mois
                </span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Onglets pour distinction physique/digital */}
      <section className="bg-white border-b sticky top-0 z-20">
        <Container className="px-2 md:px-4 lg:px-8"> {/* Marges réduites sur mobile uniquement */}
          <div className="flex overflow-x-auto -mb-px">
            <button
              onClick={() => setActiveTab('all')}
              className={cn(
                "px-4 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors",
                activeTab === 'all'
                  ? "border-tekki-blue text-tekki-blue"
                  : "border-transparent text-gray-600 hover:text-tekki-blue hover:border-tekki-blue/30"
              )}
            >
              Tous les business
            </button>
            <button
              onClick={() => setActiveTab('physical')}
              className={cn(
                "px-4 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors flex items-center",
                activeTab === 'physical'
                  ? "border-tekki-blue text-tekki-blue"
                  : "border-transparent text-gray-600 hover:text-tekki-blue hover:border-tekki-blue/30"
              )}
            >
              <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
              <span className="whitespace-nowrap">E-commerce (Physique)</span>
            </button>
            <button
              onClick={() => setActiveTab('digital')}
              className={cn(
                "px-4 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors flex items-center",
                activeTab === 'digital'
                  ? "border-tekki-coral text-tekki-coral"
                  : "border-transparent text-gray-600 hover:text-tekki-coral hover:border-tekki-coral/30"
              )}
            >
              <div className="w-2 h-2 rounded-full bg-tekki-coral mr-2"></div>
              <span className="whitespace-nowrap">Business Digital</span>
            </button>
          </div>
        </Container>
      </section>

      {/* Barre de filtres */}
      <section className="py-6 bg-gray-50 border-b">
        <Container className="px-2 md:px-4 lg:px-8"> {/* Marges réduites sur mobile uniquement */}
          <div className="flex flex-col md:flex-row gap-4 items-start justify-between">
            {/* Bouton pour afficher/masquer les filtres sur mobile */}
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg shadow-sm md:hidden w-full justify-center"
            >
              <Filter className="w-4 h-4" />
              <span>{showFilters ? "Masquer les filtres" : "Afficher les filtres"}</span>
            </button>
            
            {/* Filtres */}
            <div className={cn(
              "w-full md:flex items-center gap-3 flex-wrap",
              showFilters ? "flex flex-col sm:flex-row gap-3" : "hidden md:flex"
            )}>
              {/* Statut */}
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as any }))}
                className="px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-tekki-coral bg-white w-full md:w-auto"
              >
                <option value="all">Tous les statuts</option>
                <option value="available">Disponibles</option>
                <option value="sold">Déjà vendus</option>
              </select>

              {/* Catégorie */}
              <select
                value={filters.category}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                className="px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-tekki-coral bg-white w-full md:w-auto"
              >
                <option value="all">Toutes les catégories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {categoryMap[category] || category}
                  </option>
                ))}
              </select>

              {/* Gamme de prix */}
              <select
                value={filters.priceRange}
                onChange={(e) => setFilters(prev => ({ ...prev, priceRange: e.target.value as any }))}
                className="px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-tekki-coral bg-white w-full md:w-auto"
              >
                <option value="all">Tous les prix</option>
                <option value="low">Moins de {formatPrice(500000)}</option>
                <option value="medium">{formatPrice(500000)} - {formatPrice(1000000)}</option>
                <option value="high">Plus de {formatPrice(1000000)}</option>
              </select>

              {/* Tri */}
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                className="px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-tekki-coral bg-white w-full md:w-auto"
              >
                <option value="newest">Plus récents</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
                <option value="potential-desc">Potentiel le plus élevé</option>
              </select>
            </div>
            
            {/* Barre de recherche */}
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher un business..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-tekki-coral bg-white"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Résultats de recherche */}
      <section className="py-12">
        <Container className="px-2 md:px-4 lg:px-8"> {/* Marges réduites sur mobile uniquement */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-tekki-coral"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 text-red-700 p-4 rounded-lg">
              <p>{error}</p>
              <button 
                onClick={fetchBusinesses}
                className="mt-2 px-4 py-2 bg-white rounded border border-red-200 hover:bg-red-50"
              >
                Réessayer
              </button>
            </div>
          ) : displayedBusinesses.length > 0 ? (
            <>
              {/* Nombre de résultats - Optimisé pour mobile */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-8">
                <h2 className="text-xl font-bold text-gray-800">
                  {displayedBusinesses.length} résultats
                </h2>
                
                {/* Statistiques sur les types de business - Optimisé pour mobile */}
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span className="whitespace-nowrap">{physicalBusinesses.length} business physiques</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full">
                    <div className="w-2 h-2 rounded-full bg-tekki-coral"></div>
                    <span className="whitespace-nowrap">{digitalBusinesses.length} business digitaux</span>
                  </div>
                </div>
              </div>
              
              {/* Séparation des business disponibles et vendus */}
              {/* Business disponibles */}
              {displayedBusinesses.filter(b => b.status === 'available').length > 0 && (
                <>
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">
                    Business disponibles
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8 md:gap-8 mb-12">
                    {displayedBusinesses
                      .filter(b => b.status === 'available')
                      .map((business) => (
                        <BusinessCard key={business.id} business={business} calculateEntryPrice={calculateEntryPrice} />
                      ))}
                  </div>
                </>
              )}
              
              {/* Business vendus - montré seulement si le filtre statut est 'all' ou 'sold' */}
              {(filters.status === 'all' || filters.status === 'sold') && 
                displayedBusinesses.filter(b => b.status === 'sold').length > 0 && (
                <>
                  <h3 className="text-xl font-semibold text-gray-800 mb-6 mt-8">
                    Business déjà vendus
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8 md:gap-8 opacity-90">
                    {displayedBusinesses
                      .filter(b => b.status === 'sold')
                      .map((business) => (
                        <BusinessCard key={business.id} business={business} calculateEntryPrice={calculateEntryPrice} />
                      ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <div className="mb-4 text-gray-400">
                <Search className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">Aucun résultat trouvé</h3>
              <p className="text-gray-600 mb-6">
                Aucun business ne correspond à vos critères de recherche.
              </p>
              <button
                onClick={() => {
                  setFilters({
                    status: 'available',
                    type: activeTab === 'all' ? 'all' : activeTab,
                    category: 'all',
                    priceRange: 'all',
                    sortBy: 'newest',
                    search: ''
                  });
                }}
                className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Réinitialiser les filtres
              </button>
            </div>
          )}
        </Container>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-50 py-16 border-t">
        <Container className="px-2 md:px-4 lg:px-8"> {/* Marges réduites sur mobile uniquement */}
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Vous ne trouvez pas ce que vous cherchez?</h2>
            <p className="text-lg text-gray-600 mb-8">
              Nous développons constamment de nouveaux business. Contactez-nous pour nous faire part 
              de vos besoins spécifiques ou pour être informé dès qu'un business correspondant à vos 
              critères sera disponible.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="https://wa.me/221781362728"
                target="_blank"
                className="px-6 py-3 bg-tekki-blue text-white rounded-lg hover:bg-tekki-blue/90 transition-colors flex items-center justify-center"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" className="mr-2 fill-current">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
                Contactez-nous
              </Link>
              <Link 
                href="/comparatif-acquisition"
                className="px-6 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Comparer les types de business
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}

// Composant de carte business
function BusinessCard({ 
  business, 
  calculateEntryPrice 
}: { 
  business: Business, 
  calculateEntryPrice: (business: Business) => number 
}) {
  const typeColor = {
    physical: 'bg-blue-100 text-blue-800',
    digital: 'bg-tekki-coral/10 text-tekki-coral'
  };

  const typeText = {
    physical: 'E-Commerce',
    digital: 'Digital'
  };

  const statusColor = {
    available: 'bg-green-100 text-green-800',
    reserved: 'bg-amber-100 text-amber-800',
    sold: 'bg-red-100 text-red-800'
  };

  const statusText = {
    available: 'Disponible',
    reserved: 'Réservé',
    sold: 'Vendu'
  };

  return (
    <div 
      className={cn(
        "bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all hover:shadow-lg h-full flex flex-col",
        business.status === 'sold' ? 'opacity-80' : ''
      )}
    >
      {/* Image du business */}
      <div className="aspect-[4/3] relative overflow-hidden">
        <img 
          src={business.images[0]?.src || '/images/placeholder-business.jpg'} 
          alt={business.name}
          className="object-cover w-full h-full transition-transform hover:scale-105"
        />
        
        {/* Badges de statut et type */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor[business.status]}`}>
            {statusText[business.status]}
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${typeColor[business.type]}`}>
            {typeText[business.type]}
          </span>
        </div>
        
        {/* Badge "Vendu" pour les business vendus */}
        {business.status === 'sold' && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white text-2xl font-bold rotate-[-15deg]">VENDU</span>
          </div>
        )}
      </div>
      
      {/* Contenu de la carte */}
      <div className="p-4 sm:p-6 flex-grow flex flex-col">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
          {business.name}
        </h3>
        
        {/* Catégorie */}
        <div className="mb-3">
          <span className="text-sm text-gray-500">
            {categoryMap[business.category] || business.category || 'Autre'}
          </span>
        </div>
        
        {/* Description courte */}
        <p className="text-gray-600 mb-6 line-clamp-2 text-sm">
          {business.pitch || business.description}
        </p>
        
        {/* Informations clés */}
        <div className="space-y-3 mb-6 mt-auto">
          {/* Prix */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Prix</span>
            <div className="text-right">
              {business.original_price > business.price && (
                <span className="line-through text-gray-400 text-xs">
                  {formatPrice(business.original_price)}
                </span>
              )}
              <span className={cn(
                "font-bold block",
                business.type === 'physical' ? 'text-tekki-blue' : 'text-tekki-coral'
              )}>
                {business.status === 'available' && business.progressive_option_enabled
                  ? `À partir de ${formatPrice(calculateEntryPrice(business))}`
                  : formatPrice(business.price)
                }
              </span>
            </div>
          </div>
          
          {/* Potentiel mensuel */}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Potentiel mensuel</span>
            <span className="font-bold text-green-600">
              {formatPrice(business.monthly_potential)}
            </span>
          </div>
          
          {/* Temps de mise en place */}
          {business.setup_time && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Démarrage</span>
              <span className="text-gray-700">{business.setup_time}</span>
            </div>
          )}
          
          {/* Type d'acquisition */}
          {business.status === 'available' && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Acquisition</span>
              <span className="text-gray-700">
                {business.progressive_option_enabled 
                  ? 'Standard ou Progressive' 
                  : 'Standard'}
              </span>
            </div>
          )}
        </div>
        
        {/* Bouton CTA */}
        {business.status === 'available' ? (
          <Link 
            href={`/business/${business.slug}`}
            className={cn(
              "w-full py-3 rounded-lg flex items-center justify-center group",
              business.type === 'physical' 
                ? "bg-tekki-blue text-white hover:bg-tekki-blue/90" 
                : "bg-tekki-coral text-white hover:bg-tekki-coral/90"
            )}
          >
            Voir les détails
            <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        ) : (
          <button 
            className="w-full bg-gray-100 text-gray-500 py-3 rounded-lg cursor-not-allowed"
            disabled
          >
            {business.status === 'sold' ? 'Business vendu' : 'Business réservé'}
          </button>
        )}
      </div>
    </div>
  );
}