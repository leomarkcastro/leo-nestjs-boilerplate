import { Board } from '@/global/prisma-classes/board';
import { FileOnTask } from '@/global/prisma-classes/file_on_task';
import { List } from '@/global/prisma-classes/list';
import { Task } from '@/global/prisma-classes/task';
import { Injectable } from '@nestjs/common';
import { IUserJwt } from '../auth/types/UserJWT.dto';
import { PrismaService } from '../db-prisma/db-prisma.service';
import {
  BoardAccess,
  DeleteMembersRequest,
  ManageMembersRequest,
} from './dto/BoardAccess.dto';
import {
  BoardWithUsers,
  CreateBoardDto,
  UpdateBoardDto,
} from './dto/CreateBoard.dto';
import { CreateListDto, UpdateListDto } from './dto/CreateList.dto';
import {
  CreateTaskDto,
  ModifyTaskFileDto,
  UpdateTaskDto,
} from './dto/CreateTask.dto';
import { ListWithTasks } from './dto/ListWithTask.dto';
import { TaskOnEvent } from './dto/TaskOnEvent.dto';

@Injectable()
export class AppTaskService {
  constructor(private readonly db: PrismaService) {}

  // ===================================== board

  // create
  async createBoard(user: IUserJwt, data: CreateBoardDto): Promise<Board> {
    return await this.db.board.create({
      data: {
        name: data.name,
        UserOnBoard: {
          create: {
            type: BoardAccess.ADMIN,
            userId: user.id,
          },
        },
      },
    });
  }

  // update
  async updateBoardName(id: string, data: UpdateBoardDto): Promise<Board> {
    return await this.db.board.update({
      where: {
        id,
      },
      data: {
        name: data.name,
      },
    });
  }

  // add members
  async addMembersToBoard(
    id: string,
    data: ManageMembersRequest[],
  ): Promise<BoardWithUsers> {
    for (const member of data) {
      await this.db.userOnBoard.create({
        data: {
          type: member.type ?? BoardAccess.VIEW,
          userId: member.userId,
          boardId: id,
        },
      });
    }
    return await this.db.board.findUnique({
      where: {
        id,
      },
      include: {
        UserOnBoard: {
          include: {
            User: true,
          },
        },
      },
    });
  }

  // update members
  async updateMembersOnBoard(
    id: string,
    data: ManageMembersRequest[],
  ): Promise<BoardWithUsers> {
    for (const member of data) {
      await this.db.userOnBoard.updateMany({
        where: {
          boardId: id,
          userId: member.userId,
        },
        data: {
          type: member.type,
        },
      });
    }

    return await this.db.board.findUnique({
      where: {
        id,
      },
      include: {
        UserOnBoard: {
          include: {
            User: true,
          },
        },
      },
    });
  }

  // delete members
  async deleteMembersFromBoard(
    id: string,
    data: DeleteMembersRequest[],
  ): Promise<BoardWithUsers> {
    await this.db.userOnBoard.deleteMany({
      where: {
        AND: [
          {
            boardId: id,
          },
          {
            userId: {
              in: data.map((member) => member.userId),
            },
          },
        ],
      },
    });

    return await this.db.board.findUnique({
      where: {
        id,
      },
      include: {
        UserOnBoard: {
          include: {
            User: true,
          },
        },
      },
    });
  }

  // delete
  async deleteBoard(id: string): Promise<Board> {
    return await this.db.board.delete({
      where: {
        id,
      },
    });
  }

  // get
  async getBoard(user: IUserJwt): Promise<BoardWithUsers[]> {
    return await this.db.board.findMany({
      where: {
        UserOnBoard: {
          some: {
            userId: user.id,
          },
        },
      },
      include: {
        UserOnBoard: {
          include: {
            User: true,
          },
        },
      },
    });
  }

  // ===================================== list

  // create
  async createBoardList(data: CreateListDto): Promise<List> {
    return await this.db.list.create({
      data: {
        name: data.name,
        boardId: data.boardId,
      },
    });
  }

  // update
  async updateBoardListName(id: string, data: UpdateListDto): Promise<List> {
    return await this.db.list.update({
      where: {
        id,
      },
      data,
    });
  }

  // delete
  async deleteBoardList(id: string): Promise<List> {
    return await this.db.list.delete({
      where: {
        id,
      },
    });
  }

  // ===================================== task

  // create
  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    return await this.db.task.create({
      data: {
        title: createTaskDto.title,
        priority: createTaskDto.priority,
        dueDate: createTaskDto.dueDate,
        content: createTaskDto.content,
        listId: createTaskDto.listId,
      },
    });
  }

  // get list on a board
  async getListOnBoard(boardId: string): Promise<ListWithTasks> {
    return await this.db.list.findFirst({
      where: {
        boardId,
      },
      include: {
        Tasks: {
          include: {
            FileOnTask: {
              include: {
                File: true,
              },
            },
            TaskOnEvent: {
              include: {
                Event: true,
              },
            },
          },
        },
      },
    });
  }

  // update details
  async updateDetails(taskId: string, data: UpdateTaskDto): Promise<Task> {
    return await this.db.task.update({
      where: {
        id: taskId,
      },
      data,
    });
  }

  // add file
  async addFile(files: ModifyTaskFileDto[]): Promise<FileOnTask[]> {
    await this.db.fileOnTask.createMany({
      data: files.map((file) => ({
        fileId: file.fileId,
        taskId: file.taskId,
      })),
    });

    return await this.db.fileOnTask.findMany({
      where: {
        OR: files.map((file) => ({
          fileId: file.fileId,
          taskId: file.taskId,
        })),
      },
    });
  }

  // delete file
  async deleteFile(files: ModifyTaskFileDto[]): Promise<FileOnTask[]> {
    const filesQ = await this.db.fileOnTask.findMany({
      where: {
        OR: files.map((file) => ({
          fileId: file.fileId,
          taskId: file.taskId,
        })),
      },
    });
    await this.db.fileOnTask.deleteMany({
      where: {
        OR: files.map((file) => ({
          fileId: file.fileId,
          taskId: file.taskId,
        })),
      },
    });

    return filesQ;
  }

  // delete
  async delete(taskId: string): Promise<Task> {
    return await this.db.task.delete({
      where: {
        id: taskId,
      },
    });
  }

  // ===================================== Task on Event Binding

  async bindTaskToEvent(taskOnEvents: TaskOnEvent[]) {
    return await this.db.taskOnEvent.createMany({
      data: taskOnEvents.map((taskOnEvent) => ({
        taskId: taskOnEvent.taskId,
        eventId: taskOnEvent.eventId,
      })),
    });
  }

  async unbindTaskToEvent(taskOnEvents: TaskOnEvent[]) {
    return await this.db.taskOnEvent.deleteMany({
      where: {
        OR: taskOnEvents.map((taskOnEvent) => ({
          taskId: taskOnEvent.taskId,
          eventId: taskOnEvent.eventId,
        })),
      },
    });
  }
}
