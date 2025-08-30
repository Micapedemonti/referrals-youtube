import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  // ✅ Aceptar XML
  app.use('/youtube/webhook', bodyParser.text({ type: 'application/atom+xml' }));

  await app.listen(3000);
  console.log('🚀 Servidor de referidos iniciado en puerto 3000');
}
bootstrap();