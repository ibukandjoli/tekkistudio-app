// app/promo-ramadan/page.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Check, Clock, Package, PieChart, Award, ShoppingCart, Users, Star, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import PromoEnrollmentModal from '@/app/components/promotions/PromoEnrollmentModal';

// Données pour la promotion Ramadan
const promoData = {
  title: "Offre Spéciale Ramadan",
  subtitle: "Site E-commerce Professionnel + Stratégie Meta",
  price: {
    original: 695000,
    discounted: 465000
  },
  endDate: "2024-03-12T23:59:59",
  maxClients: 12,
  remainingSpots: 5, 
  deliveryTime: "7 jours ouvrés",
  portfolioItems: [
    { name: "Momo Le Bottier", url: "https://momolebottier.com", image: "/images/portfolio/momolebottier.png" },
    { name: "Abarings", url: "https://abarings.com", image: "/images/portfolio/abarings.png" },
    { name: "YoupyBaby", url: "https://youpybaby.com", image: "/images/portfolio/youpybaby.png" },
    { name: "Samelectro", url: "https://samelectronique.com", image: "/images/portfolio/samelectro.png" },
    { name: "Best of Puff", url: "https://bestofpuff.com", image: "/images/portfolio/bestofpuff.png" },
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
  faqs: [
    {
      question: "Comment se déroule la création de mon site e-commerce ?",
      answer: "Après votre commande, nous vous contacterons sous 24h pour discuter de vos besoins spécifiques. Nous vous fournirons un questionnaire pour recueillir toutes les informations nécessaires, puis nous passerons au développement de votre site. Tout le processus est terminé en 7 jours ouvrés."
    },
    {
      question: "Puis-je personnaliser le design de mon site ?",
      answer: "Absolument ! Nous travaillons avec vous pour créer un design qui correspond à votre marque et à votre vision. Vous aurez l'opportunité de donner votre avis sur le travail réalisé avant la livraison de votre site."
    },
    {
      question: "Comment fonctionne le paiement échelonné ?",
      answer: "Vous payez 50% du montant (232 500 FCFA) lors de votre commande pour réserver votre place. Les 50% restants sont à payer 30 jours après la livraison de votre site, ce qui vous donne le temps de commencer à générer des revenus avec votre nouveau site."
    },
    {
      question: "Que se passe-t-il après la livraison du site ?",
      answer: "Nous vous formons à l'utilisation de votre nouveau site e-commerce et vous accompagnons dans la mise en place de votre stratégie marketing sur Meta (Facebook & Instagram). Nous restons disponibles pendant 30 jours après la livraison pour répondre à vos questions et effectuer des ajustements mineurs si nécessaire."
    }
  ]
};

// Fonction formatPrice typée correctement
const formatPrice = (price: number): string => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

export default function RamadanPromoPage() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const detailsRef = useRef<HTMLElement>(null);

  // Fonction pour le défilement fluide
  const scrollToDetails = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    if (detailsRef.current) {
      window.scrollTo({
        top: detailsRef.current.offsetTop - 100, // Ajustement pour le header
        behavior: 'smooth'
      });
    }
  };

  // Calculer le temps restant jusqu'à la fin de la promotion
  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(promoData.endDate).getTime() - new Date().getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      } else {
        // Si la date est dépassée, mettez tout à zéro
        setTimeLeft({
          days: 8,
          hours: 3,
          minutes: 30,
          seconds: 0
        });
      }
    };

    // Mettre à jour le temps restant toutes les secondes
    const timer = setInterval(calculateTimeLeft, 1000);
    calculateTimeLeft(); // Exécuter immédiatement

    return () => clearInterval(timer);
  }, []);

  return (
    <main className="pb-20">
      {/* Hero Section avec background gradient */}
      <section className="relative pt-28 pb-20 bg-gradient-to-r from-[#0f4c81] to-[#1a6baa] overflow-hidden">
        {/* Motif géométrique en arrière-plan */}
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-12 h-full">
            {[...Array(48)].map((_, i) => (
              <div key={i} className="border border-white/20" />
            ))}
          </div>
        </div>
        
        {/* Badge Ramadan */}
        <div className="absolute top-20 right-10 rotate-12 hidden md:block">
          <div className="bg-[#ff7f50] text-white font-bold px-6 py-3 rounded-full transform shadow-lg">
            Offre limitée Ramadan
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-6 bg-white/10 backdrop-blur-sm px-6 py-2 rounded-full">
              <span className="text-white font-medium">
                <span className="text-[#ff7f50]">OFFRE SPÉCIALE</span> • valable jusqu'au 12 mars 2025
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Propulsez votre business avec un <span className="text-[#ff7f50]">site e-commerce</span> professionnel
            </h1>
            
            <p className="text-xl text-white/90 mb-8">
              Profitez de cette période bénie pour investir dans l'avenir de votre entreprise avec notre offre exclusive combinant un site e-commerce clé en main et une stratégie d'acquisition client.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-[#ff7f50] hover:bg-[#ff6b3d] text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 shadow-lg flex items-center"
              >
                Profiter de l'offre
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              
              <a
                href="#details"
                onClick={scrollToDetails}
                className="text-white border-2 border-white/30 hover:border-white/60 px-8 py-4 rounded-lg font-semibold transition-all"
              >
                En savoir plus
              </a>
            </div>
            
            {/* Prix barré et prix promo */}
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl inline-block">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-10">
                <div className="text-center">
                  <span className="text-white/60 text-lg line-through">
                    {formatPrice(promoData.price.original)} FCFA
                  </span>
                  <div className="text-white font-bold text-3xl sm:text-4xl">
                    {formatPrice(promoData.price.discounted)} FCFA
                  </div>
                  <span className="text-[#ff7f50] font-medium">
                    Économisez {formatPrice(promoData.price.original - promoData.price.discounted)} FCFA
                  </span>
                </div>
                
                <div className="h-full w-px bg-white/20 hidden sm:block"></div>
                
                <div className="text-center">
                  <div className="text-white/80 mb-1">Paiement facilité</div>
                  <div className="text-white font-bold text-xl">50% maintenant</div>
                  <div className="text-white font-bold text-xl">50% après 30 jours</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section urgence et limitations */}
      <section className="py-10 bg-red-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-8 -mt-20">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Compte à rebours */}
              <div className="bg-gray-50 rounded-xl p-6 text-center">
                <h3 className="text-[#0f4c81] font-bold text-xl mb-4 flex items-center justify-center">
                  <Clock className="w-5 h-5 mr-2" /> Offre à durée limitée
                </h3>
                
                <div className="flex justify-center gap-4 my-4">
                  <div className="flex flex-col">
                    <div className="bg-[#0f4c81] text-white text-2xl font-bold rounded-lg w-16 h-16 flex items-center justify-center">
                      {timeLeft.days}
                    </div>
                    <span className="text-sm mt-1">Jours</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="bg-[#0f4c81] text-white text-2xl font-bold rounded-lg w-16 h-16 flex items-center justify-center">
                      {timeLeft.hours}
                    </div>
                    <span className="text-sm mt-1">Heures</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="bg-[#0f4c81] text-white text-2xl font-bold rounded-lg w-16 h-16 flex items-center justify-center">
                      {timeLeft.minutes}
                    </div>
                    <span className="text-sm mt-1">Minutes</span>
                  </div>
                  <div className="flex flex-col">
                    <div className="bg-[#0f4c81] text-white text-2xl font-bold rounded-lg w-16 h-16 flex items-center justify-center">
                      {timeLeft.seconds}
                    </div>
                    <span className="text-sm mt-1">Secondes</span>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm">
                  Cette offre exceptionnelle se termine le 12 mars 2025
                </p>
              </div>
              
              {/* Places limitées */}
              <div className="bg-gray-50 rounded-xl p-6 text-center">
                <h3 className="text-[#0f4c81] font-bold text-xl mb-4 flex items-center justify-center">
                  <Users className="w-5 h-5 mr-2" /> Places limitées
                </h3>
                
                <div className="my-6">
                  <div className="relative pt-1">
                    <div className="mb-4 text-center">
                      <span className="text-[#ff7f50] font-bold text-3xl">
                        {promoData.remainingSpots}
                      </span>
                      <span className="text-gray-700 ml-2">
                        places restantes sur {promoData.maxClients}
                      </span>
                    </div>
                    <div className="overflow-hidden h-4 bg-gray-200 rounded-full">
                      <div 
                        className="h-full bg-[#ff7f50] rounded-full" 
                        style={{ width: `${(promoData.remainingSpots / promoData.maxClients) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm">
                  Nous limitons à {promoData.maxClients} clients pour garantir une qualité optimale et respecter nos délais
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ce qui est inclus - 2 colonnes */}
      <section ref={detailsRef} id="details" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-[#0f4c81] text-center mb-12">
            Une solution complète pour vendre efficacement sur Internet
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div className="bg-gray-50 rounded-xl p-8 border border-gray-100 hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-[#0f4c81]/10 rounded-full flex items-center justify-center mb-6">
                <ShoppingCart className="w-8 h-8 text-[#0f4c81]" />
              </div>
              <h3 className="text-2xl font-bold text-[#0f4c81] mb-4">
                Site E-commerce Professionnel
              </h3>
              <p className="text-gray-600 mb-6">
                Un site e-commerce moderne, intuitif et optimisé pour convertir vos visiteurs en clients. Livré clé en main en seulement 7 jours ouvrés.
              </p>
              
              <ul className="space-y-3">
                {promoData.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-8 border border-gray-100 hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-[#ff7f50]/10 rounded-full flex items-center justify-center mb-6">
                <PieChart className="w-8 h-8 text-[#ff7f50]" />
              </div>
              <h3 className="text-2xl font-bold text-[#0f4c81] mb-4">
                Stratégie d'Acquisition Client Meta
              </h3>
              <p className="text-gray-600 mb-6">
                Une stratégie complète pour attirer des clients qualifiés sur votre site grâce à des campagnes publicitaires optimisées sur Facebook et Instagram.
              </p>
              
              <ul className="space-y-3">
                {promoData.marketingStrategy.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#ff7f50] hover:bg-[#ff6b3d] text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 shadow-lg inline-flex items-center"
            >
              Réserver ma place maintenant
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Pourquoi cette offre est exceptionnelle */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-[#0f4c81] text-center mb-4">
            Pourquoi profiter de cette offre exceptionnelle
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            Notre offre combine tous les éléments essentiels pour lancer ou améliorer votre présence en ligne et générer des ventes rapidement.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all border-t-4 border-[#0f4c81]">
              <div className="w-12 h-12 bg-[#0f4c81]/10 rounded-full flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-[#0f4c81]" />
              </div>
              <h3 className="text-xl font-bold text-[#0f4c81] mb-2">
                Rapidité d'exécution
              </h3>
              <p className="text-gray-600">
                Votre site e-commerce sera prêt en seulement {promoData.deliveryTime}, vous permettant de le rentabiliser rapidement dès le mois suivant.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all border-t-4 border-[#0f4c81]">
              <div className="w-12 h-12 bg-[#0f4c81]/10 rounded-full flex items-center justify-center mb-4">
                <Package className="w-6 h-6 text-[#0f4c81]" />
              </div>
              <h3 className="text-xl font-bold text-[#0f4c81] mb-2">
                Solution tout-en-un
              </h3>
              <p className="text-gray-600">
                Vous obtenez non seulement un site professionnel, mais aussi une stratégie complète pour attirer des clients et augmenter vos ventes.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all border-t-4 border-[#0f4c81]">
              <div className="w-12 h-12 bg-[#0f4c81]/10 rounded-full flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-[#0f4c81]" />
              </div>
              <h3 className="text-xl font-bold text-[#0f4c81] mb-2">
                Économie substantielle
              </h3>
              <p className="text-gray-600">
                Profitez d'une réduction de {formatPrice(promoData.price.original - promoData.price.discounted)} FCFA sur le prix normal et d'un paiement facilité en deux tranches, sur 30 jours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Nos réalisations - Portefeuille */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-[#0f4c81] text-center mb-4">
            Des sites que nous avons déjà réalisés
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            Découvrez quelques-unes de nos réalisations pour des entrepreneurs comme vous
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {promoData.portfolioItems.map((item, index) => (
              <div key={index} className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all">
                <div className="aspect-[16/9] relative bg-gray-100">
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
                
                <div className="absolute inset-0 bg-[#0f4c81]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <h3 className="text-white font-bold text-xl mb-2">{item.name}</h3>
                  <a 
                    href={item.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-white text-sm underline hover:text-[#ff7f50]"
                  >
                    Visiter le site
                  </a>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#ff7f50] hover:bg-[#ff6b3d] text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all hover:shadow-lg inline-flex items-center"
            >
              Je veux mon site e-commerce
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-[#0f4c81] text-center mb-12">
            Ce que nos clients disent de nous
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-sm">
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
                <div className="w-12 h-12 bg-[#0f4c81] rounded-full flex items-center justify-center text-white font-bold">
                  MD
                </div>
                <div>
                  <div className="font-medium">Mme Diouf</div>
                  <div className="text-sm text-gray-500">Momo Le Bottier</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
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
                <div className="w-12 h-12 bg-[#0f4c81] rounded-full flex items-center justify-center text-white font-bold">
                  FD
                </div>
                <div>
                  <div className="font-medium">Mme Ndiaye</div>
                  <div className="text-sm text-gray-500">YoupyBaby</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
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
                <div className="w-12 h-12 bg-[#0f4c81] rounded-full flex items-center justify-center text-white font-bold">
                  FD
                </div>
                <div>
                  <div className="font-medium">Fatou Diedhiou</div>
                  <div className="text-sm text-gray-500">Abarings</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-[#0f4c81] text-center mb-12">
            Questions fréquentes
          </h2>
          
          <div className="max-w-3xl mx-auto space-y-6">
            {promoData.faqs.map((faq, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-[#0f4c81] mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-600">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 bg-[#0f4c81] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ne ratez pas cette offre exceptionnelle !
          </h2>
          <p className="text-xl opacity-90 max-w-3xl mx-auto mb-8">
            Propulsez votre business avec un site e-commerce professionnel et une stratégie d'acquisition client efficace.
          </p>
          
          <div className="mb-8">
            <div className="text-2xl font-bold mb-1">
              {formatPrice(promoData.price.discounted)} FCFA
              <span className="text-[#ff7f50] text-lg ml-2">
                (au lieu de {formatPrice(promoData.price.original)} FCFA)
              </span>
            </div>
            <div className="text-white/80">
              Paiement facilité : 50% maintenant, 50% dans 30 jours
            </div>
          </div>
          
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#ff7f50] hover:bg-[#ff6b3d] text-white px-10 py-5 rounded-lg font-bold text-xl transition-all transform hover:scale-105 shadow-lg inline-flex items-center"
          >
            Profitez de l'offre Ramadan
            <ArrowRight className="ml-3 h-6 w-6" />
          </button>
          
          <div className="mt-6 text-white/70">
            Plus que {promoData.remainingSpots} places disponibles • Offre valable jusqu'au 12 mars
          </div>
        </div>
      </section>

      {/* Modal d'inscription */}
      <PromoEnrollmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        promoData={promoData}
      />
    </main>
  );
}