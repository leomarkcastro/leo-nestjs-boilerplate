import { Module } from '@nestjs/common';
import { AppAuthModule } from './modules/app-auth/app-auth.module';
import { AppContactsModule } from './modules/app-contacts/app-contacts.module';
import { AppDepartmentModule } from './modules/app-department/app-department.module';
import { AppEventsModule } from './modules/app-events/app-events.module';
import { AppFileModule } from './modules/app-file/app-file.module';
import { AppHealthModule } from './modules/app-health/health.module';
import { AppNotificationsModule } from './modules/app-notifications/app-notifications.module';
import { AppPositionModule } from './modules/app-position/app-position.module';
import { AppTaskModule } from './modules/app-task/app-task.module';
import { AuthModule } from './modules/auth/auth.module';
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
    MinioModule,
    PermitModule,
    AppHealthModule,
    // AppTestModule,
    AppAuthModule,
    AppFileModule,
    AppNotificationsModule,
    AppTaskModule,
    AppEventsModule,
    AppDepartmentModule,
    AppPositionModule,
    AppContactsModule,
  ],
})
export class AppModule {}
