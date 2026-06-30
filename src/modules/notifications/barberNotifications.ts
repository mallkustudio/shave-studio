import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/mailer";
import { formatARTTime, formatARTDateLabel } from "@/lib/tz";
import { buildEmail, detalleRow } from "./emailTemplate";

const SITE_URL = process.env.NEXTAUTH_URL ?? "https://shave-studio.com";

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

  const cta = `<table cellpadding="0" cellspacing="0" style="margin-top:8px;">
    <tr>
      <td style="background:#e63946;padding:0;">
        <a href="${SITE_URL}/barber"
           style="display:inline-block;padding:14px 32px;color:#ffffff;font-size:12px;
                  font-weight:bold;text-transform:uppercase;letter-spacing:2px;
                  text-decoration:none;">
          IR AL PANEL
        </a>
      </td>
    </tr>
  </table>`;

  await sendEmail({
    to: barberEmail,
    subject: `Nuevo comprobante de pago — ${booking.customerName}`,
    html: buildEmail({
      titulo: "NUEVO COMPROBANTE",
      nombre: barberName,
      contenido: `<p style="color:#cccccc;font-size:15px;line-height:1.6;margin:0 0 16px;">
        Un cliente subió un comprobante de pago y está esperando <strong style="color:#ffffff;">confirmación</strong>.
      </p>`,
      detalleRows: [
        detalleRow("Cliente", booking.customerName),
        detalleRow("Servicio", booking.service.name),
        detalleRow("Fecha", dateLabel),
        detalleRow("Hora", `${timeLabel} hs`),
      ].join(""),
      cta,
      bookingId: booking.id,
    }),
  });
}
