import { IPagination } from '@/global/types/Pagination.dto';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../db-prisma/db-prisma.service';
import { CreateAppContactDto } from './dto/create-app-contact.dto';
import { UpdateAppContactDto } from './dto/update-app-contact.dto';

@Injectable()
export class AppContactsService {
  constructor(private readonly db: PrismaService) {}

  async create(createAppContactDto: CreateAppContactDto) {
    return await this.db.contact.create({
      data: createAppContactDto,
    });
  }

  async findAll(pagination: IPagination) {
    const query: Prisma.ContactFindManyArgs = {
      take: pagination.limit,
      skip: (pagination.page - 1) * pagination.limit,
      orderBy: {
        [pagination.sortBy]: pagination.sortDesc ? 'desc' : 'asc',
      },
    };
    if (pagination.search && pagination.search.length > 0) {
      query.where = {
        OR: [
          {
            firstName: {
              contains: pagination.search,
              mode: 'insensitive',
            },
          },
          {
            lastName: {
              contains: pagination.search,
              mode: 'insensitive',
            },
          },
          {
            company: {
              contains: pagination.search,
              mode: 'insensitive',
            },
          },
        ],
      };
    }
    return await this.db.contact.findMany(query);
  }

  async update(id: string, updateAppContactDto: UpdateAppContactDto) {
    return await this.db.contact.update({
      where: { id },
      data: updateAppContactDto,
    });
  }

  async remove(id: string) {
    return await this.db.contact.delete({
      where: { id },
    });
  }
}
