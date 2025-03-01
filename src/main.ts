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
      forbidUnknownValues: true,
      whitelist: true,
    }),
  );

  app.enableCors({
    origin: configService.get('FRONTEND_URL'), // allow other origin access to API
    credentials: true, //Access-Control-Allow-Credentials: true response header.
  });

  app.use(function (request: Request, response: Response, next: NextFunction) {
    response.setHeader(
      'Access-Control-Allow-Origin',
      configService.get('FRONTEND_URL'),
    );
    next();
  });
  
  await app.listen(configService.get('PORT'));

}
bootstrap();
