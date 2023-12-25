import { CONFIG } from '@/config/env';
import { AccessToken_Response } from '@/global/types/JWTAccessToken.dto';
import { MailBrevoService } from '@/modules/mail-brevo/mail-brevo.service';
import { PrismaService } from '@@/db-prisma/db-prisma.service';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync, hashSync } from 'bcrypt';
import { IResetPasswordJWT } from '../types/ResetPasswordJWT.dto';
import { IUserJwt } from '../types/UserJWT.dto';

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
}
