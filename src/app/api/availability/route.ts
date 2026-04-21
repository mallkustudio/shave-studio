import { NextRequest, NextResponse } from "next/server";
import { getAvailableSlots } from "@/modules/availability/queries";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const barberId = searchParams.get("barberId");
  const date = searchParams.get("date");
  const durationMinutes = Number(searchParams.get("durationMinutes"));

  if (!barberId || !date || !durationMinutes) {
    return NextResponse.json({ error: "Missing required params" }, { status: 400 });
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
  }

  const result = await getAvailableSlots(barberId, date, durationMinutes);
  return NextResponse.json(result);
}
