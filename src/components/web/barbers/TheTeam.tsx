import Link from "next/link";
import { FadeIn } from "../FadeIn";
import { TextReveal } from "../TextReveal";

type TeamBarber = {
  id: string;
  displayName: string;
  bio: string | null;
  avatarUrl: string | null;
};

const FALLBACK_PHOTOS = ["/barbers/amado.jpg", "/barbers/lucas.jpg"];

export function TheTeam({ barbers }: { barbers: TeamBarber[] }) {
  return (
    <section className="bg-zinc-950 text-white py-24 px-[10%]">
      <div className="max-w-6xl mx-auto flex flex-col gap-16">

        {/* Header */}
        <div className="flex flex-col gap-4">
          <h2
            className="font-display font-black uppercase text-white"
            style={{ fontSize: "clamp(2.5rem, 5vw, 5rem)", lineHeight: 0.95 }}
          >
            <TextReveal text="THE TEAM" />
          </h2>
          <p className="text-zinc-400 text-xs tracking-[0.25em] uppercase">
            — TODOS AMAMOS LO QUE HACEMOS
          </p>
          <p className="text-zinc-400 text-sm leading-relaxed max-w-lg mt-2">
            Nuestro equipo de profesionales está comprometido con brindarte la mejor experiencia.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-3xl mx-auto w-full">
          {barbers.map((barber, idx) => {
            const photo = barber.avatarUrl ?? FALLBACK_PHOTOS[idx % FALLBACK_PHOTOS.length];
            const bioLines = barber.bio?.split("\n") ?? [];
            const specialty = bioLines.length > 1 ? bioLines[0] : null;
            const description = bioLines.length > 1 ? bioLines.slice(1).join(" ") : barber.bio;

            return (
              <FadeIn key={barber.id} delay={idx * 150}>
                <Link href={`/reservas?barberId=${barber.id}`} className="block group">
                  <div className="flex flex-col gap-4">

                    {/* Image + hover overlay */}
                    <div className="relative overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photo}
                        alt={barber.displayName}
                        className="w-full aspect-[3/4] object-cover object-center transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                      <div className="absolute bottom-4 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="text-white text-xs tracking-widest uppercase bg-[#e63946] px-4 py-2">
                          RESERVAR →
                        </span>
                      </div>
                    </div>

                    {/* Text */}
                    <div className="flex flex-col gap-1 pb-5 border-b border-zinc-700">
                      {specialty && (
                        <p className="text-[var(--color-accent)] text-[10px] tracking-widest uppercase font-semibold">
                          {specialty}
                        </p>
                      )}
                      <p className="text-white text-sm font-bold uppercase tracking-wide">
                        {barber.displayName}
                      </p>
                      {description && (
                        <p className="text-zinc-500 text-xs leading-relaxed mt-1">
                          {description}
                        </p>
                      )}
                    </div>

                  </div>
                </Link>
              </FadeIn>
            );
          })}
        </div>

      </div>
    </section>
  );
}
