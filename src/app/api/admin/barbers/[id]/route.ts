import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { BookingStatus } from "@prisma/client";

async function requireAdmin() {
  const session = await auth();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  return null;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const { id } = await params;
  const body = await req.json();
  const { isActive } = body;

  if (typeof isActive !== "boolean") {
    return NextResponse.json({ error: "isActive debe ser boolean" }, { status: 400 });
  }

  const barber = await prisma.barber.findUnique({ where: { id }, select: { id: true } });
  if (!barber) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

  const updated = await prisma.barber.update({ where: { id }, data: { isActive } });
  return NextResponse.json({ id: updated.id, isActive: updated.isActive });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireAdmin();
  if (authError) return authError;

  const { id } = await params;

  const barber = await prisma.barber.findUnique({
    where: { id },
    select: { id: true, userId: true },
  });
  if (!barber) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

  // Block deletion if there are active future bookings
  const activeBookingsCount = await prisma.booking.count({
    where: {
      barberId: id,
      startAt: { gt: new Date() },
      status: {
        in: [
          BookingStatus.PENDING_PAYMENT,
          BookingStatus.PENDING_REVIEW,
          BookingStatus.CONFIRMED,
        ],
      },
    },
  });

  if (activeBookingsCount > 0) {
    return NextResponse.json(
      { error: "No se puede eliminar, tiene turnos futuros activos" },
      { status: 409 }
    );
  }

  // Cascade delete in FK-safe order
  await prisma.$transaction(async (tx) => {
    await tx.barberService.deleteMany({ where: { barberId: id } });
    await tx.availability.deleteMany({ where: { barberId: id } });
    // BlockedTime: both as the barber and as the creator (non-nullable FK)
    await tx.blockedTime.deleteMany({ where: { barberId: id } });
    await tx.blockedTime.deleteMany({ where: { createdById: barber.userId } });
    // Bookings: delete historical bookings for this barber
    await tx.booking.deleteMany({ where: { barberId: id } });
    // Nullify createdById for manual bookings this user created for other barbers
    await tx.booking.updateMany({
      where: { createdById: barber.userId },
      data: { createdById: null },
    });
    await tx.barber.delete({ where: { id } });
    await tx.user.delete({ where: { id: barber.userId } });
  });

  return new NextResponse(null, { status: 204 });
}
