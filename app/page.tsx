import HeroSection from './components/home/Hero';
import WhyTekkiStudio from './components/home/WhyTekkiStudio';
import HowItWorks from './components/home/HowItWorks';
import AvailableBusinesses from './components/home/AvailableBusinesses';
import BrandShowcase from './components/home/BrandShowcase';
import Testimonials from './components/home/Testimonials';
import FAQ from './components/home/FAQ';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <AvailableBusinesses />
      <HowItWorks />
      <WhyTekkiStudio />
      <BrandShowcase />
  {/*
      <Testimonials />
      */}
      <FAQ />
    </main>
  );
}