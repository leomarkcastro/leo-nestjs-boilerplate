import { Module } from '@nestjs/common';
import { AppAuthModule } from './modules/app-auth/app-auth.module';
import { AppHealthModule } from './modules/app-health/health.module';
import { AppTestModule } from './modules/app-test/test.module';
import { AuthModule } from './modules/auth/auth.module';
import { AwsS3Module } from './modules/aws-s3/aws-s3.module';
import { NestCacheModule } from './modules/cache/cache.module';
import { DbPrismaModule } from './modules/db-prisma/db-prisma.module';
import { MailBrevoModule } from './modules/mail-brevo/mail-brevo.module';
import { MinioModule } from './modules/minio/minio.module';
import { PermitModule } from './modules/permit/permit.module';
import { TemplatesModule } from './modules/templates/templates.module';

@Module({
  imports: [
    DbPrismaModule,
    AuthModule,
    NestCacheModule,
    MailBrevoModule,
    TemplatesModule,
    AwsS3Module,
    MinioModule,
    PermitModule,
    AppHealthModule,
    AppTestModule,
    AppAuthModule,
  ],
})
export class AppModule {}
