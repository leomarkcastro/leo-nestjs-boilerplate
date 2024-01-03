import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { UsedKeysModule } from '../used-keys/used-keys.module';
import { AppAuthController } from './app-auth.controller';

@Module({
  imports: [AuthModule, UsedKeysModule],
  controllers: [AppAuthController],
})
export class AppAuthModule {}
