// app/admin/chatbot/config/PDFUploader.tsx
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { AlertTriangle, FileText, Loader2, Upload, Check, X, Trash, FileUp } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/app/lib/supabase';
import { Input } from '@/app/components/ui/input';
import { Progress } from '@/app/components/ui/progress';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

interface PDFUploaderProps {
  onContentExtracted: (content: string) => void;
  currentKnowledgeBaseUrl?: string;
  currentKnowledgeBaseContent?: string;
}

// Interface pour les éléments textuels du PDF
interface PDFTextItem {
  str: string;
  dir?: string;
  transform?: number[];
  width?: number;
  height?: number;
  fontName?: string;
}

// Interface pour le contenu textuel d'une page PDF
interface PDFTextContent {
  items: PDFTextItem[];
  styles?: Record<string, any>;
}

export function PDFUploader({ 
  onContentExtracted, 
  currentKnowledgeBaseUrl, 
  currentKnowledgeBaseContent 
}: PDFUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [extractedText, setExtractedText] = useState(currentKnowledgeBaseContent || '');
  const [uploadedFileUrl, setUploadedFileUrl] = useState(currentKnowledgeBaseUrl || '');
  
  // Gérer la sélection de fichier
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    
    if (!selectedFile) {
      return;
    }
    
    // Vérifier le type de fichier
    if (selectedFile.type !== 'application/pdf') {
      toast.error("Seuls les fichiers PDF sont acceptés.");
      return;
    }
    
    // Vérifier la taille du fichier
    if (selectedFile.size > MAX_FILE_SIZE) {
      toast.error("Le fichier est trop volumineux. La taille maximale est de 10MB.");
      return;
    }
    
    setFile(selectedFile);
  };
  
  // Télécharger le fichier PDF vers Supabase Storage
  const uploadFile = async () => {
    if (!file) return null;
    
    try {
      setIsUploading(true);
      setUploadProgress(0);
      
      // Générer un nom de fichier unique
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `knowledge_base/${fileName}`;
      
      // Télécharger vers Supabase Storage
      const { data, error } = await supabase.storage
        .from('chatbot')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });
      
      if (error) {
        throw error;
      }
      
      // Simuler une progression de l'upload
      let progress = 0;
      const interval = setInterval(() => {
        progress += 5;
        if (progress >= 100) {
          clearInterval(interval);
          progress = 100;
        }
        setUploadProgress(progress);
      }, 50);
      
      // Obtenir l'URL publique du fichier
      const { data: urlData } = supabase.storage
        .from('chatbot')
        .getPublicUrl(filePath);
      
      setUploadedFileUrl(urlData.publicUrl);
      
      toast.success("Fichier téléchargé avec succès!");
      
      // Extraire le texte du PDF
      await extractTextFromPDF(file);
      
      return urlData.publicUrl;
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      toast.error("Erreur lors du téléchargement du fichier.");
      return null;
    } finally {
      setIsUploading(false);
      setUploadProgress(100);
    }
  };
  
  // Extraire le texte d'un fichier PDF
  const extractTextFromPDF = async (pdfFile: File) => {
    try {
      setIsProcessing(true);
      
      // Utiliser l'API PDF.js pour extraire le texte
      const pdfJS = await import('pdfjs-dist/build/pdf');
      const pdfjsWorker = (await import('pdfjs-dist/build/pdf.worker.entry')).default;

      pdfJS.GlobalWorkerOptions.workerSrc = pdfjsWorker;
      
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdf = await pdfJS.getDocument({ data: arrayBuffer }).promise;
      
      let fullText = '';
      
      // Parcourir toutes les pages et extraire le texte
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent() as PDFTextContent;
        const strings = content.items.map((item: PDFTextItem) => item.str);
        fullText += strings.join(' ') + '\n\n';
      }
      
      // Nettoyer et formater le texte
      const cleanedText = fullText
        .replace(/\s+/g, ' ')  // Remplacer les espaces multiples par un seul
        .replace(/\n{3,}/g, '\n\n')  // Limiter à 2 sauts de ligne consécutifs
        .trim();
      
      setExtractedText(cleanedText);
      onContentExtracted(cleanedText);
      
      toast.success("Texte extrait avec succès!");
    } catch (error) {
      console.error('Erreur lors de l\'extraction du texte:', error);
      toast.error("Erreur lors de l'extraction du texte du PDF.");
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Réinitialiser le fichier et le texte extrait
  const resetFile = () => {
    setFile(null);
    setExtractedText('');
    setUploadedFileUrl('');
    onContentExtracted('');
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Base de connaissances</CardTitle>
        <CardDescription>
          Téléchargez un fichier PDF pour enrichir la base de connaissances du chatbot
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Fichier déjà téléchargé */}
        {uploadedFileUrl && !file && (
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-500" />
              <div>
                <p className="font-medium">Fichier PDF actuel</p>
                <a 
                  href={uploadedFileUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline"
                >
                  Voir le fichier
                </a>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={resetFile}
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <Trash className="h-4 w-4 mr-1" />
              Supprimer
            </Button>
          </div>
        )}
        
        {/* Zone de téléchargement */}
        {!uploadedFileUrl && !file && (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => document.getElementById('pdf-upload')?.click()}>
            <FileUp className="h-8 w-8 mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-600">
              Cliquez pour sélectionner un fichier PDF
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Taille maximale: 10MB
            </p>
            <Input
              id="pdf-upload"
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        )}
        
        {/* Fichier sélectionné */}
        {file && !uploadedFileUrl && (
          <div className="p-4 border rounded-lg">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-500" />
                <span className="font-medium text-sm truncate max-w-[200px]">
                  {file.name}
                </span>
                <span className="text-xs text-gray-500">
                  ({Math.round(file.size / 1024)} KB)
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFile(null)}
                disabled={isUploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {isUploading && (
              <div className="space-y-2">
                <Progress value={uploadProgress} className="h-2" />
                <p className="text-xs text-gray-500 text-center">
                  {uploadProgress < 100 ? 'Téléchargement en cours...' : 'Finalisation...'}
                </p>
              </div>
            )}
            
            {!isUploading && (
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFile(null)}
                  disabled={isUploading}
                >
                  Annuler
                </Button>
                <Button
                  onClick={uploadFile}
                  disabled={isUploading}
                  size="sm"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Téléchargement...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Télécharger et extraire
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        )}
        
        {/* Texte extrait */}
        {extractedText && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Texte extrait</h4>
              <div className="flex items-center gap-1 text-green-600 text-xs">
                <Check className="h-3 w-3" />
                Extrait avec succès
              </div>
            </div>
            <div className="max-h-40 overflow-y-auto border rounded-lg p-3 text-sm bg-gray-50">
              <p className="whitespace-pre-wrap">{extractedText.substring(0, 500)}...</p>
            </div>
            <p className="text-xs text-gray-500">
              {extractedText.length} caractères extraits
            </p>
          </div>
        )}
        
        {/* Notes d'utilisation */}
        <div className="p-3 bg-amber-50 rounded-lg border border-amber-100 mt-4">
          <div className="flex gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-amber-800 font-medium">Important</p>
              <p className="text-xs text-amber-700 mt-1">
                Le texte extrait sera utilisé pour enrichir les connaissances du chatbot. 
                Pour des résultats optimaux, assurez-vous que le PDF contient des informations 
                claires et pertinentes sur votre entreprise, vos produits et services.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <p className="text-xs text-gray-500">
          {isProcessing ? "Traitement en cours..." : ""}
        </p>
      </CardFooter>
    </Card>
  );
}

export default PDFUploader;