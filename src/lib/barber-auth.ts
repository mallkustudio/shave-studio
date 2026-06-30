import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export type AuthBarber = { barberId: string; userId: string; role: string };

export async function requireAuthBarber(): Promise<AuthBarber | NextResponse> {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, role: true, barber: { select: { id: true } } },
  });

  if (!user?.barber) {
    return NextResponse.json({ error: "Sin perfil de barbero" }, { status: 403 });
  }

  return { barberId: user.barber.id, userId: user.id, role: user.role };
}
