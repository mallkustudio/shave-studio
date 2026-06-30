import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuthBarber } from "@/lib/barber-auth";
import { createBlockedTime } from "@/modules/barbers/mutations";

export async function GET() {
  const auth = await requireAuthBarber();
  if (auth instanceof NextResponse) return auth;

  const rows = await prisma.blockedTime.findMany({
    where: { barberId: auth.barberId, endAt: { gt: new Date() } },
    select: { id: true, startAt: true, endAt: true, reason: true, createdAt: true },
    orderBy: { startAt: "asc" },
  });

  return NextResponse.json({
    blockedTimes: rows.map((r) => ({
      id: r.id,
      startAt: r.startAt.toISOString(),
      endAt: r.endAt.toISOString(),
      reason: r.reason,
      createdAt: r.createdAt.toISOString(),
    })),
  });
}

export async function POST(req: NextRequest) {
  const auth = await requireAuthBarber();
  if (auth instanceof NextResponse) return auth;

  const body = await req.json();
  const { startAt: startRaw, endAt: endRaw, reason } = body;

  const startAt = new Date(startRaw);
  const endAt = new Date(endRaw);

  if (isNaN(startAt.getTime()) || isNaN(endAt.getTime())) {
    return NextResponse.json({ error: "startAt y endAt deben ser fechas válidas" }, { status: 400 });
  }
  if (startAt >= endAt) {
    return NextResponse.json({ error: "startAt debe ser anterior a endAt" }, { status: 400 });
  }

  const blocked = await createBlockedTime(auth.barberId, {
    startAt,
    endAt,
    reason: reason?.trim() ?? undefined,
    createdById: auth.userId,
  });

  return NextResponse.json(
    { id: blocked.id, startAt: blocked.startAt.toISOString(), endAt: blocked.endAt.toISOString(), reason: blocked.reason },
    { status: 201 }
  );
}
