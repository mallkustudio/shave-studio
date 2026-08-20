import { FadeIn } from "../FadeIn";
import { TextReveal } from "../TextReveal";
import { AnimatedLine } from "../AnimatedLine";

export function WhoWeAre() {
  return (
    <section className="bg-zinc-950 text-white py-24 px-[10%]">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-16">

        {/* Left column — 45% */}
        <FadeIn delay={0} className="md:w-[45%] shrink-0">
          <div className="flex flex-col gap-5">
            <AnimatedLine />
            <h2
              className="font-display font-black uppercase text-white"
              style={{ fontSize: "clamp(2.5rem, 4vw, 4.5rem)", lineHeight: 0.95 }}
            >
              <TextReveal text="QUIÉNES" />
              <br />
              <TextReveal text="SOMOS" delay={150} />
            </h2>
            <p className="text-zinc-400 text-xs tracking-[0.25em] uppercase">
              — BARBEROS PROFESIONALES
            </p>
          </div>
        </FadeIn>

        {/* Right column — 55% */}
        <FadeIn delay={200} className="md:w-[55%]">
          <div className="flex flex-col gap-8 justify-center">
            <p className="text-zinc-300 text-sm leading-[1.8]">
              Shaves Studio nació con una visión clara: ofrecer una experiencia de barbería
              de primer nivel en el corazón de Palermo. Nuestro equipo de barberos
              profesionales combina técnica, dedicación y pasión por el oficio para
              garantizar que cada cliente salga sintiéndose en su mejor versión.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <p className="text-zinc-500 text-xs leading-relaxed">
                Atendemos con turno previo para garantizar la mejor experiencia
                y el tiempo que merecés.
              </p>
              <p className="text-zinc-500 text-xs leading-relaxed">
                Cada corte es único. Escuchamos lo que querés y lo llevamos
                a cabo con precisión y estilo.
              </p>
            </div>
          </div>
        </FadeIn>

      </div>
    </section>
  );
}
