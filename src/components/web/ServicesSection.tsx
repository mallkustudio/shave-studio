import Link from "next/link";
import { FadeIn } from "./FadeIn";
import { TextReveal } from "./TextReveal";
import { AnimatedLine } from "./AnimatedLine";

const SERVICES = [
  {
    name: "CORTE",
    description: "Corte de cabello profesional a medida",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="6" cy="6" r="3" />
        <circle cx="6" cy="18" r="3" />
        <line x1="20" y1="4" x2="8.12" y2="15.88" />
        <line x1="14.47" y1="14.48" x2="20" y2="20" />
        <line x1="8.12" y1="8.12" x2="12" y2="12" />
      </svg>
    ),
  },
  {
    name: "CORTE Y BARBA",
    description: "La combinación perfecta, corte y arreglo de barba",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="6" cy="6" r="3" />
        <circle cx="6" cy="18" r="3" />
        <line x1="20" y1="4" x2="8.12" y2="15.88" />
        <line x1="14.47" y1="14.48" x2="20" y2="20" />
        <line x1="8.12" y1="8.12" x2="12" y2="12" />
      </svg>
    ),
  },
  {
    name: "BARBA",
    description: "Arreglo y perfilado de barba profesional",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M5 3h14a1 1 0 0 1 1 1v2H4V4a1 1 0 0 1 1-1z" />
        <path d="M4 6l1.5 12a1 1 0 0 0 1 .9h11a1 1 0 0 0 1-.9L20 6" />
        <line x1="9" y1="11" x2="15" y2="11" />
      </svg>
    ),
  },
];

export function ServicesSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#1a0a0a]">

      {/* Background image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/services-bg.jpg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      {/* Overlay */}
      <div className="absolute inset-0" style={{ backgroundColor: "rgba(10, 10, 10, 0.72)" }} />

      {/* Content */}
      <div className="relative z-10 w-full py-24 px-[10%]">
        <FadeIn>
          <div className="max-w-[600px] flex flex-col gap-8">

            <AnimatedLine className="-mt-4" />

            {/* Title */}
            <div className="flex flex-col gap-2">
              <h2
                className="font-display font-black uppercase text-white"
                style={{ fontSize: "clamp(2.5rem, 5vw, 5rem)", lineHeight: 0.95 }}
              >
                <TextReveal text="SERVICIOS" />
              </h2>
              <p className="text-zinc-400 text-xs tracking-[0.25em] uppercase">
                — ORGULLO EN CADA SERVICIO
              </p>
            </div>

            {/* Services list */}
            <ul className="flex flex-col gap-6 mt-2">
              {SERVICES.map(({ name, description, icon }) => (
                <li key={name} className="flex items-start gap-4">
                  <span className="mt-0.5 text-[var(--color-accent)] shrink-0">{icon}</span>
                  <div className="flex flex-col gap-0.5">
                    <p className="text-white text-sm font-bold tracking-widest uppercase">{name}</p>
                    <p className="text-zinc-400 text-sm leading-relaxed">{description}</p>
                  </div>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <div className="mt-2">
              <Link
                href="/reservas"
                className="inline-block border border-white text-white text-xs font-semibold tracking-widest uppercase px-8 py-3 transition-all duration-200 hover:bg-white hover:text-black"
              >
                RESERVAR UN TURNO
              </Link>
            </div>

          </div>
        </FadeIn>
      </div>
    </section>
  );
}
