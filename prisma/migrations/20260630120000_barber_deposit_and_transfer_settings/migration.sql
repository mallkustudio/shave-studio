-- AlterTable Barber: add deposit and per-barber transfer fields
ALTER TABLE "Barber" ADD COLUMN "depositPercentage" INTEGER NOT NULL DEFAULT 50;
ALTER TABLE "Barber" ADD COLUMN "transferAlias" TEXT;
ALTER TABLE "Barber" ADD COLUMN "transferHolderName" TEXT;
ALTER TABLE "Barber" ADD COLUMN "transferCBUorCVU" TEXT;

-- AlterTable BookingSettings: remove global transfer fields (moved to Barber)
ALTER TABLE "BookingSettings" DROP COLUMN "transferAlias";
ALTER TABLE "BookingSettings" DROP COLUMN "transferHolderName";
ALTER TABLE "BookingSettings" DROP COLUMN "transferCBUorCVU";
