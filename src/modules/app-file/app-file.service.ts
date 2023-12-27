import { Injectable } from '@nestjs/common';
import { IUserJwt } from '../auth/types/UserJWT.dto';
import { PrismaService } from '../db-prisma/db-prisma.service';
import {
  CreateFileObject,
  DatabaseFileObject,
} from './dto/CreateFileObject.dto';
import { FileOwnershipType } from './dto/FileOwnership.dto';

@Injectable()
export class AppFileService {
  constructor(private readonly db: PrismaService) {}

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
