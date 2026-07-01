import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getAllUpcomingBookings } from "@/modules/bookings/queries";
import { getSettings } from "@/modules/settings/queries";
import { AdminPanel } from "./AdminPanel";
import type { AdminBookingItem, AdminBarberItem } from "./AdminPanel";

export default async function AdminPage() {
  const session = await auth();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!session || (session.user as any).role !== "ADMIN") redirect("/login");

  const adminName = session.user?.name ?? "Admin";

  const [bookingsRaw, barberRaw, settings] = await Promise.all([
    getAllUpcomingBookings(),
    prisma.barber.findMany({
      select: {
        id: true,
        displayName: true,
        isActive: true,
        depositPercentage: true,
        transferAlias: true,
        transferHolderName: true,
        transferCBUorCVU: true,
      },
      orderBy: { displayName: "asc" },
    }),
    getSettings(),
  ]);

  const bookings: AdminBookingItem[] = bookingsRaw.map((b) => ({
    id: b.id,
    customerName: b.customerName,
    customerEmail: b.customerEmail,
    customerPhone: b.customerPhone,
    barberName: b.barberName,
    startAt: b.startAt.toISOString(),
    serviceName: b.service.name,
    serviceDurationMinutes: b.service.durationMinutes,
    servicePrice: b.service.price,
    depositAmount: b.depositAmount,
    status: b.status,
    paymentProofUrl: b.paymentProofUrl,
    paymentExpiresAt: b.paymentExpiresAt?.toISOString() ?? null,
  }));

  const barbers: AdminBarberItem[] = barberRaw;

  return (
    <AdminPanel
      adminName={adminName}
      bookings={bookings}
      barbers={barbers}
      settings={settings}
    />
  );
}
