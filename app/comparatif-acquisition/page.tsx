// app/comparatif-acquisition/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  CheckCircle, 
  XCircle, 
  ArrowRight, 
  ShoppingBag, 
  Globe, 
  Clock, 
  DollarSign, 
  MapPin, 
  BarChart, 
  Truck, 
  RefreshCcw, 
  Box, 
  Briefcase, 
  Users, 
  Settings,
  ExternalLink
} from 'lucide-react';
import Container from '@/app/components/ui/Container';
import { formatPrice } from '@/app/lib/utils/price-utils';
import { cn } from '@/app/lib/utils';

export default function ComparatifAcquisitionPage() {
  const [activeTab, setActiveTab] = useState<'tableau' | 'questions'>('tableau');

  return (
    <main className="pb-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-tekki-blue to-tekki-coral text-white py-16 md:py-24 pt-28 md:pt-32">
        <Container className="px-4 md:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-2">
                E-commerce <span className="text-black/90">vs</span> Digital
            </h1>
            <h1 className="text-3xl md:text-5xl font-bold mb-6">
              Quel business est fait pour vous?
            </h1>
            <p className="text-lg md:text-xl opacity-90 mb-8">
              Comparez les deux types de business clé en main pour choisir celui qui 
              correspond le mieux à vos objectifs, compétences et budget.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                href="/business?type=physical" 
                className="px-5 py-3 bg-white text-tekki-blue font-medium rounded-lg transition-colors hover:bg-gray-100 flex items-center justify-center"
              >
                Voir les business E-commerce
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
              <Link 
                href="/business?type=digital" 
                className="px-5 py-3 bg-white/10 backdrop-blur-sm text-white font-medium rounded-lg border border-white/20 transition-colors hover:bg-white/20 flex items-center justify-center"
              >
                Voir les business Digitaux
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Onglets */}
      <section className="bg-white border-b sticky top-0 z-20">
        <Container className="px-4 md:px-6 lg:px-8">
          <div className="flex -mb-px">
            <button
              onClick={() => setActiveTab('tableau')}
              className={`px-4 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === 'tableau'
                  ? "border-tekki-blue text-tekki-blue"
                  : "border-transparent text-gray-600 hover:text-tekki-blue hover:border-tekki-blue/30"
              }`}
            >
              Tableau comparatif
            </button>
            <button
              onClick={() => setActiveTab('questions')}
              className={`px-4 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === 'questions'
                  ? "border-tekki-blue text-tekki-blue"
                  : "border-transparent text-gray-600 hover:text-tekki-blue hover:border-tekki-blue/30"
              }`}
            >
              Choisir votre business idéal
            </button>
          </div>
        </Container>
      </section>

      {/* Contenu principal */}
      {activeTab === 'tableau' ? (
        <TableauComparatif />
      ) : (
        <QuestionsGuide />
      )}

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-tekki-blue to-tekki-coral py-16">
        <Container className="px-4 md:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-3xl font-bold mb-6">Prêt à lancer votre business?</h2>
            <p className="text-lg opacity-90 mb-8">
              Que vous choisissiez l'e-commerce ou le digital, nous avons le
              business clé en main qui correspond à vos objectifs et votre budget.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/business" 
                className="px-6 py-3 bg-white text-tekki-blue font-medium rounded-lg transition-colors hover:bg-gray-100 flex items-center justify-center"
              >
                Découvrir tous nos business
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link 
                href="https://wa.me/221781362728" 
                className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white font-medium rounded-lg border border-white/20 transition-colors hover:bg-white/20 flex items-center justify-center"
                target="_blank"
              >
                Contactez-nous
                <ExternalLink className="ml-2 w-4 h-4" />
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}

