"use client";

import { useState } from "react";
import type { AvailabilityItem, BlockedTimeItem } from "./BarberPanel";

const DAYS = [
  { key: "MON", label: "Lunes" },
  { key: "TUE", label: "Martes" },
  { key: "WED", label: "Miércoles" },
  { key: "THU", label: "Jueves" },
  { key: "FRI", label: "Viernes" },
  { key: "SAT", label: "Sábado" },
  { key: "SUN", label: "Domingo" },
];

function formatBlockedDate(iso: string): string {
  return new Date(iso).toLocaleString("es-AR", {
    timeZone: "America/Argentina/Buenos_Aires",
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

type Props = {
  barberId: string;
  initialAvailability: AvailabilityItem[];
  initialBlockedTimes: BlockedTimeItem[];
};

export function DisponibilidadTab({ barberId: _barberId, initialAvailability, initialBlockedTimes }: Props) {
  const [availMap, setAvailMap] = useState<Record<string, AvailabilityItem | undefined>>(() =>
    Object.fromEntries(initialAvailability.map((a) => [a.dayOfWeek, a]))
  );
  const [savingDay, setSavingDay] = useState<string | null>(null);
  const [savedDay, setSavedDay] = useState<string | null>(null);

  const [blockedTimes, setBlockedTimes] = useState(initialBlockedTimes);
  const [newStart, setNewStart] = useState("");
  const [newEnd, setNewEnd] = useState("");
  const [newReason, setNewReason] = useState("");
  const [addingBlock, setAddingBlock] = useState(false);
  const [blockError, setBlockError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function getDay(key: string) {
    return availMap[key] ?? { id: "", dayOfWeek: key, startTime: "09:00", endTime: "18:00", isActive: false };
  }

  function setDayField(key: string, field: "startTime" | "endTime" | "isActive", value: string | boolean) {
    setAvailMap((prev) => {
      const current = prev[key] ?? { id: "", dayOfWeek: key, startTime: "09:00", endTime: "18:00", isActive: false };
      return { ...prev, [key]: { ...current, [field]: value } };
    });
  }

  async function saveDay(key: string) {
    const day = getDay(key);
    setSavingDay(key);
    try {
      const res = await fetch("/api/barber/availability", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dayOfWeek: key,
          startTime: day.startTime,
          endTime: day.endTime,
          isActive: day.isActive,
        }),
      });
      if (res.ok) {
        const updated: AvailabilityItem = await res.json();
        setAvailMap((prev) => ({ ...prev, [key]: updated }));
        setSavedDay(key);
        setTimeout(() => setSavedDay((s) => (s === key ? null : s)), 2000);
      }
    } finally {
      setSavingDay(null);
    }
  }

  async function addBlockedTime(e: React.FormEvent) {
    e.preventDefault();
    setBlockError(null);
    if (!newStart || !newEnd) {
      setBlockError("Completá fecha de inicio y fin.");
      return;
    }
    // Append Argentina offset so datetime-local is interpreted as ART
    const startAt = new Date(newStart + ":00.000-03:00");
    const endAt = new Date(newEnd + ":00.000-03:00");
    if (startAt >= endAt) {
      setBlockError("El inicio debe ser anterior al fin.");
      return;
    }
    setAddingBlock(true);
    try {
      const res = await fetch("/api/barber/blocked-times", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startAt: startAt.toISOString(),
          endAt: endAt.toISOString(),
          reason: newReason.trim() || undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setBlockError(data.error ?? "Error al guardar.");
        return;
      }
      const created: BlockedTimeItem = await res.json();
      setBlockedTimes((prev) => [...prev, created].sort((a, b) => a.startAt.localeCompare(b.startAt)));
      setNewStart("");
      setNewEnd("");
      setNewReason("");
    } catch {
      setBlockError("Error de conexión.");
    } finally {
      setAddingBlock(false);
    }
  }

  async function deleteBlockedTime(id: string) {
    setDeletingId(id);
    try {
      await fetch(`/api/barber/blocked-times/${id}`, { method: "DELETE" });
      setBlockedTimes((prev) => prev.filter((bt) => bt.id !== id));
    } finally {
      setDeletingId(null);
    }
  }

  const inputCls = "bg-black/40 border border-zinc-700 px-3 py-2 text-sm text-white focus:outline-none focus:border-white transition-colors";

  return (
    <div className="flex flex-col gap-10">

      {/* Availability grid */}
      <section className="flex flex-col gap-4">
        <p className="text-xs uppercase tracking-widest text-zinc-400">Horarios por día</p>

        {DAYS.map(({ key, label }) => {
          const day = getDay(key);
          const isSaving = savingDay === key;
          const isSaved = savedDay === key;

          return (
            <div key={key} className="border border-zinc-800 bg-black/40 px-4 py-4 flex flex-col gap-3">

              {/* Day header + toggle */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-white">{label}</span>
                <button
                  onClick={() => setDayField(key, "isActive", !day.isActive)}
                  className={`text-xs px-3 py-1.5 border transition-colors duration-150
                    ${day.isActive
                      ? "border-[#e63946]/40 text-[#e63946] bg-[#e63946]/10"
                      : "border-zinc-700 text-zinc-500 hover:border-zinc-500 hover:text-zinc-300"
                    }`}
                >
                  {day.isActive ? "Activo" : "Cerrado"}
                </button>
              </div>

              {/* Time inputs — only when active */}
              {day.isActive && (
                <div className="flex items-center gap-3">
                  <div className="flex flex-col gap-1 flex-1">
                    <label className="text-xs text-zinc-600">Desde</label>
                    <input
                      type="time"
                      value={day.startTime}
                      onChange={(e) => setDayField(key, "startTime", e.target.value)}
                      className={`${inputCls} w-full`}
                    />
                  </div>
                  <div className="flex flex-col gap-1 flex-1">
                    <label className="text-xs text-zinc-600">Hasta</label>
                    <input
                      type="time"
                      value={day.endTime}
                      onChange={(e) => setDayField(key, "endTime", e.target.value)}
                      className={`${inputCls} w-full`}
                    />
                  </div>
                </div>
              )}

              {/* Save row */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => saveDay(key)}
                  disabled={isSaving}
                  className="text-xs py-1.5 px-4 border border-white text-white hover:bg-white hover:text-black transition-colors disabled:opacity-40"
                >
                  {isSaving ? "Guardando..." : "Guardar"}
                </button>
                {isSaved && <span className="text-xs text-emerald-400">Guardado</span>}
              </div>

            </div>
          );
        })}
      </section>

      {/* Blocked times */}
      <section className="flex flex-col gap-4">
        <p className="text-xs uppercase tracking-widest text-zinc-400">Bloqueos</p>

        {blockedTimes.length === 0 && (
          <p className="text-sm text-zinc-600">Sin bloqueos activos.</p>
        )}

        {blockedTimes.map((bt) => (
          <div key={bt.id} className="border border-zinc-800 bg-black/40 px-4 py-3 flex items-start justify-between gap-4">
            <div className="flex flex-col gap-0.5">
              <p className="text-sm text-white">
                {formatBlockedDate(bt.startAt)} → {formatBlockedDate(bt.endAt)}
              </p>
              {bt.reason && <p className="text-xs text-zinc-500">{bt.reason}</p>}
            </div>
            <button
              onClick={() => deleteBlockedTime(bt.id)}
              disabled={deletingId === bt.id}
              className="shrink-0 text-xs text-red-400 border border-red-500/20 px-3 py-1 hover:bg-red-500/10 transition-colors disabled:opacity-40"
            >
              Eliminar
            </button>
          </div>
        ))}

        {/* Add blocked time form */}
        <form onSubmit={addBlockedTime} className="flex flex-col gap-4 border border-zinc-800 bg-black/40 p-4">
          <p className="text-xs text-zinc-500 uppercase tracking-widest">Nuevo bloqueo</p>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-zinc-600">Inicio</label>
              <input
                type="datetime-local"
                value={newStart}
                onChange={(e) => setNewStart(e.target.value)}
                className={inputCls}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-zinc-600">Fin</label>
              <input
                type="datetime-local"
                value={newEnd}
                onChange={(e) => setNewEnd(e.target.value)}
                className={inputCls}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-zinc-600">Motivo (opcional)</label>
            <input
              type="text"
              value={newReason}
              onChange={(e) => setNewReason(e.target.value)}
              placeholder="Vacaciones, feriado..."
              className={`${inputCls} w-full`}
            />
          </div>

          {blockError && <p className="text-xs text-red-400">{blockError}</p>}

          <button
            type="submit"
            disabled={addingBlock}
            className="self-start py-2.5 px-6 border border-white text-white text-xs font-semibold uppercase tracking-widest hover:bg-white hover:text-black transition-colors duration-200 disabled:opacity-40"
          >
            {addingBlock ? "Bloqueando..." : "Bloquear"}
          </button>
        </form>
      </section>

    </div>
  );
}
