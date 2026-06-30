"use client";

import { formatARTTime, formatARTDateLabel, toARTDateKey } from "@/lib/tz";
import { formatARS } from "@/lib/money";
import { ManualBookingForm } from "./ManualBookingForm";
import { BookingCard } from "./BookingCard";
import type { BarberInfo, BarberServiceItem, BookingItem } from "./BarberPanel";

type Props = {
  barber: BarberInfo;
  bookings: BookingItem[];
  services: BarberServiceItem[];
};

function groupByDate(bookings: BookingItem[]) {
  const map = new Map<string, { label: string; items: BookingItem[] }>();
  for (const b of bookings) {
    const date = new Date(b.startAt);
    const key = toARTDateKey(date);
    if (!map.has(key)) {
      map.set(key, { label: formatARTDateLabel(date), items: [] });
    }
    map.get(key)!.items.push(b);
  }
  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => ({ key, ...value }));
}

export function TurnosTab({ barber, bookings, services }: Props) {
  const manualFormServices = services
    .filter((s) => s.isActive)
    .map((s) => ({ id: s.serviceId, name: s.name, durationMinutes: s.durationMinutes, price: s.effectivePrice }));

  const groups = groupByDate(bookings);

  return (
    <div className="flex flex-col gap-8">

      <ManualBookingForm barberId={barber.id} services={manualFormServices} />

      {groups.length === 0 ? (
        <div className="rounded-none border border-zinc-800 bg-black/40 px-5 py-8 text-center">
          <p className="text-zinc-500 text-sm">No hay turnos próximos.</p>
        </div>
      ) : (
        groups.map(({ key, label, items }) => (
          <section key={key} className="flex flex-col gap-3">
            <h2 className="text-xs uppercase tracking-widest text-zinc-500 capitalize">{label}</h2>
            <div className="flex flex-col gap-2">
              {items.map((b) => (
                <BookingCard
                  key={b.id}
                  id={b.id}
                  customerName={b.customerName}
                  customerEmail={b.customerEmail}
                  customerPhone={b.customerPhone}
                  formattedTime={formatARTTime(new Date(b.startAt))}
                  serviceName={b.serviceName}
                  durationMinutes={b.serviceDurationMinutes}
                  formattedPrice={formatARS(b.servicePrice)}
                  status={b.status}
                  paymentProofUrl={b.paymentProofUrl}
                  paymentExpiresAt={b.paymentExpiresAt}
                />
              ))}
            </div>
          </section>
        ))
      )}

    </div>
  );
}
