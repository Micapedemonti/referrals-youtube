import { Controller, Post, Get, Body, Param, Redirect, Req } from '@nestjs/common';
import { ReferralService } from './referral.service';
import { Request } from 'express';
import { CreateReferralWithUserDto } from './dto/create-referral.dto';

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
  async openReferral(@Param('code') code: string, @Req() req: Request) {
    const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
    const ua = req.headers['user-agent'] || 'unknown';

    // Hash simple para identificar al visitante
   // const ipHash = Buffer.from(ip.toString()).toString('base64');
    //const uaHash = Buffer.from(ua.toString()).toString('base64');
    const ipHash = Buffer.from(ip + Date.now().toString()).toString('base64');
    const uaHash = Buffer.from(ua).toString('base64');
    const referral = await this.referralService.openReferral(code, ipHash, uaHash);

    const url =
      referral.liveSession.youtubeUrl ||
      (referral.liveSession.youtubeVideoId
        ? `https://www.youtube.com/watch?v=${referral.liveSession.youtubeVideoId}`
        : undefined);

    if (!url) {
      throw new Error('No hay URL de YouTube disponible para esta sesión');
    }

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
      message: `Referrals de la sesión ${liveSessionId} expirados.`,
      result,
    };
  }
  @Get('stats/:referralId')
  async getReferralStats(@Param('referralId') referralId: string) {
    return this.referralService.getReferralStats(referralId);
  }
}
