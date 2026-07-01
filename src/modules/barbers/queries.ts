import { prisma } from "@/lib/prisma";

export type TransferInfo = {
  alias: string | null;
  holderName: string | null;
  cbuOrCvu: string | null;
};

export type PublicBarber = {
  id: string;
  displayName: string;
  bio: string | null;
  avatarUrl: string | null;
  depositPercentage: number;
  availableDays: string[]; // e.g. ["MON","TUE","WED","THU","FRI","SAT"]
  services: {
    id: string;
    name: string;
    durationMinutes: number;
    price: number;
  }[];
  transferAlias: string | null;
  transferHolderName: string | null;
  transferCBUorCVU: string | null;
};


export async function getPublicBarbers(): Promise<PublicBarber[]> {
  const raw = await prisma.barber.findMany({
    where: { isActive: true },
    select: {
      id: true,
      displayName: true,
      bio: true,
      avatarUrl: true,
      depositPercentage: true,
      transferAlias: true,
      transferHolderName: true,
      transferCBUorCVU: true,
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
    depositPercentage: barber.depositPercentage,
    transferAlias: barber.transferAlias,
    transferHolderName: barber.transferHolderName,
    transferCBUorCVU: barber.transferCBUorCVU,
    availableDays: barber.availability.map((a) => a.dayOfWeek),
    services: barber.services.map(({ customPrice, service }) => ({
      id: service.id,
      name: service.name,
      durationMinutes: service.durationMinutes,
      price: Number(customPrice ?? service.price),
    })),
  }));
}
