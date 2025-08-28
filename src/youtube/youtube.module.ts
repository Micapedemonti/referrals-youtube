import { Module } from '@nestjs/common';
import { YouTubeService } from './youtube.service';
import { YouTubeController } from './youtube.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [YouTubeService],
  controllers: [YouTubeController],
  exports: [YouTubeService],
})
export class YouTubeModule {} 