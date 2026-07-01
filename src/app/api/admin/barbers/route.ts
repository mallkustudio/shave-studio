import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";

function timeOnly(hours: number, minutes = 0): Date {
  return new Date(Date.UTC(1970, 0, 1, hours, minutes, 0, 0));
}

export async function POST(req: NextRequest) {
  const session = await auth();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await req.json();
  const { name, email, password, role, specialty, bio } = body;

  if (!name || !email || !password || !specialty) {
    return NextResponse.json({ error: "Campos requeridos incompletos" }, { status: 400 });
  }
  if (typeof password !== "string" || password.length < 6) {
    return NextResponse.json({ error: "La contraseña debe tener al menos 6 caracteres" }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const validRole = role === "ADMIN" ? "ADMIN" : "BARBER";
  const combinedBio = [specialty, bio].filter(Boolean).join("\n") || null;

  try {
    const barber = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: { name, email, role: validRole, passwordHash },
      });

      const b = await tx.barber.create({
        data: { userId: user.id, displayName: name, bio: combinedBio, isActive: true },
      });

      // Default availability: Mar–Sáb 09:00–21:00
      const days = ["TUE", "WED", "THU", "FRI", "SAT"] as const;
      for (const day of days) {
        await tx.availability.create({
          data: {
            barberId: b.id,
            dayOfWeek: day,
            startTime: timeOnly(9),
            endTime: timeOnly(21),
            isActive: true,
          },
        });
      }

      return b;
    });

    return NextResponse.json(
      {
        id: barber.id,
        displayName: barber.displayName,
        isActive: barber.isActive,
        depositPercentage: barber.depositPercentage,
        transferAlias: barber.transferAlias,
        transferHolderName: barber.transferHolderName,
        transferCBUorCVU: barber.transferCBUorCVU,
      },
      { status: 201 }
    );
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return NextResponse.json({ error: "Ya existe un usuario con ese email" }, { status: 409 });
    }
    throw err;
  }
}
