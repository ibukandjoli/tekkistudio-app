// app/careers/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Briefcase, 
  MapPin, 
  Filter, 
  X, 
  Sparkles,
  AlertCircle,
  Loader2 
} from 'lucide-react';
import { getJobOpenings } from '@/app/lib/db/jobs';
import type { JobOpening, JobOpeningFilters } from '@/app/types/database';
import JobOpeningCard from '@/app/components/careers/JobOpeningCard';
import { Badge } from '@/app/components/ui/badge';

const CareersPage = () => {
  const [jobs, setJobs] = useState<JobOpening[]>([]);
  const [featuredJobs, setFeaturedJobs] = useState<JobOpening[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filtres
  const [filters, setFilters] = useState<JobOpeningFilters>({
    isActive: true,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [departments, setDepartments] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [jobTypes, setJobTypes] = useState<string[]>([]);
  
  // Indicateurs de filtres actifs
  const [activeFilters, setActiveFilters] = useState({
    department: '',
    location: '',
    type: '',
  });
  
  // Effet pour configurer le header
  useEffect(() => {
    // Fonction pour mettre à jour la classe du header
    const updateHeaderClass = () => {
      const header = document.querySelector('header');
      if (header) {
        // Forcer le header à être toujours coloré (fond bleu)
        header.classList.add('bg-tekki-blue', 'text-white');
        header.classList.remove('bg-transparent');
      }
    };

    // Appliquer immédiatement
    updateHeaderClass();

    // Nettoyer lors du démontage du composant
    return () => {
      const header = document.querySelector('header');
      if (header) {
        // Restaurer les classes d'origine si nécessaire
        header.classList.remove('bg-tekki-blue', 'text-white');
      }
    };
  }, []);
  
  useEffect(() => {
    fetchJobs();
  }, []);
  
  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const allJobs = await getJobOpenings({ isActive: true });
      
      // Extraire les emplois en vedette
      const featured = allJobs.filter(job => job.is_featured);
      const regular = allJobs.filter(job => !job.is_featured);
      
      // Trier par date de création (les plus récents d'abord)
      regular.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      
      setJobs(regular);
      setFeaturedJobs(featured);
      
      // Extraire les options de filtres uniques
      setDepartments([...new Set(allJobs.map(job => job.department))]);
      setLocations([...new Set(allJobs.map(job => job.location))]);
      setJobTypes([...new Set(allJobs.map(job => job.type))]);
      
    } catch (err) {
      console.error('Erreur lors du chargement des offres d\'emploi:', err);
      setError('Une erreur est survenue lors du chargement des offres d\'emploi.');
    } finally {
      setLoading(false);
    }
  };
  
  const applyFilters = () => {
    setFilters({
      ...filters,
      department: activeFilters.department || undefined,
      location: activeFilters.location || undefined,
      type: activeFilters.type || undefined,
      searchTerm: searchTerm || undefined,
    });
  };
  
  const clearFilters = () => {
    setActiveFilters({
      department: '',
      location: '',
      type: '',
    });
    setSearchTerm('');
    setFilters({ isActive: true });
  };
  
  const filteredJobs = jobs.filter(job => {
    let matchesDepartment = true;
    let matchesLocation = true;
    let matchesType = true;
    let matchesSearch = true;
    
    if (activeFilters.department) {
      matchesDepartment = job.department === activeFilters.department;
    }
    
    if (activeFilters.location) {
      matchesLocation = job.location === activeFilters.location;
    }
    
    if (activeFilters.type) {
      matchesType = job.type === activeFilters.type;
    }
    
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      matchesSearch = job.title.toLowerCase().includes(search) || 
                     job.description.toLowerCase().includes(search) ||
                     job.department.toLowerCase().includes(search);
    }
    
    return matchesDepartment && matchesLocation && matchesType && matchesSearch;
  });
  
  const countActiveFilters = () => {
    return Object.values(activeFilters).filter(Boolean).length + (searchTerm ? 1 : 0);
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-tekki-coral" />
      </div>
    );
  }

  return (
    <main className="pb-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-tekki-blue to-tekki-coral py-16 pt-32 text-white">
        <div className="mx-auto px-3 md:px-6 lg:px-8 w-full max-w-[1536px]">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Rejoignez l'équipe TEKKI Studio
            </h1>
            <p className="text-xl opacity-90 mb-8">
              Participez à notre mission de permettre à toute personne de lancer son business en ligne facilement et sans partir de zéro.
            </p>
            
            {/* Barre de recherche */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-white/70" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher un poste, un département..."
                className="w-full bg-white/10 backdrop-blur-sm text-white placeholder-white/70 py-3 pl-12 pr-4 rounded-full border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Section de contenu principal */}
      <section className="py-12">
        <div className="mx-auto px-3 md:px-6 lg:px-8 w-full max-w-[1536px]">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-8">
            {/* Sidebar de filtres */}
            <div className="lg:col-span-1">
              <div className="bg-white shadow-sm rounded-xl p-4 sm:p-6 border border-gray-200 sticky top-24">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-bold text-tekki-blue text-lg">Filtres</h2>
                  {countActiveFilters() > 0 && (
                    <button
                      onClick={clearFilters}
                      className="text-sm text-tekki-coral hover:text-tekki-coral/80 flex items-center"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Effacer
                    </button>
                  )}
                </div>
                
                {/* Départements */}
                <div className="mb-6">
                  <h3 className="font-medium text-gray-700 mb-2 flex items-center">
                    <Briefcase className="h-4 w-4 mr-2 text-tekki-coral" />
                    Département
                  </h3>
                  <div className="space-y-2">
                    {departments.map((dept) => (
                      <label key={dept} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="department"
                          checked={activeFilters.department === dept}
                          onChange={() => setActiveFilters({...activeFilters, department: dept})}
                          className="form-radio h-4 w-4 text-tekki-coral focus:ring-tekki-coral"
                        />
                        <span className="ml-2 text-gray-600">{dept}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                {/* Localisations */}
                <div className="mb-6">
                  <h3 className="font-medium text-gray-700 mb-2 flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-tekki-coral" />
                    Localisation
                  </h3>
                  <div className="space-y-2">
                    {locations.map((loc) => (
                      <label key={loc} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="location"
                          checked={activeFilters.location === loc}
                          onChange={() => setActiveFilters({...activeFilters, location: loc})}
                          className="form-radio h-4 w-4 text-tekki-coral focus:ring-tekki-coral"
                        />
                        <span className="ml-2 text-gray-600">{loc}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                {/* Types de poste */}
                <div className="mb-6">
                  <h3 className="font-medium text-gray-700 mb-2 flex items-center">
                    <Filter className="h-4 w-4 mr-2 text-tekki-coral" />
                    Type de poste
                  </h3>
                  <div className="space-y-2">
                    {jobTypes.map((type) => (
                      <label key={type} className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="type"
                          checked={activeFilters.type === type}
                          onChange={() => setActiveFilters({...activeFilters, type: type})}
                          className="form-radio h-4 w-4 text-tekki-coral focus:ring-tekki-coral"
                        />
                        <span className="ml-2 text-gray-600">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <button
                  onClick={applyFilters}
                  className="w-full bg-tekki-blue text-white py-2 rounded-lg hover:bg-tekki-blue/90 transition-colors"
                >
                  Appliquer les filtres
                </button>
              </div>
            </div>
            
            {/* Liste des offres */}
            <div className="lg:col-span-3">
              {/* Compteur de résultats */}
              <div className="flex justify-between items-center mb-6">
                <p className="text-gray-600">
                  {filteredJobs.length} {filteredJobs.length > 1 ? 'postes trouvés' : 'poste trouvé'}
                  {countActiveFilters() > 0 && ' avec les filtres appliqués'}
                </p>
                
                {countActiveFilters() > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-sm flex items-center text-tekki-blue hover:text-tekki-coral"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Effacer les filtres
                  </button>
                )}
              </div>
              
              {/* Jobs en vedette */}
              {featuredJobs.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center space-x-2 mb-4">
                    <Sparkles className="h-5 w-5 text-purple-500" />
                    <h2 className="text-xl font-bold text-tekki-blue">Postes en vedette</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {featuredJobs.map((job) => (
                      <JobOpeningCard key={job.id} job={job} featured={true} />
                    ))}
                  </div>
                </div>
              )}
              
              {/* Tous les jobs */}
              {filteredJobs.length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                  {filteredJobs.map((job) => (
                    <JobOpeningCard key={job.id} job={job} />
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-8 text-center border border-gray-200">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="h-8 w-8 text-gray-500" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Aucun poste trouvé</h3>
                  <p className="text-gray-500 mb-4">
                    Aucun poste ne correspond à vos critères de recherche.
                  </p>
                  <button
                    onClick={clearFilters}
                    className="text-tekki-coral hover:text-tekki-coral/80"
                  >
                    Effacer les filtres
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-12 bg-gray-50 border-t border-gray-200">
        <div className="mx-auto px-3 md:px-6 lg:px-8 w-full max-w-[1536px]">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-tekki-blue mb-4">
              Vous ne trouvez pas le poste idéal ?
            </h2>
            <p className="text-gray-600 mb-8">
              Si vous êtes passionné par notre mission et que vous pensez pouvoir apporter une valeur ajoutée à notre équipe, n'hésitez pas à nous envoyer une candidature spontanée.
            </p>
            <Link
              href="/careers/spontaneous"
              className="inline-flex items-center bg-tekki-coral hover:bg-tekki-coral/90 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Candidature spontanée
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default CareersPage;