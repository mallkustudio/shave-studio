"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedLineProps {
  className?: string;
}

export function AnimatedLine({ className = "" }: AnimatedLineProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        height: "2px",
        width: visible ? "40px" : "0px",
        backgroundColor: "var(--color-accent)",
        transition: "width 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    />
  );
}
