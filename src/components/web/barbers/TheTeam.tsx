const BARBERS = [
  {
    name: "AMADO CÁCERES",
    specialty: "ESPECIALISTA EN CORTE",
    description:
      "Barbero con años de experiencia, especializado en cortes modernos y clásicos.",
  },
  {
    name: "LUCAS FRENCHI",
    specialty: "ESPECIALISTA EN BARBA",
    description:
      "Apasionado por el detalle, experto en arreglo y perfilado de barba.",
  },
];

export function TheTeam() {
  return (
    <section className="bg-zinc-950 text-white py-24 px-[10%]">
      <div className="max-w-6xl mx-auto flex flex-col gap-16">

        {/* Header */}
        <div className="flex flex-col gap-4">
          <h2
            className="font-black uppercase text-white"
            style={{ fontSize: "clamp(2.5rem, 5vw, 5rem)", lineHeight: 0.95 }}
          >
            THE TEAM
          </h2>
          <p className="text-zinc-400 text-xs tracking-[0.25em] uppercase">
            — TODOS AMAMOS LO QUE HACEMOS
          </p>
          <p className="text-zinc-400 text-sm leading-relaxed max-w-lg mt-2">
            Nuestro equipo de profesionales está comprometido con brindarte la mejor experiencia.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 max-w-2xl">
          {BARBERS.map(({ name, specialty, description }) => (
            <div key={name} className="flex flex-col gap-4">
              <div className="bg-zinc-800 w-full aspect-[3/4]" />
              <div className="flex flex-col gap-1 pb-5 border-b border-zinc-700">
                <p className="text-[var(--color-accent)] text-[10px] tracking-widest uppercase font-semibold">
                  {specialty}
                </p>
                <p className="text-white text-sm font-bold uppercase tracking-wide">
                  {name}
                </p>
                <p className="text-zinc-500 text-xs leading-relaxed mt-1">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
