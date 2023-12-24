import { INestApplication, Logger } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import cors from './config/cors';
import { CONFIG } from './config/env';
import { AllExceptionsFilter } from './global/exceptions/AllExceptions.filter';
import { LoggingInterceptor } from './global/interceptor/transaction-time.interceptor';
import { logger } from './global/middleware/logger.middleware';

const NODE_ENV = CONFIG.NODE_ENV;
const ON_DEV_ENV = NODE_ENV === 'local' || NODE_ENV === 'development';
const ON_DEMO_ENV = ON_DEV_ENV || NODE_ENV === 'staging';

async function setupSwagger(app: INestApplication) {
  const documentBuilder = new DocumentBuilder()
    .setTitle('BDB API')
    .addBearerAuth();

  const document = SwaggerModule.createDocument(app, documentBuilder.build());
  SwaggerModule.setup('/documentation', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'method',
    },
  });
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    abortOnError: ON_DEV_ENV ? true : false,
    logger: ON_DEMO_ENV
      ? ['log', 'debug', 'error', 'verbose', 'warn']
      : ['error', 'warn'],
  });

  app.setGlobalPrefix('api');

  app.use(
    helmet({
      contentSecurityPolicy: false,
    }),
  );
  app.enableCors(cors);

  const adapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(adapterHost));

  if (ON_DEV_ENV) {
    app.use(logger);
    app.useGlobalInterceptors(new LoggingInterceptor());
  }

  if (ON_DEMO_ENV) {
    setupSwagger(app);
  }

  await app.listen(CONFIG.APP_PORT).then(async () => {
    Logger.log(
      `✅  Application is running on: ${
        CONFIG.BASE_URL || (await app.getUrl())
      }`,
      'NestJS',
    );
    Logger.log('Environment: ' + CONFIG.NODE_ENV, 'NestJS');

    // get memory usage
    const used = process.memoryUsage();
    for (const key in used) {
      Logger.debug(
        `${key} ${Math.round((used[key] / 1024 / 1024) * 100) / 100} MB`,
        'NestJS',
      );
    }
  });
}
bootstrap().catch((e) => {
  Logger.error('❌  Error starting server', e, 'NestJS', false);
  throw e;
});
