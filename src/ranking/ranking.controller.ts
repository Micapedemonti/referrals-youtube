import { Controller, Get, Param, Query } from '@nestjs/common';
import { RankingService } from './ranking.service';

@Controller('ranking')
export class RankingController {
  constructor(private readonly rankingService: RankingService) {}

  @Get()
  async getGlobalRanking(
    @Query('limit') limit: string = '100',
    @Query('offset') offset: string = '0'
  ) {
    return this.rankingService.getGlobalRanking(
      parseInt(limit),
      parseInt(offset)
    );
  }

  @Get('session/:liveSessionId')
  async getSessionRanking(
    @Param('liveSessionId') liveSessionId: string,
    @Query('limit') limit: string = '100',
    @Query('offset') offset: string = '0'
  ) {
    return this.rankingService.getSessionRanking(
      liveSessionId,
      parseInt(limit),
      parseInt(offset)
    );
  } 

  @Get('session/:liveSessionId/stats')
  async getSessionStats(@Param('liveSessionId') liveSessionId: string) {
    return this.rankingService.getSessionStats(liveSessionId);
  }
} 