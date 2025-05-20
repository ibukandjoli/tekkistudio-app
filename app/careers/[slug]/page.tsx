// Correction pour app/careers/[slug]/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Briefcase, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Calendar, 
  Users, 
  Award,
  Share2,
  Loader2,
  AlertCircle,
  FileText
} from 'lucide-react';
import { getJobOpeningBySlug } from '@/app/lib/db/jobs';
import type { JobOpening } from '@/app/types/database';
import Container from '@/app/components/ui/Container';
import { Badge } from '@/app/components/ui/badge';
import JobApplicationForm from '@/app/components/careers/JobApplicationForm';
import { formatRelativeDate } from '@/app/lib/utils/date-utils';

const JobOpeningDetail = () => {
  const params = useParams();
  const router = useRouter();
  const currentSlug = params.slug as string;
  
  const [job, setJob] = useState<JobOpening | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  
  // Effet pour configurer le header - version améliorée
  useEffect(() => {
    // Fonction pour mettre à jour la classe du header
    const updateHeaderClass = () => {
      const header = document.querySelector('header');
      if (header) {
        // Ajouter une classe spéciale pour les pages de carrières
        header.classList.add('careers-header');
        
        // Appliquer le style directement via stylesheet pour assurer qu'il prend priorité
        const styleElement = document.createElement('style');
        styleElement.setAttribute('id', 'careers-header-style');
        styleElement.textContent = `
          header.careers-header {
            background-color: var(--tekki-blue, #0f4c81) !important;
            color: white !important;
          }
          header.careers-header a, 
          header.careers-header button {
            color: white !important;
          }
        `;
        document.head.appendChild(styleElement);
      }
    };

    // Appliquer immédiatement
    updateHeaderClass();

    // Nettoyer lors du démontage du composant
    return () => {
      const header = document.querySelector('header');
      const styleElement = document.getElementById('careers-header-style');
      
      if (header) {
        header.classList.remove('careers-header');
      }
      
      if (styleElement) {
        styleElement.remove();
      }
    };
  }, []);
  
  useEffect(() => {
    fetchJobDetails();
  }, [currentSlug]);
  
  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const jobData = await getJobOpeningBySlug(currentSlug);
      
      if (!jobData) {
        setError('L\'offre d\'emploi n\'a pas été trouvée');
        return;
      }
      
      setJob(jobData);
      
    } catch (err) {
      console.error('Erreur lors du chargement des détails de l\'offre:', err);
      setError('Une erreur est survenue lors du chargement des détails de l\'offre d\'emploi.');
    } finally {
      setLoading(false);
    }
  };
  
  const scrollToApplication = () => {
    setShowApplicationForm(true);
    setTimeout(() => {
      const element = document.getElementById('application-form');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-tekki-coral" />
      </div>
    );
  }
  
  if (error || !job) {
    return (
      <main className="pb-20 pt-32">
        <Container>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <div className="flex items-start">
              <AlertCircle className="h-6 w-6 text-red-500 mr-3 mt-0.5" />
              <div>
                <h2 className="text-xl font-bold text-red-700 mb-2">
                  {error || 'Offre d\'emploi non trouvée'}
                </h2>
                <p className="text-red-600">
                  L'offre d'emploi que vous recherchez n'existe pas ou a été retirée.
                </p>
              </div>
            </div>
          </div>
          
          <Link href="/careers" className="inline-flex items-center text-tekki-blue hover:text-tekki-coral transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux offres d'emploi
          </Link>
        </Container>
      </main>
    );
  }
  
  if (!job.is_active) {
    return (
      <main className="pb-20 pt-32">
        <Container>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-6">
            <div className="flex items-start">
              <AlertCircle className="h-6 w-6 text-amber-500 mr-3 mt-0.5" />
              <div>
                <h2 className="text-xl font-bold text-amber-700 mb-2">
                  Offre d'emploi clôturée
                </h2>
                <p className="text-amber-600">
                  Cette offre d'emploi n'est plus active et n'accepte plus de candidatures.
                </p>
              </div>
            </div>
          </div>
          
          <Link href="/careers" className="inline-flex items-center text-tekki-blue hover:text-tekki-coral transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voir les offres d'emploi disponibles
          </Link>
        </Container>
      </main>
    );
  }

  return (
    <main className="pb-20">
      {/* Hero section minimaliste pour garantir la visibilité des éléments du header */}
      <div className="bg-gradient-to-r from-tekki-blue to-tekki-coral py-12 pt-28 text-white">
        <Container>
          <div className="flex items-center">
            <Link href="/careers" className="inline-flex items-center text-white hover:text-white/80 transition-colors">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Retour aux offres d'emploi
            </Link>
          </div>
        </Container>
      </div>
      
      {/* En-tête du poste */}
      <section className="py-10 bg-white">
        <Container>
          <div className="max-w-4xl">
            <div className="mb-6 flex flex-wrap gap-2">
              <Badge variant="jobActive">Ouvert</Badge>
              {job.is_featured && (
                <Badge variant="jobFeatured">
                  Poste en vedette
                </Badge>
              )}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-tekki-blue mb-4">
              {job.title}
            </h1>
            
            <div className="flex flex-wrap gap-6 text-gray-600 mb-8">
              <div className="flex items-center">
                <Briefcase className="h-5 w-5 mr-2 text-tekki-coral" />
                <span>{job.department}</span>
              </div>
              
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-tekki-coral" />
                <span>{job.location}</span>
              </div>
              
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-tekki-coral" />
                <span>{job.type}</span>
              </div>
              
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-tekki-coral" />
                <span>Publié {formatRelativeDate(job.created_at)}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <button
                onClick={scrollToApplication}
                className="bg-tekki-blue hover:bg-tekki-blue/90 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Postuler maintenant
              </button>
              
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: `Offre d'emploi: ${job.title} chez TEKKI Studio`,
                      text: `Découvrez cette offre d'emploi: ${job.title} chez TEKKI Studio`,
                      url: window.location.href,
                    });
                  }
                }}
                className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
              >
                <Share2 className="h-5 w-5 mr-2" />
                Partager
              </button>
            </div>
          </div>
        </Container>
      </section>
      
      {/* Contenu principal */}
      <section className="py-10 bg-gray-50">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Description et détails */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-2xl font-bold text-tekki-blue mb-6">
                  À propos du poste
                </h2>
                <div className="prose max-w-none text-gray-700">
                  <p className="whitespace-pre-line">{job.description}</p>
                </div>
              </div>
              
              {/* Responsabilités */}
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-2xl font-bold text-tekki-blue mb-6">
                  Responsabilités
                </h2>
                <ul className="space-y-3">
                  {job.responsibilities.map((responsibility, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-tekki-coral mt-0.5 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{responsibility}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Exigences */}
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-2xl font-bold text-tekki-blue mb-6">
                  Compétences et qualifications
                </h2>
                <ul className="space-y-3">
                  {job.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-tekki-coral mt-0.5 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Avantages */}
              {job.benefits && job.benefits.length > 0 && (
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                  <h2 className="text-2xl font-bold text-tekki-blue mb-6">
                    Ce que nous offrons
                  </h2>
                  <ul className="space-y-3">
                    {job.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Formulaire de candidature */}
              <div id="application-form" className="scroll-mt-16">
                {showApplicationForm ? (
                  <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                    <h2 className="text-2xl font-bold text-tekki-blue mb-6">
                      Postuler à {job.title}
                    </h2>
                    <JobApplicationForm job={job} />
                  </div>
                ) : (
                  <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
                    <h2 className="text-2xl font-bold text-tekki-blue mb-4">
                      Intéressé(e) par ce poste ?
                    </h2>
                    <p className="text-gray-600 mb-6">
                      Nous sommes impatients de découvrir votre candidature et votre parcours professionnel.
                    </p>
                    <button
                      onClick={() => setShowApplicationForm(true)}
                      className="bg-tekki-blue hover:bg-tekki-blue/90 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      Postuler maintenant
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="space-y-6">
              {/* À propos de l'entreprise */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-xl font-bold text-tekki-blue mb-4">
                  À propos de TEKKI Studio
                </h3>
                <p className="text-gray-600 mb-4">
                  TEKKI Studio est une "fabrique de business en ligne clé en main". Notre mission est de permettre à toute personne souhaitant se lancer dans les business en ligne de le faire sans partir de zéro, grâce à des business déjà prêts, testés, documentés et disponibles à l'achat immédiat.
                </p>
                <Link
                  href="/"
                  className="text-tekki-coral hover:text-tekki-coral/80 font-medium inline-flex items-center"
                >
                  En savoir plus sur nous
                  <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                </Link>
              </div>
              
              {/* Infos du poste */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-xl font-bold text-tekki-blue mb-4">
                  Infos du poste
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center text-gray-600 mb-1">
                      <Briefcase className="h-4 w-4 mr-2 text-tekki-coral" />
                      <span className="text-sm font-medium">Département</span>
                    </div>
                    <p>{job.department}</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center text-gray-600 mb-1">
                      <MapPin className="h-4 w-4 mr-2 text-tekki-coral" />
                      <span className="text-sm font-medium">Localisation</span>
                    </div>
                    <p>{job.location}</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center text-gray-600 mb-1">
                      <Clock className="h-4 w-4 mr-2 text-tekki-coral" />
                      <span className="text-sm font-medium">Type de poste</span>
                    </div>
                    <p>{job.type}</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center text-gray-600 mb-1">
                      <Calendar className="h-4 w-4 mr-2 text-tekki-coral" />
                      <span className="text-sm font-medium">Date de publication</span>
                    </div>
                    <p>{new Date(job.created_at).toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>
              </div>
              
              {/* Call-to-action */}
              <div className="bg-gradient-to-r from-tekki-blue to-tekki-coral p-6 rounded-xl shadow-sm text-white">
                <h3 className="text-xl font-bold mb-4">
                  Rejoignez notre équipe
                </h3>
                <p className="mb-6 opacity-90">
                  Nous recherchons des personnes passionnées et créatives pour construire l'avenir de l'entrepreneuriat en ligne en Afrique.
                </p>
                <button
                  onClick={scrollToApplication}
                  className="w-full bg-white text-tekki-blue hover:bg-white/90 py-2 rounded-lg font-medium transition-colors"
                >
                  Postuler maintenant
                </button>
              </div>
              
              {/* Partager */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-xl font-bold text-tekki-blue mb-4">
                  Partager cette offre
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank');
                    }}
                    className="flex-1 bg-[#0077B5] text-white hover:bg-opacity-90 py-2 rounded-lg font-medium transition-colors"
                  >
                    LinkedIn
                  </button>
                  <button
                    onClick={() => {
                      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Offre d'emploi: ${job.title} chez TEKKI Studio`)}&url=${encodeURIComponent(window.location.href)}`, '_blank');
                    }}
                    className="flex-1 bg-[#1DA1F2] text-white hover:bg-opacity-90 py-2 rounded-lg font-medium transition-colors"
                  >
                    Twitter
                  </button>
                  <button
                    onClick={() => {
                      window.open(`https://wa.me/?text=${encodeURIComponent(`Offre d'emploi: ${job.title} chez TEKKI Studio - ${window.location.href}`)}`, '_blank');
                    }}
                    className="flex-1 bg-[#25D366] text-white hover:bg-opacity-90 py-2 rounded-lg font-medium transition-colors"
                  >
                    WhatsApp
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
};

export default JobOpeningDetail;