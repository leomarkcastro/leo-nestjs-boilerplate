import { Auth } from '@/global/decorators/Auth.decorator';
import { CurrentUser } from '@/global/decorators/CurrentUser.decorator';
import { WithPermission } from '@/global/decorators/Permissions.decorator';
import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IUserJwt } from '../auth/types/UserJWT.dto';
import { PrismaService } from '../db-prisma/db-prisma.service';
import {
  IF_RESOURCE_EXIST,
  THROW_ON_RESOURCE_NOT_FOUND,
} from '../permit/guard/permit.constants';
import { PERMISSIONS } from '../permit/permissions.types';
import { PermitService } from '../permit/permit.service';
import { AppTaskService } from './app-task.service';
import { BoardAccess, ManageMembersListRequest } from './dto/BoardAccess.dto';
import { CreateBoardDto, UpdateBoardDto } from './dto/CreateBoard.dto';
import { CreateListDto, UpdateListDto } from './dto/CreateList.dto';
import {
  CreateTaskDto,
  ModifyTaskFileListDto,
  UpdateTaskDto,
} from './dto/CreateTask.dto';
import { UpdateTaskOnEventDto } from './dto/TaskOnEvent.dto';

@Controller('task')
@ApiTags('task')
export class AppTaskController {
  constructor(
    private readonly db: PrismaService,
    private readonly permit: PermitService,
    private readonly service: AppTaskService,
  ) {}

  // ===================================== board
  // create
  @Post('board/create')
  @WithPermission([PERMISSIONS.TASK.BOARD.CREATE])
  @Auth()
  async task_board_create(
    @CurrentUser() user: IUserJwt,
    @Body() data: CreateBoardDto,
  ) {
    return await this.service.createBoard(user, data);
  }

  async checkBoardAdmin(user: IUserJwt, id: string) {
    return await this.permit.checkPermit(
      user,
      await (() => {
        return this.db.userOnBoard.findUnique({
          where: {
            userId_boardId_type: {
              boardId: id,
              userId: user.id,
              type: BoardAccess.ADMIN,
            },
          },
        });
      })(),
      IF_RESOURCE_EXIST,
      THROW_ON_RESOURCE_NOT_FOUND,
    );
  }

  // update
  @Post('board/update/:id')
  @WithPermission([PERMISSIONS.TASK.BOARD.UPDATE])
  @Auth()
  async task_board_update(
    @CurrentUser() user: IUserJwt,
    @Param('id') id: string,
    @Body() data: UpdateBoardDto,
  ) {
    await this.checkBoardAdmin(user, id);
    return await this.service.updateBoardName(id, data);
  }

  // add members
  @Post('board/add-members/:id')
  @WithPermission([PERMISSIONS.TASK.BOARD.ADD_MEMBERS])
  @Auth()
  async task_board_addMembers(
    @CurrentUser() user: IUserJwt,
    @Param('id') id: string,
    @Body() data: ManageMembersListRequest,
  ) {
    await this.checkBoardAdmin(user, id);
    return await this.service.addMembersToBoard(id, data.members);
  }

  // modify members
  @Post('board/modify-members/:id')
  @WithPermission([PERMISSIONS.TASK.BOARD.MODIFY_MEMBERS])
  @Auth()
  async task_board_modifyMembers(
    @CurrentUser() user: IUserJwt,
    @Param('id') id: string,
    @Body() data: ManageMembersListRequest,
  ) {
    await this.checkBoardAdmin(user, id);
    return await this.service.updateMembersOnBoard(id, data.members);
  }

  // delete members
  @Post('board/delete-members/:id')
  @WithPermission([PERMISSIONS.TASK.BOARD.DELETE_MEMBERS])
  @Auth()
  async task_board_deleteMembers(
    @CurrentUser() user: IUserJwt,
    @Param('id') id: string,
    @Body() data: ManageMembersListRequest,
  ) {
    await this.checkBoardAdmin(user, id);
    return await this.service.deleteMembersFromBoard(id, data.members);
  }

  // delete
  @Post('board/delete/:id')
  @WithPermission([PERMISSIONS.TASK.BOARD.DELETE])
  @Auth()
  async task_board_delete(
    @CurrentUser() user: IUserJwt,
    @Param('id') id: string,
  ) {
    await this.checkBoardAdmin(user, id);
    return await this.service.deleteBoard(id);
  }

  // get
  @Post('board/get')
  @WithPermission([PERMISSIONS.TASK.BOARD.GET])
  @Auth()
  async task_board_getList(@CurrentUser() user: IUserJwt) {
    return await this.service.getBoard(user);
  }

  // ===================================== list

  async checkListMemberByBoard(
    user: IUserJwt,
    boardId: string,
    includeView = false,
  ) {
    return await this.permit.checkPermit(
      user,
      await (async () => {
        const fetch = await this.db.userOnBoard.findUnique({
          where: {
            userId_boardId: {
              boardId: boardId,
              userId: user.id,
            },
          },
        });
        if (!fetch) return null;
        if (fetch.type === BoardAccess.ADMIN) return fetch;
        if (fetch.type === BoardAccess.EDIT) return fetch;

        return includeView ? fetch : null;
      })(),
      IF_RESOURCE_EXIST,
      THROW_ON_RESOURCE_NOT_FOUND,
    );
  }

