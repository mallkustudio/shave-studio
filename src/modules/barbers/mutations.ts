import { prisma } from "@/lib/prisma";
import { DayOfWeek } from "@prisma/client";

export async function updateBarberSettings(
  barberId: string,
  data: {
    depositPercentage?: number;
    transferAlias?: string;
    transferHolderName?: string;
    transferCBUorCVU?: string;
  }
) {
  return prisma.barber.update({ where: { id: barberId }, data });
}

export async function createBarberService(
  barberId: string,
  data: {
    name: string;
    description?: string;
    durationMinutes: number;
    price: number;
  }
) {
  const service = await prisma.service.create({
    data: { ...data, isActive: true },
  });
  return prisma.barberService.create({
    data: { barberId, serviceId: service.id, isActive: true },
  });
}

export async function updateBarberService(
  barberServiceId: string,
  data: { customPrice?: number; isActive?: boolean }
) {
  return prisma.barberService.update({ where: { id: barberServiceId }, data });
}

export async function updateAvailability(
  barberId: string,
  dayOfWeek: string,
  data: { startTime: string; endTime: string; isActive: boolean }
) {
  const [sh, sm] = data.startTime.split(":").map(Number);
  const [eh, em] = data.endTime.split(":").map(Number);
  // Time-sentinel: store time-of-day as 1970-01-01THH:MM:00Z (same pattern as seed.ts)
  const startTime = new Date(Date.UTC(1970, 0, 1, sh, sm, 0, 0));
  const endTime = new Date(Date.UTC(1970, 0, 1, eh, em, 0, 0));

  return prisma.availability.upsert({
    where: { barberId_dayOfWeek: { barberId, dayOfWeek: dayOfWeek as DayOfWeek } },
    create: { barberId, dayOfWeek: dayOfWeek as DayOfWeek, startTime, endTime, isActive: data.isActive },
    update: { startTime, endTime, isActive: data.isActive },
  });
}

export async function createBlockedTime(
  barberId: string,
  data: { startAt: Date; endAt: Date; reason?: string; createdById: string }
) {
  return prisma.blockedTime.create({ data: { barberId, ...data } });
}

export async function deleteBlockedTime(blockedTimeId: string) {
  return prisma.blockedTime.delete({ where: { id: blockedTimeId } });
}
