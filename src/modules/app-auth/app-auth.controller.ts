import { Auth } from '@/global/decorators/Auth.decorator';
import { CurrentUser } from '@/global/decorators/CurrentUser.decorator';
import { WithPermission } from '@/global/decorators/Permissions.decorator';
import { UserFlags } from '@/global/prisma-classes/user_flags';
import { AuthResponse } from '@/global/types/AuthResponse.dto';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TwoFAEMailAuthGuard } from '../auth/guard/2fa_email.guard';
import { LocalAuthGuard } from '../auth/guard/local.guard';
import { AuthService } from '../auth/services/auth.service';
import { IChangePassword } from '../auth/types/ChangePassword.dto';
import { PartialUserFlag, UserFlag } from '../auth/types/UserFlag.dto';
import { IUserJwt } from '../auth/types/UserJWT.dto';
import { IUserMe, PartialUpdatableUser } from '../auth/types/UserMe.dto';
import { PERMISSIONS } from '../permit/permissions.types';
import { UsedKeysType } from '../used-keys/used-keys-types';
import { UsedKeysService } from '../used-keys/used-keys.service';
import { LoginUser_Request } from './dto/LoginRequest.dto';
import { RegisterUser_Request } from './dto/RegisterRequest.dto';
import { ResetPasswordUser_Request } from './dto/ResetPasswordRequest.dto';
import { StartResetPasswordUser_Request } from './dto/StartResetPasswordRequest.dto';

@Controller('auth')
@ApiTags('auth')
export class AppAuthController {
  constructor(
    private authService: AuthService,
    private usedKeys: UsedKeysService,
  ) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @WithPermission([PERMISSIONS.AUTH.LOGIN])
  @ApiBody({ type: LoginUser_Request })
  async auth_login(@Request() req): Promise<AuthResponse> {
    // check if user has 2fa enabled
    if (await this.authService.check2FAEmail(req.user)) {
      return this.authService.send2FAEmail(req.user);
    }

    return this.authService.signToken(req.user);
  }

  @Post('twofa')
  @UseGuards(TwoFAEMailAuthGuard)
  @WithPermission([PERMISSIONS.AUTH.LOGIN])
  @ApiBody({ type: LoginUser_Request })
  async auth_login_twofa(@Request() req): Promise<AuthResponse> {
    return this.authService.signToken(req.user);
  }

  @Post('register')
  @WithPermission([PERMISSIONS.AUTH.REGISTER])
  async auth_register(
    @Body() body: RegisterUser_Request,
  ): Promise<AuthResponse> {
    const user = await this.authService.registerUser(body.email, body.password);

    // check if user has 2fa enabled
    if (await this.authService.check2FAEmail(user)) {
      return this.authService.send2FAEmail(user);
    }

    return this.authService.signToken(user);
  }

  @Get('me')
  @WithPermission([PERMISSIONS.AUTH.ME])
  @Auth()
  async auth_getMe(@CurrentUser() user: IUserJwt): Promise<IUserMe> {
    return await this.authService.getMe(user);
  }

  @Post('request-reset')
  @ApiResponse({ status: 201 })
  @WithPermission([PERMISSIONS.AUTH.RESET_PASSWORD])
  async auth_requestResetPassword(
    @Body() body: StartResetPasswordUser_Request,
  ) {
    await this.authService.requestResetPassword(body.email);
    return 'OK';
  }

  @Post('request-auth-reset')
  @ApiResponse({ status: 201 })
  @WithPermission([PERMISSIONS.AUTH.RESET_PASSWORD])
  @Auth()
  async auth_requestAuthedResetPassword(
    @Body() body: StartResetPasswordUser_Request,
  ) {
    await this.authService.requestResetPassword(body.email, '3d');
    return 'OK';
  }

  @WithPermission([PERMISSIONS.AUTH.RESET_PASSWORD])
  @Post('reset-password')
  @ApiResponse({ status: 201 })
  async auth_resetPassword(@Body() body: ResetPasswordUser_Request) {
    await this.usedKeys.exists(
      {
        type: UsedKeysType.resetPassword,
        token: body.token,
      },
      {
        throwOnExists: true,
        throwErrorMsg: 'Token is invalid or expired',
      },
    );
    await this.authService.resetPassword(body.token, body.password);
    await this.usedKeys.add({
      type: UsedKeysType.resetPassword,
      token: body.token,
    });
    return 'OK';
  }

  @Post('update')
  @WithPermission([PERMISSIONS.AUTH.UPDATEME])
  @Auth()
  async auth_update(
    @CurrentUser() user: IUserJwt,
    @Body() update: PartialUpdatableUser,
  ): Promise<IUserMe> {
    return await this.authService.updateMe(user, update);
  }

  @Get('flag/:flag')
  @WithPermission([PERMISSIONS.AUTH.UPDATEME])
  @Auth()
  async auth_getFlag(
    @CurrentUser() user: IUserJwt,
    @Param('flag') flag: string,
  ): Promise<UserFlags> {
    return await this.authService.getUserFlag(user, flag);
  }

  @Post('flag/set/:flag')
  @WithPermission([PERMISSIONS.AUTH.UPDATEME])
  @Auth()
  async auth_setFlag(
    @CurrentUser() user: IUserJwt,
    @Param('flag') flag: string,
    @Body() data: UserFlag,
  ): Promise<UserFlags> {
    return await this.authService.createUserFlag(user, flag, data);
  }

  @Post('flag/update/:flag')
  @WithPermission([PERMISSIONS.AUTH.UPDATEME])
  @Auth()
  async auth_updateFlag(
    @CurrentUser() user: IUserJwt,
    @Param('flag') flag: string,
    @Body() update: PartialUserFlag,
  ): Promise<UserFlags> {
    return await this.authService.updateUserFlag(user, flag, update);
  }

  @Post('change-password')
  @WithPermission([PERMISSIONS.AUTH.CHANGE_PASSWORD])
  @Auth()
  @ApiResponse({ status: 201 })
  async auth_changePassword(
    @CurrentUser() user: IUserJwt,
    @Body() update: IChangePassword,
  ) {
    await this.authService.changePassword(user, update);
    return 'OK';
  }

  @Post('logout')
  @Auth()
  @ApiResponse({ status: 201 })
  async auth_logout(@CurrentUser() user: IUserJwt) {
    await this.authService.logout(user);
    return 'OK';
  }
}
