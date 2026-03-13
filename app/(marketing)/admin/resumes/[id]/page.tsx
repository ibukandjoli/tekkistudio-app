// Version simplifiée de app/admin/resumes/[id]/page.tsx avec le composant PdfViewer
'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, AlertCircle, Loader2, FileText } from 'lucide-react';
import { withAdminAuth } from '@/app/lib/withAdminAuth';
import { Button } from '@/app/components/ui/button';
import { getJobApplicationById } from '@/app/lib/db/jobs';
import PdfViewer from '@/app/components/ui/PdfViewer';

const ResumeViewerPage = () => {
  const params = useParams();
  const applicationId = params.id as string;
  
  const [application, setApplication] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        
        const data = await getJobApplicationById(applicationId);
        setApplication(data);
      } catch (err) {
        setError('Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [applicationId]);
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <Loader2 className="h-12 w-12 animate-spin text-tekki-coral mb-4" />
        <p className="text-gray-500">Chargement du CV...</p>
      </div>
    );
  }
  
  if (error || !application) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-1" />
          <div>
            <h3 className="font-medium text-red-800">Erreur</h3>
            <p className="text-red-700">{error || 'La candidature n\'a pas été trouvée'}</p>
          </div>
        </div>
        
        <Link href="/admin/applications">
          <Button variant="outline" className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux candidatures
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-tekki-blue">CV de {application.full_name}</h1>
          <p className="text-gray-600">Candidature pour {application.job_title || 'un poste'}</p>
        </div>
        
        <Link href={`/admin/applications/${applicationId}`}>
          <Button variant="outline" className="flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à la candidature
          </Button>
        </Link>
      </div>
      
      {application.resume_url ? (
        <PdfViewer 
          url={application.resume_url} 
          filename={`CV_${application.full_name.replace(/\s+/g, '_')}.pdf`}
        />
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
          <FileText className="h-24 w-24 text-gray-300 mx-auto mb-6" />
          <h2 className="text-xl font-bold text-gray-700 mb-2">Aucun CV disponible</h2>
          <p className="text-gray-500 mb-6">
            Le candidat n'a pas téléchargé de CV avec sa candidature.
          </p>
          <Link href={`/admin/applications/${applicationId}`}>
            <Button variant="outline">
              Voir les détails de la candidature
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default withAdminAuth(ResumeViewerPage);