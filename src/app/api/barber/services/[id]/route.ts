import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuthBarber } from "@/lib/barber-auth";
import { updateBarberService } from "@/modules/barbers/mutations";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuthBarber();
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;

  const existing = await prisma.barberService.findUnique({
    where: { id },
    select: { barberId: true },
  });
  if (!existing || existing.barberId !== auth.barberId) {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  }

  const body = await req.json();
  const { customPrice, isActive } = body;

  if (customPrice !== undefined && (typeof customPrice !== "number" || customPrice < 0)) {
    return NextResponse.json({ error: "customPrice debe ser un número positivo o null" }, { status: 400 });
  }

  const updated = await updateBarberService(id, {
    ...(customPrice !== undefined && { customPrice }),
    ...(isActive !== undefined && { isActive }),
  });

  return NextResponse.json(updated);
}
