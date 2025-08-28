-- CreateEnum
CREATE TYPE "public"."LiveStatus" AS ENUM ('WAITING', 'LIVE', 'ENDED');

-- CreateTable
CREATE TABLE "public"."LiveSession" (
    "id" TEXT NOT NULL,
    "status" "public"."LiveStatus" NOT NULL,
    "youtubeUrl" TEXT NOT NULL,
    "youtubeVideoId" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "channelTitle" TEXT NOT NULL,
    "videoTitle" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "LiveSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Referral" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "liveSessionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "openCount" INTEGER NOT NULL DEFAULT 0,
    "lastOpenedAt" TIMESTAMP(3),

    CONSTRAINT "Referral_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."YouTubeChannel" (
    "id" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "channelTitle" TEXT NOT NULL,
    "apiKey" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "YouTubeChannel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LiveSession_youtubeVideoId_key" ON "public"."LiveSession"("youtubeVideoId");

-- CreateIndex
CREATE INDEX "LiveSession_channelId_isActive_idx" ON "public"."LiveSession"("channelId", "isActive");

-- CreateIndex
CREATE INDEX "LiveSession_youtubeVideoId_idx" ON "public"."LiveSession"("youtubeVideoId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Referral_code_key" ON "public"."Referral"("code");

-- CreateIndex
CREATE INDEX "Referral_code_idx" ON "public"."Referral"("code");

-- CreateIndex
CREATE INDEX "Referral_liveSessionId_idx" ON "public"."Referral"("liveSessionId");

-- CreateIndex
CREATE INDEX "Referral_openCount_idx" ON "public"."Referral"("openCount" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "YouTubeChannel_channelId_key" ON "public"."YouTubeChannel"("channelId");

-- CreateIndex
CREATE INDEX "YouTubeChannel_channelId_isActive_idx" ON "public"."YouTubeChannel"("channelId", "isActive");

-- AddForeignKey
ALTER TABLE "public"."Referral" ADD CONSTRAINT "Referral_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Referral" ADD CONSTRAINT "Referral_liveSessionId_fkey" FOREIGN KEY ("liveSessionId") REFERENCES "public"."LiveSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
