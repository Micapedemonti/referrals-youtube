-- DropIndex
DROP INDEX "public"."Referral_code_idx";

-- DropIndex
DROP INDEX "public"."Referral_liveSessionId_idx";

-- AlterTable
ALTER TABLE "public"."Referral" ADD COLUMN     "clickCount" INTEGER NOT NULL DEFAULT 0;
