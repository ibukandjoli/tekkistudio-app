// app/formations/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Sparkles,
  CheckCircle,
  BookOpen,
  PlayCircle,
  Users,
  Trophy,
  Target,
  Zap,
  Loader2,
  Clock,
  BarChart
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { getFormations } from '../lib/db/formations';
import type { Formation } from '../types/database';

const FormationsPage = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const [formations, setFormations] = useState<Formation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFormations = async () => {
      try {
        const data = await getFormations();
        setFormations(data);
      } catch (err) {
        console.error('Erreur lors du chargement des formations:', err);
        setError('Une erreur est survenue lors du chargement des formations.');
      } finally {
        setLoading(false);
      }
    };

    fetchFormations();
  }, []);

  const benefits = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Formations 100% pratiques",
      description: "Pas de théorie, que du concret basé sur +8 000 produits vendus et +10 marques accompagnées"
    },
    {
      icon: <PlayCircle className="w-8 h-8" />,
      title: "Accessible 24/7",
      description: "Apprenez à votre rythme, depuis n'importe où en Afrique"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Communauté active",
      description: "Échangez avec d'autres entrepreneurs africains et notre équipe"
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "Certificat de réussite",
      description: "Prouvez vos compétences avec un certificat reconnu"
    }
  ];

  const stats = [
    { value: "+500", label: "Étudiants formés" },
    { value: "4.8/5", label: "Note moyenne" },
    { value: "100%", label: "Satisfaits ou remboursés" },
    { value: "24/7", label: "Support disponible" }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-[#fe6117]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Link href="/" className="text-[#0f4c81] hover:text-[#fe6117] font-semibold">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28 bg-gradient-to-br from-gray-900 via-[#0f4c81] to-gray-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#fe6117]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2.5 mb-8">
              <Sparkles className="w-4 h-4 text-[#fe6117]" />
              <span className="text-white/95 text-sm font-semibold">
                L'Académie TEKKI
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Apprenez ce que nous avons appris en vendant +8 000 produits
            </h1>

            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Des formations e-learning conçues pour les entrepreneurs africains qui veulent maîtriser l'e-commerce sans se ruiner
            </p>

            <div className="flex flex-wrap justify-center gap-6 text-white/90 mb-8">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span>Formations 100% pratiques</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span>Contexte africain</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span>Prix accessibles</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#formations"
                className="inline-flex items-center justify-center bg-[#fe6117] hover:bg-[#ff6b3d] text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-xl hover:shadow-2xl hover:scale-105"
              >
                Découvrir les formations
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
              <Link
                href="/nos-formules"
                className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105"
              >
                Nos offres Done-for-You
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-[#0f4c81] mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pourquoi l'Académie TEKKI */}
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
              Pourquoi l'Académie TEKKI ?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Parce que vous n'avez pas besoin de théories américaines. Vous avez besoin de stratégies qui marchent en Afrique.
            </p>
          </motion.div>

          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#fe6117] to-[#ff6b3d] flex items-center justify-center text-white mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-[#0f4c81] mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Liste des Formations */}
      <section id="formations" className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-[#0f4c81] mb-4">
              Nos formations disponibles
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Des compétences concrètes pour développer votre business e-commerce en Afrique
            </p>
          </motion.div>

          {formations.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg mb-6">
                Nos formations arrivent bientôt ! Soyez les premiers informés.
              </p>
              <a
                href="https://wa.me/221781362728?text=Bonjour ! J'aimerais être informé du lancement de l'Académie TEKKI."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-[#fe6117] hover:bg-[#ff6b3d] text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-xl hover:shadow-2xl hover:scale-105"
              >
                Me tenir informé
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
            </div>
          ) : (
            <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {formations.map((formation, index) => (
                <motion.div
                  key={formation.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all border border-gray-100 flex flex-col"
                >
                  {/* Header avec gradient */}
                  <div className="bg-gradient-to-br from-[#0f4c81] to-[#1a5a8f] p-8 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#fe6117]/20 rounded-full blur-2xl"></div>
                    <div className="relative z-10">
                      <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-semibold mb-4">
                        {formation.category}
                      </div>
                      <h3 className="text-2xl font-bold mb-2">{formation.title}</h3>
                      <p className="text-white/90 text-sm">{formation.description}</p>
                    </div>
                  </div>

                  {/* Contenu */}
                  <div className="p-8 flex-1 flex flex-col">
                    {/* Infos */}
                    <div className="flex items-center gap-4 mb-6 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#fe6117]" />
                        <span>{formation.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BarChart className="w-4 h-4 text-[#fe6117]" />
                        <span>{formation.level || 'Tous niveaux'}</span>
                      </div>
                    </div>

                    {/* Prix */}
                    <div className="mb-6">
                      <div className="text-3xl font-bold text-[#0f4c81]">{formation.price}</div>
                      <div className="text-sm text-gray-600">Paiement unique</div>
                    </div>

                    {/* Bénéfices */}
                    {formation.benefits && Array.isArray(formation.benefits) && formation.benefits.length > 0 && (
                      <div className="mb-6 flex-1">
                        <div className="font-semibold text-[#0f4c81] mb-3">Ce que vous apprendrez :</div>
                        <ul className="space-y-2">
                          {formation.benefits.slice(0, 4).map((benefit, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                              <span className="text-gray-600">{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* CTA */}
                    <Link
                      href={`/formations/${formation.slug}`}
                      className="block w-full text-center bg-gradient-to-r from-[#fe6117] to-[#ff6b3d] hover:opacity-90 text-white py-4 rounded-full font-semibold transition-all shadow-lg hover:shadow-xl hover:scale-105 group"
                    >
                      <span className="flex items-center justify-center">
                        En savoir plus
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-gray-900 via-[#0f4c81] to-gray-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#fe6117]/10 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Pas encore prêt pour une formation ?
            </h2>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Découvrez nos offres Done-for-You où nous gérons tout pour vous
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/nos-formules"
                className="inline-flex items-center justify-center bg-[#fe6117] hover:bg-[#ff6b3d] text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-xl hover:shadow-2xl hover:scale-105"
              >
                Voir nos offres
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <a
                href="https://calendly.com/tekki-studio/consultation-gratuite"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105"
              >
                Réserver un appel gratuit
              </a>
            </div>

            <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-white/80">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span>Garanties résultats</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span>Accompagnement personnalisé</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span>Paiement flexible</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default FormationsPage;
