// app/lib/db/index.ts
import { supabase } from '../supabase';
import type { 
  Business, 
  Brand, 
  Formation, 
  WhatsAppSubscriber,
  BusinessInterest,
  FormationEnrollment,
  Payment 
} from '../../types/database';

// Fonctions pour les Business
export async function getBusinesses() {
  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Business[];
}

export async function getBusinessBySlug(slug: string) {
  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) throw error;
  return data as Business;
}

export async function getAvailableBusinesses() {
  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('status', 'available')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Business[];
}

// Fonctions pour les Marques (Brands)
export async function getBrands() {
  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Brand[];
}

export async function getBrandBySlug(slug: string) {
  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) throw error;
  return data as Brand;
}

export async function getTopBrands(limit: number = 3) {
  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as Brand[];
}

// Fonction pour les Formations
export async function getFormations() {
  const { data, error } = await supabase
    .from('formations')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Formation[];
}

// Fonctions administratives
export async function createBusiness(business: Omit<Business, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('businesses')
    .insert([business])
    .select()
    .single();

  if (error) throw error;
  return data as Business;
}

export async function updateBusiness(id: string, business: Partial<Business>) {
  const { data, error } = await supabase
    .from('businesses')
    .update(business)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Business;
}

export async function deleteBusiness(id: string) {
  const { error } = await supabase
    .from('businesses')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Fonction pour les WhatsApp Subscribers
export async function createWhatsAppSubscriber(
  subscriber: Omit<WhatsAppSubscriber, 'id' | 'subscribed_at' | 'last_message_sent'>
) {
  const { data, error } = await supabase
    .from('whatsapp_subscribers')
    .insert([subscriber])
    .select()
    .single();

  if (error) throw error;
  return data as WhatsAppSubscriber;
}

// Fonctions pour les Business Interests
export async function createBusinessInterest(
  interest: Omit<BusinessInterest, 'id' | 'status' | 'created_at' | 'updated_at'>
) {
  const { data, error } = await supabase
    .from('business_interests')
    .insert([interest])
    .select()
    .single();

  if (error) throw error;
  return data as BusinessInterest;
}

// Fonctions pour les Formation Enrollments
export async function createFormationEnrollment(
  enrollment: Omit<FormationEnrollment, 'id' | 'payment_status' | 'created_at' | 'updated_at'>
) {
  const { data, error } = await supabase
    .from('formation_enrollments')
    .insert([enrollment])
    .select()
    .single();

  if (error) throw error;
  return data as FormationEnrollment;
}

// Fonctions pour les Payments
export async function createPayment(payment: Omit<Payment, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('payments')
    .insert([payment])
    .select()
    .single();

  if (error) throw error;
  return data as Payment;
}