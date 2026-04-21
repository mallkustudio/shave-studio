import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/mailer";
import { formatARTTime, formatARTDateLabel } from "@/lib/tz";

export async function sendProofReceivedNotification(bookingId: string): Promise<void> {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    select: {
      id: true,
      customerName: true,
      startAt: true,
      paymentProofUrl: true,
      barber: {
        select: {
          displayName: true,
          user: { select: { email: true } },
        },
      },
      service: { select: { name: true } },
    },
  });

  if (!booking?.barber.user.email || !booking.paymentProofUrl) return;

  const barberEmail = booking.barber.user.email;
  const barberName = booking.barber.displayName;
  const dateLabel = formatARTDateLabel(booking.startAt);
  const timeLabel = formatARTTime(booking.startAt);
  const proofLink = booking.paymentProofUrl;

  await sendEmail({
    to: barberEmail,
    subject: `Nuevo comprobante de pago — ${booking.customerName}`,
    html: `
      <p>Hola ${barberName},</p>
      <p>
        <strong>${booking.customerName}</strong> subió un comprobante de pago
        para su turno del <strong>${dateLabel} a las ${timeLabel} hs</strong>
        (${booking.service.name}).
      </p>
      <p><a href="${proofLink}">Ver comprobante →</a></p>
      <p>Ingresá al panel para confirmar o rechazar el turno.</p>
      <p style="color:#888;font-size:12px;">ID de reserva: ${booking.id}</p>
    `,
  });
}
