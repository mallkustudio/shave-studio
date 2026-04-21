import { NextResponse } from "next/server";
import { getPublicBarbers } from "@/modules/barbers/queries";

export async function GET() {
  const data = await getPublicBarbers();
  return NextResponse.json({ data });
}
