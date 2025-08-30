import { Controller, Get, Post, Query, Req, Res, Logger } from '@nestjs/common';
import { Response, Request } from 'express';
import { YouTubeService } from './youtube.service';

@Controller('youtube/webhook')
export class YouTubeWebhookController {
  private readonly logger = new Logger(YouTubeWebhookController.name);

  constructor(private readonly youtubeService: YouTubeService) {}

  /**
   * Confirmación de suscripción (YouTube envía hub.challenge aquí).
   * Debes devolver exactamente el challenge en el body.
   */
  @Get()
  async confirmSubscription(
    @Query('hub.challenge') challenge: string,
    @Res() res: Response
  ) {
    this.logger.log(`✅ Confirmando suscripción: ${challenge}`);
    return res.send(challenge);
  }

  /**
   * YouTube manda notificaciones XML aquí cada vez que haya un evento en el canal
   * (nuevo live, video subido, etc).
   */
  @Post()
  async handleNotification(@Req() req: Request, @Res() res: Response) {
    try {
      const xmlBody = req.body.toString();
      this.logger.log(`📩 Notificación XML recibida: ${xmlBody.substring(0, 200)}...`);
      
      await this.youtubeService.handleNotification(xmlBody);

      return res.status(200).send('OK');
    } catch (error) {
      this.logger.error('❌ Error procesando notificación', error);
      return res.status(500).send('Error');
    }
  }
}
