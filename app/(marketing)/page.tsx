// app/(marketing)/page.tsx
import HeroV2 from '@/app/components/home/v2/HeroV2';
import LogosV2 from '@/app/components/home/v2/LogosV2';
import EmpathySection from '@/app/components/home/v2/EmpathySection';
import CaseStudiesV2 from '@/app/components/home/v2/CaseStudiesV2';
import TestimonialsV2 from '@/app/components/home/v2/TestimonialsV2';
import SkinInTheGameSection from '@/app/components/home/v2/SkinInTheGameSection';
import ServicesSection from '@/app/components/home/v2/ServicesSection';
import FAQV2 from '@/app/components/home/v2/FAQV2';
import CTAFinalSection from '@/app/components/home/v2/CTAFinalSection';

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
