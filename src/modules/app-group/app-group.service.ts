import {
  basicSearch,
  paginationObject,
} from '@/global/prisma/pagination_object';
import {
  IPagination,
  IPaginationResponse,
} from '@/global/types/Pagination.dto';
import { Injectable } from '@nestjs/common';
import { Group, Prisma } from '@prisma/client';
import { PrismaService } from '../db-prisma/db-prisma.service';
import {
  CreateAppGroupDto,
  GroupWithUsers,
  ManageMembersDto,
  UpdateAppGroupDto,
} from './dto/Group.dto';

@Injectable()
export class AppGroupService {
  constructor(private readonly db: PrismaService) {}

  async create(createAppDepartmentDto: CreateAppGroupDto) {
    return await this.db.group.create({
      data: {
        name: createAppDepartmentDto.name,
      },
    });
  }

  async update(id: string, updateAppDepartmentDto: UpdateAppGroupDto) {
    return await this.db.group.update({
      where: { id },
      data: updateAppDepartmentDto,
    });
  }

  async remove(id: string) {
    return await this.db.group.delete({
      where: { id },
    });
  }

  async getGroups(
    pagination: IPagination,
  ): Promise<IPaginationResponse<Group>> {
    const query: Prisma.GroupFindManyArgs = {
      ...paginationObject(pagination, basicSearch(pagination, ['name'])),
    };
    const data = await this.db.group.findMany(query);
    const total = await this.db.group.count();

    return {
      data,
      total,
      limit: pagination.limit,
      page: pagination.page,
    };
  }

  async listAllMembers(
    pagination: IPagination,
  ): Promise<IPaginationResponse<GroupWithUsers>> {
    const query: Prisma.GroupFindManyArgs = {
      ...paginationObject(pagination, basicSearch(pagination, ['name'])),
    };
    const data = await this.db.group.findMany({
      ...query,
      include: {
        GroupOnUser: {
          include: {
            User: true,
          },
        },
      },
    });
    const total = await this.db.group.count();

    return {
      // @ts-expect-error User already included
      data,
      total,
      limit: pagination.limit,
      page: pagination.page,
    };
  }

  async addMembers(groupId: string, data: ManageMembersDto) {
    // loop each member
    for (const id of data.members) {
      // check if member is already in group
      const groupOnUser = await this.db.groupOnUser.findFirst({
        where: {
          groupId,
          userId: id,
        },
      });
      if (groupOnUser) {
        continue;
      }

      // add member to group
      await this.db.groupOnUser.create({
        data: {
          groupId,
          userId: id,
        },
      });
    }
    return await this.db.group.findUnique({
      where: {
        id: groupId,
      },
      include: {
        GroupOnUser: {
          include: {
            User: true,
          },
        },
      },
    });
  }

  async removeMembers(groupId: string, data: ManageMembersDto) {
    // loop each member
    for (const id of data.members) {
      // check if member is already in group
      const groupOnUser = await this.db.groupOnUser.findFirst({
        where: {
          groupId,
          userId: id,
        },
      });
      if (!groupOnUser) {
        continue;
      }

      // remove member from group
      this.db.groupOnUser.delete({
        where: {
          id: groupOnUser.id,
        },
      });
    }
    return await this.db.group.findUnique({
      where: {
        id: groupId,
      },
      include: {
        GroupOnUser: {
          include: {
            User: true,
          },
        },
      },
    });
  }
}
