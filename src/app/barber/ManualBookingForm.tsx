"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Service = {
  id: string;
  name: string;
  durationMinutes: number;
  price: number;
};

type Props = {
  barberId: string;
  services: Service[];
};

export function ManualBookingForm({ barberId, services }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [serviceId, setServiceId] = useState("");
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [slots, setSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const selectedService = services.find((s) => s.id === serviceId);

  useEffect(() => {
    if (!serviceId || !date || !selectedService) {
      setSlots([]);
      setSlot("");
      return;
    }
    setLoadingSlots(true);
    setSlot("");
    fetch(
      `/api/availability?barberId=${barberId}&date=${date}&durationMinutes=${selectedService.durationMinutes}`
    )
      .then((r) => r.json())
      .then((data) => setSlots(data.slots ?? []))
      .catch(() => setSlots([]))
      .finally(() => setLoadingSlots(false));
  }, [serviceId, date]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!serviceId || !date || !slot || !customerName.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          barberId,
          serviceId,
          date,
          slot,
          durationMinutes: selectedService!.durationMinutes,
          fullName: customerName,
          email: customerEmail.trim() || null,
          phone: customerPhone.trim() || null,
          manual: true,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Error al crear el turno.");
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        setOpen(false);
        setSuccess(false);
        resetForm();
        router.refresh();
      }, 1200);
    } catch {
      setError("Error de conexión.");
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setServiceId("");
    setDate("");
    setSlot("");
    setCustomerName("");
    setCustomerEmail("");
    setCustomerPhone("");
    setSlots([]);
    setError(null);
  }

  function handleClose() {
    setOpen(false);
    resetForm();
    setSuccess(false);
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full py-3 rounded-xl text-sm font-semibold border border-amber-500/30 text-amber-400 bg-amber-500/5 hover:bg-amber-500/10 transition-all duration-150"
      >
        + Nuevo turno manual
      </button>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-zinc-100">Nuevo turno manual</h2>
        <button
          onClick={handleClose}
          className="text-zinc-500 hover:text-zinc-300 text-xs transition-colors"
        >
          Cancelar
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-zinc-400">Servicio *</label>
          <select
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
            required
            className="bg-zinc-800 border border-zinc-700 text-zinc-100 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-amber-500/50"
          >
            <option value="">Seleccionar servicio</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} — {s.durationMinutes} min
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-zinc-400">Fecha *</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            min={new Date().toISOString().slice(0, 10)}
            className="bg-zinc-800 border border-zinc-700 text-zinc-100 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-amber-500/50"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-zinc-400">Horario *</label>
          {loadingSlots ? (
            <p className="text-xs text-zinc-500 py-1">Cargando horarios...</p>
          ) : slots.length === 0 && serviceId && date ? (
            <p className="text-xs text-zinc-500 py-1">Sin horarios disponibles para esa fecha.</p>
          ) : (
            <select
              value={slot}
              onChange={(e) => setSlot(e.target.value)}
              required
              disabled={!slots.length}
              className="bg-zinc-800 border border-zinc-700 text-zinc-100 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-amber-500/50 disabled:opacity-40"
            >
              <option value="">Seleccionar horario</option>
              {slots.map((s) => (
                <option key={s} value={s}>
                  {s} hs
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-zinc-400">Nombre del cliente *</label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
            placeholder="Nombre y apellido"
            className="bg-zinc-800 border border-zinc-700 text-zinc-100 text-sm rounded-lg px-3 py-2.5 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/50"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-zinc-400">
            Email <span className="text-zinc-600">(opcional)</span>
          </label>
          <input
            type="email"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
            placeholder="cliente@email.com"
            className="bg-zinc-800 border border-zinc-700 text-zinc-100 text-sm rounded-lg px-3 py-2.5 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/50"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-zinc-400">
            Teléfono <span className="text-zinc-600">(opcional)</span>
          </label>
          <input
            type="tel"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            placeholder="+54 9 11 0000-0000"
            className="bg-zinc-800 border border-zinc-700 text-zinc-100 text-sm rounded-lg px-3 py-2.5 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/50"
          />
        </div>

        {error && <p className="text-xs text-red-400">{error}</p>}
        {success && <p className="text-xs text-emerald-400">Turno creado correctamente.</p>}

        <button
          type="submit"
          disabled={loading || success}
          className="w-full py-3 rounded-lg text-sm font-semibold bg-amber-500 text-zinc-950 hover:bg-amber-400 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? "Creando..." : "Crear turno"}
        </button>
      </form>
    </div>
  );
}
