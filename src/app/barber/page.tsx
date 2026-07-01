import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getUpcomingBookingsForBarber } from "@/modules/bookings/queries";
import { BarberPanel } from "./BarberPanel";
import type { BarberInfo, BarberServiceItem, AvailabilityItem, BlockedTimeItem, BookingItem } from "./BarberPanel";

export default async function BarberPage() {
  const session = await auth();
  const barberEmail = session?.user?.email;

  if (!barberEmail) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { email: barberEmail },
    select: {
      barber: {
        select: {
          id: true,
          displayName: true,
          depositPercentage: true,
          transferAlias: true,
          transferHolderName: true,
          transferCBUorCVU: true,
        },
      },
    },
  });

  const barberRaw = user?.barber;

  if (!barberRaw) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-500 flex items-center justify-center text-sm">
        Barbero no encontrado.
      </div>
    );
  }

  const [bookingsRaw, servicesRaw, availabilityRaw, blockedTimesRaw] = await Promise.all([
    getUpcomingBookingsForBarber(barberRaw.id),
    prisma.barberService.findMany({
      where: { barberId: barberRaw.id, service: { isActive: true } },
      select: {
        id: true,
        customPrice: true,
        isActive: true,
        service: {
          select: { id: true, name: true, description: true, durationMinutes: true, price: true },
        },
      },
      orderBy: { service: { name: "asc" } },
    }),
    prisma.availability.findMany({
      where: { barberId: barberRaw.id },
      select: { id: true, dayOfWeek: true, startTime: true, endTime: true, isActive: true },
    }),
    prisma.blockedTime.findMany({
      where: { barberId: barberRaw.id, endAt: { gt: new Date() } },
      select: { id: true, startAt: true, endAt: true, reason: true, createdAt: true },
      orderBy: { startAt: "asc" },
    }),
  ]);

  const barber: BarberInfo = barberRaw;

  const services: BarberServiceItem[] = servicesRaw.map(({ id, customPrice, isActive, service }) => ({
    id,
    serviceId: service.id,
    name: service.name,
    description: service.description,
    durationMinutes: service.durationMinutes,
    basePrice: Number(service.price),
    customPrice: customPrice !== null ? Number(customPrice) : null,
    effectivePrice: Number(customPrice ?? service.price),
    isActive,
  }));

  function fmtTime(dt: Date): string {
    return `${dt.getUTCHours().toString().padStart(2, "0")}:${dt.getUTCMinutes().toString().padStart(2, "0")}`;
  }

  const availability: AvailabilityItem[] = availabilityRaw.map((a) => ({
    id: a.id,
    dayOfWeek: a.dayOfWeek,
    startTime: fmtTime(a.startTime),
    endTime: fmtTime(a.endTime),
    isActive: a.isActive,
  }));

  const blockedTimes: BlockedTimeItem[] = blockedTimesRaw.map((bt) => ({
    id: bt.id,
    startAt: bt.startAt.toISOString(),
    endAt: bt.endAt.toISOString(),
    reason: bt.reason,
    createdAt: bt.createdAt.toISOString(),
  }));

  const bookings: BookingItem[] = bookingsRaw.map((b) => ({
    id: b.id,
    customerName: b.customerName,
    customerEmail: b.customerEmail,
    customerPhone: b.customerPhone,
    startAt: b.startAt.toISOString(),
    serviceName: b.service.name,
    serviceDurationMinutes: b.service.durationMinutes,
    servicePrice: b.service.price,
    depositAmount: b.depositAmount,
    status: b.status,
    paymentProofUrl: b.paymentProofUrl,
    paymentExpiresAt: b.paymentExpiresAt?.toISOString() ?? null,
  }));

  return (
    <BarberPanel
      barber={barber}
      services={services}
      availability={availability}
      blockedTimes={blockedTimes}
      bookings={bookings}
    />
  );
}
