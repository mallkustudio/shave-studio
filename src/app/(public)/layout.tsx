import Link from "next/link";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen relative">
      <div
        className="fixed inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/services-bg.jpg')", backgroundAttachment: "fixed", zIndex: -20 }}
      />
      <div
        className="fixed inset-0"
        style={{ backgroundColor: "rgba(10,10,10,0.85)", zIndex: -10 }}
      />

      <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 flex items-center justify-between px-8 py-5">
        <Link href="/" className="text-white tracking-widest text-xs uppercase">
          SHAVE STUDIO
        </Link>
        <Link href="/" className="text-white tracking-widest text-xs uppercase">
          ← INICIO
        </Link>
      </header>

      <main className="pt-24">{children}</main>
    </div>
  );
}
