import { prisma } from "@/lib/prisma";

export type BookingSettings = {
  paymentWindowMinutes: number;
  transferAlias: string;
  transferHolderName: string;
  transferCBUorCVU: string;
};

export type TransferInfo = {
  alias: string;
  holderName: string;
  cbuOrCvu: string;
};

const DEFAULTS: BookingSettings = {
  paymentWindowMinutes: 30,
  transferAlias: "",
  transferHolderName: "",
  transferCBUorCVU: "",
};

export async function getSettings(): Promise<BookingSettings> {
  const row = await prisma.bookingSettings.findUnique({ where: { id: "global" } });
  if (!row) return DEFAULTS;
  return {
    paymentWindowMinutes: row.paymentWindowMinutes,
    transferAlias: row.transferAlias,
    transferHolderName: row.transferHolderName,
    transferCBUorCVU: row.transferCBUorCVU,
  };
}

export function settingsToTransferInfo(s: BookingSettings): TransferInfo {
  return {
    alias: s.transferAlias,
    holderName: s.transferHolderName,
    cbuOrCvu: s.transferCBUorCVU,
  };
}
