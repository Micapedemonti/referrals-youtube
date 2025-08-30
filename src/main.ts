// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { randomBytes, createHash } from 'crypto';

function randomId() {
  return createHash('sha256').update(randomBytes(32)).digest('hex').slice(0, 32);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  app.use(cookieParser());

  app.use((req: any, res, next) => {
    const name = 'rid_sess';
    let sid = req.cookies?.[name];
    if (!sid) {
      sid = randomId();
      res.cookie(name, sid, {
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 30 * 60 * 1000, 
        secure: process.env.NODE_ENV === 'production',
      });
    }
    req.sessionId = sid;
    next();
  });

  await app.listen(3000);
  console.log('🚀 Servidor de referidos iniciado en puerto 3000');
}
bootstrap();
