// app/components/common/ImageUploader.tsx
'use client';

import { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, X, Loader2 } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { imageUploadService } from '@/app/lib/imageUpload';

interface ImageUploaderProps {
  onImageUploaded: (imageUrl: string, imageAlt: string) => void;
  existingImageUrl?: string;
  existingImageAlt?: string;
  className?: string;
}

export default function ImageUploader({
  onImageUploaded,
  existingImageUrl = '',
  existingImageAlt = '',
  className = '',
}: ImageUploaderProps) {
  const [imageUrl, setImageUrl] = useState<string>(existingImageUrl);
  const [imageAlt, setImageAlt] = useState<string>(existingImageAlt);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      setError(null);

      const uploadedUrl = await imageUploadService.uploadImage(file);
      
      if (!uploadedUrl) {
        throw new Error("L'upload a échoué pour une raison inconnue");
      }

      setImageUrl(uploadedUrl);
      
      // Si aucun texte alternatif n'est défini, utilisez le nom du fichier sans extension
      if (!imageAlt) {
        const altText = file.name.split('.').slice(0, -1).join('.');
        setImageAlt(altText);
      }
      
      // Notifier le composant parent
      onImageUploaded(uploadedUrl, imageAlt || file.name);
    } catch (err) {
      console.error("Erreur lors de l'upload:", err);
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = async () => {
    if (imageUrl && confirm("Êtes-vous sûr de vouloir supprimer cette image ?")) {
      setLoading(true);
      try {
        await imageUploadService.deleteImage(imageUrl);
        setImageUrl('');
        setImageAlt('');
        onImageUploaded('', '');
      } catch (err) {
        console.error("Erreur lors de la suppression:", err);
        setError("Impossible de supprimer l'image");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAltChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAlt = e.target.value;
    setImageAlt(newAlt);
    if (imageUrl) {
      onImageUploaded(imageUrl, newAlt);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <input
        type="file"
        className="hidden"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileSelect}
      />
      
      {!imageUrl ? (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <div className="flex flex-col items-center justify-center space-y-3">
            <ImageIcon className="h-12 w-12 text-gray-400" />
            <div className="text-sm text-gray-500">
              Glissez-déposez une image ici ou
            </div>
            <Button 
              type="button" 
              variant="outline"
              onClick={handleButtonClick}
              disabled={loading}
              className="flex items-center gap-2"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              Choisir une image
            </Button>
          </div>
        </div>
      ) : (
        <div className="relative border rounded-lg overflow-hidden">
          <img
            src={imageUrl}
            alt={imageAlt}
            className="w-full h-48 object-cover"
          />
          
          <div className="absolute top-2 right-2 flex space-x-2">
            <Button
              type="button"
              size="icon"
              variant="destructive"
              onClick={handleRemoveImage}
              disabled={loading}
              className="h-8 w-8 bg-red-500 hover:bg-red-600 rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="p-3 bg-white border-t">
            <input
              type="text"
              placeholder="Description de l'image (alt)"
              value={imageAlt}
              onChange={handleAltChange}
              className="w-full border rounded px-3 py-2 text-sm"
            />
          </div>
        </div>
      )}
      
      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
}