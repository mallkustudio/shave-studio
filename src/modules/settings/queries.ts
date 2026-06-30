import { prisma } from "@/lib/prisma";

export type BookingSettings = {
  paymentWindowMinutes: number;
};

const DEFAULTS: BookingSettings = {
  paymentWindowMinutes: 30,
};

export async function getSettings(): Promise<BookingSettings> {
  const row = await prisma.bookingSettings.findUnique({ where: { id: "global" } });
  if (!row) return DEFAULTS;
  return { paymentWindowMinutes: row.paymentWindowMinutes };
}
