import { Auth } from '@/global/decorators/Auth.decorator';
import { CurrentUser } from '@/global/decorators/CurrentUser.decorator';
import { WithPermission } from '@/global/decorators/Permissions.decorator';
import { AccessToken_Response } from '@/global/types/JWTAccessToken.dto';
import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from '../auth/guard/local.guard';
import { AuthService } from '../auth/services/auth.service';
import { IChangePassword } from '../auth/types/ChangePassword.dto';
import { IUserJwt } from '../auth/types/UserJWT.dto';
import { IUserMe, PartialUpdatableUser } from '../auth/types/UserMe.dto';
import { PERMISSIONS } from '../permit/permissions.types';
import { LoginUser_Request } from './dto/LoginRequest.dto';
import { RegisterUser_Request } from './dto/RegisterRequest.dto';
import { ResetPasswordUser_Request } from './dto/ResetPasswordRequest.dto';
import { StartResetPasswordUser_Request } from './dto/StartResetPasswordRequest.dto';

@Controller('auth')
@ApiTags('auth')
export class AppAuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @WithPermission([PERMISSIONS.AUTH.LOGIN])
  @ApiBody({ type: LoginUser_Request })
  async login(@Request() req): Promise<AccessToken_Response> {
    return this.authService.signToken(req.user);
  }

  @Post('register')
  @WithPermission([PERMISSIONS.AUTH.REGISTER])
  async register(
    @Body() body: RegisterUser_Request,
  ): Promise<AccessToken_Response> {
    const user = await this.authService.registerUser(body.email, body.password);
    return this.authService.signToken(user);
  }

  @Get('me')
  @WithPermission([PERMISSIONS.AUTH.ME])
  @Auth()
  async me(@CurrentUser() user: IUserJwt): Promise<IUserMe> {
    return await this.authService.getMe(user);
  }

  @Post('request-reset')
  @ApiResponse({ status: 200 })
  @WithPermission([PERMISSIONS.AUTH.RESET_PASSWORD])
  async requestResetPassword(@Body() body: StartResetPasswordUser_Request) {
    await this.authService.requestResetPassword(body.email);
    return 'OK';
  }

  @WithPermission([PERMISSIONS.AUTH.RESET_PASSWORD])
  @Post('reset-password')
  @ApiResponse({ status: 200 })
  async resetPassword(@Body() body: ResetPasswordUser_Request) {
    await this.authService.resetPassword(body.token, body.password);
    return 'OK';
  }

  @Post('update')
  @WithPermission([PERMISSIONS.AUTH.UPDATEME])
  @Auth()
  async update(
    @CurrentUser() user: IUserJwt,
    @Body() update: PartialUpdatableUser,
  ): Promise<IUserMe> {
    return await this.authService.updateMe(user, update);
  }

  @Post('change-password')
  @WithPermission([PERMISSIONS.AUTH.CHANGE_PASSWORD])
  @Auth()
  @ApiResponse({ status: 200 })
  async changePassword(
    @CurrentUser() user: IUserJwt,
    @Body() update: IChangePassword,
  ) {
    await this.authService.changePassword(user, update);
    return 'OK';
  }
}
