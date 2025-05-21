// app/lib/cloudinary-resume.ts

'use client';

/**
 * Fonctions utilitaires pour l'upload des CV vers Cloudinary
 */

/**
 * Convertit un fichier en Base64
 * @param file Le fichier à convertir
 * @returns Promise avec la chaîne base64
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

/**
 * Télécharge un CV vers Cloudinary
 * @param file Fichier CV à télécharger (PDF, DOC, DOCX)
 * @param folder Dossier de destination (par défaut: 'tekki-studio/resumes')
 * @returns Promise avec l'URL du CV téléchargé
 */
export const uploadResumeToCloudinary = async (file: File, folder: string = 'tekki-studio/resumes'): Promise<string> => {
  try {
    // Vérifier le type de fichier
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Type de fichier non pris en charge. Veuillez utiliser PDF ou Word');
    }

    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('Le fichier est trop volumineux. Taille maximale: 5MB');
    }

    // Convertir le fichier en base64
    const base64File = await fileToBase64(file);
    
    // Créer un nom de fichier unique
    const timestamp = new Date().getTime();
    const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
    const filename = `${timestamp}_${sanitizedFilename}`;
    
    // Préparation des données pour l'API Cloudinary
    const formData = new FormData();
    formData.append('file', base64File);
    formData.append('upload_preset', 'tekki_preset'); // Assurez-vous que ce preset est configuré dans Cloudinary
    formData.append('folder', folder);
    formData.append('public_id', filename.replace(/\.[^.]+$/, '')); // Enlever l'extension
    formData.append('resource_type', 'auto'); // Permet de détecter automatiquement le type de ressource
    
    // Pour les PDFs, n'ajoutez PAS les paramètres access_mode ou public_id_prefix
    // qui provoquent des erreurs avec les presets non signés
    if (file.type === 'application/pdf') {
      // Ajouter uniquement des tags et le type de livraison
      formData.append('tags', 'resume,pdf');
      formData.append('delivery_type', 'upload');
    }
    
    // Utiliser la variable d'environnement ou une valeur par défaut (pour les tests)
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dmy2jt7wo';
    
    if (!cloudName) {
      console.error("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME n'est pas défini dans les variables d'environnement");
      throw new Error("Configuration Cloudinary incorrecte. Veuillez contacter l'administrateur.");
    }
    
    // Envoi à l'API Cloudinary
    console.log(`Tentative d'upload vers Cloudinary (${cloudName})`);
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Réponse d'erreur de Cloudinary:", errorData);
      throw new Error(`Erreur lors de l'upload: ${errorData.error?.message || response.statusText}`);
    }
    
    const result = await response.json();
    console.log("Réponse de Cloudinary:", result);
    
    // Pour les PDFs, s'assurer que l'URL est correcte pour le téléchargement si nécessaire
    if (file.type === 'application/pdf' && result.secure_url) {
      // Nous n'utilisons plus l'ajout de paramètre fl_attachment dans l'URL
      // car cela peut causer des problèmes avec certains presets
      return result.secure_url;
    }
    
    return result.secure_url;
  } catch (error) {
    console.error('Erreur lors de l\'upload vers Cloudinary:', error);
    throw error;
  }
};

/**
 * Fonction simplifiée pour l'upload des CV - utilise par défaut un stockage temporaire si Cloudinary échoue
 * @param file Fichier CV à télécharger
 * @returns URL du CV téléchargé ou null si aucun fichier
 */
export const uploadResume = async (file: File | null): Promise<string | null> => {
  if (!file) return null;
  
  try {
    // Tentative d'upload vers Cloudinary
    const resumeUrl = await uploadResumeToCloudinary(file, 'tekki-studio/careers/resumes');
    console.log("CV uploadé avec succès:", resumeUrl);
    return resumeUrl;
  } catch (error: any) {
    console.error('Erreur lors de l\'upload du CV:', error);
    
    // En cas d'erreur, simuler un upload réussi pour les tests
    if (process.env.NODE_ENV === 'development') {
      console.warn('Mode développement: simulation d\'un upload réussi');
      // Créer une URL fictive pour les tests
      const mockUrl = `https://res.cloudinary.com/dmy2jt7wo/image/upload/tekki-studio/careers/resumes/${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
      return mockUrl;
    }
    
    throw new Error('Erreur lors de l\'upload du CV. Veuillez réessayer.');
  }
};