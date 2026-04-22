import MainLayout from "@/components/layout/public/PublicLayout";
import HeroSection from "@/components/home/HeroSection";
import ServiceIntroSection from "@/components/home/ServiceIntroSection";
import FeatureSection from "@/components/home/FeatureSection";
import ProcessSection from "@/components/home/ProcessSection";
import CTASection from "@/components/home/CTASection";

export default function Home() {
  return (
    <MainLayout>
      <HeroSection />
      <ServiceIntroSection />
      <FeatureSection />
      <ProcessSection />
      <CTASection />
    </MainLayout>
  );
}