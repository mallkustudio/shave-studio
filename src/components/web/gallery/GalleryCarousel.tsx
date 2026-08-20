"use client";

import { useState } from "react";
import { AnimatedLine } from "../AnimatedLine";

interface GalleryCarouselProps {
  title: string;
  subtitle: string;
  images: string[];
}

function ChevronLeft() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

export function GalleryCarousel({ title, subtitle, images }: GalleryCarouselProps) {
  const [index, setIndex] = useState(0);
  const n = images.length;

  const prev = () => setIndex((i) => (i - 1 + n) % n);
  const next = () => setIndex((i) => (i + 1) % n);

  const visibleDesktop = [0, 1, 2].map((offset) => images[(index + offset) % n]);
  const visibleMobile = images[index];

  function Item({ src }: { src: string }) {
    return src ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt="" className="w-full aspect-[3/4] object-cover" />
    ) : (
      <div className="bg-zinc-800 aspect-[3/4] w-full" />
    );
  }

  return (
    <section className="bg-zinc-950 text-white py-20 px-[10%]">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">

        {/* Header */}
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

        {/* Carousel */}
        <div className="flex items-center gap-4">
          <button
            onClick={prev}
            aria-label="Anterior"
            className="shrink-0 text-white hover:text-[var(--color-accent)] transition-colors duration-150"
          >
            <ChevronLeft />
          </button>

          {/* Mobile: 1 visible */}
          <div className="flex-1 md:hidden">
            <Item src={visibleMobile} />
          </div>

          {/* Desktop: 3 visible */}
          <div className="flex-1 hidden md:grid grid-cols-3 gap-4">
            {visibleDesktop.map((src, i) => (
              <Item key={i} src={src} />
            ))}
          </div>

          <button
            onClick={next}
            aria-label="Siguiente"
            className="shrink-0 text-white hover:text-[var(--color-accent)] transition-colors duration-150"
          >
            <ChevronRight />
          </button>
        </div>

      </div>
    </section>
  );
}
