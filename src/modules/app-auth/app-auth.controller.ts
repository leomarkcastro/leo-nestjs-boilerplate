import { Auth } from '@/global/decorators/Auth.decorator';
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
import { IUserJwt } from '../auth/types/UserJWT.dto';
import { SimplePermit } from '../permit/guard/permit.constants';
import { PERMISSIONS } from '../permit/permissions.types';
import { LoginUser_Request } from './dto/LoginRequest.dto';
import { RegisterUser_Request } from './dto/RegisterRequest.dto';
import { ResetPasswordUser_Request } from './dto/ResetPasswordRequest.dto';
import { StartResetPasswordUser_Request } from './dto/StartResetPasswordRequest.dto';

@Controller('auth')
@ApiTags('auth')
export class AppAuthController {
  constructor(private authService: AuthService) {}

  @SimplePermit(PERMISSIONS.AUTH.LOGIN)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({ type: LoginUser_Request })
  async login(@Request() req): Promise<AccessToken_Response> {
    return this.authService.signToken(req.user);
  }

  @SimplePermit(PERMISSIONS.AUTH.REGISTER)
  @Post('register')
  async register(
    @Body() body: RegisterUser_Request,
  ): Promise<AccessToken_Response> {
    const user = await this.authService.registerUser(body.email, body.password);
    return this.authService.signToken(user);
  }

  @Get('me')
  @Auth()
  @ApiResponse({ status: 200, type: IUserJwt })
  async me(@Request() req) {
    return req.user;
  }

  @SimplePermit(PERMISSIONS.AUTH.RESET_PASSWORD)
  @Post('request-reset')
  @ApiResponse({ status: 200 })
  async requestResetPassword(@Body() body: StartResetPasswordUser_Request) {
    await this.authService.requestResetPassword(body.email);
    return 'OK';
  }

  @SimplePermit(PERMISSIONS.AUTH.RESET_PASSWORD)
  @Post('reset-password')
  @ApiResponse({ status: 200 })
  async resetPassword(@Body() body: ResetPasswordUser_Request) {
    await this.authService.resetPassword(body.token, body.password);
    return 'OK';
  }
}
