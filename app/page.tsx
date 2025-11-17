// app/page.tsx
import React from 'react';
import HeroSection from './components/home/Hero';
import LogosClients from './components/home/LogosClients';
import ProblemSection from './components/home/ProblemSection';
import SolutionSection from './components/home/SolutionSection';
import OurBrandsSection from './components/home/OurBrands';
import ProcessSection from './components/home/Process';
import FormulasSection from './components/home/Formulas';
import Testimonials from './components/home/Testimonials';
import WhyTekkiStudio from './components/home/WhyTekkiStudio';
import CTASection from './components/home/CTASection';
import FAQ from './components/home/FAQ';

export default function Home() {
  return (
    <main className="overflow-x-hidden">
      {/* 1. Hero - Proposition de valeur principale */}
      <HeroSection />
      
      {/* 2. Logos Clients - Preuve sociale immédiate */}
      <LogosClients />
      
      {/* 3. Problème - Identification des douleurs de l'ICP */}
      <ProblemSection />
      
      {/* 4. Solution - Comment TEKKI Studio résout ces problèmes */}
      <SolutionSection />
      
      {/* 5. Nos Marques - Preuve que nos stratégies fonctionnent */}
      <OurBrandsSection />
      
      {/* 6. Process - Comment nous travaillons ensemble */}
      <ProcessSection />
      
      {/* 7. Formules - Les offres avec approche "à partir de" */}
      <FormulasSection />
      
      {/* 8. Témoignages - Validation sociale forte */}
      <Testimonials />
      
      {/* 9. Différenciation - Pourquoi choisir TEKKI Studio */}
      <WhyTekkiStudio />
      
      {/* 10. CTA Section - Appel à l'action principal */}
      <CTASection />
      
      {/* 11. FAQ - Lever les dernières objections */}
      <FAQ />
    </main>
  );
}