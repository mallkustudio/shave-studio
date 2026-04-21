import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendProofReceivedNotification } from "@/modules/notifications/barberNotifications";
import {
  sendProofConfirmationToCustomer,
  sendBookingConfirmedToCustomer,
  sendBookingRejectedToCustomer,
} from "@/modules/notifications/customerNotifications";

const ALLOWED_STATUSES = ["CONFIRMED", "REJECTED", "CANCELLED"] as const;
type AllowedStatus = (typeof ALLOWED_STATUSES)[number];

function isValidProofUrl(url: unknown): url is string {
  return (
    typeof url === "string" &&
    (url.startsWith("https://") || url.startsWith("local://"))
  );
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { status, paymentProofUrl } = body;

  // Exactly one operation must be present
  if (!status && !paymentProofUrl) {
    return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
  }
  if (status && paymentProofUrl) {
    return NextResponse.json({ error: "Operación ambigua" }, { status: 400 });
  }

  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking) {
    return NextResponse.json({ error: "Turno no encontrado" }, { status: 404 });
  }

  // ── Operation A: proof upload → PENDING_PAYMENT to PENDING_REVIEW ────────
  if (paymentProofUrl !== undefined) {
    if (!isValidProofUrl(paymentProofUrl)) {
      return NextResponse.json({ error: "URL de comprobante inválida" }, { status: 400 });
    }

    if (booking.status !== "PENDING_PAYMENT") {
      return NextResponse.json(
        { error: "Solo se puede adjuntar comprobante en estado PENDING_PAYMENT" },
        { status: 409 }
      );
    }

    // If the payment window has expired, mark it and reject the upload
    if (booking.paymentExpiresAt && booking.paymentExpiresAt < new Date()) {
      await prisma.booking.update({
        where: { id },
        data: { status: "PAYMENT_EXPIRED" },
      });
      return NextResponse.json(
        { error: "El tiempo para subir el comprobante ha expirado." },
        { status: 409 }
      );
    }

    const updated = await prisma.booking.update({
      where: { id },
      data: { paymentProofUrl, status: "PENDING_REVIEW" },
      select: { id: true, status: true },
    });

    // booking.status was verified PENDING_PAYMENT above — transition is guaranteed
    sendProofReceivedNotification(id).catch((err) =>
      console.error("[notification] barber proof email failed:", err)
    );
    sendProofConfirmationToCustomer(id).catch((err) =>
      console.error("[notification] customer proof email failed:", err)
    );

    return NextResponse.json(updated);
  }

  // ── Operation B: barber/admin status change ──────────────────────────────
  if (!ALLOWED_STATUSES.includes(status as AllowedStatus)) {
    return NextResponse.json({ error: "Estado inválido" }, { status: 400 });
  }

  if (status === "CONFIRMED") {
    const conflict = await prisma.booking.findFirst({
      where: {
        id: { not: id },
        barberId: booking.barberId,
        status: "CONFIRMED",
        startAt: { lt: booking.endAt },
        endAt: { gt: booking.startAt },
      },
    });

    if (conflict) {
      return NextResponse.json(
        { error: "El barbero ya tiene un turno confirmado en ese horario." },
        { status: 409 }
      );
    }
  }

  const previousStatus = booking.status;

  const updated = await prisma.booking.update({
    where: { id },
    data: {
      status,
      cancelledAt: status === "CANCELLED" ? new Date() : undefined,
      reviewedAt: status === "CONFIRMED" || status === "REJECTED" ? new Date() : undefined,
    },
    select: { id: true, status: true },
  });

  // Only notify on actual status transitions to avoid duplicate emails
  if (status === "CONFIRMED" && previousStatus !== "CONFIRMED") {
    sendBookingConfirmedToCustomer(id).catch((err) =>
      console.error("[notification] customer confirmed email failed:", err)
    );
  } else if (status === "REJECTED" && previousStatus !== "REJECTED") {
    sendBookingRejectedToCustomer(id).catch((err) =>
      console.error("[notification] customer rejected email failed:", err)
    );
  }

  return NextResponse.json(updated);
}
