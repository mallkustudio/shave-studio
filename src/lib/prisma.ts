import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({
  host: "aws-1-us-west-2.pooler.supabase.com",
  port: 5432,
  user: "postgres.ocfduuxsnpcjkqwmrpqh",
  password: process.env.DB_PASSWORD,
  database: "postgres",
  ssl: { rejectUnauthorized: false },
  family: 4,
});

const adapter = new PrismaPg(pool);
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };
export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
