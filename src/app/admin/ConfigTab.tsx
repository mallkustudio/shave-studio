"use client";

import { useState } from "react";
import type { AdminSettings } from "./AdminPanel";

export function ConfigTab({ settings }: { settings: AdminSettings }) {
  const [paymentWindowMinutes, setPaymentWindowMinutes] = useState(String(settings.paymentWindowMinutes));
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaved(false);

    const minutes = Number(paymentWindowMinutes);
    if (!Number.isInteger(minutes) || minutes < 5 || minutes > 1440) {
      setError("El tiempo de pago debe estar entre 5 y 1440 minutos.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentWindowMinutes: minutes }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Error al guardar.");
      } else {
        setSaved(true);
      }
    } catch {
      setError("Error de conexión.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <p className="text-xs uppercase tracking-widest text-zinc-400">Configuración global</p>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs text-zinc-500">Tiempo de pago (minutos)</label>
        <input
          type="number"
          min={5}
          max={1440}
          value={paymentWindowMinutes}
          onChange={(e) => { setPaymentWindowMinutes(e.target.value); setSaved(false); }}
          className="w-full bg-black/40 border border-zinc-700 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-white transition-colors"
        />
        <p className="text-xs text-zinc-600">Tiempo que tiene el cliente para subir el comprobante tras reservar.</p>
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}
      {saved && <p className="text-xs text-emerald-400">Guardado correctamente.</p>}

      <button
        type="submit"
        disabled={loading}
        className="self-start py-3 px-8 border border-white text-white text-xs font-semibold uppercase tracking-widest hover:bg-white hover:text-black transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading ? "Guardando..." : "Guardar"}
      </button>
    </form>
  );
}
