import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Test, TestingModule } from '@nestjs/testing';
import * as fs from 'fs';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('/api');
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
    await app.init();
  });

  it('should generate swagger spec', async () => {
    const config = new DocumentBuilder()
      .setTitle('My API')
      .setDescription('My API')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    fs.writeFileSync('./swagger.json', JSON.stringify(document));
  });
});
