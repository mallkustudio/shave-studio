import { ParallaxBg } from "../ParallaxBg";

export function BarbersHero() {
  return (
    <section className="relative flex items-end overflow-hidden bg-[#1a0a0a]" style={{ height: "60vh" }}>

      <ParallaxBg src="/barbers-bg.jpg" overlay="rgba(10, 10, 10, 0.65)" />

      <div className="relative z-10 w-full px-[10%] pb-16 flex flex-col gap-3">
        <p className="text-zinc-400 text-xs tracking-[0.3em] uppercase">
          — CONOCÉ A NUESTRO EQUIPO
        </p>
        <h1
          className="font-display font-black uppercase text-white"
          style={{ fontSize: "clamp(3.5rem, 8vw, 8rem)", lineHeight: 0.9 }}
        >
          THE TEAM
        </h1>
      </div>

    </section>
  );
}
