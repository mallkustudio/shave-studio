-- CreateTable
CREATE TABLE "BookingSettings" (
    "id" TEXT NOT NULL DEFAULT 'global',
    "paymentWindowMinutes" INTEGER NOT NULL DEFAULT 30,
    "transferAlias" TEXT NOT NULL DEFAULT '',
    "transferHolderName" TEXT NOT NULL DEFAULT '',
    "transferCBUorCVU" TEXT NOT NULL DEFAULT '',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BookingSettings_pkey" PRIMARY KEY ("id")
);
