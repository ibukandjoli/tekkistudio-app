// app/services/sites-ecommerce/page.tsx
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
  AlertCircle,
  Smartphone,
  Laptop,
  Globe,
  Target,
  Users,
  Palette,
  LineChart,
  Heart,
  CheckCircle,
  PlayCircle,
  Quote,
  Lightbulb,
  Megaphone,
  Trophy
} from 'lucide-react';

// Simuler les composants nécessaires pour la démo
interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

const Container = ({ children, className = "" }: ContainerProps) => (
  <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
    {children}
  </div>
);

interface PriceFormatterProps {
  amount: number;
}

const PriceFormatter = ({ amount }: PriceFormatterProps) => {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " FCFA";
};

// Données mises à jour
const serviceData = {
  title: "Sites E-commerce Professionnels pour Marques",
  subtitle: "La solution complète pour faire rayonner votre marque en ligne",
  shopifyPrice: 695000,
  wordpressPrice: 495000,
  deliveryTime: "7-10 jours ouvrés",
  portfolioItems: [
    { name: "Momo Le Bottier", url: "https://momolebottier.com", image: "/images/portfolio/momolebottier.png", category: "Chaussures" },
    { name: "Abarings", url: "https://abarings.com", image: "/images/portfolio/abarings.png", category: "Bijoux" },
    { name: "YoupyBaby", url: "https://youpybaby.com", image: "/images/portfolio/youpybaby.png", category: "Enfants" },
    { name: "Maika Déco", url: "https://maikadeco.com", image: "/images/portfolio/maikadeco.png", category: "Décoration" },
    { name: "6C No Filter", url: "https://6cnofilter.com", image: "/images/portfolio/6cnofilter.png", category: "Mode" },
    { name: "Viens on s'connaît", url: "https://viensonsconnait.com", image: "/images/portfolio/viensonsconnait.png", category: "Événements" }
  ],
  brandChallenges: [
    {
      icon: "📱",
      title: "Ventes limitées aux DM",
      description: "Votre marque mérite plus que des ventes dans les messages privés"
    },
    {
      icon: "😴",
      title: "Aucune vente la nuit",
      description: "Vous perdez des clients quand vous dormez"
    },
    {
      icon: "📊",
      title: "Pas de données sur vos clients",
      description: "Impossible de comprendre et fidéliser votre audience"
    },
    {
      icon: "🌍",
      title: "Portée limitée",
      description: "Difficile d'atteindre de nouveaux marchés"
    },
    {
      icon: "💳",
      title: "Paiements compliqués",
      description: "Processus de commande fastidieux qui fait fuir les clients"
    },
    {
      icon: "🏪",
      title: "Image amateur",
      description: "Votre marque n'a pas la crédibilité qu'elle mérite"
    }
  ],
  brandBenefits: [
    {
      icon: "🚀",
      title: "Ventes 24h/24",
      description: "Votre boutique travaille pour votre marque même pendant votre sommeil"
    },
    {
      icon: "🌟",
      title: "Image de marque professionnelle",
      description: "Une vitrine digne de votre marque qui inspire confiance"
    },
    {
      icon: "📈",
      title: "Croissance exponentielle",
      description: "Touchez des milliers de clients potentiels chaque jour"
    },
    {
      icon: "💡",
      title: "Données précieuses",
      description: "Comprenez vos clients pour mieux les servir"
    },
    {
      icon: "🌍",
      title: "Expansion internationale",
      description: "Vendez partout dans le monde sans limites"
    },
    {
      icon: "⚡",
      title: "Automatisation complète",
      description: "Focus sur votre marque, nous gérons la technique"
    }
  ],
  whyChooseUs: [
    {
      icon: <Award className="w-8 h-8" />,
      title: "Experts en marques africaines",
      description: "Nous comprenons les spécificités du marché africain et créons des expériences qui résonnent avec votre audience locale."
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "Fabrique de marques à succès",
      description: "Nous créons nos propres marques qui cartonnent en ligne. Cette expertise, nous la mettons au service de votre marque."
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Conversion avant tout",
      description: "Chaque élément de votre site est pensé pour transformer vos visiteurs en acheteurs fidèles."
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Mobile-first pour l'Afrique",
      description: "Des sites optimisés pour smartphone, car nous savons que 80% de vos clients naviguent sur mobile."
    }
  ],
  testimonials: [
    {
      name: "Mme Diouf",
      brand: "Momo Le Bottier",
      content: "TEKKI Studio a transformé notre marque de chaussures artisanales. En 3 mois, nous avons triplé nos ventes et touché des clients dans toute l'Afrique de l'Ouest.",
      avatar: "MD",
      rating: 5
    },
    {
      name: "Fatou Diedhiou", 
      brand: "Abarings",
      content: "Enfin une équipe qui comprend les marques africaines ! Notre boutique en ligne reflète parfaitement l'essence de notre marque de bijoux.",
      avatar: "FD",
      rating: 5
    },
    {
      name: "Mme Ndiaye",
      brand: "YoupyBaby", 
      content: "Grâce à TEKKI Studio, notre marque pour enfants a une présence en ligne professionnelle. Les commandes arrivent même la nuit !",
      avatar: "FN", 
      rating: 5
    }
  ],
  faqs: [
    {
      question: "Pourquoi choisir TEKKI Studio plutôt qu'un freelance ?",
      answer: "Nous sommes spécialisés dans les marques et l'e-commerce. En tant que créateurs de marques à succès, nous savons exactement ce qui fonctionne pour faire décoller une marque en ligne. Nos sites ne sont pas de simples catalogues, ce sont de véritables machines de vente."
    },
    {
      question: "Quelle est la différence entre Shopify et WordPress ?",
      answer: "Shopify est une solution tout-en-un, facile à gérer depuis votre smartphone, idéale si vous voulez vous concentrer sur votre marque. WordPress offre plus de personnalisation et pas d'abonnement mensuel, parfait si vous avez des besoins techniques spécifiques."
    },
    {
      question: "Proposez-vous un accompagnement après la livraison ?",
      answer: "Absolument ! Nous incluons 1 mois de support gratuit, une formation complète pour gérer votre boutique, et nous restons disponibles pour faire évoluer votre site avec votre marque."
    },
    {
      question: "Combien de temps faut-il pour créer le site ?",
      answer: "7 à 10 jours ouvrés pour un site complet et optimisé. Nous travaillons rapidement sans compromettre la qualité, car nous savons que le temps c'est de l'argent pour votre marque."
    },
    {
      question: "Puis-je voir des exemples de vos réalisations ?",
      answer: "Bien sûr ! Consultez notre portfolio ci-dessus avec des marques comme Momo Le Bottier, Abarings, YoupyBaby. Chaque site reflète l'identité unique de la marque tout en optimisant les conversions."
    }
  ]
};

