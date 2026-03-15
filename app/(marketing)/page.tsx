import dynamic from 'next/dynamic';
import HeroV2 from '@/app/components/home/v2/HeroV2';
import LogosV2 from '@/app/components/home/v2/LogosV2';

// Sections below-fold chargées en différé pour réduire le JS initial
const EmpathySection = dynamic(() => import('@/app/components/home/v2/EmpathySection'));
const CaseStudiesV2 = dynamic(() => import('@/app/components/home/v2/CaseStudiesV2'));
const TestimonialsV2 = dynamic(() => import('@/app/components/home/v2/TestimonialsV2'));
const SkinInTheGameSection = dynamic(() => import('@/app/components/home/v2/SkinInTheGameSection'));
const ServicesSection = dynamic(() => import('@/app/components/home/v2/ServicesSection'));
const FAQV2 = dynamic(() => import('@/app/components/home/v2/FAQV2'));
const CTAFinalSection = dynamic(() => import('@/app/components/home/v2/CTAFinalSection'));

export default function Home() {
  return (
    <main className="overflow-x-hidden bg-tekki-cream min-h-screen">
      <HeroV2 />
      <LogosV2 />
      <EmpathySection />
      <CaseStudiesV2 />
      <TestimonialsV2 />
      <SkinInTheGameSection />
      <ServicesSection />
      <FAQV2 />
      <CTAFinalSection />
    </main>
  );
}
