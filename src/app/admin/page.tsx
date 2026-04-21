import { getAllUpcomingBookings, type AdminUpcomingBooking } from "@/modules/bookings/queries";
import { getSettings } from "@/modules/settings/queries";
import { formatARTTime, formatARTDateLabel, toARTDateKey } from "@/lib/tz";
import { formatARS } from "@/lib/money";
import { AdminBookingCard } from "./AdminBookingCard";
import { SettingsForm } from "./SettingsForm";

function groupByDate(
  bookings: AdminUpcomingBooking[]
): { key: string; label: string; bookings: AdminUpcomingBooking[] }[] {
  const map = new Map<string, { label: string; bookings: AdminUpcomingBooking[] }>();

  for (const booking of bookings) {
    const key = toARTDateKey(booking.startAt);
    if (!map.has(key)) {
      map.set(key, { label: formatARTDateLabel(booking.startAt), bookings: [] });
    }
    map.get(key)!.bookings.push(booking);
  }

  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => ({ key, ...value }));
}

type Props = {
  searchParams: Promise<{ admin?: string }>;
};

export default async function AdminPage({ searchParams }: Props) {
  const params = await searchParams;

  if (params.admin !== "true") {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-500 flex items-center justify-center text-sm">
        Acceso restringido.
      </div>
    );
  }

  const [bookings, settings] = await Promise.all([
    getAllUpcomingBookings(),
    getSettings(),
  ]);
  const groups = groupByDate(bookings);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 px-4 py-10 flex flex-col items-center">
      <div className="w-full max-w-xl flex flex-col gap-8">

        {/* Header */}
        <div>
          <p className="text-amber-500 text-xs uppercase tracking-widest mb-1">Panel de administrador</p>
          <h1 className="text-2xl font-semibold tracking-tight">Todos los turnos</h1>
          <p className="text-zinc-400 text-sm mt-1">
            {bookings.length === 0
              ? "No hay turnos próximos."
              : `${bookings.length} turno${bookings.length !== 1 ? "s" : ""} próximo${bookings.length !== 1 ? "s" : ""}`}
          </p>
        </div>

        {/* Settings */}
        <section className="flex flex-col gap-3">
          <h2 className="text-xs uppercase tracking-widest text-zinc-500">Configuración de pagos</h2>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-5">
            <SettingsForm initial={settings} />
          </div>
        </section>

        {/* Bookings */}
        {groups.length === 0 ? (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-8 text-center">
            <p className="text-zinc-500 text-sm">No hay turnos próximos.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {groups.map(({ key, label, bookings: dayBookings }) => (
              <section key={key} className="flex flex-col gap-3">

                {/* Date label */}
                <h2 className="text-xs uppercase tracking-widest text-zinc-500 capitalize">
                  {label}
                </h2>

                {/* Booking cards */}
                <div className="flex flex-col gap-2">
                  {dayBookings.map((booking) => (
                    <AdminBookingCard
                      key={booking.id}
                      id={booking.id}
                      customerName={booking.customerName}
                      customerEmail={booking.customerEmail}
                      customerPhone={booking.customerPhone}
                      barberName={booking.barberName}
                      formattedTime={formatARTTime(booking.startAt)}
                      serviceName={booking.service.name}
                      durationMinutes={booking.service.durationMinutes}
                      formattedPrice={formatARS(booking.service.price)}
                      status={booking.status}
                      paymentProofUrl={booking.paymentProofUrl}
                      paymentExpiresAt={booking.paymentExpiresAt?.toISOString() ?? null}
                    />
                  ))}
                </div>

              </section>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
