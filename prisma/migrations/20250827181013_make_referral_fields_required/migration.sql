-- DropIndex
DROP INDEX "public"."Click_ipHash_uaHash_liveSessionId_referralId_key";

-- AlterTable
ALTER TABLE "public"."Referral" ALTER COLUMN "tradingView" DROP DEFAULT,
ALTER COLUMN "uidBitunix" DROP DEFAULT,
ALTER COLUMN "username" DROP DEFAULT;
