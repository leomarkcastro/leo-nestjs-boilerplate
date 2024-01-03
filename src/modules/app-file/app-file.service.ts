import { Injectable } from '@nestjs/common';
import { IUserJwt } from '../auth/types/UserJWT.dto';
import { PrismaService } from '../db-prisma/db-prisma.service';
import { MinioService } from '../minio/minio.service';
import {
  CreateFileObject,
  DatabaseFileObject,
} from './dto/CreateFileObject.dto';
import { FileOwnershipType } from './dto/FileOwnership.dto';
import {
  UploadFileObject,
  UploadFileResponse,
} from './dto/UploadFileObject.dto';

@Injectable()
export class AppFileService {
  constructor(
    private readonly db: PrismaService,
    private readonly minio: MinioService,
  ) {}

  async uploadFileObjects(
    user: IUserJwt,
    data: UploadFileObject[],
  ): Promise<UploadFileResponse[]> {
    // const create presignedUrls
    const presignedUrls = await this.minio.generatePresignedUploadUrls(
      data.map((file) => file.name),
    );

    return await Promise.all(
      data.map(async (file) => {
        const { name, type, size } = file;

        const _presigned = presignedUrls.find(
          (x) => x.originalFileName === name,
        );
        const object = await this.db.file.create({
          data: {
            name,
            url: _presigned.viewURL,
            type,
            size,
            FileOnUser: {
              create: {
                type: FileOwnershipType.OWNER,
                User: { connect: { id: user.id } },
              },
            },
          },
        });

        return {
          originalFileName: _presigned.originalFileName,
          uploadFileName: _presigned.uploadFileName,
          uploadURL: _presigned.uploadURL,
          viewURL: _presigned.viewURL,
          object,
        };
      }),
    );
  }

  async createFileObject(
    user: IUserJwt,
    data: CreateFileObject[],
  ): Promise<DatabaseFileObject[]> {
    return await Promise.all(
      data.map(async (file) => {
        const { name, url, type, size } = file;
        return await this.db.file.create({
          data: {
            name,
            url,
            type,
            size,
            FileOnUser: {
              create: {
                type: FileOwnershipType.OWNER,
                User: { connect: { id: user.id } },
              },
            },
          },
        });
      }),
    );
  }
}
