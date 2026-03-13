// app/formations/[slug]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Calendar,
  Users,
  BookOpen,
  CheckCircle,
  Star,
  Loader2,
  PlayCircle,
  Download,
  Award,
  Target,
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';
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
        <Loader2 className="h-8 w-8 animate-spin text-[#fe6117]" />
      </div>
    );
  }

  if (error || !formation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#0f4c81] mb-4">
            {error || 'Formation non trouvée'}
          </h1>
          <Link
            href="/formations"
            className="text-[#fe6117] hover:text-[#ff6b3d] font-semibold inline-flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux formations
          </Link>
        </div>
      </div>
    );
  }

  const features = [
    { icon: <PlayCircle className="w-6 h-6" />, text: "Vidéos à la demande" },
    { icon: <Download className="w-6 h-6" />, text: "Ressources téléchargeables" },
    { icon: <Award className="w-6 h-6" />, text: "Certificat de réussite" },
    { icon: <Users className="w-6 h-6" />, text: "Accès communauté" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28 bg-gradient-to-br from-gray-900 via-[#0f4c81] to-gray-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#fe6117]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 relative z-10">
          <Link
            href="/formations"
            className="inline-flex items-center text-white/80 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour aux formations
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm font-semibold mb-6">
              {formation.category}
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              {formation.title}
            </h1>

            <p className="text-xl text-white/90 mb-8 leading-relaxed max-w-3xl">
              {formation.description}
            </p>

            <div className="flex flex-wrap gap-6 text-white/90 mb-8">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#fe6117]" />
                <span>{formation.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-[#fe6117]" />
                <span>{formation.level || 'Tous niveaux'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#fe6117]" />
                <span>{formation.sessions || 'À votre rythme'}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center justify-center bg-[#fe6117] hover:bg-[#ff6b3d] text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-xl hover:shadow-2xl hover:scale-105"
              >
                S'inscrire maintenant
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
              <div className="inline-flex items-center justify-center bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-4 rounded-full font-bold text-lg">
                {formation.price}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Ce qui est inclus */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#fe6117] to-[#ff6b3d] flex items-center justify-center text-white mx-auto mb-3">
                  {feature.icon}
                </div>
                <div className="text-sm font-semibold text-gray-700">{feature.text}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Programme */}
      <section className="py-20 md:py-28 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-[#0f4c81] mb-4">
              Programme de la formation
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Un programme structuré pour une progression optimale
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto space-y-6">
            {(formation.modules && Array.isArray(formation.modules) ? formation.modules : []).map((module, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0f4c81] to-[#1a5a8f] flex items-center justify-center text-white font-bold flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-[#0f4c81] mb-3">
                      {module.title}
                    </h3>
                    <p className="text-gray-600 mb-6">{module.description}</p>

                    <div className="space-y-3">
                      {(module.lessons && Array.isArray(module.lessons) ? module.lessons : []).map((lesson, lessonIndex) => (
                        <div key={lessonIndex} className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                          <span className="text-gray-700">{lesson}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Ce que vous apprendrez */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-[#0f4c81] mb-4">
              Ce que vous apprendrez
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Des compétences concrètes pour transformer votre business
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
            {(formation.benefits && Array.isArray(formation.benefits) ? formation.benefits : []).map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                className="flex items-start gap-3 bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-all"
              >
                <CheckCircle className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-0.5" />
                <p className="text-gray-700 font-medium">{benefit}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Formateur */}
      {formation.formateur && (
        <section className="py-20 md:py-28 bg-gradient-to-br from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-[#0f4c81] mb-12 text-center">
                Votre formateur
              </h2>

              <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#0f4c81] to-[#1a5a8f] flex items-center justify-center text-white text-4xl font-bold flex-shrink-0">
                    {formation.formateur.name ? formation.formateur.name.charAt(0) : 'F'}
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-2xl font-bold text-[#0f4c81] mb-2">
                      {formation.formateur.name || 'Formateur'}
                    </h3>
                    <p className="text-[#fe6117] font-semibold text-lg mb-4">
                      {formation.formateur.role || 'Expert E-commerce'}
                    </p>
                    <p className="text-gray-600 leading-relaxed">
                      {formation.formateur.bio || 'Expert reconnu dans le domaine du e-commerce en Afrique.'}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Prérequis */}
      {formation.prerequisites && Array.isArray(formation.prerequisites) && formation.prerequisites.length > 0 && (
        <section className="py-20 md:py-28 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-[#0f4c81] mb-12 text-center">
                Prérequis
              </h2>

              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 border-2 border-blue-100">
                <ul className="space-y-4">
                  {formation.prerequisites.map((prerequisite, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Zap className="w-6 h-6 text-[#fe6117] flex-shrink-0 mt-0.5" />
                      <p className="text-gray-700 font-medium">{prerequisite}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Prochaines sessions */}
      {formation.prochaine_sessions && Array.isArray(formation.prochaine_sessions) && formation.prochaine_sessions.length > 0 && (
        <section className="py-20 md:py-28 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-[#0f4c81] mb-12 text-center">
                Prochaines sessions
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                {formation.prochaine_sessions.map((session, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <Calendar className="w-6 h-6 text-[#fe6117]" />
                      <p className="font-bold text-[#0f4c81] text-lg">{session.date}</p>
                    </div>
                    <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                      session.places > 5
                        ? 'bg-emerald-100 text-emerald-700'
                        : session.places > 0
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {session.places > 0 ? `${session.places} places disponibles` : 'Complet'}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA d'inscription */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-gray-900 via-[#0f4c81] to-gray-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#fe6117]/10 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-3xl p-12 text-center">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                Prêt à transformer votre business ?
              </h2>
              <p className="text-xl text-white/90 mb-8">
                Rejoignez la formation et obtenez les compétences pour réussir
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                <div className="text-4xl md:text-5xl font-bold text-white">
                  {formation.price}
                </div>
                <div className="text-white/80">
                  Paiement unique • Accès à vie
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center justify-center bg-[#fe6117] hover:bg-[#ff6b3d] text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-xl hover:shadow-2xl hover:scale-105"
                >
                  S'inscrire maintenant
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
                <a
                  href={`https://wa.me/221781362728?text=Bonjour ! J'aimerais en savoir plus sur la formation "${formation.title}".`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105"
                >
                  Poser une question
                </a>
              </div>

              <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-white/80">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <span>Satisfait ou remboursé</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <span>Certificat inclus</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <span>Support 24/7</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <EnrollmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formation={formation}
      />
    </div>
  );
};

export default FormationDetailPage;
