import { CONFIG } from '@/config/env';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: Number(CONFIG.THROTTLE_TTL ?? 60000),
        limit: Number(CONFIG.THROTTLE_LIMIT ?? 100),
      },
    ]),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class Throttler {}
