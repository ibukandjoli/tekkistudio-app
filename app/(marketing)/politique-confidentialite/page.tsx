// app/politique-confidentialite/page.tsx
'use client';

import React from 'react';
import { Shield, Lock, Eye, Users, Database, AlertTriangle, CheckCircle } from 'lucide-react';
import Container from '@/app/components/ui/Container';

const PolitiqueConfidentialitePage = () => {
  return (
    <main className="pb-0">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-tekki-blue to-tekki-coral relative pt-28 pb-20">
        <Container>
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="flex justify-center mb-6">
              <Shield className="w-16 h-16" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Politique de Confidentialité
            </h1>
            <p className="text-xl opacity-90">
              Protection et utilisation de vos données personnelles
            </p>
          </div>
        </Container>
      </section>

      {/* Contenu */}
      <section className="py-16 bg-white">
        <Container>
          <div className="max-w-4xl mx-auto">

            {/* Introduction */}
            <div className="mb-12 p-6 bg-blue-50 rounded-xl border border-blue-100">
              <p className="text-gray-700 leading-relaxed">
                TEKKI Studio s'engage à protéger la vie privée de ses utilisateurs et à respecter la confidentialité de leurs données personnelles. Cette politique de confidentialité décrit comment nous collectons, utilisons, stockons et protégeons vos informations personnelles conformément au Règlement Général sur la Protection des Données (RGPD) et aux lois sénégalaises en vigueur.
              </p>
            </div>

            {/* 1. Responsable du traitement */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-tekki-blue mb-4 flex items-center">
                <span className="w-8 h-8 bg-tekki-blue text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">1</span>
                Responsable du traitement des données
              </h2>
              <div className="pl-11 text-gray-700 leading-relaxed">
                <p className="mb-4">
                  Le responsable du traitement des données personnelles collectées sur le site tekkistudio.com est :
                </p>
                <div className="bg-gray-50 p-6 rounded-lg mb-4">
                  <p className="mb-2"><strong>TEKKI Studio</strong></p>
                  <p className="mb-2">Adresse : Ouest-foire, Dakar, Sénégal</p>
                  <p className="mb-2">Email : <a href="mailto:hello@tekkistudio.com" className="text-tekki-blue hover:underline">hello@tekkistudio.com</a></p>
                </div>
              </div>
            </div>

            {/* 2. Données collectées */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-tekki-blue mb-4 flex items-center">
                <span className="w-8 h-8 bg-tekki-blue text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">2</span>
                Données personnelles collectées
              </h2>
              <div className="pl-11 text-gray-700 leading-relaxed">
                <p className="mb-4">
                  Nous collectons différents types de données personnelles selon les interactions que vous avez avec notre site :
                </p>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-tekki-blue mb-3 flex items-center">
                    <Database className="w-5 h-5 mr-2" />
                    Données d'identification
                  </h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Nom et prénom</li>
                    <li>Adresse email</li>
                    <li>Numéro de téléphone</li>
                    <li>Nom de l'entreprise</li>
                    <li>Fonction dans l'entreprise</li>
                  </ul>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-tekki-blue mb-3 flex items-center">
                    <Eye className="w-5 h-5 mr-2" />
                    Données de navigation
                  </h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Adresse IP</li>
                    <li>Type de navigateur et version</li>
                    <li>Pages visitées et durée de visite</li>
                    <li>Données de géolocalisation approximative</li>
                    <li>Système d'exploitation</li>
                    <li>Informations sur l'appareil utilisé</li>
                  </ul>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-tekki-blue mb-3 flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Données de communication
                  </h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Messages envoyés via les formulaires de contact</li>
                    <li>Demandes de devis et informations sur les projets</li>
                    <li>Historique des échanges avec notre équipe</li>
                    <li>Préférences de communication</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 3. Finalités du traitement */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-tekki-blue mb-4 flex items-center">
                <span className="w-8 h-8 bg-tekki-blue text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">3</span>
                Finalités du traitement des données
              </h2>
              <div className="pl-11 text-gray-700 leading-relaxed">
                <p className="mb-4">
                  Vos données personnelles sont collectées et traitées pour les finalités suivantes :
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <strong>Répondre à vos demandes :</strong> Traiter vos demandes de contact, devis, informations sur nos services
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <strong>Gestion de la relation client :</strong> Assurer le suivi de nos échanges et la qualité de nos services
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <strong>Amélioration de nos services :</strong> Analyser l'utilisation du site pour améliorer l'expérience utilisateur
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <strong>Marketing et communication :</strong> Vous envoyer des informations sur nos services, actualités et offres (avec votre consentement)
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <strong>Respect des obligations légales :</strong> Répondre aux obligations comptables, fiscales et légales
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <strong>Statistiques et analyses :</strong> Mesurer l'audience et les performances du site via des outils analytics
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Base légale */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-tekki-blue mb-4 flex items-center">
                <span className="w-8 h-8 bg-tekki-blue text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">4</span>
                Base légale du traitement
              </h2>
              <div className="pl-11 text-gray-700 leading-relaxed">
                <p className="mb-4">
                  Le traitement de vos données personnelles repose sur les bases légales suivantes :
                </p>
                <ul className="list-disc pl-6 space-y-3">
                  <li><strong>Votre consentement :</strong> Pour l'envoi de communications marketing et l'utilisation de certains cookies</li>
                  <li><strong>L'exécution d'un contrat :</strong> Pour la gestion de vos demandes et la fourniture de nos services</li>
                  <li><strong>Nos intérêts légitimes :</strong> Pour l'amélioration de nos services et l'analyse du trafic</li>
                  <li><strong>Le respect d'obligations légales :</strong> Pour la conformité avec les lois comptables et fiscales</li>
                </ul>
              </div>
            </div>

            {/* 5. Durée de conservation */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-tekki-blue mb-4 flex items-center">
                <span className="w-8 h-8 bg-tekki-blue text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">5</span>
                Durée de conservation des données
              </h2>
              <div className="pl-11 text-gray-700 leading-relaxed">
                <p className="mb-4">
                  Vos données personnelles sont conservées pendant des durées variables selon leur nature et leur finalité :
                </p>
                <div className="bg-gray-50 p-6 rounded-lg space-y-3">
                  <p><strong>Données de contact et prospects :</strong> 3 ans à compter du dernier contact</p>
                  <p><strong>Données clients :</strong> Durée de la relation contractuelle + 5 ans (obligations comptables)</p>
                  <p><strong>Données de navigation (cookies) :</strong> Maximum 13 mois</p>
                  <p><strong>Données marketing :</strong> 3 ans à compter du dernier contact ou jusqu'au retrait du consentement</p>
                </div>
                <p className="mt-4">
                  À l'issue de ces périodes, vos données sont supprimées ou anonymisées de manière irréversible.
                </p>
              </div>
            </div>

            {/* 6. Destinataires des données */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-tekki-blue mb-4 flex items-center">
                <span className="w-8 h-8 bg-tekki-blue text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">6</span>
                Destinataires des données
              </h2>
              <div className="pl-11 text-gray-700 leading-relaxed">
                <p className="mb-4">
                  Vos données personnelles sont destinées aux services internes de TEKKI Studio habilités à les traiter en raison de leurs fonctions.
                </p>
                <p className="mb-4">
                  Elles peuvent également être transmises à des tiers dans les cas suivants :
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Prestataires techniques :</strong> Hébergement du site (Vercel), outils d'analyse (Google Analytics), services d'emailing</li>
                  <li><strong>Partenaires marketing :</strong> Meta (Facebook/Instagram Pixel) pour le suivi des campagnes publicitaires</li>
                  <li><strong>Autorités légales :</strong> Sur demande légale ou pour se conformer à des obligations réglementaires</li>
                </ul>
                <p className="mt-4">
                  Tous nos partenaires sont contractuellement tenus de garantir la sécurité et la confidentialité de vos données.
                </p>
              </div>
            </div>

            {/* 7. Transferts internationaux */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-tekki-blue mb-4 flex items-center">
                <span className="w-8 h-8 bg-tekki-blue text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">7</span>
                Transferts de données hors du Sénégal
              </h2>
              <div className="pl-11 text-gray-700 leading-relaxed">
                <p className="mb-4">
                  Certaines de vos données peuvent être transférées vers des pays en dehors du Sénégal, notamment :
                </p>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  <li>États-Unis (serveurs Vercel, Google Analytics, Meta)</li>
                  <li>Union Européenne (certains outils marketing)</li>
                </ul>
                <p className="mb-4">
                  Ces transferts sont encadrés par des garanties appropriées conformes au RGPD, telles que :
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Clauses contractuelles types de la Commission Européenne</li>
                  <li>Mécanismes de certification (Privacy Shield successeurs)</li>
                  <li>Décisions d'adéquation</li>
                </ul>
              </div>
            </div>

            {/* 8. Sécurité des données */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-tekki-blue mb-4 flex items-center">
                <span className="w-8 h-8 bg-tekki-blue text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">8</span>
                Sécurité des données
              </h2>
              <div className="pl-11 text-gray-700 leading-relaxed">
                <p className="mb-4">
                  TEKKI Studio met en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données personnelles contre :
                </p>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg">
                    <Lock className="w-5 h-5 text-tekki-coral flex-shrink-0 mt-1" />
                    <div>
                      <strong>Chiffrement :</strong> Protocole HTTPS pour toutes les communications
                    </div>
                  </div>
                  <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg">
                    <Shield className="w-5 h-5 text-tekki-coral flex-shrink-0 mt-1" />
                    <div>
                      <strong>Accès restreint :</strong> Limitation de l'accès aux données aux personnes autorisées
                    </div>
                  </div>
                  <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg">
                    <Database className="w-5 h-5 text-tekki-coral flex-shrink-0 mt-1" />
                    <div>
                      <strong>Sauvegardes :</strong> Copies de sécurité régulières et sécurisées
                    </div>
                  </div>
                  <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-tekki-coral flex-shrink-0 mt-1" />
                    <div>
                      <strong>Surveillance :</strong> Détection et prévention des incidents de sécurité
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 9. Vos droits */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-tekki-blue mb-4 flex items-center">
                <span className="w-8 h-8 bg-tekki-blue text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">9</span>
                Vos droits sur vos données
              </h2>
              <div className="pl-11 text-gray-700 leading-relaxed">
                <p className="mb-4">
                  Conformément au RGPD et aux lois en vigueur, vous disposez des droits suivants concernant vos données personnelles :
                </p>
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <strong className="text-tekki-blue">Droit d'accès :</strong> Obtenir la confirmation que vos données sont traitées et accéder à ces données
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <strong className="text-tekki-blue">Droit de rectification :</strong> Faire corriger des données inexactes ou incomplètes
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <strong className="text-tekki-blue">Droit à l'effacement :</strong> Demander la suppression de vos données dans certains cas
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <strong className="text-tekki-blue">Droit à la limitation :</strong> Limiter le traitement de vos données dans certaines situations
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <strong className="text-tekki-blue">Droit à la portabilité :</strong> Recevoir vos données dans un format structuré et les transmettre à un autre responsable
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <strong className="text-tekki-blue">Droit d'opposition :</strong> Vous opposer au traitement de vos données pour des raisons tenant à votre situation
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <strong className="text-tekki-blue">Droit de retirer votre consentement :</strong> Retirer à tout moment votre consentement pour les traitements basés sur celui-ci
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <strong className="text-tekki-blue">Droit de définir des directives post-mortem :</strong> Définir le sort de vos données après votre décès
                  </div>
                </div>

                <div className="mt-6 p-6 bg-gradient-to-r from-tekki-blue/5 to-tekki-coral/5 rounded-xl border border-tekki-blue/10">
                  <h3 className="font-bold text-tekki-blue mb-3">Comment exercer vos droits ?</h3>
                  <p className="mb-3">
                    Pour exercer l'un de ces droits, vous pouvez nous contacter :
                  </p>
                  <ul className="space-y-2">
                    <li>Par email : <a href="mailto:hello@tekkistudio.com" className="text-tekki-blue hover:underline font-semibold">hello@tekkistudio.com</a></li>
                    <li>En précisant votre demande et en joignant une copie de votre pièce d'identité</li>
                  </ul>
                  <p className="mt-3 text-sm text-gray-600">
                    Nous nous engageons à répondre à votre demande dans un délai d'un mois à compter de sa réception.
                  </p>
                </div>
              </div>
            </div>

            {/* 10. Cookies */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-tekki-blue mb-4 flex items-center">
                <span className="w-8 h-8 bg-tekki-blue text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">10</span>
                Politique de cookies
              </h2>
              <div className="pl-11 text-gray-700 leading-relaxed">
                <p className="mb-4">
                  Notre site utilise des cookies pour améliorer votre expérience et analyser notre trafic.
                </p>

                <h3 className="text-lg font-semibold text-tekki-blue mb-3">Types de cookies utilisés :</h3>

                <div className="space-y-4 mb-6">
                  <div className="border-l-4 border-tekki-blue pl-4">
                    <strong>Cookies essentiels :</strong> Nécessaires au fonctionnement du site (session, sécurité)
                  </div>
                  <div className="border-l-4 border-tekki-coral pl-4">
                    <strong>Cookies analytiques :</strong> Google Analytics pour mesurer l'audience et les performances
                  </div>
                  <div className="border-l-4 border-tekki-blue pl-4">
                    <strong>Cookies marketing :</strong> Meta Pixel pour le suivi des conversions publicitaires
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-tekki-blue mb-3">Gestion des cookies :</h3>
                <p className="mb-4">
                  Vous pouvez à tout moment désactiver les cookies via les paramètres de votre navigateur. Voici les liens pour les navigateurs les plus courants :
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-tekki-blue hover:underline">Google Chrome</a></li>
                  <li><a href="https://support.mozilla.org/fr/kb/activer-desactiver-cookies" target="_blank" rel="noopener noreferrer" className="text-tekki-blue hover:underline">Mozilla Firefox</a></li>
                  <li><a href="https://support.apple.com/fr-fr/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-tekki-blue hover:underline">Safari</a></li>
                  <li><a href="https://support.microsoft.com/fr-fr/microsoft-edge/supprimer-les-cookies-dans-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-tekki-blue hover:underline">Microsoft Edge</a></li>
                </ul>
              </div>
            </div>

            {/* 11. Modifications */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-tekki-blue mb-4 flex items-center">
                <span className="w-8 h-8 bg-tekki-blue text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">11</span>
                Modifications de la politique
              </h2>
              <div className="pl-11 text-gray-700 leading-relaxed">
                <p className="mb-4">
                  TEKKI Studio se réserve le droit de modifier la présente politique de confidentialité à tout moment pour refléter les évolutions légales, réglementaires ou de nos pratiques.
                </p>
                <p className="mb-4">
                  En cas de modification substantielle, nous vous en informerons par email ou via un avis visible sur le site.
                </p>
                <p>
                  Nous vous encourageons à consulter régulièrement cette page pour prendre connaissance des éventuelles modifications.
                </p>
              </div>
            </div>

            {/* 12. Réclamation */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-tekki-blue mb-4 flex items-center">
                <span className="w-8 h-8 bg-tekki-blue text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">12</span>
                Droit de réclamation
              </h2>
              <div className="pl-11 text-gray-700 leading-relaxed">
                <p className="mb-4">
                  Si vous estimez que le traitement de vos données personnelles porte atteinte à vos droits, vous avez le droit d'introduire une réclamation auprès de l'autorité de protection des données compétente au Sénégal ou dans votre pays de résidence.
                </p>
                <p>
                  Nous vous encourageons toutefois à nous contacter en premier lieu afin que nous puissions répondre à vos préoccupations.
                </p>
              </div>
            </div>

            {/* Contact */}
            <div className="mt-16 p-8 bg-gradient-to-r from-tekki-blue/5 to-tekki-coral/5 rounded-xl border border-tekki-blue/10">
              <div className="flex items-start gap-4">
                <Shield className="w-6 h-6 text-tekki-blue flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-tekki-blue mb-3">Questions sur la confidentialité ?</h3>
                  <p className="text-gray-700 mb-4">
                    Pour toute question concernant cette politique de confidentialité ou le traitement de vos données personnelles, contactez-nous :
                  </p>
                  <p className="text-gray-700">
                    Email : <a href="mailto:hello@tekkistudio.com" className="text-tekki-blue hover:underline font-semibold">hello@tekkistudio.com</a>
                  </p>
                </div>
              </div>
            </div>

            {/* Date de mise à jour */}
            <div className="mt-8 text-center text-sm text-gray-500">
              <p>Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>

          </div>
        </Container>
      </section>
    </main>
  );
};

export default PolitiqueConfidentialitePage;
