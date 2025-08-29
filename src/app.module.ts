import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { YouTubeModule } from './youtube/youtube.module';
import { ReferralModule } from './referral/referral.module';
import { LiveSessionModule } from './live-session/live-session.module';
import { RankingModule } from './ranking/ranking.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    ScheduleModule.forRoot(),
    PrismaModule,
    YouTubeModule,
    ReferralModule,
    LiveSessionModule,
    RankingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
