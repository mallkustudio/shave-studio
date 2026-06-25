"use client";

import { useState, useEffect } from "react";
import { artTodayMidnightUTC } from "@/lib/tz";

type Props = {
  barberId: string;
  durationMinutes: number;
  availableDays: string[]; // e.g. ["MON","TUE","FRI","SAT"]
  onBack: () => void;
  onSelect: (date: string, slot: string) => void;
};

const JS_DAY_TO_ENUM: Record<number, string> = {
  0: "SUN", 1: "MON", 2: "TUE", 3: "WED", 4: "THU", 5: "FRI", 6: "SAT",
};

const DAY_LABELS: Record<number, string> = {
  0: "Dom", 1: "Lun", 2: "Mar", 3: "Mié", 4: "Jue", 5: "Vie", 6: "Sáb",
};

function buildDateStrip(availableDays: string[]): { date: Date; label: string; iso: string; available: boolean }[] {
  const days = [];

  const today = artTodayMidnightUTC();

  for (let i = 0; i < 21; i++) {
    const d = new Date(today.getTime() + i * 86_400_000);
    const jsDay = d.getUTCDay();
    days.push({
      date: d,
      label: DAY_LABELS[jsDay],
      iso: d.toISOString().slice(0, 10),
      available: availableDays.includes(JS_DAY_TO_ENUM[jsDay]),
    });
  }
  return days;
}

export function DateTimePicker({ barberId, durationMinutes, availableDays, onBack, onSelect }: Props) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [slots, setSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const dateStrip = buildDateStrip(availableDays);

  useEffect(() => {
    if (!selectedDate) return;
    setSlots([]);
    setSelectedSlot(null);
    setLoading(true);

    fetch(`/api/availability?barberId=${barberId}&date=${selectedDate}&durationMinutes=${durationMinutes}`)
      .then((r) => r.json())
      .then((data) => setSlots(data.slots ?? []))
      .finally(() => setLoading(false));
  }, [selectedDate, barberId, durationMinutes]);

  function handleDateSelect(iso: string) {
    setSelectedDate(iso);
    setSelectedSlot(null);
  }

  const canContinue = selectedDate !== null && selectedSlot !== null;

  return (
    <div className="flex flex-col gap-8">

      {/* Back */}
      <button
        onClick={onBack}
        className="self-start flex items-center gap-1.5 text-zinc-400 hover:text-zinc-200 text-sm transition-colors"
      >
        <span>←</span> Volver
      </button>

      {/* Step 3 — Date selection */}
      <section className="flex flex-col gap-3">
        <h2 className="text-xs uppercase tracking-widest text-zinc-400">3. Elige el día</h2>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {dateStrip.map(({ iso, label, date, available }) => {
            const isSelected = iso === selectedDate;
            const dayNum = date.getUTCDate();
            return (
              <button
                key={iso}
                disabled={!available}
                onClick={() => handleDateSelect(iso)}
                className={`
                  shrink-0 flex flex-col items-center justify-center rounded-none w-14 h-16 border text-sm transition-all duration-150 backdrop-blur-sm
                  ${isSelected
                    ? "border-[#e63946] bg-black/40 text-[#e63946]"
                    : available
                      ? "border-zinc-700 bg-black/40 text-zinc-300 hover:border-zinc-400"
                      : "border-zinc-800 bg-black/40 text-zinc-600 cursor-not-allowed"
                  }
                `}
              >
                <span className={`text-xs ${isSelected ? "text-[#e63946]" : "text-zinc-500"}`}>
                  {label}
                </span>
                <span className="font-semibold mt-0.5">{dayNum}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Step 4 — Time slot selection */}
      {selectedDate && (
        <section className="flex flex-col gap-3">
          <h2 className="text-xs uppercase tracking-widest text-zinc-400">4. Elige la hora</h2>

          {loading && (
            <p className="text-zinc-500 text-sm">Cargando horarios...</p>
          )}

          {!loading && slots.length === 0 && (
            <p className="text-zinc-500 text-sm">No hay horarios disponibles para este día.</p>
          )}

          {!loading && slots.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {slots.map((slot) => {
                const isSelected = slot === selectedSlot;
                return (
                  <button
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    className={`
                      py-3 rounded-none border text-sm font-medium transition-all duration-150 backdrop-blur-sm
                      ${isSelected
                        ? "border-[#e63946] bg-[#e63946]/10 text-[#e63946]"
                        : "border-zinc-700 bg-black/40 text-zinc-300 hover:border-zinc-400"
                      }
                    `}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* Continue */}
      <div className="pt-2">
        <button
          disabled={!canContinue}
          onClick={() => canContinue && onSelect(selectedDate!, selectedSlot!)}
          className={`
            w-full py-4 rounded-none text-sm font-semibold uppercase tracking-widest transition-colors duration-200
            ${canContinue
              ? "border border-white text-white bg-transparent hover:bg-white hover:text-black"
              : "bg-zinc-800 text-zinc-600 cursor-not-allowed"
            }
          `}
        >
          Continuar
        </button>
      </div>

    </div>
  );
}
