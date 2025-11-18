// app/components/FormulaQuoteForm.tsx
'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/app/lib/supabase';

// Schema de validation Zod
const formulaQuoteSchema = z.object({
  full_name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Adresse email invalide'),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Format de téléphone invalide (ex: +221771234567)'),
  country: z.string().min(1, 'Le pays est requis'),
  city: z.string().min(1, 'La ville est requise'),
  brand_name: z.string().min(2, 'Le nom de la marque doit contenir au moins 2 caractères'),
  brand_description: z.string().min(10, 'La description doit contenir au moins 10 caractères'),
  existing_website: z.string().url('URL invalide').optional().or(z.literal('')),
  monthly_revenue: z.string().min(1, 'Le chiffre d\'affaires est requis'),
  budget_range: z.string().min(1, 'Le budget est requis'),
  desired_timeline: z.string().min(1, 'Le délai est requis'),
  specific_needs: z.string().optional(),
});

type FormData = z.infer<typeof formulaQuoteSchema>;

interface FormulaQuoteFormProps {
  isOpen: boolean;
  onClose: () => void;
  formulaType: 'audit-depart' | 'demarrage' | 'croissance' | 'expansion';
  formulaName: string;
}

const FormulaQuoteForm: React.FC<FormulaQuoteFormProps> = ({
  isOpen,
  onClose,
  formulaType,
  formulaName,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formulaQuoteSchema),
  });

  const countries = [
    'Sénégal',
    'Côte d\'Ivoire',
    'Mali',
    'Burkina Faso',
    'Niger',
    'Bénin',
    'Togo',
    'Guinée',
    'Cameroun',
    'Gabon',
    'Congo',
    'RD Congo',
    'France',
    'Canada',
    'États-Unis',
    'Autre',
  ];

  const monthlyRevenueOptions = [
    'Pas encore de CA',
    'Moins de 500k FCFA',
    '500k - 2M FCFA',
    '2M - 5M FCFA',
    'Plus de 5M FCFA',
  ];

  const budgetRangeOptions = [
    'À définir',
    'Moins de 500k FCFA',
    '500k - 1M FCFA',
    '1M - 2M FCFA',
    '2M - 5M FCFA',
    'Plus de 5M FCFA',
  ];

  const timelineOptions = [
    'Urgent (moins d\'1 mois)',
    '1-3 mois',
    '3-6 mois',
    'Plus de 6 mois',
    'Flexible',
  ];

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      // Préparer les données pour Supabase
      const leadData = {
        ...data,
        formula_type: formulaType,
        status: 'new',
        lead_source: 'website_form',
        existing_website: data.existing_website || null,
        specific_needs: data.specific_needs || null,
      };

      // Insérer dans Supabase
      const { error } = await supabase
        .from('formula_leads')
        .insert([leadData]);

      if (error) {
        console.error('Erreur Supabase:', error);
        throw error;
      }

      // Succès
      setIsSuccess(true);
      toast.success('Demande envoyée avec succès !', {
        description: 'Nous vous contacterons sous 24h pour discuter de votre projet.',
      });

      // Fermer après 2 secondes
      setTimeout(() => {
        setIsSuccess(false);
        reset();
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      toast.error('Une erreur est survenue', {
        description: 'Veuillez réessayer ou nous contacter directement.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      reset();
      setIsSuccess(false);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Dialog */}
          <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto">
            <div className="min-h-screen w-full flex items-center justify-center p-4 py-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.2 }}
                className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-8"
                onClick={(e) => e.stopPropagation()}
              >
              {/* Header */}
              <div className="bg-gradient-to-r from-[#0f4c81] to-[#ff7f50] p-6 rounded-t-2xl">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                      Obtenir un devis gratuit
                    </h2>
                    <p className="text-white/90 text-lg">
                      {formulaName}
                    </p>
                  </div>
                  <button
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors disabled:opacity-50"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Success State */}
              {isSuccess && (
                <div className="absolute inset-0 bg-white rounded-2xl flex items-center justify-center z-10">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-center"
                  >
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-12 h-12 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Demande envoyée !
                    </h3>
                    <p className="text-gray-600">
                      Nous vous contacterons sous 24h
                    </p>
                  </motion.div>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                {/* Informations personnelles */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="w-8 h-8 bg-[#0f4c81] text-white rounded-full flex items-center justify-center text-sm mr-3">
                      1
                    </span>
                    Informations personnelles
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Nom complet */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom complet <span className="text-red-500">*</span>
                      </label>
                      <input
                        {...register('full_name')}
                        type="text"
                        placeholder="Ex: Amadou Diallo"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#0f4c81] focus:border-transparent transition-all ${
                          errors.full_name ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.full_name && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.full_name.message}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        {...register('email')}
                        type="email"
                        placeholder="exemple@email.com"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#0f4c81] focus:border-transparent transition-all ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    {/* Téléphone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Téléphone <span className="text-red-500">*</span>
                      </label>
                      <input
                        {...register('phone')}
                        type="tel"
                        placeholder="+221771234567"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#0f4c81] focus:border-transparent transition-all ${
                          errors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.phone.message}
                        </p>
                      )}
                    </div>

                    {/* Pays */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pays <span className="text-red-500">*</span>
                      </label>
                      <select
                        {...register('country')}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#0f4c81] focus:border-transparent transition-all ${
                          errors.country ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Sélectionnez un pays</option>
                        {countries.map((country) => (
                          <option key={country} value={country}>
                            {country}
                          </option>
                        ))}
                      </select>
                      {errors.country && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.country.message}
                        </p>
                      )}
                    </div>

                    {/* Ville */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ville <span className="text-red-500">*</span>
                      </label>
                      <input
                        {...register('city')}
                        type="text"
                        placeholder="Ex: Dakar"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#0f4c81] focus:border-transparent transition-all ${
                          errors.city ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.city && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.city.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Informations sur la marque */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="w-8 h-8 bg-[#0f4c81] text-white rounded-full flex items-center justify-center text-sm mr-3">
                      2
                    </span>
                    Informations sur votre marque
                  </h3>
                  <div className="space-y-4">
                    {/* Nom de la marque */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom de la marque <span className="text-red-500">*</span>
                      </label>
                      <input
                        {...register('brand_name')}
                        type="text"
                        placeholder="Ex: Ma Belle Marque"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#0f4c81] focus:border-transparent transition-all ${
                          errors.brand_name ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.brand_name && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.brand_name.message}
                        </p>
                      )}
                    </div>

                    {/* Description de la marque */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description de la marque <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        {...register('brand_description')}
                        rows={4}
                        placeholder="Décrivez votre marque, vos produits/services, votre marché cible..."
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#0f4c81] focus:border-transparent transition-all resize-none ${
                          errors.brand_description ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.brand_description && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.brand_description.message}
                        </p>
                      )}
                    </div>

                    {/* Site web existant */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Site web existant (optionnel)
                      </label>
                      <input
                        {...register('existing_website')}
                        type="url"
                        placeholder="https://example.com"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#0f4c81] focus:border-transparent transition-all ${
                          errors.existing_website ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.existing_website && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.existing_website.message}
                        </p>
                      )}
                    </div>

                    {/* Chiffre d'affaires mensuel */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Chiffre d'affaires mensuel <span className="text-red-500">*</span>
                      </label>
                      <select
                        {...register('monthly_revenue')}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#0f4c81] focus:border-transparent transition-all ${
                          errors.monthly_revenue ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Sélectionnez une tranche</option>
                        {monthlyRevenueOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      {errors.monthly_revenue && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.monthly_revenue.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Détails du projet */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="w-8 h-8 bg-[#0f4c81] text-white rounded-full flex items-center justify-center text-sm mr-3">
                      3
                    </span>
                    Détails du projet
                  </h3>
                  <div className="space-y-4">
                    {/* Budget disponible */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Budget disponible <span className="text-red-500">*</span>
                      </label>
                      <select
                        {...register('budget_range')}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#0f4c81] focus:border-transparent transition-all ${
                          errors.budget_range ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Sélectionnez une tranche</option>
                        {budgetRangeOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      {errors.budget_range && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.budget_range.message}
                        </p>
                      )}
                    </div>

                    {/* Délai souhaité */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Délai souhaité <span className="text-red-500">*</span>
                      </label>
                      <select
                        {...register('desired_timeline')}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#0f4c81] focus:border-transparent transition-all ${
                          errors.desired_timeline ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Sélectionnez un délai</option>
                        {timelineOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      {errors.desired_timeline && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1" />
                          {errors.desired_timeline.message}
                        </p>
                      )}
                    </div>

                    {/* Besoins spécifiques */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Besoins spécifiques (optionnel)
                      </label>
                      <textarea
                        {...register('specific_needs')}
                        rows={4}
                        placeholder="Décrivez vos besoins particuliers, objectifs, contraintes..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f4c81] focus:border-transparent transition-all resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Formule (lecture seule) */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Formule sélectionnée
                  </label>
                  <input
                    type="text"
                    value={formulaName}
                    disabled
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 font-semibold cursor-not-allowed"
                  />
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-[#0f4c81] to-[#ff7f50] text-white rounded-lg font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Envoi en cours...
                      </>
                    ) : (
                      'Envoyer ma demande'
                    )}
                  </button>
                </div>

                {/* Note de confidentialité */}
                <p className="text-xs text-gray-500 text-center pt-2">
                  Vos informations sont confidentielles et ne seront utilisées que pour vous contacter concernant votre projet.
                </p>
              </form>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FormulaQuoteForm;
