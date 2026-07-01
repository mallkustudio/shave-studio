"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV_LINKS = [
  { href: "/", label: "HOME" },
  { href: "/about", label: "ABOUT" },
  { href: "/barbers", label: "TEAM" },
  { href: "/gallery", label: "GALLERY" },
  { href: "/reservas", label: "RESERVAR" },
];

export function WebNav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const linkClass = (href: string) => {
    const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
    return `font-medium tracking-wide uppercase transition-colors duration-150 ${
      isActive ? "text-[var(--color-accent)]" : "text-white hover:text-[var(--color-accent)]"
    }`;
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-black/80 backdrop-blur-sm" : "bg-transparent"
      }`}
    >
      {/* Mobile: two rows */}
      <div className="flex md:hidden flex-col items-center py-2 px-4 gap-1">
        <Link href="/" className="text-white text-sm font-bold tracking-widest uppercase">
          SHAVE STUDIO
        </Link>
        <ul className="flex items-center gap-3">
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link href={href} className={`text-[10px] ${linkClass(href)}`}>
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Desktop: single row */}
      <div className="hidden md:flex max-w-6xl mx-auto px-6 h-16 items-center justify-between">
        <Link href="/" className="text-white text-sm font-bold tracking-widest uppercase">
          SHAVE STUDIO
        </Link>
        <ul className="flex items-center gap-8">
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link href={href} className={`text-xs ${linkClass(href)}`}>
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
