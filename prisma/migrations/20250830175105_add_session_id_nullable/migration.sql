/*
  Warnings:

  - A unique constraint covering the columns `[ipHash,uaHash,liveSessionId,referralId]` on the table `Click` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Click_ipHash_uaHash_liveSessionId_referralId_key" ON "public"."Click"("ipHash", "uaHash", "liveSessionId", "referralId");
