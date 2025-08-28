/*
  Warnings:

  - You are about to drop the column `openCount` on the `Referral` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."Referral_openCount_idx";

-- AlterTable
ALTER TABLE "public"."Referral" DROP COLUMN "openCount";

-- CreateTable
CREATE TABLE "public"."Click" (
    "id" TEXT NOT NULL,
    "referralId" TEXT NOT NULL,
    "liveSessionId" TEXT NOT NULL,
    "ipHash" TEXT NOT NULL,
    "uaHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Click_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Click_ipHash_uaHash_liveSessionId_referralId_key" ON "public"."Click"("ipHash", "uaHash", "liveSessionId", "referralId");

-- AddForeignKey
ALTER TABLE "public"."Click" ADD CONSTRAINT "Click_referralId_fkey" FOREIGN KEY ("referralId") REFERENCES "public"."Referral"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Click" ADD CONSTRAINT "Click_liveSessionId_fkey" FOREIGN KEY ("liveSessionId") REFERENCES "public"."LiveSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