  async checkListMemberByList(user: IUserJwt, listId, includeView = false) {
    return await this.permit.checkPermit(
      user,
      await (async () => {
        const taskObj = await this.db.list.findUnique({
          where: {
            id: listId,
          },
        });
        if (!taskObj) return null;
        const fetch = await this.db.userOnBoard.findUnique({
          where: {
            userId_boardId: {
              boardId: taskObj.boardId,
              userId: user.id,
            },
          },
        });
        if (!fetch) return null;
        if (fetch.type === BoardAccess.ADMIN) return fetch;
        if (fetch.type === BoardAccess.EDIT) return fetch;

        return includeView ? fetch : null;
      })(),
      IF_RESOURCE_EXIST,
      THROW_ON_RESOURCE_NOT_FOUND,
    );
  }

  async checkListMemberByTask(user: IUserJwt, taskId) {
    return await this.permit.checkPermit(
      user,
      await (async () => {
        const taskObj = await this.db.task.findUnique({
          where: {
            id: taskId,
          },
          include: {
            List: true,
          },
        });
        if (!taskObj) return null;
        const fetch = await this.db.userOnBoard.findUnique({
          where: {
            userId_boardId: {
              boardId: taskObj.List.boardId,
              userId: user.id,
            },
          },
        });
        if (!fetch) return null;
        if (fetch.type === BoardAccess.ADMIN) return fetch;
        if (fetch.type === BoardAccess.EDIT) return fetch;

        return null;
      })(),
      IF_RESOURCE_EXIST,
      THROW_ON_RESOURCE_NOT_FOUND,
    );
  }

  // create
  @Post('list/create')
  @WithPermission([PERMISSIONS.TASK.LIST.CREATE])
  @Auth()
  async task_list_create(
    @CurrentUser() user: IUserJwt,
    @Body() data: CreateListDto,
  ) {
    await this.checkListMemberByBoard(user, data.boardId);
    return await this.service.createBoardList(data);
  }

  // update
  @Post('list/update/:id')
  @WithPermission([PERMISSIONS.TASK.LIST.UPDATE])
  @Auth()
  async task_list_update(
    @CurrentUser() user: IUserJwt,
    @Param('id') id: string,
    @Body() data: UpdateListDto,
  ) {
    await this.checkListMemberByList(user, id);
    return await this.service.updateBoardListName(id, data);
  }

  // delete
  @Post('list/delete/:id')
  @WithPermission([PERMISSIONS.TASK.LIST.DELETE])
  @Auth()
  async task_list_delete(
    @CurrentUser() user: IUserJwt,
    @Param('id') id: string,
  ) {
    await this.checkListMemberByList(user, id);
    return await this.service.deleteBoardList(id);
  }

  // get list on a board
  @Post('get/:id')
  @WithPermission([PERMISSIONS.TASK.LIST.GET])
  @Auth()
  async task_list_getDetailedList(
    @CurrentUser() user: IUserJwt,
    @Param('id') id: string,
  ) {
    await this.checkListMemberByBoard(user, id, true);
    return await this.service.getListOnBoard(id);
  }

  // ===================================== task

  // create
  @Post('create')
  @WithPermission([PERMISSIONS.TASK.TASK.CREATE])
  @Auth()
  async task_create(
    @CurrentUser() user: IUserJwt,
    @Body() data: CreateTaskDto,
  ) {
    await this.checkListMemberByList(user, data.listId);
    return await this.service.create(data);
  }

  // update details
  @Post('update/:id')
  @WithPermission([PERMISSIONS.TASK.TASK.UPDATE])
  @Auth()
  async task_update(
    @CurrentUser() user: IUserJwt,
    @Param('id') id: string,
    @Body() data: UpdateTaskDto,
  ) {
    await this.checkListMemberByTask(user, id);
    return await this.service.updateDetails(id, data);
  }

  // add file
  @Post('add-file/:id')
  @WithPermission([PERMISSIONS.TASK.TASK.ADD_FILE])
  @Auth()
  async task_addFile(
    @CurrentUser() user: IUserJwt,
    @Param('id') id: string,
    @Body() files: ModifyTaskFileListDto,
  ) {
    await this.checkListMemberByTask(user, id);
    return await this.service.addFile(files.files);
  }

  // delete file
  @Post('delete-file/:id')
  @WithPermission([PERMISSIONS.TASK.TASK.DELETE_FILE])
  @Auth()
  async task_removeFile(
    @CurrentUser() user: IUserJwt,
    @Param('id') id: string,
    @Body() files: ModifyTaskFileListDto,
  ) {
    await this.checkListMemberByTask(user, id);
    return await this.service.deleteFile(files.files);
  }

  // delete
  @Post('delete/:id')
  @WithPermission([PERMISSIONS.TASK.TASK.DELETE])
  @Auth()
  async task_delete(@CurrentUser() user: IUserJwt, @Param('id') id: string) {
    await this.checkListMemberByTask(user, id);
    return await this.service.delete(id);
  }

  // ===================================== task event bind

  // bind
  @Post('bind')
  @WithPermission([PERMISSIONS.TASK.TASK.UPDATE])
  @Auth()
  async task_bind(
    @CurrentUser() user: IUserJwt,
    @Body() data: UpdateTaskOnEventDto,
  ) {
    for (const task of data.toBind) {
      await this.checkListMemberByTask(user, task.taskId);
    }
    return await this.service.bindTaskToEvent(data.toBind);
  }

  // unbind
  @Post('unbind')
  @WithPermission([PERMISSIONS.TASK.TASK.UPDATE])
  @Auth()
  async task_unbind(
    @CurrentUser() user: IUserJwt,
    @Body() data: UpdateTaskOnEventDto,
  ) {
    for (const task of data.toBind) {
      await this.checkListMemberByTask(user, task.taskId);
    }
    return await this.service.unbindTaskToEvent(data.toBind);
  }
}
