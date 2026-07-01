import Link from "next/link";

const SERVICES = [
  {
    name: "CORTE",
    description: "Corte de cabello profesional a medida, con tijera y acabado con navaja.",
  },
  {
    name: "CORTE Y BARBA",
    description: "La combinación perfecta: corte de cabello más arreglo y perfilado de barba.",
  },
  {
    name: "BARBA",
    description: "Arreglo y perfilado de barba profesional con productos de primera calidad.",
  },
];

export function AboutServices() {
  return (
    <section className="bg-zinc-900 text-white py-24 px-[10%]">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-16">

        {/* Left column — images */}
        <div className="md:w-1/2 flex flex-col gap-4 shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/services-bg.jpg"
            alt="Barbero en acción"
            className="w-full h-72 object-cover object-center"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/pricing-bg.jpg"
            alt="Afeitado con navaja"
            className="w-full h-72 object-cover object-center"
          />
        </div>

        {/* Right column — content */}
        <div className="md:w-1/2 flex flex-col gap-7">
          <div className="w-10 h-0.5 bg-[var(--color-accent)]" />

          <div className="flex flex-col gap-2">
            <h2
              className="font-black uppercase text-white"
              style={{ fontSize: "clamp(2rem, 3.5vw, 3.5rem)", lineHeight: 0.95 }}
            >
              SERVICIOS
            </h2>
            <p className="text-zinc-400 text-xs tracking-[0.25em] uppercase">
              — ORGULLO EN CADA SERVICIO
            </p>
          </div>

          <p className="text-zinc-400 text-sm leading-relaxed">
            Cada servicio está pensado para darte la mejor versión de vos mismo,
            con técnica profesional y atención personalizada.
          </p>

          <ul className="flex flex-col gap-5">
            {SERVICES.map(({ name, description }) => (
              <li key={name} className="flex flex-col gap-1 border-t border-zinc-800 pt-4">
                <p className="text-white text-xs font-bold tracking-widest uppercase">{name}</p>
                <p className="text-zinc-500 text-xs leading-relaxed">{description}</p>
              </li>
            ))}
          </ul>

          <div className="mt-2">
            <Link
              href="/reservas"
              className="inline-block border border-white text-white text-xs font-semibold tracking-widest uppercase px-8 py-3 transition-all duration-200 hover:bg-white hover:text-black"
            >
              RESERVAR UN TURNO
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
