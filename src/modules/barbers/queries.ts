import { prisma } from "@/lib/prisma";

export type PublicBarber = {
  id: string;
  displayName: string;
  bio: string | null;
  avatarUrl: string | null;
  availableDays: string[]; // e.g. ["MON","TUE","WED","THU","FRI","SAT"]
  services: {
    id: string;
    name: string;
    durationMinutes: number;
    price: number;
  }[];
};

export async function getPublicBarbers(): Promise<PublicBarber[]> {
  const raw = await prisma.barber.findMany({
    where: { isActive: true },
    select: {
      id: true,
      displayName: true,
      bio: true,
      avatarUrl: true,
      availability: {
        where: { isActive: true },
        select: { dayOfWeek: true },
      },
      services: {
        where: {
          isActive: true,
          service: { isActive: true },
        },
        select: {
          customPrice: true,
          service: {
            select: {
              id: true,
              name: true,
              durationMinutes: true,
              price: true,
            },
          },
        },
      },
    },
  });

  return raw.map((barber) => ({
    id: barber.id,
    displayName: barber.displayName,
    bio: barber.bio,
    avatarUrl: barber.avatarUrl,
    availableDays: barber.availability.map((a) => a.dayOfWeek),
    services: barber.services.map(({ customPrice, service }) => ({
      id: service.id,
      name: service.name,
      durationMinutes: service.durationMinutes,
      price: Number(customPrice ?? service.price),
    })),
  }));
}
