// app/lib/cloudinaryUpload.ts

import { v4 as uuidv4 } from 'uuid';
import cloudinary from './cloudinary';

export const cloudinaryUploadService = {
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

      // Convertir le fichier en base64
      const base64data = await this.fileToBase64(file);
      
      // Générer un nom de fichier unique (sans l'extension car Cloudinary la gère)
      const fileName = `${uuidv4()}`;
      
      // Télécharger le fichier vers Cloudinary
      const result = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader.upload(
          base64data as string,
          {
            folder: folder,
            public_id: fileName,
            resource_type: 'image',
            quality: 'auto',
            fetch_format: 'auto',
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
      });

      return result.secure_url;
    } catch (error) {
      console.error("Erreur lors de l'upload de l'image:", error);
      return null;
    }
  },

  /**
   * Supprime une image de Cloudinary
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

      // Supprimer l'image
      const result = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader.destroy(
          publicId,
          { resource_type: 'image' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
      });

      return result.result === 'ok';
    } catch (error) {
      console.error("Erreur lors de la suppression de l'image:", error);
      return false;
    }
  },

  /**
   * Convertit un fichier en base64
   * @param file Fichier à convertir
   * @returns Chaîne base64 du fichier
   */
  async fileToBase64(file: File): Promise<string | ArrayBuffer | null> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });
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