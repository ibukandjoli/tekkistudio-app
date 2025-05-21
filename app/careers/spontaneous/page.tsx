// app/careers/spontaneous/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  File,
  FileText,
  Linkedin,
  Briefcase,
  CheckCircle2,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { createJobApplication } from '@/app/lib/db/jobs';
import { uploadResume } from '@/app/lib/cloudinary-resume';

const SpontaneousApplicationPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    location: '',
    department: 'general', // Département par défaut
    portfolio_url: '',
    linkedin_url: '',
    cover_letter: '',
  });
  
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
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
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // Vérifier la taille du fichier (max 5MB)
      if (e.target.files[0].size > 5 * 1024 * 1024) {
        setError('Le fichier est trop volumineux. Taille maximale: 5MB');
        return;
      }
      
      // Vérifier le type de fichier
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(e.target.files[0].type)) {
        setError('Type de fichier non pris en charge. Veuillez utiliser PDF ou Word');
        return;
      }
      
      setResumeFile(e.target.files[0]);
      setError(null);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Validation des champs requis
      if (!formData.full_name || !formData.email || !formData.phone || !formData.location || !resumeFile || !formData.cover_letter) {
        throw new Error('Veuillez remplir tous les champs obligatoires et télécharger votre CV');
      }
      
      // Validation de l'email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error('Veuillez entrer une adresse email valide');
      }
      
      // Upload du CV - CORRECTION ICI
      console.log("Début de l'upload du CV...");
      const resumeUrl = await uploadResume(resumeFile);
      console.log("CV uploadé avec succès:", resumeUrl);
      
      if (!resumeUrl) {
        throw new Error("L'upload du CV a échoué. URL non reçue.");
      }
      
      // Pour une candidature spontanée, nous utilisons un ID spécial
      const spontaneousJobId = 'spontaneous';
      
      // Préparation des données pour l'enregistrement
      const applicationData = {
        job_opening_id: spontaneousJobId,
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        resume_url: resumeUrl, // Maintenant nous sommes sûrs que resumeUrl n'est pas null
        portfolio_url: formData.portfolio_url || undefined,
        linkedin_url: formData.linkedin_url || undefined,
        cover_letter: formData.cover_letter,
      };
      
      console.log("Envoi des données de candidature spontanée:", applicationData);
      
      // Créer la candidature
      await createJobApplication(applicationData);
      
      console.log("Candidature spontanée enregistrée avec succès!");
      
      // Afficher un message de succès
      setSuccess(true);
      
      // Rediriger vers la page de remerciement après un court délai
      setTimeout(() => {
        router.push('/careers/thank-you');
      }, 3000);
      
    } catch (err: any) {
      console.error('Erreur lors de la soumission de la candidature:', err);
      setError(err.message || 'Une erreur est survenue lors de la soumission de votre candidature');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <main className="pb-20 pt-32">
        <div className="mx-auto px-3 md:px-6 lg:px-8 w-full max-w-[1536px]">
          <div className="max-w-3xl mx-auto">
            <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-green-800 mb-4">Candidature envoyée avec succès!</h2>
              <p className="text-green-700 mb-6">
                Merci de votre intérêt pour rejoindre TEKKI Studio. Nous avons bien reçu votre candidature et l'examinerons dans les plus brefs délais.
              </p>
              <p className="text-sm text-green-600 mb-6">
                Vous serez redirigé vers la page de confirmation dans quelques secondes...
              </p>
              <div className="flex justify-center">
                <Link href="/careers">
                  <button className="px-6 py-2 bg-tekki-blue text-white rounded-lg hover:bg-tekki-blue/90 transition-colors">
                    Retour aux offres d'emploi
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="pb-20">
      {/* Hero section minimaliste pour garantir la visibilité des éléments du header */}
      <div className="bg-gradient-to-r from-tekki-blue to-tekki-coral py-12 pt-28 text-white">
        <div className="mx-auto px-3 md:px-6 lg:px-8 w-full max-w-[1536px]">
          <div className="flex items-center">
            <Link href="/careers" className="inline-flex items-center text-white hover:text-white/80 transition-colors">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Retour aux offres d'emploi
            </Link>
          </div>
        </div>
      </div>
      
      {/* En-tête de la page */}
      <section className="py-10 bg-white">
        <div className="mx-auto px-3 md:px-6 lg:px-8 w-full max-w-[1536px]">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-tekki-blue mb-4">
              Candidature spontanée
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Vous souhaitez rejoindre l'équipe TEKKI Studio mais vous n'avez pas trouvé le poste qui vous convient ? Faites-nous part de votre intérêt !
            </p>
          </div>
        </div>
      </section>
      
      {/* Formulaire de candidature */}
      <section className="py-10 bg-gray-50">
        <div className="mx-auto px-3 md:px-6 lg:px-8 w-full max-w-[1536px]">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white p-4 sm:p-8 rounded-xl shadow-sm border border-gray-200">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start mb-6">
                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                  <p className="text-red-700">{error}</p>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-tekki-blue">Informations personnelles</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="full_name" className="flex items-center text-sm font-medium text-gray-700">
                        <User className="w-4 h-4 mr-2 text-gray-400" />
                        Nom complet*
                      </label>
                      <input
                        id="full_name"
                        type="text"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        placeholder="Votre nom complet"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-tekki-coral focus:border-tekki-coral"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="email" className="flex items-center text-sm font-medium text-gray-700">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        Email*
                      </label>
                      <input
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="votre.email@exemple.com"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-tekki-coral focus:border-tekki-coral"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="phone" className="flex items-center text-sm font-medium text-gray-700">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        Téléphone*
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+221 XX XXX XX XX"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-tekki-coral focus:border-tekki-coral"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="location" className="flex items-center text-sm font-medium text-gray-700">
                        <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                        Localisation*
                      </label>
                      <input
                        id="location"
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="Ville, Pays"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-tekki-coral focus:border-tekki-coral"
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-tekki-blue">Votre domaine d'expertise</h3>
                  
                  <div className="space-y-2">
                    <label htmlFor="department" className="flex items-center text-sm font-medium text-gray-700">
                      <Briefcase className="w-4 h-4 mr-2 text-gray-400" />
                      Département d'intérêt*
                    </label>
                    <select
                      id="department"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-tekki-coral focus:border-tekki-coral"
                      required
                    >
                      <option value="general">Général / Plusieurs départements</option>
                      <option value="product">Produit / Product Builder</option>
                      <option value="design">Design / UX/UI</option>
                      <option value="development">Développement / Technique</option>
                      <option value="marketing">Marketing / Acquisition</option>
                      <option value="content">Contenu / Création</option>
                      <option value="customer_success">Service Client / Accompagnement</option>
                      <option value="operations">Opérations / Support</option>
                      <option value="sales">Ventes / Business Development</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-tekki-blue">CV et portfolio</h3>
                  
                  <div className="space-y-2">
                    <label htmlFor="resume" className="flex items-center text-sm font-medium text-gray-700">
                      <File className="w-4 h-4 mr-2 text-gray-400" />
                      CV (PDF ou Word)*
                    </label>
                    <div className="border-dashed border-2 border-gray-300 rounded-lg p-4">
                      <input
                        type="file"
                        id="resume"
                        onChange={handleFileChange}
                        className="hidden"
                        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      />
                      <label htmlFor="resume" className="flex flex-col items-center justify-center cursor-pointer">
                        <div className="bg-gray-100 p-3 rounded-full mb-2">
                          <File className="w-6 h-6 text-gray-500" />
                        </div>
                        <span className="text-gray-600">
                          {resumeFile ? resumeFile.name : 'Cliquez pour télécharger votre CV'}
                        </span>
                        <span className="text-xs text-gray-500 mt-1">
                          Formats acceptés: PDF, DOC, DOCX (max. 5MB)
                        </span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="portfolio_url" className="flex items-center text-sm font-medium text-gray-700">
                        <FileText className="w-4 h-4 mr-2 text-gray-400" />
                        Portfolio URL (optionnel)
                      </label>
                      <input
                        id="portfolio_url"
                        type="url"
                        name="portfolio_url"
                        value={formData.portfolio_url}
                        onChange={handleChange}
                        placeholder="https://votreportfolio.com"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-tekki-coral focus:border-tekki-coral"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="linkedin_url" className="flex items-center text-sm font-medium text-gray-700">
                        <Linkedin className="w-4 h-4 mr-2 text-gray-400" />
                        LinkedIn URL (optionnel)
                      </label>
                      <input
                        id="linkedin_url"
                        type="url"
                        name="linkedin_url"
                        value={formData.linkedin_url}
                        onChange={handleChange}
                        placeholder="https://linkedin.com/in/votrenom"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-tekki-coral focus:border-tekki-coral"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-tekki-blue">Votre motivation</h3>
                  
                  <div className="space-y-2">
                    <label htmlFor="cover_letter" className="text-sm font-medium text-gray-700">
                      Expliquez pourquoi vous souhaitez rejoindre TEKKI Studio*
                    </label>
                    <textarea
                      id="cover_letter"
                      name="cover_letter"
                      value={formData.cover_letter}
                      onChange={handleChange}
                      rows={7}
                      placeholder="Parlez-nous de vous, de votre expérience, de vos compétences et de ce qui vous motive à rejoindre notre équipe..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-tekki-coral focus:border-tekki-coral"
                      required
                    ></textarea>
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-tekki-blue hover:bg-tekki-blue/90 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    'Envoyer ma candidature'
                  )}
                </button>
                
                <p className="text-sm text-gray-500 text-center">
                  En soumettant ce formulaire, vous acceptez que TEKKI Studio traite vos données personnelles pour le processus de recrutement.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default SpontaneousApplicationPage;