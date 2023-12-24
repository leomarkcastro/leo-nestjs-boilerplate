import { _1_SECOND } from '@/utils/functions/time';
import { CacheModule } from '@nestjs/cache-manager';
import { Global, Module } from '@nestjs/common';
import { CacheService } from './cache.service';

@Global()
@Module({
  imports: [
    CacheModule.register({
      max: 10_000_000,
      ttl: 30 * _1_SECOND,
    }),
  ],
  providers: [CacheService],
  exports: [CacheService],
})
export class NestCacheModule {}
