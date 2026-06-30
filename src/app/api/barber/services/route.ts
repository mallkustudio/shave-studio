import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuthBarber } from "@/lib/barber-auth";
import { createBarberService } from "@/modules/barbers/mutations";

export async function GET() {
  const auth = await requireAuthBarber();
  if (auth instanceof NextResponse) return auth;

  const rows = await prisma.barberService.findMany({
    where: { barberId: auth.barberId },
    select: {
      id: true,
      customPrice: true,
      isActive: true,
      service: {
        select: { id: true, name: true, description: true, durationMinutes: true, price: true },
      },
    },
    orderBy: { service: { name: "asc" } },
  });

  const services = rows.map(({ id, customPrice, isActive, service }) => ({
    id,
    serviceId: service.id,
    name: service.name,
    description: service.description,
    durationMinutes: service.durationMinutes,
    basePrice: Number(service.price),
    customPrice: customPrice !== null ? Number(customPrice) : null,
    effectivePrice: Number(customPrice ?? service.price),
    isActive,
  }));

  return NextResponse.json({ services });
}

export async function POST(req: NextRequest) {
  const auth = await requireAuthBarber();
  if (auth instanceof NextResponse) return auth;

  const body = await req.json();
  const { name, description, durationMinutes, price } = body;

  if (!name || typeof name !== "string" || name.trim() === "") {
    return NextResponse.json({ error: "name es requerido" }, { status: 400 });
  }
  if (!Number.isInteger(durationMinutes) || durationMinutes < 1) {
    return NextResponse.json({ error: "durationMinutes debe ser un entero positivo" }, { status: 400 });
  }
  if (typeof price !== "number" || price < 0) {
    return NextResponse.json({ error: "price debe ser un número positivo" }, { status: 400 });
  }

  const barberService = await createBarberService(auth.barberId, {
    name: name.trim(),
    description: description?.trim() ?? undefined,
    durationMinutes,
    price,
  });

  return NextResponse.json(barberService, { status: 201 });
}
