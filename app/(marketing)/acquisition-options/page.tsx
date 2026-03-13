// app/acquisition-options/page.tsx
'use client';

import React, { useState, useRef } from 'react';
import { 
  ShoppingBag, 
  Rocket, 
  CheckCircle, 
  XCircle, 
  ArrowRight, 
  Calendar, 
  DollarSign, 
  Clock, 
  Calculator,
  Users,
  Shield,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import Container from '@/app/components/ui/Container';
import * as framerMotion from 'framer-motion';
const { motion, AnimatePresence } = framerMotion;

const AcquisitionOptionsPage = () => {
  const [activeTab, setActiveTab] = useState<'comparison' | 'calculator' | 'faq'>('comparison');
  const [selectedBusiness, setSelectedBusiness] = useState<'ecommerce' | 'digital'>('ecommerce');
  const [customPrice, setCustomPrice] = useState<string>("500000");

  // Prix types par défaut
  const businessPrices = {
    ecommerce: {
      min: 450000,
      max: 650000,
      average: 550000
    },
    digital: {
      min: 650000,
      max: 950000,
      average: 800000
    }
  };

  // Constantes pour les calculs d'acquisition progressive
  const INITIAL_PERCENTAGE = 40; // 40% du prix total
  const MONTHLY_PERCENTAGE = 10; // 10% par mois
  const MONTHLY_FEES = 5000; // Frais fixes mensuels
  const MONTHS_DURATION = 6; // Durée en mois

  // Références pour le scrolling
  const comparisonRef = useRef<HTMLDivElement>(null);
  const calculatorRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);

  // Fonction pour calculer les différents montants
  const calculateAmounts = (totalPrice: number) => {
    const initialPayment = Math.round(totalPrice * (INITIAL_PERCENTAGE / 100));
    const monthlyBase = Math.round(totalPrice * (MONTHLY_PERCENTAGE / 100));
    const monthlyPayment = monthlyBase + MONTHLY_FEES;
    const totalPayments = initialPayment + (monthlyPayment * MONTHS_DURATION);
    
    return {
      initialPayment,
      monthlyPayment,
      totalPayments,
      difference: totalPayments - totalPrice
    };
  };

  // Calculer les montants pour l'affichage et la calculatrice
  const price = selectedBusiness === 'ecommerce' 
    ? businessPrices.ecommerce.average 
    : businessPrices.digital.average;
    
  const customPriceValue = parseInt(customPrice) || businessPrices.ecommerce.average;
  
  const standardAmounts = calculateAmounts(price);
  const calculatorAmounts = calculateAmounts(customPriceValue);

  // Fonction pour le défilement fluide
  const scrollToSection = (sectionRef: React.RefObject<HTMLDivElement>) => {
    if (sectionRef && sectionRef.current) {
      window.scrollTo({
        top: sectionRef.current.offsetTop - 100,
        behavior: 'smooth'
      });
    }
  };

  // Questions fréquentes
  const faqs = [
    {
      question: "Comment fonctionne exactement l'acquisition progressive ?",
      answer: `L'acquisition progressive vous permet de démarrer avec seulement ${INITIAL_PERCENTAGE}% du prix total. 
      Vous versez ensuite ${MONTHLY_PERCENTAGE}% du prix + ${MONTHLY_FEES.toLocaleString()} FCFA de frais chaque mois pendant ${MONTHS_DURATION} mois. 
      Cela vous permet de commencer à générer des revenus pendant que vous finalisez l'acquisition.`
    },
    {
      question: "Quels sont les avantages de l'acquisition progressive par rapport à l'acquisition complète ?",
      answer: "L'acquisition progressive nécessite un investissement initial plus faible, ce qui diminue votre risque financier. Elle vous permet également de commencer à générer des revenus pendant que vous finalisez vos paiements, et d'apprendre progressivement à gérer votre business."
    },
    {
      question: "Y a-t-il des inconvénients à l'acquisition progressive ?",
      answer: "Le coût total est légèrement plus élevé qu'une acquisition complète en raison des frais mensuels. De plus, le transfert complet de propriété n'est effectué qu'après le dernier paiement, même si vous pouvez exploiter le business dès le premier versement."
    },
    {
      question: "Que se passe-t-il si je ne peux pas effectuer un paiement mensuel ?",
      answer: "Nous comprenons que des imprévus peuvent survenir. En cas de difficulté, contactez-nous immédiatement pour discuter des options. Nous pouvons généralement trouver un arrangement, comme un report de paiement ou un rééchelonnement, selon votre situation."
    },
    {
      question: "Est-ce que tous vos business sont disponibles en acquisition progressive ?",
      answer: "Oui, tous nos business e-commerce et digitaux peuvent être acquis via le modèle progressif. Cette option a été spécifiquement conçue pour rendre nos solutions accessibles à un plus grand nombre d'entrepreneurs, particulièrement en Afrique."
    },
    {
      question: "Comment se passe l'accompagnement avec l'acquisition progressive ?",
      answer: "Vous bénéficiez du même accompagnement de qualité qu'avec l'acquisition complète. Nos experts vous guident pendant les premiers mois pour vous aider à maîtriser votre business et à le développer efficacement."
    }
  ];

  return (
    <main className="pb-0">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-tekki-blue to-tekki-coral relative pt-28 pb-20 overflow-hidden">
        {/* Motif géométrique en arrière-plan */}
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-12 h-full">
            {[...Array(48)].map((_, i) => (
              <div key={i} className="border border-white/20" />
            ))}
          </div>
        </div>
        
        <Container className="relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-6 bg-white/10 backdrop-blur-sm px-6 py-2 rounded-full">
              <span className="text-white font-medium">
                <span className="text-tekki-coral">TEKKI STUDIO</span> • Options d'Acquisition
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Acquisition <span className="text-tekki-coral">Progressive</span> vs <span className="text-tekki-coral">Complète</span>
            </h1>
            
            <p className="text-xl text-white/90 mb-8">
              Deux façons flexibles d'acquérir votre business clé en main, adaptées à vos moyens et vos objectifs
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <button
                onClick={() => {
                  setActiveTab('comparison');
                  scrollToSection(comparisonRef);
                }}
                className="bg-white text-tekki-blue hover:bg-white/90 px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
              >
                Comparer les options
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              
              <button
                onClick={() => {
                  setActiveTab('calculator');
                  scrollToSection(calculatorRef);
                }}
                className="bg-white/10 border border-white/20 text-white hover:bg-white/20 px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
              >
                Calculateur de paiement
                <Calculator className="ml-2 h-5 w-5" />
              </button>
            </div>
          </div>
        </Container>
      </section>

      {/* Navigation des sections */}
      <section className="bg-white border-b sticky top-0 z-20">
        <Container>
          <div className="flex -mb-px overflow-x-auto scrollbar-hide">
            <button
              onClick={() => {
                setActiveTab('comparison');
                scrollToSection(comparisonRef);
              }}
              className={`px-4 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === 'comparison'
                  ? "border-tekki-blue text-tekki-blue"
                  : "border-transparent text-gray-600 hover:text-tekki-blue hover:border-tekki-blue/30"
              }`}
            >
              Comparaison des options
            </button>
            <button
              onClick={() => {
                setActiveTab('calculator');
                scrollToSection(calculatorRef);
              }}
              className={`px-4 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === 'calculator'
                  ? "border-tekki-blue text-tekki-blue"
                  : "border-transparent text-gray-600 hover:text-tekki-blue hover:border-tekki-blue/30"
              }`}
            >
              Calculateur de paiement
            </button>
            <button
              onClick={() => {
                setActiveTab('faq');
                scrollToSection(faqRef);
              }}
              className={`px-4 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === 'faq'
                  ? "border-tekki-blue text-tekki-blue"
                  : "border-transparent text-gray-600 hover:text-tekki-blue hover:border-tekki-blue/30"
              }`}
            >
              Questions fréquentes
            </button>
          </div>
        </Container>
      </section>

      {/* Introduction */}
      <section className="py-12 bg-gray-50">
        <Container>
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-tekki-blue mb-4">
              Pourquoi proposer l'acquisition progressive ?
            </h2>
            
            <p className="text-lg text-gray-600 mb-4">
              Chez TEKKI Studio, nous avons écouté les entrepreneurs africains qui souhaitaient acquérir nos business, mais pour qui l'investissement initial représentait un obstacle. 
            </p>
            
            <p className="text-lg text-gray-600 mb-4">
              L'acquisition progressive est notre réponse à ce besoin. Elle vous permet de démarrer votre business en payant seulement <span className="font-semibold">{INITIAL_PERCENTAGE}%</span> du prix, puis de compléter votre acquisition par des versements mensuels pendant que vous commencez déjà à générer des revenus.
            </p>
            
            <p className="text-lg text-gray-600">
              Cette approche réduit considérablement la barrière à l'entrée tout en vous permettant de bénéficier immédiatement de tous les avantages d'un business clé en main.
            </p>
          </div>
        </Container>
      </section>

      {/* Comparaison des Options */}
      <div ref={comparisonRef}>
        <section className="py-16 bg-white">
          <Container>
            <h2 className="text-3xl font-bold text-tekki-blue text-center mb-12">
              Comparaison des options d'acquisition
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Option standard */}
              <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all p-8 border border-gray-100 group">
                <div className="flex items-start mb-6">
                  <div className="w-16 h-16 bg-tekki-blue/10 rounded-full flex items-center justify-center mr-4 group-hover:bg-tekki-blue/20 transition-all">
                    <ShoppingBag className="w-8 h-8 text-tekki-blue" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-tekki-blue mb-1">Acquisition Complète</h3>
                    <p className="text-gray-500">Transfert immédiat et complet</p>
                  </div>
                </div>
                
                <div className="rounded-lg bg-gray-50 p-4 mb-6">
                  <div className="text-2xl font-bold text-tekki-blue">
                    {price.toLocaleString()} FCFA
                  </div>
                  <div className="text-gray-600 text-sm">
                    Paiement en 1 à 3 fois
                  </div>
                </div>
                
                <p className="text-gray-600 mb-6">
                  Pour ceux qui souhaitent un transfert immédiat et complet de la propriété du business, avec tous les éléments livrés en une seule fois.
                </p>
                
                <div className="mb-6">
                  <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    Avantages
                  </h4>
                  <ul className="space-y-2 pl-7">
                    <li className="text-gray-600 list-disc">
                      Propriété complète immédiate du business
                    </li>
                    <li className="text-gray-600 list-disc">
                      Coût total légèrement inférieur
                    </li>
                    <li className="text-gray-600 list-disc">
                      Pas d'engagement sur la durée
                    </li>
                    <li className="text-gray-600 list-disc">
                      Liberté totale pour modifier tous les aspects
                    </li>
                  </ul>
                </div>
                
                <div className="mb-8">
                  <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                    <XCircle className="w-5 h-5 text-red-500 mr-2" />
                    Inconvénients
                  </h4>
                  <ul className="space-y-2 pl-7">
                    <li className="text-gray-600 list-disc">
                      Investissement initial important
                    </li>
                    <li className="text-gray-600 list-disc">
                      Risque financier plus élevé au départ
                    </li>
                  </ul>
                </div>
                
                <Link 
                  href="/business"
                  className="w-full bg-tekki-blue hover:bg-tekki-blue/90 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
                >
                  Voir les business disponibles
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
              
              {/* Option progressive */}
              <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all p-8 border border-gray-100 relative group">
                <div className="absolute -right-3 top-6 rotate-45 bg-tekki-coral text-white px-12 py-1 text-sm font-medium z-10">
                  NOUVEAU
                </div>
                
                <div className="flex items-start mb-6">
                  <div className="w-16 h-16 bg-tekki-coral/10 rounded-full flex items-center justify-center mr-4 group-hover:bg-tekki-coral/20 transition-all">
                    <Rocket className="w-8 h-8 text-tekki-coral" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-tekki-coral mb-1">Acquisition Progressive</h3>
                    <p className="text-gray-500">Transfert progressif en {MONTHS_DURATION} mois</p>
                  </div>
                </div>
                
                <div className="rounded-lg bg-gray-50 p-4 mb-6">
                  <div className="text-xl font-bold text-tekki-coral">
                    À partir de {standardAmounts.initialPayment.toLocaleString()} FCFA
                  </div>
                  <div className="text-gray-600 text-sm">
                    + {standardAmounts.monthlyPayment.toLocaleString()} FCFA/mois pendant {MONTHS_DURATION} mois
                  </div>
                </div>
                
                <p className="text-gray-600 mb-6">
                  Démarrez avec seulement {INITIAL_PERCENTAGE}% du prix total et versez le reste progressivement pendant que vous développez déjà votre activité.
                </p>
                
                <div className="mb-6">
                  <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    Avantages
                  </h4>
                  <ul className="space-y-2 pl-7">
                    <li className="text-gray-600 list-disc">
                      Barrière d'entrée considérablement réduite
                    </li>
                    <li className="text-gray-600 list-disc">
                      Génération de revenus pendant le paiement
                    </li>
                    <li className="text-gray-600 list-disc">
                      Risque financier réduit et étalé dans le temps
                    </li>
                    <li className="text-gray-600 list-disc">
                      Apprentissage progressif de la gestion du business
                    </li>
                  </ul>
                </div>
                
                <div className="mb-8">
                  <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                    <XCircle className="w-5 h-5 text-red-500 mr-2" />
                    Inconvénients
                  </h4>
                  <ul className="space-y-2 pl-7">
                    <li className="text-gray-600 list-disc">
                      Coût total légèrement plus élevé ({Math.round((standardAmounts.difference / price) * 100)}% de plus)
                    </li>
                    <li className="text-gray-600 list-disc">
                      Transfert complet de propriété après le dernier paiement
                    </li>
                  </ul>
                </div>
                
                <Link 
                  href="/business?acquisition=progressive"
                  className="w-full bg-tekki-coral hover:bg-tekki-coral/90 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
                >
                  Découvrir cette option
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </div>
          </Container>
        </section>
      </div>

      {/* Calculateur */}
      <div ref={calculatorRef}>
        <section className="py-16 bg-gray-50">
          <Container>
            <h2 className="text-3xl font-bold text-tekki-blue text-center mb-12">
              Calculateur d'acquisition progressive
            </h2>
            
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 md:p-8">
                  <p className="text-lg text-gray-600 mb-8">
                    Utilisez ce calculateur pour estimer les paiements pour différents types de business ou montants personnalisés.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-xl font-semibold text-tekki-blue mb-6">
                        Paramètres
                      </h3>
                      
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Type de business
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            onClick={() => setSelectedBusiness('ecommerce')}
                            className={`px-4 py-3 rounded-lg text-center transition-colors ${
                              selectedBusiness === 'ecommerce'
                                ? 'bg-tekki-blue text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            <ShoppingBag className="h-5 w-5 mx-auto mb-1" />
                            E-commerce
                          </button>
                          <button
                            onClick={() => setSelectedBusiness('digital')}
                            className={`px-4 py-3 rounded-lg text-center transition-colors ${
                              selectedBusiness === 'digital'
                                ? 'bg-tekki-coral text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            <Rocket className="h-5 w-5 mx-auto mb-1" />
                            Digital
                          </button>
                        </div>
                      </div>
                      
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Prix d'acquisition ({selectedBusiness === 'ecommerce' ? 'E-commerce' : 'Digital'})
                          </label>
                          <div className="grid grid-cols-3 gap-3 mb-3">
                            <button
                              onClick={() => setCustomPrice(businessPrices[selectedBusiness].min.toString())}
                              className="px-3 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors text-sm"
                            >
                              Minimum<br />
                              {businessPrices[selectedBusiness].min.toLocaleString()} FCFA
                            </button>
                            <button
                              onClick={() => setCustomPrice(businessPrices[selectedBusiness].average.toString())}
                              className="px-3 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors text-sm font-medium"
                            >
                              Moyen<br />
                              {businessPrices[selectedBusiness].average.toLocaleString()} FCFA
                            </button>
                            <button
                              onClick={() => setCustomPrice(businessPrices[selectedBusiness].max.toString())}
                              className="px-3 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors text-sm"
                            >
                              Maximum<br />
                              {businessPrices[selectedBusiness].max.toLocaleString()} FCFA
                            </button>
                          </div>
                          
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <DollarSign className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="text"
                              value={customPrice}
                              onChange={(e) => {
                                // Accepter seulement les nombres
                                const value = e.target.value.replace(/[^0-9]/g, '');
                                setCustomPrice(value);
                              }}
                              className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-tekki-blue focus:border-tekki-blue"
                              placeholder="Montant personnalisé"
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                              <span className="text-gray-500">FCFA</span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Structure des paiements</h4>
                          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Paiement initial :</span>
                              <span className="font-medium">{INITIAL_PERCENTAGE}% du prix total</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Paiements mensuels :</span>
                              <span className="font-medium">{MONTHLY_PERCENTAGE}% + {MONTHLY_FEES.toLocaleString()} FCFA</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Durée :</span>
                              <span className="font-medium">{MONTHS_DURATION} mois</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-6 rounded-xl">
                      <h3 className="text-xl font-semibold text-tekki-blue mb-6">
                        Résultats
                      </h3>
                      
                      <div className="mb-6">
                        <div className="text-sm text-gray-500 mb-1">Paiement initial ({INITIAL_PERCENTAGE}%)</div>
                        <div className="text-2xl font-bold text-tekki-coral">
                          {calculatorAmounts.initialPayment.toLocaleString()} FCFA
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <div className="text-sm text-gray-500 mb-1">Paiement mensuel</div>
                        <div className="text-lg font-bold text-tekki-blue">
                          {calculatorAmounts.monthlyPayment.toLocaleString()} FCFA
                        </div>
                        <div className="text-xs text-gray-500">
                          {MONTHLY_PERCENTAGE}% du prix + {MONTHLY_FEES.toLocaleString()} FCFA × {MONTHS_DURATION} mois
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <div className="text-sm text-gray-500 mb-1">Coût total</div>
                        <div className="text-xl font-bold">
                          {calculatorAmounts.totalPayments.toLocaleString()} FCFA
                        </div>
                        <div className="text-xs text-gray-500">
                          Prix original: {customPriceValue.toLocaleString()} FCFA
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <div className="text-sm text-gray-500 mb-1">Différence</div>
                        <div className="text-base font-semibold text-gray-700">
                          +{calculatorAmounts.difference.toLocaleString()} FCFA
                          <span className="text-gray-500 ml-1">
                            (+{Math.round((calculatorAmounts.difference / customPriceValue) * 100)}%)
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-500 italic">
                        Cette légère différence couvre les frais de gestion et de financement.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center mt-8">
                <Link 
                  href="/business?acquisition=progressive"
                  className="bg-tekki-coral hover:bg-tekki-coral/90 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
                >
                  Voir les business disponibles en acquisition progressive
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </div>
          </Container>
        </section>
      </div>

      {/* FAQ */}
      <div ref={faqRef}>
        <section className="py-16 bg-gray-50">
          <Container>
            <h2 className="text-3xl font-bold text-tekki-blue text-center mb-12">
              Questions fréquentes
            </h2>
            
            <div className="max-w-4xl mx-auto">
              {faqs.map((faq, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-xl shadow-sm mb-4 last:mb-0 hover:shadow-md transition-all border border-gray-100 hover:border-tekki-coral/20 overflow-hidden"
                >
                  <details className="group">
                    <summary className="flex justify-between items-center cursor-pointer p-6">
                      <h3 className="text-lg font-semibold text-gray-800 group-open:text-tekki-blue">
                        {faq.question}
                      </h3>
                      <div className="flex-shrink-0 text-gray-400 group-open:text-tekki-coral transition-colors">
                        <HelpCircle className="w-5 h-5 group-open:rotate-180 transition-transform" />
                      </div>
                    </summary>
                    <div className="px-6 pb-6 pt-0 text-gray-600 border-t border-gray-100">
                      {faq.answer}
                    </div>
                  </details>
                </div>
              ))}
            </div>
          </Container>
        </section>
      </div>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-tekki-blue to-tekki-coral text-white">
        <Container className="text-center">
          <h2 className="text-3xl font-bold mb-6">
            Prêt à lancer votre business ?
          </h2>
          <p className="text-xl opacity-90 max-w-3xl mx-auto mb-8">
            Avec notre option d'acquisition progressive, rien ne vous empêche de vous lancer dès maintenant dans l'aventure entrepreneuriale.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/business" 
              className="bg-white text-tekki-blue hover:bg-white/90 px-8 py-4 rounded-lg font-bold text-lg transition-all hover:shadow-lg flex items-center justify-center"
            >
              Découvrir tous nos business
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link 
              href="https://wa.me/221781362728?text=Bonjour ! J'aimerais en savoir plus sur l'acquisition progressive." 
              className="bg-white/10 border border-white/20 text-white hover:bg-white/20 px-8 py-4 rounded-lg font-medium transition-colors flex items-center justify-center"
              target="_blank"
            >
              Prendre rendez-vous
              <ExternalLink className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </Container>
      </section>
    </main>
  );
};

export default AcquisitionOptionsPage;