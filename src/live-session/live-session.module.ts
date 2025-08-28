import { Module } from '@nestjs/common';
import { LiveSessionService } from './live-session.service';
import { LiveSessionController } from './live-session.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [LiveSessionService],
  controllers: [LiveSessionController],
  exports: [LiveSessionService],
})
export class LiveSessionModule {} 