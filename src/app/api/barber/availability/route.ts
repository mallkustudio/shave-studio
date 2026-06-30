import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuthBarber } from "@/lib/barber-auth";
import { updateAvailability } from "@/modules/barbers/mutations";

const VALID_DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const TIME_RE = /^\d{2}:\d{2}$/;

function formatTime(dt: Date): string {
  return `${dt.getUTCHours().toString().padStart(2, "0")}:${dt.getUTCMinutes().toString().padStart(2, "0")}`;
}

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export async function GET() {
  const auth = await requireAuthBarber();
  if (auth instanceof NextResponse) return auth;

  const rows = await prisma.availability.findMany({
    where: { barberId: auth.barberId },
    select: { id: true, dayOfWeek: true, startTime: true, endTime: true, isActive: true },
    orderBy: { dayOfWeek: "asc" },
  });

  const availability = rows.map((r) => ({
    id: r.id,
    dayOfWeek: r.dayOfWeek,
    startTime: formatTime(r.startTime),
    endTime: formatTime(r.endTime),
    isActive: r.isActive,
  }));

  return NextResponse.json({ availability });
}

export async function PATCH(req: NextRequest) {
  const auth = await requireAuthBarber();
  if (auth instanceof NextResponse) return auth;

  const body = await req.json();
  const { dayOfWeek, startTime, endTime, isActive } = body;

  if (!VALID_DAYS.includes(dayOfWeek)) {
    return NextResponse.json({ error: "dayOfWeek inválido" }, { status: 400 });
  }
  if (!TIME_RE.test(startTime) || !TIME_RE.test(endTime)) {
    return NextResponse.json({ error: "startTime y endTime deben tener formato HH:MM" }, { status: 400 });
  }
  if (toMinutes(startTime) >= toMinutes(endTime)) {
    return NextResponse.json({ error: "startTime debe ser anterior a endTime" }, { status: 400 });
  }
  if (typeof isActive !== "boolean") {
    return NextResponse.json({ error: "isActive debe ser boolean" }, { status: 400 });
  }

  const updated = await updateAvailability(auth.barberId, dayOfWeek, { startTime, endTime, isActive });

  return NextResponse.json({
    id: updated.id,
    dayOfWeek: updated.dayOfWeek,
    startTime: formatTime(updated.startTime),
    endTime: formatTime(updated.endTime),
    isActive: updated.isActive,
  });
}
