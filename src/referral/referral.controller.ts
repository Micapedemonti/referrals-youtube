import { Controller, Post, Get, Body, Param, Redirect, Req } from '@nestjs/common';
import { ReferralService } from './referral.service';
import { Request } from 'express';
import { CreateReferralWithUserDto } from './dto/create-referral.dto';
import { createHash } from 'crypto';


function sha256(s: string) {
  return createHash('sha256').update(s).digest('hex');
}
function getClientIp(req: any) {
  const xff = req.headers['x-forwarded-for'];
  let ip = Array.isArray(xff) ? xff[0] : (xff || '');
  if (typeof ip === 'string' && ip.includes(',')) ip = ip.split(',')[0];
  if (!ip) ip = req.ip || req.socket?.remoteAddress || '';
  ip = String(ip).trim().replace(/^::ffff:/, '');
  if (ip === '::1') ip = '127.0.0.1';
  return ip;
}


@Controller('referrals')
export class ReferralController {
  constructor(private readonly referralService: ReferralService) {}

  @Post('create-link')
  async createReferralWithUser(@Body() dto: CreateReferralWithUserDto) {
    return this.referralService.createReferralWithUser(
      dto.username,
      dto.uidBitunix,
      dto.tradingView,
    );
  }

  @Get('open/:code')
  @Redirect(undefined, 302)
  async openReferral(@Param('code') code: string, @Req() req: any) {
    const sessionId: string = req.sessionId; // <-- viene del middleware de main.ts
    const ip = getClientIp(req);
    const ua = String(req.headers['user-agent'] || '').toLowerCase().trim();
  
    // (opcional) no contar bots de previews
    if (/bot|facebookexternalhit|twitterbot|slackbot|headlesschrome/i.test(ua)) {
      const referral = await this.referralService.getReferralByCode(code);
      const url =
        referral.liveSession.youtubeUrl ||
        (referral.liveSession.youtubeVideoId
          ? `https://www.youtube.com/watch?v=${referral.liveSession.youtubeVideoId}`
          : undefined);
      if (!url) throw new Error('No YouTube URL available for this session');
      return { url };
    }
  
    const ipHash = sha256(ip);
    const uaHash = sha256(ua);
  
    const referral = await this.referralService.openReferral(code, ipHash, uaHash, sessionId);
  
    const url =
      referral.liveSession.youtubeUrl ||
      (referral.liveSession.youtubeVideoId
        ? `https://www.youtube.com/watch?v=${referral.liveSession.youtubeVideoId}`
        : undefined);
    if (!url) throw new Error('No YouTube URL available for this session');
    return { url };
  }

  @Get('code/:code')
  async getReferralByCode(@Param('code') code: string) {
    return this.referralService.getReferralByCode(code);
  }

  @Get('ranking')
  async getGlobalRanking() {
    return this.referralService.getGlobalRanking();
  }

  @Get('ranking/:liveSessionId')
  async getSessionRanking(@Param('liveSessionId') liveSessionId: string) {
    return this.referralService.getReferralRanking(liveSessionId);
  }

  @Post('expire/:liveSessionId')
  async expireReferrals(@Param('liveSessionId') liveSessionId: string) {
    const result = await this.referralService.expireReferralsBySession(liveSessionId);
    return {
      message: `Session referrals ${liveSessionId} expired.`,
      result,
    };
  }
  @Get('stats/:referralId')
  async getReferralStats(@Param('referralId') referralId: string) {
    return this.referralService.getReferralStats(referralId);
  }
}
