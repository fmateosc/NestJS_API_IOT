// main.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { CORS } from './config/cors';
import { readFileSync } from 'fs';
// eslint-disable-next-line @typescript-eslint/no-require-imports
import express = require('express');
import * as https from 'https';
import { AllExceptionFilter } from './common/filters/http-exception.filter';
import { TimeOutInterceptor } from './common/interceptors/timeout.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // prefix - Moved before Swagger to ensure correct pathing
  app.setGlobalPrefix('api/v1');

  // filter error messages
  app.useGlobalFilters(new AllExceptionFilter());

  // global interceptors
  app.useGlobalInterceptors(new TimeOutInterceptor());

  const logger = new Logger('Bootstrap');

  const HTTP_PORT = process.env.HTTP_PORT || 3000;
  const HTTPS_PORT = process.env.HTTPS_PORT || 3443;

  // global  validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // cors
  app.enableCors(CORS);

  // http
  void app.listen(HTTP_PORT, () => {
    logger.log(`🚀 HTTP server started on port: ${HTTP_PORT}`);
  });

  // https
  const httpsOptions = {
    key: readFileSync('certs/key.pem'),
    cert: readFileSync('certs/cert.pem'),
    ca: readFileSync('certs/cacert.pem'),
  };

  const expressApp = express();
  expressApp.use(app.getHttpAdapter().getInstance());

  https.createServer(httpsOptions, expressApp).listen(HTTPS_PORT, () => {
    logger.log(`🔒 HTTPS server started on port: ${HTTPS_PORT}`);
  });
}

bootstrap();
