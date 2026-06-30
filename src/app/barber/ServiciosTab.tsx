"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatARS } from "@/lib/money";
import type { BarberServiceItem } from "./BarberPanel";

const inputClass =
  "w-full bg-black/40 border border-zinc-700 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-white transition-colors";

const DURATION_OPTIONS = [30, 45, 60, 90];

type Props = { initialServices: BarberServiceItem[] };

export function ServiciosTab({ initialServices }: Props) {
  const router = useRouter();
  const [services, setServices] = useState(initialServices);
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDuration, setNewDuration] = useState("30");
  const [newPrice, setNewPrice] = useState("");
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  async function toggleActive(svc: BarberServiceItem) {
    setSavingId(svc.id);
    try {
      const res = await fetch(`/api/barber/services/${svc.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !svc.isActive }),
      });
      if (res.ok) {
        setServices((prev) =>
          prev.map((s) => (s.id === svc.id ? { ...s, isActive: !s.isActive } : s))
        );
      }
    } finally {
      setSavingId(null);
    }
  }

  async function saveCustomPrice(svc: BarberServiceItem) {
    const price = Number(editPrice);
    if (isNaN(price) || price < 0) return;
    setSavingId(svc.id);
    try {
      const res = await fetch(`/api/barber/services/${svc.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customPrice: price }),
      });
      if (res.ok) {
        setServices((prev) =>
          prev.map((s) =>
            s.id === svc.id
              ? { ...s, customPrice: price, effectivePrice: price }
              : s
          )
        );
        setEditingPriceId(null);
      }
    } finally {
      setSavingId(null);
    }
  }

  async function handleAddService(e: React.FormEvent) {
    e.preventDefault();
    setAddError(null);
    const price = Number(newPrice);
    if (!newName.trim() || isNaN(price) || price < 0) {
      setAddError("Completá todos los campos correctamente.");
      return;
    }
    setAddLoading(true);
    try {
      const res = await fetch("/api/barber/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName.trim(),
          durationMinutes: Number(newDuration),
          price,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setAddError(data.error ?? "Error al agregar.");
        return;
      }
      setShowAddForm(false);
      setNewName("");
      setNewDuration("30");
      setNewPrice("");
      router.refresh();
    } catch {
      setAddError("Error de conexión.");
    } finally {
      setAddLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-8">

      {/* Service list */}
      <section className="flex flex-col gap-3">
        <p className="text-xs uppercase tracking-widest text-zinc-400">Servicios activos</p>

        {services.length === 0 && (
          <p className="text-sm text-zinc-500">Sin servicios asignados.</p>
        )}

        {services.map((svc) => {
          const isEditing = editingPriceId === svc.id;
          const isSaving = savingId === svc.id;

          return (
            <div
              key={svc.id}
              className={`border px-5 py-4 flex flex-col gap-3 transition-colors
                ${svc.isActive ? "border-zinc-700 bg-black/40" : "border-zinc-800 bg-black/20 opacity-50"}`}
            >
              {/* Row 1: name + toggle */}
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-white uppercase">{svc.name}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">{svc.durationMinutes} min</p>
                </div>
                <button
                  onClick={() => toggleActive(svc)}
                  disabled={isSaving}
                  className={`shrink-0 text-xs px-3 py-1.5 border transition-colors duration-150 disabled:opacity-40
                    ${svc.isActive
                      ? "border-zinc-600 text-zinc-400 hover:border-red-500/50 hover:text-red-400"
                      : "border-zinc-700 text-zinc-600 hover:border-white hover:text-white"
                    }`}
                >
                  {svc.isActive ? "Desactivar" : "Activar"}
                </button>
              </div>

              {/* Row 2: price */}
              <div className="flex items-center gap-3">
                {isEditing ? (
                  <>
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                      className="w-32 bg-black/40 border border-zinc-600 px-3 py-1.5 text-sm text-white focus:outline-none focus:border-white"
                      autoFocus
                    />
                    <button
                      onClick={() => saveCustomPrice(svc)}
                      disabled={isSaving}
                      className="text-xs px-3 py-1.5 border border-white text-white hover:bg-white hover:text-black transition-colors disabled:opacity-40"
                    >
                      Guardar
                    </button>
                    <button
                      onClick={() => setEditingPriceId(null)}
                      className="text-xs text-zinc-500 hover:text-zinc-300"
                    >
                      Cancelar
                    </button>
                  </>
                ) : (
                  <>
                    <span className="text-sm text-[#e63946] font-medium">
                      {formatARS(svc.effectivePrice)}
                    </span>
                    {svc.customPrice !== null && (
                      <span className="text-xs text-zinc-600 line-through">{formatARS(svc.basePrice)}</span>
                    )}
                    <button
                      onClick={() => { setEditingPriceId(svc.id); setEditPrice(String(svc.effectivePrice)); }}
                      className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                      Editar precio
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </section>

      {/* Add service */}
      <section className="flex flex-col gap-3">
        <p className="text-xs uppercase tracking-widest text-zinc-400">Agregar servicio</p>

        {!showAddForm ? (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full py-3 border border-zinc-700 text-zinc-400 text-xs uppercase tracking-widest hover:border-white hover:text-white transition-colors duration-200"
          >
            + Nuevo servicio
          </button>
        ) : (
          <form onSubmit={handleAddService} className="flex flex-col gap-4 border border-zinc-700 p-5 bg-black/40">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-zinc-500">Nombre del servicio *</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Ej: Corte Clásico"
                required
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-zinc-500">Duración</label>
              <select
                value={newDuration}
                onChange={(e) => setNewDuration(e.target.value)}
                className="bg-black/40 border border-zinc-700 px-4 py-3 text-sm text-white focus:outline-none focus:border-white"
              >
                {DURATION_OPTIONS.map((d) => (
                  <option key={d} value={d}>{d} min</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-zinc-500">Precio base *</label>
              <input
                type="number"
                min={0}
                step="0.01"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                placeholder="0"
                required
                className={inputClass}
              />
            </div>

            {addError && <p className="text-xs text-red-400">{addError}</p>}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={addLoading}
                className="py-3 px-6 border border-white text-white text-xs font-semibold uppercase tracking-widest hover:bg-white hover:text-black transition-colors duration-200 disabled:opacity-40"
              >
                {addLoading ? "Agregando..." : "Agregar"}
              </button>
              <button
                type="button"
                onClick={() => { setShowAddForm(false); setAddError(null); }}
                className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
      </section>

    </div>
  );
}
