import Link from "next/link";
import { ParallaxBg } from "./ParallaxBg";

export function HeroSection() {
  return (
    <section className="relative h-screen flex items-center overflow-hidden bg-[#1a0a0a]">

      <ParallaxBg src="/hero-bg.jpg" overlay="rgba(20, 10, 10, 0.55)" />

      {/* Content */}
      <div className="relative z-10 w-full px-[10%] pt-16 md:pt-24 pb-20 flex flex-col gap-6">

        {/* Title */}
        <h1
          className="font-display font-black uppercase text-white"
          style={{ fontSize: "clamp(3rem, 7vw, 7rem)", lineHeight: 0.9 }}
        >
          <span className="block">SHAVE</span>
          <span className="block">STUDIO</span>
          <span className="block">PREMIUM</span>
          <span className="block">BARBERSHOP</span>
        </h1>

        {/* Quote */}
        <blockquote className="max-w-[380px] pl-4 border-l-2 border-white/30 mt-2">
          <p className="text-[0.85rem] tracking-widest uppercase text-white/70 leading-relaxed">
            &ldquo;SI SEGUÍS CAMINANDO FRENTE A LA BARBERÍA,
            EVENTUALMENTE VAS A NECESITAR UN CORTE.&rdquo;
          </p>
        </blockquote>

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
    </section>
  );
}
