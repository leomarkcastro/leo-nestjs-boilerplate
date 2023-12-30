import { Auth } from '@/global/decorators/Auth.decorator';
import { CurrentUser } from '@/global/decorators/CurrentUser.decorator';
import { WithPermission } from '@/global/decorators/Permissions.decorator';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IUserJwt } from '../auth/types/UserJWT.dto';
import { MinioService } from '../minio/minio.service';
import { PERMISSIONS } from '../permit/permissions.types';
import { AppFileService } from './app-file.service';
import {
  CreateFileObjectDTO,
  DatabaseFileObject,
} from './dto/CreateFileObject.dto';
import { PresignedFileUpload_Body } from './dto/PresignedBody.dto';
import { PresignedFileUpload_Response } from './dto/PresignedResponse.dto';

@Controller('file')
@ApiTags('file')
export class AppFileController {
  constructor(
    private readonly minio: MinioService,
    private readonly service: AppFileService,
  ) {}

  @Post('presigned')
  @WithPermission([PERMISSIONS.FILE.UPLOAD_PRESIGNED])
  @Auth()
  async uploads_generatePresignedUrls(
    @Body() body: PresignedFileUpload_Body,
  ): Promise<PresignedFileUpload_Response[]> {
    const urls = await this.minio.generatePresignedUploadUrls(body.fileNames);
    return urls;
  }

  @Post('createobject')
  @WithPermission([PERMISSIONS.FILE.UPLOAD_CREATEOBJECT])
  @Auth()
  async uploads_createObject(
    @CurrentUser() user: IUserJwt,
    @Body() body: CreateFileObjectDTO,
  ): Promise<DatabaseFileObject[]> {
    const urls = await this.service.createFileObject(user, body.files);
    return urls;
  }
}
