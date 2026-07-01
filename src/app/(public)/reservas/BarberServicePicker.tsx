"use client";

import { useState } from "react";
import type { PublicBarber } from "@/modules/barbers/queries";
import { DateTimePicker } from "./DateTimePicker";
import { BookingForm } from "./BookingForm";
import { PaymentProofUpload } from "./PaymentProofUpload";
import { formatARS } from "@/lib/money";

type Step = "selection" | "datetime" | "confirm" | "payment" | "success";

type Props = {
  barbers: PublicBarber[];
  initialBarberId?: string | null;
  initialServiceId?: string | null;
};

export function BarberServicePicker({ barbers, initialBarberId = null, initialServiceId = null }: Props) {
  const [step, setStep] = useState<Step>("selection");
  const [selectedBarberId, setSelectedBarberId] = useState<string | null>(initialBarberId);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(initialServiceId);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [paymentExpiresAt, setPaymentExpiresAt] = useState<string | null>(null);

  const selectedBarber = barbers.find((b) => b.id === selectedBarberId) ?? null;
  const selectedService = selectedBarber?.services.find((s) => s.id === selectedServiceId) ?? null;

  function handleSelectBarber(id: string) {
    setSelectedBarberId(id);
    setSelectedServiceId(null);
  }

  const canContinue = selectedBarberId !== null && selectedServiceId !== null;

  return (
    <div className="min-h-screen text-zinc-100 px-4 py-10 flex flex-col items-center">
      <div className="w-full max-w-xl flex flex-col gap-10">

        {/* Header */}
        <div className="text-center">
          <p className="text-[#e63946] text-xs uppercase tracking-widest mb-2">SHAVE STUDIO</p>
          <h1 className="text-3xl font-black tracking-widest uppercase">Reserva tu turno</h1>
          <p className="text-zinc-400 text-sm mt-1 tracking-wide">
            {step === "selection" && "Elige tu barbero y el servicio"}
            {step === "datetime" && "Elige el día y la hora"}
            {step === "confirm" && "Confirmá tu reserva"}
            {step === "payment" && "Realizá el pago"}
            {step === "success" && "Comprobante enviado"}
          </p>
        </div>

        {step === "selection" && (
          <>
            {/* Step 1 — Barber selection */}
            <section className="flex flex-col gap-3">
              <h2 className="text-xs uppercase tracking-widest text-zinc-400">
                1. ELIGE TU BARBERO
              </h2>
              <div className="flex flex-col gap-3">
                {barbers.map((barber) => {
                  const isSelected = barber.id === selectedBarberId;
                  return (
                    <button
                      key={barber.id}
                      onClick={() => handleSelectBarber(barber.id)}
                      className={`
                        w-full text-left rounded-none border px-5 py-4 transition-all duration-150 backdrop-blur-sm
                        ${isSelected
                          ? "border-[#e63946] bg-black/40"
                          : "border-zinc-700 bg-black/40 hover:border-zinc-400"
                        }
                      `}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-bold text-white uppercase">{barber.displayName}</p>
                          {barber.bio && (
                            <p className="text-zinc-400 text-sm mt-0.5 leading-snug">{barber.bio}</p>
                          )}
                        </div>
                        <span
                          className={`
                            shrink-0 w-4 h-4 rounded-full border-2 transition-all
                            ${isSelected ? "border-[#e63946] bg-[#e63946]" : "border-zinc-600"}
                          `}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Step 2 — Service selection */}
            {selectedBarber && (
              <section className="flex flex-col gap-3">
                <h2 className="text-xs uppercase tracking-widest text-zinc-400">
                  2. ELIGE EL SERVICIO
                </h2>
                <div className="flex flex-col gap-3">
                  {selectedBarber.services.map((service) => {
                    const isSelected = service.id === selectedServiceId;
                    return (
                      <button
                        key={service.id}
                        onClick={() => setSelectedServiceId(service.id)}
                        className={`
                          w-full text-left rounded-none border px-5 py-4 transition-all duration-150 backdrop-blur-sm
                          ${isSelected
                            ? "border-[#e63946] bg-black/40"
                            : "border-zinc-700 bg-black/40 hover:border-zinc-400"
                          }
                        `}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="font-bold text-white uppercase">{service.name}</p>
                            <p className="text-zinc-400 text-sm mt-0.5">{service.durationMinutes} min</p>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <span className="text-[#e63946] font-semibold">{formatARS(service.price)}</span>
                            <span
                              className={`
                                w-4 h-4 rounded-full border-2 transition-all
                                ${isSelected ? "border-[#e63946] bg-[#e63946]" : "border-zinc-600"}
                              `}
                            />
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Continue to date/time */}
            <div className="pt-2">
              <button
                disabled={!canContinue}
                onClick={() => canContinue && setStep("datetime")}
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
          </>
        )}

        {step === "confirm" && selectedBarber && selectedService && selectedDate && selectedSlot && (
          <BookingForm
            barberName={selectedBarber.displayName}
            serviceName={selectedService.name}
            date={selectedDate}
            slot={selectedSlot}
            barberId={selectedBarber.id}
            serviceId={selectedService.id}
            durationMinutes={selectedService.durationMinutes}
            onBack={() => setStep("datetime")}
            onSuccess={(id, expiresAt) => {
              setBookingId(id);
              setPaymentExpiresAt(expiresAt);
              setStep("payment");
            }}
          />
        )}

        {step === "payment" && selectedBarber && selectedService && bookingId && paymentExpiresAt && (
          <PaymentProofUpload
            bookingId={bookingId}
            depositAmount={Math.round(selectedService.price * (selectedBarber.depositPercentage ?? 100) / 100)}
            totalAmount={selectedService.price}
            depositPercentage={selectedBarber.depositPercentage ?? 100}
            paymentExpiresAt={paymentExpiresAt}
            transferInfo={{
              alias: selectedBarber.transferAlias,
              holderName: selectedBarber.transferHolderName,
              cbuOrCvu: selectedBarber.transferCBUorCVU,
            }}
            onSuccess={() => setStep("success")}
          />
        )}

        {step === "success" && selectedBarber && selectedService && selectedDate && selectedSlot && (
          <div className="flex flex-col items-center gap-6 py-8 text-center">

            {/* Icon */}
            <div className="w-16 h-16 rounded-full bg-[#e63946]/10 border border-[#e63946]/30 flex items-center justify-center text-2xl">
              ✓
            </div>

            {/* Title */}
            <div className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold text-zinc-100">Comprobante recibido</h2>
              <p className="text-zinc-400 text-sm">
                Tu reserva con <span className="text-zinc-200">{selectedBarber.displayName}</span> está
                pendiente de revisión. El barbero confirmará el pago a la brevedad.
              </p>
            </div>

            {/* Summary */}
            <div className="rounded-none border border-zinc-700 bg-black/40 backdrop-blur-sm px-5 py-4 text-sm w-full text-left">
              <h3 className="text-xs uppercase tracking-widest text-zinc-400 mb-3">Detalle</h3>
              <div className="grid grid-cols-2 gap-y-2.5">
                <span className="text-zinc-400">Barbero</span>
                <span className="text-zinc-100">{selectedBarber.displayName}</span>
                <span className="text-zinc-400">Servicio</span>
                <span className="text-zinc-100">{selectedService.name}</span>
                <span className="text-zinc-400">Precio</span>
                <span className="text-[#e63946] font-medium">{formatARS(selectedService.price)}</span>
                <span className="text-zinc-400">Fecha</span>
                <span className="text-zinc-100">{selectedDate.split("-").reverse().join("/")}</span>
                <span className="text-zinc-400">Hora</span>
                <span className="text-zinc-100">{selectedSlot} hs</span>
              </div>
            </div>

            <p className="text-zinc-500 text-xs">Te avisaremos cuando el turno sea confirmado.</p>

            {/* Actions */}
            <div className="flex flex-col gap-3 w-full pt-2">
              <button
                onClick={() => {
                  setSelectedDate(null);
                  setSelectedSlot(null);
                  setBookingId(null);
                  setPaymentExpiresAt(null);
                  setStep("selection");
                }}
                className="w-full py-4 rounded-none text-sm font-semibold uppercase tracking-widest border border-white text-white bg-transparent hover:bg-white hover:text-black transition-colors duration-200"
              >
                Volver al inicio
              </button>
              <button
                onClick={() => {
                  setSelectedBarberId(null);
                  setSelectedServiceId(null);
                  setSelectedDate(null);
                  setSelectedSlot(null);
                  setBookingId(null);
                  setPaymentExpiresAt(null);
                  setStep("selection");
                }}
                className="w-full py-4 rounded-none text-sm font-semibold uppercase tracking-widest border border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:border-zinc-500 transition-all duration-150"
              >
                Hacer otra reserva
              </button>
            </div>

          </div>
        )}

        {step === "datetime" && selectedBarber && selectedService && (
          <>
            {/* Selection summary */}
            <div className="flex items-center justify-between rounded-none border border-zinc-700 bg-black/40 backdrop-blur-sm px-5 py-3 text-sm">
              <div>
                <span className="text-zinc-400">Barbero: </span>
                <span className="text-zinc-100">{selectedBarber.displayName}</span>
              </div>
              <div>
                <span className="text-zinc-400">Servicio: </span>
                <span className="text-zinc-100">{selectedService.name}</span>
              </div>
            </div>

            <DateTimePicker
              barberId={selectedBarber.id}
              durationMinutes={selectedService.durationMinutes}
              availableDays={selectedBarber.availableDays}
              onBack={() => setStep("selection")}
              onSelect={(date, slot) => {
                setSelectedDate(date);
                setSelectedSlot(slot);
                setStep("confirm");
              }}
            />
          </>
        )}

      </div>
    </div>
  );
}
