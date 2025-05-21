// app/components/ui/PdfViewer.tsx
'use client';

import React, { useState } from 'react';
import { 
  Download, 
  FileText, 
  ExternalLink, 
  AlertCircle,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';

interface PdfViewerProps {
  url: string;
  filename?: string;
  height?: string;
}

const PdfViewer = ({ 
  url, 
  filename = 'document.pdf',
  height = '75vh'
}: PdfViewerProps) => {
  const [viewerLoading, setViewerLoading] = useState(true);
  const [viewerError, setViewerError] = useState(false);
  
  const handleViewerLoad = () => {
    setViewerLoading(false);
  };
  
  const handleViewerError = () => {
    setViewerLoading(false);
    setViewerError(true);
  };
  
  // Créer l'URL pour Google PDF Viewer
  const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
  
  // Récupérer le nom du fichier depuis l'URL si non fourni
  const displayFilename = filename || url.split('/').pop() || 'document.pdf';
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Prévisualisateur PDF intégré */}
      <div className="relative" style={{ height }}>
        {viewerLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50">
            <Loader2 className="h-12 w-12 animate-spin text-tekki-coral mb-4" />
            <p className="text-gray-500">Chargement du document...</p>
          </div>
        )}
        
        <iframe 
          src={viewerUrl}
          className="w-full h-full border-0"
          onLoad={handleViewerLoad}
          onError={handleViewerError}
        ></iframe>
        
        {viewerError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4 max-w-lg">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-amber-500 mr-3 mt-1" />
                <div>
                  <h3 className="font-medium text-amber-800 mb-1">Prévisualisation impossible</h3>
                  <p className="text-amber-700">
                    Le document ne peut pas être prévisualisé directement. Vous pouvez l'ouvrir ou le télécharger via les liens ci-dessous.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col mt-4 items-center">
              <FileText className="h-32 w-32 text-gray-300 mb-4" />
              <p className="text-gray-600 mb-4">Document : {displayFilename}</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Barre d'actions */}
      <div className="bg-gray-50 border-t border-gray-200 p-4 flex justify-center space-x-4">
        <a 
          href={url}
          target="_blank"
          rel="noopener noreferrer" 
          className="bg-tekki-blue hover:bg-tekki-blue/90 text-white px-6 py-3 rounded-lg flex items-center justify-center transition-colors"
        >
          <ExternalLink className="h-5 w-5 mr-2" />
          Ouvrir dans un nouvel onglet
        </a>
        
        <a 
          href={url}
          download={displayFilename}
          className="border border-tekki-blue text-tekki-blue hover:bg-gray-100 px-6 py-3 rounded-lg flex items-center justify-center transition-colors"
        >
          <Download className="h-5 w-5 mr-2" />
          Télécharger
        </a>
        
        <Button 
          variant="outline"
          className="flex items-center"
          onClick={() => window.location.reload()}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualiser
        </Button>
      </div>
    </div>
  );
};

export default PdfViewer;