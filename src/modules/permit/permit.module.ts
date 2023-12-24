import { Global, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { DbPrismaModule } from '../db-prisma/db-prisma.module';
import { SimplePermitGuard } from './guard/simplepermit.guard';
import { PermitService } from './permit.service';

@Global()
@Module({
  imports: [DbPrismaModule],
  providers: [
    PermitService,
    {
      provide: APP_GUARD,
      useClass: SimplePermitGuard,
    },
  ],
  exports: [PermitService],
})
export class PermitModule {}
