export function AboutHero() {
  return (
    <section className="relative flex items-end overflow-hidden bg-[#1a0a0a]" style={{ height: "60vh" }}>

      {/* Background image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/about-bg.jpg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      {/* Overlay */}
      <div className="absolute inset-0" style={{ backgroundColor: "rgba(10, 10, 10, 0.65)" }} />

      {/* Content */}
      <div className="relative z-10 w-full px-[10%] pb-16 flex flex-col gap-3">
        <p className="text-zinc-400 text-xs tracking-[0.3em] uppercase">
          — CORTES DE PRIMER NIVEL
        </p>
        <h1
          className="font-black uppercase text-white"
          style={{ fontSize: "clamp(3.5rem, 8vw, 8rem)", lineHeight: 0.9 }}
        >
          ABOUT
        </h1>
      </div>

    </section>
  );
}
