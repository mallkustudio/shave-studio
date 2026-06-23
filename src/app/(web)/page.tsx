import { HeroSection } from "@/components/web/HeroSection";
import { ServicesSection } from "@/components/web/ServicesSection";
import { PricingSection } from "@/components/web/PricingSection";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <ServicesSection />
      <PricingSection />
    </main>
  );
}
