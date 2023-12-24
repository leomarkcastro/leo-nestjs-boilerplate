import { Module } from '@nestjs/common';
import { MailBrevoModule } from '../mail-brevo/mail-brevo.module';
import { MinioModule } from '../minio/minio.module';
import { PermitModule } from '../permit/permit.module';
import { TemplatesModule } from '../templates/templates.module';
import { TestController } from './test.controller';

@Module({
  imports: [TemplatesModule, MinioModule, MailBrevoModule, PermitModule],
  controllers: [TestController],
})
export class AppTestModule {}
