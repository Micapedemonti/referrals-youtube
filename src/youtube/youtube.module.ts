import { Module } from '@nestjs/common';
import { YouTubeService } from './youtube.service';
import { YouTubeController } from './youtube.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { YouTubeWebhookController } from './youtube-webhook.controller';

@Module({
  imports: [PrismaModule],
  providers: [YouTubeService],
  controllers: [YouTubeController,YouTubeWebhookController],
  exports: [YouTubeService],
})
export class YouTubeModule {} 