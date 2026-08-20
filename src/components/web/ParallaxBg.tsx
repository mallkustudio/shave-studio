"use client";

import { useEffect, useRef } from "react";

interface ParallaxBgProps {
  src: string;
  overlay: string;
}

export function ParallaxBg({ src, overlay }: ParallaxBgProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    function onScroll() {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const offset = rect.top * 0.4;
      ref.current.style.backgroundPositionY = `calc(50% + ${offset}px)`;
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={ref}
      className="absolute inset-0 bg-cover bg-center will-change-transform"
      style={{ backgroundImage: `url(${src})` }}
    >
      <div className="absolute inset-0" style={{ backgroundColor: overlay }} />
    </div>
  );
}
