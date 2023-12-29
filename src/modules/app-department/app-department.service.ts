import { Department } from '@/global/prisma-classes/department';
import {
  IPagination,
  IPaginationResponse,
} from '@/global/types/Pagination.dto';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../db-prisma/db-prisma.service';
import { DepartmentWithUsers } from './dto/DepartmentWithUsers.dto';
import {
  CreateAppDepartmentDto,
  ManageMembersDto,
} from './dto/create-app-department.dto';
import { UpdateAppDepartmentDto } from './dto/update-app-department.dto';

@Injectable()
export class AppDepartmentService {
  constructor(private readonly db: PrismaService) {}

  async create(createAppDepartmentDto: CreateAppDepartmentDto) {
    return await this.db.department.create({
      data: createAppDepartmentDto,
    });
  }

  async update(id: string, updateAppDepartmentDto: UpdateAppDepartmentDto) {
    return await this.db.department.update({
      where: { id },
      data: updateAppDepartmentDto,
    });
  }

  async remove(id: string) {
    return await this.db.department.delete({
      where: { id },
    });
  }

  async getDepartments(
    pagination: IPagination,
  ): Promise<IPaginationResponse<Department>> {
    const query: Prisma.DepartmentFindManyArgs = {
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
            name: {
              contains: pagination.search,
              mode: 'insensitive',
            },
          },
        ],
      };
    }
    const data = await this.db.department.findMany(query);
    const total = await this.db.department.count();

    return {
      data,
      total,
      limit: pagination.limit,
      page: pagination.page,
    };
  }

  async listAllMembers(
    pagination: IPagination,
  ): Promise<IPaginationResponse<DepartmentWithUsers>> {
    const query: Prisma.DepartmentFindManyArgs = {
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
            name: {
              contains: pagination.search,
              mode: 'insensitive',
            },
          },
        ],
      };
    }
    const data = await this.db.department.findMany({
      ...query,
      include: {
        User: true,
      },
    });
    const total = await this.db.department.count();

    return {
      data,
      total,
      limit: pagination.limit,
      page: pagination.page,
    };
  }

  addMembers(departmentId: string, data: ManageMembersDto) {
    return this.db.department.update({
      where: { id: departmentId },
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

  removeMembers(departmentId: string, data: ManageMembersDto) {
    return this.db.department.update({
      where: { id: departmentId },
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
