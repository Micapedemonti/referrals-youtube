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


  @Get('live-sessions')
  async getActiveLiveSessions() {
    return this.youtubeService.getActiveLiveSessions();
  }

} 