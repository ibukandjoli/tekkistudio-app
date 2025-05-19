// app/services/sites-ecommerce/page.tsx (première partie)
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
  ExternalLink 
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import EnrollmentModal from '@/app/components/ecommerce/EnrollmentModal';
import PriceFormatter from '../../components/common/PriceFormatter';
import Container from '@/app/components/ui/Container';

// Données de service
const serviceData = {
  title: "Site E-commerce Professionnel",
  subtitle: "Site E-commerce Professionnel + Stratégie Meta",
  price: 695000,
  deliveryTime: "7 jours ouvrés",
  portfolioItems: [
    { name: "Momo Le Bottier", url: "https://momolebottier.com", image: "/images/portfolio/momolebottier.png" },
    { name: "Abarings", url: "https://abarings.com", image: "/images/portfolio/abarings.png" },
    { name: "YoupyBaby", url: "https://youpybaby.com", image: "/images/portfolio/youpybaby.png" },
    { name: "Maika Déco", url: "https://maikadeco.com", image: "/images/portfolio/maikadeco.png" },
    { name: "6C No Filter", url: "https://6cnofilter.com", image: "/images/portfolio/6cnofilter.png" },
    { name: "Viens on s'connaît", url: "https://viensonsconnait.com", image: "/images/portfolio/viensonsconnait.png" }
  ],
  features: [
    "Site e-commerce adapté à tous les écrans",
    "Design moderne, intuitif et professionnel",
    "Intégration de formulaire de commande",
    "Gestion de stock et de commandes",
    "Tableau de bord simplifié pour tout gérer",
    "Référencement naturel sur Google",
    "Formation à l'utilisation du site"
  ],
  marketingStrategy: [
    "Analyse de votre audience cible",
    "Création de 2 publicités Facebook/Instagram",
    "Configuration du Pixel Meta sur votre site",
    "Stratégie de ciblage détaillée",
    "Recommandations de budget publicitaire",
    "Suivi des performances pendant 15 jours"
  ],
  shopifyAdvantages: [
    "Solution tout-en-un plus stable et sécurisée",
    "Interface d'administration très intuitive, idéale pour débutants",
    "Gestion totale depuis votre Smartphone",
    "Accès aux statistiques de votre business",
    "Site rapide et optimisé pour la conversion",
    "Support technique 24/7 par l'équipe Shopify"
  ],
  woocommerceAdvantages: [
    "Solution économique et flexible",
    "Personnalisation illimitée (il faut savoir coder)",
    "Contrôle total sur votre site",
    "Intégration de modes de paiement locaux",
    "Pas d'abonnement mensuel obligatoire"
  ],
  shopifyDisadvantages: [
    "Abonnement mensuel de 21 000F CFA/32€",
    "Thème Professionnel assez coûteux"
  ],
  woocommerceDisadvantages: [
    "Maintenance technique régulière requise",
    "Interface beaucoup moins intuitive",
    "Nécessite un ordinateur pour la gestion",
    "Performance variable selon l'hébergement"
  ],
  faqs: [
    {
      question: "Comment se déroule la création de mon site e-commerce ?",
      answer: "Après votre commande, nous vous contacterons sous 24h pour discuter de vos besoins spécifiques. Nous vous fournirons un questionnaire pour recueillir toutes les informations nécessaires, puis nous passerons au développement de votre site. Tout le processus est terminé en 7 jours ouvrés."
    },
    {
      question: "Puis-je personnaliser le design de mon site ?",
      answer: "Absolument ! Nous travaillons avec vous pour créer un design qui correspond à votre marque ou business et à votre vision. Vous aurez l'opportunité de donner votre avis sur le travail réalisé avant la livraison de votre site."
    },
    {
      question: "Comment fonctionne le paiement ?",
      answer: "Vous payez 60% du montant (417 000 FCFA) lors de votre commande pour démarrer le projet. Les 40% restants (278 000 FCFA) sont à payer à la livraison du site, après votre validation."
    },
    {
      question: "Que se passe-t-il après la livraison du site ?",
      answer: "Nous vous formons à l'utilisation de votre nouveau site e-commerce et vous accompagnons dans la mise en place de votre stratégie marketing sur Meta (Facebook & Instagram). Nous restons disponibles pendant 30 jours après la livraison pour répondre à vos questions et effectuer des ajustements mineurs si nécessaire."
    },
    {
      question: "Pourquoi choisir TEKKI Studio plutôt qu'un autre prestataire ?",
      answer: "Contrairement à beaucoup de prestataires qui créent simplement des catalogues en ligne, nous concevons de véritables machines de vente optimisées pour la conversion. Nous sommes nous-mêmes e-commerçants et comprenons parfaitement les défis et les solutions pour réussir dans la vente en ligne. De plus, nous utilisons des thèmes professionnels et ajoutons des fonctionnalités sur mesure selon vos besoins, ce que ne font pas les autres prestataires, ce qui explique leurs coûts réduits et leur incapacité à proposer des sites qui attirent vos cibles, inspirent confiance, et génèrent réellement des ventes."
    }
  ]
};

