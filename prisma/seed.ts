import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Helper: build a DateTime representing a time-of-day on a fixed reference date.
// Availability.startTime / endTime are DateTime fields used purely for time-of-day.
function timeOnly(hours: number, minutes = 0): Date {
  return new Date(Date.UTC(1970, 0, 1, hours, minutes, 0, 0));
}

async function main() {
  // ── Password hashes ────────────────────────────────────────────────────────

  const adminHash = await bcrypt.hash("admin2024", 10);
  const amadoHash = await bcrypt.hash("amado2024", 10);
  const lucasHash = await bcrypt.hash("lucas2024", 10);

  // ── Users ─────────────────────────────────────────────────────────────────

  await prisma.user.upsert({
    where: { email: "admin@shave-studio.com" },
    update: { passwordHash: adminHash, name: "Admin" },
    create: {
      name: "Admin",
      email: "admin@shave-studio.com",
      role: "ADMIN",
      passwordHash: adminHash,
    },
  });

  const userAmado = await prisma.user.upsert({
    where: { email: "amado@shave-studio.com" },
    update: { passwordHash: amadoHash, name: "Amado Cáceres" },
    create: {
      name: "Amado Cáceres",
      email: "amado@shave-studio.com",
      role: "ADMIN",
      passwordHash: amadoHash,
    },
  });

  const userLucas = await prisma.user.upsert({
    where: { email: "lucas@shave-studio.com" },
    update: { passwordHash: lucasHash, name: "Lucas Frenchi" },
    create: {
      name: "Lucas Frenchi",
      email: "lucas@shave-studio.com",
      role: "ADMIN",
      passwordHash: lucasHash,
    },
  });

  // ── Barbers ───────────────────────────────────────────────────────────────

  const barberAmado = await prisma.barber.upsert({
    where: { userId: userAmado.id },
    update: { displayName: "Amado Cáceres" },
    create: {
      userId: userAmado.id,
      displayName: "Amado Cáceres",
      bio: "15 años perfeccionando el arte del afeitado clásico y los cortes de precisión.",
      avatarUrl: null,
      isActive: true,
    },
  });

  const barberLucas = await prisma.barber.upsert({
    where: { userId: userLucas.id },
    update: { displayName: "Lucas Frenchi" },
    create: {
      userId: userLucas.id,
      displayName: "Lucas Frenchi",
      bio: "Especialista en cortes modernos, degradados y diseño de barba.",
      avatarUrl: null,
      isActive: true,
    },
  });

  // ── Services ──────────────────────────────────────────────────────────────
  // Idempotent via findFirst — no unique constraint on name in schema.

  const serviceDefinitions = [
    {
      key: "corte-clasico",
      name: "Corte Clásico",
      description: "Corte tradicional con tijera y navaja de acabado.",
      durationMinutes: 30,
      price: 15,
    },
    {
      key: "afeitado-navaja",
      name: "Afeitado con Navaja",
      description: "Afeitado completo con navaja, toalla caliente y bálsamo.",
      durationMinutes: 45,
      price: 20,
    },
    {
      key: "corte-barba",
      name: "Corte y Barba",
      description: "Corte de cabello más arreglo y perfilado de barba.",
      durationMinutes: 60,
      price: 30,
    },
    {
      key: "tratamiento-barba",
      name: "Tratamiento de Barba",
      description: "Hidratación, aceite y perfilado profesional de barba.",
      durationMinutes: 30,
      price: 18,
    },
  ];

  const services: Record<string, { id: string }> = {};

  for (const s of serviceDefinitions) {
    let service = await prisma.service.findFirst({ where: { name: s.name } });
    if (!service) {
      service = await prisma.service.create({
        data: {
          name: s.name,
          description: s.description,
          durationMinutes: s.durationMinutes,
          price: s.price,
          isActive: true,
        },
      });
    }
    services[s.key] = service;
  }

  // ── Barber–Service assignments ────────────────────────────────────────────

  const assignments: { barberId: string; serviceId: string; customPrice?: number }[] = [
    // Amado: all four services, no custom prices
    { barberId: barberAmado.id, serviceId: services["corte-clasico"].id },
    { barberId: barberAmado.id, serviceId: services["afeitado-navaja"].id },
    { barberId: barberAmado.id, serviceId: services["corte-barba"].id },
    { barberId: barberAmado.id, serviceId: services["tratamiento-barba"].id },
    // Lucas: three services, custom price on Corte y Barba
    { barberId: barberLucas.id, serviceId: services["corte-clasico"].id },
    { barberId: barberLucas.id, serviceId: services["corte-barba"].id, customPrice: 28 },
    { barberId: barberLucas.id, serviceId: services["tratamiento-barba"].id },
  ];

  for (const a of assignments) {
    await prisma.barberService.upsert({
      where: { barberId_serviceId: { barberId: a.barberId, serviceId: a.serviceId } },
      update: {},
      create: {
        barberId: a.barberId,
        serviceId: a.serviceId,
        customPrice: a.customPrice ?? null,
        isActive: true,
      },
    });
  }

  // ── Availability ──────────────────────────────────────────────────────────
  // Mon–Fri: 09:00–19:00 | Sat: 10:00–16:00 | Sun: closed

  const weekdays = ["MON", "TUE", "WED", "THU", "FRI"] as const;
  const allBarbers = [barberAmado.id, barberLucas.id];

  for (const barberId of allBarbers) {
    for (const day of weekdays) {
      await prisma.availability.upsert({
        where: { barberId_dayOfWeek: { barberId, dayOfWeek: day } },
        update: {},
        create: {
          barberId,
          dayOfWeek: day,
          startTime: timeOnly(9),
          endTime: timeOnly(19),
          isActive: true,
        },
      });
    }

    await prisma.availability.upsert({
      where: { barberId_dayOfWeek: { barberId, dayOfWeek: "SAT" } },
      update: {},
      create: {
        barberId,
        dayOfWeek: "SAT",
        startTime: timeOnly(10),
        endTime: timeOnly(16),
        isActive: true,
      },
    });
  }

  console.log("Seed complete");
  console.log("  Users:        admin@shave-studio.com (ADMIN), amado@shave-studio.com (BARBER), lucas@shave-studio.com (BARBER)");
  console.log(`  Barbers:      ${barberAmado.displayName}, ${barberLucas.displayName}`);
  console.log(`  Services:     ${serviceDefinitions.map((s) => s.name).join(", ")}`);
  console.log("  Availability: Mon–Fri 09:00–19:00 | Sat 10:00–16:00");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
