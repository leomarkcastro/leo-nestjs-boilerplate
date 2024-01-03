import { Module } from '@nestjs/common';
import { UsedKeysService } from './used-keys.service';

@Module({
  providers: [UsedKeysService],
  exports: [UsedKeysService],
})
export class UsedKeysModule {}
