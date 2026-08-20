import { ParallaxBg } from "../ParallaxBg";

export function AboutHero() {
  return (
    <section className="relative flex items-end overflow-hidden bg-[#1a0a0a]" style={{ height: "60vh" }}>

      <ParallaxBg src="/about-bg.jpg" overlay="rgba(10, 10, 10, 0.65)" />

      {/* Content */}
      <div className="relative z-10 w-full px-[10%] pb-16 flex flex-col gap-3">
        <p className="text-zinc-400 text-xs tracking-[0.3em] uppercase">
          — CORTES DE PRIMER NIVEL
        </p>
        <h1
          className="font-display font-black uppercase text-white"
          style={{ fontSize: "clamp(3.5rem, 8vw, 8rem)", lineHeight: 0.9 }}
        >
          ABOUT
        </h1>
      </div>

    </section>
  );
}
