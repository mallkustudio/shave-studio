"use client";

import { useState } from "react";

type Props = {
  barberName: string;
  serviceName: string;
  date: string;           // "YYYY-MM-DD"
  slot: string;           // "HH:MM"
  barberId: string;
  serviceId: string;
  durationMinutes: number;
  onBack: () => void;
  onSuccess: (bookingId: string, paymentExpiresAt: string) => void;
};

function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Allow digits, spaces, +, parentheses, hyphen only
const PHONE_CHARS_REGEX = /^[\d\s+\-()]+$/;

function validatePhone(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return "El teléfono es requerido";
  if (!PHONE_CHARS_REGEX.test(trimmed)) return "Solo se permiten números, espacios y los caracteres + - ( )";
  const digits = trimmed.replace(/\D/g, "");
  if (digits.length < 8 || digits.length > 15) return "El teléfono debe tener entre 8 y 15 dígitos";
  return null;
}

type FieldErrors = {
  fullName?: string;
  email?: string;
  phone?: string;
};

function inputClass(hasError: boolean): string {
  return [
    "bg-black/40 backdrop-blur-sm border rounded-none px-4 py-3 text-sm text-white w-full",
    "placeholder:text-zinc-500 focus:outline-none transition-colors",
    hasError
      ? "border-red-500/60 focus:border-red-400"
      : "border-zinc-700 focus:border-white",
  ].join(" ");
}

export function BookingForm({
  barberName,
  serviceName,
  date,
  slot,
  barberId,
  serviceId,
  durationMinutes,
  onBack,
  onSuccess,
}: Props) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function validate(): FieldErrors {
    const errors: FieldErrors = {};

    if (!fullName.trim()) {
      errors.fullName = "El nombre es requerido";
    } else if (fullName.trim().length < 2) {
      errors.fullName = "Mínimo 2 caracteres";
    }

    if (!email.trim()) {
      errors.email = "El email es requerido";
    } else if (!EMAIL_REGEX.test(email.trim())) {
      errors.email = "Email inválido";
    }

    const phoneError = validatePhone(phone);
    if (phoneError) errors.phone = phoneError;

    return errors;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setLoading(true);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          barberId,
          serviceId,
          date,
          slot,
          durationMinutes,
          fullName: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (res.status === 409) {
          setError("Este horario ya no está disponible. Por favor elegí otro.");
        } else {
          setError(data.error ?? "Ocurrió un error. Intentá nuevamente.");
        }
        return;
      }

      onSuccess(data.bookingId, data.paymentExpiresAt);
    } catch {
      setError("Error de conexión. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-8">

      {/* Back */}
      <button
        type="button"
        onClick={onBack}
        className="self-start flex items-center gap-1.5 text-zinc-400 hover:text-zinc-200 text-sm transition-colors"
      >
        ← Volver
      </button>

      {/* Summary */}
      <section className="rounded-none border border-zinc-700 bg-black/40 backdrop-blur-sm px-5 py-4 text-sm">
        <h2 className="text-xs uppercase tracking-widest text-zinc-400 mb-3">Tu reserva</h2>
        <div className="grid grid-cols-2 gap-y-2">
          <span className="text-zinc-400">Barbero</span>
          <span className="text-zinc-300">{barberName}</span>
          <span className="text-zinc-400">Servicio</span>
          <span className="text-zinc-300">{serviceName}</span>
          <span className="text-zinc-400">Fecha</span>
          <span className="text-zinc-300">{formatDate(date)}</span>
          <span className="text-zinc-400">Hora</span>
          <span className="text-zinc-300">{slot} hs</span>
        </div>
      </section>

      {/* Fields */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xs uppercase tracking-widest text-zinc-400">5. Tus datos</h2>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-zinc-400 uppercase tracking-widest mb-1">Nombre completo *</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Juan Pérez"
            className={inputClass(Boolean(fieldErrors.fullName))}
          />
          {fieldErrors.fullName && (
            <p className="text-xs text-red-400">{fieldErrors.fullName}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-zinc-400 uppercase tracking-widest mb-1">Email *</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="juan@email.com"
            className={inputClass(Boolean(fieldErrors.email))}
          />
          {fieldErrors.email && (
            <p className="text-xs text-red-400">{fieldErrors.email}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-zinc-400 uppercase tracking-widest mb-1">Teléfono *</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+54 11 1234 5678"
            className={inputClass(Boolean(fieldErrors.phone))}
          />
          {fieldErrors.phone && (
            <p className="text-xs text-red-400">{fieldErrors.phone}</p>
          )}
        </div>
      </section>

      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className={`
          w-full py-4 rounded-none text-sm font-semibold uppercase tracking-widest transition-colors duration-200
          ${loading
            ? "bg-zinc-800 text-zinc-600 cursor-not-allowed"
            : "border border-white text-white bg-transparent hover:bg-white hover:text-black"
          }
        `}
      >
        {loading ? "Reservando..." : "Reservar y continuar al pago"}
      </button>

    </form>
  );
}
