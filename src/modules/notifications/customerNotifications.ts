import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/mailer";
import { formatARTTime, formatARTDateLabel } from "@/lib/tz";
import { buildEmail, detalleRow } from "./emailTemplate";

const SITE_URL = process.env.NEXTAUTH_URL ?? "https://shave-studio.com";

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
    subject: "Comprobante recibido — tu turno está en revisión",
    html: buildEmail({
      titulo: "COMPROBANTE RECIBIDO",
      nombre: booking.customerName,
      contenido: `<p style="color:#cccccc;font-size:15px;line-height:1.6;margin:0 0 16px;">
        Recibimos tu comprobante de pago. Tu reserva está <strong style="color:#ffffff;">pendiente de revisión</strong> — el barbero confirmará a la brevedad.
      </p>`,
      detalleRows: [
        detalleRow("Barbero", booking.barber.displayName),
        detalleRow("Servicio", booking.service.name),
        detalleRow("Fecha", dateLabel),
        detalleRow("Hora", `${timeLabel} hs`),
      ].join(""),
      bookingId: booking.id,
    }),
  });
}

export async function sendBookingConfirmedToCustomer(bookingId: string): Promise<void> {
  const booking = await fetchBookingForCustomer(bookingId);
  if (!booking?.customerEmail) return;

  const dateLabel = formatARTDateLabel(booking.startAt);
  const timeLabel = formatARTTime(booking.startAt);

  const cta = `<table cellpadding="0" cellspacing="0" style="margin-top:8px;">
    <tr>
      <td style="background:#e63946;padding:0;">
        <a href="${SITE_URL}/reservas"
           style="display:inline-block;padding:14px 32px;color:#ffffff;font-size:12px;
                  font-weight:bold;text-transform:uppercase;letter-spacing:2px;
                  text-decoration:none;">
          VER MI RESERVA
        </a>
      </td>
    </tr>
  </table>`;

  await sendEmail({
    to: booking.customerEmail,
    subject: "Turno confirmado — te esperamos",
    html: buildEmail({
      titulo: "TURNO CONFIRMADO",
      nombre: booking.customerName,
      contenido: `<p style="color:#cccccc;font-size:15px;line-height:1.6;margin:0 0 16px;">
        ¡Tu turno fue <strong style="color:#ffffff;">confirmado</strong>! Te esperamos.
      </p>`,
      detalleRows: [
        detalleRow("Barbero", booking.barber.displayName),
        detalleRow("Servicio", booking.service.name),
        detalleRow("Fecha", dateLabel),
        detalleRow("Hora", `${timeLabel} hs`),
      ].join(""),
      cta,
      bookingId: booking.id,
    }),
  });
}

export async function sendBookingRejectedToCustomer(bookingId: string): Promise<void> {
  const booking = await fetchBookingForCustomer(bookingId);
  if (!booking?.customerEmail) return;

  const dateLabel = formatARTDateLabel(booking.startAt);
  const timeLabel = formatARTTime(booking.startAt);

  await sendEmail({
    to: booking.customerEmail,
    subject: "Turno rechazado — comprobante no validado",
    html: buildEmail({
      titulo: "TURNO NO CONFIRMADO",
      nombre: booking.customerName,
      contenido: `<p style="color:#cccccc;font-size:15px;line-height:1.6;margin:0 0 16px;">
        Lamentablemente no pudimos confirmar tu turno. El comprobante de pago <strong style="color:#ffffff;">no fue validado</strong>.
      </p>`,
      detalleRows: [
        detalleRow("Barbero", booking.barber.displayName),
        detalleRow("Servicio", booking.service.name),
        detalleRow("Fecha", dateLabel),
        detalleRow("Hora", `${timeLabel} hs`),
      ].join(""),
      bookingId: booking.id,
    }),
  });
}
