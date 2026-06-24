import { AboutHero } from "@/components/web/about/AboutHero";
import { WhoWeAre } from "@/components/web/about/WhoWeAre";
import { AboutServices } from "@/components/web/about/AboutServices";

export default function AboutPage() {
  return (
    <main>
      <AboutHero />
      <WhoWeAre />
      <AboutServices />
    </main>
  );
}
