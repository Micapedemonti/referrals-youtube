-- AlterTable
ALTER TABLE "public"."Click" ADD COLUMN     "sessionId" TEXT;

-- CreateIndex
CREATE INDEX "Click_referralId_liveSessionId_sessionId_idx" ON "public"."Click"("referralId", "liveSessionId", "sessionId");