// Composant du tableau comparatif
function TableauComparatif() {
  // Conversion des montants d'euros en FCFA (taux approximatif: 1 EUR = 655.957 FCFA)
  const ecommerceMinBudget = 376000; // ~576€
  const ecommerceMaxBudget = 1968000; // ~3000€
  const ecommerceMinPotential = 1312000; // ~2000€
  const ecommerceMaxPotential = 4592000; // ~7000€
  
  const digitalMinBudget = 800000; // ~1220€
  const digitalMaxBudget = 3280000; // ~5000€
  const digitalMinPotential = 1968000; // ~3000€
  const digitalMaxPotential = 6560000; // ~10000€
  
  // Création des arrays pour les cartes mobiles
  const ecommerceItems = [
    { label: "Budget initial", value: `${formatPrice(ecommerceMinBudget)} - ${formatPrice(ecommerceMaxBudget)}` },
    { label: "Potentiel mensuel", value: `${formatPrice(ecommerceMinPotential)} - ${formatPrice(ecommerceMaxPotential)}` },
    { label: "Temps de mise en place", value: "1-3 semaines" },
    { label: "Gestion logistique", value: "Oui (stocks, expéditions, retours)" },
    { label: "Revenus récurrents", value: "Possible (abonnements)" },
    { label: "Compétences techniques", value: "Basiques (Dukka, Shopify, WooCommerce)" },
    { label: "Temps requis hebdomadaire", value: "12-20h" },
    { label: "Mobilité de gestion", value: "Bonne (certaines contraintes)" },
    { label: "Frais récurrents", value: "Moyens (logistique, marketing)" },
    { label: "Service client", value: "Élevé (livraisons, retours)" },
    { label: "Scalabilité", value: "Bonne" }
  ];
  
  const digitalItems = [
    { label: "Budget initial", value: `${formatPrice(digitalMinBudget)} - ${formatPrice(digitalMaxBudget)}` },
    { label: "Potentiel mensuel", value: `${formatPrice(digitalMinPotential)} - ${formatPrice(digitalMaxPotential)}` },
    { label: "Temps de mise en place", value: "1 semaine" },
    { label: "Gestion logistique", value: "Non (100% en ligne)" },
    { label: "Revenus récurrents", value: "Oui (abonnements SaaS, membres, etc.)" },
    { label: "Compétences techniques", value: "Intermédiaires (gestion de plateforme)" },
    { label: "Temps requis hebdomadaire", value: "10-15h" },
    { label: "Mobilité de gestion", value: "Excellente (100% à distance)" },
    { label: "Frais récurrents", value: "Faibles (hébergement, outils)" },
    { label: "Service client", value: "Modéré (support technique)" },
    { label: "Scalabilité", value: "Excellente" }
  ];

  return (
    <section className="py-12">
      <Container className="px-4 md:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Tableau comparatif</h2>
        
        {/* Version mobile - Cards */}
        <div className="md:hidden space-y-8">
          <ComparisonCard 
            title="E-commerce"
            icon={<ShoppingBag className="w-6 h-6" />}
            iconBackground="bg-tekki-blue/10"
            iconColor="text-tekki-blue"
            items={ecommerceItems}
            advantages={[
              "Concept concret et facile à expliquer",
              "Modèle économique éprouvé et stabilisé",
              "Investissement initial plus accessible",
              "Nombreuses opportunités de marketing créatif",
              "Possibilité de vendre à des clients internationaux"
            ]}
            disadvantages={[
              "Gestion des stocks et de la logistique",
              "Dépendance aux fournisseurs",
              "Service client plus exigeant (retours, livraisons)",
              "Frais récurrents plus élevés",
              "Moins de mobilité géographique"
            ]}
            conclusion="L'e-commerce est idéal si vous aimez les produits physiques et souhaitez un modèle éprouvé avec un investissement initial plus accessible."
            ctaLink="/business?type=physical"
            ctaText="Voir les business E-commerce"
            ctaColor="bg-tekki-blue"
          />
          
          <ComparisonCard 
            title="Digital"
            icon={<Globe className="w-6 h-6" />}
            iconBackground="bg-tekki-coral/10"
            iconColor="text-tekki-coral"
            items={digitalItems}
            advantages={[
              "Aucune logistique physique à gérer",
              "Revenus récurrents et prévisibles (abonnements)",
              "Scalabilité exceptionnelle",
              "Frais d'exploitation plus faibles",
              "Mobilité géographique totale (100% en ligne)"
            ]}
            disadvantages={[
              "Investissement initial plus élevé",
              "Besoin d'un minimum de connaissances techniques",
              "Peut être plus abstrait à comprendre",
              "Mise à jour constante nécessaire",
              "Concurrence plus intense en ligne"
            ]}
            conclusion="Les business digitaux sont parfaits si vous cherchez une mobilité totale, des revenus récurrents et une excellente scalabilité sans gestion logistique."
            ctaLink="/business?type=digital"
            ctaText="Voir les business Digitaux"
            ctaColor="bg-tekki-coral"
          />
        </div>

        {/* Version desktop - Tableau */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="py-4 px-4 text-left bg-gray-50 border-b font-medium text-gray-600">Critères</th>
                <th className="py-4 px-4 text-center bg-tekki-blue/5 border-b font-medium text-tekki-blue">
                  <div className="flex items-center justify-center gap-2">
                    <ShoppingBag className="w-5 h-5" />
                    <span>E-commerce</span>
                  </div>
                </th>
                <th className="py-4 px-4 text-center bg-tekki-coral/5 border-b font-medium text-tekki-coral">
                  <div className="flex items-center justify-center gap-2">
                    <Globe className="w-5 h-5" />
                    <span>Digital</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-4 px-4 border-b flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">Budget initial</span>
                </td>
                <td className="py-4 px-4 text-center border-b bg-tekki-blue/5">
                  {formatPrice(ecommerceMinBudget)} - {formatPrice(ecommerceMaxBudget)}
                </td>
                <td className="py-4 px-4 text-center border-b bg-tekki-coral/5">
                  {formatPrice(digitalMinBudget)} - {formatPrice(digitalMaxBudget)}
                </td>
              </tr>
              <tr>
                <td className="py-4 px-4 border-b flex items-center gap-2">
                  <BarChart className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">Potentiel mensuel</span>
                </td>
                <td className="py-4 px-4 text-center border-b bg-tekki-blue/5">
                  {formatPrice(ecommerceMinPotential)} - {formatPrice(ecommerceMaxPotential)}
                </td>
                <td className="py-4 px-4 text-center border-b bg-tekki-coral/5">
                  {formatPrice(digitalMinPotential)} - {formatPrice(digitalMaxPotential)}
                </td>
              </tr>
              <tr>
                <td className="py-4 px-4 border-b flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">Temps de mise en place</span>
                </td>
                <td className="py-4 px-4 text-center border-b bg-tekki-blue/5">2-3 semaines</td>
                <td className="py-4 px-4 text-center border-b bg-tekki-coral/5">1 semaine</td>
              </tr>
              <tr>
                <td className="py-4 px-4 border-b flex items-center gap-2">
                  <Truck className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">Gestion logistique</span>
                </td>
                <td className="py-4 px-4 text-center border-b bg-tekki-blue/5">Oui (stocks, expéditions, retours)</td>
                <td className="py-4 px-4 text-center border-b bg-tekki-coral/5">Non (100% en ligne)</td>
              </tr>
              <tr>
                <td className="py-4 px-4 border-b flex items-center gap-2">
                  <RefreshCcw className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">Revenus récurrents</span>
                </td>
                <td className="py-4 px-4 text-center border-b bg-tekki-blue/5">Possible (abonnements)</td>
                <td className="py-4 px-4 text-center border-b bg-tekki-coral/5">Oui (abonnements SaaS, membres, etc.)</td>
              </tr>
              <tr>
                <td className="py-4 px-4 border-b flex items-center gap-2">
                  <Settings className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">Compétences techniques</span>
                </td>
                <td className="py-4 px-4 text-center border-b bg-tekki-blue/5">Basiques (Dukka, Shopify, WooCommerce)</td>
                <td className="py-4 px-4 text-center border-b bg-tekki-coral/5">Intermédiaires (gestion de plateforme)</td>
              </tr>
              <tr>
                <td className="py-4 px-4 border-b flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">Temps requis hebdomadaire</span>
                </td>
                <td className="py-4 px-4 text-center border-b bg-tekki-blue/5">12-20h</td>
                <td className="py-4 px-4 text-center border-b bg-tekki-coral/5">10-15h</td>
              </tr>
              <tr>
                <td className="py-4 px-4 border-b flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">Mobilité de gestion</span>
                </td>
                <td className="py-4 px-4 text-center border-b bg-tekki-blue/5">Bonne (certaines contraintes)</td>
                <td className="py-4 px-4 text-center border-b bg-tekki-coral/5">Excellente (100% à distance)</td>
              </tr>
              <tr>
                <td className="py-4 px-4 border-b flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">Frais récurrents</span>
                </td>
                <td className="py-4 px-4 text-center border-b bg-tekki-blue/5">Moyens (logistique, marketing)</td>
                <td className="py-4 px-4 text-center border-b bg-tekki-coral/5">Faibles (hébergement, outils)</td>
              </tr>
              <tr>
                <td className="py-4 px-4 border-b flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">Service client</span>
                </td>
                <td className="py-4 px-4 text-center border-b bg-tekki-blue/5">Élevé (livraisons, retours)</td>
                <td className="py-4 px-4 text-center border-b bg-tekki-coral/5">Modéré (support technique)</td>
              </tr>
              <tr>
                <td className="py-4 px-4 border-b flex items-center gap-2">
                  <BarChart className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">Scalabilité</span>
                </td>
                <td className="py-4 px-4 text-center border-b bg-tekki-blue/5">Bonne</td>
                <td className="py-4 px-4 text-center border-b bg-tekki-coral/5">Excellente</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Avantages et inconvénients */}
        <div className="mt-16 grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-tekki-blue"></div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-tekki-blue/10 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-tekki-blue" />
              </div>
              <h3 className="text-xl font-bold">Business E-commerce</h3>
            </div>
            
            <div className="mb-6">
              <h4 className="font-semibold text-green-600 flex items-center gap-2 mb-3">
                <CheckCircle className="w-5 h-5" />
                Avantages
              </h4>
              <ul className="space-y-2 pl-7">
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
                  <span>Concept concret et facile à expliquer</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
                  <span>Modèle économique éprouvé et stabilisé</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
                  <span>Investissement initial plus accessible</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
                  <span>Nombreuses opportunités de marketing créatif</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
                  <span>Possibilité de vendre à des clients internationaux</span>
                </li>
              </ul>
            </div>
            
            <div className="mb-6">
              <h4 className="font-semibold text-red-600 flex items-center gap-2 mb-3">
                <XCircle className="w-5 h-5" />
                Inconvénients
              </h4>
              <ul className="space-y-2 pl-7">
                <li className="flex items-start">
                  <XCircle className="w-4 h-4 text-red-500 mt-1 mr-2 flex-shrink-0" />
                  <span>Gestion des stocks et de la logistique</span>
                </li>
                <li className="flex items-start">
                  <XCircle className="w-4 h-4 text-red-500 mt-1 mr-2 flex-shrink-0" />
                  <span>Dépendance aux fournisseurs</span>
                </li>
                <li className="flex items-start">
                  <XCircle className="w-4 h-4 text-red-500 mt-1 mr-2 flex-shrink-0" />
                  <span>Service client plus exigeant (retours, livraisons)</span>
                </li>
                <li className="flex items-start">
                  <XCircle className="w-4 h-4 text-red-500 mt-1 mr-2 flex-shrink-0" />
                  <span>Frais récurrents plus élevés</span>
                </li>
                <li className="flex items-start">
                  <XCircle className="w-4 h-4 text-red-500 mt-1 mr-2 flex-shrink-0" />
                  <span>Moins de mobilité géographique</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <p className="text-gray-700">
                L'e-commerce est idéal si vous aimez les produits physiques et souhaitez un modèle éprouvé avec un investissement initial plus accessible.
              </p>
            </div>
            
            <Link 
              href="/business?type=physical" 
              className="w-full bg-tekki-blue text-white py-3 px-4 rounded-lg font-semibold text-center block hover:bg-tekki-blue/90 transition-colors"
            >
              Voir les business E-commerce
            </Link>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-tekki-coral"></div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-tekki-coral/10 rounded-full flex items-center justify-center">
                <Globe className="w-5 h-5 text-tekki-coral" />
              </div>
              <h3 className="text-xl font-bold">Business Digital</h3>
            </div>
            
            <div className="mb-6">
              <h4 className="font-semibold text-green-600 flex items-center gap-2 mb-3">
                <CheckCircle className="w-5 h-5" />
                Avantages
              </h4>
              <ul className="space-y-2 pl-7">
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
                  <span>Aucune logistique physique à gérer</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
                  <span>Revenus récurrents et prévisibles (abonnements)</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
                  <span>Scalabilité exceptionnelle</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
                  <span>Frais d'exploitation plus faibles</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
                  <span>Mobilité géographique totale (100% en ligne)</span>
                </li>
              </ul>
            </div>
            
            <div className="mb-6">
              <h4 className="font-semibold text-red-600 flex items-center gap-2 mb-3">
                <XCircle className="w-5 h-5" />
                Inconvénients
              </h4>
              <ul className="space-y-2 pl-7">
                <li className="flex items-start">
                  <XCircle className="w-4 h-4 text-red-500 mt-1 mr-2 flex-shrink-0" />
                  <span>Investissement initial plus élevé</span>
                </li>
                <li className="flex items-start">
                  <XCircle className="w-4 h-4 text-red-500 mt-1 mr-2 flex-shrink-0" />
                  <span>Besoin d'un minimum de connaissances techniques</span>
                </li>
                <li className="flex items-start">
                  <XCircle className="w-4 h-4 text-red-500 mt-1 mr-2 flex-shrink-0" />
                  <span>Peut être plus abstrait à comprendre</span>
                </li>
                <li className="flex items-start">
                  <XCircle className="w-4 h-4 text-red-500 mt-1 mr-2 flex-shrink-0" />
                  <span>Mise à jour constante nécessaire</span>
                </li>
                <li className="flex items-start">
                  <XCircle className="w-4 h-4 text-red-500 mt-1 mr-2 flex-shrink-0" />
                  <span>Concurrence plus intense en ligne</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <p className="text-gray-700">
                Les business digitaux sont parfaits si vous cherchez une mobilité totale, des revenus récurrents et une excellente scalabilité sans gestion logistique.
              </p>
            </div>
            
            <Link 
              href="/business?type=digital" 
              className="w-full bg-tekki-coral text-white py-3 px-4 rounded-lg font-semibold text-center block hover:bg-tekki-coral/90 transition-colors"
            >
              Voir les business Digitaux
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}

// Composant des questions pour guider le choix
function QuestionsGuide() {
    // Conversion du seuil de budget de 2000€ en FCFA
    const budgetSeuil = 1312000; // 2000€ * 655.957
    
    return (
      <section className="py-12">
        <Container className="px-4 md:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Comment choisir votre business idéal</h2>
          
          <div className="max-w-3xl mx-auto bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-8">
            <p className="text-lg font-medium text-gray-700 mb-8">Questions à vous poser :</p>
            
            <div className="space-y-8">
              {/* Question 1 */}
              <div className="border-l-4 border-tekki-blue pl-4 py-2">
                <h3 className="font-bold text-lg mb-2">1. Quel est votre budget d'investissement?</h3>
                <p className="text-gray-700">
                  Si votre budget est inférieur à {formatPrice(budgetSeuil)}, un business e-commerce sera plus accessible.
                </p>
              </div>
              
              {/* Question 2 */}
              <div className="border-l-4 border-tekki-blue pl-4 py-2">
                <h3 className="font-bold text-lg mb-2">2. Préférez-vous les produits tangibles ou les services en ligne?</h3>
                <p className="text-gray-700">
                  Si vous préférez le tangible, l'e-commerce est fait pour vous. Si vous préférez le 100% en ligne, optez pour un business digital.
                </p>
              </div>
              
              {/* Question 3 */}
              <div className="border-l-4 border-tekki-blue pl-4 py-2">
                <h3 className="font-bold text-lg mb-2">3. Combien de temps pouvez-vous consacrer à votre business?</h3>
                <p className="text-gray-700">
                  Les business digitaux nécessitent généralement moins de temps (10-15h/semaine) que les business e-commerce (12-20h/semaine).
                </p>
              </div>
              
              {/* Question 4 */}
              <div className="border-l-4 border-tekki-blue pl-4 py-2">
                <h3 className="font-bold text-lg mb-2">4. Avez-vous besoin d'une flexibilité géographique totale?</h3>
                <p className="text-gray-700">
                  Si vous souhaitez pouvoir travailler de n'importe où, un business digital vous offrira plus de liberté.
                </p>
              </div>
              
              {/* Question 5 */}
              <div className="border-l-4 border-tekki-blue pl-4 py-2">
                <h3 className="font-bold text-lg mb-2">5. Quelle importance accordez-vous aux revenus récurrents?</h3>
                <p className="text-gray-700">
                  Les business digitaux offrent généralement des revenus plus récurrents et prévisibles via des abonnements.
                </p>
              </div>
            </div>
            
            <div className="mt-12 p-6 bg-gray-50 rounded-lg text-center">
              <h3 className="font-bold text-lg mb-3">Vous avez besoin d'aide pour faire le meilleur choix pour votre situation?</h3>
              <Link 
                href="https://wa.me/221781362728" 
                className="inline-flex items-center justify-center px-6 py-3 bg-tekki-blue text-white font-medium rounded-lg hover:bg-tekki-blue/90 transition-colors mt-3"
                target="_blank"
              >
                Contactez nos experts
                <ExternalLink className="ml-2 w-4 h-4" />
              </Link>
            </div>
          </div>
        </Container>
        
        {/* Section CTA supplémentaire */}
        <Container className="px-4 md:px-6 lg:px-8 mt-16">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-tekki-blue/5 rounded-xl p-6 relative overflow-hidden">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-tekki-blue/20 rounded-full flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-tekki-blue" />
                </div>
                <h3 className="text-xl font-bold text-tekki-blue">E-commerce</h3>
              </div>
              
              <p className="text-gray-700 mb-8">
                L'e-commerce est idéal si vous aimez les produits physiques et souhaitez un modèle éprouvé avec un investissement initial plus accessible.
              </p>
              
              <Link 
                href="/business?type=physical" 
                className="inline-flex items-center text-tekki-blue font-medium hover:underline"
              >
                Voir les business E-commerce
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              
              <div className="absolute -bottom-14 -right-14 w-48 h-48 bg-tekki-blue/10 rounded-full"></div>
            </div>
            
            <div className="bg-tekki-coral/5 rounded-xl p-6 relative overflow-hidden">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-tekki-coral/20 rounded-full flex items-center justify-center">
                  <Globe className="w-6 h-6 text-tekki-coral" />
                </div>
                <h3 className="text-xl font-bold text-tekki-coral">Digital</h3>
              </div>
              
              <p className="text-gray-700 mb-8">
                Les business digitaux sont parfaits si vous cherchez une mobilité totale, des revenus récurrents et une excellente scalabilité sans gestion logistique.
              </p>
              
              <Link 
                href="/business?type=digital" 
                className="inline-flex items-center text-tekki-coral font-medium hover:underline"
              >
                Voir les business Digitaux
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              
              <div className="absolute -bottom-14 -right-14 w-48 h-48 bg-tekki-coral/10 rounded-full"></div>
            </div>
          </div>
        </Container>
      </section>
    );
  }
  
  // Composant carte de comparaison (utilisé en version mobile uniquement)
  function ComparisonCard({ 
    title, 
    icon, 
    iconBackground,
    iconColor,
    items,
    advantages,
    disadvantages,
    conclusion,
    ctaLink,
    ctaText,
    ctaColor
  }: {
    title: string;
    icon: React.ReactNode;
    iconBackground: string;
    iconColor: string;
    items: { label: string; value: string; }[];
    advantages: string[];
    disadvantages: string[];
    conclusion: string;
    ctaLink: string;
    ctaText: string;
    ctaColor: string;
  }) {
    const [expanded, setExpanded] = useState(false);
    
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 ${iconBackground} rounded-full flex items-center justify-center`}>
              {icon}
            </div>
            <h3 className={`text-xl font-bold ${iconColor}`}>{title}</h3>
          </div>
          <button 
            onClick={() => setExpanded(!expanded)}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            {expanded ? 'Réduire' : 'Voir plus'}
          </button>
        </div>
        
        <div className="p-4">
          <div className="space-y-4">
            {items.slice(0, expanded ? items.length : 5).map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{item.label}</span>
                <span className="font-medium text-right">{item.value}</span>
              </div>
            ))}
          </div>
          
          {expanded && (
            <>
              <div className="mt-6">
                <h4 className="font-semibold text-green-600 flex items-center gap-2 mb-3">
                  <CheckCircle className="w-5 h-5" />
                  Avantages
                </h4>
                <ul className="space-y-2 pl-5">
                  {advantages.map((advantage, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
                      <span className="text-sm">{advantage}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="mt-4">
                <h4 className="font-semibold text-red-600 flex items-center gap-2 mb-3">
                  <XCircle className="w-5 h-5" />
                  Inconvénients
                </h4>
                <ul className="space-y-2 pl-5">
                  {disadvantages.map((disadvantage, index) => (
                    <li key={index} className="flex items-start">
                      <XCircle className="w-4 h-4 text-red-500 mt-1 mr-2 flex-shrink-0" />
                      <span className="text-sm">{disadvantage}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm">{conclusion}</p>
              </div>
            </>
          )}
          
          <div className="mt-4">
            <Link 
              href={ctaLink} 
              className={`w-full ${ctaColor} text-white py-2.5 px-4 rounded-lg font-medium text-center block hover:opacity-90 transition-colors text-sm flex items-center justify-center`}
            >
              {ctaText}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }