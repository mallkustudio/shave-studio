"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatARS } from "@/lib/money";

type BookingStatus =
  | "PENDING_PAYMENT"
  | "PENDING_REVIEW"
  | "CONFIRMED"
  | "REJECTED"
  | "CANCELLED"
  | "PAYMENT_EXPIRED"
  | "NO_SHOW";

type Props = {
  id: string;
  customerName: string;
  customerEmail: string | null;
  customerPhone: string | null;
  barberName: string;
  formattedTime: string;
  serviceName: string;
  durationMinutes: number;
  servicePrice: number;
  formattedPrice: string;
  depositAmount: number | null;
  status: BookingStatus;
  paymentProofUrl: string | null;
  paymentExpiresAt: string | null; // ISO string
};

const STATUS_LABEL: Record<BookingStatus, string> = {
  PENDING_PAYMENT:  "Esperando pago",
  PENDING_REVIEW:   "En revisión",
  CONFIRMED:        "Confirmado",
  REJECTED:         "Rechazado",
  CANCELLED:        "Cancelado",
  PAYMENT_EXPIRED:  "Pago vencido",
  NO_SHOW:          "No se presentó",
};

const STATUS_CLASS: Record<BookingStatus, string> = {
  PENDING_PAYMENT:  "text-amber-400 bg-amber-500/10 border border-amber-500/20",
  PENDING_REVIEW:   "text-violet-400 bg-violet-500/10 border border-violet-500/20",
  CONFIRMED:        "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20",
  REJECTED:         "text-red-400 bg-red-500/10 border border-red-500/20",
  CANCELLED:        "text-zinc-400 bg-zinc-500/10 border border-zinc-500/20",
  PAYMENT_EXPIRED:  "text-red-400 bg-red-500/10 border border-red-500/20",
  NO_SHOW:          "text-zinc-400 bg-zinc-500/10 border border-zinc-500/20",
};

function formatARTDateTime(iso: string): string {
  return new Date(iso).toLocaleString("es-AR", {
    timeZone: "America/Argentina/Buenos_Aires",
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function AdminBookingCard({
  id,
  customerName,
  customerEmail,
  customerPhone,
  barberName,
  formattedTime,
  serviceName,
  durationMinutes,
  servicePrice,
  formattedPrice,
  depositAmount,
  status,
  paymentProofUrl,
  paymentExpiresAt,
}: Props) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function updateStatus(newStatus: "CONFIRMED" | "REJECTED" | "CANCELLED") {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Error al actualizar el turno.");
        return;
      }

      router.refresh();
    } catch {
      setError("Error de conexión. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  }

  const hasProof = Boolean(paymentProofUrl);
  const proofIsPublic = hasProof && paymentProofUrl!.startsWith("http");

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-4 flex flex-col gap-3">

      {/* Info row — click to expand */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex items-start justify-between gap-4 text-left w-full"
      >
        <div className="flex flex-col gap-1">
          <p className="text-base font-semibold text-zinc-100">{formattedTime} hs</p>
          <p className="text-sm text-zinc-200">{customerName}</p>
          <p className="text-sm text-zinc-400">
            {serviceName}
            <span className="text-zinc-600"> · </span>
            {durationMinutes} min
            <span className="text-zinc-600"> · </span>
            {depositAmount !== null && depositAmount < servicePrice
              ? <>Seña: {formatARS(depositAmount)}<span className="text-zinc-600"> / Total: {formattedPrice}</span></>
              : formattedPrice
            }
          </p>
          <p className="text-xs text-zinc-500 mt-0.5">{barberName}</p>
        </div>

        <span className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_CLASS[status]}`}>
          {STATUS_LABEL[status]}
        </span>
      </button>

      {/* Expanded details */}
      {expanded && (
        <div className="flex flex-col gap-2 border-t border-zinc-800 pt-3">

          {/* Contact info */}
          <div className="flex flex-col gap-1">
            {customerEmail && (
              <p className="text-xs text-zinc-400">
                <span className="text-zinc-600">Email · </span>{customerEmail}
              </p>
            )}
            {customerPhone && (
              <p className="text-xs text-zinc-400">
                <span className="text-zinc-600">Tel · </span>{customerPhone}
              </p>
            )}
            {!customerEmail && !customerPhone && (
              <p className="text-xs text-zinc-600">Sin datos de contacto.</p>
            )}
          </div>

          {/* Payment context */}
          {status === "PENDING_PAYMENT" && (
            <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2 flex flex-col gap-0.5">
              <p className="text-xs text-amber-400 font-medium">Esperando comprobante</p>
              {paymentExpiresAt && (
                <p className="text-xs text-zinc-500">
                  Vence el {formatARTDateTime(paymentExpiresAt)} hs
                </p>
              )}
            </div>
          )}

          {status === "PENDING_REVIEW" && (
            <div className="rounded-lg border border-violet-500/20 bg-violet-500/5 px-3 py-2 flex items-center justify-between gap-3">
              <p className="text-xs text-violet-400 font-medium">Comprobante recibido · pendiente de revisión</p>
              {proofIsPublic && (
                <a
                  href={paymentProofUrl!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 text-xs text-amber-400 hover:text-amber-300 underline underline-offset-2 transition-colors"
                >
                  Ver →
                </a>
              )}
            </div>
          )}

          {(status === "CONFIRMED" || status === "REJECTED" || status === "CANCELLED") && hasProof && (
            proofIsPublic ? (
              <a
                href={paymentProofUrl!}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-amber-400 hover:text-amber-300 underline underline-offset-2 transition-colors self-start"
              >
                Ver comprobante →
              </a>
            ) : (
              <p className="text-xs text-zinc-600">Comprobante adjunto (sin URL pública aún)</p>
            )
          )}

        </div>
      )}

      {/* Error */}
      {error && <p className="text-xs text-red-400">{error}</p>}

      {/* Actions */}
      <div className="flex gap-2">
        {status === "PENDING_REVIEW" && (
          <button
            disabled={loading}
            onClick={() => updateStatus("CONFIRMED")}
            className="flex-1 py-2 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Confirmar
          </button>
        )}
        {status === "PENDING_REVIEW" && (
          <button
            disabled={loading}
            onClick={() => updateStatus("REJECTED")}
            className="flex-1 py-2 rounded-lg text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Rechazar
          </button>
        )}
        {(status === "PENDING_PAYMENT" || status === "CONFIRMED") && (
          <button
            disabled={loading}
            onClick={() => updateStatus("CANCELLED")}
            className="flex-1 py-2 rounded-lg text-xs font-semibold bg-zinc-800 text-zinc-400 border border-zinc-700 hover:text-zinc-200 hover:border-zinc-600 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
        )}
      </div>

    </div>
  );
}
