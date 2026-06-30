export function detalleRow(label: string, value: string): string {
  return `<tr>
    <td style="color:#666666;font-size:12px;text-transform:uppercase;letter-spacing:1px;padding:4px 0;width:40%;">${label}</td>
    <td style="color:#ffffff;font-size:14px;font-weight:bold;padding:4px 0;">${value}</td>
  </tr>`;
}

export function buildEmail(opts: {
  titulo: string;
  nombre: string;
  contenido: string;
  detalleRows: string;
  cta?: string;
  bookingId: string;
}): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#111111;border:1px solid #222222;max-width:600px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="padding:30px 40px;border-bottom:1px solid #222222;">
            <p style="margin:0;color:#e63946;font-size:11px;letter-spacing:3px;text-transform:uppercase;font-weight:bold;">SHAVES STUDIO</p>
            <p style="margin:6px 0 0;color:#ffffff;font-size:20px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;">${opts.titulo}</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:40px;">
            <p style="color:#cccccc;font-size:15px;line-height:1.6;margin:0 0 24px;">
              Hola <strong style="color:#ffffff;">${opts.nombre}</strong>,
            </p>

            ${opts.contenido}

            <table width="100%" cellpadding="0" cellspacing="0" style="background:#1a1a1a;border-left:3px solid #e63946;margin:24px 0;padding:0;">
              <tr><td style="padding:20px 24px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  ${opts.detalleRows}
                </table>
              </td></tr>
            </table>

            ${opts.cta ?? ""}
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:20px 40px;border-top:1px solid #222222;">
            <p style="margin:0;color:#444444;font-size:11px;">© 2026 Shaves Studio · <a href="https://maps.google.com/?q=Av+Dorrego+1865,+Palermo,+Buenos+Aires" style="color:#e63946;text-decoration:none;">Av. Dorrego 1865 3B, Palermo, CABA</a></p>
            <p style="margin:4px 0 0;color:#333333;font-size:10px;">ID de reserva: ${opts.bookingId}</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
