import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/modules/settings/queries";

export async function GET() {
  const settings = await getSettings();
  return NextResponse.json(settings);
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { paymentWindowMinutes } = body;

  if (
    paymentWindowMinutes !== undefined &&
    (!Number.isInteger(paymentWindowMinutes) || paymentWindowMinutes < 5 || paymentWindowMinutes > 1440)
  ) {
    return NextResponse.json(
      { error: "paymentWindowMinutes debe ser un entero entre 5 y 1440" },
      { status: 400 }
    );
  }

  const updated = await prisma.bookingSettings.upsert({
    where: { id: "global" },
    create: { id: "global", paymentWindowMinutes: paymentWindowMinutes ?? 30 },
    update: { ...(paymentWindowMinutes !== undefined && { paymentWindowMinutes }) },
  });

  return NextResponse.json({ paymentWindowMinutes: updated.paymentWindowMinutes });
}
