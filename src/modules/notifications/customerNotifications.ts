import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/mailer";
import { formatARTTime, formatARTDateLabel } from "@/lib/tz";

async function fetchBookingForCustomer(bookingId: string) {
  return prisma.booking.findUnique({
    where: { id: bookingId },
    select: {
      id: true,
      customerName: true,
      customerEmail: true,
      startAt: true,
      barber: { select: { displayName: true } },
      service: { select: { name: true } },
    },
  });
}

export async function sendProofConfirmationToCustomer(bookingId: string): Promise<void> {
  const booking = await fetchBookingForCustomer(bookingId);
  if (!booking?.customerEmail) return;

  const dateLabel = formatARTDateLabel(booking.startAt);
  const timeLabel = formatARTTime(booking.startAt);

  await sendEmail({
    to: booking.customerEmail,
    subject: `Comprobante recibido — tu turno está en revisión`,
    html: `
      <p>Hola ${booking.customerName},</p>
      <p>
        Recibimos tu comprobante de pago para el turno del
        <strong>${dateLabel} a las ${timeLabel} hs</strong>
        con <strong>${booking.barber.displayName}</strong>
        (${booking.service.name}).
      </p>
      <p>Tu reserva está <strong>pendiente de revisión</strong>. El barbero confirmará el pago a la brevedad.</p>
      <p style="color:#888;font-size:12px;">ID de reserva: ${booking.id}</p>
    `,
  });
}

export async function sendBookingConfirmedToCustomer(bookingId: string): Promise<void> {
  const booking = await fetchBookingForCustomer(bookingId);
  if (!booking?.customerEmail) return;

  const dateLabel = formatARTDateLabel(booking.startAt);
  const timeLabel = formatARTTime(booking.startAt);

  await sendEmail({
    to: booking.customerEmail,
    subject: `Turno confirmado — te esperamos`,
    html: `
      <p>Hola ${booking.customerName},</p>
      <p>
        Tu turno del <strong>${dateLabel} a las ${timeLabel} hs</strong>
        con <strong>${booking.barber.displayName}</strong>
        (${booking.service.name}) fue <strong>confirmado</strong>.
      </p>
      <p>¡Te esperamos!</p>
      <p style="color:#888;font-size:12px;">ID de reserva: ${booking.id}</p>
    `,
  });
}

export async function sendBookingRejectedToCustomer(bookingId: string): Promise<void> {
  const booking = await fetchBookingForCustomer(bookingId);
  if (!booking?.customerEmail) return;

  const dateLabel = formatARTDateLabel(booking.startAt);
  const timeLabel = formatARTTime(booking.startAt);

  await sendEmail({
    to: booking.customerEmail,
    subject: `Turno rechazado — comprobante no validado`,
    html: `
      <p>Hola ${booking.customerName},</p>
      <p>
        Lamentablemente, el comprobante de pago para tu turno del
        <strong>${dateLabel} a las ${timeLabel} hs</strong>
        con <strong>${booking.barber.displayName}</strong>
        (${booking.service.name}) no pudo ser validado.
      </p>
      <p>Tu reserva fue <strong>rechazada</strong>. Si creés que es un error, comunicate con el local.</p>
      <p style="color:#888;font-size:12px;">ID de reserva: ${booking.id}</p>
    `,
  });
}
