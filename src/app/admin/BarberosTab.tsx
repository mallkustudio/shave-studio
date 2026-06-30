"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { AdminBarberItem } from "./AdminPanel";

type Props = { barbers: AdminBarberItem[] };

export function BarberosTab({ barbers: initialBarbers }: Props) {
  const router = useRouter();
  const [barbers, setBarbers] = useState(initialBarbers);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function setError(id: string, msg: string) {
    setErrors((prev) => ({ ...prev, [id]: msg }));
  }
  function clearError(id: string) {
    setErrors((prev) => { const n = { ...prev }; delete n[id]; return n; });
  }

  async function toggleActive(b: AdminBarberItem) {
    setLoadingId(b.id);
    clearError(b.id);
    try {
      const res = await fetch(`/api/admin/barbers/${b.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !b.isActive }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(b.id, data.error ?? "Error al actualizar.");
        return;
      }
      setBarbers((prev) =>
        prev.map((x) => (x.id === b.id ? { ...x, isActive: !x.isActive } : x))
      );
      router.refresh();
    } catch {
      setError(b.id, "Error de conexión.");
    } finally {
      setLoadingId(null);
    }
  }

  async function deletBarber(b: AdminBarberItem) {
    clearError(b.id);
    if (!window.confirm(`¿Eliminar a ${b.displayName}? Esta acción no se puede deshacer.`)) return;

    setLoadingId(b.id);
    try {
      const res = await fetch(`/api/admin/barbers/${b.id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(b.id, data.error ?? "Error al eliminar.");
        return;
      }
      setBarbers((prev) => prev.filter((x) => x.id !== b.id));
      router.refresh();
    } catch {
      setError(b.id, "Error de conexión.");
    } finally {
      setLoadingId(null);
    }
  }

  if (barbers.length === 0) {
    return <p className="text-sm text-zinc-500">Sin barberos registrados.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {barbers.map((b) => {
        const isLoading = loadingId === b.id;
        const errorMsg = errors[b.id];

        return (
          <div
            key={b.id}
            className={`border px-5 py-4 flex flex-col gap-4 transition-opacity
              ${b.isActive ? "border-zinc-700 bg-black/40" : "border-zinc-800 bg-black/20 opacity-60"}`}
          >
            {/* Name + status badge + toggle */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <p className="text-sm font-semibold text-white uppercase">{b.displayName}</p>

              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={`text-xs px-2.5 py-1 border ${
                    b.isActive
                      ? "border-[#e63946]/30 text-[#e63946] bg-[#e63946]/10"
                      : "border-zinc-700 text-zinc-500"
                  }`}
                >
                  {b.isActive ? "Activo" : "Inactivo"}
                </span>

                <button
                  onClick={() => toggleActive(b)}
                  disabled={isLoading}
                  className={`text-xs px-3 py-1 border transition-colors duration-150 disabled:opacity-40
                    ${b.isActive
                      ? "border-red-500/40 text-red-400 hover:bg-red-500/10"
                      : "border-white/40 text-white hover:bg-white/10"
                    }`}
                >
                  {isLoading ? "..." : b.isActive ? "Desactivar" : "Activar"}
                </button>
              </div>
            </div>

            {/* Config grid */}
            <div className="grid grid-cols-2 gap-y-2 text-xs">
              <span className="text-zinc-500">Seña</span>
              <span className="text-zinc-300">{b.depositPercentage}%</span>

              {b.transferCBUorCVU && (
                <>
                  <span className="text-zinc-500">CBU / CVU</span>
                  <span className="text-zinc-300 font-mono break-all">{b.transferCBUorCVU}</span>
                </>
              )}
              {b.transferAlias && (
                <>
                  <span className="text-zinc-500">Alias</span>
                  <span className="text-zinc-300">{b.transferAlias}</span>
                </>
              )}
              {b.transferHolderName && (
                <>
                  <span className="text-zinc-500">Titular</span>
                  <span className="text-zinc-300">{b.transferHolderName}</span>
                </>
              )}
              {!b.transferCBUorCVU && !b.transferAlias && (
                <>
                  <span className="text-zinc-500">Transferencia</span>
                  <span className="text-zinc-600">Sin configurar</span>
                </>
              )}
            </div>

            {/* Error */}
            {errorMsg && <p className="text-xs text-red-400">{errorMsg}</p>}

            {/* Delete — only when inactive */}
            {!b.isActive && (
              <div className="border-t border-zinc-800 pt-3">
                <button
                  onClick={() => deletBarber(b)}
                  disabled={isLoading}
                  className="text-xs px-3 py-1.5 border border-zinc-600 text-zinc-500 hover:border-red-500/40 hover:text-red-400 transition-colors duration-150 disabled:opacity-40"
                >
                  {isLoading ? "Eliminando..." : "Eliminar"}
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
