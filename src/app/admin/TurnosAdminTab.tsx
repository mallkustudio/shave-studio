"use client";

import { formatARTTime, formatARTDateLabel, toARTDateKey } from "@/lib/tz";
import { formatARS } from "@/lib/money";
import { AdminBookingCard } from "./AdminBookingCard";
import type { AdminBookingItem } from "./AdminPanel";

type Props = { bookings: AdminBookingItem[] };

function groupByDate(bookings: AdminBookingItem[]) {
  const map = new Map<string, { label: string; items: AdminBookingItem[] }>();
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

export function TurnosAdminTab({ bookings }: Props) {
  const groups = groupByDate(bookings);

  if (groups.length === 0) {
    return (
      <div className="border border-zinc-800 bg-black/40 px-5 py-8 text-center">
        <p className="text-zinc-500 text-sm">No hay turnos próximos.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <p className="text-xs text-zinc-500">
        {bookings.length} turno{bookings.length !== 1 ? "s" : ""} próximo{bookings.length !== 1 ? "s" : ""}
      </p>

      {groups.map(({ key, label, items }) => (
        <section key={key} className="flex flex-col gap-3">
          <h2 className="text-xs uppercase tracking-widest text-zinc-500 capitalize">{label}</h2>
          <div className="flex flex-col gap-2">
            {items.map((b) => (
              <AdminBookingCard
                key={b.id}
                id={b.id}
                customerName={b.customerName}
                customerEmail={b.customerEmail}
                customerPhone={b.customerPhone}
                barberName={b.barberName}
                formattedTime={formatARTTime(new Date(b.startAt))}
                serviceName={b.serviceName}
                durationMinutes={b.serviceDurationMinutes}
                servicePrice={b.servicePrice}
                formattedPrice={formatARS(b.servicePrice)}
                depositAmount={b.depositAmount}
                discountAmount={b.discountAmount}
                status={b.status}
                paymentProofUrl={b.paymentProofUrl}
                paymentExpiresAt={b.paymentExpiresAt}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
