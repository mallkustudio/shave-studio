import { ContactForm } from "./ContactForm";

const INFO = [
  {
    label: "Av. Dorrego 1865 3B, entre Gorriti y Honduras, CABA",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
  {
    label: "+54 11 0000-0000",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.77a16 16 0 0 0 6.29 6.29l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7a2 2 0 0 1 1.72 2.02z" />
      </svg>
    ),
  },
  {
    label: "info@shavesstudio.com",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
  },
];

export function ContactSection() {
  return (
    <section className="bg-zinc-950 text-white py-24 px-[10%]">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-16">

        {/* Left — info */}
        <div className="md:w-1/2 flex flex-col gap-8 shrink-0">
          <div className="flex flex-col gap-4">
            <div className="w-10 h-0.5 bg-[var(--color-accent)]" />
            <h2
              className="font-black uppercase text-white"
              style={{ fontSize: "clamp(2rem, 3.5vw, 3.5rem)", lineHeight: 0.95 }}
            >
              SAY HELLO
            </h2>
            <p className="text-zinc-400 text-xs tracking-[0.25em] uppercase">
              — ENVIANOS UN MENSAJE
            </p>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-sm mt-2">
              Estamos para ayudarte. Escribinos y te respondemos a la brevedad.
            </p>
          </div>

          <ul className="flex flex-col gap-4">
            {INFO.map(({ label, icon }) => (
              <li key={label} className="flex items-start gap-3 text-zinc-300 text-sm">
                <span className="mt-0.5 text-[var(--color-accent)] shrink-0">{icon}</span>
                {label}
              </li>
            ))}
          </ul>
        </div>

        {/* Right — form */}
        <div className="md:w-1/2">
          <ContactForm />
        </div>

      </div>
    </section>
  );
}
