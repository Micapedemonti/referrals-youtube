import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LiveSessionService {
  constructor(private prisma: PrismaService) {}

async getActiveLiveSessions() {
  return this.prisma.liveSession.findMany({
    where: {
      isActive: true,
      status: 'LIVE',
    },
    include: {
      referrals: {
        orderBy: { lastOpenedAt: 'desc' },
      },
    },
  });
}

async getLiveSessionById(id: string) {
  return this.prisma.liveSession.findUnique({
    where: { id },
    include: {
      referrals: {
        orderBy: { lastOpenedAt: 'desc' },
      },
    },
  });
}

async getLiveSessionByYouTubeId(youtubeVideoId: string) {
  return this.prisma.liveSession.findUnique({
    where: { youtubeVideoId },
    include: {
      referrals: {
        orderBy: { lastOpenedAt: 'desc' },
      },
    },
  });
}

async getAllLiveSessions() {
  return this.prisma.liveSession.findMany({
    orderBy: { startedAt: 'desc' },
    include: {
      referrals: {
        orderBy: { lastOpenedAt: 'desc' },
      },
    },
  });
}

async endLiveSession(id: string) {
  await this.prisma.liveSession.update({
    where: { id },
    data: {
      status: 'ENDED',
      isActive: false,
      endedAt: new Date(),
    },
  });

  await this.prisma.referral.updateMany({
    where: { liveSessionId: id },
    data: { isExpired: true },  
  });
}
}