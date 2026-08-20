import Link from "next/link";
import { WebNav } from "@/components/web/WebNav";
import "./(web)/web.css";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <WebNav />
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <p
          className="font-display font-black leading-none select-none"
          style={{ fontSize: "clamp(8rem, 28vw, 22rem)", color: "#e63946" }}
        >
          404
        </p>
        <h1 className="text-lg font-black uppercase tracking-[0.2em] -mt-4">
          PÁGINA NO ENCONTRADA
        </h1>
        <p className="text-zinc-500 text-sm mt-3">
          La página que buscás no existe.
        </p>
        <div className="mt-8">
          <Link
            href="/"
            className="inline-block border border-white text-white text-xs font-semibold tracking-widest uppercase px-8 py-3 transition-all duration-200 hover:bg-white hover:text-black"
          >
            VOLVER AL INICIO
          </Link>
        </div>
      </div>
    </div>
  );
}
