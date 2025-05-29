// app/services/sites-ecommerce/page.tsx
'use client';

import React, { useState, useRef } from 'react';
import { 
  Calendar, 
  Check, 
  Package, 
  PieChart, 
  Award, 
  ShoppingCart, 
  Star, 
  ArrowRight, 
  Shield, 
  Zap, 
  BarChart, 
  XCircle,
  ExternalLink,
  Clock,
  TrendingUp,
  MessageCircle,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import EnrollmentModal from '@/app/components/ecommerce/EnrollmentModal-old';
import PriceFormatter from '../../components/common/PriceFormatter';
import Container from '@/app/components/ui/Container';

// Données de service mises à jour avec la promo
const serviceData = {
  title: "Site E-commerce Professionnel",
  subtitle: "Site E-commerce Professionnel + Stratégie Meta",
  originalPrice: 695000,
  promoPrice: 465000,
  promoEndDate: "7 juin 2025",
  deliveryTime: "7 jours ouvrés",
  portfolioItems: [
    { name: "Momo Le Bottier", url: "https://momolebottier.com", image: "/images/portfolio/momolebottier.png" },
    { name: "Abarings", url: "https://abarings.com", image: "/images/portfolio/abarings.png" },
    { name: "YoupyBaby", url: "https://youpybaby.com", image: "/images/portfolio/youpybaby.png" },
    { name: "Maika Déco", url: "https://maikadeco.com", image: "/images/portfolio/maikadeco.png" },
    { name: "6C No Filter", url: "https://6cnofilter.com", image: "/images/portfolio/6cnofilter.png" },
    { name: "Viens on s'connaît", url: "https://viensonsconnait.com", image: "/images/portfolio/viensonsconnait.png" }
  ],
  problems: [
    "DM qui s'accumulent sans fin sur toutes les apps",
    "Commandes oubliées ou perdues",
    "Clients qui disparaissent en cours de discussion",
    "Impossible de vendre quand vous n'êtes pas disponible",
    "Difficile de suivre qui a commandé quoi",
    "Pas de visibilité sur vos performances"
  ],
  solutions: [
    "Vendez 24h/24 sans devoir répondre à chaque message",
    "Recevez vos commandes automatiquement organisées",
    "Organisez facilement vos livraisons",
    "Atteignez plus de clients, où qu'ils soient",
    "Gérez tout depuis votre téléphone",
    "Suivez vos ventes et performances en temps réel"
  ],
  features: [
    "Site e-commerce adapté à tous les écrans",
    "Design moderne, intuitif et professionnel",
    "Gestion automatique des commandes",
    "Système de gestion de commandes intégré",
    "Tableau de bord optimisé pour Smartphone",
    "Référencement naturel sur Google",
    "Formation complète à l'utilisation"
  ],
  marketingStrategy: [
    "Analyse de votre audience cible",
    "Création de 2 publicités Facebook/Instagram",
    "Configuration du Pixel Meta sur votre site",
    "Stratégie de ciblage détaillée",
    "Recommandations de budget publicitaire",
    "Suivi des performances pendant 15 jours"
  ],
  successStories: [
    { brand: "Momo Le Bottier", result: "Augmentation des ventes grâce au site e-commerce" },
    { brand: "YoupyBaby", result: "Plus de visites et de ventes grâce au site e-commerce" },
    { brand: "Abarings", result: "Professionnalisation du business et hausse des ventes" }
  ],
  faqs: [
    {
      question: "Comment se déroule la création de mon site e-commerce ?",
      answer: "Après votre commande, nous vous contacterons sous 24h pour discuter de vos besoins spécifiques. Nous vous fournirons un questionnaire pour recueillir toutes les informations nécessaires, puis nous passerons au développement de votre site. Tout le processus est terminé en 7 jours ouvrés."
    },
    {
      question: "Cette offre promotionnelle inclut-elle vraiment la stratégie Meta ?",
      answer: "Oui, absolument ! Même avec le prix promotionnel, vous bénéficiez de la stratégie Facebook & Instagram complète d'une valeur de 150 000 FCFA, incluant la création de publicités, le ciblage, et 15 jours de suivi personnalisé."
    },
    {
      question: "Comment fonctionne le paiement en 2 fois ?",
      answer: "Vous payez 60% du montant promotionnel (279 000 FCFA) lors de votre commande pour démarrer le projet. Les 40% restants (186 000 FCFA) sont à payer à la livraison du site."
    },
    {
      question: "Jusqu'à quand cette promotion est-elle valable ?",
      answer: "Cette offre spéciale est valable jusqu'au 7 juin 2025. Après cette date, le prix remontera à 695 000 FCFA. Nous vous conseillons de réserver votre place rapidement."
    },
    {
      question: "Pourquoi choisir TEKKI Studio plutôt qu'un freelance ou une autre agence ?",
      answer: "Nous sommes nous-mêmes e-commerçants et comprenons parfaitement les défis de la vente en ligne, en particulier en Afrique. Contrairement aux autres prestataires qui créent de simples catalogues en ligne, nous concevons de véritables machines de vente optimisées pour la conversion. De plus, nous utilisons des thèmes professionnels premium et ajoutons des fonctionnalités sur mesure."
    }
  ]
};

export default function EcommerceServicePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const detailsRef = useRef<HTMLElement>(null);
  const proofRef = useRef<HTMLElement>(null);

  // Calculer l'économie
  const savings = serviceData.originalPrice - serviceData.promoPrice;
  const savingsPercent = Math.round((savings / serviceData.originalPrice) * 100);

  // Fonction pour le défilement fluide
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, ref: React.RefObject<HTMLElement>) => {
    e.preventDefault();
    
    if (ref.current) {
      window.scrollTo({
        top: ref.current.offsetTop - 100,
        behavior: 'smooth'
      });
    }
  };

  return (
    <main className="pb-0">
      {/* Hero Section avec urgence de la promo */}
      <section className="relative pt-28 pb-20 bg-gradient-to-r from-tekki-blue to-tekki-coral overflow-hidden">
        {/* Badge de promotion - Desktop uniquement */}
        <div className="hidden md:block absolute top-20 right-4 lg:right-10 rotate-12 z-20">
          <div className="bg-yellow-400 text-tekki-blue font-bold px-4 py-2 lg:px-6 lg:py-3 rounded-full shadow-lg text-sm lg:text-base animate-pulse">
            🎁 PROMO jusqu'au 7 juin !
          </div>
        </div>

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
            {/* Badge d'introduction */}
            <div className="inline-block mb-6 bg-white/10 backdrop-blur-sm px-6 py-2 rounded-full">
              <span className="text-white font-medium">
                Vous vendez sur WhatsApp, Instagram ou TikTok ? 📱
              </span>
            </div>
            
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Arrêtez de perdre des ventes à cause des <span className="text-yellow-300">DM ingérables</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
              Transformez votre business avec un <strong>site e-commerce professionnel</strong> qui vend 24h/24, 
              même quand vous dormez 🌙
            </p>

            {/* Compteur d'urgence */}
            <div className="bg-red-500 text-white px-6 py-3 rounded-lg inline-block mb-8 animate-pulse">
              <div className="flex items-center justify-center gap-2 text-lg font-bold">
                <Clock className="w-5 h-5" />
                Offre limitée jusqu'au 7 juin 2025
              </div>
            </div>
            
            {/* Prix en promotion */}
            <div className="bg-white/15 backdrop-blur-sm p-6 rounded-2xl inline-block mb-8">
              <div className="text-center">
                <div className="text-white/80 mb-2">Prix normal</div>
                <div className="text-white line-through text-2xl mb-2">
                  <PriceFormatter amount={serviceData.originalPrice} />
                </div>
                <div className="text-yellow-300 font-bold text-4xl md:text-5xl mb-2">
                  <PriceFormatter amount={serviceData.promoPrice} />
                </div>
                <div className="bg-red-500 text-white px-4 py-1 rounded-full text-sm font-bold inline-block">
                  Économisez ({<PriceFormatter amount={savings} />})
                </div>
                <div className="text-white/80 mt-3 text-sm">
                  Paiement facilité : <strong>279 000F</strong> à la commande + <strong>186 000F</strong> à la livraison
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-yellow-400 hover:bg-yellow-300 text-tekki-blue px-8 py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105 shadow-lg flex items-center justify-center animate-bounce"
              >
                🚀 Je profite de l'offre
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              
              <a
                href="#proof"
                onClick={(e) => scrollToSection(e, proofRef)}
                className="text-white border-2 border-white/30 hover:border-white/60 px-8 py-4 rounded-lg font-semibold transition-all flex items-center justify-center"
              >
                Voir los résultats clients
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </div>
          </div>
        </Container>
      </section>

      {/* Section des problèmes - Accroche émotionnelle */}
      <section className="py-16 bg-gray-50">
        <Container>
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-tekki-blue mb-6">
              Ça vous dit quelque chose ? 🤔
            </h2>
            <p className="text-xl text-gray-600">
              Ces situations frustrantes que vivent tous les entrepreneurs qui vendent sur les réseaux sociaux...
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {serviceData.problems.map((problem, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-red-400 hover:shadow-lg transition-all">
                <div className="flex items-start">
                  <AlertCircle className="w-6 h-6 text-red-500 mr-3 mt-1 flex-shrink-0" />
                  <p className="text-gray-700 font-medium">{problem}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <div className="bg-tekki-blue text-white p-6 rounded-xl max-w-3xl mx-auto">
              <h3 className="text-2xl font-bold mb-4">
                Et si nous vous disions qu'il existe une solution ? ✨
              </h3>
              <p className="text-lg opacity-90">
                Des dizaines de marques africaines ont déjà résolu ces problèmes avec un site e-commerce professionnel. 
                Certaines ont même <strong>triplé leurs ventes</strong> en quelques mois ! 🚀
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Solutions - Transformation */}
      <section className="py-16 bg-white">
        <Container>
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-tekki-blue mb-6">
              Voici ce qui change avec un site e-commerce professionnel 🎯
            </h2>
            <p className="text-xl text-gray-600">
              Transformez votre façon de vendre et libérez-vous des contraintes des réseaux sociaux
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {serviceData.solutions.map((solution, index) => (
              <div key={index} className="bg-green-50 p-6 rounded-xl shadow-sm border-l-4 border-green-400 hover:shadow-lg transition-all group">
                <div className="flex items-start">
                  <Check className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <p className="text-gray-700 font-medium">{solution}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-tekki-coral hover:bg-tekki-coral/90 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 shadow-lg inline-flex items-center"
            >
              🎁 Je veux mon site
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </Container>
      </section>

      {/* Preuve sociale - Résultats clients */}
      <section ref={proofRef} id="proof" className="py-16 bg-gradient-to-r from-green-50 to-blue-50">
        <Container>
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-tekki-blue mb-6">
              Des résultats qui parlent d'eux-mêmes 📈
            </h2>
            <p className="text-xl text-gray-600">
              Voici ce que nos clients ont accompli avec leur nouveau site e-commerce
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
            {serviceData.successStories.map((story, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg text-center border-t-4 border-green-500">
                <div className="text-3xl mb-4">🚀</div>
                <h3 className="font-bold text-lg text-tekki-blue mb-2">{story.brand}</h3>
                <p className="text-green-600 font-semibold">{story.result}</p>
              </div>
            ))}
          </div>

          {/* Portfolio visuel */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto mb-8">
            {serviceData.portfolioItems.slice(0, 6).map((item, index) => (
              <div key={index} className="group relative overflow-hidden rounded-xl shadow-sm hover:shadow-lg transition-all h-40">
                <div className="absolute inset-0 bg-gray-200">
                  {item.image ? (
                    <Image 
                      src={item.image} 
                      alt={item.name}
                      fill
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = '/images/placeholder-site.jpg';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                      <span className="text-gray-500 text-sm">Image non disponible</span>
                    </div>
                  )}
                </div>
                
                <div className="absolute inset-0 bg-tekki-blue/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center p-4">
                  <h3 className="text-white font-bold text-center mb-2">{item.name}</h3>
                  <a 
                    href={item.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-white text-sm flex items-center hover:text-yellow-300 transition-colors"
                  >
                    Visiter le site
                    <ExternalLink className="ml-1 w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <p className="text-lg text-gray-600 mb-6">
              <strong>Si nous avons réussi à vous atteindre avec la publicité qui vous a conduit ici, 
              imaginez ce qu'on peut faire pour votre business ! 🎯</strong>
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-tekki-blue hover:bg-tekki-blue/90 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 shadow-lg inline-flex items-center"
            >
              💰 Je profite du prix promo maintenant
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </Container>
      </section>

      {/* Ce qui est inclus - Version promo */}
      <section ref={detailsRef} id="details" className="py-16 bg-white">
        <Container>
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-tekki-blue mb-6">
              Tout ce que vous obtenez avec l'offre promo 🎁
            </h2>
            <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4 inline-block">
              <p className="text-yellow-800 font-semibold">
                ⚡ Valeur totale normale : <PriceFormatter amount={serviceData.originalPrice + 150000} /> • 
                Votre prix promo : <PriceFormatter amount={serviceData.promoPrice} />
              </p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Site e-commerce */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-8 border-2 border-blue-200 relative">
              <div className="absolute -top-3 left-6 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                Valeur : <PriceFormatter amount={serviceData.originalPrice} />
              </div>
              <div className="w-16 h-16 bg-tekki-blue/10 rounded-full flex items-center justify-center mb-6">
                <ShoppingCart className="w-8 h-8 text-tekki-blue" />
              </div>
              <h3 className="text-2xl font-bold text-tekki-blue mb-4">
                Site E-commerce Professionnel
              </h3>
              <p className="text-gray-600 mb-6">
                Un site moderne, rapide et optimisé pour convertir vos visiteurs en clients. 
                Livré clé en main en 7 jours ouvrés.
              </p>
              
              <ul className="space-y-3">
                {serviceData.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Stratégie Meta OFFERTE */}
            <div className="bg-gradient-to-br from-orange-50 to-red-100 rounded-xl p-8 border-2 border-orange-200 relative">
              <div className="absolute -top-3 left-6 bg-red-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                🎁 OFFERTE (Valeur : 150 000F)
              </div>
              <div className="w-16 h-16 bg-tekki-coral/10 rounded-full flex items-center justify-center mb-6">
                <TrendingUp className="w-8 h-8 text-tekki-coral" />
              </div>
              <h3 className="text-2xl font-bold text-tekki-blue mb-4">
                Stratégie d'Acquisition Client Meta
              </h3>
              <p className="text-gray-600 mb-6">
                Une stratégie complète pour attirer des clients qualifiés via Facebook et Instagram. 
                Normalement facturée 150 000F, elle est incluse gratuitement !
              </p>
              
              <ul className="space-y-3">
                {serviceData.marketingStrategy.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* CTA avec urgence */}
          <div className="text-center mt-12">
            <div className="bg-gradient-to-r from-tekki-coral to-red-500 text-white p-8 rounded-xl max-w-3xl mx-auto mb-8">
              <h3 className="text-2xl font-bold mb-4">
                ⏰ Cette offre se termine le 7 juin 2025
              </h3>
              <p className="text-lg opacity-90 mb-6">
                Après cette date, le prix remontera à <PriceFormatter amount={serviceData.originalPrice} /> et la stratégie Meta sera facturée en plus. Ne manquez pas cette opportunité !
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-yellow-400 hover:bg-yellow-300 text-tekki-blue px-8 py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105 shadow-lg inline-flex items-center"
                >
                  🚀 Je réserve ma place
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
                <div className="text-white/90 text-sm">
                  Paiement par Wave ou en cash dans nos locaux
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Témoignages clients */}
      <section className="py-16 bg-gray-50">
        <Container>
          <h2 className="text-3xl font-bold text-tekki-blue text-center mb-12">
            Ce que disent nos clients 💬
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4 italic">
                "Avant, nous passions nos journées à répondre à chaque message, même ceux des gens qui ne voulaient pas acheter. 
                Maintenant, notre site travaille pour nous 24h/24, 7j/7. 
                J'ai triplé mes ventes et je peux enfin me concentrer sur le développement de mes produits !"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-tekki-blue rounded-full flex items-center justify-center text-white font-bold">
                  MD
                </div>
                <div>
                  <div className="font-medium">Mme Diouf</div>
                  <div className="text-sm text-gray-500">Momo Le Bottier • Nouveau canal de ventes</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4 italic">
                "Notre ancien site convertissait très peu de visiteurs en clients. Grâce à la refonte du site réalisée par TEKKI Studio, 
                nous avons un site rapide, optimisé pour la conversion, qui se charge de vendre nos produits pendant que nous nous occupons
                des achats dans nos boutiques physiques à Dakar."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-tekki-blue rounded-full flex items-center justify-center text-white font-bold">
                  FN
                </div>
                <div>
                  <div className="font-medium">Mme Ndiaye</div>
                  <div className="text-sm text-gray-500">YoupyBaby • Hausse des ventes en ligne</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all md:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4 italic">
                "Ça fait du bien de savoir que nous n'aurons plus de commandes perdues dans WhatsApp ! Tout est automatisé et organisé. 
                Mes clients peuvent commander à toute heure, même quand je dors. C'est magique !"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-tekki-blue rounded-full flex items-center justify-center text-white font-bold">
                  FD
                </div>
                <div>
                  <div className="font-medium">Fatou Diedhiou</div>
                  <div className="text-sm text-gray-500">Abarings • Vente à l'international simplifiée</div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* FAQ avec focus promo */}
      <section className="py-16 bg-white">
        <Container>
          <h2 className="text-3xl font-bold text-tekki-blue text-center mb-12">
            Questions fréquentes 🤔
          </h2>
          
          <div className="max-w-3xl mx-auto space-y-6">
            {serviceData.faqs.map((faq, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-all border border-gray-100 hover:border-tekki-coral/20">
                <h3 className="text-xl font-bold text-tekki-blue mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-600">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-2xl mx-auto">
              <h3 className="font-bold text-tekki-blue mb-2">Encore des questions ?</h3>
              <p className="text-gray-600 mb-4">
                Notre équipe est là pour vous aider. Contactez-nous et obtenez une réponse sous 2h !
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-tekki-coral hover:bg-tekki-coral/90 text-white px-6 py-3 rounded-lg font-semibold transition-all"
              >
                Poser ma question et réserver
              </button>
            </div>
          </div>
        </Container>
      </section>

      {/* Garanties et confiance */}
      <section className="py-16 bg-gradient-to-r from-green-50 to-blue-50">
        <Container>
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-tekki-blue mb-6">
              Pourquoi nous faire confiance ? 🛡️
            </h2>
            <p className="text-xl text-gray-600">
              Votre tranquillité d'esprit est notre priorité
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-sm text-center hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-bold text-lg text-tekki-blue mb-2">
                Livraison garantie en 7 jours
              </h3>
              <p className="text-gray-600 text-sm">
                Votre site est livré dans les délais promis, ou nous vous remboursons intégralement.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm text-center hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-bold text-lg text-tekki-blue mb-2">
                Paiement sécurisé en 2 fois
              </h3>
              <p className="text-gray-600 text-sm">
                Vous ne payez le solde qu'à la livraison, après validation de votre site. Zéro risque !
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm text-center hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="font-bold text-lg text-tekki-blue mb-2">
                Support inclus 30 jours
              </h3>
              <p className="text-gray-600 text-sm">
                Formation complète + support technique pendant 1 mois après la livraison.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Final avec urgence maximale */}
      <section className="py-16 bg-gradient-to-r from-tekki-blue via-tekki-coral to-red-600 text-white relative overflow-hidden">
        {/* Animation de fond */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 25% 25%, white 2px, transparent 2px)',
            backgroundSize: '50px 50px',
            animation: 'float 6s ease-in-out infinite'
          }}></div>
        </div>

        <Container className="text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            ⏰ Plus que quelques jours pour profiter de l'offre !
          </h2>
          <p className="text-xl md:text-2xl opacity-90 max-w-4xl mx-auto mb-8 leading-relaxed">
            Ne laissez plus vos concurrents prendre vos clients. 
            <strong> Rejoignez les dizaines de marques africaines qui ont transformé leur business </strong>
            avec un site e-commerce professionnel.
          </p>
          
          {/* Récap de l'offre */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto mb-8">
            <h3 className="text-2xl font-bold mb-4">🎁 Récapitulatif de votre offre :</h3>
            <div className="space-y-3 text-lg">
              <div className="flex justify-between items-center">
                <span>Site e-commerce professionnel</span>
                <span className="line-through opacity-70"><PriceFormatter amount={serviceData.originalPrice} /></span>
              </div>
              <div className="flex justify-between items-center">
                <span>Stratégie Meta complète</span>
                <span className="line-through opacity-70">150 000F</span>
              </div>
              <div className="border-t border-white/20 pt-3 flex justify-between items-center font-bold text-2xl">
                <span>Votre prix aujourd'hui :</span>
                <span className="text-yellow-300"><PriceFormatter amount={serviceData.promoPrice} /></span>
              </div>
              <div className="text-yellow-200 text-sm">
                Soit <strong>{savingsPercent}% d'économie</strong> + stratégie Meta offerte !
              </div>
            </div>
          </div>

          {/* Modalités de paiement */}
          <div className="mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 inline-block">
              <div className="text-white/90 max-w-xl mx-auto">
                💳 <strong>Paiement simplifié :</strong><br/>
                279 000F à la commande + 186 000F à la livraison<br/>
                <span className="text-sm opacity-80">Paiement sécurisé via Wave • Pas de frais cachés</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col lg:flex-row items-center justify-center gap-6">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-yellow-400 hover:bg-yellow-300 text-tekki-blue px-12 py-5 rounded-lg font-bold text-xl transition-all transform hover:scale-105 shadow-2xl inline-flex items-center animate-pulse"
            >
              🚀 Je réserve ma place maintenant
              <ArrowRight className="ml-3 h-6 w-6" />
            </button>
            
            <div className="text-center lg:text-left">
              <div className="text-white/90 font-semibold">⚡ Réponse sous 24h garantie</div>
              <div className="text-white/80 text-sm">Votre site livré en 7 jours ouvrés</div>
            </div>
          </div>

          {/* Compteur d'urgence final */}
          <div className="mt-12">
            <div className="bg-red-500 text-white px-8 py-4 rounded-lg inline-block animate-bounce">
              <div className="flex items-center justify-center gap-2 text-lg font-bold">
                <Clock className="w-6 h-6" />
                Offre valable jusqu'au 7 juin 2025 - Ne manquez pas cette opportunité !
              </div>
            </div>
          </div>

          {/* Social proof final */}
          <div className="mt-8 text-white/80 text-sm">
            ✅ Déjà <strong>50+ marques</strong> nous ont fait confiance • ⭐ <strong>4.9/5</strong> de satisfaction client
          </div>
        </Container>
      </section>

      {/* Modal d'inscription */}
      <EnrollmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        serviceData={{
          title: serviceData.title,
          subtitle: serviceData.subtitle,
          price: {
            shopify: serviceData.promoPrice, // Prix promo pour Shopify
            wordpress: Math.round(serviceData.promoPrice * 0.85) // Prix promo pour WordPress (légèrement moins cher)
          },
          deliveryTime: serviceData.deliveryTime,
          portfolioItems: serviceData.portfolioItems,
          features: serviceData.features,
          marketingStrategy: serviceData.marketingStrategy
        }}
      />

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(180deg); }
        }
      `}</style>
    </main>
  );
}