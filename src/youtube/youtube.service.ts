import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LiveSession } from '@prisma/client';
import * as xml2js from 'xml2js';

@Injectable()
export class YouTubeService {
  private readonly logger = new Logger(YouTubeService.name);

  constructor(private prisma: PrismaService) {}

  async addChannel(channelId: string, channelTitle: string) {
    return this.prisma.youTubeChannel.upsert({
      where: { channelId },
      update: { channelTitle, isActive: true },
      create: { channelId, channelTitle, isActive: true },
    });
  }
  
  /**
   * Procesa las notificaciones XML que manda YouTube (PubSubHubbub)
   */
  async handleNotification(xmlBody: string): Promise<void> {
    try {
      // Parsear XML a JSON
      const parsed = await xml2js.parseStringPromise(xmlBody, { explicitArray: false });
      const entry = parsed.feed?.entry;

      if (!entry) {
        this.logger.log('📭 Notificación recibida pero sin entry (probablemente baja de video o cambio menor)');
        return;
      }

      const videoId = entry['yt:videoId'];
      const channelId = entry['yt:channelId'];
      const title = entry.title;
      const link = entry.link?.['$']?.href;

      this.logger.log(`🔔 Nuevo evento detectado - Canal: ${channelId}, Video: ${videoId}, Título: ${title}`);

      // Verificar si ya existe la sesión activa para ese video
      const existingSession = await this.prisma.liveSession.findFirst({
        where: { youtubeVideoId: videoId, isActive: true },
      });

      if (!existingSession) {
        await this.prisma.liveSession.create({
          data: {
            youtubeVideoId: videoId,
            youtubeUrl: link,
            channelId,
            channelTitle: entry.author?.name || 'Desconocido',
            videoTitle: title,
            status: 'LIVE',
            isActive: true,
            startedAt: new Date(),
          },
        });

        this.logger.log(`✅ Nueva transmisión en vivo guardada: ${title}`);
      }
    } catch (error) {
      this.logger.error('❌ Error procesando notificación de YouTube', error);
    }
  }

  /**
   * Marca una transmisión como terminada manualmente
   */
  async endSession(videoId: string): Promise<LiveSession | null> {
    const session = await this.prisma.liveSession.findFirst({
      where: { youtubeVideoId: videoId, isActive: true },
    });

    if (!session) {
      this.logger.warn(`⚠️ No se encontró sesión activa para videoId ${videoId}`);
      return null;
    }

    return this.prisma.liveSession.update({
      where: { id: session.id },
      data: {
        status: 'ENDED',
        isActive: false,
        endedAt: new Date(),
      },
    });
  }

  /**
   * Devuelve sesiones activas
   */
  async getActiveLiveSessions() {
    return this.prisma.liveSession.findMany({
      where: { isActive: true, status: 'LIVE' },
      include: { referrals: true },
    });
  }
}
