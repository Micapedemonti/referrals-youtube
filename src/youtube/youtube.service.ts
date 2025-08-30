import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import axios from 'axios';
import { YouTubeChannel, LiveSession } from '@prisma/client';

interface YouTubeSearchItem {
  id: { videoId: string };
  snippet: {
    title: string;
    channelTitle: string;
    publishedAt: string;
    description: string;
    thumbnails: { default: { url: string }; medium?: { url: string }; high?: { url: string } };
  };
}

@Injectable()
export class YouTubeService {
  private readonly logger = new Logger(YouTubeService.name);

  constructor(private prisma: PrismaService) {}

  //@Cron('*/4 * * * *')
  async checkLiveStreams() {
    try {
      const channels = await this.prisma.youTubeChannel.findMany({
        where: { isActive: true },
      });

      for (const channel of channels) {
        await this.checkChannelLiveStatus(channel);
      }
    } catch (error) {
      this.logger.error('Error checking live streams:', error);
    }
  }

  private async checkChannelLiveStatus(channel: YouTubeChannel): Promise<void> {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channel.channelId}&type=video&eventType=live&key=${process.env.YOUTUBE_API_KEY}`
      );

      const liveVideos = response.data.items;

      this.logger.log(`Consultando canal: ${channel.channelId}`);
      this.logger.log(`Items devueltos: ${JSON.stringify(liveVideos)}`);
      
      if (liveVideos.length > 0) {
        const liveVideo = liveVideos[0];
        await this.createOrUpdateLiveSession(channel, liveVideo);
      } else {
        await this.endActiveLiveSessions(channel.channelId);
      }
    } catch (error) {
      this.logger.error(`Error checking channel ${channel.channelId}:`, error);
    }
  }

  private async createOrUpdateLiveSession(channel: YouTubeChannel, video: YouTubeSearchItem): Promise<void> {
    const existingSession = await this.prisma.liveSession.findFirst({
      where: {
        youtubeVideoId: video.id.videoId,
        isActive: true,
      },
    });

    if (!existingSession) {
      await this.prisma.liveSession.create({
        data: {
          youtubeVideoId: video.id.videoId,
          youtubeUrl: `https://www.youtube.com/watch?v=${video.id.videoId}`,
          channelId: process.env.YOUTUBE_CHANNEL_ID || '',
          channelTitle: process.env.YOUTUBE_CHANNEL_TITLE || '',
          videoTitle: video.snippet.title,
          status: 'LIVE',
          isActive: true,
        },
      });

      this.logger.log(`New live stream detected: ${video.snippet.title}`);
    }
  }

  private async endActiveLiveSessions(channelId: string) {
    const activeSessions = await this.prisma.liveSession.findMany({
      where: {
        channelId,
        isActive: true,
        status: 'LIVE',
      },
    });

    for (const session of activeSessions) {
      await this.prisma.liveSession.update({
        where: { id: session.id },
        data: {
          status: 'ENDED',
          isActive: false,
          endedAt: new Date(),
        },
      });

      this.logger.log(`Live session ended: ${session.videoTitle}`);
    }
  }

  async addChannel(channelId: string, channelTitle: string) {
    const channel = await this.prisma.youTubeChannel.upsert({
      where: { channelId },
      update: { channelTitle, isActive: true },
      create: { channelId, channelTitle, isActive: true },
    });

    return channel;
  }
  async getActiveLiveSessions() {
    const sessions = await this.prisma.liveSession.findMany({
      where: {
        isActive: true,
        status: 'LIVE',
      },
      include: {
        referrals: true,
      },
    });
  
    return sessions.map((session) => {
      const now = new Date();
      const elapsedMs = (session.endedAt ?? now).getTime() - session.startedAt.getTime();
      const elapsedSeconds = Math.floor(elapsedMs / 1000);
  
      return {
        ...session,
        elapsedSeconds,
      };
    });
  }
  

  async simulateLiveSession(videoTitle: string, youtubeVideoId: string) {
    const liveSession = await this.prisma.liveSession.create({
      data: {
        status: 'LIVE',
        youtubeUrl: `https://www.youtube.com/watch?v=${youtubeVideoId}`,
        youtubeVideoId,
        channelId: process.env.YOUTUBE_CHANNEL_ID || '',
        channelTitle: process.env.YOUTUBE_CHANNEL_TITLE || '',
        videoTitle,
        startedAt: new Date(),
        isActive: true,
      },
      include: {
        referrals: true,
      }
    });

    this.logger.log(`Simulated live session created: ${videoTitle}`);
    return {
      message: 'Simulated live session successfully created',
      liveSession,
    };
  }
} 