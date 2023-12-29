import { Position } from '@/global/prisma-classes/position';
import {
  basicSearch,
  paginationObject,
} from '@/global/prisma/pagination_object';
import {
  IPagination,
  IPaginationResponse,
} from '@/global/types/Pagination.dto';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../db-prisma/db-prisma.service';
import { PositionWithUsers } from './dto/PositionWithUsers.dto';
import {
  CreateAppPositionDto,
  ManageMembersDto,
} from './dto/create-app-position.dto';
import { UpdateAppPositionDto } from './dto/update-app-position.dto';

@Injectable()
export class AppPositionService {
  constructor(private readonly db: PrismaService) {}

  async create(
    createAppDepartmentDto: CreateAppPositionDto,
  ): Promise<Position> {
    return await this.db.position.create({
      data: createAppDepartmentDto,
    });
  }

  async update(
    id: string,
    updateAppDepartmentDto: UpdateAppPositionDto,
  ): Promise<Position> {
    return await this.db.position.update({
      where: { id },
      data: {
        name: updateAppDepartmentDto.name,
      },
    });
  }

  async remove(id: string): Promise<Position> {
    return await this.db.position.delete({
      where: { id },
    });
  }

  async getPositions(
    pagination: IPagination,
  ): Promise<IPaginationResponse<Position>> {
    const query: Prisma.PositionFindManyArgs = {
      ...paginationObject(pagination, basicSearch(pagination, ['name'])),
    };

    const data = await this.db.position.findMany({
      ...query,
    });
    const total = await this.db.position.count();

    return {
      data,
      total,
      limit: pagination.limit,
      page: pagination.page,
    };
  }

  async listAllMembers(
    pagination: IPagination,
  ): Promise<IPaginationResponse<PositionWithUsers>> {
    const query: Prisma.PositionFindManyArgs = {
      ...paginationObject(pagination, basicSearch(pagination, ['name'])),
    };

    const data = await this.db.position.findMany({
      ...query,
      include: {
        User: true,
      },
    });
    const total = await this.db.position.count();

    return {
      data,
      total,
      limit: pagination.limit,
      page: pagination.page,
    };
  }

  addMembers(
    positionId: string,
    data: ManageMembersDto,
  ): Promise<PositionWithUsers> {
    return this.db.position.update({
      where: { id: positionId },
      data: {
        User: {
          connect: data.members.map((id) => ({ id })),
        },
      },
      include: {
        User: true,
      },
    });
  }

  removeMembers(
    positionId: string,
    data: ManageMembersDto,
  ): Promise<PositionWithUsers> {
    return this.db.position.update({
      where: { id: positionId },
      data: {
        User: {
          disconnect: data.members.map((id) => ({ id })),
        },
      },
      include: {
        User: true,
      },
    });
  }
}
