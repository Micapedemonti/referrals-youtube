import { Controller, Get, Param, Post } from '@nestjs/common';
import { LiveSessionService } from './live-session.service';

@Controller('live-sessions')
export class LiveSessionController {
  constructor(private readonly liveSessionService: LiveSessionService) {}

  @Get()
  async getAllLiveSessions() {
    return this.liveSessionService.getAllLiveSessions();
  }

  @Get('active')
  async getActiveLiveSessions() {
    return this.liveSessionService.getActiveLiveSessions();
  }

  @Get(':id')
  async getLiveSession(@Param('id') id: string) {
    return this.liveSessionService.getLiveSessionById(id);
  }

  @Get('youtube/:youtubeVideoId')
  async getLiveSessionByYouTubeId(@Param('youtubeVideoId') youtubeVideoId: string) {
    return this.liveSessionService.getLiveSessionByYouTubeId(youtubeVideoId);
  }

  @Post(':id/end')
  async endLiveSession(@Param('id') id: string) {
    return this.liveSessionService.endLiveSession(id);
  }
} 