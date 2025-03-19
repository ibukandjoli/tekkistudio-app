// app/lib/imageUpload.ts

import { v4 as uuidv4 } from 'uuid';
import { supabase } from './supabase';

/**
 * Service pour gérer l'upload d'images vers Supabase Storage
 */
export const imageUploadService = {
  /**
   * Télécharge une image vers Supabase Storage
   * @param file Fichier image à télécharger
   * @param folder Dossier de destination (par défaut: 'business-images')
   * @returns URL de l'image téléchargée ou null en cas d'erreur
   */
  async uploadImage(file: File, folder: string = 'business-images'): Promise<string | null> {
    try {
      // Vérifier si le fichier est une image
      if (!file.type.match(/image\/(jpeg|jpg|png|webp|gif)/i)) {
        throw new Error("Le fichier doit être une image (JPEG, PNG, WEBP ou GIF)");
      }

      // Générer un nom de fichier unique
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      // Télécharger le fichier vers Supabase Storage
      const { data, error } = await supabase.storage
        .from('media')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        throw error;
      }

      // Récupérer l'URL publique de l'image
      const { data: publicUrlData } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      return publicUrlData.publicUrl;
    } catch (error) {
      console.error("Erreur lors de l'upload de l'image:", error);
      return null;
    }
  },

  /**
   * Supprime une image de Supabase Storage
   * @param imageUrl URL de l'image à supprimer
   * @returns true si la suppression a réussi, false sinon
   */
  async deleteImage(imageUrl: string): Promise<boolean> {
    try {
      // Extraire le chemin du fichier de l'URL
      const baseUrl = supabase.storage.from('media').getPublicUrl('').data.publicUrl;
      const filePath = imageUrl.replace(baseUrl, '');

      // Supprimer le fichier
      const { error } = await supabase.storage
        .from('media')
        .remove([filePath]);

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      console.error("Erreur lors de la suppression de l'image:", error);
      return false;
    }
  }
};