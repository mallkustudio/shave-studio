"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error || !result?.ok) {
        setError("Email o contraseña incorrectos");
        return;
      }

      // Fetch session to determine role-based redirect
      const sessionRes = await fetch("/api/auth/session");
      const session = await sessionRes.json();
      const role = (session?.user as any)?.role;

      if (role === "ADMIN") router.push("/admin");
      else if (role === "BARBER") router.push("/barber");
      else router.push("/");
    } catch {
      setError("Email o contraseña incorrectos");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md px-4">
      <div className="bg-black/60 backdrop-blur-sm border border-zinc-800 p-10">
        <p className="text-[#e63946] text-xs uppercase tracking-widest text-center mb-2">
          SHAVE STUDIO
        </p>
        <h1 className="text-2xl font-black uppercase tracking-widest text-white text-center mb-8">
          INICIAR SESIÓN
        </h1>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-zinc-400 uppercase tracking-widest text-xs">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              className="bg-black/40 border border-zinc-700 focus:border-white focus:outline-none rounded-none px-4 py-3 text-white placeholder:text-zinc-500 text-sm w-full transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-zinc-400 uppercase tracking-widest text-xs">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="bg-black/40 border border-zinc-700 focus:border-white focus:outline-none rounded-none px-4 py-3 text-white placeholder:text-zinc-500 text-sm w-full transition-colors"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`
              w-full py-3 rounded-none text-sm font-semibold uppercase tracking-widest transition-colors duration-200
              ${loading
                ? "bg-zinc-800 text-zinc-600 cursor-not-allowed"
                : "border border-white text-white bg-transparent hover:bg-white hover:text-black"
              }
            `}
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}
