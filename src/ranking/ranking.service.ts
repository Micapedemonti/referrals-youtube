import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RankingService {
  constructor(private prisma: PrismaService) {}

  async getGlobalRanking(limit: number = 100, offset: number = 0) {
    const liveSession = await this.prisma.liveSession.findFirst({
      where: { isActive: true, status: 'LIVE' },
    });

    if (!liveSession) {
      return { referrals: [], total: 0, limit, offset, hasMore: false };
    }

    const referrals = await this.prisma.referral.findMany({
      where: {
        liveSessionId: liveSession.id,
        isExpired: false,
      },
      include: { clicks: true },
      take: limit,
      skip: offset,
    });

    const transformed = referrals.map(r => ({
      username: r.username,
      clickCount: r.clicks.length,
    }));

    transformed.sort((a, b) => b.clickCount - a.clickCount);

    return {
      referrals: transformed,
      total: transformed.length,
      limit,
      offset,
      hasMore: offset + limit < transformed.length,
    };
  }

  async getSessionRanking(liveSessionId: string, limit: number = 100, offset: number = 0) {
    const referrals = await this.prisma.referral.findMany({
      where: { liveSessionId, isExpired: false },
      include: { clicks: true },
      orderBy: { lastOpenedAt: 'desc' },
      take: limit,
      skip: offset,
    });

    const transformed = referrals.map(r => ({
      username: r.username,
      clickCount: r.clicks.length,
    }));

    transformed.sort((a, b) => b.clickCount - a.clickCount);

    return {
      referrals: transformed,
      total: transformed.length,
      limit,
      offset,
      hasMore: offset + limit < transformed.length,
    };
  }

  async getUserRanking(uidBitunix: string, limit: number = 50, offset: number = 0) {
    const [referrals, total] = await Promise.all([
      this.prisma.referral.findMany({
        where: { uidBitunix, isExpired: false }, 
        orderBy: { lastOpenedAt: 'desc' },
        include: {
          liveSession: {
            select: {
              id: true,
              videoTitle: true,
              channelTitle: true,
              startedAt: true,
            },
          },
        },
        take: limit,
        skip: offset,
      }),
      this.prisma.referral.count({ where: { uidBitunix, isExpired: false } }),
    ]);

    return {
      referrals,
      total,
      limit,
      offset,
      hasMore: offset + limit < total,
    };
  }

  async getTopPerformers(limit: number = 10) {
    const liveSession = await this.prisma.liveSession.findFirst({
      where: { isActive: true, status: 'LIVE' },
    });

    if (!liveSession) return [];

    return this.prisma.click.groupBy({
      by: ['referralId'],
      where: { liveSessionId: liveSession.id }, 
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: limit,
    });
  }

  async getSessionStats(liveSessionId: string) {
    const stats = await this.prisma.click.aggregate({
      where: { liveSessionId },
      _count: { id: true },
    });

    const topReferral = await this.prisma.referral.findFirst({
      where: { liveSessionId, isExpired: false }, 
      orderBy: { lastOpenedAt: 'desc' },
      include: { liveSession: true },
    });

    return {
      totalReferrals: await this.prisma.referral.count({
        where: { liveSessionId, isExpired: false }, 
      }),
      totalClicks: stats._count.id,
      topReferral,
    };
  }
}
