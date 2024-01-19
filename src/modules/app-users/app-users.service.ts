import { User } from '@/global/prisma-classes/user';
import {
  basicSearch,
  paginationObject,
} from '@/global/prisma/pagination_object';
import {
  IPagination,
  IPaginationResponse,
} from '@/global/types/Pagination.dto';
import { sha256HashString } from '@/utils/functions/hash';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { hashSync } from 'bcrypt';
import { PrismaService } from '../db-prisma/db-prisma.service';
import {
  UserCreate,
  UserUpdate,
  UserWithRelations,
} from './dto/UserObject.dto';

@Injectable()
export class AppUsersService {
  constructor(private readonly database: PrismaService) {}

  // create
  async createUser(data: UserCreate): Promise<User> {
    const randomizedPassword = hashSync(
      sha256HashString(Math.random().toString(36)).slice(-8),
      10,
    );
    const user = await this.database.user.create({
      data: {
        ...data,
        LocalAuth: {
          create: {
            password: randomizedPassword,
          },
        },
      },
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      address: user.address,
      departmentId: user.departmentId,
      description: user.description,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      positionId: user.positionId,
      roleId: user.roleId,
    };
  }

  // update
  async updateUser(id: string, data: Partial<UserUpdate>): Promise<User> {
    return await this.database.user.update({
      where: {
        id,
      },
      data,
    });
  }

  // delete
  async deleteUser(id: string): Promise<User> {
    return await this.database.user.delete({
      where: {
        id,
      },
    });
  }

  // get
  async getUser(id: string): Promise<UserWithRelations> {
    return await this.database.user.findUnique({
      where: {
        id,
      },
      include: {
        Department: true,
        Position: true,
        Role: true,
      },
    });
  }

  // get all
  async getUsers(
    pagination: IPagination,
  ): Promise<IPaginationResponse<UserWithRelations>> {
    const query: Prisma.UserFindManyArgs = {
      ...paginationObject(
        pagination,
        basicSearch(pagination, ['firstName', 'lastName', 'email', 'name']),
      ),
    };

    const data = await this.database.user.findMany({
      ...query,
      include: {
        Department: true,
        Position: true,
        Role: true,
      },
    });
    const total = await this.database.user.count(query as Prisma.UserCountArgs);

    return {
      data,
      total,
      limit: pagination?.limit,
      page: pagination?.page,
    };
  }
}
