// app/lib/utils/formation-utils.ts
import type { Formation } from '@/app/types/database';

/**
 * Format de données pour le formulaire d'édition de formation
 */
export interface FormationFormData {
  slug: string;
  title: string;
  category: string;
  description: string;
  long_description: string;
  duration: string;
  sessions: string;
  level: 'Débutant' | 'Intermédiaire' | 'Avancé' | 'Tous niveaux';
  price: string;
  price_amount: number;
  icon: string;
  benefits: string[];
  modules: {
    title: string;
    description: string;
    lessons: string[];
  }[];
  prerequisites: string[];
  formateur: {
    name: string;
    role: string;
    bio: string;
  };
  prochaine_sessions: {
    date: string;
    places: number;
  }[];
}

/**
 * Convertit une formation de la base de données en format pour le formulaire
 */
export function formationToFormData(formation: Formation): FormationFormData {
  return {
    slug: formation.slug,
    title: formation.title,
    category: formation.category,
    description: formation.description,
    long_description: formation.long_description,
    duration: formation.duration,
    sessions: formation.sessions,
    level: formation.level as 'Débutant' | 'Intermédiaire' | 'Avancé' | 'Tous niveaux',
    price: formation.price,
    price_amount: formation.price_amount,
    icon: formation.icon,
    benefits: Array.isArray(formation.benefits) ? formation.benefits : [],
    modules: Array.isArray(formation.modules) ? formation.modules : [],
    prerequisites: Array.isArray(formation.prerequisites) ? formation.prerequisites : [],
    formateur: formation.formateur || { name: '', role: '', bio: '' },
    prochaine_sessions: Array.isArray(formation.prochaine_sessions) ? formation.prochaine_sessions : []
  };
}

/**
 * Convertit les données du formulaire en objet Formation pour la base de données
 */
export function formDataToFormation(formData: FormationFormData): Omit<Formation, 'id' | 'created_at' | 'updated_at'> {
  return {
    slug: formData.slug,
    title: formData.title,
    category: formData.category,
    description: formData.description,
    long_description: formData.long_description,
    duration: formData.duration,
    sessions: formData.sessions,
    level: formData.level,
    price: formData.price,
    price_amount: formData.price_amount,
    icon: formData.icon,
    benefits: formData.benefits,
    modules: formData.modules,
    prerequisites: formData.prerequisites,
    formateur: formData.formateur,
    prochaine_sessions: formData.prochaine_sessions
  };
}

/**
 * Formatage du prix pour l'affichage
 */
export function formatPrice(price: string): string {
  return price;
}