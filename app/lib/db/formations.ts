// app/lib/db/formations.ts
import { supabase } from '../supabase';
import type { Formation } from '@/app/types/database';

/**
 * Récupère toutes les formations
 */
export async function getFormations() {
  const { data, error } = await supabase
    .from('formations')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Formation[];
}

/**
 * Récupère une formation par son slug
 */
export async function getFormationBySlug(slug: string) {
  const { data, error } = await supabase
    .from('formations')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) throw error;
  return data as Formation;
}

/**
 * Récupère des formations par catégorie
 */
export async function getFormationsByCategory(category: string) {
  const { data, error } = await supabase
    .from('formations')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Formation[];
}

/**
 * Récupère un nombre limité de formations (pour la page d'accueil par exemple)
 */
export async function getTopFormations(limit: number = 3) {
  const { data, error } = await supabase
    .from('formations')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as Formation[];
}

/**
 * Crée une nouvelle formation
 */
export async function createFormation(formation: Omit<Formation, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('formations')
    .insert([formation])
    .select()
    .single();

  if (error) throw error;
  return data as Formation;
}

/**
 * Met à jour une formation existante
 */
export async function updateFormation(id: string, formation: Partial<Formation>) {
  const { data, error } = await supabase
    .from('formations')
    .update(formation)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Formation;
}

/**
 * Supprime une formation
 */
export async function deleteFormation(id: string) {
  const { error } = await supabase
    .from('formations')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}