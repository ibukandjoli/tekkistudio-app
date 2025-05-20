// app/components/careers/JobApplicationForm.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, MapPin, File, FileText, Linkedin, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { createJobApplication } from '@/app/lib/db/jobs';
import type { JobOpening } from '@/app/types/database';
import { uploadResume } from '@/app/lib/cloudinary-resume';

interface JobApplicationFormProps {
  job: JobOpening;
  onSuccess?: () => void;
}

const JobApplicationForm: React.FC<JobApplicationFormProps> = ({ job, onSuccess }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    location: '',
    portfolio_url: '',
    linkedin_url: '',
    cover_letter: '',
  });
  
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      if (!formData.full_name || !formData.email || !formData.phone || !formData.location || !resumeFile) {
        throw new Error('Veuillez remplir tous les champs obligatoires et télécharger votre CV');
      }
      
      // Validation de l'email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error('Veuillez entrer une adresse email valide');
      }
      
      // Upload du CV
      console.log("Début de l'upload du CV...");
      const resumeUrl = await uploadResume(resumeFile);
      console.log("CV uploadé:", resumeUrl);
      
      // Préparation des données pour l'enregistrement
      const applicationData = {
        job_opening_id: job.id,
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        resume_url: resumeUrl || undefined,
        portfolio_url: formData.portfolio_url || undefined,
        linkedin_url: formData.linkedin_url || undefined,
        cover_letter: formData.cover_letter || undefined,
      };
      
      console.log("Envoi des données de candidature:", applicationData);
      
      // Créer la candidature
      await createJobApplication(applicationData);
      
      console.log("Candidature enregistrée avec succès!");
      
      // Réinitialiser le formulaire
      setFormData({
        full_name: '',
        email: '',
        phone: '',
        location: '',
        portfolio_url: '',
        linkedin_url: '',
        cover_letter: '',
      });
      setResumeFile(null);
      
      // Afficher un message de succès
      setSuccess(true);
      
      // Appeler le callback de succès si fourni
      if (onSuccess) {
        onSuccess();
      }
      
      // Rediriger après 3 secondes
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
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-green-100 p-3 rounded-full">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
        </div>
        <h3 className="text-xl font-bold text-green-800 mb-2">Candidature envoyée avec succès!</h3>
        <p className="text-green-700 mb-4">
          Merci d'avoir postulé pour le poste de {job.title}. Nous examinerons votre candidature et vous contacterons prochainement.
        </p>
        <p className="text-sm text-green-600">
          Vous serez redirigé vers la page de confirmation dans quelques secondes...
        </p>
      </div>
    );
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
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
        <h3 className="text-xl font-bold text-tekki-blue">Lettre de motivation</h3>
        
        <div className="space-y-2">
          <label htmlFor="cover_letter" className="text-sm font-medium text-gray-700">
            Pourquoi êtes-vous intéressé(e) par ce poste ? (optionnel)
          </label>
          <textarea
            id="cover_letter"
            name="cover_letter"
            value={formData.cover_letter}
            onChange={handleChange}
            rows={5}
            placeholder="Parlez-nous de vous, de votre expérience et de pourquoi vous êtes intéressé(e) par ce poste..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-tekki-coral focus:border-tekki-coral"
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
  );
};

export default JobApplicationForm;