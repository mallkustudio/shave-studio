import { prisma } from "@/lib/prisma";

export type AdminUpcomingBooking = {
  id: string;
  barberName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  startAt: Date;
  endAt: Date;
  status: "PENDING_PAYMENT" | "PENDING_REVIEW" | "CONFIRMED" | "REJECTED" | "CANCELLED" | "PAYMENT_EXPIRED" | "NO_SHOW";
  paymentProofUrl: string | null;
  paymentExpiresAt: Date | null;
  depositAmount: number | null;
  discountAmount: number | null;
  service: {
    name: string;
    durationMinutes: number;
    price: number;
  };
};

export async function getAllUpcomingBookings(): Promise<AdminUpcomingBooking[]> {
  const now = new Date();

  const bookings = await prisma.booking.findMany({
    where: {
      status: { in: ["PENDING_PAYMENT", "PENDING_REVIEW", "CONFIRMED"] },
      startAt: { gte: now },
    },
    orderBy: { startAt: "asc" },
    select: {
      id: true,
      customerName: true,
      customerEmail: true,
      customerPhone: true,
      startAt: true,
      endAt: true,
      status: true,
      paymentProofUrl: true,
      paymentExpiresAt: true,
      depositAmount: true,
      discountAmount: true,
      barber: { select: { displayName: true } },
      service: {
        select: {
          name: true,
          durationMinutes: true,
          price: true,
        },
      },
    },
  });

  return bookings.map((b) => ({
    id: b.id,
    barberName: b.barber.displayName,
    customerName: b.customerName,
    customerEmail: b.customerEmail,
    customerPhone: b.customerPhone,
    startAt: b.startAt,
    endAt: b.endAt,
    status: b.status as AdminUpcomingBooking["status"],
    paymentProofUrl: b.paymentProofUrl,
    paymentExpiresAt: b.paymentExpiresAt,
    depositAmount: b.depositAmount,
    discountAmount: b.discountAmount,
    service: {
      name: b.service.name,
      durationMinutes: b.service.durationMinutes,
      price: Number(b.service.price),
    },
  }));
}

export type UpcomingBooking = {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  startAt: Date;
  endAt: Date;
  status: "PENDING_PAYMENT" | "PENDING_REVIEW" | "CONFIRMED" | "REJECTED" | "CANCELLED" | "PAYMENT_EXPIRED" | "NO_SHOW";
  paymentProofUrl: string | null;
  paymentExpiresAt: Date | null;
  depositAmount: number | null;
  discountAmount: number | null;
  service: {
    name: string;
    durationMinutes: number;
    price: number;
  };
};

export async function getUpcomingBookingsForBarber(
  barberId: string
): Promise<UpcomingBooking[]> {
  const now = new Date();

  const bookings = await prisma.booking.findMany({
    where: {
      barberId,
      status: { in: ["PENDING_PAYMENT", "PENDING_REVIEW", "CONFIRMED"] },
      startAt: { gte: now },
    },
    orderBy: { startAt: "asc" },
    select: {
      id: true,
      customerName: true,
      customerEmail: true,
      customerPhone: true,
      startAt: true,
      endAt: true,
      status: true,
      paymentProofUrl: true,
      paymentExpiresAt: true,
      depositAmount: true,
      discountAmount: true,
      service: {
        select: {
          name: true,
          durationMinutes: true,
          price: true,
        },
      },
    },
  });

  return bookings.map((b) => ({
    ...b,
    status: b.status as UpcomingBooking["status"],
    paymentExpiresAt: b.paymentExpiresAt,
    service: {
      ...b.service,
      price: Number(b.service.price),
    },
  }));
}
