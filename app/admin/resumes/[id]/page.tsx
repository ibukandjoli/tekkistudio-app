// app/admin/resumes/[id]/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Download, FileText, User, Mail, Phone, MapPin, Calendar, AlertCircle, Loader2, Linkedin, Briefcase } from 'lucide-react';
import { withAdminAuth } from '@/app/lib/withAdminAuth';
import Container from '@/app/components/ui/Container';
import { Button } from '@/app/components/ui/button';
import { getJobApplicationById } from '@/app/lib/db/jobs';

/**
 * Page pour visualiser le CV d'un candidat
 */
const ResumeViewerPage = () => {
  const router = useRouter();
  const params = useParams();
  const applicationId = params.id as string;
  
  const [application, setApplication] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    fetchApplication();
  }, [applicationId]);
  
  const fetchApplication = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Récupérer les détails de la candidature
      const applicationData = await getJobApplicationById(applicationId);
      
      if (!applicationData) {
        setError('Candidature non trouvée');
        return;
      }
      
      setApplication(applicationData);
    } catch (err) {
      console.error('Erreur lors du chargement de la candidature:', err);
      setError('Une erreur est survenue lors du chargement de la candidature');
    } finally {
      setLoading(false);
    }
  };
  
  // Détermine si le document est un PDF
  const isPdf = (url: string) => {
    return url?.toLowerCase().endsWith('.pdf');
  };
  
  // Prépare l'URL pour Google Docs Viewer
  const getViewerUrl = (url: string) => {
    if (!url) return '';
    return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center">
          <Loader2 className="h-10 w-10 animate-spin text-tekki-coral mb-4" />
          <p className="text-gray-500">Chargement du CV...</p>
        </div>
      </div>
    );
  }
  
  if (error || !application) {
    return (
      <main className="pt-24 pb-20">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
              <div className="flex items-start">
                <AlertCircle className="h-6 w-6 text-red-500 mr-3 mt-0.5" />
                <div>
                  <h2 className="text-xl font-bold text-red-800 mb-2">
                    {error || 'Candidature non trouvée'}
                  </h2>
                  <p className="text-red-700">
                    La candidature que vous recherchez n'existe pas ou n'est plus disponible.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex">
              <Link href="/admin/applications">
                <Button variant="outline" className="flex items-center">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour aux candidatures
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </main>
    );
  }
  
  return (
    <main className="pt-24 pb-20">
      <Container>
        <div className="max-w-5xl mx-auto">
          {/* Barre de navigation */}
          <div className="mb-6 flex justify-between items-center">
            <div className="flex items-center">
              <Link href="/admin/applications">
                <Button variant="outline" className="flex items-center">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour aux candidatures
                </Button>
              </Link>
            </div>
            
            {/* Bouton de téléchargement si un CV est disponible */}
            {application.resume_url && (
              <a 
                href={application.resume_url} 
                download 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-tekki-blue text-white rounded-lg hover:bg-tekki-blue/90 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Télécharger le CV
              </a>
            )}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Informations du candidat */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-tekki-blue mb-4">
                    Informations du candidat
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <User className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-sm text-gray-500">Nom complet</div>
                        <div className="font-medium">{application.full_name}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-sm text-gray-500">Email</div>
                        <a 
                          href={`mailto:${application.email}`} 
                          className="font-medium text-tekki-blue hover:underline"
                        >
                          {application.email}
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-sm text-gray-500">Téléphone</div>
                        <a 
                          href={`tel:${application.phone}`} 
                          className="font-medium"
                        >
                          {application.phone}
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-sm text-gray-500">Localisation</div>
                        <div className="font-medium">{application.location}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-sm text-gray-500">Date de candidature</div>
                        <div className="font-medium">
                          {new Date(application.created_at).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                    </div>
                    
                    {application.job_openings && application.job_openings.department && (
                      <div className="flex items-start gap-3">
                        <Briefcase className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="text-sm text-gray-500">Département d'intérêt</div>
                          <div className="font-medium">{application.job_openings.department}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Liens externes */}
                {(application.portfolio_url || application.linkedin_url) && (
                  <div>
                    <h3 className="text-lg font-semibold text-tekki-blue mb-3">
                      Liens
                    </h3>
                    
                    <div className="space-y-3">
                      {application.portfolio_url && (
                        <a 
                          href={application.portfolio_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center text-tekki-blue hover:underline"
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          <span>Portfolio</span>
                        </a>
                      )}
                      
                      {application.linkedin_url && (
                        <a 
                          href={application.linkedin_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center text-tekki-blue hover:underline"
                        >
                          <Linkedin className="w-4 h-4 mr-2" />
                          <span>LinkedIn</span>
                        </a>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Informations du poste */}
                {application.job_openings && (
                  <div>
                    <h3 className="text-lg font-semibold text-tekki-blue mb-3">
                      Poste visé
                    </h3>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="font-medium text-tekki-blue mb-2">
                        {application.job_openings.title}
                      </div>
                      <div className="text-sm text-gray-600">
                        {application.job_openings.department} • {application.job_openings.location}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Visualisation du CV et de la lettre de motivation */}
            <div className="lg:col-span-2 space-y-6">
              {/* CV */}
              {application.resume_url ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-[600px]">
                  <div className="p-4 bg-gray-50 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-800">
                      CV - {application.full_name}
                    </h3>
                  </div>
                  
                  <div className="h-full">
                    {isPdf(application.resume_url) ? (
                      <iframe 
                        src={getViewerUrl(application.resume_url)} 
                        className="w-full h-full border-0" 
                        title={`CV de ${application.full_name}`}
                        allowFullScreen
                      ></iframe>
                    ) : (
                      <div className="flex items-center justify-center h-full p-4">
                        <div className="text-center">
                          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600 mb-4">
                            Ce document ne peut pas être affiché directement.
                          </p>
                          <a 
                            href={application.resume_url} 
                            download 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 bg-tekki-blue text-white rounded-lg hover:bg-tekki-blue/90 transition-colors"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Télécharger le document
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <div className="flex items-start">
                    <AlertCircle className="h-6 w-6 text-yellow-600 mr-3 mt-0.5" />
                    <div>
                      <h3 className="text-lg font-bold text-yellow-800 mb-2">
                        CV non disponible
                      </h3>
                      <p className="text-yellow-700">
                        Aucun CV n'a été téléchargé pour cette candidature.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Lettre de motivation */}
              {application.cover_letter && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-tekki-blue mb-3">
                    Lettre de motivation
                  </h3>
                  
                  <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-line text-gray-700">
                    {application.cover_letter}
                  </div>
                </div>
              )}
              
              {/* Actions */}
              <div className="flex flex-wrap gap-3 justify-end">
                <a 
                  href={`mailto:${application.email}`} 
                  className="inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Contacter le candidat
                </a>
                
                <Link href={`/admin/applications/${applicationId}`}>
                  <Button className="bg-tekki-blue text-white hover:bg-tekki-blue/90">
                    Voir tous les détails
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
};

export default withAdminAuth(ResumeViewerPage);