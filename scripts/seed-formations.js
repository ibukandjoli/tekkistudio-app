// scripts/seed-formations.js
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const formations = [
  {
    slug: 'fondamentaux-ecommerce',
    title: "Les Fondamentaux de l'E-commerce",
    category: "E-commerce",
    description: "Maîtrisez les bases essentielles pour lancer et gérer une boutique en ligne performante.",
    long_description: "Cette formation complète vous donnera toutes les clés pour comprendre et maîtriser l'écosystème e-commerce. Parfaite pour les débutants, elle couvre tous les aspects essentiels du commerce en ligne.",
    duration: "4 semaines",
    sessions: "8 sessions de 2h",
    level: "Débutant",
    price: "150,000 FCFA",
    price_amount: 150000,
    icon: "ShoppingBag", // Stocké comme une chaîne représentant le nom de l'icône
    benefits: [
      "Comprendre l'écosystème e-commerce et ses enjeux",
      "Maîtriser les aspects légaux et fiscaux du e-commerce",
      "Apprendre à gérer efficacement votre stock et votre logistique",
      "Mettre en place un service client performant",
      "Comprendre les bases du marketing digital",
      "Savoir analyser vos premiers résultats"
    ],
    modules: [
      {
        title: "Introduction à l'e-commerce",
        description: "Comprendre les fondamentaux du commerce en ligne",
        lessons: [
          "Les différents modèles d'e-commerce",
          "L'écosystème e-commerce en Afrique",
          "Les tendances actuelles du marché",
          "Choisir son positionnement"
        ]
      },
      {
        title: "Aspects juridiques et fiscaux",
        description: "Maîtriser le cadre légal de votre activité",
        lessons: [
          "Cadre juridique de l'e-commerce",
          "Obligations fiscales",
          "Protection des données clients",
          "Conditions générales de vente"
        ]
      },
      {
        title: "Gestion des stocks et logistique",
        description: "Optimiser vos opérations quotidiennes",
        lessons: [
          "Gestion des stocks",
          "Choix des fournisseurs",
          "Organisation de la logistique",
          "Suivi des commandes"
        ]
      },
      {
        title: "Service client et satisfaction",
        description: "Créer une expérience client exceptionnelle",
        lessons: [
          "Bases du service client",
          "Gestion des réclamations",
          "Politique de retour",
          "Fidélisation client"
        ]
      }
    ],
    prerequisites: [
      "Connaissance de base en informatique",
      "Accès à un ordinateur et à internet",
      "Aucune expérience en e-commerce requise"
    ],
    formateur: {
      name: "David Seck",
      role: "Expert E-commerce",
      bio: "10 ans d'expérience dans l'e-commerce, fondateur de plusieurs boutiques en ligne à succès."
    },
    prochaine_sessions: [
      {
        date: "15 Mars 2024",
        places: 15
      },
      {
        date: "1er Avril 2024",
        places: 20
      }
    ]
  },
  {
    slug: 'marketing-digital-ecommerce',
    title: "Marketing Digital pour E-commerce",
    category: "Marketing",
    description: "Apprenez à attirer, convertir et fidéliser vos clients grâce au marketing digital.",
    long_description: "Maîtrisez les techniques de marketing digital spécifiques à l'e-commerce pour développer votre présence en ligne et augmenter vos ventes.",
    duration: "6 semaines",
    sessions: "12 sessions de 2h",
    level: "Intermédiaire",
    price: "200,000 FCFA",
    price_amount: 200000,
    icon: "TrendingUp",
    benefits: [
      "Créer une stratégie marketing digitale complète",
      "Maîtriser les réseaux sociaux pour l'e-commerce",
      "Optimiser vos campagnes publicitaires",
      "Améliorer votre référencement naturel",
      "Mettre en place des automations marketing",
      "Mesurer et optimiser vos performances"
    ],
    modules: [
      {
        title: "Stratégie marketing digitale",
        description: "Construire une stratégie efficace",
        lessons: [
          "Définition des objectifs",
          "Analyse de la concurrence",
          "Identification des canaux",
          "Planification des actions"
        ]
      },
      {
        title: "Social Media Marketing",
        description: "Exploiter la puissance des réseaux sociaux",
        lessons: [
          "Stratégie social media",
          "Création de contenu",
          "Community management",
          "Publicité sociale"
        ]
      },
      {
        title: "Publicité en ligne",
        description: "Maîtriser Google Ads et Facebook Ads",
        lessons: [
          "Structure des campagnes",
          "Ciblage avancé",
          "Optimisation des annonces",
          "Suivi des performances"
        ]
      },
      {
        title: "Email Marketing",
        description: "Développer vos ventes par email",
        lessons: [
          "Stratégie email marketing",
          "Segmentation",
          "Automation",
          "Tests et optimisation"
        ]
      }
    ],
    prerequisites: [
      "Expérience basique en e-commerce",
      "Connaissance des réseaux sociaux",
      "Notions de marketing digital"
    ],
    formateur: {
      name: "Sarah Diallo",
      role: "Experte Marketing Digital",
      bio: "Consultante en marketing digital avec plus de 8 ans d'expérience dans l'e-commerce."
    },
    prochaine_sessions: [
      {
        date: "20 Mars 2024",
        places: 12
      },
      {
        date: "10 Avril 2024",
        places: 15
      }
    ]
  },
  {
    slug: 'analytics-ecommerce',
    title: "Analytics et Optimisation E-commerce",
    category: "Analytics",
    description: "Utilisez les données pour optimiser vos performances et augmenter vos ventes.",
    long_description: "Apprenez à collecter, analyser et interpréter les données de votre boutique en ligne pour prendre de meilleures décisions et optimiser vos performances commerciales.",
    duration: "4 semaines",
    sessions: "8 sessions de 2h",
    level: "Avancé",
    price: "180,000 FCFA",
    price_amount: 180000,
    icon: "BarChart",
    benefits: [
      "Analyser vos données de vente",
      "Optimiser votre taux de conversion",
      "Comprendre le comportement client",
      "Prendre des décisions basées sur les données",
      "Mettre en place des tableaux de bord personnalisés",
      "Maîtriser l'A/B testing"
    ],
    modules: [
      {
        title: "Google Analytics pour E-commerce",
        description: "Maîtriser la collecte de données",
        lessons: [
          "Configuration avancée de GA4",
          "Tracking e-commerce",
          "Segments d'audience",
          "Suivi des campagnes"
        ]
      },
      {
        title: "Analyse des KPIs",
        description: "Identifier et suivre les indicateurs clés",
        lessons: [
          "KPIs e-commerce essentiels",
          "Analyse de la performance produit",
          "Analyse du parcours client",
          "Reporting automatisé"
        ]
      },
      {
        title: "Tests A/B et optimisation",
        description: "Améliorer continuellement vos performances",
        lessons: [
          "Méthodologie des tests A/B",
          "Optimisation de fiches produit",
          "Optimisation du tunnel d'achat",
          "Tests sur les éléments de conversion"
        ]
      },
      {
        title: "Tableaux de bord et reporting",
        description: "Visualiser efficacement vos données",
        lessons: [
          "Création de tableaux de bord",
          "Automatisation des rapports",
          "Visualisation de données",
          "Prise de décision data-driven"
        ]
      }
    ],
    prerequisites: [
      "Expérience en gestion de boutique e-commerce",
      "Connaissances de base en analyse de données",
      "Utilisation basique de Google Analytics"
    ],
    formateur: {
      name: "Amadou Ndiaye",
      role: "Expert Analytics",
      bio: "Spécialiste en analyse de données avec plus de 6 ans d'expérience dans l'optimisation e-commerce."
    },
    prochaine_sessions: [
      {
        date: "5 Avril 2024",
        places: 10
      },
      {
        date: "15 Mai 2024",
        places: 15
      }
    ]
  },
  {
    slug: 'service-client-ecommerce',
    title: "Service Client E-commerce",
    category: "Service Client",
    description: "Développez un service client d'excellence pour fidéliser vos clients.",
    long_description: "Apprenez à mettre en place un service client performant qui transforme vos acheteurs en ambassadeurs de votre marque et maximise la satisfaction client.",
    duration: "3 semaines",
    sessions: "6 sessions de 2h",
    level: "Tous niveaux",
    price: "120,000 FCFA",
    price_amount: 120000,
    icon: "Users",
    benefits: [
      "Gérer efficacement les réclamations",
      "Mettre en place des processus SAV",
      "Créer une expérience client positive",
      "Fidéliser votre clientèle",
      "Optimiser vos canaux de support",
      "Transformer les clients mécontents en ambassadeurs"
    ],
    modules: [
      {
        title: "Fondamentaux du service client",
        description: "Bases d'un service client de qualité",
        lessons: [
          "Principes du service client e-commerce",
          "Attentes des clients en ligne",
          "Canaux de communication",
          "Mesure de la satisfaction client"
        ]
      },
      {
        title: "Gestion des réclamations",
        description: "Transformer les problèmes en opportunités",
        lessons: [
          "Processus de gestion des plaintes",
          "Communication en situation de crise",
          "Résolution de problèmes",
          "Compensation et gestes commerciaux"
        ]
      },
      {
        title: "Outils et processus SAV",
        description: "Optimiser votre service après-vente",
        lessons: [
          "Sélection des outils adaptés",
          "Automatisation des processus",
          "Gestion des retours et remboursements",
          "Suivi et amélioration continue"
        ]
      },
      {
        title: "Stratégies de fidélisation",
        description: "Transformer les clients en ambassadeurs",
        lessons: [
          "Programmes de fidélité",
          "Personnalisation de l'expérience",
          "Communication post-achat",
          "Création d'une communauté"
        ]
      }
    ],
    prerequisites: [
      "Aucun prérequis spécifique",
      "Intérêt pour la relation client",
      "Volonté d'améliorer l'expérience utilisateur"
    ],
    formateur: {
      name: "Fatou Bamba",
      role: "Experte Service Client",
      bio: "15 ans d'expérience dans la gestion de services clients pour des boutiques e-commerce internationales."
    },
    prochaine_sessions: [
      {
        date: "25 Mars 2024",
        places: 15
      },
      {
        date: "20 Avril 2024",
        places: 20
      }
    ]
  },
  {
    slug: 'gestion-site-ecommerce',
    title: "Gestion Technique de Site E-commerce",
    category: "Technique",
    description: "Maîtrisez les aspects techniques de votre boutique en ligne.",
    long_description: "Apprenez à gérer efficacement les aspects techniques de votre site e-commerce pour garantir performance, sécurité et expérience utilisateur optimale.",
    duration: "5 semaines",
    sessions: "10 sessions de 2h",
    level: "Intermédiaire",
    price: "170,000 FCFA",
    price_amount: 170000,
    icon: "Monitor",
    benefits: [
      "Gérer votre catalogue produits",
      "Optimiser les performances du site",
      "Sécuriser votre boutique",
      "Maintenir votre plateforme",
      "Résoudre les problèmes techniques courants",
      "Améliorer l'expérience utilisateur"
    ],
    modules: [
      {
        title: "Gestion de catalogue",
        description: "Optimiser votre catalogue produits",
        lessons: [
          "Structure du catalogue",
          "Gestion des attributs produits",
          "Import/export de données",
          "Optimisation des fiches produits"
        ]
      },
      {
        title: "Optimisation technique",
        description: "Améliorer la performance de votre site",
        lessons: [
          "Optimisation de la vitesse de chargement",
          "Responsive design",
          "SEO technique",
          "Optimisation des images"
        ]
      },
      {
        title: "Sécurité e-commerce",
        description: "Protéger votre boutique et vos clients",
        lessons: [
          "Bonnes pratiques de sécurité",
          "Gestion des paiements sécurisés",
          "Protection des données clients",
          "Conformité RGPD"
        ]
      },
      {
        title: "Maintenance et mises à jour",
        description: "Garder votre boutique à jour et fonctionnelle",
        lessons: [
          "Planification des mises à jour",
          "Sauvegardes et restauration",
          "Résolution de problèmes",
          "Monitoring et alertes"
        ]
      }
    ],
    prerequisites: [
      "Connaissances de base en informatique",
      "Familiarité avec les CMS e-commerce",
      "Compréhension basique du HTML/CSS"
    ],
    formateur: {
      name: "Omar Faye",
      role: "Expert Technique E-commerce",
      bio: "Développeur web et consultant e-commerce avec plus de 10 ans d'expérience dans la gestion de boutiques en ligne."
    },
    prochaine_sessions: [
      {
        date: "10 Avril 2024",
        places: 12
      },
      {
        date: "5 Mai 2024",
        places: 15
      }
    ]
  }
];

