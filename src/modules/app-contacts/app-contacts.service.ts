import {
  basicSearch,
  paginationObject,
} from '@/global/prisma/pagination_object';
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
      ...paginationObject(
        pagination,
        basicSearch(pagination, ['firstName', 'lastName', 'company']),
      ),
    };
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
