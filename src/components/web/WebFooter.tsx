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
              <span>Mar — Sáb</span>
              <span>09:00 — 21:00</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Dom y Lun</span>
              <span className="text-zinc-600">Cerrado</span>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="flex flex-col gap-4">
          <h3 className="text-xs font-semibold tracking-widest uppercase text-[var(--color-accent)]">
            Contact
          </h3>
          <div className="flex flex-col gap-1.5 text-sm text-zinc-400">
            <p>Av. Dorrego 1865 3B</p>
            <p>Entre Gorriti y Honduras, CABA</p>
            <p className="mt-2">+54 11 0000-0000</p>
            <p>info@shavesstudio.com</p>
          </div>
        </div>

        {/* Keep in Touch */}
        <div className="flex flex-col gap-4">
          <h3 className="text-xs font-semibold tracking-widest uppercase text-[var(--color-accent)]">
            Keep in Touch
          </h3>
          <a
            href="https://www.instagram.com/shaves.studio"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram de Shaves Studio"
            className="w-9 h-9 flex items-center justify-center rounded bg-zinc-800 text-zinc-400 hover:bg-[var(--color-accent)] hover:text-white transition-colors duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
            </svg>
          </a>
        </div>

      </div>

      {/* Copyright */}
      <div className="border-t border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <p className="text-xs text-zinc-500 text-center tracking-wide">
            Copyright © 2026 Shaves Studio | All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
