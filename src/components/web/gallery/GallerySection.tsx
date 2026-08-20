import { FadeIn } from "../FadeIn";
import { AnimatedLine } from "../AnimatedLine";

interface GallerySectionProps {
  title: string;
  subtitle: string;
  images: string[];
  cols?: number;
}

export function GallerySection({ title, subtitle, images, cols = 4 }: GallerySectionProps) {
  const gridClass =
    cols === 3
      ? "grid-cols-1 md:grid-cols-3"
      : "grid-cols-2 md:grid-cols-4";

  return (
    <section className="bg-zinc-950 text-white py-20 px-[10%]">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">

        {/* Header */}
        <FadeIn>
          <div className="flex flex-col gap-3">
            <AnimatedLine />
            <h2
              className="font-display font-black uppercase text-white"
              style={{ fontSize: "clamp(2rem, 3.5vw, 3.5rem)", lineHeight: 0.95 }}
            >
              {title}
            </h2>
            <p className="text-zinc-400 text-xs tracking-[0.25em] uppercase">{subtitle}</p>
          </div>
        </FadeIn>

        {/* Grid */}
        <div className={`grid ${gridClass} gap-4`}>
          {images.map((src, i) =>
            src ? (
              <div key={i} className="relative overflow-hidden group cursor-zoom-in">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt=""
                  className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-500" />
              </div>
            ) : (
              <div key={i} className="bg-zinc-800 aspect-square w-full" />
            )
          )}
        </div>

      </div>
    </section>
  );
}
