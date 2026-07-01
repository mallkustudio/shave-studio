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
        images={["/gallery/haircut-1.jpg", "/gallery/haircut-2.jpg", "/gallery/haircut-3.jpg", "/gallery/haircut-4.jpg"]}
        cols={4}
      />
      <GallerySection
        title="BARBA"
        subtitle="— NUNCA PASA DE MODA"
        images={["/gallery/beard-1.jpg", "/gallery/beard-2.jpg", "/gallery/beard-3.jpg", "/gallery/beard-4.jpg"]}
        cols={4}
      />
      <GalleryCarousel
        title="BIGOTE"
        subtitle="— LA ELECCIÓN CLÁSICA"
        images={["/gallery/mustache-1.jpg", "/gallery/mustache-2.jpg", "/gallery/mustache-3.jpg"]}
      />
    </main>
  );
}
