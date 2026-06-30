import { NextRequest, NextResponse } from "next/server";
import { requireAuthBarber } from "@/lib/barber-auth";
import { updateBarberSettings } from "@/modules/barbers/mutations";

export async function PATCH(req: NextRequest) {
  const auth = await requireAuthBarber();
  if (auth instanceof NextResponse) return auth;

  const body = await req.json();
  const { depositPercentage, transferAlias, transferHolderName, transferCBUorCVU } = body;

  if (
    depositPercentage !== undefined &&
    (!Number.isInteger(depositPercentage) || depositPercentage < 0 || depositPercentage > 100)
  ) {
    return NextResponse.json(
      { error: "depositPercentage debe ser un entero entre 0 y 100" },
      { status: 400 }
    );
  }

  const updated = await updateBarberSettings(auth.barberId, {
    ...(depositPercentage !== undefined && { depositPercentage }),
    ...(transferAlias !== undefined && { transferAlias: (transferAlias as string).trim() }),
    ...(transferHolderName !== undefined && { transferHolderName: (transferHolderName as string).trim() }),
    ...(transferCBUorCVU !== undefined && { transferCBUorCVU: (transferCBUorCVU as string).trim() }),
  });

  return NextResponse.json({
    depositPercentage: updated.depositPercentage,
    transferAlias: updated.transferAlias,
    transferHolderName: updated.transferHolderName,
    transferCBUorCVU: updated.transferCBUorCVU,
  });
}
