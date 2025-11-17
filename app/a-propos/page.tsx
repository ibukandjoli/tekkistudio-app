// app/a-propos/page.tsx
'use client';

import React from 'react';
import { Heart, Target, Rocket, Users, Star, Leaf, Calendar, Award, MessagesSquare, ArrowRight, ExternalLink, Lightbulb, TrendingUp, Zap } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Container from '@/app/components/ui/Container';

const AboutPage = () => {
  const milestones = [
    { year: "2023", title: "Création de TEKKI Studio", description: "Fondation de la première Fabrique de Marques de Niche d'Afrique de l'Ouest." },
    { year: "2023", title: "Lancement de VIENS ON S'CONNAÎT", description: "Création et lancement réussi de notre première marque de jeux de conversation." },
    { year: "2024", title: "Lancement de AMANI", description: "Développement et lancement de notre 2e marque dédiée au bien-être féminin." },
    { year: "2024", title: "Début de l'accompagnement", description: "Ouverture de notre offre d'accompagnement pour aider d'autres marques africaines." },
    { year: "2025", title: "Expansion continue", description: "Développement de nouvelles marques et accompagnement de plus de marques africaines vers le succès e-commerce." }
  ];

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
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              À Propos de TEKKI Studio
            </h1>
            <p className="text-xl opacity-90">
              Une fabrique de marques qui accompagne les marques africaines vers le succès e-commerce
            </p>
          </div>
        </Container>
      </section>

      {/* Notre Mission */}
      <section className="py-16 bg-white">
        <Container>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-tekki-blue text-center mb-8">
              Notre Mission
            </h2>
            <div className="bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-md transition-all">
              <p className="text-lg text-gray-600 mb-6">
                <span className="font-bold text-tekki-blue">TEKKI Studio</span> est une fabrique de marques africaines qui crée ses propres marques tout en accompagnant d'autres marques du continent à devenir des success stories e-commerce.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Notre expertise unique provient du fait que nous testons d'abord toutes nos stratégies sur nos propres marques. Chaque technique de marketing, chaque optimisation de conversion, chaque stratégie de croissance que nous recommandons a déjà fait ses preuves sur VIENS ON S'CONNAÎT, AMANI ou nos autres marques.
              </p>
              <p className="text-lg text-gray-600">
                Vous ne payez pas pour de la théorie ou des conseils génériques. Vous bénéficiez de stratégies testées, validées et optimisées sur le terrain africain, par des entrepreneurs qui comprennent vos défis parce qu'ils les vivent quotidiennement.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-gray-50">
        <Container>
          <h2 className="text-3xl font-bold text-tekki-blue text-center mb-12">
            Notre Parcours
          </h2>
          <div className="max-w-3xl mx-auto relative">
            {/* Line connecting all milestones */}
            <div className="absolute left-16 top-0 bottom-0 w-1 bg-tekki-blue hidden md:block"></div>

            {milestones.map((milestone, index) => (
              <div key={index} className="flex mb-12 last:mb-0 group">
                <div className="mr-8 relative hidden md:block">
                  <div className="w-12 h-12 bg-tekki-blue rounded-full flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform">
                    <Calendar className="w-6 h-6" />
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all w-full md:w-auto border border-gray-100 group-hover:border-tekki-coral/20">
                  <div className="text-tekki-coral font-bold mb-2">{milestone.year}</div>
                  <h3 className="text-xl font-bold text-tekki-blue mb-3">{milestone.title}</h3>
                  <p className="text-gray-600">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Notre Double Expertise */}
      <section className="py-16 bg-white">
        <Container>
          <h2 className="text-3xl font-bold text-tekki-blue text-center mb-12">
            Notre Double Expertise
          </h2>
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
            {/* Fabrique de marques */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-xl shadow-sm hover:shadow-md transition-all border border-purple-100 hover:border-purple-200">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white mb-4">
                <Lightbulb className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-tekki-blue mb-4">
                Fabrique de Marques
              </h3>
              <p className="text-gray-600 mb-4">
                Nous identifions des besoins non satisfaits sur le marché africain et créons des marques qui y répondent concrètement. VIENS ON S'CONNAÎT et AMANI sont nées de ce processus rigoureux.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5 mr-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  </div>
                  <span className="text-gray-700">+8 000 produits vendus</span>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5 mr-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  </div>
                  <span className="text-gray-700">7 pays d'export</span>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5 mr-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  </div>
                  <span className="text-gray-700">+95% de satisfaction client</span>
                </li>
              </ul>
              <Link
                href="/nos-marques"
                className="inline-flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-all shadow-lg hover:shadow-xl mt-6"
              >
                Découvrir nos marques
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>

            {/* Accompagnement de marques */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-xl shadow-sm hover:shadow-md transition-all border border-blue-100 hover:border-blue-200">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white mb-4">
                <TrendingUp className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-tekki-blue mb-4">
                Accompagnement E-commerce
              </h3>
              <p className="text-gray-600 mb-4">
                Nous aidons les marques africaines à atteindre leurs objectifs e-commerce en leur transmettant les stratégies qui ont fait le succès de nos propres marques.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5 mr-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  </div>
                  <span className="text-gray-700">+200% de croissance CA en moyenne</span>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5 mr-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  </div>
                  <span className="text-gray-700">Stratégies testées et validées</span>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5 mr-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  </div>
                  <span className="text-gray-700">100% de satisfaction client</span>
                </li>
              </ul>
              <Link
                href="/cas-clients"
                className="inline-flex items-center justify-center bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-all shadow-lg hover:shadow-xl mt-6"
              >
                Voir nos cas clients
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Notre Approche */}
      <section className="py-16 bg-gray-50">
        <Container>
          <h2 className="text-3xl font-bold text-tekki-blue text-center mb-12">
            Notre Approche Unique
          </h2>
          <div className="max-w-3xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all mb-8 border border-gray-100 hover:border-tekki-blue/20 group">
              <h3 className="text-2xl font-bold text-tekki-blue mb-4 flex items-center">
                <div className="w-10 h-10 bg-tekki-coral/10 rounded-full flex items-center justify-center mr-3 group-hover:bg-tekki-coral/20 transition-all">
                  <Zap className="w-6 h-6 text-tekki-coral" />
                </div>
                Testez d'abord, enseignez ensuite
              </h3>
              <p className="text-gray-600 mb-4">
                Chaque stratégie que nous recommandons a d'abord été testée sur nos propres marques. Nous ne vendons jamais de la théorie, uniquement des techniques qui ont généré des résultats mesurables.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all mb-8 border border-gray-100 hover:border-tekki-blue/20 group">
              <h3 className="text-2xl font-bold text-tekki-blue mb-4 flex items-center">
                <div className="w-10 h-10 bg-tekki-coral/10 rounded-full flex items-center justify-center mr-3 group-hover:bg-tekki-coral/20 transition-all">
                  <Target className="w-6 h-6 text-tekki-coral" />
                </div>
                Expertise du marché africain
              </h3>
              <p className="text-gray-600 mb-4">
                Nous comprenons les spécificités du marché africain : paiements mobile money, logistique locale, comportements d'achat, réseaux sociaux privilégiés. Notre expertise vient de notre expérience terrain.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 hover:border-tekki-blue/20 group">
              <h3 className="text-2xl font-bold text-tekki-blue mb-4 flex items-center">
                <div className="w-10 h-10 bg-tekki-coral/10 rounded-full flex items-center justify-center mr-3 group-hover:bg-tekki-coral/20 transition-all">
                  <Award className="w-6 h-6 text-tekki-coral" />
                </div>
                Accompagnement complet
              </h3>
              <p className="text-gray-600 mb-4">
                De la création de votre site e-commerce à l'optimisation de vos campagnes publicitaires, nous vous accompagnons à chaque étape avec des stratégies éprouvées qui génèrent des ventes.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Vision et Valeurs */}
      <section className="py-16 bg-white">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-tekki-blue mb-6">
              Notre Vision
            </h2>
            <div className="max-w-3xl mx-auto bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100">
              <p className="text-lg text-gray-600">
                Devenir la référence africaine en création de marques et en accompagnement e-commerce, reconnue pour transformer des marques locales en success stories régionales et internationales grâce à des stratégies éprouvées sur le terrain.
              </p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-tekki-blue text-center mb-12">
            Nos Valeurs Fondamentales
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                icon: <Star className="w-8 h-8 text-tekki-coral" />,
                title: "Authenticité",
                description: "Nous ne vendons que ce que nous avons testé et validé sur nos propres marques"
              },
              {
                icon: <Target className="w-8 h-8 text-tekki-coral" />,
                title: "Résultats",
                description: "Notre succès se mesure à vos ventes, pas à nos promesses"
              },
              {
                icon: <Heart className="w-8 h-8 text-tekki-coral" />,
                title: "Impact",
                description: "Nous créons des solutions qui transforment positivement les marques africaines"
              }
            ].map((value, index) => (
              <div key={index} className="text-center p-6 bg-gray-50 rounded-xl shadow-sm hover:shadow-lg transition-all transform hover:-translate-y-1 duration-300 border border-gray-100 hover:border-tekki-coral/20">
                <div className="w-16 h-16 bg-tekki-coral/10 rounded-full flex items-center justify-center mx-auto mb-4 hover:bg-tekki-coral/20 transition-all">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-tekki-blue mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* L'Équipe */}
      <section className="py-16 bg-gray-50">
        <Container>
          <h2 className="text-3xl font-bold text-tekki-blue text-center mb-6">
            Notre Équipe
          </h2>
          <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto mb-12">
            Une équipe d'entrepreneurs et d'experts qui créent et font grandir des marques e-commerce chaque jour
          </p>
          <div className="text-center">
            <Link
              href="/equipe"
              className="inline-flex items-center justify-center bg-tekki-blue hover:bg-tekki-blue/90 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl"
            >
              Rencontrer l'équipe
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </Container>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-tekki-blue to-tekki-coral text-white">
        <Container className="text-center">
          <h2 className="text-3xl font-bold mb-6">
            Prêt à transformer votre marque en success story e-commerce ?
          </h2>
          <p className="text-xl opacity-90 max-w-3xl mx-auto mb-8">
            Découvrez nos formules d'accompagnement et bénéficiez de stratégies testées et validées sur nos propres marques
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/nos-formules"
              className="bg-white text-tekki-blue hover:bg-white/90 px-8 py-4 rounded-lg font-bold text-lg transition-all hover:shadow-lg flex items-center justify-center"
            >
              Découvrir nos formules
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <a
              href="https://calendly.com/tekki-studio/consultation-gratuite"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 border border-white/20 text-white hover:bg-white/20 px-8 py-4 rounded-lg font-bold text-lg transition-all flex items-center justify-center"
            >
              Réserver un appel gratuit
              <ExternalLink className="ml-2 h-5 w-5" />
            </a>
          </div>
        </Container>
      </section>
    </main>
  );
};

export default AboutPage;
