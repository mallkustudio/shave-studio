export function WebFooter() {
  return (
    <footer className="bg-zinc-950 text-white">
      <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">

        {/* Opening Hours */}
        <div className="flex flex-col gap-4">
          <h3 className="text-xs font-semibold tracking-widest uppercase text-[var(--color-accent)]">
            Opening Hours
          </h3>
          <div className="flex flex-col gap-2 text-sm text-zinc-400">
            <div className="flex justify-between gap-4">
              <span>Mon — Fri</span>
              <span>09:00 — 19:00</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Saturday</span>
              <span>10:00 — 16:00</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Sunday</span>
              <span className="text-zinc-600">Closed</span>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="flex flex-col gap-4">
          <h3 className="text-xs font-semibold tracking-widest uppercase text-[var(--color-accent)]">
            Contact
          </h3>
          <div className="flex flex-col gap-1.5 text-sm text-zinc-400">
            <p>123 Placeholder Street</p>
            <p>Buenos Aires, Argentina</p>
            <p className="mt-2">+54 11 0000-0000</p>
            <p>info@shave-studio.com</p>
          </div>
        </div>

        {/* Keep in Touch */}
        <div className="flex flex-col gap-4">
          <h3 className="text-xs font-semibold tracking-widest uppercase text-[var(--color-accent)]">
            Keep in Touch
          </h3>
          <div className="flex gap-3">
            <div className="w-9 h-9 rounded bg-zinc-800" aria-label="Social placeholder" />
            <div className="w-9 h-9 rounded bg-zinc-800" aria-label="Social placeholder" />
            <div className="w-9 h-9 rounded bg-zinc-800" aria-label="Social placeholder" />
          </div>
        </div>

      </div>

      {/* Copyright */}
      <div className="border-t border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <p className="text-xs text-zinc-500 text-center tracking-wide">
            Copyright © 2026 Shave Studio | All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
