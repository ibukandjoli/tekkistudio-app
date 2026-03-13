// app/mentions-legales/page.tsx
'use client';

import React from 'react';
import { Scale, Building2, Mail, Phone } from 'lucide-react';
import Container from '@/app/components/ui/Container';

const MentionsLegalesPage = () => {
  return (
    <main className="pb-0">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-tekki-blue to-tekki-coral relative pt-28 pb-20">
        <Container>
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="flex justify-center mb-6">
              <Scale className="w-16 h-16" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Mentions Légales
            </h1>
            <p className="text-xl opacity-90">
              Informations légales et réglementaires
            </p>
          </div>
        </Container>
      </section>

      {/* Contenu */}
      <section className="py-16 bg-white">
        <Container>
          <div className="max-w-4xl mx-auto">

            {/* 1. Éditeur du site */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-tekki-blue mb-4 flex items-center">
                <span className="w-8 h-8 bg-tekki-blue text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">1</span>
                Éditeur du site
              </h2>
              <div className="pl-11 text-gray-700 leading-relaxed">
                <p className="mb-4">
                  Le site web <strong>tekkistudio.com</strong> est édité par :
                </p>
                <div className="bg-gray-50 p-6 rounded-lg mb-4">
                  <p className="mb-2"><strong>Raison sociale : </strong>SHEFA BUSINESS GROUP</p>
                  <p className="mb-2"><strong>Forme juridique :</strong> SARL</p>
                  <p className="mb-2"><strong>Capital social :</strong> 1 000 000 FCFA</p>
                  <p className="mb-2"><strong>Siège social :</strong> Ouest-Foire, Dakar, Sénégal</p>
                  <p className="mb-2"><strong>NINEA :</strong> 011387752</p>
                  <p className="mb-2"><strong>RC :</strong> SN DKR 2023 B 29963</p>
                </div>
                <div className="flex flex-col gap-2 mt-4">
                  <p className="flex items-center">
                    <Mail className="w-5 h-5 mr-2 text-tekki-coral" />
                    <strong>Email :</strong>&nbsp;<a href="mailto:hello@tekkistudio.com" className="text-tekki-blue hover:underline">hello@tekkistudio.com</a>
                  </p>
                  <p className="flex items-center">
                    <Phone className="w-5 h-5 mr-2 text-tekki-coral" />
                    <strong>Téléphone :</strong>&nbsp;+221 78136 27 28
                  </p>
                </div>
              </div>
            </div>

            {/* 2. Directeur de publication */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-tekki-blue mb-4 flex items-center">
                <span className="w-8 h-8 bg-tekki-blue text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">2</span>
                Directeur de publication
              </h2>
              <div className="pl-11 text-gray-700 leading-relaxed">
                <p className="mb-4">
                  Le directeur de la publication du site est <strong>Ibuka Ndjoli</strong>, en qualité de représentant légal de TEKKI Studio.
                </p>
              </div>
            </div>

            {/* 3. Hébergement */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-tekki-blue mb-4 flex items-center">
                <span className="w-8 h-8 bg-tekki-blue text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">3</span>
                Hébergement
              </h2>
              <div className="pl-11 text-gray-700 leading-relaxed">
                <p className="mb-4">
                  Le site web tekkistudio.com est hébergé par :
                </p>
                <div className="bg-gray-50 p-6 rounded-lg mb-4">
                  <p className="mb-2"><strong>Hébergeur :</strong> Vercel Inc.</p>
                  <p className="mb-2"><strong>Adresse :</strong> 340 S Lemon Ave #4133, Walnut, CA 91789, USA</p>
                  <p className="mb-2"><strong>Site web :</strong> <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-tekki-blue hover:underline">https://vercel.com</a></p>
                </div>
              </div>
            </div>

            {/* 4. Propriété intellectuelle */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-tekki-blue mb-4 flex items-center">
                <span className="w-8 h-8 bg-tekki-blue text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">4</span>
                Propriété intellectuelle
              </h2>
              <div className="pl-11 text-gray-700 leading-relaxed">
                <p className="mb-4">
                  L'ensemble de ce site web (structure, textes, logos, images, vidéos, graphismes, etc.) est la propriété exclusive de TEKKI Studio, sauf mention contraire.
                </p>
                <p className="mb-4">
                  Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite, sauf autorisation écrite préalable de TEKKI Studio.
                </p>
                <p className="mb-4">
                  Toute exploitation non autorisée du site ou de l'un quelconque des éléments qu'il contient sera considérée comme constitutive d'une contrefaçon et poursuivie conformément aux dispositions des lois en vigueur.
                </p>
                <p className="mb-4">
                  Les marques et logos présents sur le site sont des marques déposées. Toute reproduction totale ou partielle de ces marques ou de ces logos sans autorisation préalable et écrite de TEKKI Studio est interdite.
                </p>
              </div>
            </div>

            {/* 5. Protection des données personnelles */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-tekki-blue mb-4 flex items-center">
                <span className="w-8 h-8 bg-tekki-blue text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">5</span>
                Protection des données personnelles
              </h2>
              <div className="pl-11 text-gray-700 leading-relaxed">
                <p className="mb-4">
                  TEKKI Studio s'engage à protéger la vie privée de ses utilisateurs et à respecter la réglementation en vigueur concernant la protection des données personnelles.
                </p>
                <p className="mb-4">
                  Pour plus d'informations sur la collecte, le traitement et l'utilisation de vos données personnelles, veuillez consulter notre{' '}
                  <a href="/politique-confidentialite" className="text-tekki-blue hover:underline font-semibold">
                    Politique de Confidentialité
                  </a>.
                </p>
                <p className="mb-4">
                  Conformément à la loi Informatique et Libertés et au Règlement Général sur la Protection des Données (RGPD), vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition aux données personnelles vous concernant.
                </p>
                <p className="mb-4">
                  Pour exercer ces droits, vous pouvez nous contacter à l'adresse :{' '}
                  <a href="mailto:hello@tekkistudio.com" className="text-tekki-blue hover:underline">
                    hello@tekkistudio.com
                  </a>
                </p>
              </div>
            </div>

            {/* 6. Cookies */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-tekki-blue mb-4 flex items-center">
                <span className="w-8 h-8 bg-tekki-blue text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">6</span>
                Cookies
              </h2>
              <div className="pl-11 text-gray-700 leading-relaxed">
                <p className="mb-4">
                  Le site tekkistudio.com utilise des cookies pour améliorer l'expérience utilisateur et analyser le trafic.
                </p>
                <p className="mb-4">
                  Les cookies sont de petits fichiers texte stockés sur votre appareil lorsque vous visitez notre site. Ils nous permettent de :
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>Mémoriser vos préférences de navigation</li>
                  <li>Analyser le trafic et les performances du site</li>
                  <li>Améliorer nos services et votre expérience</li>
                  <li>Mesurer l'efficacité de nos campagnes marketing</li>
                </ul>
                <p className="mb-4">
                  Vous pouvez à tout moment désactiver les cookies dans les paramètres de votre navigateur. Cependant, cela peut affecter certaines fonctionnalités du site.
                </p>
              </div>
            </div>

            {/* 7. Responsabilité */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-tekki-blue mb-4 flex items-center">
                <span className="w-8 h-8 bg-tekki-blue text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">7</span>
                Responsabilité
              </h2>
              <div className="pl-11 text-gray-700 leading-relaxed">
                <p className="mb-4">
                  TEKKI Studio met tout en œuvre pour offrir aux utilisateurs des informations et des outils disponibles et vérifiés, mais ne saurait être tenue responsable des erreurs, d'une absence de disponibilité des informations et/ou de la présence de virus sur son site.
                </p>
                <p className="mb-4">
                  Les informations fournies sur le site tekkistudio.com le sont à titre indicatif et ne sauraient dispenser l'utilisateur d'une analyse complémentaire et personnalisée.
                </p>
                <p className="mb-4">
                  TEKKI Studio ne saurait être tenue responsable de l'interprétation que l'utilisateur pourrait faire des informations contenues sur le site, ni des conséquences de leur utilisation.
                </p>
              </div>
            </div>

            {/* 8. Liens hypertextes */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-tekki-blue mb-4 flex items-center">
                <span className="w-8 h-8 bg-tekki-blue text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">8</span>
                Liens hypertextes
              </h2>
              <div className="pl-11 text-gray-700 leading-relaxed">
                <p className="mb-4">
                  Le site tekkistudio.com peut contenir des liens hypertextes vers d'autres sites internet. TEKKI Studio n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu.
                </p>
                <p className="mb-4">
                  La création de liens hypertextes vers le site tekkistudio.com nécessite l'autorisation préalable et écrite de TEKKI Studio.
                </p>
              </div>
            </div>

            {/* 9. Droit applicable et juridiction */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-tekki-blue mb-4 flex items-center">
                <span className="w-8 h-8 bg-tekki-blue text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">9</span>
                Droit applicable et juridiction
              </h2>
              <div className="pl-11 text-gray-700 leading-relaxed">
                <p className="mb-4">
                  Les présentes mentions légales sont régies par le droit sénégalais.
                </p>
                <p className="mb-4">
                  En cas de litige et à défaut d'accord amiable, les tribunaux de Dakar seront seuls compétents.
                </p>
              </div>
            </div>

            {/* Contact */}
            <div className="mt-16 p-8 bg-gradient-to-r from-tekki-blue/5 to-tekki-coral/5 rounded-xl border border-tekki-blue/10">
              <div className="flex items-start gap-4">
                <Building2 className="w-6 h-6 text-tekki-blue flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-tekki-blue mb-3">Nous contacter</h3>
                  <p className="text-gray-700 mb-4">
                    Pour toute question concernant les mentions légales ou le fonctionnement du site, vous pouvez nous contacter :
                  </p>
                  <div className="flex flex-col gap-2">
                    <p className="flex items-center text-gray-700">
                      <Mail className="w-5 h-5 mr-2 text-tekki-coral" />
                      <a href="mailto:hello@tekkistudio.com" className="text-tekki-blue hover:underline">
                        hello@tekkistudio.com
                      </a>
                    </p>
                  </div>
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

export default MentionsLegalesPage;
