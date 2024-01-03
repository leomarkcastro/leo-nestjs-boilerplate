import { File } from '@/global/prisma-classes/file';
import { IsArray, IsNumber, IsString } from 'class-validator';

export class UploadFileObject {
  @IsString()
  name: string;

  @IsString()
  type: string;

  @IsNumber()
  size: number;
}

export class UploadFileObjectDTO {
  @IsArray()
  files: UploadFileObject[];
}

export class UploadFileResponse {
  originalFileName: string;
  uploadFileName: string;
  uploadURL: string;
  viewURL: string;
  object: File;
}
