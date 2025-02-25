// app/hooks/useBusinessFilters.ts

import { useState, useMemo } from 'react';
import { Business, BusinessStatus, BusinessType } from '../data-OLD/businesses';

interface FilterState {
  status: BusinessStatus | 'all';
  type: BusinessType | 'all';
  category: string | 'all';
  search: string;
}

interface UseBusinessFiltersReturn {
  filters: FilterState;
  setFilters: (filters: Partial<FilterState>) => void;
  filteredBusinesses: Business[];
  categories: string[];
}

export const useBusinessFilters = (businesses: Business[]): UseBusinessFiltersReturn => {
  const [filters, setFiltersState] = useState<FilterState>({
    status: 'all',
    type: 'all',
    category: 'all',
    search: ''
  });

  // Extraire toutes les catégories uniques
  const categories = useMemo(() => 
    Array.from(new Set(businesses.map(b => b.category))),
    [businesses]
  );

  // Filtrer les business selon les critères
  const filteredBusinesses = useMemo(() => {
    return businesses.filter(business => {
      const matchesSearch = filters.search === '' || 
        business.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        business.description.toLowerCase().includes(filters.search.toLowerCase());

      const matchesStatus = filters.status === 'all' || 
        business.status === filters.status;

      const matchesType = filters.type === 'all' || 
        business.type === filters.type;

      const matchesCategory = filters.category === 'all' || 
        business.category === filters.category;

      return matchesSearch && matchesStatus && matchesType && matchesCategory;
    });
  }, [businesses, filters]);

  // Helper pour mettre à jour les filtres
  const setFilters = (newFilters: Partial<FilterState>) => {
    setFiltersState(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  return {
    filters,
    setFilters,
    filteredBusinesses,
    categories
  };
};