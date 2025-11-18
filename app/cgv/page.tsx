// app/cgv/page.tsx
'use client';

import React from 'react';
import { FileText, CheckCircle, AlertCircle } from 'lucide-react';
import Container from '@/app/components/ui/Container';

const CGVPage = () => {
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
            <FileText className="w-16 h-16 mx-auto mb-6" />
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Conditions Générales de Vente
            </h1>
            <p className="text-xl opacity-90">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </Container>
      </section>

      {/* Content Section */}
      <section className="py-16 bg-white">
        <Container>
          <div className="max-w-4xl mx-auto prose prose-lg">
            {/* Article 1 */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-tekki-blue mb-4 flex items-center">
                <span className="w-8 h-8 bg-tekki-blue text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">1</span>
                Objet
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles entre TEKKI Studio, ci-après dénommé "le Prestataire", et toute personne physique ou morale, ci-après dénommée "le Client", souhaitant bénéficier des services proposés par TEKKI Studio.
              </p>
              <p className="text-gray-700 leading-relaxed">
                TEKKI Studio propose des services de création et d'accompagnement e-commerce pour les marques africaines, incluant la conception de sites web, le développement de stratégies marketing, et l'accompagnement à la croissance digitale.
              </p>
            </div>

            {/* Article 2 */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-tekki-blue mb-4 flex items-center">
                <span className="w-8 h-8 bg-tekki-blue text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">2</span>
                Acceptation des CGV
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Toute commande de services implique l'acceptation sans réserve des présentes CGV. Le Client reconnaît avoir pris connaissance des présentes CGV et les accepter expressément.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Le Prestataire se réserve le droit de modifier ses CGV à tout moment. Les CGV applicables sont celles en vigueur à la date de la commande.
              </p>
            </div>

            {/* Article 3 */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-tekki-blue mb-4 flex items-center">
                <span className="w-8 h-8 bg-tekki-blue text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">3</span>
                Services proposés
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                TEKKI Studio propose les services suivants :
              </p>
              <ul className="space-y-3 mb-4">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5 mr-2" />
                  <span className="text-gray-700">Formule Audit de Départ : Analyse complète de la marque et recommandations stratégiques</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5 mr-2" />
                  <span className="text-gray-700">Formule Démarrage : Création de site e-commerce et lancement digital</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5 mr-2" />
                  <span className="text-gray-700">Formule Croissance : Accompagnement sur 3 mois pour doubler les ventes</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5 mr-2" />
                  <span className="text-gray-700">Formule Expansion : Stratégie d'expansion internationale sur 6-12 mois</span>
                </li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                Les détails de chaque formule sont disponibles sur notre site web et peuvent être personnalisés selon les besoins spécifiques du Client.
              </p>
            </div>

            {/* Article 4 */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-tekki-blue mb-4 flex items-center">
                <span className="w-8 h-8 bg-tekki-blue text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">4</span>
                Commande et devis
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Toute prestation débute par un appel de découverte gratuit permettant d'établir un devis personnalisé. Le devis est valable pendant 30 jours à compter de sa date d'émission.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                La commande est considérée comme ferme et définitive après :
              </p>
              <ul className="space-y-2 mb-4">
                <li className="flex items-start">
                  <span className="text-tekki-coral mr-2">•</span>
                  <span className="text-gray-700">Signature du devis par le Client</span>
                </li>
                <li className="flex items-start">
                  <span className="text-tekki-coral mr-2">•</span>
                  <span className="text-gray-700">Réception du paiement selon les modalités convenues</span>
                </li>
              </ul>
            </div>

            {/* Article 5 */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-tekki-blue mb-4 flex items-center">
                <span className="w-8 h-8 bg-tekki-blue text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">5</span>
                Tarifs et modalités de paiement
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Les prix sont indiqués en Francs CFA (XOF) et sont valables au jour de la commande. Ils peuvent être révisés en cas de modification des conditions économiques.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>Modalités de paiement :</strong>
              </p>
              <ul className="space-y-3 mb-4">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-tekki-blue flex-shrink-0 mt-0.5 mr-2" />
                  <span className="text-gray-700"><strong>Formule Audit de Départ :</strong> Paiement intégral à la commande</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-tekki-blue flex-shrink-0 mt-0.5 mr-2" />
                  <span className="text-gray-700"><strong>Formule Démarrage :</strong> 60% à la commande, 40% à la livraison</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-tekki-blue flex-shrink-0 mt-0.5 mr-2" />
                  <span className="text-gray-700"><strong>Formules Croissance et Expansion :</strong> Paiement mensuel selon l'échéancier convenu</span>
                </li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                Les moyens de paiement acceptés sont : virement bancaire, Mobile Money (Wave, Orange Money, Free Money), et Stripe pour les paiements internationaux.
              </p>
            </div>

            {/* Article 6 */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-tekki-blue mb-4 flex items-center">
                <span className="w-8 h-8 bg-tekki-blue text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">6</span>
                Délais de réalisation
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Les délais de réalisation sont fixés dans le devis et peuvent varier selon la formule choisie :
              </p>
              <ul className="space-y-2 mb-4">
                <li className="flex items-start">
                  <span className="text-tekki-coral mr-2">•</span>
                  <span className="text-gray-700"><strong>Audit de Départ :</strong> 7 jours ouvrés</span>
                </li>
                <li className="flex items-start">
                  <span className="text-tekki-coral mr-2">•</span>
                  <span className="text-gray-700"><strong>Démarrage :</strong> 7 à 15 jours ouvrés</span>
                </li>
                <li className="flex items-start">
                  <span className="text-tekki-coral mr-2">•</span>
                  <span className="text-gray-700"><strong>Croissance :</strong> 3 mois</span>
                </li>
                <li className="flex items-start">
                  <span className="text-tekki-coral mr-2">•</span>
                  <span className="text-gray-700"><strong>Expansion :</strong> 6 à 12 mois</span>
                </li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                Ces délais sont indicatifs et peuvent être ajustés en fonction de la complexité du projet et de la réactivité du Client dans la fourniture des éléments nécessaires.
              </p>
            </div>

            {/* Article 7 */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-tekki-blue mb-4 flex items-center">
                <span className="w-8 h-8 bg-tekki-blue text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">7</span>
                Obligations du Client
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Le Client s'engage à :
              </p>
              <ul className="space-y-3 mb-4">
                <li className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-tekki-coral flex-shrink-0 mt-0.5 mr-2" />
                  <span className="text-gray-700">Fournir tous les éléments nécessaires à la réalisation de la prestation dans les délais convenus</span>
                </li>
                <li className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-tekki-coral flex-shrink-0 mt-0.5 mr-2" />
                  <span className="text-gray-700">Répondre aux sollicitations du Prestataire dans un délai de 48 heures ouvrées</span>
                </li>
                <li className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-tekki-coral flex-shrink-0 mt-0.5 mr-2" />
                  <span className="text-gray-700">Garantir qu'il dispose des droits nécessaires sur tous les contenus fournis</span>
                </li>
                <li className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-tekki-coral flex-shrink-0 mt-0.5 mr-2" />
                  <span className="text-gray-700">Effectuer les paiements selon l'échéancier convenu</span>
                </li>
              </ul>
            </div>

            {/* Article 8 */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-tekki-blue mb-4 flex items-center">
                <span className="w-8 h-8 bg-tekki-blue text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">8</span>
                Propriété intellectuelle
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Les créations réalisées par TEKKI Studio (site web, contenus, designs, etc.) restent la propriété du Prestataire jusqu'au paiement intégral du prix convenu.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Une fois le paiement intégral effectué, les droits d'exploitation sont cédés au Client pour l'usage convenu. Le Prestataire conserve le droit d'utiliser les réalisations à des fins de promotion de ses services (portfolio, études de cas).
              </p>
            </div>

            {/* Article 9 */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-tekki-blue mb-4 flex items-center">
                <span className="w-8 h-8 bg-tekki-blue text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">9</span>
                Garanties et responsabilités
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                TEKKI Studio s'engage à mettre en œuvre tous les moyens nécessaires pour fournir des services de qualité conformes aux standards professionnels.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Le Prestataire garantit :
              </p>
              <ul className="space-y-2 mb-4">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5 mr-2" />
                  <span className="text-gray-700">La conformité des livrables aux spécifications du devis accepté</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5 mr-2" />
                  <span className="text-gray-700">Un accompagnement professionnel et personnalisé</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5 mr-2" />
                  <span className="text-gray-700">Le respect de la confidentialité des informations communiquées</span>
                </li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                La responsabilité du Prestataire ne saurait être engagée en cas de force majeure ou de fait indépendant de sa volonté.
              </p>
            </div>

            {/* Article 10 */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-tekki-blue mb-4 flex items-center">
                <span className="w-8 h-8 bg-tekki-blue text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">10</span>
                Annulation et résiliation
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>Annulation par le Client :</strong> En cas d'annulation après signature du devis, les sommes déjà versées restent acquises au Prestataire au titre des frais engagés.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>Résiliation :</strong> En cas de manquement grave de l'une des parties à ses obligations, l'autre partie peut résilier le contrat de plein droit après mise en demeure restée sans effet pendant 15 jours.
              </p>
            </div>

            {/* Article 11 */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-tekki-blue mb-4 flex items-center">
                <span className="w-8 h-8 bg-tekki-blue text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">11</span>
                Droit applicable et litiges
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Les présentes CGV sont soumises au droit sénégalais. En cas de litige, les parties s'efforceront de trouver une solution amiable avant toute action judiciaire.
              </p>
              <p className="text-gray-700 leading-relaxed">
                À défaut d'accord amiable, le litige sera porté devant les tribunaux compétents de Dakar, Sénégal.
              </p>
            </div>

            {/* Contact */}
            <div className="bg-gray-50 rounded-xl p-8 mt-12">
              <h3 className="text-xl font-bold text-tekki-blue mb-4">Contact</h3>
              <p className="text-gray-700 mb-2">
                Pour toute question concernant nos CGV, vous pouvez nous contacter :
              </p>
              <ul className="space-y-2 text-gray-700">
                <li><strong>Email :</strong> hello@tekkistudio.com</li>
                <li><strong>WhatsApp :</strong> +221 78 136 27 28</li>
                <li><strong>Adresse :</strong> Dakar, Sénégal</li>
              </ul>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
};

export default CGVPage;
