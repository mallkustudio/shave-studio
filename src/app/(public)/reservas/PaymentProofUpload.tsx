"use client";

import { useState, useRef, useEffect } from "react";
import { formatARS } from "@/lib/money";
import type { TransferInfo } from "@/modules/settings/queries";

type Props = {
  bookingId: string;
  amount: number;
  paymentExpiresAt: string; // ISO string
  transferInfo: TransferInfo;
  onSuccess: () => void;
};

function getSecondsLeft(expiresAt: string): number {
  return Math.max(0, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1_000));
}

function formatCountdown(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export function PaymentProofUpload({ bookingId, amount, paymentExpiresAt, transferInfo, onSuccess }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(() => getSecondsLeft(paymentExpiresAt));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const id = setInterval(() => {
      const remaining = getSecondsLeft(paymentExpiresAt);
      setSecondsLeft(remaining);
      if (remaining <= 0) clearInterval(id);
    }, 1_000);
    return () => clearInterval(id);
  }, [paymentExpiresAt]);

  const isExpired = secondsLeft <= 0;
  const isUrgent = secondsLeft > 0 && secondsLeft <= 60;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file || isExpired) return;

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("bookingId", bookingId);

      const uploadRes = await fetch("/api/upload/proof", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json().catch(() => ({}));
      if (!uploadRes.ok) {
        setError(uploadData.error ?? "Error al subir el archivo.");
        return;
      }

      const paymentProofUrl: string = uploadData.url;

      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentProofUrl }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Error al enviar el comprobante.");
        return;
      }

      onSuccess();
    } catch {
      setError("Error de conexión. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">

      {/* Transfer instructions */}
      <section className="rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-4 flex flex-col gap-3">
        <h2 className="text-xs uppercase tracking-widest text-zinc-500">Instrucciones de transferencia</h2>
        <div className="grid grid-cols-2 gap-y-2 text-sm">
          {transferInfo.cbuOrCvu && (
            <>
              <span className="text-zinc-400">CBU / CVU</span>
              <span className="text-zinc-100 font-mono text-xs break-all">{transferInfo.cbuOrCvu}</span>
            </>
          )}
          {transferInfo.alias && (
            <>
              <span className="text-zinc-400">Alias</span>
              <span className="text-zinc-100">{transferInfo.alias}</span>
            </>
          )}
          {transferInfo.holderName && (
            <>
              <span className="text-zinc-400">Titular</span>
              <span className="text-zinc-100">{transferInfo.holderName}</span>
            </>
          )}
        </div>
        <div className="border-t border-zinc-800 pt-3 flex items-center justify-between">
          <span className="text-zinc-400 text-sm">Monto</span>
          <span className="text-amber-400 font-semibold text-base">{formatARS(amount)}</span>
        </div>
      </section>

      {/* Countdown notice */}
      {isExpired ? (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-5 py-4 flex flex-col gap-1">
          <p className="text-red-400 text-sm font-medium">El tiempo expiró</p>
          <p className="text-zinc-400 text-xs">
            El horario fue liberado. Para reservarlo nuevamente iniciá una nueva reserva.
          </p>
        </div>
      ) : (
        <div
          className={`rounded-xl border px-5 py-3 flex items-center justify-between gap-4 transition-colors duration-500
            ${isUrgent
              ? "border-red-500/30 bg-red-500/5"
              : "border-amber-500/20 bg-amber-500/5"
            }`}
        >
          <div className="flex flex-col gap-0.5">
            <p className={`text-sm font-medium ${isUrgent ? "text-red-400" : "text-amber-400"}`}>
              Tu horario está reservado
            </p>
            <p className="text-zinc-400 text-xs">
              Subí el comprobante antes de que expire el tiempo.
            </p>
          </div>
          <div className="shrink-0 flex flex-col items-center">
            <span
              className={`text-2xl font-mono font-semibold tabular-nums leading-none
                ${isUrgent ? "text-red-400" : "text-amber-400"}`}
            >
              {formatCountdown(secondsLeft)}
            </span>
            <span className="text-zinc-600 text-xs mt-0.5">restante</span>
          </div>
        </div>
      )}

      {/* File upload */}
      <section className="flex flex-col gap-2">
        <h2 className="text-xs uppercase tracking-widest text-zinc-500">Comprobante de pago</h2>
        <div
          onClick={() => !isExpired && inputRef.current?.click()}
          className={`rounded-xl border border-dashed px-5 py-6 flex flex-col items-center gap-2 transition-colors
            ${isExpired
              ? "border-zinc-800 bg-zinc-900/50 cursor-not-allowed opacity-50"
              : "border-zinc-700 bg-zinc-900 cursor-pointer hover:border-zinc-500"
            }`}
        >
          {file ? (
            <>
              <p className="text-sm text-zinc-200 text-center break-all">{file.name}</p>
              {!isExpired && <p className="text-xs text-zinc-500">Tocá para cambiar</p>}
            </>
          ) : (
            <>
              <p className="text-sm text-zinc-400 text-center">Tocá para adjuntar imagen o PDF</p>
              <p className="text-xs text-zinc-600">JPG, PNG o PDF</p>
            </>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*,.pdf"
          className="hidden"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
      </section>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={!file || loading || isExpired}
        className={`
          w-full py-3.5 rounded-xl text-sm font-semibold tracking-wide transition-all duration-150
          ${!file || loading || isExpired
            ? "bg-zinc-800 text-zinc-600 cursor-not-allowed"
            : "bg-amber-500 text-zinc-950 hover:bg-amber-400"
          }
        `}
      >
        {loading ? "Enviando..." : "Enviar comprobante"}
      </button>

    </form>
  );
}
