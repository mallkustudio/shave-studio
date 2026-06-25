import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getUpcomingBookingsForBarber, type UpcomingBooking } from "@/modules/bookings/queries";
import { formatARTTime, formatARTDateLabel, toARTDateKey } from "@/lib/tz";
import { formatARS } from "@/lib/money";
import { BookingCard } from "./BookingCard";
import { ManualBookingForm } from "./ManualBookingForm";

function groupByDate(
  bookings: UpcomingBooking[]
): { key: string; label: string; bookings: UpcomingBooking[] }[] {
  const map = new Map<string, { label: string; bookings: UpcomingBooking[] }>();

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

export default async function BarberPage() {
  const session = await auth();
  const barberEmail = session?.user?.email;

  if (!barberEmail) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: barberEmail },
    select: { barber: { select: { id: true, displayName: true } } },
  });

  const barber = user?.barber;

  if (!barber) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-500 flex items-center justify-center text-sm">
        Barbero no encontrado.
      </div>
    );
  }

  const [bookings, barberServices] = await Promise.all([
    getUpcomingBookingsForBarber(barber.id),
    prisma.barber.findUnique({
      where: { id: barber.id },
      select: {
        services: {
          where: { isActive: true, service: { isActive: true } },
          select: {
            customPrice: true,
            service: { select: { id: true, name: true, durationMinutes: true, price: true } },
          },
        },
      },
    }),
  ]);

  const services = (barberServices?.services ?? []).map(({ customPrice, service }) => ({
    id: service.id,
    name: service.name,
    durationMinutes: service.durationMinutes,
    price: Number(customPrice ?? service.price),
  }));

  const groups = groupByDate(bookings);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 px-4 py-10 flex flex-col items-center">
      <div className="w-full max-w-xl flex flex-col gap-8">

        {/* Header */}
        <div>
          <p className="text-amber-500 text-xs uppercase tracking-widest mb-1">Panel de barbero</p>
          <h1 className="text-2xl font-semibold tracking-tight">{barber.displayName}</h1>
          <p className="text-zinc-400 text-sm mt-1">Próximos turnos</p>
        </div>

        {/* Manual booking */}
        <ManualBookingForm barberId={barber.id} services={services} />

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
                    <BookingCard
                      key={booking.id}
                      id={booking.id}
                      customerName={booking.customerName}
                      customerEmail={booking.customerEmail}
                      customerPhone={booking.customerPhone}
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
