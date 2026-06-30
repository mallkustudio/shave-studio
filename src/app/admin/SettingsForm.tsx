"use client";

import { useState } from "react";
import type { BookingSettings } from "@/modules/settings/queries";

const inputClass =
  "bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500 transition-colors";

export function SettingsForm({ initial }: { initial: BookingSettings }) {
  const [paymentWindowMinutes, setPaymentWindowMinutes] = useState(String(initial.paymentWindowMinutes));
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">

      <div className="flex flex-col gap-1.5">
        <label className="text-xs text-zinc-400">Tiempo de pago (minutos)</label>
        <input
          type="number"
          min={5}
          max={1440}
          value={paymentWindowMinutes}
          onChange={(e) => { setPaymentWindowMinutes(e.target.value); setSaved(false); }}
          className={inputClass}
        />
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}
      {saved && <p className="text-xs text-emerald-400">Guardado correctamente.</p>}

      <button
        type="submit"
        disabled={loading}
        className="self-start px-5 py-2.5 rounded-lg text-xs font-semibold bg-amber-500 text-zinc-950 hover:bg-amber-400 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading ? "Guardando..." : "Guardar"}
      </button>

    </form>
  );
}
