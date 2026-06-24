import { GalleryHero } from "@/components/web/gallery/GalleryHero";
import { GallerySection } from "@/components/web/gallery/GallerySection";
import { GalleryCarousel } from "@/components/web/gallery/GalleryCarousel";

export default function GalleryPage() {
  return (
    <main>
      <GalleryHero />
      <GallerySection
        title="CORTES"
        subtitle="— CORTES DE PRIMER NIVEL"
        images={["", "", "", ""]}
        cols={4}
      />
      <GallerySection
        title="BARBA"
        subtitle="— NUNCA PASA DE MODA"
        images={["", "", "", ""]}
        cols={4}
      />
      <GalleryCarousel
        title="BIGOTE"
        subtitle="— LA ELECCIÓN CLÁSICA"
        images={["", "", ""]}
      />
    </main>
  );
}
