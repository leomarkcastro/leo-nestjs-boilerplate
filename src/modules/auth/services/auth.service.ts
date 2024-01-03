import { CONFIG } from '@/config/env';
import { AuthResponse } from '@/global/types/AuthResponse.dto';
import { Roles } from '@/global/types/Roles.dto';
import { MailBrevoService } from '@/modules/mail-brevo/mail-brevo.service';
import { PrismaService } from '@@/db-prisma/db-prisma.service';
import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compareSync, hashSync } from 'bcrypt';
import { IChangePassword } from '../types/ChangePassword.dto';
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
      type: 'auth',
      id: user.id,
      email: user.email,
    };
  }

  async signToken(user: IUserJwt): Promise<AuthResponse> {
    return {
      type: 'JWT',
      jwt: {
        accessToken: this.jwtService.sign(user),
      },
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
      type: 'auth',
      id: user.id,
      email: user.email,
    };
  }

  async newAccountResetPassword(email: string) {
    const user = await this.database.user.findUnique({
      where: { email },
    });
    if (!user) return;

    const resetPassword: IUserJwt = {
      id: user.id,
      email: user.email,
      type: 'reset-password',
    };

    const token = this.jwtService.sign(resetPassword, {
      expiresIn: '3d',
    });

    // send email
    await this.mail.sendEmailFromTemplate(
      user.email,
      'New Account Setup',
      'Welcome to BDB Portal. Click the button below to start setting the password for your account.',
      'new-account.hbs',
      {
        username: user.email,
        reset_url: `${CONFIG.PAGE_URL}${CONFIG.NEW_ACCOUNT_URL}?token=${token}`,
      },
    );
  }

  async requestResetPassword(email: string) {
    const user = await this.database.user.findUnique({
      where: { email },
    });
    if (!user) return;

    const resetPassword: IUserJwt = {
      id: user.id,
      email: user.email,
      type: 'reset-password',
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
    const decoded = this.jwtService.decode(token) as IUserJwt;
    if (!decoded) return;
    if (decoded.type !== 'reset-password') return;

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
      fullName: `${userObj.firstName ?? ''}${userObj.lastName ? ' ' : ''}${
        userObj.lastName ?? ''
      }`,
      userName: userObj.firstName,
      avatar: userObj.avatar,
      role: userObj.Role?.name,
      roleId: userObj.Role?.id,
      address: userObj.address,
      description: userObj.description,
      phone: userObj.phone,
      department: userObj.Department?.name,
      departmentId: userObj.Department?.id,
      position: userObj.Position?.name,
      positionId: userObj.Position?.id,
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

  async check2FAEmail(user: IUserJwt): Promise<boolean> {
    const userObj = await this.database.localAuth.findUnique({
      where: {
        userId: user.id,
      },
    });
    if (!userObj) throw new HttpException('User not found', 404);

    return !!userObj.twofaEmail;
  }

  async send2FAEmail(user: IUserJwt): Promise<AuthResponse> {
    const is2FAEmail = await this.check2FAEmail(user);

    if (!is2FAEmail) {
      throw new HttpException('2FA Email not set for current user', 400);
    }

    const localAuth = await this.database.localAuth.findUnique({
      where: {
        userId: user.id,
      },
    });

    // check if code was sent in the last 5 minutes
    const now = new Date();
    const lastSent = localAuth.twofaEmailLastSent || new Date(0);
    const diff = now.getTime() - lastSent.getTime();
    console.log(
      diff,
      Number(CONFIG.TWOFA_EMAIL_EXPIRY_TIME),
      now.getTime(),
      lastSent.getTime(),
    );
    if (diff > Number(CONFIG.TWOFA_EMAIL_EXPIRY_TIME)) {
      // generate 2fa code
      const code = Math.floor(100000 + Math.random() * 900000);
      const codeHash = hashSync(code.toString(), 10);

      // save code to database
      await this.database.localAuth.update({
        where: {
          userId: user.id,
        },
        data: {
          twofaEmailSecret: codeHash,
          twofaEmailLastSent: new Date(),
        },
      });

      // send email
      await this.mail.sendEmailFromTemplate(
        user.email,
        '2FA Login',
        "2FA Login Attempt. Ignore this email if you didn't request this.",
        '2fa-email-login.hbs',
        {
          code: code.toString(),
        },
      );
    }

    const tokenPayload = {
      id: user.id,
      email: user.email,
    };

    const token = this.jwtService.sign(tokenPayload, {
      expiresIn: '1h',
    });

    return {
      type: '2FA_Email',
      twoFactorEmail: {
        token,
      },
    };
  }

  async verify2FAEmail(token: string, code: string): Promise<IUserJwt | null> {
    const decoded = this.jwtService.decode(token) as IUserJwt;
    if (!decoded) throw new HttpException('Invalid token', 400);

    const userObj = await this.database.localAuth.findUnique({
      where: {
        userId: decoded.id,
      },
    });
    if (!userObj) throw new HttpException('User not found', 404);

    // check if code is valid
    const validate = compareSync(code, userObj.twofaEmailSecret);
    if (!validate) throw new HttpException('Invalid code', 400);

    // check if code is expired
    const now = new Date();
    const lastSent = userObj.twofaEmailLastSent;
    const diff = now.getTime() - lastSent.getTime();
    if (diff > Number(CONFIG.TWOFA_EMAIL_EXPIRY_TIME))
      throw new HttpException('Code expired', 400);

    return {
      type: 'auth',
      id: decoded.id,
      email: decoded.email,
    };
  }
}