export default function EcommerceServicePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<'shopify' | 'wordpress' | null>(null);
  const portfolioRef = useRef<HTMLElement>(null);
  const servicesRef = useRef<HTMLElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const openModal = (platform: 'shopify' | 'wordpress') => {
    setSelectedPlatform(platform);
    setIsModalOpen(true);
  };

  return (
    <main className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 overflow-hidden">
        {/* Motifs décoratifs */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-300 rounded-full blur-3xl"></div>
        </div>

        <Container className="relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            {/* Badge d'introduction */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full mb-8">
              <Trophy className="w-5 h-5 text-yellow-300" />
              <span className="text-white font-medium">
                #1 des sites e-commerce pour marques africaines
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
              Faites rayonner votre 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400"> marque</span> en ligne
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-12 leading-relaxed max-w-4xl mx-auto">
              Des sites e-commerce qui transforment votre vision en 
              <strong> boutique en ligne professionnelle</strong> qui vend réellement. 
              Spécialement conçus pour les marques africaines qui veulent conquérir le monde.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
              <button
                onClick={() => scrollToSection(servicesRef)}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-black px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-2xl flex items-center gap-3"
              >
                <ShoppingCart className="w-6 h-6" />
                Créer ma boutique en ligne
                <ArrowRight className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => scrollToSection(portfolioRef)}
                className="text-white border-2 border-white/30 hover:border-white/60 hover:bg-white/10 px-8 py-4 rounded-xl font-semibold transition-all flex items-center gap-3"
              >
                <PlayCircle className="w-6 h-6" />
                Voir nos réalisations
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-yellow-300 mb-2">50+</div>
                <div className="text-white/80 text-sm">Marques accompagnées</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-yellow-300 mb-2">500%</div>
                <div className="text-white/80 text-sm">Croissance moyenne</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-yellow-300 mb-2">24/7</div>
                <div className="text-white/80 text-sm">Ventes automatiques</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-yellow-300 mb-2">15+</div>
                <div className="text-white/80 text-sm">Pays couverts</div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Problèmes des marques */}
      <section className="py-20 bg-gray-50">
        <Container>
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Votre marque mérite mieux que des ventes en DM 😤
            </h2>
            <p className="text-xl text-gray-600">
              Nous comprenons les défis des marques africaines qui veulent percer en ligne
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {serviceData.brandChallenges.map((challenge, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all group">
                <div className="text-4xl mb-4">{challenge.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {challenge.title}
                </h3>
                <p className="text-gray-600">{challenge.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white p-8 rounded-2xl max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold mb-4">
                Stop aux opportunités manquées ! 🛑
              </h3>
              <p className="text-lg opacity-90">
                Chaque jour sans site e-commerce, c'est des ventes perdues, 
                des clients qui vont chez la concurrence, et votre marque qui stagne. 
                <strong> Il est temps de passer au niveau supérieur.</strong>
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Solutions - Transformation */}
      <section className="py-20 bg-white">
        <Container>
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Transformez votre marque en 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> empire digital</span> 🚀
            </h2>
            <p className="text-xl text-gray-600">
              Voici ce qui change quand votre marque a enfin la boutique en ligne qu'elle mérite
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {serviceData.brandBenefits.map((benefit, index) => (
              <div key={index} className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl border border-blue-100 hover:shadow-xl transition-all group hover:scale-105">
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Nos offres */}
      <section ref={servicesRef} className="py-20 bg-gradient-to-br from-gray-900 to-blue-900">
        <Container>
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Choisissez la solution parfaite pour votre marque 💎
            </h2>
            <p className="text-xl text-white/80">
              Deux options professionnelles, une seule promesse : faire briller votre marque
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Offre Shopify */}
            <div className="bg-white rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all group hover:scale-105 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-gradient-to-l from-green-500 to-emerald-400 text-white px-6 py-2 rounded-bl-2xl">
                <span className="font-bold text-sm">RECOMMANDÉ</span>
              </div>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center">
                  <Smartphone className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Shopify Premium</h3>
                  <p className="text-green-600 font-medium">La Rolls-Royce de l'e-commerce</p>
                </div>
              </div>
              
              <div className="mb-8">
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  <PriceFormatter amount={serviceData.shopifyPrice} />
                </div>
                <p className="text-gray-600">Clé en main • Formation incluse</p>
              </div>
              
              <div className="space-y-4 mb-8">
                {[
                  "Design sur-mesure reflétant votre marque",
                  "Interface ultra-simple (gérable depuis smartphone)",
                  "Paiements sécurisés (Wave, Stripe, PayPal)",
                  "Optimisation mobile parfaite",
                  "Support technique 24/7 Shopify",
                  "Apps premium incluses (avis, marketing)",
                  "Formation complète en français",
                  "1 mois de support TEKKI gratuit"
                ].map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
              
              <button
                onClick={() => openModal('shopify')}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-3"
              >
                <Zap className="w-5 h-5" />
                Choisir Shopify Premium
                <ArrowRight className="w-5 h-5" />
              </button>
              
              <p className="text-center text-sm text-gray-500 mt-4">
                ⚡ Parfait pour les marques qui veulent la simplicité
              </p>
            </div>

            {/* Offre WordPress */}
            <div className="bg-white rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all group hover:scale-105 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-gradient-to-l from-blue-500 to-indigo-400 text-white px-6 py-2 rounded-bl-2xl">
                <span className="font-bold text-sm">ÉCONOMIQUE</span>
              </div>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
                  <Laptop className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">WordPress Pro</h3>
                  <p className="text-blue-600 font-medium">Personnalisation illimitée</p>
                </div>
              </div>
              
              <div className="mb-8">
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  <PriceFormatter amount={serviceData.wordpressPrice} />
                </div>
                <p className="text-gray-600">Thème premium • Sans abonnement</p>
              </div>
              
              <div className="space-y-4 mb-8">
                {[
                  "Design 100% personnalisé pour votre marque",
                  "Aucun abonnement mensuel (hosting inclus 1 an)",
                  "WooCommerce optimisé pour conversions",
                  "SEO avancé pour Google",
                  "Vitesse de chargement optimisée",
                  "Extensions premium incluses",
                  "Formation WordPress complète",
                  "1 mois de support TEKKI gratuit"
                ].map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
              
              <button
                onClick={() => openModal('wordpress')}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-3"
              >
                <Lightbulb className="w-5 h-5" />
                Choisir WordPress Pro
                <ArrowRight className="w-5 h-5" />
              </button>
              
              <p className="text-center text-sm text-gray-500 mt-4">
                💡 Parfait pour les marques qui veulent le contrôle total
              </p>
            </div>
          </div>

          <div className="text-center mt-16">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-3xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-4">
                🤔 Pas sûr du choix ? On vous aide !
              </h3>
              <p className="text-white/90 mb-6">
                Nos experts analysent votre marque et vous conseillent la meilleure solution. 
                Consultation gratuite de 30min.
              </p>
              <button className="bg-white text-gray-900 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
                Consultation gratuite
              </button>
            </div>
          </div>
        </Container>
      </section>

      {/* Portfolio */}
      <section ref={portfolioRef} className="py-20 bg-white">
        <Container>
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Des marques africaines qui 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-red-500"> cartonnent</span> grâce à nous 🔥
            </h2>
            <p className="text-xl text-gray-600">
              La preuve par l'exemple : des boutiques en ligne qui transforment réellement les visiteurs en clients
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
            {serviceData.portfolioItems.map((item, index) => (
              <div key={index} className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 h-80">
                {/* Image de fond */}
                <div className="absolute inset-0">
                  {item.image ? (
                    <img 
                      src={item.image} 
                      alt={`${item.name} - ${item.category}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        // Fallback vers une image placeholder en cas d'erreur
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = `https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=320&fit=crop&crop=center&auto=format&q=60`;
                      }}
                    />
                  ) : (
                    // Image placeholder par défaut
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <div className="text-white text-center">
                        <ShoppingCart className="w-16 h-16 mx-auto mb-3 opacity-50" />
                        <div className="text-lg font-semibold opacity-75">{item.category}</div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Overlay sombre au hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Contenu au survol */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1 text-sm font-medium mb-3 inline-block">
                    {item.category}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{item.name}</h3>
                  <a 
                    href={item.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Visiter le site
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
                
                {/* Badge "En ligne" */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-green-500 text-white text-xs px-3 py-1 rounded-full font-bold">
                    ✓ En ligne
                  </div>
                </div>

                {/* Overlay subtil permanent pour améliorer la lisibilité */}
                <div className="absolute inset-0 bg-black/10"></div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                🎯 Résultats concrets de nos clients
              </h3>
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">+300%</div>
                  <div className="text-gray-700">Ventes en moyenne</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
                  <div className="text-gray-700">Commandes automatiques</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">15+</div>
                  <div className="text-gray-700">Pays de livraison</div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Pourquoi nous choisir */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <Container>
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Pourquoi les marques africaines nous font-elles confiance ? 🏆
            </h2>
            <p className="text-xl text-gray-600">
              Parce que nous ne sommes pas juste des développeurs. Nous sommes des créateurs de marques.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {serviceData.whyChooseUs.map((reason, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all group">
                <div className="flex items-start gap-6">
                  <div className="text-blue-600 group-hover:text-blue-700 transition-colors">
                    {reason.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                      {reason.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {reason.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Témoignages */}
      <section className="py-20 bg-white">
        <Container>
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Ce que disent nos marques clientes 💬
            </h2>
            <p className="text-xl text-gray-600">
              Des témoignages authentiques de marques qui ont transformé leur business
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {serviceData.testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all group">
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                
                <div className="relative mb-6">
                  <Quote className="absolute -top-2 -left-2 w-8 h-8 text-blue-200" />
                  <p className="text-gray-700 italic leading-relaxed pl-6">
                    "{testimonial.content}"
                  </p>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{testimonial.name}</div>
                    <div className="text-blue-600 font-medium">{testimonial.brand}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-50">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
                Questions fréquentes 🤔
              </h2>
              <p className="text-xl text-gray-600">
                Tout ce que vous devez savoir avant de franchir le pas
              </p>
            </div>
            
            <div className="space-y-6">
              {serviceData.faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-all">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative overflow-hidden">
        {/* Effets visuels */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-400 rounded-full blur-3xl"></div>
        </div>

        <Container className="relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight">
              Prêt à faire décoller votre marque ? 🚀
            </h2>
            
            <p className="text-xl md:text-2xl text-white/90 mb-12 leading-relaxed max-w-4xl mx-auto">
              Rejoignez les dizaines de marques africaines qui ont choisi TEKKI Studio 
              pour <strong>transformer leur vision en empire digital</strong>. 
              Votre succès commence maintenant.
            </p>
            
            <div className="flex flex-col lg:flex-row items-center justify-center gap-8 mb-16">
              <button
                onClick={() => openModal('shopify')}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-black px-10 py-5 rounded-2xl font-bold text-xl transition-all transform hover:scale-105 shadow-2xl flex items-center gap-3"
              >
                <Smartphone className="w-6 h-6" />
                Commencer avec Shopify
                <ArrowRight className="w-6 h-6" />
              </button>
              
              <button
                onClick={() => openModal('wordpress')}
                className="bg-white/10 backdrop-blur-sm border-2 border-white/30 hover:bg-white/20 text-white px-10 py-5 rounded-2xl font-bold text-xl transition-all flex items-center gap-3"
              >
                <Laptop className="w-6 h-6" />
                Commencer avec WordPress
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-4xl mx-auto">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <Shield className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <h3 className="font-bold text-white mb-2">Livraison garantie</h3>
                  <p className="text-white/80 text-sm">Votre site en 7-10 jours ou remboursé</p>
                </div>
                <div className="text-center">
                  <Heart className="w-12 h-12 text-red-400 mx-auto mb-4" />
                  <h3 className="font-bold text-white mb-2">Support inclus</h3>
                  <p className="text-white/80 text-sm">1 mois de support + formation gratuite</p>
                </div>
                <div className="text-center">
                  <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                  <h3 className="font-bold text-white mb-2">Expertise prouvée</h3>
                  <p className="text-white/80 text-sm">50+ marques satisfaites • 5⭐ garanties</p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Modal factice pour la démo */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {selectedPlatform === 'shopify' ? 'Shopify Premium' : 'WordPress Pro'}
            </h3>
            <p className="text-gray-600 mb-6">
              Excellent choix ! Notre équipe va vous contacter dans les 24h pour démarrer votre projet.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                Fermer
              </button>
              <button className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors">
                Commencer
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
