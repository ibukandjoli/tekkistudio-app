// app/lib/db.test.ts
import { supabase } from './supabase';

export async function testConnection() {
  try {
    const { data, error } = await supabase.from('test').select('*');
    if (error) throw error;
    console.log('Connexion réussie !');
    return true;
  } catch (error) {
    console.error('Erreur de connexion :', error);
    return false;
  }
}