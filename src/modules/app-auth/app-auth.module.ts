import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AppAuthController } from './app-auth.controller';

@Module({
  imports: [AuthModule],
  controllers: [AppAuthController],
})
export class AppAuthModule {}