const insertFormations = async () => {
  console.log('Début de l\'importation des formations...');
  
  // Supprimer les formations existantes pour éviter les doublons
  const { error: deleteError } = await supabase
    .from('formations')
    .delete()
    .not('id', 'is', null);
  
  if (deleteError) {
    console.error('Erreur lors de la suppression des formations existantes:', deleteError);
    return;
  }
  
  console.log('Formations existantes supprimées.');
  
  // Insérer les nouvelles formations
  for (const formation of formations) {
    const { data, error } = await supabase
      .from('formations')
      .insert([
        {
          slug: formation.slug,
          title: formation.title,
          category: formation.category,
          description: formation.description,
          long_description: formation.long_description,
          duration: formation.duration,
          sessions: formation.sessions,
          level: formation.level,
          price: formation.price,
          price_amount: formation.price_amount,
          icon: formation.icon,
          benefits: formation.benefits,
          modules: formation.modules,
          prerequisites: formation.prerequisites,
          formateur: formation.formateur,
          prochaine_sessions: formation.prochaine_sessions
        }
      ]);
    
    if (error) {
      console.error(`Erreur lors de l'importation de la formation "${formation.title}":`, error);
    } else {
      console.log(`Formation "${formation.title}" importée avec succès.`);
    }
  }
  
  console.log('Importation des formations terminée.');
};

insertFormations()
  .catch(err => {
    console.error('Erreur globale:', err);
    process.exit(1);
  });