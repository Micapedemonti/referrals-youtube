import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { YouTubeService } from './youtube.service';

@Controller('youtube')
export class YouTubeController {
  constructor(private readonly youtubeService: YouTubeService) {}

  @Post('channel')
  async addChannel(
    @Body() body: { channelId: string; channelTitle: string;}
  ) {
    return this.youtubeService.addChannel(
      body.channelId,
      body.channelTitle,
    );
  }

  @Post('simulate-live')
  async simulateLiveSession(
    @Body() body: { videoTitle?: string; youtubeVideoId?: string }
  ) {
    return this.youtubeService.simulateLiveSession(
      body.videoTitle || 'Simulated Transmission for Testing',
      body.youtubeVideoId || 'simulated_' + Date.now()
    );
  }

  @Get('live-sessions')
  async getActiveLiveSessions() {
    return this.youtubeService.getActiveLiveSessions();
  }

  @Post('check-now')
  async checkLiveStreamsNow() {
    await this.youtubeService.checkLiveStreams();
    return { message: 'Live stream verification complete' };
  }
} 