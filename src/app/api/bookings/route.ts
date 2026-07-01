import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { artMidnightUTC } from "@/lib/tz";
import { getSettings } from "@/modules/settings/queries";
import { Prisma } from "@prisma/client";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_CHARS_REGEX = /^[\d\s+\-()]+$/;

function validatePhone(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return "El teléfono es requerido";
  if (!PHONE_CHARS_REGEX.test(trimmed)) return "Formato de teléfono inválido";
  const digits = trimmed.replace(/\D/g, "");
  if (digits.length < 8 || digits.length > 15) return "El teléfono debe tener entre 8 y 15 dígitos";
  return null;
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { barberId, serviceId, date, slot, durationMinutes, fullName, email, phone, manual, discountAmount: rawDiscount } = body;

  const isManual = Boolean(manual);

  // Required field check
  if (!barberId || !serviceId || !date || !slot || !durationMinutes || !fullName) {
    return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
  }

  if (typeof fullName !== "string" || fullName.trim().length < 2) {
    return NextResponse.json({ error: "Nombre inválido" }, { status: 400 });
  }

  if (!isManual) {
    if (!email) {
      return NextResponse.json({ error: "El email es requerido" }, { status: 400 });
    }
    if (!EMAIL_REGEX.test((email as string).trim())) {
      return NextResponse.json({ error: "Email inválido" }, { status: 400 });
    }

    const phoneError = validatePhone(phone ?? "");
    if (phoneError) {
      return NextResponse.json({ error: phoneError }, { status: 400 });
    }
  } else {
    if (email && !EMAIL_REGEX.test((email as string).trim())) {
      return NextResponse.json({ error: "Email inválido" }, { status: 400 });
    }
  }

  // Reconstruct startAt using the exact same arithmetic as availability slot generation:
  //   slotStart = artMidnightUTC(date) + minutesFromMidnight
  const [slotH, slotMin] = (slot as string).split(":").map(Number);
  if (isNaN(slotH) || isNaN(slotMin)) {
    return NextResponse.json({ error: "Formato de horario inválido" }, { status: 400 });
  }

  const minutesFromMidnight = slotH * 60 + slotMin;
  const dayStart = artMidnightUTC(date);

  if (isNaN(dayStart.getTime())) {
    return NextResponse.json({ error: "Fecha inválida" }, { status: 400 });
  }

  const startAt = new Date(dayStart.getTime() + minutesFromMidnight * 60_000);
  const endAt = new Date(startAt.getTime() + Number(durationMinutes) * 60_000);

  // Re-check overlap before insert.
  // PENDING_PAYMENT only blocks if paymentExpiresAt is still in the future.
  const conflict = await prisma.booking.findFirst({
    where: {
      barberId,
      AND: [{ startAt: { lt: endAt } }, { endAt: { gt: startAt } }],
      OR: [
        { status: { in: ["PENDING_REVIEW", "CONFIRMED"] } },
        { status: "PENDING_PAYMENT", paymentExpiresAt: { gt: new Date() } },
      ],
    },
  });

  if (conflict) {
    return NextResponse.json(
      { error: "El horario ya no está disponible. Por favor elige otro." },
      { status: 409 }
    );
  }

  const [settings, barber, barberService] = await Promise.all([
    getSettings(),
    prisma.barber.findUnique({ where: { id: barberId }, select: { depositPercentage: true } }),
    prisma.barberService.findFirst({
      where: { barberId, serviceId },
      select: { customPrice: true, service: { select: { price: true } } },
    }),
  ]);

  const servicePrice = Number(barberService?.customPrice ?? barberService?.service.price ?? 0);
  const depositPercentage = barber?.depositPercentage ?? 100;
  // Manual bookings are CONFIRMED on creation — no deposit flow
  const depositAmount = isManual ? null : Math.round(servicePrice * depositPercentage / 100);

  // Discount: only valid for manual bookings
  let discountAmount: number | null = null;
  if (isManual && rawDiscount !== undefined && rawDiscount !== null) {
    const d = Math.round(Number(rawDiscount));
    if (isNaN(d) || d < 0) {
      return NextResponse.json({ error: "Descuento inválido" }, { status: 400 });
    }
    if (d > servicePrice) {
      return NextResponse.json({ error: "El descuento no puede ser mayor al precio del servicio" }, { status: 400 });
    }
    discountAmount = d > 0 ? d : null;
  }

  const paymentExpiresAt = isManual
    ? null
    : new Date(Date.now() + settings.paymentWindowMinutes * 60_000);

  let booking;
  try {
    booking = await prisma.booking.create({
      data: {
        barberId,
        serviceId,
        customerName: fullName.trim(),
        customerEmail: email ? (email as string).trim().toLowerCase() : "",
        customerPhone: phone?.trim() || null,
        startAt,
        endAt,
        status: isManual ? "CONFIRMED" : "PENDING_PAYMENT",
        paymentExpiresAt,
        depositAmount,
        discountAmount,
      },
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return NextResponse.json(
        { error: "El horario ya no está disponible. Por favor elegí otro." },
        { status: 409 }
      );
    }
    throw err;
  }

  return NextResponse.json(
    { bookingId: booking.id, paymentExpiresAt: booking.paymentExpiresAt?.toISOString() ?? null },
    { status: 201 }
  );
}
