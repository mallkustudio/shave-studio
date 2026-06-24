"use client";

import { useState } from "react";

const SECTIONS = [
  { id: "cortes", title: "CORTES", subtitle: "— CORTES DE PRIMER NIVEL", count: 4 },
  { id: "barba", title: "BARBA", subtitle: "— NUNCA PASA DE MODA", count: 4 },
];

const CAROUSEL_ITEMS = 6;
const VISIBLE = 3;

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="w-10 h-0.5 bg-[var(--color-accent)]" />
      <h2
        className="font-black uppercase text-white"
        style={{ fontSize: "clamp(2rem, 3.5vw, 3.5rem)", lineHeight: 0.95 }}
      >
        {title}
      </h2>
      <p className="text-zinc-400 text-xs tracking-[0.25em] uppercase">{subtitle}</p>
    </div>
  );
}

export function GalleryGrid() {
  const [carouselStart, setCarouselStart] = useState(0);

  return (
    <section className="bg-zinc-950 text-white py-24 px-[10%]">
      <div className="max-w-6xl mx-auto flex flex-col gap-20">

        {/* Static grid sections */}
        {SECTIONS.map(({ id, title, subtitle, count }) => (
          <div key={id} className="flex flex-col gap-8">
            <SectionHeader title={title} subtitle={subtitle} />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="bg-zinc-800 aspect-square w-full" />
              ))}
            </div>
          </div>
        ))}

        {/* Carousel section — BIGOTE */}
        <div className="flex flex-col gap-8">
          <SectionHeader title="BIGOTE" subtitle="— LA ELECCIÓN CLÁSICA" />

          <div className="flex items-center gap-4">
            {/* Left arrow */}
            <button
              onClick={() => setCarouselStart((s) => Math.max(0, s - 1))}
              disabled={carouselStart === 0}
              aria-label="Anterior"
              className="shrink-0 text-white disabled:text-zinc-700 transition-colors duration-150 hover:text-[var(--color-accent)]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            {/* Visible items */}
            <div className="flex-1 grid grid-cols-3 gap-3 overflow-hidden">
              {Array.from({ length: CAROUSEL_ITEMS })
                .slice(carouselStart, carouselStart + VISIBLE)
                .map((_, i) => (
                  <div key={carouselStart + i} className="bg-zinc-800 aspect-[3/4] w-full" />
                ))}
            </div>

            {/* Right arrow */}
            <button
              onClick={() => setCarouselStart((s) => Math.min(CAROUSEL_ITEMS - VISIBLE, s + 1))}
              disabled={carouselStart >= CAROUSEL_ITEMS - VISIBLE}
              aria-label="Siguiente"
              className="shrink-0 text-white disabled:text-zinc-700 transition-colors duration-150 hover:text-[var(--color-accent)]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
