import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuthBarber } from "@/lib/barber-auth";
import { deleteBlockedTime } from "@/modules/barbers/mutations";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuthBarber();
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;

  const existing = await prisma.blockedTime.findUnique({
    where: { id },
    select: { barberId: true },
  });
  if (!existing || existing.barberId !== auth.barberId) {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  }

  await deleteBlockedTime(id);
  return new NextResponse(null, { status: 204 });
}
