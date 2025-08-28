/*
  Warnings:

  - You are about to drop the column `userId` on the `Referral` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Referral" DROP CONSTRAINT "Referral_userId_fkey";

-- AlterTable
ALTER TABLE "public"."Referral" DROP COLUMN "userId",
ADD COLUMN     "tradingView" TEXT NOT NULL DEFAULT 'unknown',
ADD COLUMN     "uidBitunix" TEXT NOT NULL DEFAULT 'unknown',
ADD COLUMN     "username" TEXT NOT NULL DEFAULT 'unknown';

-- DropTable
DROP TABLE "public"."User";
