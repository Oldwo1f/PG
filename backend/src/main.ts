import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import { LoggerService } from './common/logger/logger.service';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import * as express from 'express';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: false, // Désactiver le logger par défaut pour utiliser Winston
  });
  const logger = app.get(LoggerService);
  app.useLogger(logger);

  // Obtenir l'instance Express native AVANT toute configuration
  const expressApp = app.getHttpAdapter().getInstance();

  // Servir les fichiers statiques EN PREMIER, avant tout autre middleware
  const uploadsPath = join(__dirname, '..', '..', 'uploads');
  logger.log(`Static uploads path: ${uploadsPath}`, 'Bootstrap');

  // Middleware CORS pour les fichiers statiques
  expressApp.use('/uploads', (req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Cache-Control', 'public, max-age=31536000');

    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }

    next();
  });

  // Servir les fichiers statiques
  expressApp.use('/uploads', express.static(uploadsPath));

  // Headers de sécurité
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          imgSrc: ["'self'", 'data:', 'https:', 'http:'],
        },
      },
    }),
  );

  // Exception filter global
  app.useGlobalFilters(new HttpExceptionFilter(logger));

  // Configuration CORS
  const corsOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map((origin) => origin.trim())
    : process.env.NODE_ENV !== 'production'
      ? true // reflect request origin in dev
      : [];

  app.enableCors({
    origin: corsOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
    credentials: true,
  });

  // Set global prefix for all routes
  app.setGlobalPrefix('api');

  // Servir les assets d'icônes (CSS, polices, etc.)
  const assetsPath = join(__dirname, '..', '..', 'assets');
  logger.log(`Static assets path: ${assetsPath}`, 'Bootstrap');
  app.useStaticAssets(assetsPath, {
    prefix: '/assets/',
  });

  // Configuration de la validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Configuration Swagger (désactivé en production)
  const enableSwagger =
    process.env.ENABLE_SWAGGER === 'true' || process.env.NODE_ENV !== 'production';
  if (enableSwagger) {
    const config = new DocumentBuilder()
      .setTitle('Perfect Generations API')
      .setDescription("API pour la génération d'images parfaites pour votre marque")
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }

  // Démarrage du serveur
  const port = parseInt(process.env.PORT || '3001', 10);
  await app.listen(port);
  logger.log(`Application is running on: http://localhost:${port}`, 'Bootstrap');
}

bootstrap();
