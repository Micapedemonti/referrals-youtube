import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Habilitar CORS para el frontend
  app.enableCors();
  
  // Validación global
  app.useGlobalPipes(new ValidationPipe());
  
  await app.listen(3000);
  console.log('🚀 Servidor de referidos iniciado en puerto 3000');
}
bootstrap();
