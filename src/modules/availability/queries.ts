import { prisma } from "@/lib/prisma";
import { artMidnightUTC } from "@/lib/tz";
import { BookingStatus } from "@prisma/client";

export type SlotResult = {
  slots: string[]; // "HH:MM" in Argentina local time (America/Argentina/Buenos_Aires)
};

// Maps JS getUTCDay() (0=Sun) to schema DayOfWeek enum values
const JS_DAY_TO_ENUM: Record<number, string> = {
  0: "SUN",
  1: "MON",
  2: "TUE",
  3: "WED",
  4: "THU",
  5: "FRI",
  6: "SAT",
};

// Returns total minutes from midnight for a time-sentinel DateTime
// (stored as 1970-01-01THH:MM:00Z in the DB — the HH:MM represents local ART time)
function toMinutes(dt: Date): number {
  return dt.getUTCHours() * 60 + dt.getUTCMinutes();
}

function formatMinutes(minutes: number): string {
  const h = Math.floor(minutes / 60).toString().padStart(2, "0");
  const m = (minutes % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}

export async function getAvailableSlots(
  barberId: string,
  date: string, // "YYYY-MM-DD" — Argentina local date
  durationMinutes: number
): Promise<SlotResult> {
  // Full ART day expressed as a UTC range:
  //   00:00 ART = 03:00 UTC  →  23:59:59.999 ART = 02:59:59.999 UTC next day
  const dayStart = artMidnightUTC(date);
  const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60_000 - 1);

  const dayOfWeek = JS_DAY_TO_ENUM[dayStart.getUTCDay()];

  // Fetch barber availability for this day of the week
  const availability = await prisma.availability.findUnique({
    where: {
      barberId_dayOfWeek: { barberId, dayOfWeek: dayOfWeek as never },
      isActive: true,
    },
    select: { startTime: true, endTime: true },
  });

  if (!availability) {
    return { slots: [] };
  }

  // Fetch existing bookings for this barber within the ART day (UTC range)
  // PENDING_PAYMENT only blocks if the payment window hasn't expired yet.
  const bookings = await prisma.booking.findMany({
    where: {
      barberId,
      startAt: { gte: dayStart, lte: dayEnd },
      OR: [
        { status: { in: [BookingStatus.PENDING_REVIEW, BookingStatus.CONFIRMED] } },
        { status: BookingStatus.PENDING_PAYMENT, paymentExpiresAt: { gt: new Date()  } },
      ],
    },
    select: { startAt: true, endAt: true },
  });

  // Generate slots
  // availability times are stored as 1970-01-01THH:MM:00Z — read via getUTCHours/Minutes
  // to get the local ART time value (e.g. 09:00 → 540 minutes)
  const availStart = toMinutes(availability.startTime);
  const availEnd = toMinutes(availability.endTime);
  const slots: string[] = [];

  for (let m = availStart; m + durationMinutes <= availEnd; m += durationMinutes) {
    // slotStart in real UTC: ART midnight (03:00Z) + local minutes offset
    // e.g. m=540 → 03:00Z + 9h = 12:00Z = 09:00 ART ✓
    const slotStart = new Date(dayStart.getTime() + m * 60_000);
    const slotEnd = new Date(slotStart.getTime() + durationMinutes * 60_000);

    // Never return slots that have already started (relevant for today)
    if (slotStart <= new Date()) continue;

    const hasConflict = bookings.some(
      (b) => b.startAt < slotEnd && b.endAt > slotStart
    );

    if (!hasConflict) {
      slots.push(formatMinutes(m)); // returned as "HH:MM" ART local time
    }
  }

  return { slots };
}
