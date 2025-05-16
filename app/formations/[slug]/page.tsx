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
  Loader2,
  ExternalLink,
  ArrowRight
} from 'lucide-react';
import { getFormationBySlug } from '@/app/lib/db/formations';
import type { Formation } from '@/app/types/database';
import EnrollmentModal from '@/app/components/formations/EnrollmentModal';
import Container from '@/app/components/ui/Container';
import { Badge } from '@/app/components/ui/badge';

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
        <Loader2 className="h-8 w-8 animate-spin text-tekki-coral" />
      </div>
    );
  }

  if (error || !formation) {
    return (
      <Container className="py-20">
        <h1 className="text-2xl font-bold text-tekki-blue">
          {error || 'Formation non trouvée'}
        </h1>
        <Link href="/formations" className="text-tekki-coral hover:underline">
          Retour aux formations
        </Link>
      </Container>
    );
  }

  return (
    <main className="pb-0">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-tekki-blue to-tekki-coral relative pt-28 pb-20">
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-12 h-full">
            {[...Array(48)].map((_, i) => (
              <div key={i} className="border border-white/20" />
            ))}
          </div>
        </div>

        <Container className="relative z-10">
          <Link 
            href="/formations" 
            className="inline-flex items-center text-white/80 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour aux formations
          </Link>
          
          <div className="max-w-4xl">
            <div className="mb-6">
              <Badge variant="digital" size="lg">
                {formation.category}
              </Badge>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              {formation.title}
            </h1>
            <p className="text-xl text-white/90 max-w-3xl">
              {formation.description}
            </p>
          </div>
        </Container>
      </section>

      {/* Informations principales */}
      <section className="py-12 bg-white">
        <Container>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-6 h-6 text-tekki-coral" />
                <h3 className="font-bold text-tekki-blue">Durée</h3>
              </div>
              <p className="text-gray-600">{formation.duration}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-6 h-6 text-tekki-coral" />
                <h3 className="font-bold text-tekki-blue">Sessions</h3>
              </div>
              <p className="text-gray-600">{formation.sessions}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-6 h-6 text-tekki-coral" />
                <h3 className="font-bold text-tekki-blue">Niveau</h3>
              </div>
              <p className="text-gray-600">{formation.level}</p>
            </div>
          </div>
        </Container>
      </section>

      {/* Programme */}
      <section className="py-12 bg-gray-50">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-tekki-blue mb-8">
              Programme de la formation
            </h2>
            <div className="bg-white rounded-xl p-8 shadow-sm">
              {(formation.modules && Array.isArray(formation.modules) ? formation.modules : []).map((module, index) => (
                <div key={index} className="group mb-8 last:mb-0">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-tekki-coral/10 rounded-full flex items-center justify-center shrink-0 group-hover:bg-tekki-coral/20 transition-colors">
                      <BookOpen className="w-4 h-4 text-tekki-coral" />
                    </div>
                    <div className="w-full">
                      <h3 className="font-bold text-tekki-blue text-xl mb-2">
                        {module.title}
                      </h3>
                      <p className="text-gray-600 mb-4">{module.description}</p>
                      
                      <div className="pl-4 border-l border-gray-200 group-hover:border-tekki-coral/30 transition-colors">
                        <ul className="space-y-3">
                          {(module.lessons && Array.isArray(module.lessons) ? module.lessons : []).map((lesson, lessonIndex) => (
                            <li key={lessonIndex} className="flex items-center gap-2 text-gray-600">
                              <div className="w-1.5 h-1.5 rounded-full bg-tekki-coral" />
                              <span>{lesson}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Bénéfices */}
      <section className="py-12 bg-white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-tekki-blue mb-8">
              Ce que vous apprendrez
            </h2>
            <div className="grid md:grid-cols-2 gap-6 bg-gray-50 p-8 rounded-xl shadow-sm">
              {(formation.benefits && Array.isArray(formation.benefits) ? formation.benefits : []).map((benefit, index) => (
                <div key={index} className="flex items-start gap-3 group">
                  <CheckCircle2 className="w-5 h-5 text-tekki-coral shrink-0 mt-1 group-hover:scale-110 transition-transform" />
                  <p className="text-gray-600 group-hover:text-gray-900 transition-colors">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Formateur */}
      <section className="py-12 bg-gray-50">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-tekki-blue mb-8">
              Votre formateur
            </h2>
            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-all">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="w-24 h-24 rounded-full bg-tekki-blue flex items-center justify-center text-white text-2xl font-bold">
                  {formation.formateur?.name ? formation.formateur.name.charAt(0) : 'F'}
                </div>
                <div>
                  <h3 className="font-bold text-tekki-blue text-xl mb-1">
                    {formation.formateur?.name || 'Formateur'}
                  </h3>
                  <p className="text-tekki-coral mb-4">{formation.formateur?.role || 'Expert'}</p>
                  <p className="text-gray-600">
                    {formation.formateur?.bio || 'Biographie du formateur non disponible.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Prérequis */}
      <section className="py-12 bg-white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-tekki-blue mb-8">
              Prérequis
            </h2>
            <div className="bg-gray-50 p-8 rounded-xl shadow-sm">
              <ul className="space-y-3">
                {(formation.prerequisites && Array.isArray(formation.prerequisites) ? formation.prerequisites : []).map((prerequisite, index) => (
                  <li key={index} className="flex items-start gap-3 group">
                    <Star className="w-5 h-5 text-tekki-coral shrink-0 mt-1 group-hover:scale-110 transition-transform" />
                    <p className="text-gray-600 group-hover:text-gray-900 transition-colors">{prerequisite}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* Prochaines sessions */}
      <section className="py-12 bg-gray-50">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-tekki-blue mb-8">
              Prochaines sessions
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {(formation.prochaine_sessions && Array.isArray(formation.prochaine_sessions) ? formation.prochaine_sessions : []).map((session, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all hover:border-tekki-coral/20 border border-transparent">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-tekki-blue text-lg">{session.date}</p>
                    <Badge variant={session.places > 5 ? 'success' : session.places > 0 ? 'warning' : 'error'}>
                      {session.places > 0 ? `${session.places} places disponibles` : 'Complet'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Prix et Inscription */}
      <section className="py-12 bg-white">
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-gray-50 rounded-xl p-8 shadow-lg border border-gray-100 hover:border-tekki-coral/20 transition-colors">
              <div className="text-3xl font-bold text-tekki-blue mb-2">
                {formation.price}
              </div>
              <p className="text-gray-600 mb-8">
                Formation complète avec support et certificat
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-tekki-coral hover:bg-tekki-coral/90 text-white px-8 py-4 rounded-lg transition-colors w-full mb-4 flex items-center justify-center font-medium"
              >
                S'inscrire maintenant
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
              <p className="text-sm text-gray-500 flex items-center justify-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Paiement 100% sécurisé par Wave/Orange Money
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-tekki-blue to-tekki-coral text-white">
        <Container className="text-center">
          <h2 className="text-3xl font-bold mb-6">
            Vous avez des questions sur cette formation ?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Nous sommes là pour vous aider à prendre la meilleure décision pour votre développement professionnel.
          </p>
          <Link
            href="https://wa.me/221781362728?text=Bonjour ! j'aimerais en savoir plus sur la formation"
            className="inline-flex items-center justify-center bg-white text-tekki-blue hover:bg-white/90 px-8 py-4 rounded-lg font-medium text-lg transition-colors"
            target="_blank"
          >
            Contactez-nous
            <ExternalLink className="ml-2 h-5 w-5" />
          </Link>
        </Container>
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