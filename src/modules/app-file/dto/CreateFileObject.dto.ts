import { File as DbFile } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsString, IsUrl } from 'class-validator';

export class CreateFileObject {
  @IsString()
  name: string;

  @IsString()
  @IsUrl()
  url: string;

  @IsString()
  type: string;

  @IsNumber()
  @Type(() => Number)
  size: number;
}

export class CreateFileObjectDTO {
  @IsArray()
  files: CreateFileObject[];
}

export class DatabaseFileObject extends CreateFileObject {
  id: DbFile['id'];
  createdAt: DbFile['createdAt'];
  updatedAt: DbFile['updatedAt'];
}