export default function EcommerceServicePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const detailsRef = useRef<HTMLElement>(null);
  const comparisonRef = useRef<HTMLElement>(null);

  // Fonction pour le défilement fluide
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, ref: React.RefObject<HTMLElement>) => {
    e.preventDefault();
    
    if (ref.current) {
      window.scrollTo({
        top: ref.current.offsetTop - 100, // Ajustement pour le header
        behavior: 'smooth'
      });
    }
  };

  return (
    <main className="pb-0">
      {/* Hero Section avec background gradient */}
      <section className="relative pt-28 pb-20 bg-gradient-to-r from-tekki-blue to-tekki-blue overflow-hidden">
        {/* Motif géométrique en arrière-plan */}
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-12 h-full">
            {[...Array(48)].map((_, i) => (
              <div key={i} className="border border-white/20" />
            ))}
          </div>
        </div>
        
        {/* Badge */}
        <div className="absolute top-20 right-10 rotate-12 hidden lg:block">
          <div className="bg-tekki-coral text-white font-bold px-6 py-3 rounded-full transform shadow-lg">
            Votre site E-commerce en 7 jours
          </div>
        </div>

        <Container className="relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-6 bg-white/10 backdrop-blur-sm px-6 py-2 rounded-full">
              <span className="text-white font-medium">
                <span className="text-tekki-coral">TEKKI STUDIO</span> • Experts en E-commerce
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Des sites e-commerce <span className="text-tekki-coral">qui convertissent</span> vraiment
            </h1>
            
            <p className="text-xl text-white/90 mb-8">
              Nous ne créons pas de simples catalogues en ligne, mais de véritables machines de vente
              pour les marques et commerçants qui veulent réussir dans la vente sur Internet.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-tekki-coral hover:bg-tekki-coral/90 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 shadow-lg flex items-center justify-center"
              >
                Je veux un site e-commerce
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              
              <a
                href="#details"
                onClick={(e) => scrollToSection(e, detailsRef)}
                className="text-white border-2 border-white/30 hover:border-white/60 px-8 py-4 rounded-lg font-semibold transition-all flex items-center justify-center"
              >
                En savoir plus
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </div>
            
            {/* Prix et modalités de paiement */}
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl inline-block">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-10">
                <div className="text-center">
                  <div className="text-white font-bold text-3xl sm:text-4xl">
                    <PriceFormatter amount={serviceData.price} />
                  </div>
                  <span className="text-white/80">
                    Site e-commerce + Stratégie Meta
                  </span>
                </div>
                
                <div className="h-12 w-px bg-white/20 hidden sm:block"></div>
                
                <div className="text-center">
                  <div className="text-white/80 mb-1">Paiement facilité</div>
                  <div className="text-white font-bold text-xl">60% à la commande</div>
                  <div className="text-white font-bold text-xl">40% à la livraison</div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Notre différence */}
      <section className="py-10 bg-gray-50">
        <Container className="mt-20">
          <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-8 -mt-28 border border-gray-100">
            <h3 className="text-2xl font-bold text-tekki-blue mb-6 text-center">
              Ce qui nous différencie
            </h3>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center text-center p-4 group">
                <div className="w-16 h-16 bg-tekki-blue/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-tekki-blue/20 transition-all">
                  <ShoppingCart className="w-8 h-8 text-tekki-blue" />
                </div>
                <h4 className="font-bold text-gray-800 mb-2">E-commerçants nous-mêmes</h4>
                <p className="text-gray-600 text-sm">Nous comprenons les défis de la vente en ligne car nous la pratiquons pour nos propres marques.</p>
              </div>
              
              <div className="flex flex-col items-center text-center p-4 group">
                <div className="w-16 h-16 bg-tekki-blue/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-tekki-blue/20 transition-all">
                  <BarChart className="w-8 h-8 text-tekki-blue" />
                </div>
                <h4 className="font-bold text-gray-800 mb-2">Obsédés par la conversion</h4>
                <p className="text-gray-600 text-sm">Nous optimisons chaque élément de votre site pour maximiser les taux de conversion et vos ventes.</p>
              </div>
              
              <div className="flex flex-col items-center text-center p-4 group">
                <div className="w-16 h-16 bg-tekki-blue/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-tekki-blue/20 transition-all">
                  <Zap className="w-8 h-8 text-tekki-blue" />
                </div>
                <h4 className="font-bold text-gray-800 mb-2">Thèmes professionnels</h4>
                <p className="text-gray-600 text-sm">Nous n'utilisons pas de thèmes gratuits génériques, mais des solutions premium hautement personnalisables.</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Ce qui est inclus - 2 colonnes */}
      <section ref={detailsRef} id="details" className="py-16 bg-white">
        <Container>
          <h2 className="text-3xl font-bold text-tekki-blue text-center mb-12">
            Une solution complète pour vendre efficacement sur Internet
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div className="bg-gray-50 rounded-xl p-8 border border-gray-100 hover:shadow-lg transition-all group">
              <div className="w-16 h-16 bg-tekki-blue/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-tekki-blue/20 transition-all">
                <ShoppingCart className="w-8 h-8 text-tekki-blue" />
              </div>
              <h3 className="text-2xl font-bold text-tekki-blue mb-4">
                Site E-commerce Professionnel
              </h3>
              <p className="text-gray-600 mb-6">
                Un site e-commerce moderne, intuitif et optimisé pour convertir vos visiteurs en clients. Livré clé en main en seulement 7 jours ouvrés.
              </p>
              
              <ul className="space-y-3">
                {serviceData.features.map((feature, index) => (
                  <li key={index} className="flex items-start group">
                    <Check className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-8 border border-gray-100 hover:shadow-lg transition-all group">
              <div className="w-16 h-16 bg-tekki-coral/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-tekki-coral/20 transition-all">
                <PieChart className="w-8 h-8 text-tekki-coral" />
              </div>
              <h3 className="text-2xl font-bold text-tekki-blue mb-4">
                Stratégie d'Acquisition Client Meta
              </h3>
              <p className="text-gray-600 mb-6">
                Une stratégie complète pour attirer des clients qualifiés sur votre site grâce à des campagnes publicitaires optimisées sur Facebook et Instagram.
              </p>
              
              <ul className="space-y-3">
                {serviceData.marketingStrategy.map((feature, index) => (
                  <li key={index} className="flex items-start group">
                    <Check className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-tekki-coral hover:bg-tekki-coral/90 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 shadow-lg inline-flex items-center"
            >
              Lancer mon projet
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </Container>
      </section>

      {/* Comparaison Shopify vs WooCommerce */}
      <section ref={comparisonRef} id="comparison" className="py-16 bg-gray-50">
        <Container>
          <h2 className="text-3xl font-bold text-tekki-blue text-center mb-4">
            Shopify vs WordPress/WooCommerce
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            Nous travaillons principalement avec Shopify, mais pouvons également développer sur WordPress/WooCommerce selon vos besoins. Voici une comparaison pour vous aider à choisir.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all border-t-4 border-[#96bf48]">
              <div className="flex items-center gap-3 mb-6">
                <h3 className="text-2xl font-bold text-tekki-blue">Shopify</h3>
                <span className="ml-2 px-3 py-1 bg-[#96bf48]/10 text-[#96bf48] text-sm rounded-full font-medium">
                  Recommandé
                </span>
              </div>
              
              <div className="text-xl font-bold mb-6 text-tekki-blue">
                <PriceFormatter amount={695000} />
                <span className="text-sm text-gray-500 font-normal ml-2">+ abonnement Shopify (<PriceFormatter amount={21000} /> /mois)</span>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-2" />
                    Avantages
                  </h4>
                  <ul className="space-y-2 pl-7">
                    {serviceData.shopifyAdvantages.map((advantage, index) => (
                      <li key={index} className="text-gray-600 list-disc">
                        {advantage}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                    <XCircle className="w-5 h-5 text-red-500 mr-2" />
                    Inconvénients
                  </h4>
                  <ul className="space-y-2 pl-7">
                    {serviceData.shopifyDisadvantages.map((disadvantage, index) => (
                      <li key={index} className="text-gray-600 list-disc">
                        {disadvantage}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="mt-8">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full bg-[#96bf48] hover:bg-[#85a93e] text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
                >
                  Choisir Shopify
                  <ArrowRight className="ml-2 w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all border-t-4 border-[#21759b]">
              <div className="flex items-center mb-6">
                <h3 className="text-2xl font-bold text-tekki-blue">WordPress / WooCommerce</h3>
              </div>
              
              <div className="text-xl font-bold mb-6 text-tekki-blue">
              <PriceFormatter amount={495000} />
                <span className="text-sm text-gray-500 font-normal ml-2">+ hébergement (environ <PriceFormatter amount={94000} />/an)</span>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-2" />
                    Avantages
                  </h4>
                  <ul className="space-y-2 pl-7">
                    {serviceData.woocommerceAdvantages.map((advantage, index) => (
                      <li key={index} className="text-gray-600 list-disc">
                        {advantage}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                    <XCircle className="w-5 h-5 text-red-500 mr-2" />
                    Inconvénients
                  </h4>
                  <ul className="space-y-2 pl-7">
                    {serviceData.woocommerceDisadvantages.map((disadvantage, index) => (
                      <li key={index} className="text-gray-600 list-disc">
                        {disadvantage}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="mt-8">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full bg-[#21759b] hover:bg-[#1d6789] text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
                >
                  Choisir WordPress/WooCommerce
                  <ArrowRight className="ml-2 w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Pourquoi notre service est essentiel */}
      <section className="py-16 bg-white">
        <Container>
          <h2 className="text-3xl font-bold text-tekki-blue text-center mb-4">
            Pourquoi choisir un site e-commerce professionnel
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            Un compte Instagram, Facebook ou WhatsApp n'est pas une boutique en ligne. Si vous souhaitez réellement augmenter vos ventes, il vous faut un site e-commerce. Voici pourquoi :
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-gray-50 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all border-t-4 border-tekki-blue group">
              <div className="w-12 h-12 bg-tekki-blue/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-tekki-blue/20 transition-all">
                <Calendar className="w-6 h-6 text-tekki-blue" />
              </div>
              <h3 className="text-xl font-bold text-tekki-blue mb-2">
                Ventes automatisées 24/7
              </h3>
              <p className="text-gray-600">
                Contrairement aux DM sur Instagram qui nécessitent votre présence constante, votre boutique en ligne vend même lorsque vous êtes en train de dormir.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all border-t-4 border-tekki-blue group">
              <div className="w-12 h-12 bg-tekki-blue/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-tekki-blue/20 transition-all">
                <Shield className="w-6 h-6 text-tekki-blue" />
              </div>
              <h3 className="text-xl font-bold text-tekki-blue mb-2">
                Indépendance numérique
              </h3>
              <p className="text-gray-600">
                Vous n'êtes plus à la merci des mises à jour des algorithmes de Meta ou des pannes des réseaux sociaux. Votre site vous appartient entièrement.
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all border-t-4 border-tekki-blue group">
              <div className="w-12 h-12 bg-tekki-blue/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-tekki-blue/20 transition-all">
                <Award className="w-6 h-6 text-tekki-blue" />
              </div>
              <h3 className="text-xl font-bold text-tekki-blue mb-2">
                Professionnalisme et crédibilité
              </h3>
              <p className="text-gray-600">
                Un site e-commerce bien conçu inspire confiance et crédibilité, ce qui augmente significativement vos chances de conversion.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Nos réalisations - Portefeuille */}
      <section className="py-16 bg-gray-50">
        <Container>
          <h2 className="text-3xl font-bold text-tekki-blue text-center mb-4">
            Des sites que nous avons déjà réalisés
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            Découvrez quelques-unes de nos réalisations pour des entrepreneurs comme vous
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {serviceData.portfolioItems.map((item, index) => (
              <div key={index} className="group relative overflow-hidden rounded-xl shadow-sm hover:shadow-lg transition-all h-60">
                <div className="absolute inset-0 bg-gray-100">
                  {/* Fallback pour l'image en cas d'erreur */}
                  <div className="w-full h-full bg-gray-200 relative">
                    {item.image ? (
                      <Image 
                        src={item.image} 
                        alt={item.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          // Fallback si l'image ne charge pas
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = '/images/placeholder-site.jpg';
                        }}
                      />
                    ) : (
                      // Placeholder si pas d'image
                      <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                        <span className="text-gray-500">Image non disponible</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="absolute inset-0 bg-tekki-blue/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <h3 className="text-white font-bold text-xl mb-2">{item.name}</h3>
                  <a 
                    href={item.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-white text-sm flex items-center hover:text-tekki-coral transition-colors"
                  >
                    Visiter le site
                    <ExternalLink className="ml-1 w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-tekki-coral hover:bg-tekki-coral/90 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:shadow-lg inline-flex items-center"
            >
              Je veux mon site e-commerce
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </Container>
      </section>

      {/* Témoignages */}
      <section className="py-16 bg-white">
        <Container>
          <h2 className="text-3xl font-bold text-tekki-blue text-center mb-12">
            Ce que nos clients disent de nous
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-lg transition-all">
              <div className="flex items-center gap-1 mb-4">
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
              </div>
              <p className="text-gray-600 mb-4">
                "TEKKI Studio a transformé notre marque avec un site e-commerce professionnel qui dépasse toutes nos attentes. Nous pouvons désormais vendre en boutique et sur Internet, surtout aux clients qui ne sont pas à Dakar."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-tekki-blue rounded-full flex items-center justify-center text-white font-bold">
                  MD
                </div>
                <div>
                  <div className="font-medium">Mme Diouf</div>
                  <div className="text-sm text-gray-500">Momo Le Bottier</div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-lg transition-all">
              <div className="flex items-center gap-1 mb-4">
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
              </div>
              <p className="text-gray-600 mb-4">
                "L'équipe de TEKKI Studio est extrêmement professionnelle et disponible. Je les ai sollicités pour la refonte de mon site, et ils ont fait un travail magnifique qui a été livré dans les délais promis."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-tekki-blue rounded-full flex items-center justify-center text-white font-bold">
                  FD
                </div>
                <div>
                  <div className="font-medium">Mme Ndiaye</div>
                  <div className="text-sm text-gray-500">YoupyBaby</div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-lg transition-all">
              <div className="flex items-center gap-1 mb-4">
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
              </div>
              <p className="text-gray-600 mb-4">
                "Avant de travailler avec TEKKI Studio, j'avais essayé d'autres solutions qui étaient soit trop chères, soit de mauvaise qualité. Ils ont réussi à créer exactement ce dont j'avais besoin, à un prix abordable. J'adore mon site."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-tekki-blue rounded-full flex items-center justify-center text-white font-bold">
                  FD
                </div>
                <div>
                  <div className="font-medium">Fatou Diedhiou</div>
                  <div className="text-sm text-gray-500">Abarings</div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-gray-50">
        <Container>
          <h2 className="text-3xl font-bold text-tekki-blue text-center mb-12">
            Questions fréquentes
          </h2>
          
          <div className="max-w-3xl mx-auto space-y-6">
            {serviceData.faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all border border-gray-100 hover:border-tekki-coral/20">
                <h3 className="text-xl font-bold text-tekki-blue mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-600">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Final */}
      <section className="py-16 bg-gradient-to-r from-tekki-blue to-tekki-coral text-white">
        <Container className="text-center">
          <h2 className="text-3xl font-bold mb-6">
            Prêt à transformer votre business en ligne ?
          </h2>
          <p className="text-xl opacity-90 max-w-3xl mx-auto mb-8">
            Investissez dans un site e-commerce professionnel qui convertira réellement vos visiteurs en clients, et une stratégie efficace pour attirer ces clients.
          </p>
          
          <div className="mb-8">
            <div className="text-white/80 max-w-xl mx-auto">
                Paiement facilité : 60% à la commande (<PriceFormatter amount={serviceData.price * 0.6} />), 
                40% à la livraison (<PriceFormatter amount={serviceData.price * 0.4} />)
            </div>
          </div>
          
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-white text-tekki-blue hover:bg-white/90 px-10 py-5 rounded-lg font-bold text-xl transition-all transform hover:scale-105 shadow-lg inline-flex items-center"
          >
            Obtenir mon site e-commerce
            <ArrowRight className="ml-3 h-6 w-6" />
          </button>
          
          <div className="mt-6 text-white/70">
            Votre site + stratégie Meta est livré en {serviceData.deliveryTime}
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
            shopify: serviceData.price,
            wordpress: 495000
          },
          deliveryTime: serviceData.deliveryTime,
          portfolioItems: serviceData.portfolioItems,
          features: serviceData.features,
          marketingStrategy: serviceData.marketingStrategy
        }}
      />
    </main>
  );
}