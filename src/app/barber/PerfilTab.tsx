"use client";

import { useState } from "react";
import type { BarberInfo } from "./BarberPanel";

const inputClass =
  "w-full bg-black/40 border border-zinc-700 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-white transition-colors";

export function PerfilTab({ barber }: { barber: BarberInfo }) {
  const [depositPercentage, setDepositPercentage] = useState(String(barber.depositPercentage));
  const [transferCBUorCVU, setTransferCBUorCVU] = useState(barber.transferCBUorCVU ?? "");
  const [transferAlias, setTransferAlias] = useState(barber.transferAlias ?? "");
  const [transferHolderName, setTransferHolderName] = useState(barber.transferHolderName ?? "");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaved(false);

    const pct = Number(depositPercentage);
    if (!Number.isInteger(pct) || pct < 0 || pct > 100) {
      setError("El porcentaje debe ser un entero entre 0 y 100.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/barber/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          depositPercentage: pct,
          transferCBUorCVU: transferCBUorCVU.trim(),
          transferAlias: transferAlias.trim(),
          transferHolderName: transferHolderName.trim(),
        }),
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

      <p className="text-xs uppercase tracking-widest text-zinc-400">Configuración de pago</p>

      <div className="flex flex-col gap-4">

        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-zinc-500">Porcentaje de seña (%)</label>
          <input
            type="number"
            min={0}
            max={100}
            value={depositPercentage}
            onChange={(e) => { setDepositPercentage(e.target.value); setSaved(false); }}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-zinc-500">CBU / CVU</label>
          <input
            type="text"
            value={transferCBUorCVU}
            onChange={(e) => { setTransferCBUorCVU(e.target.value); setSaved(false); }}
            placeholder="0000000000000000000000"
            className={`${inputClass} font-mono`}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-zinc-500">Alias</label>
          <input
            type="text"
            value={transferAlias}
            onChange={(e) => { setTransferAlias(e.target.value); setSaved(false); }}
            placeholder="ALIAS.PAGO"
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-zinc-500">Titular de la cuenta</label>
          <input
            type="text"
            value={transferHolderName}
            onChange={(e) => { setTransferHolderName(e.target.value); setSaved(false); }}
            placeholder="Nombre del titular"
            className={inputClass}
          />
        </div>

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
