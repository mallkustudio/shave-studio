import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative h-screen flex items-center overflow-hidden bg-[#1a0a0a]">

      {/* Background image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/hero-bg.jpg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(20, 10, 10, 0.55)" }}
      />

      {/* Content */}
      <div className="relative z-10 w-full px-[10%] pt-24 pb-20 flex flex-col gap-6">

        {/* Title */}
        <h1
          className="font-black uppercase text-white"
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
            &ldquo;IF YOU KEEP WALKING PAST THE BARBERS,
            EVENTUALLY YOU&rsquo;LL GET A HAIRCUT.&rdquo;
          </p>
        </blockquote>

        {/* CTA */}
        <div className="mt-2">
          <Link
            href="/reservas"
            className="inline-block border border-white text-white text-xs font-semibold tracking-widest uppercase px-8 py-3 transition-all duration-200 hover:bg-white hover:text-black"
          >
            Book An Appointment
          </Link>
        </div>

      </div>
    </section>
  );
}
