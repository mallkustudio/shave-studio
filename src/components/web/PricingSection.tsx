import Link from "next/link";

const PRICING = [
  { service: "Corte", price: "$26.000" },
  { service: "Corte y Barba", price: "$32.000" },
  { service: "Barba", price: "$17.000" },
];

export function PricingSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#1a0a0a]">

      {/* Background image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/pricing-bg.jpg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      {/* Overlay — tinte más rojizo */}
      <div className="absolute inset-0" style={{ backgroundColor: "rgba(10, 10, 10, 0.55)" }} />

      {/* Content — left ~55% */}
      <div className="relative z-10 w-full py-24 px-[10%]">
        <div className="max-w-[520px] flex flex-col gap-8">

          {/* Red separator */}
          <div className="w-10 h-0.5 bg-[var(--color-accent)] -mt-4" />

          {/* Title */}
          <div className="flex flex-col gap-2">
            <h2
              className="font-black uppercase text-white"
              style={{ fontSize: "clamp(2.5rem, 5vw, 5rem)", lineHeight: 0.95 }}
            >
              PRECIOS
            </h2>
            <p className="text-zinc-400 text-xs tracking-[0.25em] uppercase">
              — LA MEJOR EXPERIENCIA
            </p>
          </div>

          {/* Description */}
          <p className="text-zinc-400 text-sm leading-relaxed -mt-2">
            Precios transparentes, calidad garantizada.
          </p>

          {/* Pricing list */}
          <ul className="flex flex-col gap-0 mt-2 border-t border-zinc-800">
            {PRICING.map(({ service, price }) => (
              <li
                key={service}
                className="flex items-center justify-between gap-4 py-4 border-b border-zinc-800"
              >
                <span className="text-white text-sm font-medium uppercase tracking-wide">
                  {service}
                </span>
                <div className="flex-1 mx-4 border-b border-dotted border-zinc-700" />
                <span className="text-[var(--color-accent)] font-semibold text-sm shrink-0">
                  {price}
                </span>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <div className="mt-2">
            <Link
              href="/reservas"
              className="inline-block border border-white text-white text-xs font-semibold tracking-widest uppercase px-8 py-3 transition-all duration-200 hover:bg-white hover:text-black"
            >
              RESERVAR
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
