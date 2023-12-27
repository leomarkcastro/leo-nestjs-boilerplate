import { Global, Module } from '@nestjs/common';
import { DbPrismaModule } from '../db-prisma/db-prisma.module';
import { PermitService } from './permit.service';

@Global()
@Module({
  imports: [DbPrismaModule],
  providers: [PermitService],
  exports: [PermitService],
})
export class PermitModule {}
