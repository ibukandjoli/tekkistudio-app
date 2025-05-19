// app/lib/imageUpload.ts

'use client';

import { v4 as uuidv4 } from 'uuid';

/**
 * Service pour gérer l'upload d'images vers Cloudinary
 */
export const imageUploadService = {
  /**
   * Télécharge une image vers Cloudinary
   * @param file Fichier image à télécharger
   * @param folder Dossier de destination (par défaut: 'tekki-studio/business-images')
   * @returns URL de l'image téléchargée ou null en cas d'erreur
   */
  async uploadImage(file: File, folder: string = 'tekki-studio/business-images'): Promise<string | null> {
    try {
      // Vérifier si le fichier est une image
      if (!file.type.match(/image\/(jpeg|jpg|png|webp|gif)/i)) {
        throw new Error("Le fichier doit être une image (JPEG, PNG, WEBP ou GIF)");
      }

      // Préparer les données pour l'upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'tekki_preset'); // Créez un preset non-signé dans Cloudinary
      formData.append('folder', folder);
      
      // Uploader directement via l'API Cloudinary (sans SDK)
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`Erreur lors de l'upload: ${response.statusText}`);
      }
      
      const result = await response.json();
      return result.secure_url;
    } catch (error) {
      console.error("Erreur lors de l'upload de l'image:", error);
      return null;
    }
  },

  /**
   * Supprime une image de Cloudinary (via une API serverless)
   * @param imageUrl URL de l'image à supprimer
   * @returns true si la suppression a réussi, false sinon
   */
  async deleteImage(imageUrl: string): Promise<boolean> {
    try {
      // Extraire l'ID public de l'URL Cloudinary
      const publicId = this.extractPublicIdFromUrl(imageUrl);
      
      if (!publicId) {
        throw new Error("Impossible d'extraire l'identifiant public de l'URL");
      }

      // Cette fonction devrait appeler une API serverless pour supprimer l'image
      // car la suppression nécessite l'API_SECRET de Cloudinary qui ne doit pas être exposé au client
      const response = await fetch('/api/delete-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ publicId }),
      });

      if (!response.ok) {
        throw new Error(`Erreur lors de la suppression: ${response.statusText}`);
      }
      
      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error("Erreur lors de la suppression de l'image:", error);
      return false;
    }
  },

  /**
   * Extrait l'ID public d'une URL Cloudinary
   * @param url URL Cloudinary
   * @returns ID public
   */
  extractPublicIdFromUrl(url: string): string | null {
    // Format typique: https://res.cloudinary.com/cloud-name/image/upload/v1234567890/folder/public_id.ext
    const regex = /\/v\d+\/(.+?)\.[a-zA-Z0-9]+$/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }
};