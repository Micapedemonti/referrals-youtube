/*
  Warnings:

  - You are about to drop the column `clickCount` on the `Referral` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Referral" DROP COLUMN "clickCount",
ADD COLUMN     "isExpired" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "Referral_code_idx" ON "public"."Referral"("code");

-- CreateIndex
CREATE INDEX "Referral_liveSessionId_idx" ON "public"."Referral"("liveSessionId");
