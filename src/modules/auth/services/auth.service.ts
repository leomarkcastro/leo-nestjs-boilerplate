import { CONFIG } from '@/config/env';
import { AccessToken_Response } from '@/global/types/JWTAccessToken.dto';
import { Roles } from '@/global/types/Roles.dto';
import { MailBrevoService } from '@/modules/mail-brevo/mail-brevo.service';
import { PrismaService } from '@@/db-prisma/db-prisma.service';
import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync, hashSync } from 'bcrypt';
import { IChangePassword } from '../types/ChangePassword.dto';
import { IResetPasswordJWT } from '../types/ResetPasswordJWT.dto';
import { IUserJwt } from '../types/UserJWT.dto';
import { IUserMe, UpdatableUser } from '../types/UserMe.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly database: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mail: MailBrevoService,
  ) {}

  async validateUserViaPassword(
    email: string,
    password: string,
  ): Promise<IUserJwt | null> {
    const user = await this.database.user.findUnique({
      where: { email },
      include: {
        LocalAuth: true,
      },
    });

    // check if user exists
    if (!user) return null;

    // check if user can login with password
    if (!user.LocalAuth) return null;

    // validate password
    const passHash = user.LocalAuth.password;
    const validate = compareSync(password, passHash);
    if (!validate) return null;

    return {
      id: user.id,
      email: user.email,
    };
  }

  async signToken(user: IUserJwt): Promise<AccessToken_Response> {
    return {
      accessToken: this.jwtService.sign(user),
    };
  }

  async registerUser(
    email: string,
    password: string,
  ): Promise<IUserJwt | null> {
    const hashedPassword = hashSync(password, 10);
    const user = await this.database.user.create({
      data: {
        email,
        LocalAuth: {
          create: {
            password: hashedPassword,
          },
        },
        Role: {
          connect: {
            name: Roles.USER,
          },
        },
      },
    });

    return {
      id: user.id,
      email: user.email,
    };
  }

  async requestResetPassword(email: string) {
    const user = await this.database.user.findUnique({
      where: { email },
    });
    if (!user) return;

    const resetPassword: IResetPasswordJWT = {
      id: user.id,
      email: user.email,
      resetPassword: true,
    };

    const token = this.jwtService.sign(resetPassword, {
      expiresIn: '1h',
    });

    // send email
    await this.mail.sendEmailFromTemplate(
      user.email,
      'Reset Password',
      "Reset Password Request. Ignore this email if you didn't request this.",
      'reset-password.hbs',
      {
        username: user.email,
        time_date: new Date().toLocaleString(),
        reset_url: `${CONFIG.PAGE_URL}${CONFIG.PAGE_RESET_PASSWORD_URL}?token=${token}`,
      },
    );
  }

  async resetPassword(token: string, newPassword: string) {
    const decoded = this.jwtService.decode(token) as IResetPasswordJWT;
    if (!decoded) return;
    if (!decoded.resetPassword) return;

    const hashedPassword = hashSync(newPassword, 10);
    await this.database.user.update({
      where: { id: decoded.id },
      data: {
        LocalAuth: {
          update: {
            password: hashedPassword,
          },
        },
      },
    });
  }

  async getMe(user: IUserJwt): Promise<IUserMe> {
    const userObj = await this.database.user.findUnique({
      where: { id: user.id },
      include: {
        Role: true,
        Department: true,
        Position: true,
      },
    });
    if (!userObj) throw new HttpException('User not found', 404);

    userObj.firstName = userObj.firstName || userObj.email.split('@')[0];

    return {
      id: userObj.id,
      email: userObj.email,
      firstName: userObj.firstName,
      lastName: userObj.lastName,
      fullName: `${userObj.firstName} ${userObj.lastName}`,
      userName: userObj.firstName,
      avatar: userObj.avatar,
      role: userObj.Role?.name,
      address: userObj.address,
      description: userObj.description,
      phone: userObj.phone,
      department: userObj.Department?.name,
      position: userObj.Position?.name,
      name: userObj.firstName,
    };
  }

  async updateMe(
    user: IUserJwt,
    data: Partial<UpdatableUser>,
  ): Promise<IUserMe> {
    await this.database.user.update({
      where: { id: user.id },
      data,
    });

    return await this.getMe(user);
  }

  async changePassword(user: IUserJwt, passwordInput: IChangePassword) {
    const userObj = await this.database.user.findUnique({
      where: { id: user.id },
      include: {
        LocalAuth: true,
      },
    });
    if (!userObj) throw new HttpException('User not found', 404);

    const validate = compareSync(
      passwordInput.oldPassword,
      userObj.LocalAuth.password,
    );
    if (!validate) throw new HttpException('Wrong password', 400);

    const hashedPassword = hashSync(passwordInput.newPassword, 10);
    await this.database.localAuth.update({
      where: { id: userObj.LocalAuth.id },
      data: {
        password: hashedPassword,
      },
    });
  }
}
