// app/formations/[slug]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Clock, 
  Calendar, 
  Users, 
  BookOpen, 
  CheckCircle2,
  Star,
  Loader2
} from 'lucide-react';
import { getFormationBySlug } from '@/app/lib/db/formations';
import type { Formation } from '@/app/types/database';
import EnrollmentModal from '@/app/components/formations/EnrollmentModal';

const FormationDetailPage = () => {
  const params = useParams();
  const currentSlug = params.slug as string;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formation, setFormation] = useState<Formation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFormation = async () => {
      try {
        const data = await getFormationBySlug(currentSlug);
        setFormation(data);
      } catch (err) {
        console.error('Erreur lors du chargement de la formation:', err);
        setError('Une erreur est survenue lors du chargement de la formation.');
      } finally {
        setLoading(false);
      }
    };

    fetchFormation();
  }, [currentSlug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-[#ff7f50]" />
      </div>
    );
  }

  if (error || !formation) {
    return (
      <div className="container mx-auto px-4 py-20">
        <h1 className="text-2xl font-bold text-[#0f4c81]">
          {error || 'Formation non trouvée'}
        </h1>
        <Link href="/formations" className="text-[#ff7f50] hover:underline">
          Retour aux formations
        </Link>
      </div>
    );
  }

  return (
    <main className="pb-20">
      {/* Hero Section */}
      <section className="bg-[#0f4c81] relative min-h-[400px] flex items-center">
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-12 h-full">
            {[...Array(48)].map((_, i) => (
              <div key={i} className="border border-white/20" />
            ))}
          </div>
        </div>

        <div className="container mx-auto px-4 pt-32 pb-20 relative z-10">
          <Link 
            href="/formations" 
            className="inline-flex items-center text-white/80 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour aux formations
          </Link>
          
          <div className="max-w-4xl">
            <div className="mb-6">
              <span className="bg-[#ff7f50] text-white px-4 py-2 rounded-full text-sm font-medium">
                {formation.category}
              </span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              {formation.title}
            </h1>
            <p className="text-xl text-white/90 max-w-3xl">
              {formation.description}
            </p>
          </div>
        </div>
      </section>

      {/* Informations principales */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-6 h-6 text-[#ff7f50]" />
                <h3 className="font-bold text-[#0f4c81]">Durée</h3>
              </div>
              <p className="text-gray-600">{formation.duration}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-6 h-6 text-[#ff7f50]" />
                <h3 className="font-bold text-[#0f4c81]">Sessions</h3>
              </div>
              <p className="text-gray-600">{formation.sessions}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-6 h-6 text-[#ff7f50]" />
                <h3 className="font-bold text-[#0f4c81]">Niveau</h3>
              </div>
              <p className="text-gray-600">{formation.level}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Programme */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-[#0f4c81] mb-8">
              Programme de la formation
            </h2>
            <div className="bg-white rounded-xl p-8 shadow-sm">
              {(formation.modules && Array.isArray(formation.modules) ? formation.modules : []).map((module, index) => (
                <div key={index} className="flex items-start gap-4 mb-6 last:mb-0">
                  <div className="w-8 h-8 bg-[#ff7f50] bg-opacity-10 rounded-full flex items-center justify-center shrink-0">
                    <BookOpen className="w-4 h-4 text-[#ff7f50]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#0f4c81] mb-2">
                      {module.title}
                    </h3>
                    <p className="text-gray-600 mb-3">{module.description}</p>
                    <ul className="space-y-2">
                      {(module.lessons && Array.isArray(module.lessons) ? module.lessons : []).map((lesson, lessonIndex) => (
                        <li key={lessonIndex} className="flex items-center gap-2 text-gray-600">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#ff7f50]" />
                          <span>{lesson}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bénéfices */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-[#0f4c81] mb-8">
              Ce que vous apprendrez
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {(formation.benefits && Array.isArray(formation.benefits) ? formation.benefits : []).map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#ff7f50] shrink-0 mt-1" />
                  <p className="text-gray-600">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Formateur */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-[#0f4c81] mb-8">
              Votre formateur
            </h2>
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="w-24 h-24 rounded-full bg-[#0f4c81] flex items-center justify-center text-white text-2xl font-bold">
                  {formation.formateur?.name ? formation.formateur.name.charAt(0) : 'F'}
                </div>
                <div>
                  <h3 className="font-bold text-[#0f4c81] text-xl mb-1">
                    {formation.formateur?.name || 'Formateur'}
                  </h3>
                  <p className="text-[#ff7f50] mb-4">{formation.formateur?.role || 'Expert'}</p>
                  <p className="text-gray-600">
                    {formation.formateur?.bio || 'Biographie du formateur non disponible.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Prérequis */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-[#0f4c81] mb-8">
              Prérequis
            </h2>
            <ul className="space-y-3">
              {(formation.prerequisites && Array.isArray(formation.prerequisites) ? formation.prerequisites : []).map((prerequisite, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Star className="w-5 h-5 text-[#ff7f50] shrink-0 mt-1" />
                  <p className="text-gray-600">{prerequisite}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Prochaines sessions */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-[#0f4c81] mb-8">
              Prochaines sessions
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {(formation.prochaine_sessions && Array.isArray(formation.prochaine_sessions) ? formation.prochaine_sessions : []).map((session, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                  <p className="font-bold text-[#0f4c81] mb-2">{session.date}</p>
                  <p className="text-gray-600">
                    {session.places} places disponibles
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Prix et Inscription */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-gray-50 rounded-xl p-8 shadow-lg">
              <div className="text-3xl font-bold text-[#0f4c81] mb-2">
                {formation.price}
              </div>
              <p className="text-gray-600 mb-8">
                Formation complète avec support et certificat
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-[#ff7f50] text-white px-8 py-4 rounded-lg hover:bg-[#ff6b3d] transition-colors w-full mb-4"
                >
                S'inscrire maintenant
              </button>
              <p className="text-sm text-gray-500">
                Paiement 100% sécurisé par Wave
              </p>
            </div>
          </div>
        </div>
      </section>

      <EnrollmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formation={formation}
      />
    </main>
  );
};

export default FormationDetailPage;