// app/lib/db/jobs.ts
import { supabase } from '../supabase';
import type { JobOpening, JobApplication, JobOpeningFilters, JobApplicationFilters } from '../../types/database';

/**
 * Récupérer toutes les offres d'emploi avec filtres optionnels
 */
export async function getJobOpenings(filters: JobOpeningFilters = {}): Promise<JobOpening[]> {
  let query = supabase
    .from('job_openings')
    .select('*')
    .order('created_at', { ascending: false });
  
  // Appliquer les filtres s'ils sont définis
  if (filters.department) {
    query = query.eq('department', filters.department);
  }
  
  if (filters.location) {
    query = query.eq('location', filters.location);
  }
  
  if (filters.type) {
    query = query.eq('type', filters.type);
  }
  
  if (filters.isActive !== undefined) {
    query = query.eq('is_active', filters.isActive);
  }
  
  if (filters.searchTerm) {
    const term = `%${filters.searchTerm}%`;
    query = query.or(`title.ilike.${term},description.ilike.${term}`);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Erreur lors de la récupération des offres d\'emploi:', error);
    throw error;
  }
  
  return data || [];
}

/**
 * Récupérer une offre d'emploi par son slug
 */
export async function getJobOpeningBySlug(slug: string): Promise<JobOpening | null> {
  const { data, error } = await supabase
    .from('job_openings')
    .select('*')
    .eq('slug', slug)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Pas trouvé
    }
    console.error('Erreur lors de la récupération de l\'offre d\'emploi:', error);
    throw error;
  }
  
  return data;
}

/**
 * Récupérer une offre d'emploi par son ID
 */
export async function getJobOpeningById(id: string): Promise<JobOpening | null> {
  const { data, error } = await supabase
    .from('job_openings')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Pas trouvé
    }
    console.error('Erreur lors de la récupération de l\'offre d\'emploi:', error);
    throw error;
  }
  
  return data;
}

/**
 * Créer une nouvelle offre d'emploi
 */
export async function createJobOpening(jobOpening: Omit<JobOpening, 'id' | 'created_at' | 'updated_at'>): Promise<JobOpening> {
  const { data, error } = await supabase
    .from('job_openings')
    .insert([jobOpening])
    .select()
    .single();
  
  if (error) {
    console.error('Erreur lors de la création de l\'offre d\'emploi:', error);
    throw error;
  }
  
  return data;
}

/**
 * Mettre à jour une offre d'emploi
 */
export async function updateJobOpening(id: string, updates: Partial<JobOpening>): Promise<JobOpening> {
  // Ajouter l'horodatage de mise à jour
  const updatedJob = {
    ...updates,
    updated_at: new Date().toISOString()
  };
  
  const { data, error } = await supabase
    .from('job_openings')
    .update(updatedJob)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Erreur lors de la mise à jour de l\'offre d\'emploi:', error);
    throw error;
  }
  
  return data;
}

/**
 * Supprimer une offre d'emploi
 */
export async function deleteJobOpening(id: string): Promise<void> {
  const { error } = await supabase
    .from('job_openings')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Erreur lors de la suppression de l\'offre d\'emploi:', error);
    throw error;
  }
}

/**
 * Basculer l'état actif d'une offre d'emploi
 */
export async function toggleJobOpeningActive(id: string, isActive: boolean): Promise<JobOpening> {
  const { data, error } = await supabase
    .from('job_openings')
    .update({ is_active: isActive, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Erreur lors du basculement de l\'état de l\'offre d\'emploi:', error);
    throw error;
  }
  
  return data;
}

/**
 * Basculer l'état en vedette d'une offre d'emploi
 */
export async function toggleJobOpeningFeatured(id: string, isFeatured: boolean): Promise<JobOpening> {
  const { data, error } = await supabase
    .from('job_openings')
    .update({ is_featured: isFeatured, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Erreur lors du basculement de l\'état vedette de l\'offre d\'emploi:', error);
    throw error;
  }
  
  return data;
}

/**
 * Récupérer toutes les candidatures avec filtres optionnels
 */
export async function getJobApplications(filters: JobApplicationFilters = {}): Promise<JobApplication[]> {
  let query = supabase
    .from('job_applications')
    .select(`
      *,
      job_openings (
        title
      )
    `)
    .order('created_at', { ascending: false });
  
  // Appliquer les filtres s'ils sont définis
  if (filters.status) {
    query = query.eq('status', filters.status);
  }
  
  if (filters.jobId) {
    query = query.eq('job_opening_id', filters.jobId);
  }
  
  if (filters.searchTerm) {
    const term = `%${filters.searchTerm}%`;
    query = query.or(`full_name.ilike.${term},email.ilike.${term},phone.ilike.${term}`);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Erreur lors de la récupération des candidatures:', error);
    throw error;
  }
  
  // Transformer les données pour inclure le titre du poste
  return (data || []).map(app => ({
    ...app,
    job_title: app.job_openings?.title || 'Poste inconnu'
  }));
}

/**
 * Récupérer une candidature par son ID
 */
export async function getJobApplicationById(id: string): Promise<JobApplication | null> {
  const { data, error } = await supabase
    .from('job_applications')
    .select(`
      *,
      job_openings (
        *
      )
    `)
    .eq('id', id)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') {
      return null; // Pas trouvé
    }
    console.error('Erreur lors de la récupération de la candidature:', error);
    throw error;
  }
  
  return {
    ...data,
    job_title: data.job_openings?.title || 'Poste inconnu'
  };
}

/**
 * Créer une nouvelle candidature
 */
export async function createJobApplication(application: Omit<JobApplication, 'id' | 'created_at' | 'updated_at' | 'status' | 'notes'>): Promise<JobApplication> {
  const { data, error } = await supabase
    .from('job_applications')
    .insert([{
      ...application,
      status: 'new'
    }])
    .select()
    .single();
  
  if (error) {
    console.error('Erreur lors de la création de la candidature:', error);
    throw error;
  }
  
  return data;
}

/**
 * Mettre à jour le statut d'une candidature
 */
export async function updateJobApplicationStatus(id: string, status: JobApplication['status'], notes?: string): Promise<JobApplication> {
  const updates: any = {
    status,
    updated_at: new Date().toISOString()
  };
  
  if (notes !== undefined) {
    updates.notes = notes;
  }
  
  const { data, error } = await supabase
    .from('job_applications')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Erreur lors de la mise à jour du statut de la candidature:', error);
    throw error;
  }
  
  return data;
}

/**
 * Supprimer une candidature
 */
export async function deleteJobApplication(id: string): Promise<void> {
  const { error } = await supabase
    .from('job_applications')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Erreur lors de la suppression de la candidature:', error);
    throw error;
  }
}