// app/page.tsx
import React from 'react';
import HeroSection from './components/home/Hero';
import BusinessTypes from './components/home/BusinessTypes';
import FeaturedBusinesses from './components/home/FeaturedBusinesses';
import WhyTekkiStudio from './components/home/WhyTekkiStudio';
import HowItWorks from './components/home/HowItWorks';
import AcquisitionOptions from './components/home/AcquisitionOptions';
import Testimonials from './components/home/Testimonials';
import FAQ from './components/home/FAQ';
import CTASection from './components/home/CTASection';

export default function Home() {
  return (
    <main className="overflow-x-hidden">
      <HeroSection />
      <BusinessTypes />
      <FeaturedBusinesses />
      <WhyTekkiStudio />
      <HowItWorks />
      <AcquisitionOptions />
      <Testimonials />
      <FAQ />
      <CTASection />
    </main>
  );
}