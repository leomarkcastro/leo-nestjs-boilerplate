import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PermitModule } from '../permit/permit.module';
import { AppAuthController } from './app-auth.controller';

@Module({
  imports: [AuthModule, PermitModule],
  controllers: [AppAuthController],
})
export class AppAuthModule {}
