import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import cookieParser from 'cookie-parser';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());


  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      // forbidNonWhitelisted: true,
      skipMissingProperties: false,
      
      forbidUnknownValues: false,
      whitelist: true,
    }),
  );

  app.enableCors({
    origin: [configService.get('FRONTEND_URL'), 'http://localhost:3000'], // allow other origin access to API
    credentials: true, //Access-Control-Allow-Credentials: true response header.
    allowedHeaders: ['Authorization', 'Content-Type'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  });

  await app.listen(configService.get('PORT'));

}
bootstrap();
