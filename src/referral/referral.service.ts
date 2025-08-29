import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReferralService {
  constructor(private prisma: PrismaService) {}

  async createReferralWithUser(username: string, uidBitunix: string, tradingView: string) {
    const existingReferral = await this.prisma.referral.findFirst({
      where: { username },
    });
    if (existingReferral) {
      throw new BadRequestException('The username is already in use.');
    }

    const liveSession = await this.prisma.liveSession.findFirst({
      where: { isActive: true, status: 'LIVE' },
    });
    if (!liveSession) {
      throw new NotFoundException('There is no active live session.');
    }

    const code = this.generateUniqueCode();

    const referral = await this.prisma.referral.create({
      data: {
        code,
        username,
        uidBitunix,
        tradingView,
        liveSessionId: liveSession.id,
      },
      include: { liveSession: true },
    });
    return {
      referral: {
        ...referral,
        link:`${process.env.PUBLIC_BASE_URL}/referrals/open/${code}`
      },
      message: 'Referral link successfully created',
    };
  }

  async openReferral(code: string, ipHash: string, uaHash: string) {
    const referral = await this.prisma.referral.findUnique({
      where: { code },
      include: { liveSession: true, clicks: true },
    });

    if (!referral) throw new NotFoundException('Reference not found');
    if (!referral.liveSession.isActive || referral.liveSession.status !== 'LIVE') {
      throw new NotFoundException('The live session is not active');
    }

    try {
      await this.prisma.click.create({
        data: {
          referralId: referral.id,
          liveSessionId: referral.liveSessionId,
          ipHash,
          uaHash,
        },
      });

      await this.prisma.referral.update({
        where: { id: referral.id },
        data: {
          lastOpenedAt: new Date(),
          clickCount: { increment: 1 }, 
        },
        include: { liveSession: true, clicks: true },
      });
    } catch (error) {
      // P2002 = violación de unique constraint (ya clickeó el mismo usuario/UA/IP)
      if (error.code !== 'P2002') throw error;
    }

    return this.prisma.referral.findUnique({
      where: { id: referral.id },
      include: { liveSession: true },
    });
  }

  async getReferralByCode(code: string) {
    return this.prisma.referral.findUnique({
      where: { code },
      include: { liveSession: true },
    });
  }

  async getReferralRanking(liveSessionId: string) {
    return this.prisma.referral.findMany({
      where: {
        liveSessionId,
        isExpired: false,
        liveSession: { isActive: true, status: 'LIVE' },
      },
      include: { clicks: true },
      orderBy: { lastOpenedAt: 'desc' },
      take: 100,
    });
  }
  
  async getReferralStats(referralId: string) {
    const referral = await this.prisma.referral.findUnique({
      where: { id: referralId },
      include: { liveSession: true },
    });

    if (!referral) throw new NotFoundException('Reference not found');

    return {
      referral,
      ranking: await this.getReferralRanking(referral.liveSessionId),
    };
  }

  private generateUniqueCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  async getGlobalRanking() {
    return this.prisma.referral.findMany({
      orderBy: { clickCount: 'desc' },
      include: { liveSession: true },
      take: 100,
    });
  }

  async expireReferralsBySession(liveSessionId: string) {
    return this.prisma.referral.updateMany({
      where: { liveSessionId },
      data: { isExpired: true },
    });
  }
  
}
