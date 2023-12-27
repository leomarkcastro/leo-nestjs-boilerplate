import { Module } from '@nestjs/common';
import { MinioModule } from '../minio/minio.module';
import { AppFileController } from './app-file.controller';
import { AppFileService } from './app-file.service';

@Module({
  imports: [MinioModule],
  providers: [AppFileService],
  controllers: [AppFileController],
})
export class AppFileModule {}
